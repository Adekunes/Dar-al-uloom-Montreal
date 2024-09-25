import React, { useState, useEffect } from 'react';
import { Bell, Calendar, Book, Users, MessageSquare, PieChart, Settings, FileText, CheckCircle, AlertTriangle, Search, Mail, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Mock data for demonstration
const mockPerformanceData = [
  { name: 'Week 1', Quran: 80, Arabic: 65, Islamic_Studies: 75 },
  { name: 'Week 2', Quran: 85, Arabic: 70, Islamic_Studies: 80 },
  { name: 'Week 3', Quran: 75, Arabic: 80, Islamic_Studies: 85 },
  { name: 'Week 4', Quran: 90, Arabic: 75, Islamic_Studies: 70 },
];

const mockAssignments = [
  { id: 1, title: 'Memorize Surah Al-Baqarah 1-5', dueDate: '2024-09-15', status: 'pending' },
  { id: 2, title: 'Arabic Vocabulary Quiz', dueDate: '2024-09-10', status: 'completed' },
  { id: 3, title: 'Islamic History Essay', dueDate: '2024-09-20', status: 'overdue' },
];

const DashboardCard = ({ title, icon, content, subContent, onClick }) => (
  <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={onClick}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{content}</div>
      {subContent && <p className="text-xs text-muted-foreground mt-1">{subContent}</p>}
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [userRole, setUserRole] = useState('teacher');
  const [activeTab, setActiveTab] = useState('overview');
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const OverviewTab = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <DashboardCard 
          title="Assignments" 
          icon={<Book className="h-4 w-4 text-blue-500" />} 
          content="5 pending"
          subContent="2 overdue"
          onClick={() => setActiveTab('assignments')}
        />
        <DashboardCard 
          title="Messages" 
          icon={<MessageSquare className="h-4 w-4 text-green-500" />} 
          content="3 unread"
          subContent="1 from parents"
          onClick={() => setActiveTab('messages')}
        />
        <DashboardCard 
          title="Attendance" 
          icon={<Users className="h-4 w-4 text-purple-500" />} 
          content="95%"
          subContent="3% increase from last week"
          onClick={() => setActiveTab('attendance')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700">Recent Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-2 bg-blue-50 border-blue-200">
              <Bell className="h-4 w-4 text-blue-500" />
              <AlertTitle className="font-semibold text-blue-700">New Assignment Posted</AlertTitle>
              <AlertDescription className="text-blue-600">
                Surah Al-Baqarah verses 1-5 due next week.
              </AlertDescription>
            </Alert>
            <Alert className="bg-purple-50 border-purple-200">
              <Calendar className="h-4 w-4 text-purple-500" />
              <AlertTitle className="font-semibold text-purple-700">Upcoming Event</AlertTitle>
              <AlertDescription className="text-purple-600">
                Parent-Teacher Meeting on 15th September.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700">Class Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-blue-600">Quran Memorization</span>
                  <span className="text-sm font-medium text-blue-600">75%</span>
                </div>
                <Progress value={75} className="w-full h-2 bg-blue-200" indicatorClassName="bg-blue-600" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-green-600">Arabic Language</span>
                  <span className="text-sm font-medium text-green-600">60%</span>
                </div>
                <Progress value={60} className="w-full h-2 bg-green-200" indicatorClassName="bg-green-600" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-purple-600">Islamic Studies</span>
                  <span className="text-sm font-medium text-purple-600">80%</span>
                </div>
                <Progress value={80} className="w-full h-2 bg-purple-200" indicatorClassName="bg-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const PerformanceTab = () => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-700">Class Performance Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockPerformanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Quran" fill="#3b82f6" />
            <Bar dataKey="Arabic" fill="#10b981" />
            <Bar dataKey="Islamic_Studies" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  const ResourcesTab = () => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-700">Resource Library</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {['Quran Recitation Guide', 'Arabic Grammar Workbook', 'Islamic History Timeline'].map((resource, index) => (
            <li key={index} className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md transition-colors duration-200">
              <FileText className="h-4 w-4 text-blue-500" />
              <span className="text-gray-700">{resource}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );

  const AssignmentsTab = () => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-700">Assignments</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {mockAssignments.map((assignment) => (
            <li 
              key={assignment.id} 
              className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md transition-colors duration-200 cursor-pointer"
              onClick={() => {
                setSelectedAssignment(assignment);
                setShowAssignmentModal(true);
              }}
            >
              <div>
                <span className="text-gray-700">{assignment.title}</span>
                <p className="text-sm text-gray-500">Due: {assignment.dueDate}</p>
              </div>
              <Badge 
                variant={assignment.status === 'completed' ? 'success' : assignment.status === 'overdue' ? 'destructive' : 'default'}
              >
                {assignment.status}
              </Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );

  const AssignmentModal = ({ assignment, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">{assignment.title}</h2>
        <p className="mb-2">Due Date: {assignment.dueDate}</p>
        <p className="mb-4">Status: {assignment.status}</p>
        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Madrasah Dashboard</h1>
        <div className="flex items-center space-x-4">
          <Input 
            type="text" 
            placeholder="Search..." 
            className="max-w-xs"
            startAdornment={<Search className="h-4 w-4 text-gray-500" />}
          />
          <Avatar>
            <AvatarImage src="/api/placeholder/400/320" alt="User" />
            <AvatarFallback>US</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700">User Name</span>
            <span className="text-xs text-gray-500">Role: {userRole}</span>
          </div>
          <Button variant="ghost" size="icon">
            <Mail className="h-5 w-5 text-gray-500" />
          </Button>
          <Button variant="ghost" size="icon">
            <LogOut className="h-5 w-5 text-gray-500" />
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-white p-1 rounded-lg shadow-sm">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gray-100">Overview</TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-gray-100">Performance</TabsTrigger>
          <TabsTrigger value="resources" className="data-[state=active]:bg-gray-100">Resources</TabsTrigger>
          <TabsTrigger value="assignments" className="data-[state=active]:bg-gray-100">Assignments</TabsTrigger>
        </TabsList>
        <TabsContent value="overview"><OverviewTab /></TabsContent>
        <TabsContent value="performance"><PerformanceTab /></TabsContent>
        <TabsContent value="resources"><ResourcesTab /></TabsContent>
        <TabsContent value="assignments"><AssignmentsTab /></TabsContent>
      </Tabs>

      <Card className="mt-6 hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-700">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark Attendance
            </Button>
            <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-50">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Report Issue
            </Button>
          </div>
        </CardContent>
      </Card>

      {showAssignmentModal && selectedAssignment && (
        <AssignmentModal 
          assignment={selectedAssignment} 
          onClose={() => {
            setShowAssignmentModal(false);
            setSelectedAssignment(null);
          }} 
        />
      )}
    </div>
  );
};

export default Dashboard;