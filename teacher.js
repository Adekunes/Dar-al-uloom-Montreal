document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const newAssignmentForm = document.getElementById('newAssignmentForm');
    const attendanceForm = document.getElementById('attendanceForm');

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        document.querySelector('.main-content').classList.toggle('sidebar-active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.target.getAttribute('data-section');
            showSection(section);
        });
    });

    newAssignmentForm.addEventListener('submit', addNewAssignment);
    attendanceForm.addEventListener('submit', saveAttendance);

    loadTeacherData();
    showSection('dashboard');

    // Make teacher name editable
    const teacherNameElement = document.getElementById('teacherName');
    makeEditable(teacherNameElement, 'Teacher Name');
});

function loadTeacherData() {
    const teacherData = {
        name: "Ms. Fatima Ali",
        totalStudents: 25,
        upcomingAssignments: 3,
        averagePerformance: 85,
        students: [
            { id: 1, name: "Ahmed Hassan", progress: 90, attendance: 95 },
            { id: 2, name: "Zainab Mahmoud", progress: 85, attendance: 92 },
            { id: 3, name: "Omar Khalid", progress: 78, attendance: 88 }
        ],
        assignments: [
            { id: 1, title: "Math Quiz", dueDate: "2024-10-15" },
            { id: 2, title: "Science Project", dueDate: "2024-10-20" },
            { id: 3, title: "Islamic Studies Essay", dueDate: "2024-10-18" }
        ],
        grades: [
            { studentId: 1, assignmentId: 1, grade: 95 },
            { studentId: 2, assignmentId: 1, grade: 88 },
            { studentId: 3, assignmentId: 1, grade: 82 }
        ],
        attendanceData: [
            { id: 1, name: "Ahmed Hassan", status: "present" },
            { id: 2, name: "Zainab Mahmoud", status: "absent" },
            { id: 3, name: "Omar Khalid", status: "late" }
        ]
    };

    updateDashboard(teacherData);
    populateStudents(teacherData.students);
    populateAssignments(teacherData.assignments);
    populateGrades(teacherData.grades, teacherData.students, teacherData.assignments);
    populateAttendance(teacherData.attendanceData);
    document.getElementById('teacherName').textContent = teacherData.name;
}

function updateDashboard(data) {
    const totalStudentsElement = document.getElementById('totalStudents');
    const upcomingAssignmentsElement = document.getElementById('upcomingAssignments');
    const averagePerformanceElement = document.getElementById('averagePerformance');

    makeEditable(totalStudentsElement, 'Total Students');
    makeEditable(upcomingAssignmentsElement, 'Upcoming Assignments');
    makeEditable(averagePerformanceElement, 'Average Performance');

    totalStudentsElement.textContent = data.totalStudents;
    upcomingAssignmentsElement.textContent = data.upcomingAssignments;
    averagePerformanceElement.textContent = `${data.averagePerformance}%`;

    updatePerformanceChart(data.students);
}

function updatePerformanceChart(students) {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    if (window.performanceChart instanceof Chart) {
        window.performanceChart.data.labels = students.map(s => s.name);
        window.performanceChart.data.datasets[0].data = students.map(s => s.progress);
        window.performanceChart.update();
    } else {
        window.performanceChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: students.map(s => s.name),
                datasets: [{
                    label: 'Student Progress',
                    data: students.map(s => s.progress),
                    backgroundColor: 'rgba(74, 144, 226, 0.6)',
                    borderColor: 'rgb(74, 144, 226)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeOutQuart'
                }
            }
        });
    }
}

function populateStudents(students) {
    const studentsList = document.getElementById('studentsList');
    studentsList.innerHTML = '';
    students.forEach((student, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="editable" data-field="name">${student.name}</td>
            <td class="editable" data-field="progress">${student.progress}%</td>
            <td class="editable" data-field="attendance">${student.attendance}%</td>
            <td><button class="btn" onclick="viewStudentDetails(${student.id})">View Details</button></td>
        `;
        row.querySelectorAll('.editable').forEach(cell => {
            makeEditable(cell, cell.getAttribute('data-field'));
        });
        studentsList.appendChild(row);
        animateElement(row, index);
    });
}

function populateAssignments(assignments) {
    const assignmentsList = document.getElementById('assignmentsList');
    assignmentsList.innerHTML = '';
    assignments.forEach((assignment, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="editable" data-field="title">${assignment.title}</span> - 
            Due: <span class="editable" data-field="dueDate">${assignment.dueDate}</span>
            <button class="btn" onclick="deleteAssignment(${assignment.id})">Delete</button>
        `;
        li.querySelectorAll('.editable').forEach(span => {
            makeEditable(span, span.getAttribute('data-field'));
        });
        assignmentsList.appendChild(li);
        animateElement(li, index);
    });
}

