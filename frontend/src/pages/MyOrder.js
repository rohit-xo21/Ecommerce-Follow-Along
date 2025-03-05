import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Package, Loader, AlertCircle } from 'lucide-react';
import Navigation from '../components/Navbar';
import { Footer } from '../components/Footer';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = Cookies.get('authToken');
        
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:2022/api/orders/myorders', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data && response.data.orders) {
          setOrders(response.data.orders);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />
        <div className="flex-grow flex justify-center items-center">
          <div className="flex flex-col items-center gap-3">
            <Loader className="animate-spin text-gray-500" size={32} />
            <p className="text-gray-500 text-base">Loading your orders...</p>
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
            <div className="flex justify-center mb-4">
              <AlertCircle className="text-red-500" size={48} />
            </div>
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
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <Package className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600 text-lg">You haven't placed any orders yet.</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 bg-black text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div 
                key={order._id} 
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Order #{order._id.slice(-6)}</h2>
                    <p className="text-sm text-gray-500">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium 
                    ${order.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                      order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'}`}
                  >
                    {order.status}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div 
                        key={index} 
                        className={`flex items-center gap-4 ${
                          index !== order.items.length - 1 ? 'border-b border-gray-100 pb-4' : ''
                        }`}
                      >
                        <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
                          {item.productId.images[0] ? (
                            <img 
                              src={item.productId.images[0]} 
                              alt={item.productId.name} 
                              className="h-14 w-14 object-contain" 
                            />
                          ) : (
                            <Package className="text-gray-400" size={24} />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">{item.productId.name}</h3>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-medium">${(item.productId.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 flex justify-between items-center border-t border-gray-100 pt-4">
                    <div>
                      <p className="text-gray-600">Total Amount</p>
                      <p className="text-xl font-bold">${order.totalAmount.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => navigate(`/order-details/${order._id}`)}
                      className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
    </div>
  );
};

export default MyOrders;