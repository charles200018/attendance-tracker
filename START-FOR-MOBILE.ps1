# Attendance Tracker - Mobile Access Launcher
# This script will configure everything needed for mobile access

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "  ATTENDANCE TRACKER - MOBILE ACCESS SETUP" -ForegroundColor Green
Write-Host "============================================================`n" -ForegroundColor Cyan

# Get local IP
$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { 
    $_.InterfaceAlias -notlike "*Loopback*" -and 
    $_.IPAddress -notlike "169.254.*" 
} | Select-Object -First 1).IPAddress

if (-not $localIP) {
    Write-Host "ERROR: Could not find network IP address" -ForegroundColor Red
    Write-Host "Make sure you're connected to Wi-Fi`n" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "Your IP Address: " -NoNewline
Write-Host "$localIP" -ForegroundColor Yellow
Write-Host "`nMobile Access URL: " -NoNewline
Write-Host "http://${localIP}:3000/login.html`n" -ForegroundColor Cyan

# Check admin rights
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "============================================================" -ForegroundColor Yellow
    Write-Host "  FIREWALL SETUP REQUIRED" -ForegroundColor Red
    Write-Host "============================================================" -ForegroundColor Yellow
    Write-Host "`nTo allow mobile access, firewall rules must be configured." -ForegroundColor White
    Write-Host "`nPlease:" -ForegroundColor Yellow
    Write-Host "  1. Close this window" -ForegroundColor White
    Write-Host "  2. Right-click PowerShell" -ForegroundColor White
    Write-Host "  3. Select 'Run as Administrator'" -ForegroundColor White
    Write-Host "  4. Run this command:`n" -ForegroundColor White
    Write-Host "     cd '$PSScriptRoot'" -ForegroundColor Cyan
    Write-Host "     .\FIX-FIREWALL.ps1`n" -ForegroundColor Cyan
    Write-Host "  5. Then run this script again`n" -ForegroundColor White
    Write-Host "============================================================`n" -ForegroundColor Yellow
    pause
    exit
}

# If admin, configure firewall
Write-Host "Configuring Firewall Rules..." -ForegroundColor Cyan

Remove-NetFirewallRule -DisplayName "Attendance Tracker Frontend" -ErrorAction SilentlyContinue
Remove-NetFirewallRule -DisplayName "Attendance Tracker Backend" -ErrorAction SilentlyContinue

try {
    New-NetFirewallRule -DisplayName "Attendance Tracker Frontend" `
                        -Direction Inbound `
                        -LocalPort 3000 `
                        -Protocol TCP `
                        -Action Allow `
                        -Profile Any | Out-Null
    Write-Host "  ✓ Frontend port 3000 - Allowed" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Frontend rule failed" -ForegroundColor Red
}

try {
    New-NetFirewallRule -DisplayName "Attendance Tracker Backend" `
                        -Direction Inbound `
                        -LocalPort 3002 `
                        -Protocol TCP `
                        -Action Allow `
                        -Profile Any | Out-Null
    Write-Host "  ✓ Backend port 3002 - Allowed" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Backend rule failed" -ForegroundColor Red
}

Write-Host "`nStarting Servers..." -ForegroundColor Cyan

# Stop existing processes
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name python -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*3000*" } | Stop-Process -Force
Start-Sleep -Seconds 1

# Start backend
Write-Host "  → Starting Backend..." -ForegroundColor White
Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
cd '$PSScriptRoot\backend'
`$Host.UI.RawUI.WindowTitle = 'Attendance Backend (Port 3002)'
Write-Host '`n============================================================' -ForegroundColor Green
Write-Host '  BACKEND SERVER RUNNING' -ForegroundColor White
Write-Host '============================================================`n' -ForegroundColor Green
node server.js
"@

Start-Sleep -Seconds 3

# Start frontend
Write-Host "  → Starting Frontend..." -ForegroundColor White
Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
cd '$PSScriptRoot\frontend'
`$Host.UI.RawUI.WindowTitle = 'Attendance Frontend (Port 3000)'
Write-Host '`n============================================================' -ForegroundColor Green
Write-Host '  FRONTEND SERVER RUNNING' -ForegroundColor White
Write-Host '============================================================`n' -ForegroundColor Green
python -m http.server 3000
"@

Start-Sleep -Seconds 2

Write-Host "`n============================================================" -ForegroundColor Green
Write-Host "  ✓ SERVERS ARE RUNNING!" -ForegroundColor White
Write-Host "============================================================`n" -ForegroundColor Green

Write-Host "Access on Computer:" -ForegroundColor Yellow
Write-Host "  http://localhost:3000/login.html`n" -ForegroundColor White

Write-Host "Access on Mobile:" -ForegroundColor Yellow
Write-Host "  http://${localIP}:3000/login.html`n" -ForegroundColor Cyan

Write-Host "Login Credentials:" -ForegroundColor Yellow
Write-Host "  Admin:    admin / admin123" -ForegroundColor White
Write-Host "  Teacher:  teacher / teacher123" -ForegroundColor White
Write-Host "  Student:  student1 / student123`n" -ForegroundColor White

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "IMPORTANT: Your mobile device must be on the SAME Wi-Fi!" -ForegroundColor Yellow
Write-Host "============================================================`n" -ForegroundColor Cyan

# Open in browser
Start-Process "http://localhost:3000/login.html"

Write-Host "Opening in browser...`n" -ForegroundColor Green
Write-Host "Press any key to exit (servers will keep running)..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
