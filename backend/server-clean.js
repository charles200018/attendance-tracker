const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const os = require('os');

const PORT = 3002;
const dbPath = path.join(os.tmpdir(), 'attendance-tracker-db.json');

const app = express();

// ============================================
// MIDDLEWARE
// ============================================

// CORS
app.use(cors({
    origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
    credentials: true
}));

// Body parser
app.use(express.json());

// Request logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// ============================================
// DATABASE UTILITIES
// ============================================

async function initializeDb() {
    try {
        await fs.access(dbPath);
        console.log('✓ Database file exists');
    } catch {
        console.log('Creating new database...');
        const initialData = {
            classes: [],
            students: [],
            attendance: []
        };
        fsSync.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
        console.log('✓ Database created');
    }
}

async function readDb() {
    const data = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(data);
}

function writeDb(data) {
    fsSync.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// ============================================
// API ROUTES
// ============================================

// Health check
app.get('/api/test', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Backend is working!',
        timestamp: new Date().toISOString()
    });
});

// ===== CLASSES =====

app.get('/api/classes', async (req, res) => {
    try {
        const db = await readDb();
        res.json(db.classes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/classes', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name?.trim()) {
            return res.status(400).json({ error: 'Class name is required' });
        }

        const db = await readDb();
        const newClass = {
            id: Date.now(),
            name: name.trim()
        };
        db.classes.push(newClass);
        writeDb(db);
        res.json(newClass);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===== STUDENTS =====

app.get('/api/students', async (req, res) => {
    try {
        const db = await readDb();
        res.json(db.students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/students/:classId', async (req, res) => {
    try {
        const classId = parseInt(req.params.classId);
        const db = await readDb();
        const students = db.students.filter(s => s.class_id === classId);
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/students', async (req, res) => {
    try {
        const { name, roll, class_id } = req.body;
        
        if (!name?.trim() || !roll?.trim() || !class_id) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const db = await readDb();
        
        // Check if class exists
        const classExists = db.classes.some(c => c.id === parseInt(class_id));
        if (!classExists) {
            return res.status(400).json({ error: 'Class not found' });
        }
        
        // Check duplicate roll number
        const rollExists = db.students.some(s => 
            s.class_id === parseInt(class_id) && s.roll === roll.trim()
        );
        if (rollExists) {
            return res.status(400).json({ error: 'Roll number already exists in this class' });
        }
        
        const newStudent = {
            id: Date.now(),
            name: name.trim(),
            roll: roll.trim(),
            class_id: parseInt(class_id)
        };
        
        db.students.push(newStudent);
        writeDb(db);
        res.json(newStudent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===== ATTENDANCE =====

app.get('/api/attendance', async (req, res) => {
    try {
        const db = await readDb();
        res.json(db.attendance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/attendance/:classId/:date', async (req, res) => {
    try {
        const classId = parseInt(req.params.classId);
        const { date } = req.params;
        
        const db = await readDb();
        const records = db.attendance.filter(
            a => a.class_id === classId && a.date === date
        );
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/attendance', async (req, res) => {
    try {
        const { class_id, date, records } = req.body;
        
        if (!Array.isArray(records) || records.length === 0) {
            return res.status(400).json({ error: 'Records must be a non-empty array' });
        }
        
        const db = await readDb();
        
        // Process each record
        for (const record of records) {
            const { student_id, status } = record;
            
            // Find existing record
            const existingIndex = db.attendance.findIndex(
                a => a.student_id === parseInt(student_id) && 
                     a.class_id === parseInt(class_id) && 
                     a.date === date
            );
            
            if (existingIndex !== -1) {
                // Update existing
                db.attendance[existingIndex].status = status;
            } else {
                // Create new
                db.attendance.push({
                    id: Date.now() + Math.random(),
                    student_id: parseInt(student_id),
                    class_id: parseInt(class_id),
                    date,
                    status,
                    timestamp: new Date().toISOString()
                });
            }
        }
        
        writeDb(db);
        res.json({ message: 'Attendance recorded successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// ============================================
// START SERVER
// ============================================

async function start() {
    try {
        await initializeDb();
        app.listen(PORT, '127.0.0.1', () => {
            console.log(`\n✓ Server running on http://127.0.0.1:${PORT}`);
            console.log(`✓ Database: ${dbPath}\n`);
        });
    } catch (error) {
        console.error('✗ Server failed to start:', error);
        process.exit(1);
    }
}

start();
