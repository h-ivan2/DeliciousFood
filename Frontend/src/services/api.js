// delicious-food Frontend - API Centralized Service
// Supports live Express backend connectivity + stateful in-memory mock fallback (Demo Mode)

const BASE_URL = 'http://localhost:5000/api'; // Standard backend URL

// ─── STATEFUL MOCK DATA (PERSISTS FOR SESSION) ───────────────────
const mockDb = {
  stats: {
    totalRestaurants: 245,
    totalOwners: 328,
    totalCustomers: 2543,
    totalOrders: 8672,
    totalRevenue: 24560
  },
  pendingRestaurants: [
    {
      _id: 'pending_1',
      name: 'The Green Bowl',
      description: 'Healthy organic green salads and superfood bowls.',
      cuisineType: 'Healthy, Salad',
      image: '',
      status: 'pending',
      owner: { _id: 'owner_1', name: 'Sarah M.', email: 'sarah.m@greenbowl.com' },
      createdAt: '2026-05-27T12:00:00.000Z'
    },
    {
      _id: 'pending_2',
      name: 'Spice Route',
      description: 'Exotic Indian dining and traditional spice fusions.',
      cuisineType: 'Indian, Curry',
      image: '',
      status: 'pending',
      owner: { _id: 'owner_2', name: 'Priya R.', email: 'priya.r@spiceroute.com' },
      createdAt: '2026-05-27T13:30:00.000Z'
    },
    {
      _id: 'pending_3',
      name: 'Ocean Delight',
      description: 'Premium fresh seafood platters and ocean delicacies.',
      cuisineType: 'Seafood',
      image: '',
      status: 'pending',
      owner: { _id: 'owner_3', name: 'John D.', email: 'john.d@oceandelight.com' },
      createdAt: '2026-05-27T14:15:00.000Z'
    }
  ],
  approvedRestaurants: [
    { _id: 'app_1', name: 'Pizza Point', rating: '4.7', reviews: '210', orders: 987, revenue: 2980, cuisines: 'Pizza, Italian' },
    { _id: 'app_2', name: 'Burger House', rating: '4.9', reviews: '160', orders: 876, revenue: 2340, cuisines: 'Burgers, American' }
  ],
  users: [
    { _id: 'u_1', name: 'Super Admin', email: 'admin@delicious.com', role: 'admin', isActive: true },
    { _id: 'u_2', name: 'Sarah M.', email: 'sarah.m@greenbowl.com', role: 'owner', isActive: true },
    { _id: 'u_3', name: 'Priya R.', email: 'priya.r@spiceroute.com', role: 'owner', isActive: true },
    { _id: 'u_4', name: 'James K.', email: 'james.k@gmail.com', role: 'customer', isActive: true },
    { _id: 'u_5', name: 'Emma Watson', email: 'emma@gmail.com', role: 'customer', isActive: false },
    { _id: 'u_6', name: 'Chef Gordon', email: 'gordon@ramsay.com', role: 'owner', isActive: true }
  ],
  activities: [
    { id: 'act_1', text: 'New Restaurant "The Green Bowl" is pending Approval', type: 'pending', time: '2 min ago' },
    { id: 'act_2', text: 'Menu updated for "Burger House"', type: 'update', time: '8 min ago' },
    { id: 'act_3', text: 'Menu updated for "Spice Route"', type: 'update', time: '15 min ago' },
    { id: 'act_4', text: 'Restaurant "Pizza Point" approved', type: 'approval', time: '25 min ago' }
  ]
};

// LocalStorage helpers to persist across page reloads (in Demo Mode)
const getPersistedData = (key, defaultVal) => {
  const data = localStorage.getItem(`df_mock_${key}`);
  return data ? JSON.parse(data) : defaultVal;
};

const setPersistedData = (key, val) => {
  localStorage.setItem(`df_mock_${key}`, JSON.stringify(val));
};

// Initialize DB with persisted local data if available
const loadDb = () => {
  return {
    stats: getPersistedData('stats', mockDb.stats),
    pendingRestaurants: getPersistedData('pendingRestaurants', mockDb.pendingRestaurants),
    approvedRestaurants: getPersistedData('approvedRestaurants', mockDb.approvedRestaurants),
    users: getPersistedData('users', mockDb.users),
    activities: getPersistedData('activities', mockDb.activities)
  };
};

// Write changes back to LocalStorage
const saveDb = (db) => {
  setPersistedData('stats', db.stats);
  setPersistedData('pendingRestaurants', db.pendingRestaurants);
  setPersistedData('approvedRestaurants', db.approvedRestaurants);
  setPersistedData('users', db.users);
  setPersistedData('activities', db.activities);
};

// ─── AUTH TOKEN HELPERS ──────────────────────────────────────────
export const getAuthHeaders = () => {
  const token = localStorage.getItem('df_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

// ─── CENTRALIZED API REQUESTS ────────────────────────────────────
async function apiRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.warn(`[api.js] live connection failed for ${endpoint}. Falling back to Demo Mode:`, err.message);
    throw err; // Allow fallback handlers to catch
  }
}

// ─── EXPORTED API METHODS ────────────────────────────────────────

