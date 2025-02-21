import React from 'react';


function ProductCard({ 
  name, 
  price, 
  originalPrice, 
  rating, 
  reviewCount, 
  imageUrl, 
  onClick,
  addToCart
  
})
{
  return (
    <div className="w-[300px]" >
      <div className="bg-white mb-4">
        <img 
          src={imageUrl} 
          alt={name}
          className="w-full h-auto object-contain"
          onClick={onClick}
        />
        <button
          className="w-full mt-4 border border-black rounded-full py-3 text-base font-normal mx-auto hover:bg-black hover:text-white"
          onClick={addToCart}
        >
          Add To Cart
        </button>
        
      </div>
      
      <div className="space-y-2">
        <h3 className="text-[15px] font-normal text-black truncate h-[25px]">{name}</h3>
        
        {/* Price and Discount */}
        <div className="flex items-center space-x-2">
          <span className="text-[15px] font-bold text-black">${price.toFixed(2)}</span>
          {originalPrice && originalPrice > price && (
            <span className="text-[13px] text-gray-500 line-through">${originalPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );
}


export default ProductCard;