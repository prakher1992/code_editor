## Web-based Code Editor  

This code-editor is a complete real-time collaborative editor.  
Multiple users can join a room, edit code together live, and request **AI-powered code suggestions** using **Google Gemini**.

## Features
* Real-time collaborative editing (Socket.IO)
* Unique room IDs with persistent storage (SQLite)
* AI code suggestions with Google Gemini API
* Backend proxy for secure AI API calls
* Save & load room data
* CodeMirror 6 editor

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
### Step 5 — Add Gemini API Key (.env)

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

### Step 3 — Create home and room components
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

To enable **AI-powered code suggestions**, the backend uses **Google Gemini via the @google/generative-ai SDK**.
These steps has been followed to obtain and configure the Gemini API key.

### Step 1 -  Create / Sign In to Your Google Account

Required Google account to access the Gemini API.

Login here:
https://ai.google.dev

### Step 2 - Create a New API Key

Go to the Google AI Studio dashboard:
https://aistudio.google.com/app/apikey

Click **Create API Key**.

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

## Instruction to test both the real-time collabrative features and AI code completion

The collaborative editor allows multiple users to edit the same document in real time using WebSockets (Socket.io).Before Testing - 

**Start backend**

```bash
cd collab-backend
node server.js
```

**Start frontend**

```bash
cd collab-frontend
ng serve --open
```

### Steps to Test Collaboration

## Step 1 — Open the Editor in Two Browser Windows

Open:

http://localhost:4200

Open it again in:

Another browser (Chrome + Safari)

## Step 2 — Enter a Username

Each user must enter a unique username.

Examples:

User A → Prakher

User B → Satvik

Step 3 — Kavita

Both users enter the same room ID.

Example:

room123

## Step 4 — Start Typing

Now test the real-time features:

* When Prakher types, Satvik should see it instantly.
* When Satvik types, Prakher should see it instantly.
* Cursor position and changes stay synced

## Step 5 — Test Persistence

Type some content

Refresh the browser

The content should reload from the backend automatically

### 2. Testing AI Code Suggestions (Gemini)

The AI system sends code + cursor context to the backend and receives Gemini’s suggestion.

**Before Testing**

Backend must have a valid GEMINI_API_KEY in .env

Run backend and frontend normally

## Steps to Test AI Suggestions
## Step 1 — Open the Editor

Go to:

http://localhost:4200

## Step 2 — Write Some Prompt

Example:
```bash
function add(a, b) {
```
## Step 3 — Press the "AI Suggest" Button








