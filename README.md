# 🤖 ZeroGPT

<div align="center">

[![Version](https://img.shields.io/badge/version-1.3.0-blue.svg?style=for-the-badge)](https://github.com/username/project/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge)](LICENSE)
![Status](https://img.shields.io/badge/status-active-success.svg?style=for-the-badge)
![Stage](https://img.shields.io/badge/stage-alpha-red.svg?style=for-the-badge)

<a href="https://red-3.gitbook.io/zerogpt/">
  <img src="https://img.shields.io/badge/docs-ZeroGPT-blue?style=for-the-badge&logo=gitbook" alt="Documentation">
</a>

<br><br>

<a href="https://ko-fi.com/redpiar" target="_blank">
  <img src="https://ko-fi.com/img/githubbutton_sm.svg" alt="Buy Me a Coffee on Ko-fi" />
</a>

</div>

---

## 📚 ZeroGPT Mini Docs

**ZeroGPT** is a Python library for interacting with AI APIs, providing capabilities for text and image generation.

---

## ✨ Features

<div align="center">

| Feature | Description |
|---------|-------------|
| 💬 **Text Generation** | Various models for diverse text outputs |
| 🎨 **Image Creation** | Generate images from textual descriptions |
| 🔓 **Uncensored Mode** | More unrestricted response capabilities |
| ⚡ **Optimized Performance** | Memory and data handling optimization |
| 📡 **Stream Support** | Real-time streamed data processing |
| 🔐 **Secure Authentication** | HMAC-SHA256 request signing |

</div>

---

## 🚀 Installation

```bash
pip install zerogpt
```

---

## 🛠️ Usage

### 🔧 Client Initialization

```python
from zerogpt import Client
client = Client()
```

### 💬 Text Generation

<details>
<summary><b>📝 Simple Text Generation</b></summary>

```python
# Simple request
response = client.send_message("Hi, how are you?")
```

</details>

<details>
<summary><b>📋 Text Generation with Instructions</b></summary>

```python
# Request with instruction
response = client.send_message(
    "Tell me about space",
    instruction="You are an astronomy expert"
)
```

</details>

<details>
<summary><b>🔓 Uncensored Mode</b></summary>

```python
# Using "uncensored" mode
response = client.send_message(
    "Explain a complex topic",
    uncensored=True
)
```

</details>

<details>
<summary><b>🧠 Think Mode (Deep Reasoning)</b></summary>

```python
# Using "think" mode (deeper reasoning)
response = client.send_message(
    "Solve a difficult math problem",
    think=True
)
```

</details>

<details>
<summary><b>💭 Contextual Conversations</b></summary>

```python
# With context
messages=[
    {"role": "user", "content": "Hi"},
    {"role": "assistant", "content": "Hello!"}
]
response = client.send_message(
    messages,
    think=True
)
```

</details>

### 🎨 Image Generation

<details>
<summary><b>🖼️ Create Images</b></summary>

```python
# Create image
result = client.create_image(
    prompt="anime neko girl",
    samples=1,
    resolution=(768, 512),
    seed=-1,
    steps=50
)
```

</details>

<details>
<summary><b>💾 Manage Generated Images</b></summary>

```python
# Get generated image
image = client.get_image(result['data']['request_id'])

# Save image
image.download(['path/to/save/image.png'])

# View image
image.open()
```

</details>

### 🔄 Image to Prompt

```python
from zerogpt.utils.tools import image_to_prompt
resp = image_to_prompt('path/to/image.png')
```

### 🗂️ Working with Dummy Context[^1]

<details>
<summary><b>💾 Context Management</b></summary>

```python
from zerogpt.utils.prompt import Dummy

# Create context
dummy = Dummy()
dummy.create(messages=[
    {"role": "user", "content": "Hi"},
    {"role": "assistant", "content": "Hello!"}
])

# Also possible for image generation
dummy = Dummy()
dummy.create(prompt='neko girl', steps=100)

# Save context
dummy.save("context.bin")

# Load context
dummy.load("context.bin")

# Use instead of messages:
# client.send_message(dummy)
# or
# client.create_image(dummy)
```

</details>

### 🌐 Web Interface

An example Flask application is provided to access text generation, image
creation and image-to-prompt features from a browser.

```bash
pip install -r requirements.txt
python web/app.py
```

Then open <http://localhost:5000> in your browser.

---

## ⚙️ Parameters

### 📤 send_message

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `input` | `str` or `list` | ✅ | Text prompt or list of messages |
| `instruction` | `str` | ❌ | System instruction |
| `think` | `bool` | ❌ | Use model with deeper reasoning |
| `uncensored` | `bool` | ❌ | Use unrestricted mode |

### 🎨 create_image

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `prompt` | `str` | ✅ | Description of the desired image |
| `samples` | `int` | ❌ | Number of samples |
| `resolution` | `tuple` | ❌ | Image resolution (width, height) |
| `seed` | `int` | ❌ | Seed for reproducibility |
| `steps` | `int` | ❌ | Number of generation steps |
| `negative_prompt` | `str` | ❌ | Description of undesired elements |

---

## 🔒 Security

<div align="center">
<table>
<tr>
<td align="center">🔐</td>
<td><b>HMAC-SHA256</b><br>All requests are signed using HMAC-SHA256 for secure data transmission</td>
</tr>
<tr>
<td align="center">⏰</td>
<td><b>Timestamp Authentication</b><br>Prevents replay attacks with timestamp validation</td>
</tr>
</table>
</div>

---

## 📋 Requirements

<div align="center">

![Python](https://img.shields.io/badge/Python-3.8+-blue?style=for-the-badge&logo=python&logoColor=white)

</div>

---

## 📄 License

<div align="center">

**MIT License**

Copyright (c) 2025 RedPiar

</div>

---

## 👨‍💻 Author

<div align="center">

[![Telegram](https://img.shields.io/badge/Telegram-RedPiar-blue?style=for-the-badge&logo=telegram)](https://t.me/RedPiar)

</div>

---

<div align="center">
<sub>Made with ❤️ by RedPiar</sub>
</div>

[^1]: Dummy is used to compress context and data in general, very useful for systems with low RAM. It can also be saved for even greater memory efficiency!
