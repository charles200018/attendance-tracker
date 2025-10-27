const fs = require('fs');
const path = require('path');
const os = require('os');

const dbPath = path.join(os.tmpdir(), 'attendance-tracker-db.json');

// Sample data
const sampleData = {
    classes: [
        { id: 1730000001, name: 'Mathematics 101' },
        { id: 1730000002, name: 'Physics 201' },
        { id: 1730000003, name: 'Chemistry 101' }
    ],
    students: [
        { id: 1730000101, name: 'Alice Johnson', roll: '001', class_id: 1730000001 },
        { id: 1730000102, name: 'Bob Smith', roll: '002', class_id: 1730000001 },
        { id: 1730000103, name: 'Carol Williams', roll: '003', class_id: 1730000001 },
        { id: 1730000104, name: 'David Brown', roll: '001', class_id: 1730000002 },
        { id: 1730000105, name: 'Eve Davis', roll: '002', class_id: 1730000002 }
    ],
    attendance: [
        {
            id: 1730000201,
            student_id: 1730000101,
            class_id: 1730000001,
            date: '2025-10-27',
            status: 'present',
            timestamp: '2025-10-27T09:00:00Z'
        },
        {
            id: 1730000202,
            student_id: 1730000102,
            class_id: 1730000001,
            date: '2025-10-27',
            status: 'present',
            timestamp: '2025-10-27T09:00:00Z'
        },
        {
            id: 1730000203,
            student_id: 1730000103,
            class_id: 1730000001,
            date: '2025-10-27',
            status: 'absent',
            timestamp: '2025-10-27T09:00:00Z'
        }
    ]
};

// Write sample data to database
fs.writeFileSync(dbPath, JSON.stringify(sampleData, null, 2));

console.log('✓ Sample data initialized');
console.log(`✓ Database location: ${dbPath}`);
console.log(`✓ Classes: ${sampleData.classes.length}`);
console.log(`✓ Students: ${sampleData.students.length}`);
console.log(`✓ Attendance records: ${sampleData.attendance.length}`);
