const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// SQLite DB
const db = new sqlite3.Database('./rooms.db', (err) => {
  if (err) console.error(err);
  else console.log('Connected to SQLite DB.');
});

// Create rooms table if not exists
db.run(`CREATE TABLE IF NOT EXISTS rooms (
  id TEXT PRIMARY KEY,
  content TEXT,
  updated_at INTEGER
)`);

// API to create room
app.post('/create-room', (req, res) => {
  const id = uuidv4().slice(0, 8);
  const content = req.body.content || '';
  const now = Date.now();
  db.run(`INSERT INTO rooms (id, content, updated_at) VALUES (?, ?, ?)`, [id, content, now], (err) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ roomId: id });
  });
});

// API to get room content
app.get('/room/:id', (req, res) => {
  const id = req.params.id;
  db.get(`SELECT content FROM rooms WHERE id = ?`, [id], (err, row) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (!row) return res.status(404).json({ error: 'Room not found' });
    res.json({ content: row.content || '' });
  });
});

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('join-room', ({ roomId, username }) => {
    socket.join(roomId);
    console.log(`${username} joined ${roomId}`);

    // send current content to joining client
    db.get(`SELECT content FROM rooms WHERE id = ?`, [roomId], (err, row) => {
      const content = row ? row.content : '';
      socket.emit('room-content', { content });
    });

    socket.to(roomId).emit('user-joined', { username });
  });

  socket.on('doc-change', ({ roomId, content }) => {
    const now = Date.now();
    db.run(`INSERT OR REPLACE INTO rooms (id, content, updated_at) VALUES (?, ?, ?)`, [roomId, content, now]);
    socket.to(roomId).emit('remote-doc-change', { content });
  });

  socket.on('disconnect', () => console.log('Socket disconnected:', socket.id));
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