// 1. Authentication
export const authService = {
  login: async (email, password) => {
    try {
      const res = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      if (res.token) {
        localStorage.setItem('df_token', res.token);
        localStorage.setItem('df_user', JSON.stringify(res.data || res.user));
      }
      return res;
    } catch (err) {
      // Mock Login Fallback
      const db = loadDb();
      const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (user && password) {
        const mockResponse = {
          success: true,
          token: 'mock_token_jwt_super_admin',
          user: user
        };
        localStorage.setItem('df_token', mockResponse.token);
        localStorage.setItem('df_user', JSON.stringify(mockResponse.user));
        return mockResponse;
      }
      throw new Error('Invalid credentials. (In Demo Mode, try: admin@delicious.com)');
    }
  },
  
  logout: () => {
    localStorage.removeItem('df_token');
    localStorage.removeItem('df_user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('df_user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

// 2. Super Admin Panel Services
export const adminService = {
  // Get platform-wide overview statistics
  getStats: async () => {
    try {
      const res = await apiRequest('/admin/stats');
      return res.data;
    } catch (err) {
      // Mock Fallback
      const db = loadDb();
      return db.stats;
    }
  },

  // Get pending restaurants for approval
  getPendingRestaurants: async () => {
    try {
      const res = await apiRequest('/admin/restaurants/pending');
      return res.data;
    } catch (err) {
      // Mock Fallback
      const db = loadDb();
      return db.pendingRestaurants;
    }
  },

  // Approve or reject restaurant
  approveRestaurant: async (id, status, adminNotes = '') => {
    try {
      const res = await apiRequest(`/admin/restaurants/${id}/approval`, {
        method: 'PATCH',
        body: JSON.stringify({ status, adminNotes })
      });
      return res.data;
    } catch (err) {
      // Mock Fallback
      const db = loadDb();
      const idx = db.pendingRestaurants.findIndex(r => r._id === id);
      if (idx !== -1) {
        const removed = db.pendingRestaurants[idx];
        db.pendingRestaurants.splice(idx, 1);
        
        if (status === 'approved') {
          // Increment stats
          db.stats.totalRestaurants += 1;
          db.approvedRestaurants.push({
            _id: removed._id,
            name: removed.name,
            rating: '5.0',
            reviews: '0',
            orders: 0,
            revenue: 0,
            cuisines: removed.cuisineType
          });
          db.activities.unshift({
            id: `act_${Date.now()}`,
            text: `Restaurant "${removed.name}" approved`,
            type: 'approval',
            time: 'Just now'
          });
        } else {
          db.activities.unshift({
            id: `act_${Date.now()}`,
            text: `Restaurant "${removed.name}" rejected. Notes: ${adminNotes}`,
            type: 'rejection',
            time: 'Just now'
          });
        }
        
        saveDb(db);
        return { ...removed, status, adminNotes };
      }
      throw new Error('Restaurant not found in pending list');
    }
  },

  // Get all users
  getUsers: async (search = '', role = '') => {
    try {
      let query = `?search=${encodeURIComponent(search)}`;
      if (role) query += `&role=${role}`;
      const res = await apiRequest(`/admin/users${query}`);
      return res.data;
    } catch (err) {
      // Mock Fallback
      const db = loadDb();
      let filtered = [...db.users];
      if (role) {
        filtered = filtered.filter(u => u.role === role);
      }
      if (search) {
        const term = search.toLowerCase();
        filtered = filtered.filter(u => 
          u.name.toLowerCase().includes(term) || 
          u.email.toLowerCase().includes(term)
        );
      }
      return filtered;
    }
  },

  // Update user role or active status
  updateUser: async (id, fields) => {
    try {
      const res = await apiRequest(`/admin/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(fields)
      });
      return res.data;
    } catch (err) {
      // Mock Fallback
      const db = loadDb();
      const idx = db.users.findIndex(u => u._id === id);
      if (idx !== -1) {
        db.users[idx] = { ...db.users[idx], ...fields };
        
        // Track stats changes if user role toggled
        let ownersCount = db.users.filter(u => u.role === 'owner').length;
        let customersCount = db.users.filter(u => u.role === 'customer').length;
        db.stats.totalOwners = 328 + (ownersCount - 3); // relative to base screenshot stats
        db.stats.totalCustomers = 2543 + (customersCount - 2);

        saveDb(db);
        return db.users[idx];
      }
      throw new Error('User not found');
    }
  },

  // Delete user
  deleteUser: async (id) => {
    try {
      await apiRequest(`/admin/users/${id}`, { method: 'DELETE' });
      return true;
    } catch (err) {
      // Mock Fallback
      const db = loadDb();
      const idx = db.users.findIndex(u => u._id === id);
      if (idx !== -1) {
        const deleted = db.users[idx];
        db.users.splice(idx, 1);
        
        db.stats.totalUsers = db.users.length + 2800; // Keep scale aligned

        db.activities.unshift({
          id: `act_${Date.now()}`,
          text: `User "${deleted.name}" (${deleted.role}) deleted`,
          type: 'deletion',
          time: 'Just now'
        });
        
        saveDb(db);
        return true;
      }
      throw new Error('User not found');
    }
  },

  // Get recent activities list
  getRecentActivities: async () => {
    const db = loadDb();
    return db.activities;
  }
};
