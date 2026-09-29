import { useState, useEffect } from 'react';
import api from '../api/axios';
import Button from './Button';
import Input from './Input';
import { X, Loader2, Save } from 'lucide-react';

export default function UserEditModal({ user, type, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    fullname: user.fullname || '',
    email: user.email || '',
    phone: user.phone || '',
    grade: user.grade || '',
    class: user.class || '',
    stream: user.stream || '',
    subjectCode: user.subjectCode || '',
    classes: user.classes?.join(', ') || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const id = user.studentId || user.teacherId;
      await api.patch(`/users/${type}/${id}`, formData);
      onUpdate();
      onClose();
    } catch (err) {
      alert('Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', 
      display: 'flex', alignItems: 'center', justifyContent: 'center', 
      zIndex: 2000, backdropFilter: 'blur(5px)', padding: '20px'
    }}>
      <div className="card animate-scale-in" style={{ width: '100%', maxWidth: '600px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', right: '20px', top: '20px', background: 'none', border: 'none', cursor: 'pointer' }}>
          <X size={24} />
        </button>
        
        <h2 style={{ marginBottom: '30px' }}>Edit {type === 'student' ? 'Student' : 'Teacher'}</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Full Name</label>
            <Input value={formData.fullname} onChange={e => setFormData({...formData, fullname: e.target.value})} required />
          </div>

          <div>
            <label className="form-label">Email</label>
            <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          </div>

          <div>
            <label className="form-label">Phone</label>
            <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>

          {type === 'student' ? (
            <>
              <div>
                <label className="form-label">Grade</label>
                <Input value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})} />
              </div>
              <div>
                <label className="form-label">Class</label>
                <Input value={formData.class} onChange={e => setFormData({...formData, class: e.target.value})} />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="form-label">Subject Code</label>
                <Input value={formData.subjectCode} onChange={e => setFormData({...formData, subjectCode: e.target.value})} />
              </div>
              <div>
                <label className="form-label">Classes (e.g. A, B)</label>
                <Input value={formData.classes} onChange={e => setFormData({...formData, classes: e.target.value})} />
              </div>
            </>
          )}

          <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '20px' }}>
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
