// Debug configuration
const DEBUG = true;
const API_BASE_URL = "http://127.0.0.1:3000/api";
const API_URL = API_BASE_URL;

function debug(...args) {
    if (DEBUG) {
        console.log('[Dashboard]', ...args);
    }
}

// Fetch and render dashboard stats and chart
async function fetchStats() {
  try {
    debug('Starting fetchStats...');
    const dashboardContent = document.getElementById('dashboard-content');
    
    dashboardContent.innerHTML = `
      <div class="flex justify-center items-center py-12">
        <div class="text-center">
          <i class="fas fa-spinner fa-spin text-4xl text-purple-600 mb-4"></i>
          <p class="text-gray-600">Loading statistics...</p>
        </div>
      </div>
    `;

    debug('Fetching classes from:', `${API_URL}/classes`);
    const classesResponse = await fetch(`${API_URL}/classes`);
    if (!classesResponse.ok) {
      throw new Error(`Failed to fetch classes: ${classesResponse.status}`);
    }
    const classes = await classesResponse.json();
    debug('Classes fetched:', classes.length);

    let students = [];
    for (const c of classes) {
      const studentsResponse = await fetch(`${API_URL}/students/${c.id}`);
      if (!studentsResponse.ok) {
        throw new Error(`Failed to fetch students: ${studentsResponse.status}`);
      }
      const s = await studentsResponse.json();
      students = students.concat(s);
    }
    debug('All students fetched:', students.length);

    // Get today's attendance
    const today = new Date().toISOString().split('T')[0];
    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;
    let totalAttendance = 0;
    
    for (const c of classes) {
      const attendance = await fetch(`${API_URL}/attendance/${c.id}/${today}`).then(r => r.json());
      presentCount += attendance.filter(a => a.status === 'present').length;
      absentCount += attendance.filter(a => a.status === 'absent').length;
      lateCount += attendance.filter(a => a.status === 'late').length;
      totalAttendance += attendance.length;
    }

    const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

    dashboardContent.innerHTML = `
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg hover-scale">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm opacity-90 mb-1">Total Classes</div>
              <div class="text-4xl font-bold">${classes.length}</div>
            </div>
            <i class="fas fa-school text-5xl opacity-20"></i>
          </div>
        </div>
        
        <div class="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg hover-scale">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm opacity-90 mb-1">Total Students</div>
              <div class="text-4xl font-bold">${students.length}</div>
            </div>
            <i class="fas fa-user-graduate text-5xl opacity-20"></i>
          </div>
        </div>
        
        <div class="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg hover-scale">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm opacity-90 mb-1">Present Today</div>
              <div class="text-4xl font-bold">${presentCount}</div>
            </div>
            <i class="fas fa-check-circle text-5xl opacity-20"></i>
          </div>
        </div>
        
        <div class="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-6 shadow-lg hover-scale">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm opacity-90 mb-1">Absent Today</div>
              <div class="text-4xl font-bold">${absentCount}</div>
            </div>
            <i class="fas fa-times-circle text-5xl opacity-20"></i>
          </div>
        </div>
      </div>

      <!-- Today's Summary -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <!-- Attendance Summary -->
        <div class="bg-white rounded-xl p-6 border-2 border-gray-200">
          <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
            <i class="fas fa-calendar-day text-purple-600"></i>
            Today's Summary
          </h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span class="flex items-center gap-2">
                <i class="fas fa-check text-green-600"></i>
                Present
              </span>
              <span class="font-bold text-green-600">${presentCount}</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span class="flex items-center gap-2">
                <i class="fas fa-clock text-yellow-600"></i>
                Late
              </span>
              <span class="font-bold text-yellow-600">${lateCount}</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span class="flex items-center gap-2">
                <i class="fas fa-times text-red-600"></i>
                Absent
              </span>
              <span class="font-bold text-red-600">${absentCount}</span>
            </div>
          </div>
        </div>

        <!-- Attendance Rate -->
        <div class="bg-white rounded-xl p-6 border-2 border-gray-200">
          <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
            <i class="fas fa-chart-pie text-purple-600"></i>
            Attendance Rate
          </h3>
          <div class="flex items-center justify-center h-40">
            <div class="text-center">
              <div class="text-6xl font-bold ${attendanceRate >= 75 ? 'text-green-600' : attendanceRate >= 50 ? 'text-yellow-600' : 'text-red-600'} mb-2">
                ${attendanceRate}%
              </div>
              <div class="text-gray-500 text-sm">
                ${presentCount} of ${totalAttendance} students present
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Attendance Trend Chart -->
      <div class="bg-white rounded-xl p-6 border-2 border-gray-200">
        <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
          <i class="fas fa-chart-line text-purple-600"></i>
          7-Day Attendance Trend
        </h3>
        <canvas id="attendanceChart" height="80"></canvas>
      </div>
    `;

    // Fetch attendance data for the last 7 days
    const last7Days = Array.from({length: 7}, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    const attendanceData = await Promise.all(last7Days.map(async date => {
      let present = 0;
      let total = 0;
      for (const c of classes) {
        const attendance = await fetch(`${API_URL}/attendance/${c.id}/${date}`).then(r => r.json());
        present += attendance.filter(a => a.status === 'present').length;
        total += attendance.length;
      }
      return {
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        percent: total ? Math.round((present / total) * 100) : 0,
        present: present,
        total: total
      };
    }));

    drawAttendanceChart(attendanceData);
    
    debug('Dashboard loaded successfully');
  } catch (error) {
    console.error('Error fetching stats:', error);
    document.getElementById('dashboard-content').innerHTML = `
      <div class="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3">
        <i class="fas fa-exclamation-triangle text-2xl"></i>
        <div>
          <div class="font-bold">Error loading dashboard data</div>
          <div class="text-sm">${error.message}</div>
        </div>
      </div>
    `;
  }
}

function drawAttendanceChart(data) {
  const ctx = document.getElementById('attendanceChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(d => d.date),
      datasets: [{
        label: 'Attendance Rate (%)',
        data: data.map(d => d.percent),
        fill: true,
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 3,
        tension: 0.4,
        pointBackgroundColor: 'rgb(139, 92, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            font: { size: 14, weight: 'bold' },
            color: '#4B5563'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: { size: 14, weight: 'bold' },
          bodyFont: { size: 13 },
          callbacks: {
            label: function(context) {
              const index = context.dataIndex;
              return [
                `Attendance: ${context.parsed.y}%`,
                `Present: ${data[index].present}/${data[index].total}`
              ];
            }
          }
        }
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 25,
            callback: function(value) {
              return value + '%';
            },
            font: { size: 12 },
            color: '#6B7280'
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          ticks: {
            font: { size: 12 },
            color: '#6B7280'
          },
          grid: {
            display: false
          }
        }
      }
    }
  });
}

console.log('[Dashboard.js] Module loaded');