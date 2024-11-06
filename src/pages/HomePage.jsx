import React, { useState, useEffect } from 'react';
import { getProducts } from '../utils/api';
import { useCart } from '../context/CartContext';
import { createOrder } from '../utils/api';

function HomePage() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderDetails, setOrderDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    additionalInfo: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleInputChange = (e) => {
    setOrderDetails({ ...orderDetails, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    try {
      const orderData = {
        products: [{ product: selectedProduct._id, quantity: 1 }],
        total: parseFloat(selectedProduct.price),
        ...orderDetails
      };
      console.log('Sending order data:', orderData);
      const response = await createOrder(orderData);
      console.log('Order response:', response);
      setShowOrderForm(false);
      setSelectedProduct(null);
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
      <h1 className="text-3xl font-bold mb-6">Our Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product._id} className="border rounded-lg p-4 shadow-md">
            <img 
              src={`https://backend-35y6.onrender.com/${product.image}`} 
              alt={product.name} 
              className="w-full h-48 object-cover mb-4 rounded"
            />
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-2">{product.description}</p>
            <p className="text-lg font-bold mb-2">₹{parseFloat(product.price).toFixed(2)}</p>
            <p className="text-sm text-gray-500 mb-2">Condition: {product.condition}</p>
            <p className="text-sm text-gray-500 mb-4">In Stock: {product.stock}</p>
            <div className="flex justify-between">
              <button 
                onClick={() => addToCart(product)} 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Add to Cart
              </button>
              <button 
                onClick={() => {
                  setSelectedProduct(product);
                  setShowOrderForm(true);
                }} 
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
              >
                Place Order
              </button>
            </div>
          </div>
        ))}
      </div>
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

export default HomePage;