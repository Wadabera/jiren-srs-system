import axios from 'axios';

/**
 * The API base URL comes from VITE_API_URL.
 *
 * In production (Vercel) this must be set to the Render backend, e.g.
 *   VITE_API_URL=https://srs-backend.onrender.com/api
 * Locally it falls back to the backend running on port 5000.
 */
const baseURL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('srs_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * On a 401 the access token may simply have expired. If a refresh token is
 * stored, try to renew once and replay the original request instead of
 * bouncing the user to the login screen mid-demo.
 */
let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401 || original?._retried) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem('srs_refresh_token');
    if (!refreshToken) {
      return Promise.reject(error);
    }

    original._retried = true;

    try {
      // Share a single refresh across concurrent 401s.
      if (!refreshPromise) {
        refreshPromise = axios
          .post(`${baseURL}/auth/refresh`, { refresh_token: refreshToken })
          .then((r) => r.data.access_token)
          .finally(() => {
            refreshPromise = null;
          });
      }

      const accessToken = await refreshPromise;
      localStorage.setItem('srs_token', accessToken);
      original.headers.Authorization = `Bearer ${accessToken}`;
      return api(original);
    } catch (refreshError) {
      localStorage.removeItem('srs_token');
      localStorage.removeItem('srs_role');
      localStorage.removeItem('srs_refresh_token');
      return Promise.reject(refreshError);
    }
  },
);

export default api;
