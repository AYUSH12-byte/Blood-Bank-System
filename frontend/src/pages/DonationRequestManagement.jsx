// src/pages/DonationRequestManagement.jsx
import React, { useState, useEffect } from 'react';
import { 
  FiDroplet, FiPlus, FiEdit2, FiTrash2, FiFilter, 
  FiSearch, FiCalendar, FiUser, FiPhone, FiMail, FiSave, FiX 
} from 'react-icons/fi';

const DonationRequestManagement = () => {
  // State for requests and filtering
  const [requests, setRequests] = useState(() => {
    const savedRequests = localStorage.getItem('donationRequests');
    return savedRequests ? JSON.parse(savedRequests) : [];
  });

  const [filters, setFilters] = useState({
    status: 'All',
    bloodType: 'All',
    search: ''
  });

  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    bloodType: 'A+',
    units: 1,
    hospital: '',
    contact: '',
    email: '',
    requiredDate: '',
    status: 'Pending'
  });

  // Save to localStorage whenever requests change
  useEffect(() => {
    localStorage.setItem('donationRequests', JSON.stringify(requests));
  }, [requests]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      const updatedRequests = requests.map(req => 
        req.id === editingId ? { ...formData, id: editingId } : req
      );
      setRequests(updatedRequests);
      setEditingId(null);
    } else {
      const newId = requests.length > 0 ? Math.max(...requests.map(r => r.id)) + 1 : 1;
      const newRequest = { 
        ...formData, 
        id: newId, 
        dateRequested: new Date().toISOString() 
      };
      setRequests([newRequest, ...requests]);
      setIsAdding(false);
    }
    resetForm();
  };

  const handleEdit = (request) => {
    setFormData(request);
    setEditingId(request.id);
    setIsAdding(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      setRequests(requests.filter(req => req.id !== id));
    }
  };

  const updateStatus = (id, newStatus) => {
    // First, update the request status
    const updatedRequests = requests.map(req => 
      req.id === id ? { ...req, status: newStatus } : req
    );
    
    // If status is being changed to 'Completed', update blood inventory
    if (newStatus === 'Completed') {
      const request = requests.find(req => req.id === id);
      if (request) {
        // Get all hospitals with blood banks
        const hospitals = JSON.parse(localStorage.getItem('hospitals') || '[]');
        const updatedHospitals = hospitals.map(hospital => {
          // Find the hospital that matches the request's hospital
          if (hospital.name === request.hospital && hospital.bloodBank) {
            const updatedInventory = { ...hospital.bloodInventory };
            // Add the donated units to the matching blood type
            const currentUnits = updatedInventory[request.bloodType] || 0;
            updatedInventory[request.bloodType] = currentUnits + parseInt(request.units || 1);
            
            return {
              ...hospital,
              bloodInventory: updatedInventory
            };
          }
          return hospital;
        });
        
        // Save updated hospitals back to localStorage
        localStorage.setItem('hospitals', JSON.stringify(updatedHospitals));
      }
    }
    
    setRequests(updatedRequests);
  };

  const resetForm = () => {
    setFormData({
      patientName: '',
      bloodType: 'A+',
      units: 1,
      hospital: '',
      contact: '',
      email: '',
      requiredDate: '',
      status: 'Pending'
    });
    setEditingId(null);
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.patientName.toLowerCase().includes(filters.search.toLowerCase()) ||
                         request.hospital.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = filters.status === 'All' || request.status === filters.status;
    const matchesBloodType = filters.bloodType === 'All' || request.bloodType === filters.bloodType;
    
    return matchesSearch && matchesStatus && matchesBloodType;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Donation Request Management</h1>
          <p className="text-gray-600">Manage and track blood donation requests</p>
        </div>
        <button
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            resetForm();
          }}
          className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          <FiPlus className="mr-2" /> New Request
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name or hospital..."
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              value={filters.bloodType}
              onChange={(e) => setFilters({...filters, bloodType: e.target.value})}
            >
              <option value="All">All Types</option>
              {bloodTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ status: 'All', bloodType: 'All', search: '' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Request Form Modal */}
      {(isAdding || editingId) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-lg font-semibold">
                {editingId ? 'Edit Donation Request' : 'New Donation Request'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="patientName"
                      value={formData.patientName}
                      onChange={handleInputChange}
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiDroplet className="h-4 w-4 text-red-400" />
                    </div>
                    <select
                      name="bloodType"
                      value={formData.bloodType}
                      onChange={handleInputChange}
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                      required
                    >
                      {bloodTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Units Required *</label>
                  <input
                    type="number"
                    name="units"
                    min="1"
                    value={formData.units}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hospital *</label>
                  <input
                    type="text"
                    name="hospital"
                    value={formData.hospital}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPhone className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Required Date *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCalendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="requiredDate"
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.requiredDate}
                      onChange={handleInputChange}
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                      required
                    />
                  </div>
                </div>

                {editingId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                      required
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  {editingId ? 'Update Request' : 'Create Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Requests Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 bg-gray-50">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Donation Requests</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage and track all blood donation requests</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blood Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hospital
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Required Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="shrink-0 h-10 w-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                          <FiUser className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{request.patientName}</div>
                          <div className="text-xs text-gray-500">{request.contact}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiDroplet className="h-5 w-5 text-red-500 mr-2" />
                        <span className="text-sm text-gray-900">{request.bloodType}</span>
                        <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                          {request.units} {request.units === 1 ? 'unit' : 'units'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.hospital}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.requiredDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(request)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <FiEdit2 className="h-5 w-5" />
                        </button>
                        <div className="relative inline-block text-left">
                          <div>
                            <button
                              type="button"
                              className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-2 py-1 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                              id="status-menu"
                              aria-haspopup="true"
                              onClick={(e) => {
                                e.stopPropagation();
                                const menu = e.target.closest('div').parentNode.querySelector('.status-menu');
                                menu.classList.toggle('hidden');
                              }}
                            >
                              {request.status}
                              <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>

                          <div className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden status-menu z-10">
                            <div className="py-1" role="menu" aria-orientation="vertical">
                              <button
                                onClick={() => {
                                  updateStatus(request.id, 'Pending');
                                  document.querySelector('.status-menu').classList.add('hidden');
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-yellow-700 hover:bg-yellow-100"
                                role="menuitem"
                              >
                                Pending
                              </button>
                              <button
                                onClick={() => {
                                  updateStatus(request.id, 'Approved');
                                  document.querySelector('.status-menu').classList.add('hidden');
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-100"
                                role="menuitem"
                              >
                                Approved
                              </button>
                              <button
                                onClick={() => {
                                  updateStatus(request.id, 'Rejected');
                                  document.querySelector('.status-menu').classList.add('hidden');
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-100"
                                role="menuitem"
                              >
                                Rejected
                              </button>
                              <button
                                onClick={() => {
                                  updateStatus(request.id, 'Completed');
                                  document.querySelector('.status-menu').classList.add('hidden');
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-blue-100"
                                role="menuitem"
                              >
                                Completed
                              </button>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(request.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <FiFilter className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No requests found</h3>
                    <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DonationRequestManagement;