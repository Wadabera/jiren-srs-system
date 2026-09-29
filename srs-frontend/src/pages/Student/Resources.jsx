import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Table from '../../components/Table';

// Same source as the axios client, minus the trailing /api, so download links
// point at the deployed backend instead of localhost.
const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');

export default function StudentResources() {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const pRes = await api.get('/users/me');
        if (pRes.data.grade) {
          const res = await api.get(`/files?grade=${pRes.data.grade}`);
          setFiles(res.data);
        }
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchResources();
  }, []);

  const columns = [
    { label: 'Title', field: 'title' },
    { label: 'Subject', field: 'subjectCode' },
    { label: 'Date Uploaded', field: 'dateUploaded' }
  ];

  const formattedFiles = files.map(f => ({
    ...f,
    dateUploaded: new Date(f.createdAt).toLocaleDateString()
  }));

  if (loading) return <div>Loading resources...</div>;

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '30px' }}>Class Resources & Assignments</h2>
      <Card>
        {files.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No resources available for your grade yet.</p>
        ) : (
          <Table 
            columns={columns}
            data={formattedFiles}
            keyField="_id"
            actions={(row) => (
              // Built from the same env var as the API client, and includes
              // the /api global prefix the backend sets.
              <a
                href={`${API_ORIGIN}/files/download/${encodeURIComponent(row.filename)}`}
                download
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="primary" size="sm">Download</Button>
              </a>
            )}
          />
        )}
      </Card>
    </div>
  );
}
