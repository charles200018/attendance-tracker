const API_URL = "http://127.0.0.1:3002/api";

// Utility functions for UI feedback
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="flex justify-center items-center p-6">
                <i class="fas fa-spinner fa-spin text-3xl text-purple-600 mr-3"></i>
                <span class="text-gray-600">Loading...</span>
            </div>
        `;
    }
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
            </div>
        `;
    }
}

function showSuccess(message) {
    if (typeof showToast === 'function') {
        showToast(message, 'success');
    }
}

// Class Management Functions
async function loadClasses() {
    try {
        console.log('[Classes] Loading...');
        showLoading('classesList');
        const response = await fetch(`${API_URL}/classes`);
        const classes = await response.json();
        console.log('[Classes] Loaded:', classes.length);
        
        // Update badge
        const badge = document.getElementById('class-badge');
        if (badge) badge.textContent = classes.length;
        
        const html = classes.map((c, index) => `
            <div class="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border-l-4 border-blue-500 hover-scale slide-in" style="animation-delay: ${index * 0.05}s">
                <div class="flex justify-between items-center">
                    <div>
                        <div class="font-bold text-lg text-blue-900">${c.name}</div>
                        <div class="text-sm text-blue-600">Class ID: ${c.id}</div>
                    </div>
                    <i class="fas fa-school text-2xl text-blue-400"></i>
                </div>
            </div>
        `).join('');
        
        document.getElementById('classesList').innerHTML = html || 
            '<div class="text-center py-8 text-gray-400"><i class="fas fa-inbox text-4xl mb-2"></i><p>No classes yet. Add one above!</p></div>';
        
        // Update selects
        updateClassSelects(classes);
            
    } catch (error) {
        console.error('[Classes] Error:', error);
        showError('classesList', 'Failed to load classes');
    }
}

function updateClassSelects(classes) {
    const selects = ['studentClass', 'class-select'];
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            select.innerHTML = '<option value="">Select Class</option>' +
                classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
        }
    });
}

// Student Management Functions
async function loadStudents() {
    try {
        const classId = document.getElementById('studentClass').value;
        const studentsList = document.getElementById('studentsList');
        
        if (!classId) {
            studentsList.innerHTML = '<div class="text-center py-8 text-gray-400"><i class="fas fa-user-graduate text-4xl mb-2"></i><p>Select a class to view students</p></div>';
            return;
        }
        
        showLoading('studentsList');
        const response = await fetch(`${API_URL}/students/${classId}`);
        const students = await response.json();
        
        // Update badge
        const badge = document.getElementById('student-badge');
        if (badge) {
            const allStudentsResponse = await fetch(`${API_URL}/students`);
            const allStudents = await allStudentsResponse.json();
            badge.textContent = allStudents.length;
        }
        
        const html = students.map((s, index) => `
            <div class="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-lg border-l-4 border-green-500 hover-scale slide-in" style="animation-delay: ${index * 0.05}s">
                <div class="flex justify-between items-center">
                    <div>
                        <div class="font-semibold text-green-900">${s.name}</div>
                        <div class="text-sm text-green-600">Roll: ${s.roll}</div>
                    </div>
                    <i class="fas fa-user-circle text-xl text-green-400"></i>
                </div>
            </div>
        `).join('');
        
        studentsList.innerHTML = html || 
            '<div class="text-center py-8 text-gray-400"><i class="fas fa-inbox text-4xl mb-2"></i><p>No students in this class yet</p></div>';
            
    } catch (error) {
        console.error('[Students] Error:', error);
        showError('studentsList', 'Failed to load students');
    }
}

async function addStudent() {
    const nameInput = document.getElementById('studentName');
    const rollInput = document.getElementById('studentRoll');
    const classSelect = document.getElementById('studentClass');
    
    const name = nameInput.value.trim();
    const roll = rollInput.value.trim();
    const class_id = classSelect.value;
    
    if (!name || !roll || !class_id) {
        showToast('Please fill in all fields', 'warning');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/students`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, roll, class_id })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to add student');
        }
        
        const newStudent = await response.json();
        nameInput.value = '';
        rollInput.value = '';
        
        await loadStudents();
        showSuccess(`✓ Student "${newStudent.name}" added successfully!`);
        
    } catch (error) {
        console.error('[Students] Add error:', error);
        showToast('Error: ' + error.message, 'error');
    }
}
    const name = nameInput.value.trim();
    const roll = rollInput.value.trim();
    const class_id = classSelect.value;
    
    if (!name || !roll || !class_id) {
        showError('studentsList', 'Please fill in all fields');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/students`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, roll, class_id })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to add student');
        }
        
        nameInput.value = '';
        rollInput.value = '';
        await loadStudents();
        showSuccess('studentsList', 'Student added successfully');
    } catch (error) {
        showError('studentsList', 'Error adding student: ' + error.message);
    }
}

