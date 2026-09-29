import { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import { Camera, Image as ImageIcon, User, Mail, Shield, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminProfile() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [uploading, setUploading] = useState(null);
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
        <input type="file" ref={bannerInputRef} hidden onChange={(e) => handleFileChange(e, 'banner')} accept="image/*" />

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
          <input type="file" ref={fileInputRef} hidden onChange={(e) => handleFileChange(e, 'photo')} accept="image/*" />
        </div>
      </div>

      <div style={{ marginTop: '20px', marginBottom: '40px' }}>
         <h1 style={{ marginBottom: '5px' }}>{profile.fullname}</h1>
         <div className="badge badge-primary" style={{ background: '#000', color: '#fff' }}>System Director</div>
      </div>

      <div className="profile-details-grid">
        <div className="info-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px', fontSize: '1.5rem' }}>
            <Shield size={24} /> Administrative Privileges
          </h3>
          <div className="info-item">
            <span className="info-label">Username</span>
            <span className="info-value">@{profile.username}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Full Name</span>
            <span className="info-value">{profile.fullname}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email</span>
            <span className="info-value">{profile.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Role</span>
            <span className="info-value">Director / Administrator</span>
          </div>
        </div>
        
        <div className="info-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
           <div style={{ padding: '20px', borderRadius: '50%', background: 'var(--primary-glow)', marginBottom: '20px' }}>
              <Shield size={64} color="var(--primary)" />
           </div>
           <h2>System Security</h2>
           <p style={{ color: 'var(--gray)' }}>You have full access to manage students, teachers, and school resources.</p>
        </div>
      </div>
    </div>
  );
}
