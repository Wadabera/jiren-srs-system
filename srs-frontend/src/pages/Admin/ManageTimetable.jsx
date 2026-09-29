import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Table from '../../components/Table';

export default function ManageTimetable() {
  const [timetable, setTimetable] = useState([]);
  const [formData, setFormData] = useState({
    grade: '', class: '', dayOfWeek: 'Monday', startTime: '', endTime: '', subjectCode: '', teacherId: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchTimetable = async () => {
    try {
      const res = await api.get('/timetable');
      setTimetable(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchTimetable(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await api.post('/timetable', { ...formData, grade: Number(formData.grade) });
      setMessage('Timetable entry added successfully!');
      setFormData({ grade: '', class: '', dayOfWeek: 'Monday', startTime: '', endTime: '', subjectCode: '', teacherId: '' });
      fetchTimetable();
    } catch (err) {
      setError(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this timetable entry?')) return;
    try {
      await api.delete(`/timetable/${id}`);
      fetchTimetable();
    } catch (err) { alert('Error deleting entry'); }
  };

  const columns = [
    { label: 'Grade', field: 'grade' },
    { label: 'Class', field: 'class' },
    { label: 'Day', field: 'dayOfWeek' },
    { label: 'Time', field: 'timeRange' },
    { label: 'Subject', field: 'subjectCode' },
    { label: 'Teacher ID', field: 'teacherId' }
  ];

  const formattedData = timetable.map(t => ({
    ...t,
    timeRange: `${t.startTime} - ${t.endTime}`
  }));

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <Card title="Add Timetable Entry">
        {message && <div style={{ padding: '15px', background: 'var(--success)', color: 'white', marginBottom: '20px', fontWeight: 'bold' }}>{message}</div>}
        {error && <div style={{ padding: '15px', background: 'var(--danger)', color: 'white', marginBottom: '20px', fontWeight: 'bold' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <Input label="Grade" type="number" value={formData.grade} onChange={e=>setFormData({...formData, grade: e.target.value})} required />
          <Input label="Class" placeholder="e.g. A" value={formData.class} onChange={e=>setFormData({...formData, class: e.target.value})} required />
          <Input 
            type="select" 
            label="Day of Week" 
            value={formData.dayOfWeek} 
            onChange={e=>setFormData({...formData, dayOfWeek: e.target.value})}
            options={days.map(d => ({ label: d, value: d }))}
          />
          <Input label="Start Time" type="time" value={formData.startTime} onChange={e=>setFormData({...formData, startTime: e.target.value})} required />
          <Input label="End Time" type="time" value={formData.endTime} onChange={e=>setFormData({...formData, endTime: e.target.value})} required />
          <Input label="Subject Code" placeholder="e.g. MATH-101" value={formData.subjectCode} onChange={e=>setFormData({...formData, subjectCode: e.target.value})} required />
          <Input label="Teacher ID" placeholder="e.g. TCH-001" value={formData.teacherId} onChange={e=>setFormData({...formData, teacherId: e.target.value})} required />
          
          <div style={{ gridColumn: '1 / -1' }}>
            <Button type="submit" variant="primary">Add Entry</Button>
          </div>
        </form>
      </Card>

      <Card title="Manage Timetable">
        <Table 
          columns={columns}
          data={formattedData}
          keyField="_id"
          actions={(row) => (
            <Button variant="danger" size="sm" onClick={() => handleDelete(row._id)}>Delete</Button>
          )}
        />
      </Card>
    </div>
  );
}
