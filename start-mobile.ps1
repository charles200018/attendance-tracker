# Start Attendance Tracker for Mobile Access
# This script starts both servers and shows the mobile-accessible URLs

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  ATTENDANCE TRACKER - MOBILE ACCESS" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

# Get local IP address
$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -notlike "169.254.*" } | Select-Object -First 1).IPAddress

if (-not $localIP) {
    Write-Host "Error: Could not find local IP address" -ForegroundColor Red
    exit 1
}

Write-Host "Your Computer's IP Address: $localIP" -ForegroundColor Yellow
Write-Host "`nMobile Access URLs:" -ForegroundColor Yellow
Write-Host "  Login Page:    http://${localIP}:3000/login.html" -ForegroundColor White
Write-Host "  Teacher View:  http://${localIP}:3000/main.html" -ForegroundColor White
Write-Host "  Student View:  http://${localIP}:3000/student-view.html" -ForegroundColor White
Write-Host "  Admin View:    http://${localIP}:3000/admin.html" -ForegroundColor White
Write-Host "`nBackend API:     http://${localIP}:3002/api" -ForegroundColor White

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "IMPORTANT: Make sure your mobile device" -ForegroundColor Yellow
Write-Host "is connected to the SAME Wi-Fi network!" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Default Credentials:" -ForegroundColor Yellow
Write-Host "  Admin:    admin / admin123" -ForegroundColor White
Write-Host "  Teacher:  teacher / teacher123" -ForegroundColor White
Write-Host "  Student1: student1 / student123" -ForegroundColor White

Write-Host "`n========================================`n" -ForegroundColor Cyan

# Check if backend is already running
$backendRunning = Get-Process -Name node -ErrorAction SilentlyContinue

if ($backendRunning) {
    Write-Host "Stopping existing backend server..." -ForegroundColor Yellow
    Stop-Process -Name node -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

Write-Host "Starting Backend Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; Write-Host 'Backend Server Running on port 3002 (Network accessible)' -ForegroundColor Green; node server.js"
Start-Sleep -Seconds 3

# Check if frontend is already running
$frontendRunning = Get-Process -Name python -ErrorAction SilentlyContinue

if ($frontendRunning) {
    Write-Host "Frontend server is already running!" -ForegroundColor Green
} else {
    Write-Host "Starting Frontend Server..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; Write-Host 'Frontend Server Running on port 3000' -ForegroundColor Green; python -m http.server 3000"
    Start-Sleep -Seconds 2
}

Write-Host "`nServers are starting..." -ForegroundColor Yellow
Write-Host "Opening login page in browser..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Open in default browser
Start-Process "http://localhost:3000/login.html"

Write-Host "`nScan this QR code with your phone or enter the URL manually:" -ForegroundColor Green
Write-Host "http://${localIP}:3000/login.html" -ForegroundColor Cyan -BackgroundColor Black

Write-Host "`nPress Ctrl+C to stop the servers`n" -ForegroundColor Red
pause
