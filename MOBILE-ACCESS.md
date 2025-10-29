# 📱 Mobile Access Guide

## How to Access Attendance Tracker on Your Mobile Device

### Quick Start

1. **Run the Mobile Access Script**
   ```powershell
   .\start-mobile.ps1
   ```

2. **Get Your Mobile URL**
   The script will display your computer's IP address and mobile URLs:
   ```
   Mobile Access URLs:
     Login Page:    http://192.168.0.163:3000/login.html
     Teacher View:  http://192.168.0.163:3000/main.html
     Student View:  http://192.168.0.163:3000/student-view.html
     Admin View:    http://192.168.0.163:3000/admin.html
   ```

3. **Connect Your Mobile Device**
   - Make sure your phone is on the **SAME Wi-Fi network** as your computer
   - Open your phone's browser (Chrome, Safari, etc.)
   - Enter the URL shown in the script: `http://YOUR-IP:3000/login.html`

### Default Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Teacher | `teacher` | `teacher123` |
| Student 1 | `student1` | `student123` |
| Student 2 | `student2` | `student123` |
| Student 3 | `student3` | `student123` |
| Student 4 | `student4` | `student123` |
| Student 5 | `student5` | `student123` |

### Features Available on Mobile

✅ **Admin Dashboard**
- View all activity logs
- Manage users and credentials
- Edit classes and students
- Manage attendance records
- View system statistics

✅ **Teacher Dashboard**
- Create and manage classes
- Add students
- Mark attendance
- View statistics and charts

✅ **Student Portal**
- View personal attendance records
- See attendance statistics
- View charts and timeline

### Troubleshooting

**Problem: Can't access from mobile**
- ✓ Verify both devices are on the same Wi-Fi network
- ✓ Check Windows Firewall settings (may need to allow ports 3000 and 3002)
- ✓ Make sure both servers are running

**Problem: API connection error**
- ✓ Restart both backend and frontend servers
- ✓ Clear browser cache on mobile device
- ✓ Check that backend is running on port 3002

**Allow Firewall Access (if needed)**
```powershell
# Run as Administrator
New-NetFirewallRule -DisplayName "Attendance Tracker Frontend" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "Attendance Tracker Backend" -Direction Inbound -LocalPort 3002 -Protocol TCP -Action Allow
```

### Stopping the Servers

Press `Ctrl+C` in the PowerShell windows or close them.

### Tips for Mobile Use

1. **Add to Home Screen** (iOS/Android)
   - Open the URL in your browser
   - Tap the Share/Menu button
   - Select "Add to Home Screen"
   - Now you can launch it like a native app!

2. **Landscape Mode**
   - For better view of tables and charts, rotate your device

3. **Bookmark URLs**
   - Save the URLs for quick access
   - Different URLs for different roles

---

**Note:** Your IP address may change if you disconnect/reconnect to Wi-Fi. Run `.\start-mobile.ps1` again to get the updated URL.
