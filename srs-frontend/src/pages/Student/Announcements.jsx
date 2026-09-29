import { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function StudentAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    api.get('/announcements?for=student').then(res => setAnnouncements(res.data)).catch(console.error);
  }, []);

  return (
    <div className="card animate-fade-in">
      <h2>Announcements</h2>
      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {announcements.length === 0 ? <p>No announcements.</p> : announcements.map(a => (
          <div key={a._id} style={{ padding: '20px', borderLeft: '4px solid var(--primary)', background: 'var(--light)', borderRadius: '0 8px 8px 0' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>{a.title}</h3>
            <p style={{ margin: '0 0 10px 0', fontSize: '1.05rem' }}>{a.body}</p>
            <small style={{ color: 'var(--gray)' }}>Posted on: {new Date(a.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
