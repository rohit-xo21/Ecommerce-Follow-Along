import React, { useState, useEffect } from 'react';
import { Home, ChevronLeft, Loader, ShoppingBag, CreditCard, Check, DollarSign } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';


const OrderConfirmation = () => {
  const [loading, setLoading] = useState(true);
  const [processingOrder, setProcessingOrder] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [cartTotal, setCartTotal] = useState(0);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod'); // Default to cash on delivery
  
  const navigate = useNavigate();
  const location = useLocation();
  const selectedAddressId = location.state?.addressId;
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = Cookies.get('authToken');
        
        if (!token) {
          console.error('No auth token found');
          navigate('/login');
          return;
        }
        
        if (!selectedAddressId) {
          navigate('/select-address');
          return;
        }

        const cartResponse = await axios.get('http://localhost:2022/api/products/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (cartResponse.data.cart && cartResponse.data.cart.length > 0) {
          setCartItems(cartResponse.data.cart);
          
          const total = cartResponse.data.cart.reduce(
            (sum, item) => sum + (item.productId.price * item.quantity), 
            0
          );
          setCartTotal(total);
        } else {
          navigate('/cart');
          return;
        }
        
        const profileResponse = await axios.get('http://localhost:2022/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (profileResponse.data.user && profileResponse.data.user.addresses) {
          const address = profileResponse.data.user.addresses.find(
            addr => addr._id === selectedAddressId
          );
          
          if (address) {
            setSelectedAddress(address);
          } else {
            navigate('/select-address');
            return;
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, selectedAddressId]);

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      
      script.onload = () => {
        resolve(true);
      };
      
      script.onerror = () => {
        resolve(false);
        console.error('Razorpay SDK failed to load');
      };
      
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    try {
      const res = await initializeRazorpay();
      
      if (!res) {
        alert('Razorpay SDK failed to load. Please check your internet connection.');
        return;
      }
      
      setProcessingOrder(true);
      const token = Cookies.get('authToken');
      
      // Create order on your server
      const orderResponse = await axios.post(
        'http://localhost:2022/api/payments/razorpay/create',
        { amount: cartTotal * 100 }, // amount in paisa
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const options = {
        key: "YOUR_RAZORPAY_KEY_ID", // Replace with your actual Razorpay key ID
        amount: cartTotal * 100,
        currency: "INR",
        name: "Your Store Name",
        description: "Transaction for order",
        order_id: orderResponse.data.id,
        handler: async function (response) {
          // Handle successful payment
          try {
            // Verify payment
            const verifyResponse = await axios.post(
              'http://localhost:2022/api/payments/razorpay/verify',
              { 
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (verifyResponse.data.success) {
              // Create order
              await processOrder({
                paymentMethod: 'razorpay',
                paymentId: response.razorpay_payment_id
              });
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (err) {
            console.error('Payment verification error:', err);
            alert('Payment verification failed. Please contact support.');
            setProcessingOrder(false);
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#000000"
        },
        modal: {
          ondismiss: function() {
            setProcessingOrder(false);
          }
        }
      };
      
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
    } catch (err) {
      console.error('Error initiating Razorpay payment:', err);
      alert('Failed to initialize payment. Please try again.');
      setProcessingOrder(false);
    }
  };

  const processOrder = async (paymentDetails) => {
    try {
      const token = Cookies.get('authToken');
      
      const orderResponse = await axios.post(
        'http://localhost:2022/api/orders/create', 
        { 
          shippingAddressId: selectedAddressId,
          items: cartItems,
          totalAmount: cartTotal,
          paymentMethod: paymentDetails.paymentMethod,
          paymentId: paymentDetails.paymentId || null
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (orderResponse.data && orderResponse.data.orderId) {
        // Clear cart after successful order
        await axios.delete('http://localhost:2022/api/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Redirect to order success page
        navigate(`/order-success/${orderResponse.data.orderId}`);
      } else {
        throw new Error('Invalid order response');
      }
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Failed to place order. Please try again.');
      setProcessingOrder(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert('Please select a shipping address');
      return;
    }
    
    if (paymentMethod === 'razorpay') {
      handleRazorpayPayment();
    } else {
      // COD flow
      try {
        setProcessingOrder(true);
        await processOrder({ paymentMethod: 'cod' });
      } catch (err) {
        console.error('Error placing COD order:', err);
        alert('Failed to place order. Please try again.');
        setProcessingOrder(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-grow flex justify-center items-center">
          <div className="flex flex-col items-center gap-3">
            <Loader className="animate-spin text-gray-500" size={32} />
            <p className="text-gray-500 text-base">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow mx-auto w-full max-w-screen-xl px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <button 
            onClick={() => navigate('/select-address')} 
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft size={18} />
            <span>Back to Address Selection</span>
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-8">Order Confirmation</h1>
        
        <div className="max-w-3xl mx-auto">
          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Order Items</h2>
            </div>
            
            <div className="p-6">
              {cartItems.map((item, index) => (
                <div 
                  key={index} 
                  className={`flex items-center gap-4 py-4 ${
                    index !== cartItems.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
                    {item.productId.images[0] ? (
                      <img src={item.productId.images[0]} alt={item.productId.name} className="h-14 w-14 object-contain" />
                    ) : (
                      <ShoppingBag className="text-gray-400" size={24} />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{item.productId.name}</h3>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium">${(item.productId.price * item.quantity).toFixed(2)}</p>
                    <p className="text-xs text-gray-500">${item.productId.price.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Delivery Address */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Delivery Address</h2>
            </div>
            
            <div className="p-6">
              {selectedAddress && (
                <div className="flex items-start gap-3">
                  <Home className="text-gray-400 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-medium text-gray-800">{selectedAddress.address1}</p>
                    <p className="text-gray-600 mt-1">
                      {selectedAddress.address2 && `${selectedAddress.address2}, `}
                      {selectedAddress.city}, {selectedAddress.zip} {selectedAddress.country}
                    </p>
                    {selectedAddress.type && (
                      <p className="text-sm text-gray-500 mt-1">Address Type: {selectedAddress.type}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Payment Method */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Payment Method</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {/* Pay on Delivery option */}
                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="h-4 w-4 text-black"
                  />
                  <DollarSign className="text-gray-500" size={20} />
                  <div>
                    <span className="font-medium">Pay on Delivery</span>
                    <p className="text-xs text-gray-500 mt-1">Pay with cash when your order is delivered</p>
                  </div>
                </label>
                
                {/* Razorpay option */}
                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                    className="h-4 w-4 text-black"
                  />
                  <CreditCard className="text-gray-500" size={20} />
                  <div>
                    <span className="font-medium">Pay with Razorpay</span>
                    <p className="text-xs text-gray-500 mt-1">Secure online payment via credit/debit card, UPI, or bank transfer</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-3 mt-3">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-lg font-bold">${cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Place Order Button */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              <button 
                onClick={handlePlaceOrder}
                disabled={processingOrder}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-lg font-medium text-white 
                  ${processingOrder ? 'bg-gray-400' : 'bg-black hover:bg-gray-800'} transition-colors`}
              >
                {processingOrder ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Check size={20} />
                    <span>Place Order</span>
                  </>
                )}
              </button>
              
              <p className="text-xs text-gray-500 text-center mt-3">
                By placing your order, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderConfirmation;