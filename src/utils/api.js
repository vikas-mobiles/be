import axios from 'axios';

const API_URL = 'https://backend-35y6.onrender.com/api';

export const getProducts = () => axios.get(`${API_URL}/products`).then(res => res.data);
export const createProduct = (productData) => axios.post(`${API_URL}/products`, productData).then(res => res.data);
export const deleteProduct = (id) => axios.delete(`${API_URL}/products/${id}`).then(res => res.data);

export const getOrders = () => axios.get(`${API_URL}/orders`).then(res => res.data);
export const createOrder = (orderData) => axios.post(`${API_URL}/orders`, orderData).then(res => res.data);
export const updateOrderStatus = (id, status) => axios.put(`${API_URL}/orders/${id}`, { status }).then(res => res.data);
export const deleteOrder = (id) => axios.delete(`${API_URL}/orders/${id}`).then(res => res.data);