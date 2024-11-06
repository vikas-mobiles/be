import React, { useState } from 'react';
import { ShoppingCart, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handlePlaceOrder = () => {
    setShowOrderForm(true);
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    // Here you would typically send the order to your backend
    console.log('Order placed:', { product, ...orderDetails });
    setShowOrderForm(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-4">${product.price.toFixed(2)}</p>
        <div className="flex justify-between">
          <button
            onClick={handleAddToCart}
            className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center"
          >
            <ShoppingCart size={20} className="mr-2" /> Add to Cart
          </button>
          <button
            onClick={handlePlaceOrder}
            className="bg-green-500 text-white px-4 py-2 rounded-full flex items-center"
          >
            <CreditCard size={20} className="mr-2" /> Place Order
          </button>
        </div>
      </div>
      {showOrderForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <form onSubmit={handleOrderSubmit} className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Place Order</h2>
            <input
              type="text"
              placeholder="Name"
              required
              className="w-full mb-2 p-2 border rounded"
              value={orderDetails.name}
              onChange={(e) => setOrderDetails({ ...orderDetails, name: e.target.value })}
            />
            <input
              type="tel"
              placeholder="Phone"
              required
              className="w-full mb-2 p-2 border rounded"
              value={orderDetails.phone}
              onChange={(e) => setOrderDetails({ ...orderDetails, phone: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              required
              className="w-full mb-2 p-2 border rounded"
              value={orderDetails.email}
              onChange={(e) => setOrderDetails({ ...orderDetails, email: e.target.value })}
            />
            <textarea
              placeholder="Address (optional for delivery service)"
              className="w-full mb-4 p-2 border rounded"
              value={orderDetails.address}
              onChange={(e) => setOrderDetails({ ...orderDetails, address: e.target.value })}
            ></textarea>
            <div className="flex justify-end">
              <button type="button" onClick={() => setShowOrderForm(false)} className="mr-2 px-4 py-2 bg-gray-300 rounded">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">Submit Order</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ProductCard;