# 💰 ExpenseIQ — MERN Stack Expense Tracker

A full-stack expense tracking application built with MongoDB, Express, React, and Node.js.

---

## 📁 Project Structure

```
expense-tracker/
├── backend/
│   ├── config/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── transactionController.js
│   │   └── reportController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Transaction.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── transactionRoutes.js
│   │   └── reportRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   └── common/
    │   │       └── Layout.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Dashboard.js
    │   │   ├── Transactions.js
    │   │   └── Reports.js
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── tailwind.config.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

---

### 1️⃣ Clone / Extract the project

```bash
cd expense-tracker
```

---

### 2️⃣ Setup Backend

```bash
cd backend
npm install
```

Create your `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=30d
NODE_ENV=development
```

Start backend:
```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

Backend runs at: **http://localhost:5000**

---

### 3️⃣ Setup Frontend

```bash
cd ../frontend
npm install
npm start
```

Frontend runs at: **http://localhost:3000**

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/transactions | Get all transactions (with filters) |
| POST | /api/transactions | Create transaction |
| PUT | /api/transactions/:id | Update transaction |
| DELETE | /api/transactions/:id | Delete transaction |
| GET | /api/transactions/summary | Dashboard summary |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/reports/daily | Daily report |
| GET | /api/reports/weekly | Weekly report |
| GET | /api/reports/monthly | Monthly report |
| GET | /api/reports/categories | Category-wise report |

---

## ✅ Features

- 🔐 JWT Authentication (Register / Login)
- ➕ Add, Edit, Delete Transactions
- 📊 Dashboard with summary cards & charts
- 📅 Daily, Weekly & Monthly Reports
- 🏷️ Category-based tracking
- 🔍 Filter & Search transactions
- 📱 Fully Responsive UI
- 🎨 Tailwind CSS styling

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| Styling | Tailwind CSS |
| Charts | Chart.js + React-Chartjs-2 |
| HTTP | Axios |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + Bcrypt |

---

## 📦 Dependencies

### Backend
- express, mongoose, bcryptjs, jsonwebtoken, cors, dotenv

### Frontend
- react, react-router-dom, axios, chart.js, react-chartjs-2, react-hot-toast, react-icons

---

## 🌐 Deployment

### Backend (Render / Railway)
1. Push to GitHub
2. Connect to Render/Railway
3. Set environment variables
4. Deploy!

### Frontend (Vercel / Netlify)
1. Build: `npm run build`
2. Deploy the `build/` folder
3. Set API URL in environment

---

Made with ❤️ — MERN Stack Expense Tracker
