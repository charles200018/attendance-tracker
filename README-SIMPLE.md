# 📚 Attendance Tracker

Simple, modern attendance management system.

## 🚀 Quick Start

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Start Backend Server
```bash
node server.js
```
Server runs on: `http://127.0.0.1:3002`

### 3. Start Frontend Server
```bash
cd frontend
python -m http.server 3000
```
Frontend runs on: `http://127.0.0.1:3000`

### 4. Open Application
Navigate to: `http://127.0.0.1:3000/index.html`

## 📁 Project Structure

```
attendance-tracker/
├── backend/
│   ├── server.js          # Express API server
│   ├── init-db.js         # Initialize with sample data (optional)
│   └── package.json       # Dependencies
└── frontend/
    └── index.html         # Complete app (HTML + CSS + JS)
```

## ✨ Features

- ✅ Manage multiple classes
- ✅ Register students with roll numbers
- ✅ Mark attendance (Present/Late/Absent)
- ✅ Real-time dashboard statistics
- ✅ Modern responsive UI
- ✅ Auto-save to database

## 🔧 Optional: Add Sample Data

```bash
cd backend
node init-db.js
```

## 📝 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/test` | GET | Health check |
| `/api/classes` | GET/POST | Manage classes |
| `/api/students` | GET/POST | Manage students |
| `/api/students/:classId` | GET | Get students by class |
| `/api/attendance` | GET/POST | Manage attendance |
| `/api/attendance/:classId/:date` | GET | Get attendance by class/date |

## 💾 Database

- **Location**: OS temp directory (`C:\Users\...\AppData\Local\Temp\attendance-tracker-db.json`)
- **Format**: JSON
- **Auto-created**: On first run

## 🐛 Troubleshooting

**Backend won't start?**
```bash
# Kill existing process
taskkill /F /IM node.exe
# Restart
node server.js
```

**Page not loading?**
- Ensure backend is running on port 3002
- Check browser console (F12) for errors
- Verify CORS is enabled

## 📖 Full Documentation

See `PROJECT-DOCUMENTATION.md` for complete technical details.

## 🎯 Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: Vanilla JavaScript + Tailwind CSS
- **Database**: JSON file
- **Icons**: FontAwesome

---

**Made with ❤️ for simple attendance management**
