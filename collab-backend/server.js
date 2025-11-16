import express from "express";
import http from "http"
import { Server } from "socket.io";
import sqlite3 from "sqlite3";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

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

//  API to validate-room endpoint
app.get('/validate-room/:id', (req, res) => {
  const id = req.params.id;
  db.get(`SELECT id FROM rooms WHERE id = ?`, [id], (err, row) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (!row) return res.status(404).json({ exists: false });
    res.json({ exists: true });
  });
});


// Gemini Proxy API
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash"
});

app.post("/api/complete", async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Missing code" });
    }

    const result = await model.generateContent([
      {
        text: `Analyze this code and suggest improvements:\n\n${code}`
      }
    ]);

    const responseText = result.response.text();
    res.json({ suggestion: responseText });

  } catch (err) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ error: err.message });
  }
});



// Socket.IO logic
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  // JOIN: check DB first, do not auto-create rooms
  socket.on('join-room', ({ roomId, username }) => {
    // verify room exists
    db.get(`SELECT id FROM rooms WHERE id = ?`, [roomId], (err, row) => {
      if (err) {
        console.error('DB error in join-room:', err);
        socket.emit('room-error', { message: 'Server DB error' });
        return;
      }

      if (!row) {
        // room doesn't exist — inform the requester and do NOT join socket to room
        socket.emit('room-not-found', { roomId });
        console.log(`Join attempt failed: room ${roomId} not found (by ${username})`);
        return;
      }

      // room exists — proceed to join
      socket.join(roomId);
      console.log(`${username} joined ${roomId}`);

      // send current content to joining client
      db.get(`SELECT content FROM rooms WHERE id = ?`, [roomId], (err2, row2) => {
        const content = row2 ? row2.content : '';
        socket.emit('room-content', { content });
      });

      socket.to(roomId).emit('user-joined', { username });
    });
  });

  // DOC CHANGE: only update if room exists (no auto-create)
  socket.on('doc-change', ({ roomId, content }) => {
    db.get(`SELECT id FROM rooms WHERE id = ?`, [roomId], (err, row) => {
      if (err) {
        console.error('DB error on doc-change select:', err);
        return;
      }
      if (!row) {
        console.log(`Ignoring doc-change for non-existing room ${roomId}`);
        return;
      }

      const now = Date.now();
      db.run(
        `UPDATE rooms SET content = ?, updated_at = ? WHERE id = ?`,
        [content, now, roomId],
        (err2) => {
          if (err2) console.error('DB error on doc-change update:', err2);
        }
      );

      socket.to(roomId).emit('remote-doc-change', { content });
    });
  });

  socket.on('disconnect', () => console.log('Socket disconnected:', socket.id));
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
