import { useState } from 'react';
import api from '../../api/axios';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function AddSubject() {
  const [formData, setFormData] = useState({ subjectName: '', grade: '', stream: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await api.post('/subjects', { ...formData, grade: Number(formData.grade) });
      setMessage('Subject added successfully!');
      setFormData({ subjectName: '', grade: '', stream: '' });
    } catch (err) {
      setError(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <Card title="Add New Subject" className="animate-fade-in" style={{ maxWidth: '600px' }}>
      {message && <div style={{ padding: '15px', background: 'var(--success)', color: 'white', marginBottom: '20px', fontWeight: 'bold' }}>{message}</div>}
      {error && <div style={{ padding: '15px', background: 'var(--danger)', color: 'white', marginBottom: '20px', fontWeight: 'bold' }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Input label="Subject Name" name="subjectName" placeholder="Biology" value={formData.subjectName} onChange={(e)=>setFormData({...formData, subjectName: e.target.value})} required />
        <Input label="Grade" type="number" name="grade" placeholder="9" value={formData.grade} onChange={(e)=>setFormData({...formData, grade: e.target.value})} required />
        <Input label="Stream (Optional)" name="stream" placeholder="Natural Science" value={formData.stream} onChange={(e)=>setFormData({...formData, stream: e.target.value})} />
        <Button type="submit" variant="primary" size="lg">Add Subject</Button>
      </form>
    </Card>
  );
}
