const API_URL = "http://127.0.0.1:3000/api";

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

// Class Management
async function addClass() {
    console.log('[Classes] Add class button clicked');
    const nameInput = document.getElementById('className');
    const name = nameInput.value.trim();
    
    if (!name) {
        showToast('Please enter a class name', 'warning');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/classes`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ name })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to add class');
        }
        
        const newClass = await response.json();
        nameInput.value = '';
        
        await loadClasses();
        await renderAttendance();
        
        showSuccess(`✓ Class "${newClass.name}" added successfully!`);
        
    } catch (error) {
        console.error('[Classes] Add error:', error);
        showToast('Error: ' + error.message, 'error');
    }
}

// Attendance Functions
async function renderAttendance() {
    try {
        showLoading('attendance');
        const response = await fetch(`${API_URL}/classes`);
        const classes = await response.json();
        
        if (classes.length === 0) {
            document.getElementById('attendance').innerHTML = `
                <div class="text-center py-12 text-gray-400">
                    <i class="fas fa-clipboard-list text-6xl mb-4"></i>
                    <p class="text-lg">No classes found. Please add a class first.</p>
                </div>
            `;
            return;
        }

        let html = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <select id="class-select" onchange="loadAttendanceForm()"
                        class="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none">
                    <option value="">Select Class</option>
                    ${classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                </select>
                <input id="date-select" type="date" onchange="loadAttendanceForm()"
                       class="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none" />
            </div>
            <div id="attendance-form"></div>
        `;
        document.getElementById('attendance').innerHTML = html;

        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date-select').value = today;
        document.getElementById('date-select').max = today;
        
    } catch (error) {
        showError('attendance', 'Error loading attendance form: ' + error.message);
    }
}

