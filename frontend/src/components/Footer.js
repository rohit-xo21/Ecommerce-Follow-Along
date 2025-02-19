import React from 'react';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold text-xl mb-4">SHOP EASE</h3>
          <p className="text-gray-600 mb-4">
            We have clothes that suits your style and which you're proud to wear.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-4">COMPANY</h4>
          <div className="flex flex-col gap-2 text-gray-600">
            <a href="#" className="hover:text-black">About</a>
            <a href="#" className="hover:text-black">Features</a>
            <a href="#" className="hover:text-black">Works</a>
            <a href="#" className="hover:text-black">Career</a>
          </div>
        </div>
        <div>
          <h4 className="font-bold mb-4">HELP</h4>
          <div className="flex flex-col gap-2 text-gray-600">
            <a href="#" className="hover:text-black">Customer Support</a>
            <a href="#" className="hover:text-black">Delivery Details</a>
            <a href="#" className="hover:text-black">Terms & Conditions</a>
            <a href="#" className="hover:text-black">Privacy Policy</a>
          </div>
        </div>
        <div>
          <h4 className="font-bold mb-4">FAQ</h4>
          <div className="flex flex-col gap-2 text-gray-600">
            <a href="#" className="hover:text-black">Account</a>
            <a href="#" className="hover:text-black">Orders</a>
            <a href="#" className="hover:text-black">Payments</a>
            <a href="#" className="hover:text-black">Returns</a>
          </div>
        </div>
      </div>
      <div className="border-t">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <p className="text-gray-600">© 2024 SHOP EASE All Rights Reserved.</p>
          <div className="flex gap-4">
            <img src="https://raw.githubusercontent.com/danielmorsing/payment-icons/master/assets/visa.svg" alt="Visa" className="h-6" />
            <img src="https://raw.githubusercontent.com/danielmorsing/payment-icons/master/assets/mastercard.svg" alt="Mastercard" className="h-6" />
            <img src="https://raw.githubusercontent.com/danielmorsing/payment-icons/master/assets/paypal.svg" alt="PayPal" className="h-6" />
          </div>
        </div>
      </div>
    </footer>
  );
}