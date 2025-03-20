import React, { useState, useEffect } from 'react';
import { User, Home, LogOut, Plus, Trash2, Loader, X, Package, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import Navigation from '../components/Navbar';
import { Footer } from '../components/Footer';

const AddressModal = ({ isOpen, onClose, onSave, newAddress, setNewAddress }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full animate-fadeIn">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800">Add New Address</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 gap-5 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input
                placeholder="Country"
                className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-gray-200"
                value={newAddress.country}
                onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address 1</label>
              <input
                placeholder="Address 1"
                className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-gray-200"
                value={newAddress.address1}
                onChange={(e) => setNewAddress({ ...newAddress, address1: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address 2</label>
              <input
                placeholder="Address 2"
                className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-gray-200"
                value={newAddress.address2}
                onChange={(e) => setNewAddress({ ...newAddress, address2: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                placeholder="City"
                className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-gray-200"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
              <input
                placeholder="ZIP Code"
                className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-gray-200"
                value={newAddress.zip}
                onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-gray-200"
                value={newAddress.type}
                onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
              >
                <option value="home">Home</option>
                <option value="work">Work</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <button className="bg-gray-200 px-6 py-2.5 rounded-lg text-sm" onClick={onClose}>Cancel</button>
            <button 
              className="bg-black text-white px-6 py-2.5 rounded-lg text-sm"
              onClick={onSave}
              disabled={!newAddress.country || !newAddress.city || !newAddress.address1 || !newAddress.zip || !newAddress.type}
            >
              Save Address
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    addresses: []
  });
  
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    country: "",
    address1: "",
    address2: "",
    city: "",
    zip: "",
    type: "home"
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const token = Cookies.get('authToken');
        
        if (!token) {
          console.error('No auth token found');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:2022/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.user) {
          setUserData({
            name: response.data.user.name || 'User',
            email: response.data.user.email || '',
            addresses: response.data.user.addresses || []
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setUserData({
          name: "User",
          email: "user@example.com",
          addresses: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleAddAddress = async () => {
    if (newAddress.country && newAddress.city && newAddress.address1 && newAddress.zip && newAddress.type) {
      try {
        const token = Cookies.get('authToken');
        
        if (!token) {
          console.error('No auth token found');
          return;
        }
        
        const response = await axios.post(
          'http://localhost:2022/api/users/address', 
          newAddress,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (response.data && response.data.address) {
          setUserData({
            ...userData,
            addresses: [...userData.addresses, response.data.address]
          });
        } else {
          const newAddressWithId = { id: Date.now(), ...newAddress };
          setUserData({
            ...userData,
            addresses: [...userData.addresses, newAddressWithId]
          });
        }
        
        setNewAddress({ country: "", address1: "", address2: "", city: "", zip: "", type: "home" });
        setShowAddressModal(false);
      } catch (error) {
        console.error('Error adding address:', error);
        alert('Failed to add address. Please try again.');
      }
    }
  };

  const handleRemoveAddress = async (id) => {
    try {
      const token = Cookies.get('authToken');
      
      if (!token) {
        console.error('No auth token found');
        return;
      }
      
      await axios.delete(`http://localhost:2022/api/users/address/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const updatedAddresses = userData.addresses.filter(address => address._id !== id);
      setUserData({
        ...userData,
        addresses: updatedAddresses
      });
    } catch (error) {
      console.error('Error removing address:', error);
      alert('Failed to remove address. Please try again.');
    }
  };

  const handleLogout = () => {
    Cookies.remove('authToken');
    window.location.href = '/login';
  };

  const handleNavigateToOrders = () => {
    navigate('/my-orders');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        
        <div className="flex-grow flex justify-center items-center">
          <div className="flex flex-col items-center gap-2">
            <Loader className="animate-spin text-gray-500" size={32} />
            <p className="text-gray-500">Loading profile...</p>
          </div>
        </div>
        
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      
      <main className="flex-grow mx-auto w-full max-w-screen-xl px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 pl-2">My Profile</h1>
        
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Profile Header */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center gap-6">
              <div className="bg-gray-100 rounded-full p-5 flex-shrink-0">
                <User size={36} className="text-gray-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{userData.name}</h2>
                <p className="text-gray-600 mt-1">{userData.email}</p>
              </div>
            </div>
          </div>
          
          {/* New My Orders Section */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <Package className="text-gray-600" size={24} />
                <h3 className="text-xl font-medium text-gray-800">My Orders</h3>
              </div>
              <button 
                className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors hover:bg-gray-800"
                onClick={handleNavigateToOrders}
              >
                <ShoppingCart size={16} />
                <span>View Orders</span>
              </button>
            </div>
            <p className="text-gray-600 text-sm">
              Track, return, or buy things again from your previous orders.
            </p>
          </div>
          
          {/* Addresses Section */}
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium text-gray-800">My Addresses</h3>
              <button 
                className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors hover:bg-gray-800"
                onClick={() => setShowAddressModal(true)}
              >
                <Plus size={16} />
                <span>Add Address</span>
              </button>
            </div>
            
            {userData.addresses && userData.addresses.length > 0 ? (
              <div className="space-y-4">
                {userData.addresses.map(address => (
                  <div key={address._id} className="flex items-start justify-between border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <Home className="text-gray-400 mt-1 flex-shrink-0" size={18} />
                      <div>
                        <p className="font-medium text-gray-800">{address.address1}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {address.address2 && `${address.address2}, `}
                          {address.city}, {address.zip} {address.country}
                        </p>
                      </div>
                    </div>
                    <button 
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      onClick={() => handleRemoveAddress(address._id)}
                      aria-label="Remove address"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 px-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center justify-center">
                <p className="text-gray-500 text-center mb-1">No addresses added yet</p>
                <p className="text-gray-400 text-sm text-center">Your saved addresses will appear here</p>
              </div>
            )}
          </div>
          
          {/* Logout Button */}
          <div className="p-8 border-t border-gray-100">
            <button 
              className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3.5 rounded-lg transition-colors"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </main>
      
      {/* Address Modal */}
      <AddressModal 
        isOpen={showAddressModal}
        onClose={() => {
          setShowAddressModal(false);
          setNewAddress({ country: "", address1: "", address2: "", city: "", zip: "", type: "home" });
        }}
        onSave={handleAddAddress}
        newAddress={newAddress}
        setNewAddress={setNewAddress}
      />
      
      
    </div>
  );
};

export default Profile;