const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/api/message', (req, res) => {
  const message = req.body.message;
  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }
  const py = spawn('python3', [path.join(__dirname, 'chat_bot.py'), message]);

  let data = '';
  py.stdout.on('data', chunk => { data += chunk; });
  py.stderr.on('data', err => console.error('python error:', err.toString()));
  py.on('close', code => {
    res.json({ response: data.trim() });
  });
});

app.post('/api/save', (req, res) => {
  const text = req.body.text;
  if (!text) {
    return res.status(400).json({ error: 'No text provided' });
  }
  const file = path.join(__dirname, 'saved_responses.txt');
  fs.appendFile(file, text + '\n', err => {
    if (err) {
      return res.status(500).json({ error: 'Failed to save' });
    }
    res.json({ status: 'saved' });
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

