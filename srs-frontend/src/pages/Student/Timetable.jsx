import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Card';

export default function StudentTimetable() {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const pRes = await api.get('/users/me');
        if (pRes.data.grade && pRes.data.class) {
          const res = await api.get(`/timetable/class?grade=${pRes.data.grade}&class=${pRes.data.class}`);
          setTimetable(res.data);
        }
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchTimetable();
  }, []);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  if (loading) return <div>Loading timetable...</div>;

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '30px' }}>My Class Timetable</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {days.map(day => {
          const dayClasses = timetable.filter(t => t.dayOfWeek === day);
          if (dayClasses.length === 0) return null;
          
          return (
            <Card key={day} title={day} style={{ background: 'var(--card-bg)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                {dayClasses.map(cls => (
                  <div key={cls._id} style={{ padding: '15px', border: '2px solid var(--heavy-border)', background: 'var(--light)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ fontWeight: 900, fontSize: '1.1rem', marginBottom: '5px' }}>{cls.subjectCode}</div>
                    <div style={{ color: 'var(--primary)', fontWeight: 700 }}>{cls.startTime} - {cls.endTime}</div>
                    <div style={{ color: 'var(--gray)', fontSize: '0.9rem', marginTop: '10px' }}>Teacher: {cls.teacherId}</div>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
        {timetable.length === 0 && <p>No timetable assigned yet.</p>}
      </div>
    </div>
  );
}
