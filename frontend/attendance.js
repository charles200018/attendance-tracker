// Fetch classes and students, render attendance form

async function renderAttendance() {
  const classes = await fetch('/api/classes').then(r => r.json());
  let html = `
    <div class="mb-4">
      <select id="class-select" class="p-2 border rounded">
        ${classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
      </select>
      <input id="date-select" type="date" class="p-2 border rounded ml-2"/>
      <button onclick="loadAttendanceForm()" class="ml-4 bg-indigo-600 text-white px-4 py-2 rounded">Load</button>
    </div>
    <div id="attendance-form"></div>
  `;
  document.getElementById('attendance').innerHTML = html;
}

window.loadAttendanceForm = async function () {
  const classId = document.getElementById('class-select').value;
  const date = document.getElementById('date-select').value;
  if (!date) return alert('Select a date');
  const students = await fetch('/api/students/' + classId).then(r => r.json());
  let table = `
    <form id="mark-attendance">
      <table class="w-full mb-4">
        <thead>
          <tr><th>Name</th><th>Roll</th><th>Status</th></tr>
        </thead>
        <tbody>
          ${students.map(s => `
            <tr>
              <td>${s.name}</td>
              <td>${s.roll}</td>
              <td>
                <select name="status-${s.id}" class="border p-1 rounded">
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                </select>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded">Submit Attendance</button>
    </form>
  `;
  document.getElementById('attendance-form').innerHTML = table;
  document.getElementById('mark-attendance').onsubmit = async function(e) {
    e.preventDefault();
    const records = students.map(s => ({
      student_id: s.id,
      status: document.querySelector(`[name="status-${s.id}"]`).value
    }));
    await fetch('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ class_id: classId, date, records })
    });
    alert('Attendance submitted!');
  };
}

renderAttendance();