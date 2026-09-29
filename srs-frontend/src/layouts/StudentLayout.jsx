import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, FileText, Bell, User, Calendar, FolderOpen, MessageSquare, Menu, X } from 'lucide-react';
import './Layout.css';

export default function StudentLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/student', label: 'HOME', icon: <Home size={18} /> },
    { path: '/student/results', label: 'ACADEMIC RESULT', icon: <FileText size={18} /> },
    { path: '/student/timetable', label: 'TIMETABLE', icon: <Calendar size={18} /> },
    { path: '/student/resources', label: 'RESOURCES', icon: <FolderOpen size={18} /> },
    { path: '/student/announcements', label: 'ANNOUNCEMENTS', icon: <Bell size={18} /> },
    { path: '/student/messages', label: 'MESSAGES', icon: <MessageSquare size={18} /> },
    { path: '/student/profile', label: 'PROFILE', icon: <User size={18} /> },
  ];

  return (
    <div className="sidebar-layout">
      {isMenuOpen && <div className="sidebar-overlay" onClick={() => setIsMenuOpen(false)}></div>}

      <aside className={`sidebar animate-fade-in ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>SRS Student</h2>
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

