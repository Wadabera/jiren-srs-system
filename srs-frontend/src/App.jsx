import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Messages from './pages/Messages';
import Profile from './pages/Shared/Profile';

// Layouts
import StudentLayout from './layouts/StudentLayout';
import TeacherLayout from './layouts/TeacherLayout';
import AdminLayout from './layouts/AdminLayout';

// Student Pages
import StudentDashboard from './pages/Student/Dashboard';
import AcademicResult from './pages/Student/AcademicResult';
import StudentAnnouncements from './pages/Student/Announcements';
import StudentTimetable from './pages/Student/Timetable';
import StudentResources from './pages/Student/Resources';

// Teacher Pages
import TeacherDashboard from './pages/Teacher/Dashboard';
import TeacherAnnouncement from './pages/Teacher/Announcement';
import ViewStudents from './pages/Teacher/ViewStudents';
import ManageMarks from './pages/Teacher/ManageMarks';
import TeacherAttendance from './pages/Teacher/Attendance';
import TeacherTimetable from './pages/Teacher/Timetable';
import TeacherResources from './pages/Teacher/Resources';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import AddUser from './pages/Admin/AddUser';
import ManageUsers from './pages/Admin/ManageUsers';
import AddSubject from './pages/Admin/AddSubject';
import ManageSubjects from './pages/Admin/ManageSubjects';
import AdminAnnouncement from './pages/Admin/Announcement';
import ManageTimetable from './pages/Admin/ManageTimetable';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRole && user.role !== allowedRole) {
    if (user.role === 'student') return <Navigate to="/student" />;
    if (user.role === 'teacher') return <Navigate to="/teacher" />;
    if (user.role === 'director') return <Navigate to="/admin" />;
  }
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Navigate to="/login" replace />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      {/* Student Routes */}
      <Route path="/student" element={<ProtectedRoute allowedRole="student"><StudentLayout /></ProtectedRoute>}>
        <Route index element={<StudentDashboard />} />
        <Route path="results" element={<AcademicResult />} />
        <Route path="announcements" element={<StudentAnnouncements />} />
        <Route path="timetable" element={<StudentTimetable />} />
        <Route path="resources" element={<StudentResources />} />
        <Route path="messages" element={<Messages />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Teacher Routes */}
      <Route path="/teacher" element={<ProtectedRoute allowedRole="teacher"><TeacherLayout /></ProtectedRoute>}>
        <Route index element={<TeacherDashboard />} />
        <Route path="announcements" element={<TeacherAnnouncement />} />
        <Route path="students" element={<ViewStudents />} />
        <Route path="attendance" element={<TeacherAttendance />} />
        <Route path="marks" element={<ManageMarks />} />
        <Route path="timetable" element={<TeacherTimetable />} />
        <Route path="resources" element={<TeacherResources />} />
        <Route path="messages" element={<Messages />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRole="director"><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="users/add" element={<AddUser />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="subjects/add" element={<AddSubject />} />
        <Route path="subjects" element={<ManageSubjects />} />
        <Route path="announcements" element={<AdminAnnouncement />} />
        <Route path="timetable" element={<ManageTimetable />} />
        <Route path="messages" element={<Messages />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;