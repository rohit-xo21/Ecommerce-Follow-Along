import React from 'react';

export function TopBanner() {
    return (
        <div className="bg-black text-white text-center text-sm py-1">
        Sign up and get 20% off on your first order
        <a href='/signup'> <button className="ml-2 underline">Sign Up Now</button></a>
        </div>
    );
}