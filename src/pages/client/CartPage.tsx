import React from 'react';
import { useCartStore } from '../../store/cartStore';
import { Trash2 } from 'lucide-react';

const CartPage = () => {
  const { items, removeItem, updateQuantity } = useCartStore();

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
          <div className="bg-white p-8 rounded-lg shadow">
            <p className="text-gray-500 text-center">Your cart is empty</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="divide-y divide-gray-200">
            {items.map((item) => (
              <div key={item._id} className="p-6 flex items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />
                
                <div className="ml-6 flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">${item.price.toFixed(2)}</p>
                </div>
                
                <div className="ml-6">
                  <label htmlFor={`quantity-${item._id}`} className="sr-only">
                    Quantity
                  </label>
                  <select
                    id={`quantity-${item._id}`}
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                    className="rounded-md border border-gray-300 text-base font-medium text-gray-700 text-left focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="ml-6">
                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                    <span className="sr-only">Remove item</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50 px-6 py-4">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Subtotal</p>
              <p>${calculateTotal().toFixed(2)}</p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
            <div className="mt-6">
              <a
                href="/checkout"
                className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Checkout
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;