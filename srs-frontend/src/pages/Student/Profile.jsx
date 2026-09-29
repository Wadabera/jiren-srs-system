import { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import { Camera, Image as ImageIcon, User, Mail, Phone, GraduationCap, BookOpen, Layers, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function StudentProfile() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [uploading, setUploading] = useState(null); // 'photo' or 'banner'
  const fileInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/me');
      setProfile(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append(type, file);

    setUploading(type);
    try {
      const res = await api.patch('/users/profile/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile(res.data);
      // Update global auth user if needed
      if (type === 'photo') setUser({ ...user, photo: res.data.photo });
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(null);
    }
  };

  if (!profile) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <Loader2 className="animate-spin" size={48} color="var(--primary)" />
    </div>
  );

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
          <span>Change Cover</span>
        </div>
        <input 
          type="file" 
          ref={bannerInputRef} 
          hidden 
          onChange={(e) => handleFileChange(e, 'banner')} 
          accept="image/*"
        />

        {/* Profile Picture (Bottom Right of Banner) */}
        <div className="profile-pic-container">
          {profile.photo ? (
            <img src={profile.photo} alt="Profile" className="profile-pic-img" />
          ) : (
            <div style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--primary)' }}>
              {profile.fullname.charAt(0)}
            </div>
          )}
          <div className="profile-upload-overlay" onClick={() => fileInputRef.current.click()}>
            {uploading === 'photo' ? <Loader2 className="animate-spin" /> : <Camera size={32} />}
            <span>Upload</span>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            hidden 
            onChange={(e) => handleFileChange(e, 'photo')} 
            accept="image/*"
          />
        </div>
      </div>

      {/* Profile Details */}
      <div style={{ marginTop: '20px', marginBottom: '40px' }}>
         <h1 style={{ marginBottom: '5px' }}>{profile.fullname}</h1>
         <div className="badge badge-primary">Student</div>
      </div>

      <div className="profile-details-grid">
        <div className="info-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px', fontSize: '1.5rem' }}>
            <User size={24} /> Basic Information
          </h3>
          <div className="info-item">
            <span className="info-label">Full Name</span>
            <span className="info-value">{profile.fullname}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Student ID</span>
            <span className="info-value">#{profile.studentId}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email Address</span>
            <span className="info-value">{profile.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Phone Number</span>
            <span className="info-value">{profile.phone || 'Not provided'}</span>
          </div>
        </div>

        <div className="info-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px', fontSize: '1.5rem' }}>
            <GraduationCap size={24} /> Academic Details
          </h3>
          <div className="info-item">
            <span className="info-label">Grade</span>
            <span className="info-value">{profile.grade}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Section / Class</span>
            <span className="info-value">{profile.class}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Stream</span>
            <span className="info-value">{profile.stream}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Current Status</span>
            <span className="badge badge-success">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
