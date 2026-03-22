import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const dashPath = user ? `/${user.role}` : '/login';

  const roleColor = { admin: '#7c3aed', donor: '#c53030', receiver: '#2b6cb0' };
  const roleLabel = { admin: '🛡️ Admin', donor: '🩸 Donor', receiver: '💉 Receiver' };

  return (
    <nav style={{
      background: 'linear-gradient(90deg, #742a2a 0%, #c53030 100%)',
      boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <Link to={dashPath} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: 'white' }}>
          <span style={{ fontSize: '1.5rem' }}>🩸</span>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>BloodLife</span>
        </Link>

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: '99px',
              fontSize: '0.8rem',
              fontWeight: 600,
            }}>
              {roleLabel[user.role]}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem', display: 'none', fontWeight: 500 }}
              className="nav-username">{user.name}</span>
            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                padding: '0.4rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 600,
                fontFamily: 'inherit',
                transition: 'all 0.2s',
              }}
              onMouseOver={e => e.target.style.background = 'rgba(255,255,255,0.25)'}
              onMouseOut={e => e.target.style.background = 'rgba(255,255,255,0.15)'}
            >
              Logout
            </button>
          </div>
        )}

        {!user && (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/login" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem', fontWeight: 600 }}>Login</Link>
            <Link to="/register" style={{
              background: 'white', color: '#c53030',
              padding: '0.35rem 1rem', borderRadius: '8px',
              fontSize: '0.875rem', fontWeight: 700,
            }}>Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
