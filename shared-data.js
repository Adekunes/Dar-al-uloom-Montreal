const mockStudentsData = [
    {
        id: '1',
        name: 'Ahmed Hassan',
        overallProgress: 85,
        attendance: 95,
        nextMeeting: { date: '2024-10-15', time: '14:00' },
        subjects: [
            { name: 'Mathematics', progress: 90 },
            { name: 'Science', progress: 85 },
            { name: 'Islamic Studies', progress: 95 },
            { name: 'Arabic', progress: 80 },
            { name: 'English', progress: 88 }
        ],
        assignments: [
            { id: '1', title: 'Math Homework', dueDate: '2024-10-10', status: 'Completed' },
            { id: '2', title: 'Science Project', dueDate: '2024-10-20', status: 'In Progress' },
            { id: '3', title: 'Arabic Essay', dueDate: '2024-10-18', status: 'Not Started' }
        ],
        behavior: {
            overall: 'Excellent',
            participation: 'Very active in class discussions',
            improvement: 'Could improve time management skills'
        },
        attendanceHistory: [
            { month: 'Sep', attendance: 95 },
            { month: 'Oct', attendance: 98 },
            { month: 'Nov', attendance: 92 },
            { month: 'Dec', attendance: 96 },
            { month: 'Jan', attendance: 94 },
            { month: 'Feb', attendance: 97 }
        ],
        recentActivity: [
            'Scored 95% on Math quiz',
            'Submitted Science project draft',
            'Participated in Islamic Studies debate'
        ],
        messages: [
            { from: 'Mrs. Fatima (Math Teacher)', date: '2024-10-05', content: 'Ahmed has shown great improvement in Algebra this month.' },
            { from: 'Mr. Ali (Science Teacher)', date: '2024-10-03', content: 'Please remind Ahmed to bring his lab notebook tomorrow.' }
        ]
    },
    {
        id: '2',
        name: 'Fatima Ali',
        overallProgress: 78,
        attendance: 92,
        nextMeeting: { date: '2024-10-16', time: '15:30' },
        subjects: [
            { name: 'Mathematics', progress: 75 },
            { name: 'Science', progress: 80 },
            { name: 'Islamic Studies', progress: 90 },
            { name: 'Arabic', progress: 85 },
            { name: 'English', progress: 82 }
        ],
        assignments: [
            { id: '1', title: 'English Book Report', dueDate: '2024-10-12', status: 'Completed' },
            { id: '2', title: 'Math Quiz Prep', dueDate: '2024-10-14', status: 'In Progress' },
            { id: '3', title: 'Islamic Studies Presentation', dueDate: '2024-10-22', status: 'Not Started' }
        ],
        behavior: {
            overall: 'Good',
            participation: 'Participates well in group activities',
            improvement: 'Could raise hand more often to answer questions'
        },
        attendanceHistory: [
            { month: 'Sep', attendance: 92 },
            { month: 'Oct', attendance: 94 },
            { month: 'Nov', attendance: 90 },
            { month: 'Dec', attendance: 93 },
            { month: 'Jan', attendance: 91 },
            { month: 'Feb', attendance: 95 }
        ],
        recentActivity: [
            'Completed English book report',
            'Volunteered to lead Islamic Studies group discussion',
            'Improved score on weekly Math quiz'
        ],
        messages: [
            { from: 'Ms. Zainab (English Teacher)', date: '2024-10-06', content: 'Fatima has improved her English book report was very well written. Great job!' },
            { from: 'Mr. Hassan (Islamic Studies)', date: '2024-10-04', content: 'Fatima showed excellent leadership skills in todays group discussion.' }
        ]
    }
];

function getStudentsData() {
    return mockStudentsData;
}

function updateStudentData(studentId, updateFn) {
    const studentIndex = mockStudentsData.findIndex(s => s.id === studentId);
    if (studentIndex !== -1) {
        mockStudentsData[studentIndex] = updateFn(mockStudentsData[studentIndex]);
        // In a real app, you would send this update to a server
        console.log('Student data updated:', mockStudentsData[studentIndex]);
    }
}

// If using ES6 modules
// export { getStudentsData, updateStudentData };

// If not using modules, these functions will be available globally