document.getElementById('send').addEventListener('click', async () => {
  const input = document.getElementById('message');
  const text = input.value.trim();
  if (!text) return;
  appendMessage('user', text);
  input.value = '';

  const resp = await fetch('/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: text })
  });
  const data = await resp.json();
  appendMessage('assistant', data.response);
});

function appendMessage(role, text) {
  const div = document.createElement('div');
  div.className = 'msg ' + role;
  div.textContent = role + ': ' + text;
  if (role === 'assistant') {
    const btn = document.createElement('button');
    btn.textContent = 'Save';
    btn.onclick = () => saveText(text, btn);
    div.appendChild(document.createTextNode(' '));
    div.appendChild(btn);
  }
  document.getElementById('history').appendChild(div);
}

async function saveText(text, btn) {
  const resp = await fetch('/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  const data = await resp.json();
  if (data.status === 'saved') {
    btn.disabled = true;
    btn.textContent = 'Saved';
  }
}