function showError(elementId, message) {
    document.getElementById(elementId).innerHTML = `
        <div class="error-message">
            <p>${message}</p>
            <button onclick="location.reload()">Retry</button>
        </div>
    `;
}

function showSuccess(elementId, message) {
    const element = document.getElementById(elementId);
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    element.insertBefore(successDiv, element.firstChild);
    setTimeout(() => successDiv.remove(), 3000);
}

// Class Management
async function addClass() {
    console.log('Add class button clicked');
    const nameInput = document.getElementById('className');
    const name = nameInput.value.trim();
    const button = document.querySelector('button[onclick="addClass()"]');
    
    if (!name) {
        showError('classesList', 'Please enter a class name');
        return;
    }

    console.log('Attempting to add class:', name);
    console.log('API URL:', API_URL);
    
    try {
        button.disabled = true;
        button.textContent = 'Adding...';
        
        console.log('Making fetch request to:', `${API_URL}/classes`);
        const response = await fetch(`${API_URL}/classes`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ name })
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        const responseText = await response.text();
        console.log('Raw response:', responseText);
        
        if (!response.ok) {
            throw new Error(`Server returned ${response.status}: ${responseText}`);
        }
        
        try {
            const data = JSON.parse(responseText);
            console.log('Parsed response:', data);
        } catch (e) {
            console.error('Failed to parse response as JSON:', e);
        }
        
        nameInput.value = '';
        await loadClasses();
        showSuccess('classesList', 'Class added successfully');
    } catch (error) {
        showError('classesList', 'Error adding class: ' + error.message);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
    } finally {
        button.disabled = false;
        button.textContent = 'Add Class';
    }
}

// Modified renderAttendance function
async function renderAttendance() {
    try {
        showLoading('attendance');
        const response = await fetch(`${API_URL}/classes`);
        const classes = await response.json();
        
        if (classes.length === 0) {
            document.getElementById('attendance').innerHTML = `
                <div class="error-message">
                    <p>No classes found. Please add a class first.</p>
                </div>
            `;
            return;
        }

        let html = `
            <div class="form-group">
                <select id="class-select">
                    <option value="">Select Class</option>
                    ${classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                </select>
                <input id="date-select" type="date" />
                <button onclick="loadAttendanceForm()" class="load-btn">Load Attendance</button>
            </div>
            <div id="attendance-form"></div>
        `;
        document.getElementById('attendance').innerHTML = html;

        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date-select').value = today;
    } catch (error) {
        showError('attendance', 'Error loading classes: ' + error.message);
    }
}

