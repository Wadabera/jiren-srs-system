import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Button from '../../components/Button';
import UserEditModal from '../../components/UserEditModal';

export default function ManageUsers() {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editType, setEditType] = useState('');

  const fetchData = async () => {
    try {
      const [sRes, tRes] = await Promise.all([
        api.get('/users/students'),
        api.get('/users/teachers')
      ]);
      setStudents(sRes.data);
      setTeachers(tRes.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      await api.delete(`/users/${type}/${id}`);
      fetchData();
    } catch (err) { alert('Error deleting user'); }
  };

  const openEdit = (user, type) => {
    setEditingUser(user);
    setEditType(type);
  };

  const filteredTeachers = teachers.filter(t => t.fullname.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredStudents = students.filter(s => s.fullname.toLowerCase().includes(searchQuery.toLowerCase()));

  const teacherColumns = [
    { label: 'PHOTO', field: 'photo', render: (val) => (
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '1px solid black', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {val ? <img src={val} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👤'}
      </div>
    )},
    { label: 'ID', field: 'teacherId' },
    { label: 'Name', field: 'fullname' },
    { label: 'Username', field: 'username' },
    { label: 'Subject', field: 'subjectCode' },
    { label: 'Classes', field: 'classes', render: (val) => val?.join(', ') }
  ];

  const studentColumns = [
    { label: 'PHOTO', field: 'photo', render: (val) => (
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '1px solid black', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {val ? <img src={val} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👤'}
      </div>
    )},
    { label: 'ID', field: 'studentId' },
    { label: 'Name', field: 'fullname' },
    { label: 'Username', field: 'username' },
    { label: 'Grade', field: 'grade' },
    { label: 'Class', field: 'class' }
  ];

  return (
    <div className="animate-fade-in">
      {editingUser && (
        <UserEditModal 
          user={editingUser} 
          type={editType} 
          onClose={() => setEditingUser(null)} 
          onUpdate={fetchData} 
        />
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h2 style={{ margin: 0 }}>User Directory</h2>
        <div className="search-wrapper" style={{ position: 'relative', width: '300px' }}>
          <input 
            type="text" 
            placeholder="Search by name..." 
            className="form-control"
            style={{ paddingLeft: '40px', borderRadius: '12px', border: '2px solid black' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span style={{ position: 'absolute', left: '15px', top: '12px' }}>🔍</span>
        </div>
      </div>
      
      <Card title="Faculty / Teachers" style={{ marginBottom: '40px' }}>
        <Table 
          columns={teacherColumns} 
          data={filteredTeachers} 
          keyField="_id"
          actions={(row) => (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button variant="primary" size="sm" onClick={() => openEdit(row, editType || (row.studentId ? 'student' : 'teacher'))}>Edit</Button>
              <Button variant="danger" size="sm" onClick={() => handleDelete(row.studentId ? 'student' : 'teacher', row.studentId || row.teacherId)}>Delete</Button>
            </div>
          )}
        />
      </Card>

      <Card title="Student Body">
        <Table 
          columns={studentColumns} 
          data={filteredStudents} 
          keyField="_id"
          actions={(row) => (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button variant="primary" size="sm" onClick={() => openEdit(row, 'student')}>Edit</Button>
              <Button variant="danger" size="sm" onClick={() => handleDelete('student', row.studentId)}>Delete</Button>
            </div>
          )}
        />
      </Card>
    </div>
  );
}
