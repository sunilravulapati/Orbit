<div align="center">

# 🪐 Orbit

### A Real-Time Social Media Ecosystem

[![React](https://img.shields.io/badge/React-Vite-61DAFB?logo=react)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com/atlas)
[![Socket.io](https://img.shields.io/badge/Socket.io-Real--Time-010101?logo=socket.io)](https://socket.io/)
[![Groq](https://img.shields.io/badge/AI-Llama%203.3%2070B-FF6B35)](https://groq.com/)
[![Cloudinary](https://img.shields.io/badge/Media-Cloudinary-3448C5?logo=cloudinary)](https://cloudinary.com/)

**A high-performance, full-stack social media platform built with the MERN stack.**  
Real-time interactions, AI-powered post enhancement, and a persistent bookmarking system — all in one seamless ecosystem.

[Features](#-key-features) · [Tech Stack](#-tech-stack) · [Project Structure](#-project-structure) · [Getting Started](#-getting-started) · [Team](#-team)

</div>

---

## ✨ Key Features

### ⚡ Real-Time Interactions
Powered by **Socket.io**, Orbit delivers live updates across the platform — no refresh needed.

Users receive instant notifications when:
- Their posts are **liked**
- Someone **comments** on their post
- A user **follows** them

### 🤖 AI Post Enhancement
Integrated with **Groq AI (Llama 3.3)**, Orbit helps users craft better posts before publishing:

- Refine sentence structure
- Improve clarity and readability
- Enhance engagement potential
- Suggest improved phrasing

### 🔖 Persistent Bookmarking
Save posts and revisit them anytime, anywhere — powered by **Zustand Persistence Middleware** and **MongoDB backend sync**. Bookmarks persist across sessions and devices.

### 🧠 Dynamic Feed Algorithm

| Feed | Description |
|---|---|
| 🌎 **For You** | Global trending posts from across the platform |
| 👥 **Following** | Posts from followed users only — your personalized social feed |

### 🖼 Media Management
Full image upload and management support for profile pictures and post images, with optimized delivery via **Cloudinary CDN**.

### 🔗 Deep-Linkable Post Views
Every post has its own shareable route, complete with comment threads and conversation context:

```
/post/:postId
```

---

## 🛠 Tech Stack

**Frontend**

| Technology | Purpose |
|---|---|
| React + Vite | Fast development & optimized builds |
| Zustand | Lightweight global state management |
| Tailwind CSS | Modern dark-themed UI |
| React Router v7 | Dynamic routing with protected layouts |
| Socket.io-client | Real-time communication |
| React Hot Toast | Elegant notification system |

**Backend**

| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | API server architecture |
| MongoDB + Mongoose | NoSQL database & schema modeling |
| JWT + Cookies | Secure authentication |
| Cloudinary + Multer | Media storage & file upload handling |
| Groq AI | Llama 3.3 integration |

---

## 📂 Project Structure

```
orbit/
│
├── frontend/
│   └── src/
│       ├── api/          # Axios instance & API services
│       ├── components/   # Reusable UI components
│       ├── hooks/        # Custom React hooks
│       ├── store/        # Zustand state management
│       └── utils/        # Helper utilities
│
└── backend/
    ├── apis/             # Express routers
    ├── controllers/      # Business logic
    ├── middleware/       # Auth, uploads, error handlers
    └── models/           # Mongoose schemas
```

---

## 🌐 Architecture Overview

```
Frontend (React + Zustand)
        │
        │  REST API Requests
        ▼
Backend (Node.js + Express)
        │
        ├──── MongoDB Atlas       (Database)
        ├──── Cloudinary          (Media Storage)
        ├──── Groq / Llama 3.3    (AI Enhancement)
        └──── Socket.io           (Real-Time Events)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- Cloudinary account
- Groq Cloud API key

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/sunilravulapati/orbit.git
cd orbit
```

### 2️⃣ Environment Setup

**Backend** — create `backend/.env`:

```env
PORT=4000
DB_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key

CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

**Frontend** — create `frontend/.env`:

```env
VITE_GROQ_API_KEY=your_groq_api_key
```

### 3️⃣ Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4️⃣ Run the Application

```bash
# Start backend  →  http://localhost:4000
cd backend
npm start

# Start frontend →  http://localhost:5173
cd ../frontend
npm run dev
```

---

## 👥 Team

This project was developed collaboratively by:

| Name |
|---|
| R. Sunil |
| A. Akaash |
| G. Rakesh Babu |
| K. Arjun |
| T. Ramana |

---

## ⭐ Why Orbit?

Orbit is not just another social media clone. It combines:

- ✅ Real-time communication via Socket.io
- ✅ AI-powered content enhancement via Llama 3.3
- ✅ Modern, scalable frontend architecture
- ✅ Robust and extensible backend design

...to create a high-performance social networking ecosystem built for the modern web.

---

<div align="center">

⭐ **If you like this project, consider starring the repository!** ⭐

</div>
