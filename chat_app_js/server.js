const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

async function getServerTime(url = 'https://goldfish-app-fojmb.ondigitalocean.app') {
    try {
        const start = Date.now();
        const res = await fetch(url);
        const end = Date.now();
        const serverDate = res.headers.get('date');
        if (serverDate) {
            const dt = new Date(serverDate);
            const serverTimestamp = Math.floor(dt.getTime() / 1000);
            const networkDelay = Math.max(0, end - start) / 1000;
            const bufferSeconds = 2;
            return serverTimestamp + networkDelay + bufferSeconds;
        }
    } catch (e) {
        console.error('[!] Error getting server time:', e);
    }
    return Math.floor(Date.now() / 1000) + 2;
}

function serializeJsonConsistently(data) {
    return JSON.stringify(data);
}

async function generateHeaders(data) {
    const secretKey = 'your-super-secret-key-replace-in-production';
    const timestamp = String(await getServerTime());
    const payloadJson = serializeJsonConsistently(data);
    const message = timestamp + payloadJson;
    const signature = crypto.createHmac('sha256', secretKey).update(message).digest('hex');
    return {
        'X-API-Key': '62852b00cb9e44bca86f0ec7e7455dc6',
        'X-Timestamp': timestamp,
        'X-Signature': signature,
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Origin': 'https://www.aiuncensored.info',
        'Referer': 'https://www.aiuncensored.info/',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 4.4.2; Nexus 4 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.114 Mobile Safari/537.36'
    };
}

async function sendMessage(messages) {
    const payload = {
        messages: messages,
        model: 'deepseek-ai/DeepSeek-V3-0324',
        stream: true
    };
    const headers = await generateHeaders(payload);
    const res = await fetch('https://goldfish-app-fojmb.ondigitalocean.app//api/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
    });
    let text = await res.text();
    let message = '';
    text.split('\n').forEach(line => {
        line = line.trim();
        if (line.startsWith('data: ')) {
            const dataLine = line.slice(6);
            if (dataLine === '[DONE]') return;
            try {
                const jsonData = JSON.parse(dataLine);
                message += jsonData.data || '';
            } catch(e) {}
        }
    });
    return message;
}

app.post('/api/chat', async (req, res) => {
    const { message, history = [] } = req.body;
    const messages = history.concat({ role: 'user', content: message });
    try {
        const reply = await sendMessage(messages);
        res.json({ reply });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to fetch response' });
    }
});

app.post('/api/save', (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'No text' });
    const file = path.join(__dirname, 'saved_responses.txt');
    fs.appendFile(file, text + '\n', err => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to save' });
        } else {
            res.json({ success: true });
        }
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
