# Chat Application with ZeroGPT

This directory contains a simple Node.js/Express.js web chat that uses the Python `zerogpt` library to generate responses.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the server:
   ```bash
   node index.js
   ```
3. Open `http://localhost:3000` in your browser.

## Save feature

Each message from the bot includes a **Sauvegarder** button. Clicking it stores the text in `saved_messages.json` on the server.
