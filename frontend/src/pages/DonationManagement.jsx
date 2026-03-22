import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi';

const DonationManagement = () => {
  // State for donations list
  const [donations, setDonations] = useState(() => {
    const savedDonations = localStorage.getItem('bloodDonations');
    return savedDonations ? JSON.parse(savedDonations) : [];
  });

  // State for donors list
  const [donors, setDonors] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    donorId: '',
    donorName: '',
    bloodType: 'A+',
    units: 1,
    donationDate: new Date().toISOString().split('T')[0],
    hospital: ''
  });

  const [hospitals, setHospitals] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Load hospitals with blood banks
  useEffect(() => {
    const loadHospitals = () => {
      try {
        const savedHospitals = JSON.parse(localStorage.getItem('hospitals') || '[]');
        const bloodBanks = savedHospitals
          .filter(h => h.bloodBank)
          .sort((a, b) => a.name.localeCompare(b.name));
        
        setHospitals(bloodBanks);
        
        if (bloodBanks.length > 0 && !formData.hospital) {
          setFormData(prev => ({
            ...prev,
            hospital: bloodBanks[0].name
          }));
        }
      } catch (error) {
        console.error('Error loading hospitals:', error);
      }
    };

    loadHospitals();
  }, [formData.hospital]);

  // Load donors
  useEffect(() => {
    const loadDonors = () => {
      try {
        const savedDonors = JSON.parse(localStorage.getItem('bloodDonationDonors') || '[]');
        setDonors(savedDonors);
      } catch (error) {
        console.error('Error loading donors:', error);
      }
    };

    loadDonors();
  }, []);

  // Save donations to localStorage
  useEffect(() => {
    localStorage.setItem('bloodDonations', JSON.stringify(donations));
  }, [donations]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'donorName') {
      const selectedDonor = donors.find(d => d.name === value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        donorId: selectedDonor?.id || '',
        bloodType: selectedDonor?.bloodType || prev.bloodType
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'units' ? Math.max(1, parseInt(value) || 1) : value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.donorName || !formData.hospital) {
      alert('Please fill in all required fields');
      return;
    }

    const donationData = {
      ...formData,
      id: isEditing ? editingId : Date.now().toString(),
      units: parseInt(formData.units),
      donorId: formData.donorId || donors.find(d => d.name === formData.donorName)?.id || ''
    };

    if (isEditing) {
      setDonations(donations.map(d => 
        d.id === editingId ? donationData : d
      ));
    } else {
      setDonations([donationData, ...donations]);
    }

    // Reset form
    setFormData({
      donorId: '',
      donorName: '',
      bloodType: 'A+',
      units: 1,
      donationDate: new Date().toISOString().split('T')[0],
      hospital: hospitals[0]?.name || ''
    });
    
    setEditingId(null);
    setIsEditing(false);
  };

  const handleEdit = (donation) => {
    const selectedDonor = donors.find(d => d.id === donation.donorId);
    setFormData({
      donorId: donation.donorId,
      donorName: selectedDonor?.name || donation.donorName,
      bloodType: donation.bloodType,
      units: donation.units,
      donationDate: donation.donationDate,
      hospital: donation.hospital
    });
    setEditingId(donation.id);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this donation?')) {
      setDonations(donations.filter(donation => donation.id !== id));
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      donorId: '',
      donorName: '',
      bloodType: 'A+',
      units: 1,
      donationDate: new Date().toISOString().split('T')[0],
      hospital: hospitals[0]?.name || ''
    });
    setEditingId(null);
  };

  // Filter donations based on search term
  const filteredDonations = donations.filter(donation => {
    const donorName = donors.find(d => d.id === donation.donorId)?.name || donation.donorName;
    return (
      donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.bloodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.hospital.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-red-600">Blood Donation Management</h1>
      
      {/* Donation Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? 'Edit Donation' : 'Record New Donation'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Donor Name *</label>
              <select
                name="donorName"
                value={formData.donorName}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                required
              >
                <option value="">Select a donor</option>
                {donors.map(donor => (
                  <option key={donor.id} value={donor.name}>
                    {donor.name} ({donor.bloodType})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type *</label>
              <select
                name="bloodType"
                value={formData.bloodType}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                required
              >
                {bloodTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Units *</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Donation Date *</label>
              <input
                type="date"
                name="donationDate"
                value={formData.donationDate}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hospital/Blood Bank *</label>
              {hospitals.length > 0 ? (
                <select
                  name="hospital"
                  value={formData.hospital}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  required
                >
                  <option value="">Select a hospital/blood bank</option>
                  {hospitals.map(hospital => (
                    <option key={hospital.id} value={hospital.name}>
                      {hospital.name} {hospital.bloodBank ? '(Blood Bank)' : ''}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-sm text-red-600 p-2 bg-red-50 rounded">
                  No blood banks found. Please add a hospital with blood bank enabled first.
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            {isEditing && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <FiX className="inline mr-1" /> Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
            >
              {isEditing ? (
                <>
                  <FiSave className="mr-1" /> Update Donation
                </>
              ) : (
                <>
                  <FiPlus className="mr-1" /> Add Donation
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Donations List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Donation Records</h2>
          <div className="w-64">
            <input
              type="text"
              placeholder="Search donations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
            />
          </div>
        </div>
        
        {filteredDonations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDonations.map((donation) => {
                  const donor = donors.find(d => d.id === donation.donorId) || { name: donation.donorName };
                  return (
                    <tr key={donation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {donor.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {donation.bloodType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {donation.hospital}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(donation.donationDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(donation)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                          title="Edit"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDelete(donation.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No donation records found. Start by adding a new donation.
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationManagement;