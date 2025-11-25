import React, { useState, useEffect } from 'react';
import {
  FiMapPin, FiPhone, FiMail, FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter, FiSave, FiX
} from 'react-icons/fi';

const HospitalManagement = () => {
  // State for hospitals and filtering
  const [hospitals, setHospitals] = useState(() => {
    const savedHospitals = localStorage.getItem('hospitals');
    return savedHospitals ? JSON.parse(savedHospitals) : [];
  });

  const [filters, setFilters] = useState({
    type: 'All',
    search: ''
  });

  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Hospital',
    address: '',
    city: '',
    contact: '',
    email: '',
    bloodBank: false,
    bloodInventory: {}
  });

  // Initialize blood inventory for new blood banks
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const initialBloodInventory = bloodTypes.reduce((acc, type) => {
    acc[type] = 0;
    return acc;
  }, {});

  // Initialize with default hospitals if none exist
  useEffect(() => {
    const savedHospitals = localStorage.getItem('hospitals');
    if (!savedHospitals || JSON.parse(savedHospitals).length === 0) {
      const defaultHospitals = [
        {
          id: 1,
          name: 'BNC Hospital',
          type: 'Hospital',
          address: '123 Main Street',
          city: 'Kathmandu',
          contact: '01-1234567',
          email: 'info@bnchospital.com',
          bloodBank: true,
          bloodInventory: {
            'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0,
            'AB+': 0, 'AB-': 0, 'O+': 0, 'O-': 0
          }
        },
        {
          id: 2,
          name: 'Red Blood Bank',
          type: 'Blood Bank',
          address: '456 Blood Drive',
          city: 'Lalitpur',
          contact: '01-9876543',
          email: 'donate@redbloodbank.org',
          bloodBank: true,
          bloodInventory: {
            'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0,
            'AB+': 0, 'AB-': 0, 'O+': 0, 'O-': 0
          }
        }
      ];
      setHospitals(defaultHospitals);
      localStorage.setItem('hospitals', JSON.stringify(defaultHospitals));
    } else if (savedHospitals) {
      setHospitals(JSON.parse(savedHospitals));
    }
  }, []);

  // Save to localStorage whenever hospitals change
  useEffect(() => {
    if (hospitals.length > 0) {
      localStorage.setItem('hospitals', JSON.stringify(hospitals));
    }
  }, [hospitals]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // If blood bank is checked, initialize blood inventory if not exists
    if (name === 'bloodBank' && checked && !formData.bloodInventory) {
      setFormData(prev => ({
        ...prev,
        bloodInventory: { ...initialBloodInventory }
      }));
    }
  };

  const handleBloodInventoryChange = (bloodType, value) => {
    setFormData(prev => ({
      ...prev,
      bloodInventory: {
        ...prev.bloodInventory,
        [bloodType]: parseInt(value) || 0
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      const updatedHospitals = hospitals.map(hospital =>
        hospital.id === editingId ? { 
          ...formData, 
          id: editingId,
          bloodBank: formData.bloodBank || false,
          bloodInventory: formData.bloodBank ? (formData.bloodInventory || initialBloodInventory) : {}
        } : hospital
      );
      setHospitals(updatedHospitals);
      setEditingId(null);
    } else {
      const newId = hospitals.length > 0 ? Math.max(...hospitals.map(h => h.id)) + 1 : 1;
      const newHospital = {
        ...formData,
        id: newId,
        bloodBank: formData.bloodBank || false,
        bloodInventory: formData.bloodBank ? (formData.bloodInventory || initialBloodInventory) : {}
      };
      setHospitals([newHospital, ...hospitals]);
    }
    resetForm();
    setIsAdding(false);
  };

  const handleEdit = (hospital) => {
    setFormData({
      ...hospital,
      bloodBank: hospital.bloodBank || false,
      bloodInventory: hospital.bloodBank ? (hospital.bloodInventory || initialBloodInventory) : {}
    });
    setEditingId(hospital.id);
    setIsAdding(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this hospital?')) {
      setHospitals(hospitals.filter(hospital => hospital.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'Hospital',
      address: '',
      city: '',
      contact: '',
      email: '',
      bloodBank: false,
      bloodInventory: { ...initialBloodInventory }
    });
    setEditingId(null);
  };

  const filteredHospitals = hospitals.filter(hospital => {
    const matchesSearch = hospital.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                        hospital.city.toLowerCase().includes(filters.search.toLowerCase());
    const matchesType = filters.type === 'All' || hospital.type === filters.type;
    
    return matchesSearch && matchesType;
  });

  const getHospitalTypeColor = (type) => {
    switch (type) {
      case 'Hospital': return 'bg-blue-100 text-blue-800';
      case 'Blood Bank': return 'bg-red-100 text-red-800';
      case 'Clinic': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Hospital & Blood Bank Management</h1>
          <p className="text-gray-600">Manage hospitals and blood bank information</p>
        </div>
        <button
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            resetForm();
          }}
          className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          <FiPlus className="mr-2" /> Add New
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name or city..."
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
            >
              <option value="All">All Types</option>
              <option value="Hospital">Hospital</option>
              <option value="Blood Bank">Blood Bank</option>
              <option value="Clinic">Clinic</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              {editingId ? 'Edit Hospital' : 'Add New Hospital'}
            </h2>
            <button
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
                resetForm();
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  required
                >
                  <option value="Hospital">Hospital</option>
                  <option value="Blood Bank">Blood Bank</option>
                  <option value="Clinic">Clinic</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="bloodBank"
                  name="bloodBank"
                  checked={formData.bloodBank || false}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="bloodBank" className="ml-2 block text-sm text-gray-700">
                  Has Blood Bank
                </label>
              </div>
            </div>
            
            {/* Blood Inventory Section - Only show if blood bank is checked */}
            {formData.bloodBank && (
              <div className="mt-6 border-t pt-4">
                <h3 className="text-md font-medium text-gray-900 mb-3">Blood Inventory</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {bloodTypes.map(type => (
                    <div key={type} className="flex flex-col">
                      <label className="block text-sm font-medium text-gray-700 mb-1">{type}</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.bloodInventory?.[type] || 0}
                        onChange={(e) => handleBloodInventoryChange(type, e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-3 pt-4">
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
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {editingId ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Hospitals List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Hospitals & Blood Banks</h2>
        </div>
        
        {filteredHospitals.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No hospitals found. Add your first hospital above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Bank</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredHospitals.map((hospital) => (
                  <tr key={hospital.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{hospital.name}</div>
                      <div className="text-sm text-gray-500">{hospital.city}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getHospitalTypeColor(hospital.type)}`}>
                        {hospital.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <FiPhone className="h-4 w-4 text-gray-400 mr-2" />
                        {hospital.contact || 'N/A'}
                      </div>
                      <div className="flex items-center mt-1">
                        <FiMail className="h-4 w-4 text-gray-400 mr-2" />
                        {hospital.email || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {hospital.bloodBank ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Yes
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          No
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(hospital)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(hospital.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalManagement;