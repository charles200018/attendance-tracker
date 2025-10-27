# Cleanup Guide - Attendance Tracker

## Files to DELETE (Unnecessary/Redundant)

### Frontend (10 files to delete)
- ❌ `index.html` - Old broken version
- ❌ `app.html` - Duplicate backup
- ❌ `demo.html` - Test file
- ❌ `test-api.html` - Test file  
- ❌ `simple-test.html` - Test file
- ❌ `dashboard.js` - Now inline in main.html
- ❌ `attendance.js` - Now inline in main.html
- ❌ `attendance-new.js` - Now inline in main.html
- ❌ `style.css` - Now inline in main.html
- ❌ `style-enhanced.css` - Now inline in main.html
- ❌ `README.md` - Redundant docs

### Backend (5 items to delete)
- ❌ `routes/` - All routes now in server.js
- ❌ `db.json` - Old database file
- ❌ `data.json` - Empty duplicate
- ❌ `.env copy.example.env` - Incorrect naming/unused
- ❌ `README.md` - Redundant docs

## Files to KEEP (Essential)

### Root (2 files)
- ✅ `README.md` - Main documentation
- ✅ `PROJECT-DOCUMENTATION.md` - Complete docs

### Frontend (1 file)
- ✅ `main.html` - ONLY file needed (everything inline)

### Backend (4 files)
- ✅ `server.js` - Main Express server
- ✅ `db.js` - Database utilities
- ✅ `init-db.js` - Sample data generator
- ✅ `package.json` - Dependencies
- ✅ `package-lock.json` - Locked dependencies (auto-generated)

## Final Clean Structure

```
attendance-tracker/
├── README.md                    # Quick start guide
├── PROJECT-DOCUMENTATION.md     # Full documentation
├── backend/
│   ├── server.js               # Express API server
│   ├── db.js                   # Database utilities  
│   ├── init-db.js              # Data initialization
│   ├── package.json            # Dependencies
│   └── package-lock.json       # Lock file
└── frontend/
    └── index.html              # Single-file app (rename from main.html)
```

## Manual Cleanup Steps (OneDrive files are locked)

Since files are locked by OneDrive sync, here's what to do:

1. **Close VS Code** completely
2. **Stop OneDrive sync** temporarily
3. **Delete unnecessary files** manually:
   - Delete all frontend files EXCEPT `main.html`
   - Rename `main.html` to `index.html`
   - Delete `backend/routes/` folder
   - Delete `backend/db.json`, `backend/data.json`, `backend/.env copy.example.env`, `backend/README.md`
4. **Restart OneDrive sync**
5. **Reopen VS Code**

## Or Use This PowerShell Script

```powershell
# Stop OneDrive
Stop-Process -Name "OneDrive" -Force -ErrorAction SilentlyContinue

# Navigate to project
cd "c:\Users\ichar\OneDrive\Documents\GitHub\attendance-tracker"

# Clean frontend
cd frontend
Remove-Item "app.html", "demo.html", "test-api.html", "simple-test.html", "index.html", "dashboard.js", "attendance.js", "attendance-new.js", "style.css", "style-enhanced.css", "README.md" -Force
Rename-Item "main.html" "index.html"

# Clean backend
cd ..\backend
Remove-Item "routes\" -Recurse -Force
Remove-Item "db.json", "data.json", ".env copy.example.env", "README.md" -Force

# Restart OneDrive
Start-Process "$env:LOCALAPPDATA\Microsoft\OneDrive\OneDrive.exe"
```
