import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, Bell, Users, Calendar, CheckSquare, Edit, FolderOpen, MessageSquare, Menu, X, User } from 'lucide-react';
import './Layout.css';

export default function TeacherLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/teacher', label: 'HOME', icon: <Home size={18} /> },
    { path: '/teacher/timetable', label: 'TIMETABLE', icon: <Calendar size={18} /> },
    { path: '/teacher/resources', label: 'RESOURCES', icon: <FolderOpen size={18} /> },
    { path: '/teacher/announcements', label: 'ANNOUNCEMENT', icon: <Bell size={18} /> },
    { path: '/teacher/students', label: 'STUDENTS', icon: <Users size={18} /> },
    { path: '/teacher/attendance', label: 'ATTENDANCE', icon: <CheckSquare size={18} /> },
    { path: '/teacher/marks', label: 'MARKS', icon: <Edit size={18} /> },
    { path: '/teacher/messages', label: 'MESSAGES', icon: <MessageSquare size={18} /> },
    { path: '/teacher/profile', label: 'PROFILE', icon: <User size={18} /> },
  ];

  return (
    <div className="sidebar-layout">
      {isMenuOpen && <div className="sidebar-overlay" onClick={() => setIsMenuOpen(false)}></div>}

      <aside className={`sidebar animate-fade-in ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>SRS Teacher</h2>
          <button className="sidebar-close" onClick={() => setIsMenuOpen(false)}><X size={24} /></button>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <Link 
              key={item.path}
              to={item.path} 
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <div className="main-wrapper">
        <header className="main-header animate-fade-in">
          <button className="mobile-toggle" onClick={() => setIsMenuOpen(true)} style={{ marginRight: 'auto' }}>
            <Menu size={32} />
          </button>
          
          <div className="user-section">
            <div className="user-avatar">
              {user?.photo ? (
                <img src={user.photo} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                user?.fullname?.[0]
              )}
            </div>
            <span className="user-name">{user?.fullname}</span>
            <button onClick={logout} className="btn-logout" style={{ padding: '8px 15px' }}>
              <LogOut size={16} />
              <span>LOG OUT</span>
            </button>
          </div>
        </header>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

