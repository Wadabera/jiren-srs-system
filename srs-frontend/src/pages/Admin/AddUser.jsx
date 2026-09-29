import { useState, useRef } from 'react';
import api from '../../api/axios';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Camera, Loader2, Upload, Image as ImageIcon } from 'lucide-react';

export default function AddUser() {
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    fullname: '', username: '', password: '', email: '',
    phone: '', stream: '', grade: '', class: '',
    subjectCode: '', classes: '', background: '',
    photo: '', banner: ''
  });
  const [uploading, setUploading] = useState(null); // 'photo' or 'banner'
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);

    setUploading(type);
    try {
      const res = await api.post('/files/cloudinary-upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({ ...prev, [type]: res.data.url || res.url }));
      setMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully!`);
    } catch (err) {
      setError(`${type} upload failed.`);
    } finally {
      setUploading(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const basePayload = {
        fullname: formData.fullname,
        username: formData.username,
        password: formData.password,
        email: formData.email,
        phone: formData.phone,
        photo: formData.photo,
        banner: formData.banner,
        role
      };
      
      if (role === 'student') {
        await api.post('/users/students', { ...basePayload, class: formData.class, grade: formData.grade, stream: formData.stream });
      } else if (role === 'teacher') {
        await api.post('/users/teachers', { ...basePayload, subjectCode: formData.subjectCode, classes: formData.classes, background: formData.background, grade: formData.grade, stream: formData.stream });
      } else if (role === 'director') {
        await api.post('/users/directors', basePayload);
      }
      
      setMessage(`${role.charAt(0).toUpperCase() + role.slice(1)} added successfully!`);
      setFormData({ fullname: '', username: '', password: '', email: '', phone: '', stream: '', grade: '', class: '', subjectCode: '', classes: '', background: '', photo: '' });
    } catch (err) {
      setError(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <Card title="Add New User" className="animate-fade-in">
      {message && <div style={{ padding: '15px', background: 'var(--success)', color: 'white', marginBottom: '20px', fontWeight: 'bold', borderRadius: '8px' }}>{message}</div>}
      {error && <div style={{ padding: '15px', background: 'var(--danger)', color: 'white', marginBottom: '20px', fontWeight: 'bold', borderRadius: '8px' }}>{error}</div>}
      
      <div style={{ marginBottom: '30px', display: 'flex', gap: '30px', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          {['student', 'teacher', 'director'].map(r => (
            <label key={r} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem' }}>
              <input type="radio" checked={role === r} onChange={() => setRole(r)} /> {r}
            </label>
          ))}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '20px' }}>
           {/* Photo Upload */}
           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
             <div 
               onClick={() => fileInputRef.current.click()}
               style={{ 
                 width: '50px', height: '50px', borderRadius: '12px', border: '2px dashed var(--gray)', 
                 display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                 overflow: 'hidden', background: '#f8fafc'
               }}
             >
               {uploading === 'photo' ? <Loader2 className="animate-spin" size={16} /> : formData.photo ? <img src={formData.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Camera size={20} color="var(--gray)" />}
             </div>
             <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>PHOTO</span>
             <input type="file" ref={fileInputRef} hidden onChange={(e) => handleFileUpload(e, 'photo')} accept="image/*" />
           </div>

           {/* Banner Upload */}
           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
             <div 
               onClick={() => bannerInputRef.current.click()}
               style={{ 
                 width: '80px', height: '50px', borderRadius: '12px', border: '2px dashed var(--gray)', 
                 display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                 overflow: 'hidden', background: '#f8fafc'
               }}
             >
               {uploading === 'banner' ? <Loader2 className="animate-spin" size={16} /> : formData.banner ? <img src={formData.banner} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ImageIcon size={20} color="var(--gray)" />}
             </div>
             <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>BANNER</span>
             <input type="file" ref={bannerInputRef} hidden onChange={(e) => handleFileUpload(e, 'banner')} accept="image/*" />
           </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <Input label="Full Name" name="fullname" placeholder="John Doe" value={formData.fullname} onChange={handleChange} required />
        <Input label="Username" name="username" placeholder="johndoe123" value={formData.username} onChange={handleChange} required />
        <Input label="Password" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
        <Input label="Email" name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} required />
        
        {role !== 'director' && (
          <>
            <Input label="Phone" name="phone" placeholder="+251 91 123 4567" value={formData.phone} onChange={handleChange} required />
            <Input label="Stream" name="stream" placeholder="Natural Science" value={formData.stream} onChange={handleChange} required />
            <Input label="Grade" name="grade" placeholder="9" value={formData.grade} onChange={handleChange} required />
          </>
        )}

        {role === 'student' && (
          <Input label="Section/Class" name="class" placeholder="A" value={formData.class} onChange={handleChange} required />
        )}
        
        {role === 'teacher' && (
          <>
            <Input label="Subject Code" name="subjectCode" placeholder="BIO-101" value={formData.subjectCode} onChange={handleChange} required />
            <Input label="Classes (Comma separated)" name="classes" placeholder="9A, 9B" value={formData.classes} onChange={handleChange} required />
            <Input label="Background" name="background" placeholder="BSc in Biology" value={formData.background} onChange={handleChange} />
          </>
        )}
        
        <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
          <Button type="submit" variant="primary" size="lg" style={{ width: '100%', padding: '18px' }} disabled={uploading}>
            {uploading ? 'PLEASE WAIT...' : `ADD ${role.toUpperCase()} NOW`}
          </Button>
        </div>
      </form>
    </Card>
  );
}
