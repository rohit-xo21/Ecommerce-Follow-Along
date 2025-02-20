import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, ChevronLeft, ChevronRight, Package, Clock, ShoppingCart, Plus, Minus } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Footer } from '../components/Footer';
import Navigation from '../components/Navbar';

function Product() {
  const { productId } = useParams();
  const [productData, setProductData] = useState({});
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const maxStock = parseInt(productData.stock) || 0;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:2022/api/products/${productId}`, {
          headers: {
            "Authorization": `Bearer ${Cookies.get('authToken')}`
          }
        });
        setProductData(data);
      } catch (error) {
        console.error("Error fetching product:", error.response?.data || error.message);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  useEffect(() => {
    console.log("Product data:", productData);
    console.log("Stock:", productData.stock);
    console.log("Max stock:", maxStock);
  }, [productData]);

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % (productData.images?.length || 1));
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + (productData.images?.length || 1)) % (productData.images?.length || 1));
  };

  const incrementQuantity = () => {
    if (quantity < maxStock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      if (value > maxStock) {
        setQuantity(maxStock);
      } else if (value < 1) {
        setQuantity(1);
      } else {
        setQuantity(value);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
        <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Image Gallery */}
          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 relative">
              <img
                src={productData.images && productData.images[selectedImage]}
                alt={productData.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            <div className="mt-4 grid grid-cols-6 gap-2">
              {productData.images?.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden ${selectedImage === index ? 'ring-2 ring-black' : ''}`}
                >
                  <img src={img} alt={`${productData.name} view ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2">
                {productData.category && (
                  <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {productData.category}
                  </span>
                )}
                {maxStock > 0 && (
                  <span className="px-2.5 py-0.5 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    In Stock
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold mt-2">{productData.name || "Product Name"}</h1>
            </div>

            <div className="space-y-1">
              <div className="text-2xl font-semibold">
                ${productData.price || '0'}
              </div>
              {productData.originalPrice && productData.originalPrice !== productData.price && (
                <div className="text-gray-500 line-through">
                  ${productData.originalPrice}
                </div>
              )}
            </div>

            <div className="prose prose-sm text-gray-600">
              <p>{productData.description || "No description available."}</p>
            </div>

            {/* Quantity Selection */}
            <div>
              <label className="block text-lg font-medium mb-2">Quantity</label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="p-2 border rounded-md disabled:border-gray-200 disabled:text-gray-400"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  max={maxStock || 1}
                  className="w-20 text-center border border-gray-300 rounded-md py-2"
                />
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= maxStock}
                  className="p-2 border rounded-md disabled:border-gray-200 disabled:text-gray-400"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-500">
                  {maxStock} available
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="flex gap-4">
              <button className="flex-1 bg-black text-white py-4 rounded-full hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button className="p-4 border border-gray-300 rounded-full hover:border-black transition-colors">
                <Heart className="w-6 h-6" />
              </button>
            </div>
          </div>

        </div>
      </div>
        <Footer />
    </div>
  );
}

export default Product;