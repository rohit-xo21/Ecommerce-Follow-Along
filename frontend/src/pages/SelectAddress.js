import React, { useState, useEffect } from 'react';
import { Home, CheckCircle, Loader, ChevronLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import Navigation from '../components/Navbar';
import { Footer } from '../components/Footer';

const SelectAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const token = Cookies.get('authToken');
        
        if (!token) {
          console.error('No auth token found');
          navigate('/login');
          return;
        }

        // Fetch user profile for addresses
        const response = await axios.get('http://localhost:2022/api/users/addresses', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data && response.data.addresses) {
          setAddresses(response.data.addresses);
          
          // Auto-select the first address if available
          if (response.data.addresses.length > 0) {
            setSelectedAddressId(response.data.addresses[0]._id);
          }
        }
      } catch (err) {
        console.error('Error fetching addresses:', err);
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [navigate]);

  const handleSelectAddress = (addressId) => {
    setSelectedAddressId(addressId);
  };

  const handleContinue = () => {
    if (selectedAddressId) {
      navigate('/order-confirmation', { state: { addressId: selectedAddressId } });
    } else {
      alert('Please select an address to continue');
    }
  };
  
  const handleAddNewAddress = () => {
    navigate('/profile');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />
        <div className="flex-grow flex justify-center items-center">
          <div className="flex flex-col items-center gap-3">
            <Loader className="animate-spin text-gray-500" size={32} />
            <p className="text-gray-500 text-base">Loading addresses...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />
        <div className="flex-grow flex justify-center items-center">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-md w-full">
            <p className="text-red-500 text-lg mb-4 text-center">Error: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-black text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <main className="flex-grow mx-auto w-full max-w-screen-xl px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <button 
            onClick={() => navigate('/cart')} 
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft size={18} />
            <span>Back to Cart</span>
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-8">Select Shipping Address</h1>
        
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">Your Addresses</h2>
          </div>
          
          <div className="p-6">
            {addresses.length > 0 ? (
              <div className="space-y-4">
                {addresses.map(address => (
                  <div 
                    key={address._id} 
                    onClick={() => handleSelectAddress(address._id)}
                    className={`flex items-start cursor-pointer border ${selectedAddressId === address._id ? 'border-black bg-gray-50' : 'border-gray-200'} rounded-lg p-4 hover:bg-gray-50 transition-colors`}
                  >
                    <div className="flex-1 flex items-start gap-3">
                      <Home className="text-gray-400 mt-1 flex-shrink-0" size={18} />
                      <div>
                        <p className="font-medium text-gray-800">{address.address1}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {address.address2 && `${address.address2}, `}
                          {address.city}, {address.zip} {address.country}
                        </p>
                        {address.type && (
                          <p className="text-xs text-gray-500 mt-1">Type: {address.type}</p>
                        )}
                      </div>
                    </div>
                    
                    {selectedAddressId === address._id && (
                      <CheckCircle className="text-black flex-shrink-0" size={20} />
                    )}
                  </div>
                ))}
                
                <button 
                  onClick={handleAddNewAddress}
                  className="flex items-center justify-center gap-2 w-full border border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors"
                >
                  <Plus size={18} />
                  <span>Add New Address</span>
                </button>
              </div>
            ) : (
              <div className="py-10 px-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center justify-center">
                <p className="text-gray-500 text-center mb-3">No addresses found</p>
                <button 
                  onClick={handleAddNewAddress}
                  className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors hover:bg-gray-800"
                >
                  <Plus size={16} />
                  <span>Add New Address</span>
                </button>
              </div>
            )}
          </div>
          
          <div className="p-6 border-t border-gray-100">
            <button 
              onClick={handleContinue}
              disabled={!selectedAddressId}
              className={`w-full py-3.5 rounded-lg font-medium ${
                !selectedAddressId 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-black text-white hover:bg-gray-800 transition-colors'
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      </main>
      

    </div>
  );
};

export default SelectAddress;