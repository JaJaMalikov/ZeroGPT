const express = require('express');
const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/chat', (req, res) => {
  const message = req.body.message;
  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }
  const pythonPath = 'python3';
  const scriptPath = path.join(__dirname, 'send_message.py');
  execFile(pythonPath, [scriptPath, message], { cwd: path.join(__dirname, '..') }, (error, stdout, stderr) => {
    if (error) {
      console.error('Error:', error, stderr);
      return res.status(500).json({ error: 'Python error' });
    }
    return res.json({ response: stdout.trim() });
  });
});

app.post('/api/save', (req, res) => {
  const text = req.body.text;
  if (!text) {
    return res.status(400).json({ error: 'No text provided' });
  }
  const file = path.join(__dirname, 'saved_responses.json');
  let data = [];
  if (fs.existsSync(file)) {
    try {
      data = JSON.parse(fs.readFileSync(file));
    } catch (e) {
      data = [];
    }
  }
  data.push({ text, date: new Date().toISOString() });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
