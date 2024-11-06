import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';
import { createOrder } from '../utils/api';

function CartPage() {
  const { cart, updateCartItemQuantity, removeFromCart, clearCart } = useCart();
  const [orderDetails, setOrderDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    additionalInfo: ''
  });
  const [showOrderForm, setShowOrderForm] = useState(false);

  const handleInputChange = (e) => {
    setOrderDetails({ ...orderDetails, [e.target.name]: e.target.value });
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    try {
      const total = calculateTotal();
      if (isNaN(total) || total <= 0) {
        throw new Error('Invalid total amount');
      }

      const orderData = {
        products: cart.map(item => ({ product: item._id, quantity: item.quantity })),
        total: total,
        ...orderDetails
      };
      console.log('Sending order data:', orderData);
      const response = await createOrder(orderData);
      console.log('Order response:', response);
      clearCart();
      setShowOrderForm(false);
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map(item => (
            <div key={item._id} className="flex items-center justify-between border-b py-4">
              <div className="flex items-center">
                <img src={`https://backend-35y6.onrender.com/${item.image}`} alt={item.name} className="w-16 h-16 object-cover mr-4" />
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">₹{parseFloat(item.price).toFixed(2)}</p>
                  <p className="text-gray-600">Condition: {item.condition}</p>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => updateCartItemQuantity(item._id, item.quantity - 1)}
                  className="text-gray-500 hover:text-gray-700 mr-2"
                  disabled={item.quantity <= 1}
                >
                  <Minus size={20} />
                </button>
                <span className="mx-2">{item.quantity}</span>
                <button
                  onClick={() => updateCartItemQuantity(item._id, item.quantity + 1)}
                  className="text-gray-500 hover:text-gray-700 ml-2"
                  disabled={item.quantity >= item.stock}
                >
                  <Plus size={20} />
                </button>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500 hover:text-red-700 ml-4"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
          <div className="mt-6 flex justify-between items-center">
            <p className="text-xl font-bold">Total: ₹{calculateTotal().toFixed(2)}</p>
            <button
              onClick={() => setShowOrderForm(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-full"
            >
              Place Order
            </button>
          </div>
        </>
      )}
      {showOrderForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <form onSubmit={handlePlaceOrder} className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              className="w-full mb-2 p-2 border rounded"
              value={orderDetails.name}
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full mb-2 p-2 border rounded"
              value={orderDetails.email}
              onChange={handleInputChange}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              required
              className="w-full mb-2 p-2 border rounded"
              value={orderDetails.phone}
              onChange={handleInputChange}
            />
            <textarea
              name="address"
              placeholder="Address"
              required
              className="w-full mb-2 p-2 border rounded"
              value={orderDetails.address}
              onChange={handleInputChange}
            ></textarea>
            <textarea
              name="additionalInfo"
              placeholder="Additional Information"
              className="w-full mb-4 p-2 border rounded"
              value={orderDetails.additionalInfo}
              onChange={handleInputChange}
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

export default CartPage;