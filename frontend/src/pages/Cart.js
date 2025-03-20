import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Loader } from 'lucide-react';
import CartItem from '../components/CartItem';
import Navigation from '../components/Navbar';

const BASE_URL = 'http://localhost:2022/api/products/cart';

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = Cookies.get('authToken');
        if (!token) throw new Error('User not authenticated');

        const response = await axios.get(`${BASE_URL}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(response.data.cart);
      } catch (err) {
        setError('Error fetching cart items: ' + err.message);
        console.log("Error fetching cart items:", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleIncreaseQuantity = async (productId) => {
    try {
      const token = Cookies.get('authToken');
      if (!token) throw new Error('User not authenticated');

      if (!productId || productId === "cart") {
        throw new Error('Invalid productId');
      }

      await axios.put(
        `${BASE_URL}/${productId}/increase`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.productId._id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } catch (err) {
      setError('Failed to update quantity: ' + err.message);
    }
  };

  const handleDecreaseQuantity = async (productId) => {
    try {
      const token = Cookies.get('authToken');
      if (!token) throw new Error('User not authenticated');

      if (!productId || productId === "cart") {
        throw new Error('Invalid productId');
      }

      await axios.put(
        `${BASE_URL}/${productId}/decrease`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.productId._id === productId && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    } catch (err) {
      setError('Failed to update quantity: ' + err.message);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const token = Cookies.get('authToken');
      if (!token) throw new Error('User not authenticated');

      await axios.delete(`${BASE_URL}/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCartItems((prevItems) => 
        prevItems.filter((item) => item.productId._id !== productId)
      );
    } catch (err) {
      setError('Failed to remove item: ' + err.message);
    }
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        
        <div className="flex-grow flex justify-center items-center">
          <div className="flex flex-col items-center gap-3">
            <Loader className="animate-spin text-gray-500" size={32} />
            <p className="text-gray-500 text-base">Loading cart...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500 text-lg mb-6">Your cart is empty</p>
            <button
              className="bg-black text-white py-3 px-6 rounded-full text-lg font-medium hover:bg-gray-900 transition-colors"
              onClick={() => window.location.href = '/products'}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 mb-2">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Subtotal</div>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.productId._id}
                    {...item.productId}
                    quantity={item.quantity}
                    onIncreaseQuantity={() => handleIncreaseQuantity(item.productId._id)}
                    onDecreaseQuantity={() => handleDecreaseQuantity(item.productId._id)}
                    onRemoveItem={() => handleRemoveItem(item.productId._id)}
                  />
                ))}
              </div>

              <div className="p-6 bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-medium text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row sm:justify-between gap-4">
              <button
                className="bg-white text-black border border-gray-300 py-3 px-6 rounded-full text-lg font-medium hover:bg-gray-50 transition-colors"
                onClick={() => window.location.href = '/'}
              >
                Continue Shopping
              </button>
              
              <button
                className="bg-black text-white py-3 px-6 rounded-full text-lg font-medium hover:bg-gray-900 transition-colors"
                onClick={() => window.location.href = '/select-address'}
              >
                Place Order
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartPage;