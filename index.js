const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

let highlights = [];

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/highlight', (req, res) => {
  const { time, note } = req.body;
  if (!time) return res.status(400).json({ error: 'Missing time' });
  highlights.push({ time, note: note || '' });
  return res.json({ success: true });
});

app.get('/api/highlights', (req, res) => {
  res.json(highlights);
});

app.delete('/api/highlights', (req, res) => {
  highlights = [];
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
