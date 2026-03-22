import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiUser, FiLogOut, FiChevronRight } from 'react-icons/fi';

function Navbar({ user, userRole, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['all'] },
    { path: '/donors', label: 'Donors', icon: '👥', roles: ['admin', 'staff'] },
    { path: '/receivers', label: 'Receivers', icon: '🏥', roles: ['admin', 'staff'] },
    { path: '/blood-stock', label: 'Blood Stock', icon: '🩸', roles: ['admin', 'staff'] },
    { path: '/donations', label: 'Donations', icon: '💉', roles: ['admin', 'staff'] },
    { path: '/donation-requests', label: 'Donation Requests', icon: '📋', roles: ['admin'] },
    { path: '/hospitals', label: 'Hospitals', icon: '🏢', roles: ['admin'] },
  ];

  const filteredItems = navigationItems.filter(item => 
    item.roles.includes('all') || (userRole && item.roles.includes(userRole))
  );

  if (!user) {
    return null; // Don't show navbar when not logged in
  }

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 z-50">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <Link to="/dashboard" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl">🩸</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Blood Bank</h1>
            <p className="text-xs text-gray-500">Management System</p>
          </div>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
            <FiUser className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-500 capitalize">{userRole}</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="p-2 space-y-1">
        <ul className="space-y-2">
          {filteredItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm rounded-lg ${
                  isActive(item.path)
                    ? 'bg-red-50 text-red-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.label}
                {isActive(item.path) ? (
                  <FiChevronRight className="ml-auto h-4 w-4" />
                ) : (
                  <FiChevronRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100" />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
        >
          <FiLogOut className="mr-2 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;