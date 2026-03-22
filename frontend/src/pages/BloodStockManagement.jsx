// src/pages/BloodStockManagement.jsx
import React, { useState, useEffect } from 'react';
import { FiDroplet, FiPlus, FiEdit2, FiSave, FiX, FiActivity } from 'react-icons/fi';

const BloodStockManagement = () => {
  // Blood types with their default values
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  
  // Load stock from localStorage or initialize with default values
  const [stock, setStock] = useState(() => {
    const savedStock = localStorage.getItem('bloodStock');
    if (savedStock) return JSON.parse(savedStock);
    
    // Initialize with default values if no saved data
    return bloodTypes.map(type => ({
      type,
      quantity: 0,
      status: 'Adequate', // Adequate, Low, Critical
      lastUpdated: new Date().toISOString()
    }));
  });

  const [editingType, setEditingType] = useState(null);
  const [editValue, setEditValue] = useState('');

  // Save to localStorage whenever stock changes
  useEffect(() => {
    localStorage.setItem('bloodStock', JSON.stringify(stock));
  }, [stock]);

  const getStatus = (quantity) => {
    if (quantity <= 2) return 'Critical';
    if (quantity <= 5) return 'Low';
    return 'Adequate';
  };

  const handleUpdateStock = (type, newQuantity) => {
    const updatedStock = stock.map(item => 
      item.type === type 
        ? { 
            ...item, 
            quantity: newQuantity,
            status: getStatus(newQuantity),
            lastUpdated: new Date().toISOString()
          } 
        : item
    );
    setStock(updatedStock);
    setEditingType(null);
  };

  const handleAddStock = (type, amount) => {
    const currentItem = stock.find(item => item.type === type);
    if (currentItem) {
      const newQuantity = Math.max(0, currentItem.quantity + amount);
      handleUpdateStock(type, newQuantity);
    }
  };

  const startEditing = (type, currentQuantity) => {
    setEditingType(type);
    setEditValue(currentQuantity);
  };

  const cancelEditing = () => {
    setEditingType(null);
    setEditValue('');
  };

  const saveEdit = (type) => {
    const newQuantity = parseInt(editValue, 10) || 0;
    if (newQuantity >= 0) {
      handleUpdateStock(type, newQuantity);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'Low': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Critical': return '🔴';
      case 'Low': return '🟡';
      default: return '🟢';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blood Stock Management</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <FiDroplet className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Units</p>
              <p className="text-2xl font-semibold">
                {stock.reduce((sum, item) => sum + item.quantity, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FiActivity className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Low Stock</p>
              <p className="text-2xl font-semibold">
                {stock.filter(item => item.status === 'Low').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <FiActivity className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Critical Stock</p>
              <p className="text-2xl font-semibold">
                {stock.filter(item => item.status === 'Critical').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Blood Stock Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 bg-gray-50">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Current Blood Inventory</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage and update blood stock levels</p>
        </div>
        
        <div className="border-t border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blood Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity (Units)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stock.map((item) => (
                  <tr key={item.type} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiDroplet className="h-5 w-5 text-red-500 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{item.type}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingType === item.type ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded-md"
                          />
                        </div>
                      ) : (
                        <span className="text-sm text-gray-900">{item.quantity} units</span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)} {item.status}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.lastUpdated).toLocaleString()}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingType === item.type ? (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => saveEdit(item.type)}
                            className="text-green-600 hover:text-green-900"
                            title="Save"
                          >
                            <FiSave className="h-5 w-5" />
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="text-gray-600 hover:text-gray-900"
                            title="Cancel"
                          >
                            <FiX className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => startEditing(item.type, item.quantity)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <FiEdit2 className="h-5 w-5" />
                          </button>
                          <div className="inline-flex rounded-md shadow-sm">
                            <button
                              onClick={() => handleAddStock(item.type, 1)}
                              className="px-2 py-1 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-l-md"
                              title="Add 1 unit"
                            >
                              +1
                            </button>
                            <button
                              onClick={() => handleAddStock(item.type, -1)}
                              className="px-2 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-r-md"
                              title="Remove 1 unit"
                            >
                              -1
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Stock Legend */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex flex-wrap items-center space-x-6 text-sm">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-green-100 border border-green-300 mr-2"></span>
              <span>Adequate (6+ units)</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-300 mr-2"></span>
              <span>Low (3-5 units)</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-red-100 border border-red-300 mr-2"></span>
              <span>Critical (0-2 units)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodStockManagement;