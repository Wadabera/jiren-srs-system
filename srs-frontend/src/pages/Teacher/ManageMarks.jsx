import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function ManageMarks() {
  const { user } = useAuth();
  const [teacherData, setTeacherData] = useState(null);
  const [allStudents, setAllStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [schema, setSchema] = useState(null);
  const [marks, setMarks] = useState({});
  const [newSchemaCols, setNewSchemaCols] = useState([{ label: '', max: 100 }]);

  useEffect(() => {
    const load = async () => {
      try {
        const tRes = await api.get('/users/me');
        setTeacherData(tRes.data);
        
        const myClasses = tRes.data.classes || [];
        if (myClasses.length > 0) setSelectedClass(myClasses[0]);

        const myGrade = tRes.data.grade;
        const sRes = await api.get('/users/students');
        const relevantStudents = sRes.data.filter(s => s.grade === myGrade && myClasses.includes(s.class));
        setAllStudents(relevantStudents);

        // Load Schema
        try {
          const scRes = await api.get(`/marks/schema/${tRes.data.teacherId}`);
          setSchema(scRes.data);
        } catch (e) { /* No schema yet */ }

        // Load Marks
        const mRes = await api.get(`/marks/teacher/${tRes.data.teacherId}`);
        const marksMap = {};
        mRes.data.forEach(m => marksMap[m.studentId] = m.scores);
        setMarks(marksMap);
      } catch (err) { console.error(err); }
    };
    load();
  }, []);

  useEffect(() => {
    setFilteredStudents(allStudents.filter(s => s.class === selectedClass));
  }, [selectedClass, allStudents]);

  const createSchema = async () => {
    try {
      const res = await api.post('/marks/schema', {
        teacherId: teacherData.teacherId,
        columns: newSchemaCols
      });
      setSchema(res.data);
      alert('Mark schema saved! Previous marks for this subject were cleared.');
      setMarks({});
    } catch (err) { alert('Error creating schema'); }
  };

  const saveMarks = async (studentId) => {
    try {
      await api.post('/marks', {
        studentId,
        teacherId: teacherData.teacherId,
        subjectCode: teacherData.subjectCode,
        scores: marks[studentId] || Array(schema.columns.length).fill(0)
      });
      alert('Saved Successfully!');
    } catch (err) { alert('Error saving marks'); }
  };

  const handleMarkChange = (studentId, index, value) => {
    const current = marks[studentId] || Array(schema?.columns.length || 0).fill(0);
    const updated = [...current];
    updated[index] = Number(value);
    setMarks({ ...marks, [studentId]: updated });
  };

  if (!schema) {
    return (
      <Card title="Define Mark Columns" className="animate-fade-in" style={{ maxWidth: '600px' }}>
        <p style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>Define your evaluation columns (e.g. Test 1, Midterm, Final) before entering marks.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {newSchemaCols.map((col, i) => (
            <div key={i} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
              <Input 
                placeholder="Label (e.g. Midterm)" 
                value={col.label} 
                onChange={e => {
                  const updated = [...newSchemaCols]; updated[i].label = e.target.value; setNewSchemaCols(updated);
                }} 
                style={{ flex: 1 }}
              />
              <Input 
                type="number" 
                placeholder="Max" 
                value={col.max} 
                onChange={e => {
                  const updated = [...newSchemaCols]; updated[i].max = Number(e.target.value); setNewSchemaCols(updated);
                }} 
                style={{ width: '100px' }}
              />
            </div>
          ))}
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <Button variant="secondary" onClick={() => setNewSchemaCols([...newSchemaCols, { label: '', max: 100 }])}>+ Add Column</Button>
            <Button variant="primary" onClick={createSchema}>Initialize Marksheet</Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Manage Marks" className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', background: 'var(--light)', padding: '20px', borderRadius: '15px', border: '2px solid black' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <label style={{ fontWeight: 800 }}>SELECT CLASS:</label>
          <select 
            className="form-control" 
            style={{ width: '150px', fontWeight: 700 }}
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            {teacherData?.classes?.map(c => <option key={c} value={c}>CLASS {c}</option>)}
          </select>
        </div>
        <Button variant="danger" size="sm" onClick={() => { if(window.confirm('Resetting will clear all existing marks for this subject. Continue?')) setSchema(null) }}>Reset Schema</Button>
      </div>
      
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              {schema.columns.map((c, i) => <th key={i}>{c.label} (/{c.max})</th>)}
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr><td colSpan={schema.columns.length + 4} style={{textAlign: 'center', padding: '2rem'}}>No students found in Class {selectedClass}.</td></tr>
            ) : filteredStudents.map(s => {
              const studentScores = marks[s.studentId] || Array(schema.columns.length).fill(0);
              const total = studentScores.reduce((a,b)=>a+b,0);
              return (
                <tr key={s._id}>
                  <td>{s.studentId}</td>
                  <td>{s.fullname}</td>
                  {schema.columns.map((c, i) => (
                    <td key={i}>
                      <input 
                        type="number" 
                        className="form-control" 
                        style={{ width: '80px', padding: '8px', border: '2px solid black' }} 
                        value={studentScores[i]} 
                        onChange={e => handleMarkChange(s.studentId, i, e.target.value)} 
                        max={c.max}
                        min={0}
                      />
                    </td>
                  ))}
                  <td style={{ fontSize: '1.2rem' }}><strong>{total}</strong></td>
                  <td><Button variant="primary" size="sm" onClick={() => saveMarks(s.studentId)}>Save</Button></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
