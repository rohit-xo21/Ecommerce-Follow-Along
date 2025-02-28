import React, { useState, useEffect } from 'react';
import { User, Home, LogOut, Plus, Trash2, Loader } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Navigation from '../components/Navbar';
import { Footer } from '../components/Footer';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    addresses: []
  });
  
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: ""
  });

  // Fetch user profile data
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
  
  // Handle adding a new address
  const handleAddAddress = async () => {
    if (newAddress.street && newAddress.city && newAddress.state && newAddress.zip) {
      try {
        const token = Cookies.get('authToken');
        
        if (!token) {
          console.error('No auth token found');
          return;
        }
        
        // Create new address via API
        const response = await axios.post(
          'http://localhost:2022/api/users/address', 
          newAddress,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (response.data && response.data.address) {
          // Update local state with the new address from API response
          setUserData({
            ...userData,
            addresses: [...userData.addresses, response.data.address]
          });
        } else {
          // Fallback if API doesn't return the expected data structure
          const newAddressWithId = { id: Date.now(), ...newAddress };
          setUserData({
            ...userData,
            addresses: [...userData.addresses, newAddressWithId]
          });
        }
        
        // Reset form and hide it
        setNewAddress({ street: "", city: "", state: "", zip: "" });
        setShowAddressForm(false);
      } catch (error) {
        console.error('Error adding address:', error);
        alert('Failed to add address. Please try again.');
      }
    }
  };
  
  // Handle removing an address
  const handleRemoveAddress = async (id) => {
    try {
      const token = Cookies.get('authToken');
      
      if (!token) {
        console.error('No auth token found');
        return;
      }
      
      // Delete address via API
      await axios.delete(`http://localhost:2022/api/users/address/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      const updatedAddresses = userData.addresses.filter(address => address.id !== id);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-64">
          <div className="flex flex-col items-center gap-3">
            <Loader className="animate-spin text-gray-500" size={32} />
            <p className="text-gray-500 text-base">Loading profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <div className="bg-white rounded-xl shadow-md border border-gray-100 mb-8">
          {/* Profile Header */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center space-x-6">
              <div className="bg-gray-100 rounded-full p-5">
                <User size={40} className="text-gray-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{userData.name}</h2>
                <p className="text-gray-600 mt-2">{userData.email}</p>
              </div>
            </div>
          </div>
          
          {/* Addresses Section */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium text-gray-800">My Addresses</h3>
              <button 
                className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors hover:bg-gray-800"
                onClick={() => setShowAddressForm(!showAddressForm)}
              >
                <Plus size={16} />
                <span>Add Address</span>
              </button>
            </div>
            
            {/* Address Form */}
            {showAddressForm && (
              <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
                <div className="grid grid-cols-1 gap-5 mb-5">
                  <input
                    placeholder="Street Address"
                    className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                  />
                  <div className="grid grid-cols-2 gap-5">
                    <input
                      placeholder="City"
                      className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                    />
                    <input
                      placeholder="State"
                      className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                    />
                  </div>
                  <input
                    placeholder="ZIP Code"
                    className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                    value={newAddress.zip}
                    onChange={(e) => setNewAddress({...newAddress, zip: e.target.value})}
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button 
                    className="bg-gray-200 hover:bg-gray-300 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
                    onClick={() => setShowAddressForm(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
                    onClick={handleAddAddress}
                  >
                    Save Address
                  </button>
                </div>
              </div>
            )}
            
            {/* Address List */}
            {userData.addresses && userData.addresses.length > 0 ? (
              <div className="space-y-5">
                {userData.addresses.map(address => (
                  <div key={address._id} className="flex items-start justify-between border border-gray-200 rounded-lg p-5 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <Home className="text-gray-400 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <p className="font-medium text-gray-800">{address.street}</p>
                        <p className="text-sm text-gray-600 mt-1.5">{address.city}, {address.state} {address.zip}</p>
                      </div>
                    </div>
                    <button 
                      className="text-gray-400 hover:text-red-500 transition-colors p-1.5"
                      onClick={() => handleRemoveAddress(address._id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 px-6 border border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center justify-center">
                <p className="text-gray-500 text-center mb-1">No addresses added yet</p>
                <p className="text-gray-400 text-sm text-center">Your saved addresses will appear here</p>
              </div>
            )}
          </div>
          
          {/* Logout Button */}
          <div className="p-8">
            <button 
              className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3.5 rounded-lg transition-colors"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;