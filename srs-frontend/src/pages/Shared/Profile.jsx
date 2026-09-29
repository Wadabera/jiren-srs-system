import { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, Lock, Camera, Image as ImageIcon, Save, CheckCircle, Loader2, Shield, GraduationCap, Award } from 'lucide-react';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(null); // 'photo' or 'banner'
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    password: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/me');
        setProfile(res.data);
        setFormData({
          fullname: res.data.fullname || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          password: ''
        });
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append(type, file);

    setUploading(type);
    try {
      const res = await api.patch('/users/profile/images', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile(res.data);
      console.log('Profile updated successfully:', res.data);
      // Update global auth context
      setUser({ ...user, ...res.data });
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload image. Please check your connection.');
    } finally {
      setUploading(null);
    }
  };

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      const updateData = { ...formData };
      if (!updateData.password) delete updateData.password;
      
      const res = await api.patch('/users/profile', updateData);
      setProfile(res.data);
      setUser({ ...user, ...res.data });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) { console.error(err); alert('Failed to update profile'); }
    setSaving(false);
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <Loader2 className="animate-spin" size={48} color="var(--primary)" />
    </div>
  );

  const RoleIcon = profile?.role === 'director' ? Shield : profile?.role === 'teacher' ? Award : GraduationCap;

  return (
    <div className="profile-container animate-fade-in">
      {/* Banner Section */}
      <div className="profile-banner-container">
        {profile.banner ? (
          <img src={profile.banner} alt="Banner" className="profile-banner-img" />
        ) : (
          <div className="profile-banner-img" style={{ background: 'var(--accent-gradient)' }}></div>
        )}
        <div className="profile-upload-overlay" onClick={() => bannerInputRef.current.click()}>
          {uploading === 'banner' ? <Loader2 className="animate-spin" /> : <ImageIcon size={32} />}
          <span>Change Cover Image</span>
        </div>
        <input type="file" ref={bannerInputRef} hidden accept="image/*" onChange={(e) => handleImageUpload(e, 'banner')} />

        {/* Profile Picture */}
        <div className="profile-pic-container">
          {profile.photo ? (
            <img src={profile.photo} alt="Profile" className="profile-pic-img" />
          ) : (
            <div style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--primary)' }}>
              {profile.fullname?.charAt(0)}
            </div>
          )}
          <div className="profile-upload-overlay" onClick={() => fileInputRef.current.click()}>
            {uploading === 'photo' ? <Loader2 className="animate-spin" /> : <Camera size={32} />}
            <span>Change Photo</span>
          </div>
          <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={(e) => handleImageUpload(e, 'photo')} />
        </div>
      </div>

      <div style={{ marginTop: '20px', marginBottom: '40px' }}>
         <h1 style={{ marginBottom: '5px' }}>{profile.fullname}</h1>
         <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
           <div className="badge badge-primary">
             <RoleIcon size={14} /> {profile.role?.toUpperCase()}
           </div>
           {profile.studentId && <span style={{ fontWeight: 600, color: 'var(--gray)' }}>ID: #{profile.studentId}</span>}
           {profile.teacherId && <span style={{ fontWeight: 600, color: 'var(--gray)' }}>ID: #{profile.teacherId}</span>}
         </div>
      </div>

      <div className="profile-details-grid">
        {/* Info Update Form */}
        <div className="info-card" style={{ gridColumn: 'span 2' }}>
          <h3 style={{ marginBottom: '25px', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <User size={24} /> Account Settings
          </h3>
          <form onSubmit={handleSaveInfo} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '15px', top: '18px', color: 'var(--gray)' }} />
                <input 
                  type="text" className="form-control" style={{ paddingLeft: '45px' }} 
                  value={formData.fullname} onChange={e=>setFormData({...formData, fullname: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '15px', top: '18px', color: 'var(--gray)' }} />
                <input 
                  type="email" className="form-control" style={{ paddingLeft: '45px' }} 
                  value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '15px', top: '18px', color: 'var(--gray)' }} />
                <input 
                  type="text" className="form-control" style={{ paddingLeft: '45px' }} 
                  value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Update Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '15px', top: '18px', color: 'var(--gray)' }} />
                <input 
                  type="password" className="form-control" style={{ paddingLeft: '45px' }} 
                  placeholder="Enter new password"
                  value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '20px', marginTop: '10px' }}>
              {success && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', fontWeight: 800 }}>
                  <CheckCircle size={20} /> Changes Saved!
                </div>
              )}
              <button type="submit" className="btn btn-primary" disabled={saving}>
                <Save size={18} /> {saving ? 'Saving...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>

        {/* Academic / Professional Info Display Only */}
        {(profile.role === 'student' || profile.role === 'teacher') && (
          <div className="info-card" style={{ gridColumn: 'span 2' }}>
            <h3 style={{ marginBottom: '25px', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              {profile.role === 'student' ? <GraduationCap size={24} /> : <Award size={24} />} 
              {profile.role === 'student' ? 'Academic Information' : 'Professional Information'}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div className="info-item">
                <span className="info-label">Grade</span>
                <span className="info-value">{profile.grade}</span>
              </div>
              <div className="info-item">
                <span className="info-label">{profile.role === 'student' ? 'Section' : 'Classes'}</span>
                <span className="info-value">{profile.role === 'student' ? profile.class : profile.classes?.join(', ')}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Stream</span>
                <span className="info-value">{profile.stream}</span>
              </div>
              {profile.subjectCode && (
                <div className="info-item">
                  <span className="info-label">Subject</span>
                  <span className="info-value">{profile.subjectCode}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
