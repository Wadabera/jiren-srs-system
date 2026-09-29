import { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Table from '../../components/Table';

export default function TeacherResources() {
  const { user } = useAuth();
  const [teacherData, setTeacherData] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploadData, setUploadData] = useState({ title: '', grade: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  const fetchFiles = async (teacherId) => {
    try {
      const res = await api.get('/files');
      setFiles(res.data.filter(f => f.teacherId === teacherId));
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/users/me');
        setTeacherData(res.data);
        if (res.data.teacherId) fetchFiles(res.data.teacherId);
      } catch (err) { console.error(err); }
    };
    load();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile || !teacherData) return;
    setMessage('');

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', uploadData.title);
    formData.append('grade', uploadData.grade);
    formData.append('subjectCode', teacherData.subjectCode);
    formData.append('teacherId', teacherData.teacherId);

    try {
      await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('File uploaded successfully!');
      setUploadData({ title: '', grade: '' });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchFiles(teacherData.teacherId);
    } catch (err) {
      alert('Error uploading file');
    }
  };

  const columns = [
    { label: 'Title', field: 'title' },
    { label: 'Filename', field: 'filename' },
    { label: 'Grade', field: 'grade' },
    { label: 'Subject', field: 'subjectCode' },
    { label: 'Date', field: 'dateUploaded' }
  ];

  const formattedFiles = files.map(f => ({
    ...f,
    dateUploaded: new Date(f.createdAt).toLocaleDateString()
  }));

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <Card title="Upload Resource / Assignment">
        {message && <div style={{ padding: '15px', background: 'var(--success)', color: 'white', marginBottom: '20px', fontWeight: 'bold' }}>{message}</div>}
        <form onSubmit={handleUpload} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <Input 
            label="Document Title" 
            placeholder="e.g. Chapter 1 Notes" 
            value={uploadData.title} 
            onChange={e=>setUploadData({...uploadData, title: e.target.value})} 
            required 
          />
          <Input 
            label="Target Grade" 
            type="number"
            placeholder="e.g. 9" 
            value={uploadData.grade} 
            onChange={e=>setUploadData({...uploadData, grade: e.target.value})} 
            required 
          />
          <div className="form-group">
            <label className="form-label">Select File</label>
            <input 
              type="file" 
              className="form-control" 
              onChange={e=>setSelectedFile(e.target.files[0])} 
              ref={fileInputRef}
              required 
            />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <Button type="submit" variant="primary">Upload File</Button>
          </div>
        </form>
      </Card>

      <Card title="My Uploaded Resources">
        <Table 
          columns={columns}
          data={formattedFiles}
          keyField="_id"
          actions={(row) => (
            <a href={`http://localhost:3000/files/download/${row.filename}`} download target="_blank" rel="noreferrer">
              <Button variant="primary" size="sm">Download</Button>
            </a>
          )}
        />
      </Card>
    </div>
  );
}
