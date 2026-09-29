import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Card';

export default function AcademicResult() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const pRes = await api.get('/users/me');
        setProfile(pRes.data);
        const mRes = await api.get(`/marks/student/${pRes.data.studentId}`);
        setResults(mRes.data);
      } catch (err) { console.error(err); }
    };
    loadData();
  }, []);

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '30px' }}>My Academic Results</h2>
      
      {results.length === 0 ? (
        <Card><p style={{ color: 'var(--text-muted)' }}>No marks have been recorded for you yet.</p></Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {results.map((r, idx) => (
            <Card key={idx} title={`Subject Code: ${r.mark.subjectCode}`}>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      {r.schema.map((c, i) => <th key={i}>{c.label} (/{c.max})</th>)}
                      <th>Total Score</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {r.schema.map((c, i) => <td key={i}>{r.mark.scores[i] !== undefined ? r.mark.scores[i] : '-'}</td>)}
                      <td><strong>{r.mark.total}</strong></td>
                      <td>
                        {r.mark.total >= 50 ? <span className="badge badge-success">PASS</span> : <span className="badge badge-danger">FAIL</span>}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
