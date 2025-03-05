import React, { useState } from 'react';

function ProductCard({ 
  name, 
  price, 
  originalPrice, 
  rating, 
  reviewCount, 
  imageUrl, 
  imageAlt,
  imageFit = 'contain', // Default to contain, but allows override
  imagePosition = 'center', // Default image position
  onClick,
  addToCart
}) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="w-[300px] bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="flex justify-center items-center h-[250px] w-full bg-gray-100">
        {!imageError ? (
          <img 
            src={imageUrl} 
            alt={imageAlt || name}
            className={`object-${imageFit} ${imagePosition} h-full w-full`}
            onError={handleImageError}
            onClick={onClick}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400">
            Image Not Available
          </div>
        )}
      </div>
      
      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <h3 className="text-[15px] font-normal text-black truncate h-[25px]">{name}</h3>
          
          {/* Price and Discount */}
          <div className="flex items-center space-x-2">
            <span className="text-[15px] font-bold text-black">${price.toFixed(2)}</span>
            {originalPrice && originalPrice > price && (
              <span className="text-[13px] text-gray-500 line-through ml-2">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        <button
          className="w-full border border-black rounded-full py-3 text-base font-normal 
                     hover:bg-black hover:text-white transition-colors duration-300"
          onClick={addToCart}
        >
          Add To Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;