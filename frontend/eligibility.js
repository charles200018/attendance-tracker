// Attendance Eligibility Module
// Displays 75% attendance eligibility policy and student status

const ELIGIBILITY_THRESHOLD = 75;

async function loadEligibilityReport() {
  try {
    const eligibilityContent = document.getElementById('eligibility-content');
    
    // Check if API_URL is defined
    if (typeof API_URL === 'undefined') {
      throw new Error('API_URL is not defined. Please ensure config.js is loaded.');
    }
    
    eligibilityContent.innerHTML = `
      <div class="flex justify-center items-center py-12">
        <div class="text-center">
          <i class="fas fa-spinner fa-spin text-4xl text-purple-600 mb-4"></i>
          <p class="text-gray-600">Loading eligibility report...</p>
        </div>
      </div>
    `;

    // Fetch classes for filter dropdown
    const classesResponse = await fetch(`${API_URL}/classes`);
    if (!classesResponse.ok) {
      throw new Error(`Failed to fetch classes: ${classesResponse.status} ${classesResponse.statusText}`);
    }
    const classes = await classesResponse.json();
    
    // Fetch eligibility data for all students
    const response = await fetch(`${API_URL}/attendance/eligibility/all`);
    if (!response.ok) {
      throw new Error(`Failed to fetch eligibility data: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    
    console.log('Eligibility data received:', data);
    
    // Validate data structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data format received from server');
    }
    
    renderEligibilityReport(data, classes);
  } catch (error) {
    console.error('Error loading eligibility report:', error);
    document.getElementById('eligibility-content').innerHTML = `
      <div class="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3">
        <i class="fas fa-exclamation-triangle text-2xl"></i>
        <div>
          <div class="font-bold">Error loading eligibility report</div>
          <div class="text-sm">${error.message}</div>
        </div>
      </div>
    `;
  }
}

function renderEligibilityReport(data, classes) {
  const eligibilityContent = document.getElementById('eligibility-content');
  
  // Validate data structure
  if (!data || !data.students || !Array.isArray(data.students)) {
    eligibilityContent.innerHTML = `
      <div class="bg-yellow-50 border-2 border-yellow-200 text-yellow-700 px-6 py-4 rounded-xl flex items-center gap-3">
        <i class="fas fa-info-circle text-2xl"></i>
        <div>
          <div class="font-bold">No Data Available</div>
          <div class="text-sm">No students found in the system. Please add students first.</div>
        </div>
      </div>
    `;
    return;
  }
  
  const eligibleCount = data.eligible_count || 0;
  const atRiskCount = data.at_risk_count || 0;
  const totalStudents = data.total_students || 0;
  const eligiblePercentage = totalStudents > 0 ? Math.round((eligibleCount / totalStudents) * 100) : 0;
  
  eligibilityContent.innerHTML = `
    <!-- Header Section -->
    <div class="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-8 mb-6 shadow-lg">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-3xl font-bold mb-2">
            <i class="fas fa-graduation-cap mr-3"></i>
            Attendance Eligibility Policy
          </h2>
          <p class="text-purple-100 text-lg">
            Students must maintain <strong>${ELIGIBILITY_THRESHOLD}% attendance</strong> to remain eligible
          </p>
        </div>
        <div class="text-right">
          <div class="text-5xl font-bold mb-1">${ELIGIBILITY_THRESHOLD}%</div>
          <div class="text-purple-100">Minimum Required</div>
        </div>
      </div>
    </div>

    <!-- Statistics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm text-gray-500 mb-1">Total Students</div>
            <div class="text-4xl font-bold text-gray-800">${totalStudents}</div>
          </div>
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <i class="fas fa-users text-2xl text-blue-600"></i>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl p-6 border-2 border-green-200 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm text-gray-500 mb-1">Eligible Students</div>
            <div class="text-4xl font-bold text-green-600">${eligibleCount}</div>
            <div class="text-sm text-green-600 font-medium">${eligiblePercentage}% of total</div>
          </div>
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <i class="fas fa-check-circle text-2xl text-green-600"></i>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl p-6 border-2 border-red-200 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm text-gray-500 mb-1">At Risk Students</div>
            <div class="text-4xl font-bold text-red-600">${atRiskCount}</div>
            <div class="text-sm text-red-600 font-medium">${Math.round((atRiskCount / totalStudents) * 100)}% of total</div>
          </div>
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <i class="fas fa-exclamation-triangle text-2xl text-red-600"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter and Actions -->
    <div class="bg-white rounded-xl p-6 border-2 border-gray-200 mb-6 shadow-sm">
      <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div class="flex items-center gap-4 w-full md:w-auto">
          <label class="font-medium text-gray-700">
            <i class="fas fa-filter mr-2"></i>Filter by Class:
          </label>
          <select id="classFilter" class="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 min-w-[200px]">
            <option value="all">All Classes</option>
            ${classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
          </select>
        </div>
        
        <div class="flex items-center gap-3">
          <button onclick="exportEligibilityReport()" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2">
            <i class="fas fa-file-excel"></i>
            Export to CSV
          </button>
        </div>
      </div>
    </div>

    <!-- Students Table -->
    <div class="bg-white rounded-xl border-2 border-gray-200 shadow-sm overflow-hidden">
      <div class="p-6 border-b-2 border-gray-200 bg-gray-50">
        <h3 class="text-xl font-bold text-gray-800">
          <i class="fas fa-list mr-2"></i>
          Student Eligibility Status
        </h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full" id="eligibilityTable">
          <thead class="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-bold text-gray-700">Roll No.</th>
              <th class="px-6 py-4 text-left text-sm font-bold text-gray-700">Student Name</th>
              <th class="px-6 py-4 text-left text-sm font-bold text-gray-700">Class</th>
              <th class="px-6 py-4 text-center text-sm font-bold text-gray-700">Total Classes</th>
              <th class="px-6 py-4 text-center text-sm font-bold text-gray-700">Present</th>
              <th class="px-6 py-4 text-center text-sm font-bold text-gray-700">Late</th>
              <th class="px-6 py-4 text-center text-sm font-bold text-gray-700">Absent</th>
              <th class="px-6 py-4 text-center text-sm font-bold text-gray-700">Attendance %</th>
              <th class="px-6 py-4 text-center text-sm font-bold text-gray-700">Status</th>
              <th class="px-6 py-4 text-center text-sm font-bold text-gray-700">Action Needed</th>
            </tr>
          </thead>
          <tbody id="eligibilityTableBody">
            ${renderStudentRows(data.students)}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Legend -->
    <div class="bg-white rounded-xl p-6 border-2 border-gray-200 mt-6 shadow-sm">
      <h4 class="font-bold text-gray-800 mb-4">
        <i class="fas fa-info-circle mr-2"></i>Status Legend
      </h4>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="flex items-center gap-3">
          <div class="w-4 h-4 bg-green-500 rounded"></div>
          <span><strong>Eligible:</strong> ≥ 75% attendance</span>
        </div>
        <div class="flex items-center gap-3">
          <div class="w-4 h-4 bg-yellow-500 rounded"></div>
          <span><strong>Warning:</strong> 70-74% attendance</span>
        </div>
        <div class="flex items-center gap-3">
          <div class="w-4 h-4 bg-red-500 rounded"></div>
          <span><strong>Critical:</strong> &lt; 70% attendance</span>
        </div>
      </div>
      <div class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p class="text-sm text-blue-800">
          <i class="fas fa-lightbulb mr-2"></i>
          <strong>Note:</strong> Late attendance counts as 50% present. Students below 75% must attend additional classes to become eligible.
        </p>
      </div>
    </div>
  `;
  
  // Add event listener for class filter
  document.getElementById('classFilter').addEventListener('change', async (e) => {
    const classId = e.target.value;
    await filterByClass(classId);
  });
}

function renderStudentRows(students) {
  if (!students || !Array.isArray(students) || students.length === 0) {
    return `
      <tr>
        <td colspan="10" class="px-6 py-8 text-center text-gray-500">
          <i class="fas fa-inbox text-4xl mb-2"></i>
          <div>No students found</div>
        </td>
      </tr>
    `;
  }
  
  return students.map(student => {
    const statusConfig = getStatusConfig(student.status, student.attendance_percentage);
    const progressBarColor = student.is_eligible ? 'bg-green-500' : 
                            student.attendance_percentage >= 70 ? 'bg-yellow-500' : 'bg-red-500';
    
    return `
      <tr class="border-b border-gray-100 hover:bg-gray-50 transition">
        <td class="px-6 py-4">
          <span class="font-mono font-bold text-gray-700">${student.roll_number}</span>
        </td>
        <td class="px-6 py-4">
          <div class="font-medium text-gray-900">${student.student_name}</div>
        </td>
        <td class="px-6 py-4">
          <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            ${student.class_name}
          </span>
        </td>
        <td class="px-6 py-4 text-center font-semibold">${student.total_classes}</td>
        <td class="px-6 py-4 text-center">
          <span class="text-green-600 font-semibold">${student.present}</span>
        </td>
        <td class="px-6 py-4 text-center">
          <span class="text-yellow-600 font-semibold">${student.late}</span>
        </td>
        <td class="px-6 py-4 text-center">
          <span class="text-red-600 font-semibold">${student.absent}</span>
        </td>
        <td class="px-6 py-4">
          <div class="flex flex-col items-center">
            <span class="text-lg font-bold ${statusConfig.textColor} mb-1">
              ${student.attendance_percentage}%
            </span>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="${progressBarColor} h-2 rounded-full transition-all" 
                   style="width: ${Math.min(student.attendance_percentage, 100)}%"></div>
            </div>
          </div>
        </td>
        <td class="px-6 py-4 text-center">
          <span class="px-3 py-1 rounded-full text-sm font-bold ${statusConfig.bgColor} ${statusConfig.textColor}">
            <i class="${statusConfig.icon} mr-1"></i>
            ${statusConfig.label}
          </span>
        </td>
        <td class="px-6 py-4 text-center">
          ${student.is_eligible 
            ? '<span class="text-green-600 font-semibold"><i class="fas fa-check-circle"></i> None</span>'
            : `<span class="text-red-600 font-bold">
                 <i class="fas fa-arrow-up"></i> ${student.classes_needed} more ${student.classes_needed === 1 ? 'class' : 'classes'}
               </span>`
          }
        </td>
      </tr>
    `;
  }).join('');
}

function getStatusConfig(status, percentage) {
  switch(status) {
    case 'eligible':
      return {
        label: 'Eligible',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        icon: 'fas fa-check-circle'
      };
    case 'warning':
      return {
        label: 'Warning',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        icon: 'fas fa-exclamation-triangle'
      };
    case 'critical':
      return {
        label: 'Critical',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        icon: 'fas fa-times-circle'
      };
    default:
      return {
        label: 'Unknown',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800',
        icon: 'fas fa-question-circle'
      };
  }
}

async function filterByClass(classId) {
  try {
    const endpoint = classId === 'all' 
      ? `${API_URL}/attendance/eligibility/all`
      : `${API_URL}/attendance/eligibility/${classId}`;
    
    const response = await fetch(endpoint);
    const data = await response.json();
    
    const tbody = document.getElementById('eligibilityTableBody');
    tbody.innerHTML = renderStudentRows(data.students);
    
    // Update statistics
    const eligibleCount = data.eligible_count;
    const atRiskCount = data.at_risk_count;
    const totalStudents = data.total_students;
    
    // You could update the stats cards here if needed
  } catch (error) {
    console.error('Error filtering by class:', error);
    if (typeof showToast === 'function') {
      showToast('Failed to filter students', 'error');
    } else {
      alert('Failed to filter students');
    }
  }
}

async function exportEligibilityReport() {
  try {
    const classId = document.getElementById('classFilter').value;
    const endpoint = classId === 'all' 
      ? `${API_URL}/attendance/eligibility/all`
      : `${API_URL}/attendance/eligibility/${classId}`;
    
    const response = await fetch(endpoint);
    const data = await response.json();
    
    // Create CSV content
    const headers = ['Roll No.', 'Student Name', 'Class', 'Total Classes', 'Present', 'Late', 'Absent', 'Attendance %', 'Status', 'Classes Needed'];
    const rows = data.students.map(s => [
      s.roll_number,
      s.student_name,
      s.class_name,
      s.total_classes,
      s.present,
      s.late,
      s.absent,
      s.attendance_percentage,
      s.is_eligible ? 'Eligible' : s.status === 'warning' ? 'Warning' : 'Critical',
      s.is_eligible ? '0' : s.classes_needed
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `eligibility_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    if (typeof showToast === 'function') {
      showToast('Report exported successfully!', 'success');
    }
  } catch (error) {
    console.error('Error exporting report:', error);
    if (typeof showToast === 'function') {
      showToast('Failed to export report', 'error');
    } else {
      alert('Failed to export report: ' + error.message);
    }
  }
}

console.log('[Eligibility.js] Module loaded');
