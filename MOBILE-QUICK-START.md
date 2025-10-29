# 🚀 Quick Start - Mobile Access

## The backend connection issue is because of Windows Firewall

### ✅ SOLUTION: Run as Administrator

**Right-click PowerShell → "Run as Administrator"**

Then run:
```powershell
cd c:\Users\ichar\OneDrive\Documents\GitHub\attendance-tracker
.\START-FOR-MOBILE.ps1
```

This will:
1. ✅ Configure Windows Firewall
2. ✅ Start Backend Server (network accessible)
3. ✅ Start Frontend Server
4. ✅ Show your mobile URL

---

## 📱 Access from Mobile

**Your URL:** `http://192.168.0.163:3000/login.html`

**Requirements:**
- ✅ Phone on SAME Wi-Fi as computer
- ✅ Windows Firewall configured (run script above)

---

## 🔑 Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Teacher | teacher | teacher123 |
| Student | student1 | student123 |

---

## ❓ Troubleshooting

### "Backend not connected" error?
→ Run `START-FOR-MOBILE.ps1` as **Administrator**

### Can't access from mobile?
1. Check if phone is on same Wi-Fi
2. Run `.\FIX-FIREWALL.ps1` as Administrator
3. Restart servers

### Test connection?
```powershell
.\TEST-CONNECTION.ps1
```

---

## 📂 Files

- `START-FOR-MOBILE.ps1` - Complete setup (run as admin)
- `FIX-FIREWALL.ps1` - Fix firewall only (run as admin)
- `TEST-CONNECTION.ps1` - Test if everything works
- `start-mobile.ps1` - Simple starter (after firewall is fixed)
