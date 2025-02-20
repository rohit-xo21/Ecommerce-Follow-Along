import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '../components/Navbar';
import { Footer } from '../components/Footer.js';
import Cookies from 'js-cookie';
import { Trash2, AlertCircle, Edit } from 'lucide-react';
import axios from 'axios';

function ProductCard({ name, price, images, description, category, onEdit, onDelete, onClick }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden relative group" onClick={onClick}>
      <div className="relative">
        <img src={images[0]} alt={name} className="w-full h-48 object-cover" />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-2 right-2 z-10 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="absolute top-2 left-2 p-1.5 bg-white bg-opacity-90 rounded-full shadow-sm hover:bg-opacity-100 transition-all duration-200 opacity-0 group-hover:opacity-100"
        >
          <Edit size={16} className="text-gray-700" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-gray-600">{category}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-bold">${price}</span>
        </div>
        <p className="mt-2 text-gray-700 text-sm">{description}</p>
      </div>
    </div>
  );
}

function Shop() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [profile, setProfile] = useState({});
  const authToken = Cookies.get('authToken');

  useEffect(() => {
    if (!authToken) {
      navigate('/login');
      return;
    }

    const fetchArrivals = async () => {
      try {
        const { data } = await axios.get('http://localhost:2022/api/products', {
          headers: {
            "Authorization": `Bearer ${authToken}`
          }
        });
        setProducts(data);
        setIsLoading(false);
      } catch (error) {
        setError(error.response?.data || error.message);
        setIsLoading(false);
      }
    };

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:2022/api/users/profile', {
          headers: {
            "Authorization": `Bearer ${authToken}`
          }
        });
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error.response?.data || error.message);
      }
    };

    fetchData();
    fetchArrivals();
  }, [authToken, navigate]);

  const handleEditProduct = (product) => {
    navigate(`/edit-product/${product._id}`, { state: { product } });
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:2022/api/products/${productId}`, {
        headers: {
          "Authorization": `Bearer ${authToken}`
        }
      });
      setProducts(products.filter(product => product._id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error.response?.data || error.message);
    }
  };

  const toDetails = (product) => {
    navigate(`/product/${product._id}`, { state: { product } });
  };

  return (
    <div>
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Your Products</h2>
          <button
            onClick={() => navigate('/add-product')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Product
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                {...product}
                onEdit={() => handleEditProduct(product)}
                onDelete={() => handleDeleteProduct(product._id)}
                onClick={() => toDetails(product)}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Shop;