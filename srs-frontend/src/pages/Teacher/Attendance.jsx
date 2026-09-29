import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function Attendance() {
  const { user } = useAuth();
  const [teacherData, setTeacherData] = useState(null);
  const [allStudents, setAllStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const tRes = await api.get('/users/me');
        setTeacherData(tRes.data);
        
        const myClasses = tRes.data.classes || [];
        if (myClasses.length > 0 && !selectedClass) setSelectedClass(myClasses[0]);

        const myGrade = tRes.data.grade;
        const sRes = await api.get('/users/students');
        const myStudents = sRes.data.filter(s => s.grade === myGrade && myClasses.includes(s.class));
        setAllStudents(myStudents);

        // Fetch existing attendance for selected date
        if (tRes.data.teacherId) {
          fetchAttendance(tRes.data.teacherId, date);
        }
      } catch (err) { console.error(err); }
    };
    loadData();
  }, [date, selectedClass]);

  useEffect(() => {
    setFilteredStudents(allStudents.filter(s => s.class === selectedClass));
  }, [selectedClass, allStudents]);

  const fetchAttendance = async (teacherId, selectedDate) => {
    try {
      const res = await api.get(`/attendance/teacher/${teacherId}?date=${selectedDate}`);
      const map = {};
      res.data.forEach(r => map[r.studentId] = r.status);
      setAttendance(map);
    } catch (err) { console.error(err); }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const saveAttendance = async () => {
    try {
      const records = filteredStudents.map(s => ({
        studentId: s.studentId,
        teacherId: teacherData.teacherId,
        subjectCode: teacherData.subjectCode,
        date,
        status: attendance[s.studentId] || 'Present'
      }));
      
      await api.post('/attendance/batch', records);
      setMessage('Attendance saved for Class ' + selectedClass);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error saving attendance');
    }
  };

  return (
    <div className="card animate-fade-in">
      <h2 style={{ marginBottom: '30px' }}>Attendance Registry</h2>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', marginBottom: '40px', padding: '20px', background: 'var(--light)', borderRadius: '15px', border: '2px solid black', alignItems: 'flex-end' }}>
        <div>
          <label className="form-label" style={{ fontWeight: 800 }}>DATE</label>
          <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: '200px', border: '2px solid black' }} />
        </div>
        
        <div>
          <label className="form-label" style={{ fontWeight: 800 }}>SELECT CLASS</label>
          <select 
            className="form-control" 
            style={{ width: '150px', fontWeight: 700, border: '2px solid black' }}
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            {teacherData?.classes?.map(c => <option key={c} value={c}>CLASS {c}</option>)}
          </select>
        </div>

        <button className="btn btn-primary" onClick={saveAttendance} style={{ height: '48px', padding: '0 30px' }}>Save Attendance</button>
        
        {message && (
          <div style={{ 
            marginLeft: 'auto', padding: '12px 25px', background: message.includes('Error') ? 'var(--danger)' : 'var(--success)', 
            color: 'white', borderRadius: '10px', fontWeight: 800, boxShadow: '4px 4px 0px black' 
          }}>
            {message}
          </div>
        )}
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Current Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr><td colSpan="3" style={{ textAlign: 'center', padding: '3rem' }}>No students found in Class {selectedClass}.</td></tr>
            ) : filteredStudents.map(s => {
              const status = attendance[s.studentId] || 'Present';
              return (
                <tr key={s._id}>
                  <td><strong>{s.studentId}</strong></td>
                  <td>{s.fullname}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '15px' }}>
                      {[
                        { id: 'Present', label: 'PRESENT', color: 'var(--success)' },
                        { id: 'Absent', label: 'ABSENT', color: 'var(--danger)' },
                        { id: 'Late', label: 'LATE', color: 'var(--warning)' }
                      ].map(opt => (
                        <label key={opt.id} style={{ 
                          display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', 
                          padding: '8px 15px', borderRadius: '8px', border: '2px solid black',
                          background: status === opt.id ? opt.color : 'white',
                          color: status === opt.id ? 'white' : 'black',
                          fontWeight: 700, fontSize: '0.8rem', transition: '0.2s'
                        }}>
                          <input 
                            type="radio" name={`att-${s.studentId}`} 
                            checked={status === opt.id} 
                            onChange={() => handleStatusChange(s.studentId, opt.id)} 
                            style={{ display: 'none' }}
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