window.loadAttendanceForm = async function () {
    const classId = document.getElementById('class-select').value;
    const date = document.getElementById('date-select').value;
    const formDiv = document.getElementById('attendance-form');
    
    if (!classId) {
        showError('attendance-form', 'Please select a class');
        return;
    }
    if (!date) {
        showError('attendance-form', 'Please select a date');
        return;
    }

    try {
        console.log('Loading attendance form for class:', classId, 'date:', date);
        showLoading('attendance-form');
        
        // Fetch students and attendance in parallel
        const [studentsResponse, attendanceResponse] = await Promise.all([
            fetch(`${API_URL}/students/${classId}`),
            fetch(`${API_URL}/attendance/${classId}/${date}`)
        ]);

        if (!studentsResponse.ok) {
            throw new Error('Failed to fetch students');
        }

        const students = await studentsResponse.json();
        console.log('Loaded students:', students);

        if (students.length === 0) {
            formDiv.innerHTML = `
                <div class="error-message">
                    <p>No students found in this class. Please add students first.</p>
                </div>
            `;
            return;
        }

        let existingAttendance = [];
        if (attendanceResponse.ok) {
            existingAttendance = await attendanceResponse.json();
            console.log('Loaded existing attendance:', existingAttendance);
        }

        let table = `
            <form id="mark-attendance" class="attendance-form">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Roll</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${students.map(s => {
                            const existing = existingAttendance.find(a => a.student_id === s.id);
                            const status = existing ? existing.status : 'present';
                            return `
                                <tr>
                                    <td>${s.name}</td>
                                    <td>${s.roll}</td>
                                    <td>
                                        <select name="status-${s.id}" class="status-select">
                                            <option value="present" ${status === 'present' ? 'selected' : ''}>Present</option>
                                            <option value="absent" ${status === 'absent' ? 'selected' : ''}>Absent</option>
                                            <option value="late" ${status === 'late' ? 'selected' : ''}>Late</option>
                                        </select>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
                <div class="form-actions">
                    <button type="submit" class="submit-btn">Submit Attendance</button>
                    <button type="button" onclick="markAllPresent()" class="secondary-btn">Mark All Present</button>
                    <button type="button" onclick="markAllAbsent()" class="secondary-btn">Mark All Absent</button>
                </div>
            </form>
        `;
        formDiv.innerHTML = table;

        document.getElementById('mark-attendance').onsubmit = async function(e) {
            e.preventDefault();
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            const form = e.target;

            try {
                // Disable all form elements during submission
                const formElements = form.querySelectorAll('button, select');
                formElements.forEach(el => el.disabled = true);
                submitBtn.textContent = 'Submitting...';

                const records = students.map(s => ({
                    student_id: s.id,
                    status: form.querySelector(`[name="status-${s.id}"]`).value
                }));

                console.log('Submitting attendance:', {
                    class_id: classId,
                    date,
                    records
                });

                const response = await fetch(`${API_URL}/attendance`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ class_id: classId, date, records })
                });

                console.log('Attendance submission response:', response.status);

                if (response.ok) {
                    const data = await response.json();
                    console.log('Attendance submitted successfully:', data);
                    showSuccess('attendance-form', 'Attendance submitted successfully!');
                    
                    // Reload the form to show updated data
                    await loadAttendanceForm();
                } else {
                    const data = await response.json();
                    console.error('Attendance submission failed:', data);
                    showError('attendance-form', `Error: ${data.error || 'Unknown error occurred'}`);
                }
            } catch (error) {
                console.error('Error submitting attendance:', error);
                showError('attendance-form', 'Error submitting attendance: ' + error.message);
            } finally {
                // Re-enable all form elements
                const formElements = form.querySelectorAll('button, select');
                formElements.forEach(el => el.disabled = false);
                submitBtn.textContent = originalText;
            }
        };
    } catch (error) {
        showError('attendance-form', 'Error loading students: ' + error.message);
    }
};

window.markAllPresent = function() {
    document.querySelectorAll('.status-select').forEach(select => select.value = 'present');
};

window.markAllAbsent = function() {
    document.querySelectorAll('.status-select').forEach(select => select.value = 'absent');
};

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('Page loaded, initializing...');
        
        // Test backend connection first
        await testBackendConnection();
        console.log('Backend connection verified');
        
        // Setup form submit handlers
        const classForm = document.querySelector('#class-management form');
        if (classForm) {
            classForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const nameInput = document.getElementById('className');
                const name = nameInput.value.trim();
                
                if (!name) {
                    showError('classesList', 'Please enter a class name');
                    return;
                }
                
                try {
                    console.log('Adding class:', name);
                    await addClass();
                    nameInput.value = '';
                    await loadClasses();
                    await renderAttendance();
                    showSuccess('classesList', 'Class added successfully');
                } catch (error) {
                    showError('classesList', 'Error adding class: ' + error.message);
                }
            });
            console.log('Class form handler attached');
        }
        
        const studentForm = document.querySelector('#student-management form');
        if (studentForm) {
            studentForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                try {
                    await addStudent();
                    await loadStudents();
                    showSuccess('studentsList', 'Student added successfully');
                } catch (error) {
                    showError('studentsList', 'Error adding student: ' + error.message);
                }
            });
            console.log('Student form handler attached');
        }
        
        // Load initial data
        console.log('Loading initial data...');
        await Promise.all([
            loadClasses(),
            renderAttendance()
        ]);
        
        // Set up event listeners
        const classSelect = document.getElementById('studentClass');
        if (classSelect) {
            classSelect.addEventListener('change', async () => {
                console.log('Class selection changed');
                await loadStudents();
            });
        }
        
        // Initialize datepicker to today's date
        const today = new Date().toISOString().split('T')[0];
        const dateInputs = document.querySelectorAll('input[type="date"]');
        dateInputs.forEach(input => {
            input.value = today;
            input.max = today;
        });

        // Set up attendance form load handler
        const attendanceClassSelect = document.getElementById('class-select');
        if (attendanceClassSelect) {
            attendanceClassSelect.addEventListener('change', async () => {
                console.log('Attendance class selection changed');
                const dateSelect = document.getElementById('date-select');
                if (dateSelect && dateSelect.value) {
                    await loadAttendanceForm();
                }
            });
        }

        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Error during initialization:', error);
        document.getElementById('app').innerHTML = `
            <div class="error-message">
                <h3>Application Error</h3>
                <p>${error.message}</p>
                <button onclick="window.location.reload()">Retry</button>
            </div>
        `;
    }
});

// Test backend connection
async function testBackendConnection() {
    try {
        const response = await fetch(`${API_URL}/test`);
        if (!response.ok) {
            throw new Error('Backend server is not responding');
        }
        console.log('Backend connection successful');
    } catch (error) {
        throw new Error('Cannot connect to backend server. Please ensure the server is running.');
    }
}