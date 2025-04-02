const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

// 🧠 Kết nối MongoDB (đổi URI theo Atlas của bạn)
mongoose.connect('mongodb+srv://demetridraylen7272:3bg9RivyEPuM4Sgs@highlightdb.djv3puw.mongodb.net/?retryWrites=true&w=majority&appName=highlightdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Đã kết nối MongoDB'))
.catch(err => console.error('❌ Lỗi MongoDB:', err));

// 🎯 Định nghĩa schema MongoDB
const highlightSchema = new mongoose.Schema({
  roomId: String,
  date: String,      // YYYY-MM-DD
  time: String,      // HH:MM:SS
  note: String
});
const Highlight = mongoose.model('Highlight', highlightSchema);

// ⚙️ Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 🔧 Hàm lấy ngày hôm nay (local)
function getTodayDate() {
  const now = new Date();
  return now.toISOString().split('T')[0]; // 'YYYY-MM-DD'
}

// ✅ API: Lưu highlight
app.post('/api/highlight', async (req, res) => {
  const { roomId, time, note } = req.body;
  const date = getTodayDate();

  if (!roomId || !time) {
    return res.status(400).json({ error: 'Thiếu roomId hoặc time' });
  }

  try {
    const newHighlight = new Highlight({ roomId, date, time, note });
    await newHighlight.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi lưu dữ liệu' });
  }
});

// ✅ API: Lấy highlight theo room & date
app.get('/api/highlights', async (req, res) => {
  const room = req.query.room;
  const date = req.query.date || getTodayDate();

  if (!room) return res.status(400).json({ error: 'Thiếu room' });

  try {
    const highlights = await Highlight.find({ roomId: room, date }).sort({ time: 1 });
    res.json(highlights);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi truy vấn dữ liệu' });
  }
});

// ✅ API: Xoá dữ liệu theo room & date
app.delete('/api/highlights', async (req, res) => {
  const room = req.query.room;
  const date = req.query.date || getTodayDate();

  try {
    await Highlight.deleteMany({ roomId: room, date });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi xoá dữ liệu' });
  }
});

// ✅ Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
