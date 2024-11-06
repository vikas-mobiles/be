import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, deleteProduct, getOrders, updateOrderStatus, deleteOrder } from '../utils/api';
import { Trash2, Check, Plus, Minus } from 'lucide-react';

function AdminPage() {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    stock: '',
    image: null,
  });

  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchProducts = async () => {
    try {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const fetchedOrders = await getOrders();
      setOrders(fetchedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setNewProduct({ ...newProduct, [name]: files[0] });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (const key in newProduct) {
        formData.append(key, newProduct[key]);
      }
      await createProduct(formData);
      setNewProduct({ name: '', description: '', price: '', category: '', condition: '', stock: '', image: null });
      fetchProducts();
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteOrder(orderId);
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="mb-6">
        <button
          className={`mr-4 ${activeTab === 'products' ? 'text-blue-500 font-bold' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Manage Products
        </button>
        <button
          className={activeTab === 'orders' ? 'text-blue-500 font-bold' : ''}
          onClick={() => setActiveTab('orders')}
        >
          View Orders
        </button>
      </div>
      {activeTab === 'products' ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
          <form onSubmit={handleSubmit} className="mb-8">
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={handleInputChange}
              className="w-full mb-2 p-2 border rounded"
              required
            />
            <textarea
              name="description"
              placeholder="Product Description"
              value={newProduct.description}
              onChange={handleInputChange}
              className="w-full mb-2 p-2 border rounded"
              required
            ></textarea>
            <input
              type="number"
              name="price"
              placeholder="Price (in ₹)"
              value={newProduct.price}
              onChange={handleInputChange}
              className="w-full mb-2 p-2 border rounded"
              required
            />
            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={newProduct.stock}
              onChange={handleInputChange}
              className="w-full mb-2 p-2 border rounded"
              required
            />
            <select
              name="category"
              value={newProduct.category}
              onChange={handleInputChange}
              className="w-full mb-2 p-2 border rounded"
              required
            >
              <option value="">Select Category</option>
              <option value="phones">Phones</option>
              <option value="accessories">Accessories</option>
            </select>
            <select
              name="condition"
              value={newProduct.condition}
              onChange={handleInputChange}
              className="w-full mb-2 p-2 border rounded"
              required
            >
              <option value="">Select Condition</option>
              <option value="new">New</option>
              <option value="like-new">Like New</option>
              <option value="used">Used</option>
              <option value="refurbished">Refurbished</option>
            </select>
            <input
              type="file"
              name="image"
              onChange={handleInputChange}
              className="w-full mb-2 p-2 border rounded"
              required
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Add Product
            </button>
          </form>
          <h2 className="text-2xl font-bold mb-4">Product List</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(product => (
              <div key={product._id} className="border p-4 rounded">
                <img src={`https://backend-35y6.onrender.com/${product.image}`} alt={product.name} className="w-full h-48 object-cover mb-2" />
                <h3 className="font-bold">{product.name}</h3>
                <p className="text-gray-600">₹{parseFloat(product.price).toFixed(2)}</p>
                <p className="text-gray-600">Condition: {product.condition}</p>
                <p className="text-gray-600">Stock: {product.stock}</p>
                <p className="text-gray-600">{product.description}</p>
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  className="mt-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4">Orders</h2>
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            orders.map(order => (
              <div key={order._id} className={`border p-4 rounded mb-4 ${order.status === 'delivered' ? 'opacity-50' : ''}`}>
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Customer:</strong> {order.name}</p>
                <p><strong>Email:</strong> {order.email}</p>
                <p><strong>Phone:</strong> {order.phone}</p>
                <p><strong>Address:</strong> {order.address}</p>
                <p><strong>Total:</strong> ₹{parseFloat(order.total).toFixed(2)}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Order Time:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                <h3 className="font-bold mt-2">Products:</h3>
                <ul>
                  {order.products.map(item => (
                    <li key={item.product._id}>
                      {item.product.name} - Quantity: {item.quantity}
                    </li>
                  ))}
                </ul>
                {order.status !== 'delivered' && (
                  <button
                    onClick={() => handleUpdateOrderStatus(order._id, 'delivered')}
                    className="mt-2 bg-green-500 text-white px-4 py-2 rounded flex items-center"
                  >
                    <Check size={20} className="mr-2" />
                    Mark as Delivered
                  </button>
                )}
                <button
                  onClick={() => handleDeleteOrder(order._id)}
                  className="mt-2 bg-red-500 text-white px-4 py-2 rounded flex items-center"
                >
                  <Trash2 size={20} className="mr-2" />
                  Delete Order
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default AdminPage;