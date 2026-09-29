import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('srs_token');
      if (token) {
        try {
          const res = await api.get('/users/me');
          setUser({ ...res.data, role: localStorage.getItem('srs_role') });
        } catch (error) {
          localStorage.removeItem('srs_token');
          localStorage.removeItem('srs_role');
          localStorage.removeItem('srs_refresh_token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const res = await api.post('/auth/login', { username, password });
      localStorage.setItem('srs_token', res.data.access_token);
      localStorage.setItem('srs_refresh_token', res.data.refresh_token);
      localStorage.setItem('srs_role', res.data.user.role);

      // The login response only carries { username, role, fullname }. Fetch the
      // full role profile so pages have the fields they need (studentId, grade,
      // class, teacherId, ...) available on first render instead of only after
      // a page refresh.
      let profile = res.data.user;
      try {
        const me = await api.get('/users/me');
        profile = { ...me.data, ...res.data.user, role: res.data.user.role };
      } catch (e) {
        // Keep the minimal profile if this fails.
      }
      setUser(profile);
      
      if (res.data.user.role === 'student') navigate('/student');
      else if (res.data.user.role === 'teacher') navigate('/teacher');
      else if (res.data.user.role === 'director') navigate('/admin');
      
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('srs_refresh_token');
    if (refreshToken) {
      try {
        await api.post('/auth/logout', { refresh_token: refreshToken });
      } catch (e) {
        // Ignore logout errors
      }
    }
    localStorage.removeItem('srs_token');
    localStorage.removeItem('srs_role');
    localStorage.removeItem('srs_refresh_token');
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);