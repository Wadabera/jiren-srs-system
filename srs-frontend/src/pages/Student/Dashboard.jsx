import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { BookOpen, Clock, Star, Award, Calendar, ChevronRight } from 'lucide-react';
import Table from '../../components/Table';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user) return;
      try {
        setProfile(user);
        if (user.studentId) {
          const aRes = await api.get(`/attendance/student/${user.studentId}`);
          setAttendance(aRes.data);
        }
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchDashboard();
  }, [user]);

  const totalClasses = attendance.length;
  const presentCount = attendance.filter(a => a.status === 'Present').length;
  const absentCount = attendance.filter(a => a.status === 'Absent').length;
  const lateCount = attendance.filter(a => a.status === 'Late').length;

  const attendanceData = [
    { name: 'Present', value: presentCount || 0 },
    { name: 'Absent', value: absentCount || 0 },
    { name: 'Late', value: lateCount || 0 }
  ];

  const COLORS = ['var(--success)', 'var(--danger)', 'var(--warning)'];

  const attendanceColumns = [
    { label: 'Date', field: 'date' },
    { label: 'Subject', field: 'subjectCode' },
    { label: 'Status', field: 'statusLabel' }
  ];

  const formattedAttendance = attendance.slice(0, 5).map(a => ({
    ...a,
    statusLabel: (
      <span className={`badge badge-${a.status === 'Present' ? 'success' : a.status === 'Absent' ? 'danger' : 'warning'}`}>
        {a.status}
      </span>
    )
  }));

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}><h2>Preparing your dashboard...</h2></div>;

  return (
    <div className="animate-fade-in">
      {/* Header Banner */}
      <div style={{ 
        background: profile?.banner ? `url("${profile.banner}") center/cover` : 'var(--accent-gradient)', 
        color: 'white', 
        padding: '60px 40px', 
        borderRadius: 'var(--radius)', 
        marginBottom: '60px',
        boxShadow: 'var(--shadow-brutal)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '3px solid black',
        position: 'relative',
        overflow: 'visible'
      }}>
        {profile?.banner && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', borderRadius: 'calc(var(--radius) - 3px)', zIndex: 1 }}></div>}
        
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{ color: 'white', fontSize: '3.5rem', marginBottom: '15px', textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}>Welcome, {profile?.fullname}</h1>
          <div style={{ display: 'flex', gap: '20px', fontSize: '1.1rem', fontWeight: 800 }}>
             <span style={{ background: 'var(--primary)', border: '2px solid black', padding: '8px 20px', borderRadius: '12px', boxShadow: '4px 4px 0px black' }}>GRADE {profile?.grade}-{profile?.class}</span>
             <span style={{ background: 'var(--secondary)', border: '2px solid black', padding: '8px 20px', borderRadius: '12px', boxShadow: '4px 4px 0px black' }}>{profile?.stream?.toUpperCase()}</span>
          </div>
        </div>

        {/* Top Right Profile Picture on Dashboard */}
        <div className="profile-pic-container" style={{ 
          position: 'absolute', 
          top: '-20px', 
          right: '30px', 
          width: '140px', 
          height: '140px',
          zIndex: 10,
          background: 'white'
        }}>
          {profile?.photo ? (
            <img src={profile.photo} alt="Avatar" className="profile-pic-img" />
          ) : (
            <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary)' }}>{profile?.fullname?.[0]}</div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '30px', marginBottom: '40px' }}>
         <div className="card" style={{ textAlign: 'center' }}>
            <BookOpen size={32} style={{ marginBottom: '15px', color: 'var(--primary)' }} />
            <h4 style={{ color: 'var(--text-muted)' }}>GPA</h4>
            <h2 style={{ fontSize: '2.5rem' }}>3.8</h2>
         </div>
         <div className="card" style={{ textAlign: 'center' }}>
            <Clock size={32} style={{ marginBottom: '15px', color: 'var(--secondary)' }} />
            <h4 style={{ color: 'var(--text-muted)' }}>ATTENDANCE</h4>
            <h2 style={{ fontSize: '2.5rem' }}>{totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0}%</h2>
         </div>
         <div className="card" style={{ textAlign: 'center' }}>
            <Star size={32} style={{ marginBottom: '15px', color: 'var(--success)' }} />
            <h4 style={{ color: 'var(--text-muted)' }}>RANK</h4>
            <h2 style={{ fontSize: '2.5rem' }}>#4</h2>
         </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2>Attendance Insight</h2>
            <Calendar size={20} color="var(--gray)" />
          </div>
          {totalClasses === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No attendance records found yet.</p>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
              <div style={{ width: '220px', height: '220px' }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={attendanceData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value">
                      {attendanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius: '12px', border: '2px solid black', boxShadow: 'var(--shadow-brutal)'}} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: 12, height: 12, background: 'var(--success)', borderRadius: '50%' }}></div>
                  <span style={{ fontWeight: 700 }}>{presentCount} Present</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: 12, height: 12, background: 'var(--danger)', borderRadius: '50%' }}></div>
                  <span style={{ fontWeight: 700 }}>{absentCount} Absent</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: 12, height: 12, background: 'var(--warning)', borderRadius: '50%' }}></div>
                  <span style={{ fontWeight: 700 }}>{lateCount} Late</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2>Recent Activity</h2>
            <button className="btn" style={{ padding: '5px 10px', fontSize: '0.7rem' }}>VIEW ALL <ChevronRight size={14} /></button>
          </div>
          {totalClasses === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No activity found yet.</p>
          ) : (
            <Table 
              columns={attendanceColumns}
              data={formattedAttendance}
              keyField="_id"
            />
          )}
        </div>
      </div>
    </div>
  );
}
