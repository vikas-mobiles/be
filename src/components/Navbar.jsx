import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ADMIN_URL } from '../config/constants';

function Navbar() {
  const { cart } = useCart();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-800">Vikas Mobiles</span>
            </Link>
          </div>
          <div className="flex items-center">
            <Link to="/cart" className="p-2 rounded-md text-gray-400 hover:text-gray-500 relative">
              <ShoppingCart className="h-6 w-6" />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>
            <Link to={ADMIN_URL} className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;