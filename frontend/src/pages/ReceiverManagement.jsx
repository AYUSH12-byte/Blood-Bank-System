// src/pages/ReceiverManagement.jsx
import React, { useState, useEffect } from 'react';
import { FiUser, FiPlus, FiEdit2, FiTrash2, FiDroplet, FiPhone, FiMail, FiSave, FiX } from 'react-icons/fi';

const ReceiverManagement = () => {
  // Load receivers from localStorage
  const [receivers, setReceivers] = useState(() => {
    const savedReceivers = localStorage.getItem('bloodDonationReceivers');
    return savedReceivers ? JSON.parse(savedReceivers) : [];
  });

  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    bloodType: 'O+', 
    contact: '', 
    email: '',
    hospital: '',
    requiredDate: '',
    status: 'Pending'
  });

  // Save to localStorage whenever receivers change
  useEffect(() => {
    localStorage.setItem('bloodDonationReceivers', JSON.stringify(receivers));
  }, [receivers]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      const updatedReceivers = receivers.map(receiver => 
        receiver.id === editingId ? { ...formData, id: editingId } : receiver
      );
      setReceivers(updatedReceivers);
      setEditingId(null);
    } else {
      const newId = receivers.length > 0 ? Math.max(...receivers.map(r => r.id)) + 1 : 1;
      const newReceiver = { ...formData, id: newId, dateRequested: new Date().toISOString() };
      setReceivers([...receivers, newReceiver]);
      setIsAdding(false);
    }
    setFormData({ 
      name: '', 
      bloodType: 'O+', 
      contact: '', 
      email: '',
      hospital: '',
      requiredDate: '',
      status: 'Pending'
    });
  };

  const handleEdit = (receiver) => {
    setFormData(receiver);
    setEditingId(receiver.id);
    setIsAdding(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this receiver?')) {
      setReceivers(receivers.filter(receiver => receiver.id !== id));
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ 
      name: '', 
      bloodType: 'O+', 
      contact: '', 
      email: '',
      hospital: '',
      requiredDate: '',
      status: 'Pending'
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Receiver Management</h1>
      
      {!isAdding && !editingId && (
        <button
          onClick={() => {
            setIsAdding(true);
            setFormData({ 
              name: '', 
              bloodType: 'O+', 
              contact: '', 
              email: '',
              hospital: '',
              requiredDate: '',
              status: 'Pending'
            });
          }}
          className="mb-4 flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <FiPlus className="mr-2" /> Add New Receiver
        </button>
      )}

      {(isAdding || editingId) && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Receiver' : 'Add New Receiver'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name *</label>
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
                <label className="block text-sm font-medium text-gray-700">Blood Type *</label>
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
                <label className="block text-sm font-medium text-gray-700">Contact Number *</label>
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
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Hospital *</label>
                <input
                  type="text"
                  name="hospital"
                  value={formData.hospital}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Required Date *</label>
                <input
                  type="date"
                  name="requiredDate"
                  value={formData.requiredDate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {editingId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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

            <div className="flex space-x-2 pt-2">
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
            {receivers.map((receiver) => (
              <tr key={receiver.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <FiUser className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{receiver.name}</div>
                      <div className="text-xs text-gray-500">{receiver.contact}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FiDroplet className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-sm text-gray-900">{receiver.bloodType}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {receiver.hospital}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(receiver.requiredDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    receiver.status === 'Approved' ? 'bg-green-100 text-green-800' :
                    receiver.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                    receiver.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {receiver.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleEdit(receiver)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Edit"
                    >
                      <FiEdit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(receiver.id)}
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
        {receivers.length === 0 && (
          <div className="text-center py-12">
            <FiUser className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No receivers found</h3>
            <p className="mt-1 text-sm text-gray-500">Add a new receiver to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiverManagement;