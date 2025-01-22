import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Shop Ease</h1>
          <Link to="/login" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
            Sign In
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <img src="https://via.placeholder.com/150" alt="Product" className="w-full h-48 object-cover rounded-t-lg" />
              <div className="mt-4">
                <h3 className="text-lg font-bold text-gray-800">Product Name</h3>
                <p className="text-gray-600">$99.99</p>
                <button className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">Add to Cart</button>
              </div>
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">New Arrivals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <img src="https://via.placeholder.com/150" alt="Product" className="w-full h-48 object-cover rounded-t-lg" />
              <div className="mt-4">
                <h3 className="text-lg font-bold text-gray-800">Product Name</h3>
                <p className="text-gray-600">$99.99</p>
                <button className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">Add to Cart</button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-white shadow mt-8">
        <div className="container mx-auto px-4 py-6">
          <p className="text-gray-600">&copy; 2023 Shop Ease. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;