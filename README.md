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

## Obtaining & Configuring the Gemini API Key

To enable AI-powered code suggestions, the backend uses Google Gemini via the @google/generative-ai SDK.
Follow these steps to obtain and configure your Gemini API key.

### Step 1 -  Create / Sign In to Your Google Account

Required Google account to access the Gemini API.

Login here:
https://ai.google.dev

### Step 2 - Create a New API Key

Go to the Google AI Studio dashboard:
https://aistudio.google.com/app/apikey

Click “Create API Key”.

Copy this key (need it in the backend).

### Step 3 - Add the Gemini API Key to Backend Environment Variables

Inside the backend project root folder, create a file:
```bash
.env
```

Add:
```bash
GEMINI_API_KEY=your_api_key_here
```
### Step 4 - Install Gemini SDK in Backend
```bash
npm install @google/generative-ai dotenv
```

### Step 5 -  Use the API Key in Backend Code

### Step 7 - Restart the Server
```bash
node server.js
```
## Overview of Architecture
<img width="2284" height="1270" alt="image" src="https://github.com/user-attachments/assets/86b5e517-e9ee-4fcc-a789-f66c15dd7d0f" />





