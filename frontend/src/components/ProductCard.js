import React from 'react';
import { Star } from 'lucide-react';

function ProductCard({ 
  title, 
  price, 
  originalPrice, 
  rating, 
  reviewCount, 
  imageUrl ,
  onClick
}) {
  const discount = originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0;
  
  return (
    <div className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300" onClick={onClick}>
      {/* Image container */}
      <div className="aspect-[4/5] overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
        {originalPrice && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
            -{discount}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 truncate">{title}</h3>
        
        {/* Rating */}
        <div className="flex items-center mt-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={`${
                  i < Math.floor(rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-200 fill-gray-200'
                }`}
              />
            ))}
          </div>
          <span className="ml-1 text-xs text-gray-500">({reviewCount})</span>
        </div>

        {/* Price */}
        <div className="mt-2 flex items-center">
          <span className="text-sm font-medium text-gray-900">${price.toFixed(2)}</span>
          {originalPrice && (
            <span className="ml-2 text-xs text-gray-500 line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {/* Quick add */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-black bg-opacity-0 group-hover:bg-opacity-75 transition-all duration-300 flex items-center justify-center translate-y-full group-hover:translate-y-0">
        <button className="text-white text-sm font-medium">Add to Cart</button>
      </div>
    </div>
  );
}

export default ProductCard;
