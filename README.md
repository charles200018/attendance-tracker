# 📚 Attendance Tracker Pro

> A modern, full-stack web application for managing student attendance across multiple classes with a beautiful, responsive UI.

![Status](https://img.shields.io/badge/status-production%20ready-brightgreen) ![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen) ![License](https://img.shields.io/badge/license-Educational-blue)

---

## ✨ Features

- 📊 **Real-time Dashboard** - View attendance statistics at a glance
- 🏫 **Class Management** - Add and organize multiple classes
- 👨‍🎓 **Student Management** - Register students with roll numbers
- ✅ **Attendance Marking** - Mark present, late, or absent with ease
- 🎨 **Modern UI** - Beautiful gradients, animations, and responsive design
- 🔔 **Toast Notifications** - Instant feedback for all actions
- 📱 **Mobile Responsive** - Works perfectly on all devices

---

## 🚀 Quick Start

### Prerequisites

- Node.js v18 or higher
- Python 3.x
- Modern web browser

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/attendance-tracker.git
cd attendance-tracker
```

**2. Start the Backend**
```powershell
cd backend
npm install
node server.js
```
Backend will run on `http://127.0.0.1:3002`

**3. Start the Frontend**
```powershell
cd frontend
python -m http.server 3000
```
Frontend will run on `http://127.0.0.1:3000`

**4. Open the Application**

Navigate to: **http://127.0.0.1:3000/main.html**

---

## 📖 Usage

### Adding a Class
1. Enter class name in the "Classes" section
2. Click "Add" or press Enter
3. Class appears in the list instantly

### Adding Students
1. Select a class from the dropdown
2. Enter student name and roll number
3. Click "Add Student"
4. Student is added to the selected class

### Marking Attendance
1. Select a class and date
2. Choose status for each student (Present/Late/Absent)
3. Use bulk actions to mark all at once
4. Click "Submit Attendance" to save

---

## 🏗️ Architecture

```
Frontend (Port 3000)          Backend (Port 3002)
┌─────────────────┐          ┌─────────────────┐
│   main.html     │  ←HTTP→  │  Express Server │
│  (Single File)  │          │   + JSON DB     │
│  - Dashboard    │          │  - RESTful API  │
│  - Classes      │          │  - CORS Enabled │
│  - Students     │          └─────────────────┘
│  - Attendance   │
└─────────────────┘
```

### Tech Stack

**Backend:**
- Node.js + Express
- JSON file database
- CORS enabled

**Frontend:**
- Vanilla JavaScript (ES6+)
- Tailwind CSS (CDN)
- Chart.js for visualizations
- FontAwesome icons

---

## 📁 Project Structure

```
attendance-tracker/
├── backend/
│   ├── server.js           # Main Express server
│   ├── db.js               # Database utilities
│   ├── init-db.js          # Sample data generator
│   └── package.json
├── frontend/
│   ├── main.html           # ⭐ Production app (use this)
│   ├── app.html            # Backup version
│   └── index.html          # Legacy version
├── README.md               # This file
└── PROJECT-DOCUMENTATION.md # Complete documentation
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/test` | Health check |
| GET | `/api/classes` | Get all classes |
| POST | `/api/classes` | Add new class |
| GET | `/api/students` | Get all students |
| GET | `/api/students/:classId` | Get students by class |
| POST | `/api/students` | Add new student |
| GET | `/api/attendance/:classId/:date` | Get attendance |
| POST | `/api/attendance` | Mark attendance |

---

## 🐛 Troubleshooting

### Backend won't start?
```powershell
# Check if port 3002 is in use
netstat -ano | findstr :3002

# Kill the process if needed
taskkill /PID <PID> /F
```

### Frontend shows "Connection Failed"?
1. Ensure backend is running on port 3002
2. Check browser console for errors (F12)
3. Verify CORS settings

### Page stuck on "Loading..."?
Use `main.html` instead of `index.html`

---

## 📚 Documentation

For complete documentation, see **[PROJECT-DOCUMENTATION.md](PROJECT-DOCUMENTATION.md)** which includes:
- Detailed architecture
- API specifications
- Database schema
- Development guide
- Security considerations
- Future enhancements

---

## 🎯 Current Status

✅ **Fully Functional**
- Backend API with all CRUD operations
- Modern responsive UI
- Real-time dashboard
- Complete attendance workflow
- Toast notifications
- Error handling

---

## 🔒 Security Notice

⚠️ **This is a development/educational application**

Not suitable for production without:
- Authentication & authorization
- Input validation & sanitization
- Rate limiting
- HTTPS
- Proper database (PostgreSQL/MongoDB)
- Environment variables

---

## 📝 Future Enhancements

- [ ] User authentication
- [ ] Export to CSV/Excel
- [ ] Attendance reports
- [ ] Email notifications
- [ ] Barcode/QR scanning
- [ ] Parent portal

---

## 📄 License

Educational project - Free to use and modify

---

## 🤝 Contributing

Suggestions and improvements are welcome!

---

## 💡 Tips

- Use **main.html** for the best experience
- Backend stores data in OS temp directory (survives OneDrive sync issues)
- All JavaScript is inline for simplicity
- Refresh page to see latest data

---

**Made with ❤️ for better attendance management**

For questions or issues, check the troubleshooting section or review browser console logs.
