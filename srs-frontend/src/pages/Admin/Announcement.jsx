import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function AdminAnnouncement() {
  const [formData, setFormData] = useState({ title: '', body: '', announcementFor: 'student' });
  const [announcements, setAnnouncements] = useState([]);

  const fetchAnnouncements = () => {
    api.get('/announcements').then(res => setAnnouncements(res.data)).catch(console.error);
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
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
      <Card title="Post Announcement">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <Input 
            label="Title" 
            placeholder="Announcement Title" 
            value={formData.title} 
            onChange={e=>setFormData({...formData, title: e.target.value})} 
            required 
          />
          <Input 
            type="textarea"
            label="Message Body"
            placeholder="Type your announcement here..." 
            value={formData.body} 
            onChange={e=>setFormData({...formData, body: e.target.value})} 
            rows="5" 
            required 
          />
          <Input 
            type="select"
            label="Target Audience"
            value={formData.announcementFor} 
            onChange={e=>setFormData({...formData, announcementFor: e.target.value})}
            options={[
              { value: 'student', label: 'For Students' },
              { value: 'teacher', label: 'For Teachers' },
              { value: 'all', label: 'For Everyone' }
            ]}
          />
          <Button type="submit" variant="primary" style={{ marginTop: '10px' }}>Post Announcement</Button>
        </form>
      </Card>
      
      <Card title="Recent Announcements">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {announcements.length === 0 ? (
            <p>No announcements found.</p>
          ) : announcements.map(a => (
            <div key={a._id} style={{ padding: '20px', border: '2px solid var(--heavy-border)', borderRadius: '0', background: 'var(--light)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <h4 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'var(--font-serif)' }}>{a.title}</h4>
                <span className="badge badge-primary">{a.announcementFor.toUpperCase()}</span>
              </div>
              <p style={{ margin: '15px 0', fontSize: '1rem', whiteSpace: 'pre-wrap' }}>{a.body}</p>
              <small style={{ color: 'var(--gray)', fontWeight: 600 }}>{new Date(a.createdAt).toLocaleString()}</small>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
