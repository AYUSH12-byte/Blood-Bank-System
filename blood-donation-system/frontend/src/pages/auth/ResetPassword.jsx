import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });

    if (form.password !== form.confirmPassword) {
      return setMsg({ type: 'error', text: 'Passwords do not match.' });
    }
    if (form.password.length < 8) {
      return setMsg({ type: 'error', text: 'Password must be at least 8 characters.' });
    }

    setLoading(true);
    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password: form.password });
      setSuccess(true);
      setMsg({ type: 'success', text: res.data.message });
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to reset password. The link may have expired.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="logo-icon">🔑</span>
          <h1>Set New Password</h1>
          <p>Please enter your new password below</p>
        </div>

        {msg.text && <div className={`alert alert-${msg.type === 'success' ? 'success' : 'error'}`}>{msg.text}</div>}

        {!success && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                className="form-control" placeholder="Min. 8 characters" required />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                className="form-control" placeholder="Repeat new password" required />
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? <><span className="spinner" /> Resetting...</> : 'Reset Password'}
            </button>
          </form>
        )}

        <div className="auth-footer" style={{ marginTop: '1.5rem' }}>
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
