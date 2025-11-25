import { useState, useEffect } from 'react'

function Dashboard({ userRole }) {
  const [stats, setStats] = useState({
    totalDonors: 0,
    totalReceivers: 0,
    bloodStock: 0,
    pendingRequests: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [bloodInventory, setBloodInventory] = useState([
    { type: 'A+', units: 0, percentage: 0 },
    { type: 'A-', units: 0, percentage: 0 },
    { type: 'B+', units: 0, percentage: 0 },
    { type: 'B-', units: 0, percentage: 0 },
    { type: 'AB+', units: 0, percentage: 0 },
    { type: 'AB-', units: 0, percentage: 0 },
    { type: 'O+', units: 0, percentage: 0 },
    { type: 'O-', units: 0, percentage: 0 }
  ]);

  useEffect(() => {
    // Load donors data
    const donors = JSON.parse(localStorage.getItem('bloodDonationDonors') || '[]');
    
    // Load receivers data
    const receivers = JSON.parse(localStorage.getItem('bloodDonationReceivers') || '[]');
    
    // Load donation requests
    const requests = JSON.parse(localStorage.getItem('donationRequests') || '[]');
    
    // Load hospitals with blood bank data
    const hospitals = JSON.parse(localStorage.getItem('hospitals') || '[]');

    // Calculate total blood units across all blood banks
    let totalBloodUnits = 0;
    const bloodTypeMap = new Map();
    
    // Initialize blood type map with zeros
    bloodInventory.forEach(type => {
      bloodTypeMap.set(type.type, 0);
    });
    
    // Sum up blood units from all hospitals' blood banks
    hospitals.forEach(hospital => {
      if (hospital.bloodBank && hospital.bloodInventory) {
        Object.entries(hospital.bloodInventory).forEach(([type, units]) => {
          const current = bloodTypeMap.get(type) || 0;
          bloodTypeMap.set(type, current + (parseInt(units) || 0));
          totalBloodUnits += parseInt(units) || 0;
        });
      }
    });
    
    // Update blood inventory with real data
    const updatedBloodInventory = bloodInventory.map(item => {
      const units = bloodTypeMap.get(item.type) || 0;
      // Calculate percentage based on a maximum threshold (e.g., 100 units = 100%)
      const percentage = Math.min(Math.round((units / 100) * 100), 100);
      return { ...item, units, percentage };
    });
    
    // Get recent activities (combine recent donations and requests)
    const recentDonations = donors
      .slice(0, 5)
      .map(donor => ({
        id: `donor-${donor.id}`,
        type: 'donation',
        donor: donor.name,
        bloodType: donor.bloodType,
        date: new Date().toISOString().split('T')[0],
        status: 'completed'
      }));
      
    const recentRequests = requests
      .slice(0, 5)
      .map(request => ({
        id: `request-${request.id}`,
        type: 'request',
        hospital: request.hospitalName || 'Hospital',
        bloodType: request.bloodType,
        units: request.units,
        date: request.requiredDate || new Date().toISOString().split('T')[0],
        status: request.status?.toLowerCase() || 'pending'
      }));
    
    // Combine and sort by date (newest first)
    const allActivities = [...recentDonations, ...recentRequests]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
    
    // Update stats and blood inventory
    setStats({
      totalDonors: donors.length,
      totalReceivers: receivers.length,
      bloodStock: totalBloodUnits,
      pendingRequests: requests.filter(req => req.status?.toLowerCase() === 'pending').length
    });
    
    // Update blood inventory and recent activities
    setBloodInventory(updatedBloodInventory);
    setRecentActivities(allActivities);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Donors</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalDonors.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-2">+12% from last month</p>
              </div>
              <div className="bg-blue-100 rounded-lg p-3">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Receivers</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalReceivers.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-2">+8% from last month</p>
              </div>
              <div className="bg-green-100 rounded-lg p-3">
                <span className="text-2xl">🏥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Blood Stock</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.bloodStock} units</p>
                <p className="text-sm text-yellow-600 mt-2">Low on O- type</p>
              </div>
              <div className="bg-red-100 rounded-lg p-3">
                <span className="text-2xl">🩸</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.pendingRequests}</p>
                <p className="text-sm text-orange-600 mt-2">Needs attention</p>
              </div>
              <div className="bg-orange-100 rounded-lg p-3">
                <span className="text-2xl">⏰</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Blood Inventory Chart */}
          <div className="lg:col-span-2 bg-linear-to-br from-white to-red-50 rounded-xl shadow-lg border border-red-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Blood Inventory</h2>
                <p className="text-sm text-gray-600 mt-1">Real-time stock levels</p>
              </div>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all transform hover:scale-105 shadow-md">
                View All
              </button>
            </div>
            
            {/* Grid Layout for Blood Types */}
            <div className="grid grid-cols-4 gap-6">
              {bloodInventory.map((blood) => (
                <div key={blood.type} className="text-center group">
                  {/* Blood Type Circle with Hover Effect */}
                  <div className="relative mb-3 transform transition-all duration-300 group-hover:scale-110">
                    {/* Glow Effect - Only for low stock */}
                    {blood.percentage <= 30 && (
                      <div className="absolute inset-0 rounded-full bg-red-500 blur-md opacity-30 animate-pulse"></div>
                    )}
                    
                    {/* Main Circle */}
                    <div 
                      className={`relative w-20 h-20 rounded-full mx-auto flex items-center justify-center text-white font-bold text-xl shadow-lg transition-all duration-300 ${
                        blood.percentage > 60 ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' : 
                        blood.percentage > 30 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700' : 
                        'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                      }`}
                    >
                      {blood.type}
                      {/* Pulse Animation for Low Stock */}
                      {blood.percentage <= 30 && (
                        <div className="absolute inset-0 rounded-full animate-ping bg-red-500 opacity-75"></div>
                      )}
                    </div>
                  </div>
                  
                  {/* Units Display with Enhanced Styling */}
                  <div className="space-y-2">
                    <div className="bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-100">
                      <p className={`text-2xl font-bold ${
                        blood.percentage > 60 ? 'text-blue-600' : 
                        blood.percentage > 30 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {blood.units}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">units</p>
                    </div>
                    
                    {/* Enhanced Progress Bar */}
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            blood.percentage > 60 ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 
                            blood.percentage > 30 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 'bg-gradient-to-r from-red-500 to-red-600'
                          }`}
                          style={{ width: `${blood.percentage}%` }}
                        ></div>
                      </div>
                      <p className={`text-xs font-bold mt-1 ${
                        blood.percentage > 60 ? 'text-green-600' : 
                        blood.percentage > 30 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {blood.percentage}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Enhanced Legend */}
            <div className="flex justify-center space-x-8 text-sm mt-8 bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-sm"></div>
                <span className="text-gray-700 font-medium">Good Stock</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full shadow-sm"></div>
                <span className="text-gray-700 font-medium">Medium Stock</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-linear-to-r from-red-500 to-red-600 rounded-full shadow-sm animate-pulse"></div>
                <span className="text-gray-700 font-medium">Low Stock</span>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
              <button className="text-sm text-red-600 hover:text-red-500">View All</button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`rounded-full p-2 ${
                    activity.type === 'donation' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    <span className="text-sm">
                      {activity.type === 'donation' ? '🩸' : '🏥'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      {activity.type === 'donation' ? 
                        `${activity.donor} donated ${activity.bloodType}` : 
                        `${activity.hospital} requested ${activity.units} units of ${activity.bloodType}`
                      }
                    </p>
                    <p className="text-xs text-gray-500">{activity.date}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                    activity.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
              <span className="text-2xl mb-2 block">➕</span>
              <span className="text-sm text-gray-600">Add Donor</span>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
              <span className="text-2xl mb-2 block">📋</span>
              <span className="text-sm text-gray-600">New Request</span>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
              <span className="text-2xl mb-2 block">📊</span>
              <span className="text-sm text-gray-600">Generate Report</span>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
              <span className="text-2xl mb-2 block">⚙️</span>
              <span className="text-sm text-gray-600">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
