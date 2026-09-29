import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function ViewStudents() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [teacherData, setTeacherData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [sRes, tRes] = await Promise.all([
          api.get('/users/students'),
          api.get('/users/me')
        ]);
        setTeacherData(tRes.data);
        // Filter students by teacher's classes (simple client-side filter for now)
        const myClasses = tRes.data.classes || [];
        const myGrade = tRes.data.grade;
        const filtered = sRes.data.filter(s => s.grade === myGrade && myClasses.includes(s.class));
        setStudents(filtered);
      } catch (err) { console.error(err); }
    };
    loadData();
  }, []);

  return (
    <div className="card animate-fade-in">
      <h2>My Students</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
        Showing students in Grade {teacherData?.grade}, Classes: {teacherData?.classes?.join(', ')}
      </p>
      
      <div className="table-container">
        <table className="table">
          <thead><tr><th>ID</th><th>Name</th><th>Class</th><th>Stream</th><th>Phone</th></tr></thead>
          <tbody>
            {students.length === 0 ? <tr><td colSpan="5" style={{ textAlign: 'center' }}>No students found in your classes.</td></tr> : null}
            {students.map(s => (
              <tr key={s._id}>
                <td>{s.studentId}</td>
                <td>{s.fullname}</td>
                <td>{s.class}</td>
                <td>{s.stream}</td>
                <td>{s.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
