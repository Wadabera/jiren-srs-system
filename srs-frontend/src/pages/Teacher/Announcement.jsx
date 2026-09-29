import { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function TeacherAnnouncement() {
  const [formData, setFormData] = useState({ title: '', body: '', announcementFor: 'student' });
  const [myAnnouncements, setMyAnnouncements] = useState([]);
  const [adminAnnouncements, setAdminAnnouncements] = useState([]);

  const fetchAnnouncements = () => {
    api.get('/announcements?for=student').then(res => setMyAnnouncements(res.data)).catch(console.error);
    api.get('/announcements?for=teacher').then(res => setAdminAnnouncements(res.data)).catch(console.error);
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/announcements', formData);
      setFormData({ title: '', body: '', announcementFor: 'student' });
      fetchAnnouncements();
    } catch (err) {
      alert(err.response?.data?.message || 'Error posting announcement');
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
      <div className="card">
        <h2>Post Announcement to Students</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
          <input placeholder="Title" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} className="form-control" required />
          <textarea placeholder="Message Body" value={formData.body} onChange={e=>setFormData({...formData, body: e.target.value})} className="form-control" rows="5" required />
          <button type="submit" className="btn btn-primary">Post Announcement</button>
        </form>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="card">
          <h2 style={{ color: 'var(--danger)' }}>Announcements from Admin</h2>
          <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {adminAnnouncements.length === 0 ? <p>No announcements.</p> : adminAnnouncements.map(a => (
              <div key={a._id} style={{ padding: '10px', borderLeft: '3px solid var(--danger)', background: 'var(--light)' }}>
                <h4>{a.title}</h4><p style={{ margin: '5px 0' }}>{a.body}</p>
                <small>{new Date(a.createdAt).toLocaleString()}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2>Your Recent Posts (Students)</h2>
          <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {myAnnouncements.length === 0 ? <p>No announcements posted.</p> : myAnnouncements.slice(0, 5).map(a => (
              <div key={a._id} style={{ padding: '10px', borderLeft: '3px solid var(--primary)', background: 'var(--light)' }}>
                <h4>{a.title}</h4><p style={{ margin: '5px 0' }}>{a.body}</p>
                <small>{new Date(a.createdAt).toLocaleString()}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
