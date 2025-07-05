const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const ZeroGPTClient = require('./zerogptClient');

const app = express();
const client = new ZeroGPTClient();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }
  try {
    const response = await client.sendMessage(message);
    res.json({ response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error contacting ZeroGPT' });
  }
});

app.post('/save', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'No text provided' });
  }
  const file = path.join(__dirname, 'saved_responses.json');
  let data = [];
  if (fs.existsSync(file)) {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  }
  data.push({ text, timestamp: new Date().toISOString() });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  res.json({ status: 'saved' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
