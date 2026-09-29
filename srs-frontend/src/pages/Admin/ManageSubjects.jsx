import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Card from '../../components/Card';
import Table from '../../components/Table';

export default function ManageSubjects() {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    api.get('/subjects').then(res => setSubjects(res.data)).catch(console.error);
  }, []);

  const columns = [
    { label: 'Subject Code', field: 'subjectCode' },
    { label: 'Subject Name', field: 'subjectName' },
    { label: 'Grade', field: 'grade' },
    { label: 'Stream', field: 'stream' }
  ];

  return (
    <Card title="Manage Subjects" className="animate-fade-in">
      <Table 
        columns={columns} 
        data={subjects.map(s => ({...s, stream: s.stream || '-'}))} 
        keyField="_id" 
      />
    </Card>
  );
}
