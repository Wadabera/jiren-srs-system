import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, Bell, Users, UserPlus, Settings, BookOpen, Calendar, MessageSquare, User, Menu, X } from 'lucide-react';
import './Layout.css';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="sidebar-layout">
      {/* Sidebar Overlay for Mobile */}
      {isMenuOpen && <div className="sidebar-overlay" onClick={() => setIsMenuOpen(false)}></div>}

      <aside className={`sidebar animate-fade-in ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Director</h2>
          <button className="sidebar-close" onClick={() => setIsMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {[
            { to: '/admin', icon: <Home size={20} />, label: 'HOME' },
            { to: '/admin/announcements', icon: <Bell size={20} />, label: 'ANNOUNCEMENT' },
            { to: '/admin/users', icon: <Users size={20} />, label: 'USERS LIST' },
            { to: '/admin/users/add', icon: <UserPlus size={20} />, label: 'ADD USER' },
            { to: '/admin/subjects/add', icon: <BookOpen size={20} />, label: 'ADD SUBJECT' },
            { to: '/admin/subjects', icon: <Settings size={20} />, label: 'MANAGE SUBJECT' },
            { to: '/admin/timetable', icon: <Calendar size={20} />, label: 'TIMETABLE' },
            { to: '/admin/messages', icon: <MessageSquare size={20} />, label: 'MESSAGES' },
            { to: '/admin/profile', icon: <User size={20} />, label: 'MY PROFILE' },
          ].map(item => (
            <Link 
              key={item.to}
              to={item.to} 
              className={`nav-item ${isActive(item.to)}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <div className="main-wrapper">
        <header className="main-header">
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
              LOG OUT
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


