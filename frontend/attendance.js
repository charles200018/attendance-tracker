// Cleaned attendance.js
const API_URL = 'http://127.0.0.1:3000/api';

function showLoading(id) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = `<div class="p-4 text-center text-gray-600">Loading…</div>`;
}

function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) {
    el.innerHTML = `<div class="error-message"><p>${msg}</p></div>`;
  } else if (typeof showToast === 'function') {
    showToast(msg, 'error');
  } else {
    console.error(msg);
  }
}

function showSuccess(idOrMsg, msg) {
  // support showSuccess(message) or showSuccess(elementId, message)
  if (msg === undefined) {
    if (typeof showToast === 'function') return showToast(idOrMsg, 'success');
    return console.log(idOrMsg);
  }
  const el = document.getElementById(idOrMsg);
  if (!el) return;
  const d = document.createElement('div');
  d.className = 'success-message';
  d.textContent = msg;
  el.insertBefore(d, el.firstChild);
  setTimeout(() => d.remove(), 3000);
}

async function loadClasses() {
  try {
    showLoading('classesList');
    const res = await fetch(`${API_URL}/classes`);
    const classes = await res.json();
    const html = classes.map((c, i) => `<div class="class-card">${c.name}</div>`).join('');
    const container = document.getElementById('classesList');
    if (container) container.innerHTML = html || '<div class="text-gray-500">No classes</div>';
    updateClassSelects(classes);
  } catch (e) {
    showError('classesList', 'Failed to load classes');
    console.error(e);
  }
}

function updateClassSelects(classes) {
  const ids = ['studentClass', 'class-select'];
  ids.forEach(id => {
    const s = document.getElementById(id);
    if (!s) return;
    s.innerHTML = `<option value="">Select Class</option>` + classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  });
}

async function loadStudents() {
  try {
    const sel = document.getElementById('studentClass');
    if (!sel || !sel.value) return showError('studentsList', 'Select a class');
    showLoading('studentsList');
    const res = await fetch(`${API_URL}/students/${sel.value}`);
    const students = await res.json();
    const el = document.getElementById('studentsList');
    if (el) el.innerHTML = students.map(s => `<div class="student-row">${s.name} (${s.roll})</div>`).join('') || '<div class="text-gray-500">No students</div>';
  } catch (e) {
    showError('studentsList', 'Failed to load students');
    console.error(e);
  }
}

async function addStudent() {
  const nameInput = document.getElementById('studentName');
  const rollInput = document.getElementById('studentRoll');
  const classSelect = document.getElementById('studentClass');
  const name = nameInput?.value?.trim();
  const roll = rollInput?.value?.trim();
  const class_id = classSelect?.value;
  if (!name || !roll || !class_id) return showError('studentsList', 'Please fill all fields');
  try {
    const r = await fetch(`${API_URL}/students`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, roll, class_id }) });
    if (!r.ok) throw new Error('Failed to add student');
    await loadStudents();
    showSuccess('studentsList', 'Student added successfully');
    nameInput.value = '';
    rollInput.value = '';
  } catch (e) {
    showError('studentsList', e.message || 'Error adding student');
    console.error(e);
  }
}

async function addClass() {
  const nameInput = document.getElementById('className');
  const name = nameInput?.value?.trim();
  if (!name) return showError('classesList', 'Please enter a class name');
  try {
    const r = await fetch(`${API_URL}/classes`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) });
    if (!r.ok) throw new Error('Failed to add class');
    nameInput.value = '';
    await loadClasses();
    showSuccess('classesList', 'Class added successfully');
  } catch (e) {
    showError('classesList', e.message || 'Error adding class');
  }
}

async function renderAttendance() {
  try {
    showLoading('attendance');
    const res = await fetch(`${API_URL}/classes`);
    const classes = await res.json();
    const container = document.getElementById('attendance');
    if (!classes.length) return container && (container.innerHTML = '<div class="text-gray-500">No classes</div>');
    container.innerHTML = `
      <div class="form-group">
        <select id="class-select"><option value="">Select Class</option>${classes.map(c=>`<option value="${c.id}">${c.name}</option>`).join('')}</select>
        <input id="date-select" type="date" />
        <button onclick="loadAttendanceForm()">Load Attendance</button>
      </div>
      <div id="attendance-form"></div>`;
    document.getElementById('date-select').value = new Date().toISOString().split('T')[0];
  } catch (e) {
    showError('attendance', 'Error loading classes');
    console.error(e);
  }
}

window.loadAttendanceForm = async function() {
  const classId = document.getElementById('class-select')?.value;
  const date = document.getElementById('date-select')?.value;
  if (!classId) return showError('attendance-form', 'Please select a class');
  if (!date) return showError('attendance-form', 'Please select a date');
  try {
    showLoading('attendance-form');
    const [studentsRes, attendanceRes] = await Promise.all([fetch(`${API_URL}/students/${classId}`), fetch(`${API_URL}/attendance/${classId}/${date}`)]);
    const students = await studentsRes.json();
    const existing = attendanceRes.ok ? await attendanceRes.json() : [];
    const form = document.getElementById('attendance-form');
    form.innerHTML = `<form id="mark-attendance"><table><thead><tr><th>Name</th><th>Roll</th><th>Status</th></tr></thead><tbody>${students.map(s=>{const e = existing.find(x=>x.student_id===s.id); const status = e?e.status:'present'; return `<tr><td>${s.name}</td><td>${s.roll}</td><td><select name="status-${s.id}"><option value="present" ${status==='present'?'selected':''}>Present</option><option value="absent" ${status==='absent'?'selected':''}>Absent</option><option value="late" ${status==='late'?'selected':''}>Late</option></select></td></tr>`}).join('')}</tbody></table><div><button type="submit">Submit Attendance</button></div></form>`;
    document.getElementById('mark-attendance').onsubmit = async function(e){ e.preventDefault(); const records = students.map(s=>({ student_id:s.id, status: document.querySelector(`[name="status-${s.id}"]`).value })); const r = await fetch(`${API_URL}/attendance`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ class_id: classId, date, records })}); if (!r.ok) { const err = await r.json(); return showError('attendance-form', err.error || 'Failed'); } showSuccess('attendance-form','Attendance recorded'); await loadAttendanceForm(); };
  } catch (e) {
    showError('attendance-form', e.message || 'Error loading form');
  }
};

window.markAllPresent = () => document.querySelectorAll('select[name^="status-"]').forEach(s=>s.value='present');
window.markAllAbsent = () => document.querySelectorAll('select[name^="status-"]').forEach(s=>s.value='absent');

document.addEventListener('DOMContentLoaded', async ()=>{
  try {
    await testBackendConnection();
    const classForm = document.querySelector('#class-management form'); if (classForm) classForm.addEventListener('submit', async e=>{ e.preventDefault(); await addClass(); });
    const studentForm = document.querySelector('#student-management form'); if (studentForm) studentForm.addEventListener('submit', async e=>{ e.preventDefault(); await addStudent(); });
    await Promise.all([loadClasses(), renderAttendance()]);
  } catch (e) {
    const app = document.getElementById('app'); if (app) app.innerHTML = `<div class="error">${e.message}</div>`;
  }
});

async function testBackendConnection(){ const r = await fetch(`${API_URL}/test`); if (!r.ok) throw new Error('Backend not responding'); }
