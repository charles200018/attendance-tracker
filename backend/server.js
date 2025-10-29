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
            // Add users array if it doesn't exist
            if (!db.users) {
                console.log('Adding user accounts for existing database...');
                // Get all existing students from the database
                const studentUsers = db.students.slice(0, 10).map((student, index) => ({
                    id: index + 2,
                    username: `student${index + 1}`,
                    password: 'student123',
                    role: 'student',
                    name: student.name,
                    student_id: student.id
                }));
                
                db.users = [
                    { id: 1, username: 'admin', password: 'admin123', role: 'admin', name: 'System Administrator' },
                    { id: 2, username: 'teacher', password: 'teacher123', role: 'teacher', name: 'John Teacher' },
                    ...studentUsers.map(u => ({ ...u, id: u.id + 1 }))
                ];
                db.activityLogs = [];
                fsSync.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
                console.log(`Added ${db.users.length} users to existing database`);
            }
            // Add activityLogs array if it doesn't exist
            if (!db.activityLogs) {
                db.activityLogs = [];
                fsSync.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
                console.log('Added activity logs to database');
            }
            console.log('Database structure is valid');
        } catch (error) {
            console.log('Creating new database file with sample data');
            const initialData = {
                users: [
                    { id: 1, username: 'admin', password: 'admin123', role: 'admin', name: 'System Administrator' },
                    { id: 2, username: 'teacher', password: 'teacher123', role: 'teacher', name: 'John Teacher' },
                    { id: 3, username: 'student1', password: 'student123', role: 'student', name: 'John Doe', student_id: 1 },
                    { id: 4, username: 'student2', password: 'student123', role: 'student', name: 'Jane Smith', student_id: 2 },
                    { id: 5, username: 'student3', password: 'student123', role: 'student', name: 'Alice Johnson', student_id: 3 },
                    { id: 6, username: 'student4', password: 'student123', role: 'student', name: 'Bob Williams', student_id: 4 },
                    { id: 7, username: 'student5', password: 'student123', role: 'student', name: 'Charlie Brown', student_id: 5 }
                ],
                activityLogs: [],
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

// ============================================
// AUTHENTICATION ENDPOINTS
// ============================================

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    console.log('Login attempt:', username, 'from', ipAddress);
    
    const db = await readDb();
    const user = db.users?.find(u => u.username === username && u.password === password);
    
    // Log activity
    const logEntry = {
      id: (db.activityLogs?.length || 0) + 1,
      timestamp: new Date().toISOString(),
      type: user ? 'login_success' : 'login_failed',
      username: username,
      ipAddress: ipAddress,
      userAgent: req.get('user-agent'),
      details: user ? `Successful login as ${user.role}` : `Failed login attempt - Invalid credentials`
    };
    
    if (!db.activityLogs) db.activityLogs = [];
    db.activityLogs.push(logEntry);
    writeDb(db);
    
    if (user) {
      // Don't send password back
      const { password, ...userWithoutPassword } = user;
      console.log('Login successful:', username, 'Role:', user.role);
      res.json({ 
        success: true, 
        user: userWithoutPassword 
      });
    } else {
      console.log('Login failed: Invalid credentials for', username);
      res.status(401).json({ 
        success: false, 
        message: 'Invalid username or password' 
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ADMIN ENDPOINTS
// ============================================

// Get all activity logs (admin only)
app.get('/api/admin/activity-logs', async (req, res) => {
  try {
    const db = await readDb();
    res.json(db.activityLogs || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users with passwords (admin only)
app.get('/api/admin/users', async (req, res) => {
  try {
    const db = await readDb();
    res.json(db.users || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get system statistics (admin only)
app.get('/api/admin/stats', async (req, res) => {
  try {
    const db = await readDb();
    const stats = {
      totalUsers: db.users?.length || 0,
      totalClasses: db.classes?.length || 0,
      totalStudents: db.students?.length || 0,
      totalAttendance: db.attendance?.length || 0,
      totalActivityLogs: db.activityLogs?.length || 0,
      usersByRole: {
        admin: db.users?.filter(u => u.role === 'admin').length || 0,
        teacher: db.users?.filter(u => u.role === 'teacher').length || 0,
        student: db.users?.filter(u => u.role === 'student').length || 0
      },
      recentActivity: db.activityLogs?.slice(-10).reverse() || []
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear activity logs (admin only)
app.delete('/api/admin/activity-logs', async (req, res) => {
  try {
    const db = await readDb();
    db.activityLogs = [];
    writeDb(db);
    res.json({ success: true, message: 'Activity logs cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// EXISTING ENDPOINTS
// ============================================

// Get current user info (for session persistence)
app.get('/api/user/:id', async (req, res) => {
  try {
    const db = await readDb();
    const user = db.users?.find(u => u.id === parseInt(req.params.id));
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: error.message });
  }
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

// ============ ADMIN CRUD ENDPOINTS ============

// USER MANAGEMENT
app.put('/api/admin/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { field, value } = req.body;
    
    const db = await readDb();
    const userIndex = db.users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update the specific field
    if (field === 'username' || field === 'password' || field === 'name' || field === 'role' || field === 'student_id') {
      db.users[userIndex][field] = value;
      writeDb(db);
      res.json({ success: true, user: db.users[userIndex] });
    } else {
      res.status(400).json({ error: 'Invalid field' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admin/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const db = await readDb();
    
    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    db.users.splice(userIndex, 1);
    writeDb(db);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/users', async (req, res) => {
  try {
    const { username, password, name, role, student_id } = req.body;
    
    const db = await readDb();
    
    // Check if username exists
    if (db.users.some(u => u.username === username)) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    
    const newUser = {
      id: Math.max(...db.users.map(u => u.id), 0) + 1,
      username,
      password,
      name,
      role,
      student_id: student_id || ''
    };
    
    db.users.push(newUser);
    writeDb(db);
    res.json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: error.message });
  }
});

// CLASS MANAGEMENT
app.put('/api/classes/:id', async (req, res) => {
  try {
    const classId = parseInt(req.params.id);
    const { name } = req.body;
    
    const db = await readDb();
    const classIndex = db.classes.findIndex(c => c.id === classId);
    
    if (classIndex === -1) {
      return res.status(404).json({ error: 'Class not found' });
    }
    
    db.classes[classIndex].name = name;
    writeDb(db);
    res.json({ success: true, class: db.classes[classIndex] });
  } catch (error) {
    console.error('Error updating class:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/classes/:id', async (req, res) => {
  try {
    const classId = parseInt(req.params.id);
    const db = await readDb();
    
    const classIndex = db.classes.findIndex(c => c.id === classId);
    if (classIndex === -1) {
      return res.status(404).json({ error: 'Class not found' });
    }
    
    db.classes.splice(classIndex, 1);
    writeDb(db);
    res.json({ success: true, message: 'Class deleted' });
  } catch (error) {
    console.error('Error deleting class:', error);
    res.status(500).json({ error: error.message });
  }
});

// STUDENT MANAGEMENT
app.put('/api/students/:id', async (req, res) => {
  try {
    const studentId = parseInt(req.params.id);
    const { name, roll, class_id } = req.body;
    
    const db = await readDb();
    const studentIndex = db.students.findIndex(s => s.id === studentId);
    
    if (studentIndex === -1) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    db.students[studentIndex].name = name;
    db.students[studentIndex].roll = roll;
    db.students[studentIndex].class_id = class_id;
    
    writeDb(db);
    res.json({ success: true, student: db.students[studentIndex] });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    const studentId = parseInt(req.params.id);
    const db = await readDb();
    
    const studentIndex = db.students.findIndex(s => s.id === studentId);
    if (studentIndex === -1) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    // Also delete related attendance records
    db.attendance = db.attendance.filter(a => a.student_id !== studentId);
    db.students.splice(studentIndex, 1);
    
    writeDb(db);
    res.json({ success: true, message: 'Student and related attendance deleted' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: error.message });
  }
});

// ATTENDANCE MANAGEMENT
app.put('/api/attendance/:id', async (req, res) => {
  try {
    const attendanceId = parseInt(req.params.id);
    const { field, value } = req.body;
    
    const db = await readDb();
    const attendanceIndex = db.attendance.findIndex(a => a.id === attendanceId);
    
    if (attendanceIndex === -1) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }
    
    if (field === 'status') {
      db.attendance[attendanceIndex].status = value;
      writeDb(db);
      res.json({ success: true, attendance: db.attendance[attendanceIndex] });
    } else {
      res.status(400).json({ error: 'Invalid field' });
    }
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/attendance/:id', async (req, res) => {
  try {
    const attendanceId = parseInt(req.params.id);
    const db = await readDb();
    
    const attendanceIndex = db.attendance.findIndex(a => a.id === attendanceId);
    if (attendanceIndex === -1) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }
    
    db.attendance.splice(attendanceIndex, 1);
    writeDb(db);
    res.json({ success: true, message: 'Attendance record deleted' });
  } catch (error) {
    console.error('Error deleting attendance:', error);
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