import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';

function CartItem({ 
  _id,
  name, 
  price, 
  quantity,
  images,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveItem
}) {
  return (
    <div className="p-6">
      <div className="grid grid-cols-12 gap-4 items-center">
        {/* Product Image & Name */}
        <div className="col-span-6 flex items-center space-x-4">
          <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
            <img 
              src={images && images.length > 0 ? images[0] : '/placeholder-image.jpg'} 
              alt={name}
              className="w-full h-full object-contain"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-medium text-gray-900 truncate">{name}</h3>
          </div>
        </div>
        
        {/* Price */}
        <div className="col-span-2 text-center text-sm font-medium text-gray-900">
          ${price.toFixed(2)}
        </div>
        
        {/* Quantity Controls */}
        <div className="col-span-2">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={onDecreaseQuantity}
              className="p-1 rounded-full hover:bg-gray-100 border border-gray-300 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            
            <span className="text-sm font-medium w-8 text-center">
              {quantity}
            </span>
            
            <button
              onClick={onIncreaseQuantity}
              className="p-1 rounded-full hover:bg-gray-100 border border-gray-300 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Subtotal */}
        <div className="col-span-2 text-right text-base font-bold text-gray-900">
          ${(price * quantity).toFixed(2)}
        </div>
      </div>
      
      {/* Remove item button - shows on small screens and as hover on larger ones */}
      <div className="mt-4 sm:hidden">
        <button 
          onClick={onRemoveItem}
          className="text-sm text-red-600 flex items-center"
        >
          <Trash2 className="w-4 h-4 mr-1" /> Remove
        </button>
      </div>
      
      {/* At the bottom of the component, add some hover functionality for larger screens */}
      <div className="hidden sm:block sm:absolute sm:top-4 sm:right-4 sm:opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={onRemoveItem}
          className="text-sm text-gray-500 hover:text-red-600 transition-colors"
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default CartItem;