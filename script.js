document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded");
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const studentSelect = document.getElementById('studentSelect');
    const navLinks = document.querySelectorAll('#sidebar a');

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    studentSelect.addEventListener('change', loadStudentData);

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.target.getAttribute('data-section');
            showSection(section);
        });
    });

    populateStudentSelect();
    loadStudentData();
    showSection('overview');

    document.getElementById('addAssignmentBtn').addEventListener('click', addNewAssignment);
    document.getElementById('sendMessageBtn').addEventListener('click', sendNewMessage);
});

function populateStudentSelect() {
    console.log("Populating student select");
    const studentSelect = document.getElementById('studentSelect');
    const students = getStudentsData();
    console.log("Students data:", students);

    studentSelect.innerHTML = ''; // Clear existing options
    students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.id;
        option.textContent = student.name;
        studentSelect.appendChild(option);
    });
}

function loadStudentData() {
    console.log("Loading student data");
    const studentId = document.getElementById('studentSelect').value;
    const students = getStudentsData();
    const student = students.find(s => s.id === studentId);

    if (student) {
        console.log("Student data found:", student);
        updateOverviewSection(student);
        updateAcademicsSection(student);
        updateAttendanceSection(student);
        updateBehaviorSection(student);
        updateCommunicationSection(student);
    } else {
        console.error("No student found with ID:", studentId);
    }
}

function updateOverviewSection(student) {
    document.getElementById('overallProgress').textContent = `${student.overallProgress}%`;
    document.getElementById('attendanceRate').textContent = `${student.attendance}%`;
    document.getElementById('nextMeeting').textContent = `${student.nextMeeting.date} at ${student.nextMeeting.time}`;

    const recentActivity = document.getElementById('recentActivity');
    recentActivity.innerHTML = '';
    student.recentActivity.forEach(activity => {
        const li = document.createElement('li');
        li.textContent = activity;
        recentActivity.appendChild(li);
    });
}

function updateAcademicsSection(student) {
    const ctx = document.getElementById('subjectProgressChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: student.subjects.map(s => s.name),
            datasets: [{
                label: 'Progress',
                data: student.subjects.map(s => s.progress),
                backgroundColor: 'rgba(16, 185, 129, 0.6)',
                borderColor: 'rgb(16, 185, 129)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });

    const assignmentsList = document.getElementById('assignmentsList');
    assignmentsList.innerHTML = '';
    student.assignments.forEach(assignment => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${assignment.title} - Due: ${assignment.dueDate} (${assignment.status})</span>
            <button class="ml-2 px-2 py-1 bg-red-500 text-white rounded" onclick="deleteAssignment('${assignment.id}')">Delete</button>
        `;
        assignmentsList.appendChild(li);
    });
}

function updateAttendanceSection(student) {
    const ctx = document.getElementById('attendanceChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: student.attendanceHistory.map(a => a.month),
            datasets: [{
                label: 'Attendance',
                data: student.attendanceHistory.map(a => a.attendance),
                borderColor: 'rgb(59, 130, 246)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

function updateBehaviorSection(student) {
    const behaviorSummary = document.getElementById('behaviorSummary');
    behaviorSummary.innerHTML = `
        <p><strong>Overall:</strong> ${student.behavior.overall}</p>
        <p><strong>Participation:</strong> ${student.behavior.participation}</p>
        <p><strong>Areas for Improvement:</strong> ${student.behavior.improvement}</p>
    `;
}

function updateCommunicationSection(student) {
    const messagesList = document.getElementById('messagesList');
    messagesList.innerHTML = '';
    student.messages.forEach(message => {
        const li = document.createElement('li');
        li.innerHTML = `
            <p><strong>${message.from}</strong> - ${message.date}</p>
            <p>${message.content}</p>
        `;
        messagesList.appendChild(li);
    });
}

function showSection(sectionName) {
    const sections = document.querySelectorAll('.dashboard-section');
    sections.forEach(section => {
        section.classList.remove('active');
        section.classList.add('hidden');
    });

    const activeSection = document.getElementById(`${sectionName}Section`);
    activeSection.classList.remove('hidden');
    setTimeout(() => activeSection.classList.add('active'), 50);
}

function addNewAssignment() {
    const title = document.getElementById('newAssignmentTitle').value;
    const dueDate = document.getElementById('newAssignmentDueDate').value;
    const studentId = document.getElementById('studentSelect').value;

    if (title && dueDate) {
        const newAssignment = {
            id: Date.now().toString(),
            title: title,
            dueDate: dueDate,
            status: 'Not Started'
        };

        updateStudentData(studentId, student => {
            student.assignments.push(newAssignment);
            return student;
        });

        document.getElementById('newAssignmentTitle').value = '';
        document.getElementById('newAssignmentDueDate').value = '';

        loadStudentData();
    }
}

function deleteAssignment(assignmentId) {
    const studentId = document.getElementById('studentSelect').value;

    updateStudentData(studentId, student => {
        student.assignments = student.assignments.filter(a => a.id !== assignmentId);
        return student;
    });

    loadStudentData();
}

function sendNewMessage() {
    const content = document.getElementById('newMessageContent').value;
    const studentId = document.getElementById('studentSelect').value;

    if (content) {
        const newMessage = {
            from: 'Parent',
            date: new Date().toISOString().split('T')[0],
            content: content
        };

        updateStudentData(studentId, student => {
            student.messages.unshift(newMessage);
            return student;
        });

        document.getElementById('newMessageContent').value = '';

        loadStudentData();
    }   
}

function updateStudentData(studentId, updateFn) {
    const students = getStudentsData();
    const studentIndex = students.findIndex(s => s.id === studentId);
    if (studentIndex !== -1) {
        students[studentIndex] = updateFn(students[studentIndex]);
        // In a real app, you would send this update to a server
        console.log('Student data updated:', students[studentIndex]);
        loadStudentData();  // Reload the data to reflect changes
    }
}