window.loadAttendanceForm = async function () {
    const classId = document.getElementById('class-select').value;
    const date = document.getElementById('date-select').value;
    const formDiv = document.getElementById('attendance-form');
    
    if (!classId) {
        formDiv.innerHTML = '<div class="text-center py-8 text-gray-400"><i class="fas fa-hand-pointer text-4xl mb-2"></i><p>Please select a class</p></div>';
        return;
    }
    if (!date) {
        formDiv.innerHTML = '<div class="text-center py-8 text-gray-400"><i class="fas fa-calendar text-4xl mb-2"></i><p>Please select a date</p></div>';
        return;
    }

    try {
        console.log('[Attendance] Loading form for class:', classId, 'date:', date);
        showLoading('attendance-form');
        
        const [studentsResponse, attendanceResponse] = await Promise.all([
            fetch(`${API_URL}/students/${classId}`),
            fetch(`${API_URL}/attendance/${classId}/${date}`)
        ]);

        if (!studentsResponse.ok) {
            throw new Error('Failed to fetch students');
        }

        const students = await studentsResponse.json();

        if (students.length === 0) {
            formDiv.innerHTML = `
                <div class="text-center py-12 text-gray-400">
                    <i class="fas fa-user-slash text-6xl mb-4"></i>
                    <p class="text-lg">No students found in this class</p>
                    <p class="text-sm">Add students to this class first</p>
                </div>
            `;
            return;
        }

        let existingAttendance = [];
        if (attendanceResponse.ok) {
            existingAttendance = await attendanceResponse.json();
        }

        const statusIcons = {
            present: '<i class="fas fa-check-circle text-green-600"></i>',
            absent: '<i class="fas fa-times-circle text-red-600"></i>',
            late: '<i class="fas fa-clock text-yellow-600"></i>'
        };

        let table = `
            <form id="mark-attendance" class="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                            <tr>
                                <th class="px-6 py-4 text-left font-semibold">Student Name</th>
                                <th class="px-6 py-4 text-left font-semibold">Roll Number</th>
                                <th class="px-6 py-4 text-left font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${students.map((s, index) => {
                                const existing = existingAttendance.find(a => a.student_id === s.id);
                                const status = existing ? existing.status : 'present';
                                return `
                                    <tr class="hover:bg-purple-50 transition ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}">
                                        <td class="px-6 py-4 font-medium text-gray-900">${s.name}</td>
                                        <td class="px-6 py-4 text-gray-600">${s.roll}</td>
                                        <td class="px-6 py-4">
                                            <div class="flex gap-4">
                                                <label class="flex items-center gap-2 cursor-pointer">
                                                    <input type="radio" name="status-${s.id}" value="present" 
                                                           ${status === 'present' ? 'checked' : ''} 
                                                           class="w-4 h-4 text-green-600 focus:ring-green-500" />
                                                    <span class="flex items-center gap-1 text-green-700">
                                                        ${statusIcons.present} Present
                                                    </span>
                                                </label>
                                                <label class="flex items-center gap-2 cursor-pointer">
                                                    <input type="radio" name="status-${s.id}" value="late" 
                                                           ${status === 'late' ? 'checked' : ''} 
                                                           class="w-4 h-4 text-yellow-600 focus:ring-yellow-500" />
                                                    <span class="flex items-center gap-1 text-yellow-700">
                                                        ${statusIcons.late} Late
                                                    </span>
                                                </label>
                                                <label class="flex items-center gap-2 cursor-pointer">
                                                    <input type="radio" name="status-${s.id}" value="absent" 
                                                           ${status === 'absent' ? 'checked' : ''} 
                                                           class="w-4 h-4 text-red-600 focus:ring-red-500" />
                                                    <span class="flex items-center gap-1 text-red-700">
                                                        ${statusIcons.absent} Absent
                                                    </span>
                                                </label>
                                            </div>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
                <div class="bg-gray-50 px-6 py-4 flex flex-wrap gap-3 border-t-2 border-gray-200">
                    <button type="submit" class="flex-1 md:flex-none bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 transition shadow-lg font-semibold flex items-center justify-center gap-2">
                        <i class="fas fa-save"></i> Submit Attendance
                    </button>
                    <button type="button" onclick="markAllPresent()" class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition flex items-center gap-2">
                        <i class="fas fa-check-double"></i> Mark All Present
                    </button>
                    <button type="button" onclick="markAllAbsent()" class="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition flex items-center gap-2">
                        <i class="fas fa-times-circle"></i> Mark All Absent
                    </button>
                </div>
            </form>
        `;
        formDiv.innerHTML = table;

        document.getElementById('mark-attendance').onsubmit = async function(e) {
            e.preventDefault();
            const form = e.target;

            try {
                showLoading();
                
                const records = students.map(s => ({
                    student_id: s.id,
                    status: form.querySelector(`input[name="status-${s.id}"]:checked`).value
                }));

                const response = await fetch(`${API_URL}/attendance`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ class_id: classId, date, records })
                });

                if (response.ok) {
                    hideLoading();
                    showToast('✓ Attendance submitted successfully!', 'success');
                    
                    // Refresh dashboard
                    if (typeof fetchStats === 'function') {
                        await fetchStats();
                    }
                    
                    await loadAttendanceForm();
                } else {
                    const data = await response.json();
                    throw new Error(data.error || 'Unknown error occurred');
                }
            } catch (error) {
                hideLoading();
                console.error('[Attendance] Submit error:', error);
                showToast('Error submitting attendance: ' + error.message, 'error');
            }
        };
    } catch (error) {
        showError('attendance-form', 'Error loading students: ' + error.message);
    }
};

window.markAllPresent = function() {
    document.querySelectorAll('input[type="radio"][value="present"]').forEach(radio => radio.checked = true);
    showToast('All students marked as present', 'info');
};

window.markAllAbsent = function() {
    document.querySelectorAll('input[type="radio"][value="absent"]').forEach(radio => radio.checked = true);
    showToast('All students marked as absent', 'info');
};

console.log('[Attendance.js] Module loaded');
