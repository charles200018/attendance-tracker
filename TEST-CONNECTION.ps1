# Test Connection Script
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  CONNECTION TEST" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

# Get IP
$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -notlike "169.254.*" } | Select-Object -First 1).IPAddress

Write-Host "Your IP Address: $localIP`n" -ForegroundColor Yellow

# Test Backend
Write-Host "Testing Backend Server..." -ForegroundColor Cyan
try {
    $backend = Invoke-RestMethod -Uri "http://127.0.0.1:3002/api/test" -TimeoutSec 3
    Write-Host "  Local (127.0.0.1):  " -NoNewline -ForegroundColor White
    Write-Host "✓ WORKING" -ForegroundColor Green
} catch {
    Write-Host "  Local (127.0.0.1):  " -NoNewline -ForegroundColor White
    Write-Host "✗ NOT WORKING" -ForegroundColor Red
    Write-Host "    Error: $_" -ForegroundColor Red
}

try {
    $backendNetwork = Invoke-RestMethod -Uri "http://${localIP}:3002/api/test" -TimeoutSec 3
    Write-Host "  Network ($localIP):  " -NoNewline -ForegroundColor White
    Write-Host "✓ WORKING" -ForegroundColor Green
} catch {
    Write-Host "  Network ($localIP):  " -NoNewline -ForegroundColor White
    Write-Host "✗ NOT WORKING" -ForegroundColor Red
    Write-Host "    Error: $_" -ForegroundColor Red
}

Write-Host "`nTesting Frontend Server..." -ForegroundColor Cyan
try {
    $frontend = Invoke-WebRequest -Uri "http://127.0.0.1:3000/login.html" -TimeoutSec 3 -UseBasicParsing
    Write-Host "  Local (127.0.0.1):  " -NoNewline -ForegroundColor White
    Write-Host "✓ WORKING" -ForegroundColor Green
} catch {
    Write-Host "  Local (127.0.0.1):  " -NoNewline -ForegroundColor White
    Write-Host "✗ NOT WORKING" -ForegroundColor Red
}

try {
    $frontendNetwork = Invoke-WebRequest -Uri "http://${localIP}:3000/login.html" -TimeoutSec 3 -UseBasicParsing
    Write-Host "  Network ($localIP):  " -NoNewline -ForegroundColor White
    Write-Host "✓ WORKING" -ForegroundColor Green
} catch {
    Write-Host "  Network ($localIP):  " -NoNewline -ForegroundColor White
    Write-Host "✗ NOT WORKING" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "If Network tests fail, run this command" -ForegroundColor Yellow
Write-Host "as Administrator to allow firewall access:" -ForegroundColor Yellow
Write-Host "`nNew-NetFirewallRule -DisplayName 'Attendance Frontend' -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow" -ForegroundColor White
Write-Host "New-NetFirewallRule -DisplayName 'Attendance Backend' -Direction Inbound -LocalPort 3002 -Protocol TCP -Action Allow" -ForegroundColor White
Write-Host "`n========================================`n" -ForegroundColor Cyan

Write-Host "Mobile Access URL:" -ForegroundColor Green
Write-Host "http://${localIP}:3000/login.html`n" -ForegroundColor Cyan

pause
