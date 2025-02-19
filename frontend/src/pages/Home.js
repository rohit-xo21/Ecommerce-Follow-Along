import React, { useEffect, useState } from 'react';
import { TopBanner } from '../components/TopBanner';
import { Navigation } from '../components/Navbar';
import ProductCard from '../components/ProductCard.js';
import { Footer } from '../components/Footer';
import Cookies from 'js-cookie';
import axios from 'axios';

function Home() {
  const [arrivals, setArrivals] = useState([]);

  useEffect(() => {
    const fetchArrivals = async () => {
      try {
        const authToken = Cookies.get('authToken');
        const config = authToken
          ? { headers: { "Authorization": `Bearer ${authToken}` } }
          : {};

        const { data } = await axios.get('http://localhost:2022/api/products', config);
        setArrivals(data);
      } catch (error) {
        console.error('Error fetching arrivals:', error.response?.data || error.message);
      }
    };

    fetchArrivals();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {(!Cookies.get('authToken')) ? <TopBanner /> : null}
      <Navigation />

      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-5xl font-bold mb-4">FIND CLOTHES THAT MATCHES YOUR STYLE</h2>
            <p className="text-gray-600 mb-8">
              Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
            </p>
            <button className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors">
              Shop Now
            </button>
            <div className="grid grid-cols-3 gap-8 mt-12">
              <div>
                <h3 className="text-3xl font-bold">200+</h3>
                <p className="text-gray-600">International Brands</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold">2,000+</h3>
                <p className="text-gray-600">High-Quality Products</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold">30,000+</h3>
                <p className="text-gray-600">Happy Customers</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <video
              src="https://res.cloudinary.com/doapnwi6d/video/upload/v1738646541/samples/dance-2.mp4"
              className="rounded-lg w-full shadow-lg"
              autoPlay
              loop
              muted
            />
          </div>
        </div>
      </section>

      {/* Brand Logos */}
      <div className="border-y border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center opacity-50">
            <span className="text-2xl font-serif">VERSACE</span>
            <span className="text-2xl">ZARA</span>
            <span className="text-2xl font-serif">GUCCI</span>
            <span className="text-2xl font-serif">PRADA</span>
            <span className="text-2xl">Calvin Klein</span>
          </div>
        </div>
      </div>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">NEW ARRIVALS</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {arrivals.map((product) => (
            <ProductCard
              key={product.id}
              title={product.title}
              price={product.price}
              originalPrice={product.originalPrice}
              rating={product.rating}
              reviewCount={product.reviewCount}
              imageUrl={product.images[0]}
            />
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">STAY UP TO DATE ABOUT OUR LATEST OFFERS</h2>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-2 rounded-full text-black"
            />
            <button className="bg-white text-black px-6 py-2 rounded-full hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}

export default Home;