import React from 'react';
import { Search, ShoppingBag } from 'lucide-react';

export function Navigation() {
  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <a href='/'><h1 className="text-2xl font-bold">ShopEase</h1></a>
          <div className="hidden md:flex gap-6">
            <a href="/shop" className="hover:text-gray-600">Shop</a>
            <a href="#" className="hover:text-gray-600">On Sale</a>
            <a href="#" className="hover:text-gray-600">New Arrivals</a>
            <a href="#" className="hover:text-gray-600">Brands</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for products..."
              className="bg-transparent border-none outline-none ml-2 w-64"
            />
          </div>
          <button className="relative">
            <ShoppingBag className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              0
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}