function populateGrades(grades, students, assignments) {
    const gradesList = document.getElementById('gradesList');
    gradesList.innerHTML = '';
    grades.forEach((grade, index) => {
        const student = students.find(s => s.id === grade.studentId);
        const assignment = assignments.find(a => a.id === grade.assignmentId);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${assignment.title}</td>
            <td class="editable" data-field="grade">${grade.grade}</td>
            <td><button class="btn" onclick="editGrade(${grade.studentId}, ${grade.assignmentId})">Edit</button></td>
        `;
        makeEditable(row.querySelector('.editable'), 'grade');
        gradesList.appendChild(row);
        animateElement(row, index);
    });
}

function populateAttendance(attendanceData) {
    const attendanceList = document.getElementById('attendanceList');
    attendanceList.innerHTML = '';
    attendanceData.forEach((student, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="editable" data-field="name">${student.name}</td>
            <td><input type="radio" name="attendance_${student.id}" value="present" ${student.status === 'present' ? 'checked' : ''}></td>
            <td><input type="radio" name="attendance_${student.id}" value="absent" ${student.status === 'absent' ? 'checked' : ''}></td>
            <td><input type="radio" name="attendance_${student.id}" value="late" ${student.status === 'late' ? 'checked' : ''}></td>
        `;
        makeEditable(row.querySelector('.editable'), 'name');
        attendanceList.appendChild(row);
        animateElement(row, index);
    });
}

function makeEditable(element, field) {
    element.addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = this.textContent;
        input.classList.add('editable-input');
        this.textContent = '';
        this.appendChild(input);
        input.focus();

        input.addEventListener('blur', function() {
            element.textContent = this.value;
            showNotification(`${field} updated to: ${this.value}`);
            if (field === 'progress' || field === 'attendance') {
                updatePerformanceChart(getStudentsData());
            }
        });

        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                this.blur();
            }
        });
    });
}

function animateElement(element, index) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, 100 * index);
}

function addNewAssignment(e) {
    e.preventDefault();
    const title = document.getElementById('newAssignmentTitle').value;
    const dueDate = document.getElementById('newAssignmentDueDate').value;
    if (title && dueDate) {
        const newAssignment = { id: Date.now(), title, dueDate };
        const assignmentsList = document.getElementById('assignmentsList');
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="editable" data-field="title">${newAssignment.title}</span> - 
            Due: <span class="editable" data-field="dueDate">${newAssignment.dueDate}</span>
            <button class="btn" onclick="deleteAssignment(${newAssignment.id})">Delete</button>
        `;
        li.querySelectorAll('.editable').forEach(span => {
            makeEditable(span, span.getAttribute('data-field'));
        });
        assignmentsList.appendChild(li);
        animateElement(li, assignmentsList.children.length - 1);
        e.target.reset();
        showNotification('New assignment added successfully!');
    }
}

function deleteAssignment(id) {
    const assignmentItem = document.querySelector(`#assignmentsList li button[onclick="deleteAssignment(${id})"]`).parentNode;
    assignmentItem.style.opacity = '0';
    assignmentItem.style.transform = 'translateY(20px)';
    setTimeout(() => {
        assignmentItem.remove();
        showNotification('Assignment deleted successfully!');
    }, 300);
}

function saveAttendance(e) {
    e.preventDefault();
    const attendanceDate = document.getElementById('attendanceDate').value;
    const attendanceData = Array.from(document.querySelectorAll('#attendanceList tr')).map(row => {
        const studentId = row.querySelector('input').name.split('_')[1];
        const status = row.querySelector('input:checked').value;
        return { studentId, status };
    });
    console.log('Attendance saved for', attendanceDate, attendanceData);
    showNotification('Attendance saved successfully!');
}

function viewStudentDetails(studentId) {
    showNotification(`Viewing details for student ID: ${studentId}`);
}

function editGrade(studentId, assignmentId) {
    showNotification(`Editing grade for Student ID: ${studentId}, Assignment ID: ${assignmentId}`);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = 'notification';
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function getStudentsData() {
    return Array.from(document.querySelectorAll('#studentsList tr')).map(row => ({
        name: row.cells[0].textContent,
        progress: parseInt(row.cells[1].textContent),
        attendance: parseInt(row.cells[2].textContent)
    }));
}

function showSection(sectionName) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        setTimeout(() => {
            section.classList.add('hidden');
        }, 300);
    });

    setTimeout(() => {
        const activeSection = document.getElementById(`${sectionName}Section`);
        activeSection.classList.remove('hidden');
        setTimeout(() => {
            activeSection.style.opacity = '1';
            activeSection.style.transform = 'translateY(0)';
        }, 50);
    }, 350);

    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`.sidebar-nav a[data-section="${sectionName}"]`).classList.add('active');
}