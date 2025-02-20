import React, { useState } from 'react';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Main navigation bar */}
        <div className="flex items-center justify-between">
          {/* Left section with logo */}
          <div className="flex items-center gap-8">
            <a href='/'><h1 className="text-2xl font-bold">ShopEase</h1></a>
            <div className="hidden md:flex gap-6">
              <a href="/shop" className="hover:text-gray-600">My Product</a>
              <a href="/add-product" className="hover:text-gray-600">Add Product</a>
            </div>
          </div>

          {/* Right section with search and cart */}
          <div className="flex items-center gap-4">
            {/* Desktop search */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for products..."
                className="bg-transparent border-none outline-none ml-2 w-64"
              />
            </div>

            {/* Mobile search and menu buttons */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* Shopping cart button */}
            <button className="relative">
              <ShoppingBag className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        {isSearchOpen && (
          <div className="md:hidden mt-4">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for products..."
                className="bg-transparent border-none outline-none ml-2 w-full"
              />
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t">
            <div className="flex flex-col gap-4">
              <a href="/shop" className="hover:text-gray-600">My Products</a>
              <a href="/add-product" className="hover:text-gray-600">Add Product</a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;