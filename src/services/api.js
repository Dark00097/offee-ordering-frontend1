import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'https://coffee-ordering-backend1-production.up.railway.app'}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    console.log(`[${config.method.toUpperCase()}] ${config.url}`, {
      withCredentials: config.withCredentials,
      headers: config.headers,
      cookies: document.cookie || 'No cookie in document.cookie',
    });
    return config;
  },
  (error) => {
    console.error('Request error:', error.message);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`[Response] ${response.config.url}: ${response.status}`);
    return response;
  },
  (error) => {
    const message = error.response?.data?.error || error.message;
    console.error(`[Error] ${error.config?.url}: ${message}`);
    return Promise.reject(error);
  }
);

// API methods
const getNotifications = (params) => api.get('/notifications', { params });
const markNotificationRead = (id) => api.put(`/notifications/${id}/read`);
const clearNotifications = () => api.put('/notifications/clear');
const getTables = () => api.get('/tables');
const getAvailableTables = () => api.get('/tables?status=available');
const addTable = (data) => api.post('/tables', data);
const updateTable = (id, data) => api.put(`/tables/${id}`, data);
const deleteTable = (id, data) => api.delete(`/tables/${id}`, { data });
const getReservations = () => api.get('/reservations');
const addReservation = (data) => api.post('/reservations', data);
const updateReservation = (id, data) => api.put(`/reservations/${id}`, data);
const submitRating = (data) => api.post('/ratings', data);
const getRatingsByItem = (itemId) => api.get(`/ratings?item_id=${itemId}`);
const getRatingsByBreakfast = (breakfastId) => api.get(`/ratings?breakfast_id=${breakfastId}`);
const updateUser = (id, data) => api.put(`/users/${id}`, data);
const deleteUser = (id, data) => api.delete(`/users/${id}`, { data });
const addCategory = (data) => api.post('/categories', data);
const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
const deleteCategory = (id, data) => api.delete(`/categories/${id}`, { data });
const getTopCategories = () => api.get('/categories/top');
const getSupplementsByMenuItem = (menuItemId) => api.get(`/menu-items/${menuItemId}/supplements`);
const addSupplementToMenuItem = (menuItemId, data) => api.post(`/menu-items/${menuItemId}/supplements`, data);
const updateSupplementForMenuItem = (menuItemId, supplementId, data) => api.put(`/menu-items/${menuItemId}/supplements/${supplementId}`, data);
const deleteSupplementFromMenuItem = (menuItemId, supplementId, data) => api.delete(`/menu-items/${menuItemId}/supplements/${supplementId}`, { data });
const addMenuItem = (data) => api.post('/menu-items', data);
const updateMenuItem = (id, data) => api.put(`/menu-items/${id}`, data);
const deleteMenuItem = (id, data) => api.delete(`/menu-items/${id}`, { data });
const searchMenuItems = (query) => api.get('/menu-items/search', { params: { query } });
const submitOrder = (data) => api.post('/orders', data);
const approveOrder = (id) => api.post(`/orders/${id}/approve`);
const getOrder = (id) => api.get(`/orders/${id}`);
const getSession = () => api.get('/session');
const getBanners = (params) => api.get('/banners', { params });
const getEnabledBanners = () => api.get('/banners/enabled');
const addBanner = (data) => api.post('/banners', data);
const updateBanner = (id, data) => api.put(`/banners/${id}`, data);
const deleteBanner = (id, data) => api.delete(`/banners/${id}`, { data });
const getBreakfasts = () => api.get('/breakfasts');
const getBreakfast = (id) => api.get(`/breakfasts/${id}`);
const getBreakfastOptions = (id) => api.get(`/breakfasts/${id}/options`);
const addBreakfast = (data) => api.post('/breakfasts', data);
const updateBreakfast = (id, data) => api.put(`/breakfasts/${id}`, data);
const deleteBreakfast = (id, data) => api.delete(`/breakfasts/${id}`, { data });
const addBreakfastOption = (id, data) => api.post(`/breakfasts/${id}/options`, data);
const deleteBreakfastOption = (breakfastId, optionId, data) => api.delete(`/breakfasts/${breakfastId}/options/${optionId}`, { data });
const getBreakfastOptionGroups = (id) => api.get(`/breakfasts/${id}/option-groups`);
const addBreakfastOptionGroup = (id, data) => api.post(`/breakfasts/${id}/option-groups`, data);
const updateBreakfastOptionGroup = (breakfastId, groupId, data) => api.put(`/breakfasts/${breakfastId}/option-groups/${groupId}`, data);
const deleteBreakfastOptionGroup = (breakfastId, groupId, data) => api.delete(`/breakfasts/${breakfastId}/option-groups/${groupId}`, { data });
const updateBreakfastOption = (breakfastId, optionId, data) => api.put(`/breakfasts/${breakfastId}/options/${optionId}`, data);

const login = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    const { user, token } = response.data;
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};

const logout = async () => {
  try {
    const response = await api.post('/logout');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return response.data;
  } catch (error) {
    console.error('Logout error:', error.response?.data || error.message);
    throw error;
  }
};

// Export all methods as a single object
export default {
  api,
  login,
  logout,
  getNotifications,
  markNotificationRead,
  clearNotifications,
  getTables,
  getAvailableTables,
  addTable,
  updateTable,
  deleteTable,
  getReservations,
  addReservation,
  updateReservation,
  submitRating,
  getRatingsByItem,
  getRatingsByBreakfast,
  updateUser,
  deleteUser,
  addCategory,
  updateCategory,
  deleteCategory,
  getTopCategories,
  getSupplementsByMenuItem,
  addSupplementToMenuItem,
  updateSupplementForMenuItem,
  deleteSupplementFromMenuItem,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  searchMenuItems,
  submitOrder,
  approveOrder,
  getOrder,
  getSession,
  getBanners,
  getEnabledBanners,
  addBanner,
  updateBanner,
  deleteBanner,
  getBreakfasts,
  getBreakfast,
  getBreakfastOptions,
  addBreakfast,
  updateBreakfast,
  deleteBreakfast,
  addBreakfastOption,
  deleteBreakfastOption,
  getBreakfastOptionGroups,
  addBreakfastOptionGroup,
  updateBreakfastOptionGroup,
  deleteBreakfastOptionGroup,
  updateBreakfastOption,
};