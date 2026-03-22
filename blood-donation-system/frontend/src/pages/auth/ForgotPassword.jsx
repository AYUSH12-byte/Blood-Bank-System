import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMsg({ type: 'success', text: res.data.message });
      setEmail('');
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to send reset link.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="logo-icon">🔒</span>
          <h1>Reset Password</h1>
          <p>Enter your email to receive a reset link</p>
        </div>

        {msg.text && <div className={`alert alert-${msg.type === 'success' ? 'success' : 'error'}`}>{msg.text}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="form-control" placeholder="you@example.com" required />
          </div>
          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? <><span className="spinner" /> Sending...</> : 'Send Reset Link'}
          </button>
        </form>

        <div className="auth-footer" style={{ marginTop: '1.5rem' }}>
          Remember your password? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
