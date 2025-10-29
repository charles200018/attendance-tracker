# Fix Firewall for Mobile Access
# Run this script as Administrator

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  FIREWALL CONFIGURATION" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if running as admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "`nRight-click on PowerShell and select 'Run as Administrator'`n" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "Adding firewall rules for mobile access...`n" -ForegroundColor Yellow

# Remove existing rules if they exist
Write-Host "Removing old rules (if any)..." -ForegroundColor Cyan
Remove-NetFirewallRule -DisplayName "Attendance Tracker Frontend" -ErrorAction SilentlyContinue
Remove-NetFirewallRule -DisplayName "Attendance Tracker Backend" -ErrorAction SilentlyContinue

# Add new rules
Write-Host "Creating new firewall rules..." -ForegroundColor Cyan

try {
    New-NetFirewallRule -DisplayName "Attendance Tracker Frontend" `
                        -Direction Inbound `
                        -LocalPort 3000 `
                        -Protocol TCP `
                        -Action Allow `
                        -Profile Any `
                        -Description "Allow access to Attendance Tracker frontend on port 3000"
    
    Write-Host "  ✓ Frontend (port 3000) - ALLOWED" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Frontend rule failed: $_" -ForegroundColor Red
}

try {
    New-NetFirewallRule -DisplayName "Attendance Tracker Backend" `
                        -Direction Inbound `
                        -LocalPort 3002 `
                        -Protocol TCP `
                        -Action Allow `
                        -Profile Any `
                        -Description "Allow access to Attendance Tracker backend on port 3002"
    
    Write-Host "  ✓ Backend (port 3002) - ALLOWED" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Backend rule failed: $_" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Firewall configuration complete!" -ForegroundColor Green
Write-Host "You can now access the app from mobile devices" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -notlike "169.254.*" } | Select-Object -First 1).IPAddress
Write-Host "Mobile URL: http://${localIP}:3000/login.html`n" -ForegroundColor Cyan

pause
