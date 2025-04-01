const timerDisplay = document.getElementById('timerDisplay');
const startBtn = document.getElementById('startBtn');
const highlightBtn = document.getElementById('highlightBtn');
const stopBtn = document.getElementById('stopBtn');
const highlightNote = document.getElementById('highlightNote');

let startTime = null;
let interval = null;
let elapsed = 0;

function format(ms) {
  const sec = Math.floor(ms / 1000);
  const h = String(Math.floor(sec / 3600)).padStart(2, '0');
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function updateDisplay() {
  const now = Date.now();
  const diff = now - startTime + elapsed;
  timerDisplay.textContent = format(diff);
}

startBtn.onclick = () => {
  startTime = Date.now();
  interval = setInterval(updateDisplay, 500);
  startBtn.disabled = true;
  highlightBtn.disabled = false;
  stopBtn.disabled = false;
};

highlightBtn.onclick = async () => {
  const now = Date.now();
  const time = format(now - startTime + elapsed);
  const note = highlightNote.value.trim();

  await fetch('/api/highlight', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ time, note })
  });

  alert(`Đã lưu: ${time}${note ? ` - ${note}` : ''}`);
  highlightNote.value = '';
};

stopBtn.onclick = () => {
  clearInterval(interval);
  elapsed += Date.now() - startTime;
  startBtn.disabled = false;
  highlightBtn.disabled = true;
  stopBtn.disabled = true;
};
