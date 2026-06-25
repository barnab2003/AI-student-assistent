content = """# 10xCS - AI Student Assistant

![MERN Stack](https://img.shields.io/badge/MERN-Stack-blue?style=for-the-badge&logo=mongodb)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)

10xCS is a production-ready, full-stack educational platform designed to empower students with AI-driven learning roadmaps, real-time community engagement, and intelligent study tools. 

Built with the MERN stack (MongoDB, Express, React, Node.js), this platform goes beyond a standard MVP by integrating real-time WebSockets, direct-to-cloud media storage, and fault-tolerant third-party AI integrations.

---

## 🚀 Beyond the MVP: Engineering for the Real World

Most student projects stop at basic CRUD operations. This platform was architected to handle real-world edge cases, production deployments, and API rate limits. 

### 1. Fault-Tolerant AI Architecture (Google Gemini)
* **High-Volume Model Routing:** Instead of defaulting to congested experimental models, the backend routes requests to `gemini-3.1-flash-lite`, a model explicitly optimized for high-frequency developer requests. This bypasses the "Shared IP Penalty" often encountered on free hosting tiers like Render.
* **Graceful Degradation:** When upstream AI servers experience traffic spikes, the backend safely catches `503 Service Unavailable` errors. Instead of crashing or leaving the user with an infinite loading spinner, it parses the custom GoogleGenerativeAI Error and forwards a clean 503 status to the frontend, which triggers a user-friendly UI toast notification.

### 2. Scalable Media Management (Cloudinary)
* **Direct-to-Cloud Uploads:** Handling image uploads (like community feed memes or profile pictures) on a Node.js server drains memory and bandwidth. This platform utilizes a Cloudinary integration pipeline. 
* **Database Optimization:** Images are uploaded securely to Cloudinary, and only the lightweight string URL is stored in MongoDB. This keeps database queries lightning fast.

### 3. Performance & UI/UX Optimizations
* **Optimistic UI Updates:** When a user creates a post or likes a comment, the React state updates instantly before the backend confirms the transaction. This creates a zero-latency, snappy user experience.
* **Infinite Scrolling via Intersection Observer:** The community feed does not load the entire database at once. It uses an invisible DOM "tripwire" (`useRef` and `IntersectionObserver`) to fetch older posts dynamically only when the user scrolls near the bottom of the feed, drastically reducing database read costs and browser memory footprint.

### 4. Production Security
* **Strict CORS Policies:** The backend API on Render rejects all traffic except requests originating specifically from the Vercel frontend domain.
* **SPA Routing Fallbacks:** A custom `vercel.json` rewrite configuration ensures that direct URL navigation (e.g., `/dashboard`) is correctly routed back to React's `index.html`, preventing classic 404 deployment errors.

---

## 🏗️ System Architecture

The application follows a decoupled client-server architecture.


```

```text
File generated successfully.

```text
[ Client - Vercel ]                        [ Server - Render ]                     [ Services ]
  React.js (Vite)   <--- REST API --->   Node.js + Express.js  <-- Mongoose -->  MongoDB Atlas (DB)
  Tailwind CSS      <--- WebSockets ->   Socket.io             <-- HTTP ------>  Google Gemini API (AI)
  Axios & Lucide    <--- Image URL ---   Cloudinary Utils      <-- Upload ---->  Cloudinary (Storage)

```

1. **Frontend (Vercel):** A Single Page Application (SPA) built with React and Vite. Manages global state, JWT storage in localStorage, and component rendering.
2. **Backend (Render):** An Express.js REST API that handles business logic, MongoDB queries, password hashing (bcrypt), and JWT signing. It also hosts the Socket.io server.
3. **Database (MongoDB Atlas):** A managed NoSQL cloud database storing Users, Posts, Comments, and generated Roadmaps.

---

## 📂 Codebase Structure & Deep Dive

### The Frontend (`/frontend/src/`)

* `/components/`: Contains modular React components.
* `Dashboard.jsx`: The main layout wrapper.
* `/dashboard/CommunityTab.jsx`: Handles the infinite scrolling feed and Cloudinary image post logic.
* `/dashboard/RoadmapTab.jsx`: Interfaces with the Gemini AI endpoints with built-in error handling for 503s.


* `/utils/`: Helper functions.
* `uploadImage.js`: Encapsulates the Cloudinary upload logic, keeping components clean.


* `App.jsx`: Main entry point containing React Router logic and Auth guards.

### The Backend (`/backend/`)

* `server.js`: The initialization point. Configures CORS, connects to MongoDB, starts the Express app, and binds the Socket.io server to the HTTP instance.
* `/routes/`: Defines the API endpoints (`/api/auth`, `/api/community`, `/api/roadmap`).
* `/controllers/`: Contains the actual business logic to keep route files lean.
* `authController.js`: Handles bcrypt hashing and JWT generation.
* `roadmapController.js`: Manages the Google Generative AI initialization and fallback error parsing.


* `/models/`: Mongoose schemas defining the structure of MongoDB collections.
* `/middleware/`:
* `authMiddleware.js`: Intercepts protected routes, verifies the JWT header, and attaches the `req.user` object.



---

## 💻 Local Development Setup

To run this project locally, you need Node.js and npm installed.

### 1. Clone the repository

```bash
git clone [https://github.com/yourusername/smartstudy.git](https://github.com/yourusername/smartstudy.git)
cd smartstudy

```

### 2. Backend Setup

```bash
cd backend
npm install

```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_google_gemini_key

```

Start the backend server:

```bash
npm run dev

```

### 3. Frontend Setup

Open a new terminal window.

```bash
cd frontend
npm install

```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000

```

Start the Vite development server:

```bash
npm run dev

```

---

## 👨‍💻 Author

Built and architected by **Barnab Barman**.

"""

with open("README.md", "w") as f:
f.write(content)

print("File generated successfully.")

```
Your Markdown file is ready
[file-tag: code-generated-file-0-1782394809355760693]

This `README.md` is designed to be highly professional and perfectly summarizes all the advanced problem-solving you've done over the past few days. It clearly outlines the "Beyond the MVP" features—like navigating the Gemini 404/503 errors, managing state, handling CORS, and implementing Cloudinary—which are exactly the kinds of architectural decisions that impress recruiters and senior engineers.

```