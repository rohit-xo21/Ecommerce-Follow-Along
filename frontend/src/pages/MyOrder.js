import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Package, Loader, AlertCircle, XCircle } from 'lucide-react';
import Navigation from '../components/Navbar';
import { Footer } from '../components/Footer';
import { toast } from 'react-toastify';

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

  const handleCancelOrder = async (orderId) => {
    try {
      const token = Cookies.get('authToken');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.put(
        `http://localhost:2022/api/orders/cancel/${orderId}`, 
        {}, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data) {
        // Update the local state to reflect the canceled order
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId 
              ? { ...order, orderStatus: 'Cancelled' } 
              : order
          )
        );
        
        toast.success('Order canceled successfully');
      }
    } catch (err) {
      console.error('Error canceling order:', err);
      toast.error(err.response?.data?.message || 'Failed to cancel order');
    }
  };

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
          <Loader className="animate-spin text-gray-500" size={32} />
          <p className="text-gray-500 ml-2">Loading orders...</p>
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
            <AlertCircle className="text-red-500" size={32} />
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
            <Package className="text-gray-400 mx-auto mb-4" size={48} />
            <p className="text-gray-500 text-lg">You have no orders yet.</p>
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
                    ${order.orderStatus === 'Completed' ? 'bg-green-100 text-green-800' : 
                      order.orderStatus === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 
                      order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'}`}
                  >
                    {order.orderStatus}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {order.orderItems.map((item) => (
                      <div key={item.product} className="flex items-center gap-4">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-medium text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 flex justify-between items-center border-t border-gray-100 pt-4">
                    <div>
                      <p className="text-gray-600">Total Amount</p>
                      <p className="text-xl font-bold">${order.totalAmount.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/order-details/${order._id}`)}
                        className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                      >
                        View Details
                      </button>
                      {order.orderStatus === 'Processing' && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border border-gray-300 hover:border-gray-500"
                        >
                          <XCircle size={16} />
                          Cancel
                        </button>
                      )}
                      
                    </div>
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