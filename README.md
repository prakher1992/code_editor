## Web-based Collaborative Real-Time Code Editor  

This project is a complete real-time collaborative code editor.  
Multiple users can join a room, edit code together live, and request **AI-powered code suggestions** using **Google Gemini**.

## Setup of Backend and Frontend

## 1. Backend Setup (Node.js + Socket.IO + Gemini + SQLite)

### Step 1: Create backend folder

```bash
mkdir collab-backend
cd collab-backend
```

### Step 2: Initialize Project

```bash
npm init -y
```
### Step 3 — Install Dependencies
```bash
npm install express socket.io cors sqlite3 uuid dotenv @google/generative-ai
```

### Step 4 — Create Folder Structure

```bash
collab-backend/
  ├── server.js
  ├── rooms.db  (auto created)
  └── .env
```
### Step 5 — Add your Gemini API Key (.env)

```bash
Create .env:

GEMINI_API_KEY=YOUR_KEY_HERE
```

### Step 6 — Add Backend Code to server.js

### Step 7 — Run Backend

```bash
node server.js
```

API available at: http://localhost:3000

## 2. Frontend Setup (Angular + CodeMirror + Socket.IO)
### Step 1 — Create Angular Project
```bash
ng new collab-frontend
cd collab-frontend
```

### Step 2 — Install Dependencies
```bash
Socket.IO client
npm install socket.io-client

CodeMirror 6
npm install codemirror @codemirror/state @codemirror/view @codemirror/lang-javascript @codemirror/autocomplete
```

### Step 3 — Create home and room components:
```bash
ng generate component home
ng generate component room
```

### Step 4 — Set Routing
```bash
In app-routing.module.ts:

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'room/:id', component: RoomComponent }
];
```

### Step 5 — Run Angular App
```bash
ng serve --open
```

Starts at:

http://localhost:4200








