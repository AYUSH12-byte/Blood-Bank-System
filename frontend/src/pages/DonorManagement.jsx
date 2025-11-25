// src/pages/DonorManagement.jsx
import React, { useState, useEffect } from 'react';
import { FiUser, FiPlus, FiEdit2, FiTrash2, FiDroplet, FiPhone, FiMail, FiSave, FiX } from 'react-icons/fi';

const DonorManagement = () => {
  // Load donors from localStorage 
  const [donors, setDonors] = useState(() => {
    const savedDonors = localStorage.getItem('bloodDonationDonors');
    return savedDonors ? JSON.parse(savedDonors) : [];
  });

  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', bloodType: 'O+', contact: '', email: '' });

  // Save to localStorage whenever donors change
  useEffect(() => {
    localStorage.setItem('bloodDonationDonors', JSON.stringify(donors));
  }, [donors]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      const updatedDonors = donors.map(donor => 
        donor.id === editingId ? { ...formData, id: editingId } : donor
      );
      setDonors(updatedDonors);
      setEditingId(null);
    } else {
      const newId = donors.length > 0 ? Math.max(...donors.map(d => d.id)) + 1 : 1;
      const newDonor = { ...formData, id: newId };
      setDonors([...donors, newDonor]);
      setIsAdding(false);
    }
    setFormData({ name: '', bloodType: 'O+', contact: '', email: '' });
  };
  const handleEdit = (donor) => {
    setFormData(donor);
    setEditingId(donor.id);
    setIsAdding(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this donor?')) {
      setDonors(donors.filter(donor => donor.id !== id));
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', bloodType: 'O+', contact: '', email: '' });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Donor Management</h1>
      
      {!isAdding && !editingId && (
        <button
          onClick={() => {
            setIsAdding(true);
            setFormData({ name: '', bloodType: 'O+', contact: '', email: '' });
          }}
          className="mb-4 flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <FiPlus className="mr-2" /> Add New Donor
        </button>
      )}

      {(isAdding || editingId) && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Donor' : 'Add New Donor'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Blood Type</label>
              <select
                name="bloodType"
                value={formData.bloodType}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Contact</label>
              <input
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                <FiSave className="mr-2" /> {editingId ? 'Update' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (editingId) {
                    cancelEdit();
                  } else {
                    setIsAdding(false);
                  }
                }}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                <FiX className="mr-2" /> Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {donors.map((donor) => (
              <tr key={donor.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <FiUser className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{donor.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FiDroplet className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-sm text-gray-900">{donor.bloodType}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <FiPhone className="h-4 w-4 text-gray-400 mr-2" />
                    {donor.contact}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <FiMail className="h-4 w-4 text-gray-400 mr-2" />
                    {donor.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleEdit(donor)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Edit"
                    >
                      <FiEdit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(donor.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonorManagement;