# FitBy – AI‑Powered Fitness Companion
This project is still under construction
Feedback is welcome
<img width="1896" height="916" alt="Screenshot 2025-08-15 223025" src="https://github.com/user-attachments/assets/c2fcbc20-ca51-4c1a-8346-c98bb99c5652" />

<img width="1894" height="876" alt="Screenshot 2025-08-15 223145" src="https://github.com/user-attachments/assets/7b316927-01a3-4899-af42-f79f1b7e3260" />



**FitBy** is a modern fitness web app that uses AI to personalize workout plans, track progress, and help users stay fit smarter. 
It features a clean UI, React-based frontend (deployed on Vercel), and a robust backend powered by Node.js/Express and MongoDB (deployed on Render).

---

## Live Deployment

- **Frontend**: https://fitby-fitness-ai-powered-app-in6l.vercel.app  
- **Backend API**: https://fitby-fitness-ai-powered-app.onrender.com

---

## Features

- AI-driven workout generation tailored to your goals  
- Create and manage user profiles  
- Log video workouts, blogs, and training content  
- Responsive React-based dashboard with login/signup functionality  
- Secure Express API backend with MongoDB integration  

---

## Quick Setup

### Prerequisites

- Node.js (v16+)
- MongoDB Atlas cluster
- Render account (backend)
- Vercel account (frontend)

### Clone the Repository

```bash
git clone <repo-url>
cd <project-name>
```

---

### Backend (Render)

1. Navigate to `/backend`.
2. Create a `.env`:

```
MONGO_URI=<your MongoDB connection string>
PORT=5000
```
3. Deploy via Render with:
   - **Root Directory**: `/backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - Add `MONGO_URI` in Environment Variables on Render.

---

### Frontend (Vercel)

1. Navigate to `/frontend`.
2. Create a `.env` with:
```
VITE_API_BASE_URL=https://fitby-fitness-ai-powered-app.onrender.com/api
```

3. Replace API calls like:
```js
fetch(`${API_BASE_URL}/videos`);
```
where:
```js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

4. Deploy via Vercel, point to the `/frontend` directory and include the `VITE_API_BASE_URL` env variable in the deployment settings.

---

## Usage

- Frontend will automatically connect to your backend via the `VITE_API_BASE_URL`.  
- Users can sign up or log in, access AI-powered workouts, read blogs or videos, all backed by your Express API.

---

## Contributing

- Fork the project, create a branch (e.g., `feature/my-feature`), commit using Conventional Commits, and open a PR.

---

