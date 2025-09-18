const API_BASE = '/api';

const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('authToken='))
    ?.split('=')[1];
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Bilinmeyen hata' }));
    throw new Error(error.message || response.statusText);
  }

  return response.json();
};

// Auth
export const authAPI = {
  login: (credentials: { email: string; password: string }) => apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  register: (userData: { name: string; email: string; password: string }) => apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  logout: () => {
    document.cookie = 'authToken=; Max-Age=0; path=/';
  },
};

// Pricing
export const pricingAPI = {
  compute: (config: { brand: string; model: string; speakerType: string; speakerCount?: number; tweeterCount?: number }) =>
    apiFetch('/pricing/compute', {
      method: 'POST',
      body: JSON.stringify(config),
    }),
  rules: () => apiFetch('/pricing/rules'), // Admin
  createRule: (rule: any) => apiFetch('/pricing/rules', {
    method: 'POST',
    body: JSON.stringify(rule),
  }),
  updateRule: (id: string, updates: any) => apiFetch(`/pricing/rules/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  }),
  deleteRule: (id: string) => apiFetch(`/pricing/rules/${id}`, {
    method: 'DELETE',
  }),
};

// Orders
export const ordersAPI = {
  create: (orderData: { items: any[]; shippingAddress: any; notes?: string; isGuest: boolean }) =>
    apiFetch('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),
  list: () => apiFetch('/orders'), // Admin
  updateStatus: (id: string, status: string) => apiFetch(`/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),
  getUserOrders: () => apiFetch('/orders/user'), // User orders
};

export default apiFetch;