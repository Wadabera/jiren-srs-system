import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Users, FileCheck, CheckCircle, ArrowRight, MessageSquare } from 'lucide-react';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ students: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [sRes, tRes] = await Promise.all([
          api.get('/users/students'),
          api.get('/users/me')
        ]);
        const myClasses = tRes.data.classes || [];
        const myGrade = tRes.data.grade;
        const myStudents = sRes.data.filter(s => s.grade === myGrade && myClasses.includes(s.class));
        setStats({ students: myStudents.length });
      } catch (err) { console.error(err); }
    };
    fetchStats();
  }, []);

  const QuickAction = ({ title, value, icon, color, onClick, buttonText }) => (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ padding: '12px', background: color, color: 'white', borderRadius: '12px' }}>{icon}</div>
        <h1 style={{ margin: 0, fontSize: '3rem', opacity: 0.2 }}>{value}</h1>
      </div>
      <h3 style={{ marginBottom: '10px' }}>{title}</h3>
      <button 
        className="btn btn-primary" 
        style={{ marginTop: 'auto', width: '100%' }}
        onClick={onClick}
      >
        {buttonText} <ArrowRight size={18} />
      </button>
    </div>
  );
  
  return (
    <div className="animate-fade-in">
      <div style={{ 
        background: user?.banner ? `url("${user.banner}") center/cover` : 'var(--accent-gradient)', 
        color: 'white', 
        padding: '60px 40px', 
        borderRadius: 'var(--radius)', 
        marginBottom: '60px',
        border: '3px solid black',
        boxShadow: 'var(--shadow-brutal)',
        position: 'relative',
        overflow: 'visible'
      }}>
        {user?.banner && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', borderRadius: 'calc(var(--radius) - 3px)', zIndex: 1 }}></div>}
        
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{ color: 'white', fontSize: '3.5rem', marginBottom: '10px', textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}>Hello, {user?.fullname}</h1>
          <div style={{ display: 'flex', gap: '20px', fontSize: '1.1rem', fontWeight: 800 }}>
             <span style={{ background: 'var(--primary)', border: '2px solid black', padding: '8px 20px', borderRadius: '12px', boxShadow: '4px 4px 0px black' }}>TEACHER CONSOLE</span>
             <span style={{ background: 'var(--secondary)', border: '2px solid black', padding: '8px 20px', borderRadius: '12px', boxShadow: '4px 4px 0px black' }}>{stats.students} STUDENTS</span>
          </div>
        </div>

        {/* Top Right Profile Picture */}
        <div className="profile-pic-container" style={{ 
          position: 'absolute', 
          top: '-20px', 
          right: '30px', 
          width: '140px', 
          height: '140px',
          zIndex: 10,
          background: 'white'
        }}>
          {user?.photo ? (
            <img src={user.photo} alt="Avatar" className="profile-pic-img" />
          ) : (
            <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary)' }}>{user?.fullname?.[0]}</div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        <QuickAction 
          title="Classroom Roster" 
          value={stats.students} 
          icon={<Users size={28} />} 
          color="var(--primary)" 
          onClick={() => navigate('/teacher/students')}
          buttonText="VIEW STUDENTS"
        />
        
        <QuickAction 
          title="Grading System" 
          value="A+" 
          icon={<FileCheck size={28} />} 
          color="var(--secondary)" 
          onClick={() => navigate('/teacher/marks')}
          buttonText="MANAGE MARKS"
        />
        
        <QuickAction 
          title="Daily Attendance" 
          value="98%" 
          icon={<CheckCircle size={28} />} 
          color="var(--success)" 
          onClick={() => navigate('/teacher/attendance')}
          buttonText="MARK ATTENDANCE"
        />
      </div>

      <div className="card" style={{ marginTop: '40px', background: 'var(--light)', borderStyle: 'dashed' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ padding: '15px', background: 'var(--accent-gradient)', color: 'white', borderRadius: '50%' }}>
              <MessageSquare size={24} />
            </div>
            <div>
              <h3>Recent Messages</h3>
              <p>You have new messages from the administration department.</p>
            </div>
            <button className="btn btn-secondary" style={{ marginLeft: 'auto' }} onClick={() => navigate('/teacher/messages')}>OPEN CHAT</button>
         </div>
      </div>
    </div>
  );
}
