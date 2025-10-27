# ======================================================================
# ATTENDANCE TRACKER - AUTOMATIC CLEANUP SCRIPT
# ======================================================================
# This script will create a clean version of the attendance tracker
# with ONLY the essential 7 files needed.
# ======================================================================

Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "  ATTENDANCE TRACKER - CLEANUP SCRIPT" -ForegroundColor Cyan
Write-Host "================================================`n" -ForegroundColor Cyan

$source = "c:\Users\ichar\OneDrive\Documents\GitHub\attendance-tracker"
$dest = "c:\Users\ichar\OneDrive\Documents\GitHub\attendance-tracker-CLEAN"

Write-Host "Creating clean project structure..." -ForegroundColor Yellow

# Create directories
New-Item -ItemType Directory -Force -Path "$dest\backend" | Out-Null
New-Item -ItemType Directory -Force -Path "$dest\frontend" | Out-Null

# ======================================================================
# COPY CLEAN FILES
# ======================================================================

Write-Host "`nCopying essential files..." -ForegroundColor Yellow

# Frontend - Only main.html renamed to index.html
Copy-Item "$source\frontend\main.html" "$dest\frontend\index.html" -Force
Write-Host "  ✓ frontend/index.html" -ForegroundColor Green

# Backend - Clean versions
Copy-Item "$source\backend\server-clean.js" "$dest\backend\server.js" -Force -ErrorAction SilentlyContinue
if (-not (Test-Path "$dest\backend\server.js")) {
    Copy-Item "$source\backend\server.js" "$dest\backend\server.js" -Force
}
Write-Host "  ✓ backend/server.js" -ForegroundColor Green

Copy-Item "$source\backend\init-db-clean.js" "$dest\backend\init-db.js" -Force -ErrorAction SilentlyContinue
if (-not (Test-Path "$dest\backend\init-db.js")) {
    # Create simple init-db.js if clean version doesn't exist
    @"
const fs = require('fs');
const path = require('path');
const os = require('os');

const dbPath = path.join(os.tmpdir(), 'attendance-tracker-db.json');

const sampleData = {
    classes: [
        { id: 1730000001, name: 'Mathematics 101' },
        { id: 1730000002, name: 'Physics 201' }
    ],
    students: [
        { id: 1730000101, name: 'Alice Johnson', roll: '001', class_id: 1730000001 },
        { id: 1730000102, name: 'Bob Smith', roll: '002', class_id: 1730000001 }
    ],
    attendance: []
};

fs.writeFileSync(dbPath, JSON.stringify(sampleData, null, 2));
console.log('✓ Sample data initialized at:', dbPath);
"@ | Out-File -FilePath "$dest\backend\init-db.js" -Encoding UTF8
}
Write-Host "  ✓ backend/init-db.js" -ForegroundColor Green

Copy-Item "$source\backend\package.json" "$dest\backend\package.json" -Force
Write-Host "  ✓ backend/package.json" -ForegroundColor Green

# Documentation
Copy-Item "$source\README-SIMPLE.md" "$dest\README.md" -Force -ErrorAction SilentlyContinue
if (-not (Test-Path "$dest\README.md")) {
    Copy-Item "$source\README.md" "$dest\README.md" -Force
}
Write-Host "  ✓ README.md" -ForegroundColor Green

Copy-Item "$source\PROJECT-DOCUMENTATION.md" "$dest\PROJECT-DOCUMENTATION.md" -Force
Write-Host "  ✓ PROJECT-DOCUMENTATION.md" -ForegroundColor Green

# ======================================================================
# SUMMARY
# ======================================================================

Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "  CLEANUP COMPLETE!" -ForegroundColor Cyan
Write-Host "================================================`n" -ForegroundColor Cyan

Write-Host "Clean project created at:" -ForegroundColor Yellow
Write-Host "  $dest`n" -ForegroundColor White

Write-Host "Final structure (7 files):" -ForegroundColor Yellow
Write-Host "  attendance-tracker-CLEAN/" -ForegroundColor White
Write-Host "  ├── README.md" -ForegroundColor Green
Write-Host "  ├── PROJECT-DOCUMENTATION.md" -ForegroundColor Green
Write-Host "  ├── backend/" -ForegroundColor White
Write-Host "  │   ├── server.js" -ForegroundColor Green
Write-Host "  │   ├── init-db.js" -ForegroundColor Green
Write-Host "  │   └── package.json" -ForegroundColor Green
Write-Host "  └── frontend/" -ForegroundColor White
Write-Host "      └── index.html" -ForegroundColor Green

Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "  1. cd attendance-tracker-CLEAN\backend" -ForegroundColor White
Write-Host "  2. npm install" -ForegroundColor White
Write-Host "  3. node server.js" -ForegroundColor White
Write-Host "  4. Open new terminal: cd ..\frontend" -ForegroundColor White
Write-Host "  5. python -m http.server 3000" -ForegroundColor White
Write-Host "  6. Browse to: http://127.0.0.1:3000/index.html`n" -ForegroundColor White

Write-Host "================================================`n" -ForegroundColor Cyan
