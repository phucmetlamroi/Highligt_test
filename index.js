const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Dữ liệu tạm, lưu highlight theo từng room
let highlightsByRoom = {}; // { roomId: [ { time, note }, ... ] }

app.use(express.json());

// 👇 Dòng cực kỳ quan trọng: phục vụ file tĩnh từ thư mục 'public'
app.use(express.static(path.join(__dirname, 'public')));

// API lưu highlight
app.post('/api/highlight', (req, res) => {
  const { roomId, time, note } = req.body;
  if (!roomId || !time) return res.status(400).json({ error: 'Thiếu roomId hoặc time' });

  if (!highlightsByRoom[roomId]) highlightsByRoom[roomId] = [];
  highlightsByRoom[roomId].push({ time, note: note || '' });

  res.json({ success: true });
});

// API lấy highlight theo room
app.get('/api/highlights', (req, res) => {
  const roomId = req.query.room;
  if (!roomId) return res.status(400).json({ error: 'Thiếu room' });

  res.json(highlightsByRoom[roomId] || []);
});

// API xoá highlight theo room
app.delete('/api/highlights', (req, res) => {
  const roomId = req.query.room;
  if (roomId) {
    delete highlightsByRoom[roomId];
  } else {
    highlightsByRoom = {};
  }
  res.json({ success: true });
});

// Khởi chạy
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
