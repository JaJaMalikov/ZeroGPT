const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const ZeroGPTClient = require('./zerogptClient');

const app = express();
const client = new ZeroGPTClient();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/message', async (req, res) => {
    const {message} = req.body;
    try{
        const response = await client.sendMessage(message);
        res.json({response});
    }catch(err){
        console.error(err);
        res.status(500).json({error: 'Failed to get response'});
    }
});

app.post('/api/save', (req, res) => {
    const {text} = req.body;
    const file = path.join(__dirname, 'saved_responses.json');
    let data = [];
    if(fs.existsSync(file)){
        data = JSON.parse(fs.readFileSync(file, 'utf8'));
    }
    data.push({text, timestamp: Date.now()});
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    res.json({status: 'ok'});
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
