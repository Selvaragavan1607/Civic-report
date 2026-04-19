# Cloud-Based Public Issue Reporting and Resolution System (MERN)

A full-stack MERN application that lets citizens report public issues (potholes, broken street lights, water leakage, garbage overflow, damaged roads) and lets administrators manage and resolve them. Data is stored in **MongoDB Atlas** (cloud), demonstrating cloud computing.

## Tech Stack
- **Frontend:** React.js (Vite) + Axios + React Router
- **Backend:** Node.js + Express.js + JWT auth + Multer
- **Database:** MongoDB Atlas (cloud)
- **Optional cloud storage:** Cloudinary for complaint images

## Architecture
```
Citizen → React Frontend → Node/Express REST API → MongoDB Atlas (Cloud)
                                                  ↘ Cloudinary (optional)
```

## Folder Structure
```
civic-report/
├── backend/
│   ├── config/         # DB + cloudinary config
│   ├── models/         # Mongoose schemas (User, Complaint)
│   ├── controllers/    # Route handlers
│   ├── routes/         # Express routes
│   ├── middleware/     # Auth + admin guards
│   ├── utils/          # Priority scoring (innovation)
│   ├── server.js
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/        # Axios instance
    │   ├── components/ # Navbar, ComplaintCard, etc.
    │   ├── context/    # AuthContext
    │   ├── pages/      # Home, Login, Register, NewComplaint, Dashboard, AdminDashboard
    │   └── App.jsx
    ├── .env.example
    └── package.json
```

## Innovation: Auto-Prioritization
Each complaint receives a **priority score** based on:
- Category severity (water leakage, damaged roads → high)
- Keywords in description: *danger, emergency, accident, fire, child, hospital, school*
- Number of upvotes (people affected)

Admin dashboard sorts by priority DESC so urgent issues appear first.

---

## 1. Setup MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas → create a free cluster.
2. Database Access → create user (username + password).
3. Network Access → allow `0.0.0.0/0` (for demo).
4. Connect → copy the connection string:
   `mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/civic?retryWrites=true&w=majority`

## 2. (Optional) Cloudinary
Create a free account at https://cloudinary.com and copy `CLOUD_NAME`, `API_KEY`, `API_SECRET`. If you skip this, images are stored locally in `backend/uploads/`.

## 3. Backend Setup
```bash
cd backend
cp .env.example .env
# Fill MONGO_URI, JWT_SECRET, (optional) CLOUDINARY_*
npm install
npm run dev
```
Backend runs on `http://localhost:5000`.

### Create an admin user
After registering a normal user, open MongoDB Atlas → users collection → change that user's `role` to `"admin"`. Or POST `/api/auth/register` with `{ "role": "admin" }` only on first run (then remove).

## 4. Frontend Setup
```bash
cd frontend
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

## 5. Run Both
Open two terminals — one for `backend` (`npm run dev`), one for `frontend` (`npm run dev`). Visit `http://localhost:5173`.

---

## Deployment

### Render / Railway (Backend)
1. Push code to GitHub.
2. New Web Service → connect repo → root dir: `backend`.
3. Build: `npm install`. Start: `node server.js`.
4. Add env vars: `MONGO_URI`, `JWT_SECRET`, `PORT=5000`, optional Cloudinary keys.

### Vercel / Netlify (Frontend)
1. Import repo → root dir: `frontend`.
2. Build: `npm run build`. Output: `dist`.
3. Env var: `VITE_API_URL=https://your-backend.onrender.com/api`.

### Local VPS
```bash
git clone <repo>
cd backend && npm install && pm2 start server.js
cd ../frontend && npm install && npm run build
# Serve dist/ via nginx
```

---

## API Endpoints

### Auth
- `POST /api/auth/register` `{ name, email, password }`
- `POST /api/auth/login` `{ email, password }` → `{ token, user }`

### Complaints
- `POST /api/complaints` (auth) — multipart: `category, description, location, image`
- `GET  /api/complaints/me` (auth) — current user's complaints
- `POST /api/complaints/:id/upvote` (auth)
- `GET  /api/complaints` (admin) — all, sorted by priority
- `PUT  /api/complaints/:id/status` (admin) `{ status }`
- `DELETE /api/complaints/:id` (admin)

---

## Viva Talking Points
- **Cloud computing:** MongoDB Atlas (DBaaS), optional Cloudinary (storage as a service), deployable on Render (PaaS).
- **REST architecture:** stateless JSON endpoints, JWT for auth.
- **Scalability:** cloud DB scales independently of app server.
- **Innovation:** priority algorithm uses category weight + keyword detection + upvote count.

## License
MIT — free for educational use.
