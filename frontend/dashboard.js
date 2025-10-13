// Fetch and render dashboard stats and chart

async function fetchStats() {
  const classes = await fetch('/api/classes').then(r => r.json());
  let students = [];
  for (const c of classes) {
    const s = await fetch('/api/students/' + c.id).then(r => r.json());
    students = students.concat(s);
  }
  document.getElementById('dashboard').innerHTML = `
    <div class="grid grid-cols-3 gap-4 mb-8">
      <div class="bg-white shadow rounded-lg p-4">
        <div class="text-sm text-slate-500">Classes</div>
        <div class="text-2xl font-bold">${classes.length}</div>
      </div>
      <div class="bg-white shadow rounded-lg p-4">
        <div class="text-sm text-slate-500">Students</div>
        <div class="text-2xl font-bold">${students.length}</div>
      </div>
      <div class="bg-white shadow rounded-lg p-4">
        <div class="text-sm text-slate-500">Absent Today</div>
        <div id="stat-absent" class="text-2xl font-bold text-red-600">-</div>
      </div>
    </div>
    <div class="bg-white rounded-lg shadow p-4 mb-8">
      <h2 class="font-semibold mb-2">Attendance Trend (Last 7 Days)</h2>
      <canvas id="attendanceChart" height="100"></canvas>
    </div>
  `;
  // Placeholder for chart data
  drawAttendanceChart([
    { date: 'Mon', percent: 95 }, { date: 'Tue', percent: 97 },
    { date: 'Wed', percent: 93 }, { date: 'Thu', percent: 90 },
    { date: 'Fri', percent: 92 }, { date: 'Sat', percent: 94 }, { date: 'Sun', percent: 96 }
  ]);
  // TODO: Fetch real attendance, update #stat-absent
}

function drawAttendanceChart(data) {
  const ctx = document.getElementById('attendanceChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(d => d.date),
      datasets: [{
        label: 'Attendance %',
        data: data.map(d => d.percent),
        fill: true,
        backgroundColor: 'rgba(99,102,241,0.1)',
        borderColor: '#6366f1',
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false }},
      scales: {
        y: { min: 0, max: 100, ticks: { stepSize: 25 } }
      }
    }
  });
}

fetchStats();