# 🍽️ AUW Dining Management System

A full-stack Campus Dining Management System for **Asian University for Women (AUW)**.

Built with **React + Vite** (frontend) and **Node.js + Express** (backend).

---

## 📋 Features

| Feature | Description |
|---|---|
| 🔐 **Login** | AUW ERP-style login with campus background, ID + password |
| 👤 **Profile** | User type, food preference (🟢 Veg / 🔴 Non-Veg), allergies |
| 🍽️ **Dining Sign Up** | Breakfast/Lunch/Dinner tokens with allergy warnings |
| 📋 **Weekly Menu** | Full 7-day menu, veg/non-veg toggle, allergen highlights |
| 🎫 **My Tokens** | View, filter, and cancel dining tokens |
| 💳 **Payment** | 10-day bill for Day Scholars & Faculty (bKash, Nagad, Card, Cash) |
| ⭐ **Feedback** | Star + emoji rating, categories, tags, community stats |
| 🔔 **Notifications** | 3-day advance menu preview (auto-sent daily at 7AM) |
| 📖 **User Guide** | Step-by-step usage instructions |

---

## 🚀 Quick Setup on macOS

### Prerequisites

Make sure you have these installed:
```bash
node --version   # needs v18+
npm --version    # needs v9+
git --version
```

If Node.js is not installed:
```bash
# Using Homebrew (recommended)
brew install node

# Or download from https://nodejs.org
```

---

### 1. Clone or create the project

```bash
# If pushing to GitHub for the first time:
git init
git add .
git commit -m "Initial commit: AUW Dining Management System"

# Create a repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/auw-dining-system.git
git branch -M main
git push -u origin main
```

---

### 2. Install dependencies

```bash
# From the project root
cd auw-dining-system

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

---

### 3. Add the AUW logo & campus background

Place these files in `frontend/public/`:
- `auw-logo.png` — the AUW lotus logo (provided separately)
- `campus-bg.jpg` — any campus aerial photo for the login background

```bash
cp /path/to/auw-logo.png frontend/public/auw-logo.png
cp /path/to/campus-photo.jpg frontend/public/campus-bg.jpg
```

> **Tip:** The login page shows the logo and campus background exactly like the AUW ERP system.

---

### 4. Start the servers

Open **two terminal windows**:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Server starts at http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# App starts at http://localhost:5173
```

---

### 5. Open the app

Go to: **http://localhost:5173**

---

## 🔑 Demo Login Credentials

| User | ID | Password | Type |
|---|---|---|---|
| Ayasha Rahman | `220018` | `auw2024` | Day Scholar |
| Nadia Islam | `220045` | `auw2024` | Residential |
| Fatima Al-Zahra | `210033` | `auw2024` | Residential |
| Dr. Priya Sharma | `FAC001` | `auw2024` | Faculty |
| Dr. Amina Begum | `FAC002` | `auw2024` | Faculty |
| Sumaiya Akter | `230010` | `auw2024` | Day Scholar |

---

## 📁 Project Structure

```
auw-dining-system/
├── backend/
│   ├── data/
│   │   └── db.js          # In-memory database (users, menu, pricing)
│   ├── middleware/
│   │   └── auth.js        # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js        # Login, profile endpoints
│   │   ├── dining.js      # Menu, token signup endpoints
│   │   ├── payment.js     # Bill and payment endpoints
│   │   └── feedback.js    # Feedback and ratings endpoints
│   ├── server.js          # Express app + cron jobs
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   ├── auw-logo.png   # ← Add this file
│   │   └── campus-bg.jpg  # ← Add this file
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   └── Topbar.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── DiningSignup.jsx
│   │   │   ├── WeeklyMenu.jsx
│   │   │   ├── MyTokens.jsx
│   │   │   ├── Payment.jsx
│   │   │   ├── Feedback.jsx
│   │   │   ├── UserGuide.jsx
│   │   │   └── Notifications.jsx
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
├── package.json
└── README.md
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Login with ID + password |
| GET | `/api/auth/me` | Get current user profile |
| PUT | `/api/auth/profile` | Update food preference / allergies |
| GET | `/api/dining/menu` | Today + next 3 days menu |
| GET | `/api/dining/menu/week` | Full weekly menu |
| POST | `/api/dining/signup` | Sign up for a meal (creates token) |
| GET | `/api/dining/tokens` | Get all my tokens |
| DELETE | `/api/dining/tokens/:id` | Cancel a token |
| GET | `/api/dining/notify` | Get 3-day advance menu notification |
| GET | `/api/payment/bill` | Get 10-day bill summary |
| POST | `/api/payment/pay` | Record a payment |
| GET | `/api/payment/history` | Payment history |
| POST | `/api/feedback` | Submit feedback |
| GET | `/api/feedback/summary` | Community rating summary |
| GET | `/api/feedback/mine` | My feedback history |

---

## 💡 Notes

- **Data Storage:** Currently uses in-memory storage (data resets on server restart). For production, replace with MongoDB or PostgreSQL.
- **Emails:** Menu notification emails can be enabled by configuring Nodemailer in `server.js` with SMTP credentials.
- **Residential students** have meals included — no payment page shown.
- **Day Scholar tokens** display `⚡ DAY SCHOLAR TOKEN` in bold at the top.
- **Faculty tokens** display `🎓 FACULTY TOKEN` in bold.
- Allergy warnings are **mandatory popups** — users must confirm before proceeding.

---

## 🎨 Color System

| Color | Meaning |
|---|---|
| 🟢 Green | Vegetarian items |
| 🔴 Red | Non-Vegetarian items |
| ⚠️ Orange | Allergen warning |
| Crimson | AUW brand color |
| Gold | Secondary accent |

---

## 👩‍💻 Built for AUW

This system is designed specifically for Asian University for Women's dining facilities, matching the existing AUW ERP visual identity.
