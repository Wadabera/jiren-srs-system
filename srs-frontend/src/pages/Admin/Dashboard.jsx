import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Users, GraduationCap, Briefcase, TrendingUp, Calendar, Bell, Shield } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalStudents: 0, totalTeachers: 0, totalUsers: 0 });
  const [loading, setLoading] = useState(true);

  const performanceData = [
    { name: 'Grade 9', pass: 120, fail: 30 },
    { name: 'Grade 10', pass: 98, fail: 45 },
    { name: 'Grade 11', pass: 150, fail: 20 },
    { name: 'Grade 12', pass: 180, fail: 15 },
  ];

  const genderData = [
    { name: 'Male', value: 400 },
    { name: 'Female', value: 350 },
  ];
  
  const COLORS = ['var(--primary)', 'var(--secondary)'];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/users/stats');
        setStats(res.data);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon, color, label }) => (
    <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.05, transform: 'rotate(-15deg)' }}>
        {icon}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
        <div style={{ padding: '15px', background: color, color: 'white', borderRadius: '12px', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
          {icon}
        </div>
        <div>
          <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{title}</h4>
          <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{value}</h2>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--success)', fontWeight: 700 }}>
        <TrendingUp size={16} />
        <span>+12% from last month</span>
      </div>
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
        boxShadow: 'var(--shadow-brutal)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '3px solid black',
        position: 'relative',
        overflow: 'visible'
      }}>
        {user?.banner && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', borderRadius: 'calc(var(--radius) - 3px)', zIndex: 1 }}></div>}
        
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{ color: 'white', fontSize: '3.5rem', marginBottom: '15px', textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}>Admin Console</h1>
          <div style={{ display: 'flex', gap: '20px', fontSize: '1.1rem', fontWeight: 800 }}>
             <span style={{ background: '#000', border: '2px solid white', padding: '8px 20px', borderRadius: '12px', boxShadow: '4px 4px 0px white' }}>SYSTEM DIRECTOR</span>
             <span style={{ background: 'rgba(255,255,255,0.2)', border: '2px solid white', padding: '8px 20px', borderRadius: '12px' }}>{user?.fullname?.toUpperCase()}</span>
          </div>
        </div>

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
            <Shield size={64} color="var(--primary)" />
          )}
        </div>
      </div>
      
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}><h2>Loading analytics...</h2></div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '50px' }}>
            <StatCard title="TOTAL TEACHERS" value={stats.totalTeachers} icon={<Briefcase size={32} />} color="var(--primary)" />
            <StatCard title="TOTAL STUDENTS" value={stats.totalStudents} icon={<GraduationCap size={32} />} color="var(--secondary)" />
            <StatCard title="TOTAL ACTIVE USERS" value={stats.totalUsers} icon={<Users size={32} />} color="var(--success)" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2>Student Performance</h2>
                <select className="form-control" style={{ width: 'auto', padding: '8px 15px' }}>
                  <option>All Grades</option>
                  <option>Grade 12</option>
                </select>
              </div>
              <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontFamily: 'var(--font-sans)', fontWeight: 600}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontFamily: 'var(--font-sans)'}} />
                    <Tooltip 
                      cursor={{fill: '#f1f5f9'}}
                      contentStyle={{borderRadius: '12px', border: '2px solid black', boxShadow: 'var(--shadow-brutal)'}} 
                    />
                    <Bar dataKey="pass" radius={[4, 4, 0, 0]} fill="var(--primary)" name="Pass" />
                    <Bar dataKey="fail" radius={[4, 4, 0, 0]} fill="var(--secondary)" name="Fail" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card" style={{ background: 'var(--accent-gradient)', color: 'white' }}>
              <h2 style={{ color: 'white', marginBottom: '30px' }}>Demographics</h2>
              <div style={{ width: '100%', height: 300, display: 'flex', justifyContent: 'center' }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={genderData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={8} dataKey="value">
                      <Cell fill="#ffffff" />
                      <Cell fill="rgba(255,255,255,0.4)" />
                    </Pie>
                    <Tooltip 
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-premium)'}} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>Male Students</span>
                  <strong>400 (53%)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Female Students</span>
                  <strong>350 (47%)</strong>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
