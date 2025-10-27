const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const os = require('os');
const PORT = 3002;

// Use temp directory to avoid OneDrive sync issues
const dbPath = path.join(os.tmpdir(), 'attendance-tracker-db.json');

// Global error handler
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        error: 'Internal server error', 
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined 
    });
};

// Initialize db.json if it doesn't exist
async function initializeDb() {
    try {
        console.log('Checking database at:', dbPath);
        try {
            await fs.access(dbPath);
            console.log('Database file exists');
            const data = await fs.readFile(dbPath, 'utf8');
            const db = JSON.parse(data);
            if (!db.classes || !db.students || !db.attendance) {
                throw new Error('Invalid database structure');
            }
            console.log('Database structure is valid');
        } catch (error) {
            console.log('Creating new database file with sample data');
            const initialData = {
                classes: [{ id: 1, name: 'Class A' }],
                students: [{ id: 1, name: 'John Doe', roll: '101', class_id: 1 }],
                attendance: [{
                    id: 1,
                    student_id: 1,
                    class_id: 1,
                    date: '2025-10-26',
                    status: 'present',
                    timestamp: '2025-10-26T10:00:00Z'
                }]
            };
            fsSync.writeFileSync(dbPath, JSON.stringify(initialData, null, 2), 'utf8');
            console.log('New database file created');
        }
    } catch (error) {
        console.error('Database initialization error:', error);
        throw error;
    }
}

// Helper function to read the database
async function readDb() {
  const data = await fs.readFile(dbPath, 'utf8');
  return JSON.parse(data);
}

// Helper function to write to the database
function writeDb(data) {
  fsSync.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
}

const app = express();

// Detailed request logging middleware
app.use((req, res, next) => {
    console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Configure CORS with more specific settings
app.use(cors({
    origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Accept']
}));

// Parse JSON bodies with size limit
app.use(express.json({ limit: '1mb' }));

// Single response logging middleware
app.use((req, res, next) => {
    const originalJson = res.json;
    res.json = function(data) {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} Response:`, data);
        return originalJson.call(this, data);
    };
    next();
});

console.log('Setting up JSON database...');

app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Test endpoint for connection verification
app.get('/api/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ status: 'ok', message: 'Connection successful' });
});

// Enable more detailed logging
app.use((req, res, next) => {
    console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Request Headers:', req.headers);
    console.log('Request Body:', req.body);
    next();
});

// Classes endpoints
app.post('/api/classes', async (req, res) => {
  try {
    const { name } = req.body;
    const db = await readDb();
    const newClass = { id: db.classes.length + 1, name };
    db.classes.push(newClass);
    writeDb(db);
    res.json(newClass);
  } catch (error) {
    console.error('Error creating class:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/classes', async (req, res) => {
  try {
    const db = await readDb();
    res.json(db.classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: error.message });
  }
});

// Students endpoints
app.post('/api/students', async (req, res) => {
  try {
    const { name, roll, class_id } = req.body;
    console.log('Creating student:', name);
    
    const db = await readDb();
    
    // Validate class exists
    const classExists = db.classes.some(c => c.id === parseInt(class_id));
    if (!classExists) {
      return res.status(400).json({ error: 'Class not found' });
    }
    
    // Check for duplicate roll number in the same class
    const rollExists = db.students.some(s => 
      s.class_id === parseInt(class_id) && s.roll === roll
    );
    if (rollExists) {
      return res.status(400).json({ error: 'Roll number already exists in this class' });
    }
    
    const newStudent = {
      id: db.students.length + 1,
      name,
      roll,
      class_id: parseInt(class_id)
    };
    
    db.students.push(newStudent);
    writeDb(db);
    
    res.json(newStudent);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/students', async (req, res) => {
  try {
    console.log('Fetching students...');
    const db = await readDb();
    res.json(db.students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get students by class ID
app.get('/api/students/:classId', async (req, res) => {
  try {
    const classId = parseInt(req.params.classId);
    console.log('Fetching students for class:', classId);
    
    const db = await readDb();
    const classStudents = db.students.filter(s => s.class_id === classId);
    res.json(classStudents);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: error.message });
  }
});

// Attendance endpoints
app.post('/api/attendance', async (req, res) => {
  try {
    const { class_id, date, records } = req.body;
    
    if (!Array.isArray(records)) {
      return res.status(400).json({ error: 'Records should be an array' });
    }
    
    const db = await readDb();
    
    // Validate class exists
    const classExists = db.classes.some(c => c.id === parseInt(class_id));
    if (!classExists) {
      return res.status(400).json({ error: 'Class not found' });
    }
    
    // Process each attendance record
    for (const record of records) {
      const { student_id, status } = record;
      
      // Validate student exists and belongs to the class
      const student = db.students.find(s => 
        s.id === parseInt(student_id) && s.class_id === parseInt(class_id)
      );
      if (!student) {
        return res.status(400).json({ 
          error: `Student ${student_id} not found in class ${class_id}` 
        });
      }
      
      const existingIndex = db.attendance.findIndex(
        a => a.student_id === parseInt(student_id) && 
             a.class_id === parseInt(class_id) && 
             a.date === date
      );
      
      if (existingIndex !== -1) {
        db.attendance[existingIndex].status = status;
      } else {
        const newAttendance = {
          id: db.attendance.length + 1,
          student_id: parseInt(student_id),
          class_id: parseInt(class_id),
          date,
          status,
          timestamp: new Date().toISOString()
        };
        db.attendance.push(newAttendance);
      }
    }
    
    writeDb(db);
    res.json({ success: true, message: 'Attendance recorded successfully' });
  } catch (error) {
    console.error('Error recording attendance:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/attendance', async (req, res) => {
  try {
    console.log('Fetching all attendance records...');
    const db = await readDb();
    res.json(db.attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get attendance by class and date
app.get('/api/attendance/:classId/:date', async (req, res) => {
  try {
    const classId = parseInt(req.params.classId);
    const date = req.params.date;
    
    console.log(`Fetching attendance for class ${classId} on ${date}`);
    
    const db = await readDb();
    const records = db.attendance.filter(
      a => a.class_id === classId && a.date === date
    );
    
    res.json(records);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add request logging
app.use((req, res, next) => {
    console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    next();
});

// Add error handler middleware last
app.use(errorHandler);

async function startServer() {
    try {
        console.log('Initializing server...');
        await initializeDb();
        console.log('Database initialized successfully');

        app.listen(PORT, '127.0.0.1', () => {
            console.log(`Server is running on http://127.0.0.1:${PORT}`);
            console.log('Ready to accept requests');
        });
    } catch (error) {
        console.error('Server startup failed:', error);
        process.exit(1);
    }
}

// Start the server
startServer().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});