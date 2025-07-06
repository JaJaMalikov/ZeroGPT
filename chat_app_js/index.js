const express = require('express');
const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/send', (req, res) => {
  const message = req.body.message || '';
  const python = execFile('python3', [path.join(__dirname, 'zerogpt_bridge.py'), message], { encoding: 'utf8' }, (err, stdout, stderr) => {
    if (err) {
      console.error(stderr);
      return res.status(500).json({ error: 'python error' });
    }
    try {
      const data = JSON.parse(stdout.trim());
      res.json(data);
    } catch (e) {
      console.error('Parse error:', stdout);
      res.status(500).json({ error: 'invalid response' });
    }
  });
});

app.post('/api/save', (req, res) => {
  const text = req.body.text || '';
  const file = path.join(__dirname, 'saved_messages.json');
  let arr = [];
  if (fs.existsSync(file)) {
    arr = JSON.parse(fs.readFileSync(file));
  }
  arr.push({ text, date: new Date().toISOString() });
  fs.writeFileSync(file, JSON.stringify(arr, null, 2));
  res.json({ status: 'ok' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
