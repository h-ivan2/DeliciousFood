import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Logo, ThemeToggle, Icons } from '../components/ui';
import {
  LayoutDashboard,
  Utensils,
  Store,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trash2,
  Edit3,
  Server,
  Database,
  HardDrive,
  Activity,
  ChevronDown,
  PlusCircle,
  UserCheck,
  UserX
} from 'lucide-react';
import { adminService, authService } from '../services/api';
import {
  IMG_HERO_BG,
  IMG_REST_GREEN_BOWL,
  IMG_REST_SPICE_ROUTE,
  IMG_REST_PIZZA_POINT,
  IMG_REST_BURGER_HOUSE,
  IMG_REST_OCEAN_DELIGHT,
  IMG_PROMO_CARD,
  IMG_FOOD_ACCENT
} from '../constants/images';

export default function AdminDashboard() {
  const { dark } = useTheme();
  const navigate = useNavigate();

  // Navigation state: 'dashboard' | 'approve' | 'users' | 'reports' | 'settings'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(null);

  // Core data states
  const [stats, setStats] = useState(null);
  const [pendingRestaurants, setPendingRestaurants] = useState([]);
  const [users, setUsers] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  // Filter & Search states (Users tab)
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');

  // UI state managers
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Load user and data on mount
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      const token = localStorage.getItem('df_token');
      if (!token) {
        navigate('/login');
        return;
      }
    }
    setCurrentUser(user || { name: 'Super Admin', email: 'admin@delicious.com', role: 'admin' });
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [sData, pData, uData, aData] = await Promise.all([
        adminService.getStats(),
        adminService.getPendingRestaurants(),
        adminService.getUsers(userSearch, userRoleFilter),
        adminService.getRecentActivities()
      ]);
      setStats(sData);
      setPendingRestaurants(pData);
      setUsers(uData);
      setRecentActivities(aData);
    } catch (err) {
      addToast('Error loading data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Reload users when query filters change
  useEffect(() => {
    if (activeTab === 'users') {
      adminService.getUsers(userSearch, userRoleFilter)
        .then(setUsers)
        .catch(() => addToast('Error searching users', 'error'));
    }
  }, [userSearch, userRoleFilter, activeTab]);

  // Centralized Toast system
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // ─── ADMIN ACTIONS ──────────────────────────────────────────────

  const handleApprove = async (id, name) => {
    try {
      await adminService.approveRestaurant(id, 'approved');
      addToast(`Restaurant "${name}" approved successfully!`);
      setPendingRestaurants(prev => prev.filter(r => r._id !== id));
      const updatedStats = await adminService.getStats();
      const updatedLogs = await adminService.getRecentActivities();
      setStats(updatedStats);
      setRecentActivities(updatedLogs);
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const openRejectionModal = (id) => {
    setRejectingId(id);
    setRejectionNotes('');
  };

  const handleReject = async () => {
    if (!rejectingId) return;
    try {
      const rest = pendingRestaurants.find(r => r._id === rejectingId);
      await adminService.approveRestaurant(rejectingId, 'rejected', rejectionNotes);
      addToast(`Restaurant "${rest?.name}" rejected.`);
      setPendingRestaurants(prev => prev.filter(r => r._id !== rejectingId));
      const updatedLogs = await adminService.getRecentActivities();
      setRecentActivities(updatedLogs);
      setRejectingId(null);
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateUser(userId, { role: newRole });
      addToast('User role updated successfully');
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
      const updatedStats = await adminService.getStats();
      setStats(updatedStats);
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleToggleActive = async (userId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await adminService.updateUser(userId, { isActive: newStatus });
      addToast(newStatus ? 'User account activated' : 'User account deactivated');
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isActive: newStatus } : u));
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDeleteUser = async () => {
    if (!confirmDeleteId) return;
    try {
      await adminService.deleteUser(confirmDeleteId);
      addToast('User deleted successfully');
      setUsers(prev => prev.filter(u => u._id !== confirmDeleteId));
      const updatedStats = await adminService.getStats();
      const updatedLogs = await adminService.getRecentActivities();
      setStats(updatedStats);
      setRecentActivities(updatedLogs);
      setConfirmDeleteId(null);
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // ─── STYLING CALCULATIONS ───────────────────────────────────────
  const bg = dark ? '#070B14' : '#f8f5f0';
  const sidebarBg = dark ? '#0a0d16' : '#ffffff';
  const cardBg = dark ? '#0F1524' : '#ffffff';
  const textTitle = dark ? '#ffffff' : '#1a1a1a';
  const textSub = dark ? 'rgba(255,255,255,0.6)' : '#666';
  const borderCol = dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
  const inputBg = dark ? 'rgba(255,255,255,0.05)' : '#f3f4f6';
  const inputBorder = dark ? 'rgba(255,255,255,0.1)' : '#e5e7eb';
  const inputColor = dark ? '#ffffff' : '#1f2937';

  if (loading && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-6" style={{ background: bg }}>
        <div className="w-16 h-16 rounded-full border-4 border-accent border-t-transparent animate-spin" style={{ borderColor: '#F5B301' }}></div>
        <p className="font-bold text-sm tracking-wide" style={{ color: textSub }}>Loading platform settings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex font-body" style={{ background: bg, color: textTitle }}>
      
      {/* ─── TOAST NOTIFICATIONS ─────────────────────────────────────── */}
      <div className="fixed top-8 right-8 z-50 flex flex-col gap-4">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="rounded-2xl p-5 flex items-center gap-4 shadow-xl border backdrop-blur-md max-w-sm"
              style={{
                background: dark ? 'rgba(15,21,36,0.92)' : 'rgba(255,255,255,0.96)',
                borderColor: t.type === 'error' ? '#ef4444' : '#F5B301',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
              }}
            >
              {t.type === 'error' ? (
                <XCircle size={20} color="#ef4444" className="flex-shrink-0" />
              ) : (
                <CheckCircle2 size={20} color="#F5B301" className="flex-shrink-0" />
              )}
              <span className="text-sm font-semibold leading-relaxed text-inherit">{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ─── LEFT SIDEBAR (ULTRA SPACIOUS & PRECISE) ───────────────────── */}
      <aside
        className="hidden lg:flex flex-col w-[300px] flex-shrink-0 border-r"
        style={{ background: sidebarBg, borderColor: borderCol }}
      >
        <div className="p-8 pb-4">
          <Logo size="md" onClick={() => navigate('/')} />
        </div>

        {/* Navigation Tabs (Airy margins) */}
        <nav className="flex-1 px-6 flex flex-col gap-3 mt-10">
          {[
            { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
            { id: 'approve', label: 'Approve Restaurants', Icon: Utensils, badge: pendingRestaurants.length },
            { id: 'users', label: 'All Restaurants & Users', Icon: Users },
            { id: 'reports', label: 'Reports', Icon: BarChart3 },
            { id: 'settings', label: 'Settings', Icon: Settings },
          ].map(({ id, label, Icon, badge }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all duration-200 border-none outline-none cursor-pointer text-left"
                style={{
                  background: active ? 'rgba(245,179,1,0.1)' : 'transparent',
                  color: active ? '#F5B301' : textSub,
                  borderLeft: active ? '4px solid #F5B301' : '4px solid transparent',
                }}
              >
                <Icon size={18} className="flex-shrink-0" />
                <span className="flex-1 truncate">{label}</span>
                {badge > 0 && (
                  <span className="text-[10px] font-black text-white px-2.5 py-0.5 rounded-full bg-red-500 animate-pulse">
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Promotional Side Banner */}
        <div className="p-6 mx-6 mb-8 rounded-2xl relative overflow-hidden flex flex-col justify-end min-h-[200px] shadow-md border" style={{ borderColor: borderCol }}>
          <img
            src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80"
            alt="Fried Chicken Promotion"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
          <div className="relative z-20">
            <h4 className="text-white font-extrabold text-sm leading-tight mb-1">Delicious food</h4>
            <p className="text-white/70 text-[10px] leading-snug mb-4">Makes every moment special!</p>
            <button
              onClick={() => setActiveTab('approve')}
              className="px-4 py-2 rounded-full font-bold text-[10px] border-none cursor-pointer shadow-sm hover:scale-105 transition-all"
              style={{ background: '#F5B301', color: '#000' }}
            >
              Explore Now
            </button>
          </div>
        </div>

        {/* Logout bottom */}
        <div className="p-6 border-t" style={{ borderColor: borderCol }}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm text-red-500 hover:bg-red-500/10 cursor-pointer border-none bg-transparent transition-all duration-200 text-left"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA (MAX PADDING) ──────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-y-auto px-10 lg:px-16 py-12 relative">
        
        {/* ─── HEADER ────────────────────────────────────────────────── */}
        <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-12 pb-10 border-b" style={{ borderColor: borderCol }}>
          <div>
            <div className="flex items-center gap-4 flex-wrap">
              <h1 className="font-display font-black text-3xl lg:text-4xl tracking-tight leading-none">
                👋 Welcome back, {currentUser?.name || 'Super Admin'}!
              </h1>
              <span className="text-xs font-black uppercase tracking-widest px-3.5 py-1 rounded-full text-accent" style={{ background: 'rgba(245,179,1,0.08)', border: '1px solid rgba(245,179,1,0.3)', color: '#F5B301' }}>
                SUPER ADMIN
              </span>
            </div>
            <p className="text-sm mt-3 font-semibold" style={{ color: textSub }}>Here's what's happening on your platform today.</p>
          </div>

          <div className="flex items-center gap-6 flex-wrap">
            {/* Search Input Bar (Spacious) */}
            <div className="relative w-full sm:w-80">
              <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: textSub }}>
                <Search size={18} />
              </span>
              <input
                type="text"
                placeholder="Search for restaurants, users, order..."
                className="w-full text-xs rounded-full py-4 pl-12 pr-4 outline-none border transition-all duration-200"
                style={{
                  background: inputBg,
                  borderColor: inputBorder,
                  color: inputColor,
                }}
                onFocus={(e) => e.target.style.borderColor = '#F5B301'}
                onBlur={(e) => e.target.style.borderColor = inputBorder}
              />
            </div>

            {/* Theme Toggle & Notifications */}
            <ThemeToggle />

            <div className="relative">
              <button
                className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all hover:bg-opacity-10"
                style={{ background: inputBg, color: textTitle, border: `1px solid ${borderCol}` }}
              >
                <Bell size={18} />
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
              </button>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(p => !p)}
                className="flex items-center gap-3.5 cursor-pointer border-none bg-transparent text-left"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden bg-accent flex items-center justify-center text-black font-black text-sm animate-pulse">
                  SA
                </div>
                <div className="hidden sm:block">
                  <div className="font-bold text-xs leading-snug">{currentUser?.name}</div>
                  <div className="text-[10px] leading-tight" style={{ color: textSub }}>Administrator</div>
                </div>
                <ChevronDown size={14} style={{ color: textSub }} />
              </button>

              <AnimatePresence>
                {showProfileDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-4 w-60 rounded-3xl shadow-2xl border p-4 z-50"
                    style={{ background: cardBg, borderColor: borderCol }}
                  >
                    <div className="px-4 py-3 border-b text-xs mb-2" style={{ borderColor: borderCol }}>
                      <div className="font-bold truncate">{currentUser?.email}</div>
                    </div>
                    <button
                      onClick={() => { setShowProfileDropdown(false); setActiveTab('settings'); }}
                      className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-left border-none bg-transparent hover:bg-accent/10 hover:text-accent font-bold text-xs cursor-pointer"
                    >
                      <Settings size={14} /> Profile Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-left border-none bg-transparent text-red-500 hover:bg-red-500/10 font-bold text-xs cursor-pointer"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* ─── DYNAMIC TAB RENDERING ──────────────────────────────────── */}
        <AnimatePresence mode="wait">
          
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-10"
            >
              {/* 5 Stats Cards Row (Increased gaps & padding: gap-8, p-8) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                {[
                  { label: 'Total Restaurants', value: stats?.totalRestaurants, Icon: Store, change: '+12% this week', color: '#F5B301' },
                  { label: 'Total Owners', value: stats?.totalOwners, Icon: Users, change: '+16% this week', color: '#22c55e' },
                  { label: 'Total Customers', value: stats?.totalCustomers, Icon: Users, change: '+14% this week', color: '#3b82f6' },
                  { label: 'Total Orders', value: stats?.totalOrders, Icon: Utensils, change: '+21% this week', color: '#a855f7' },
                  { label: 'Total Revenues', value: `$${stats?.totalRevenue.toLocaleString()}`, Icon: BarChart3, change: '+12% this week', color: '#f43f5e' },
                ].map(({ label, value, Icon, change, color }) => (
                  <motion.div
                    key={label}
                    whileHover={{ y: -6, boxShadow: `0 24px 48px rgba(${dark ? '0,0,0,0.6' : '0,0,0,0.1'})` }}
                    className="rounded-3xl p-8 border flex flex-col justify-between min-h-[140px] transition-shadow duration-300"
                    style={{ background: cardBg, borderColor: borderCol }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                        <Icon size={22} color={color} />
                      </div>
                      <span className="text-[10px] font-black text-green-500 flex items-center gap-0.5">
                        ▲ {change.split(' ')[0]}
                      </span>
                    </div>
                    <div className="mt-6">
                      <div className="text-3xl lg:text-4xl font-black leading-none tracking-tight">{value}</div>
                      <div className="text-[10px] mt-2 uppercase font-black tracking-widest text-inherit opacity-60">{label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* HD Food Skewer Hero Banner */}
              <div className="relative rounded-3xl overflow-hidden h-[240px] lg:h-[300px] shadow-xl border" style={{ borderColor: borderCol }}>
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?w=1600&q=80"
                  alt="Delicious food showcase"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-transparent flex flex-col justify-center px-12 lg:px-20">
                  <span className="inline-flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-accent mb-4 px-4.5 py-2 rounded-full bg-accent/20 border border-accent/40 w-fit" style={{ color: '#F5B301' }}>
                    🍽 Premium Food Operations
                  </span>
                  <h2 className="text-white text-2xl lg:text-4xl font-black leading-tight max-w-lg tracking-tight">
                    Delighting Customers,<br />Empowering Restaurant Owners.
                  </h2>
                  <p className="text-white/60 text-xs mt-4 max-w-sm leading-relaxed">Manage pending submissions, control roles, and review platform audits with space and ease.</p>
                </div>
              </div>

              {/* 3 Middle Chart Cards Grid (gap-8, p-8) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* 1. Recent Registrations */}
                <div className="rounded-3xl p-8 border flex flex-col shadow-md" style={{ background: cardBg, borderColor: borderCol }}>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="font-black text-base lg:text-lg leading-tight">Recent Registrations</h3>
                      <p className="text-[11px] mt-1" style={{ color: textSub }}>Pending approvals in pipeline</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('approve')}
                      className="px-4 py-2 rounded-full text-[10px] font-bold border cursor-pointer hover:bg-accent hover:text-black transition-all"
                      style={{ borderColor: '#F5B301', color: '#F5B301', background: 'transparent' }}
                    >
                      View All
                    </button>
                  </div>
                  
                  <div className="flex-1 flex flex-col gap-5">
                    {pendingRestaurants.slice(0, 5).concat([
                      { _id: 'stat_p1', name: 'Pizza Point', owner: { name: 'Mario' }, createdAt: '15 min ago', status: 'approved' },
                      { _id: 'stat_p2', name: 'Burger House', owner: { name: 'Dan' }, createdAt: '25 min ago', status: 'approved' },
                      { _id: 'stat_p3', name: 'Ocean Delight', owner: { name: 'John' }, createdAt: '40 min ago', status: 'rejected' },
                    ].slice(0, Math.max(0, 5 - pendingRestaurants.length))).map(rest => {
                      const isPending = rest.status === 'pending';
                      const isApproved = rest.status === 'approved';
                      
                      return (
                        <div key={rest._id} className="flex items-center justify-between py-4 border-b" style={{ borderColor: borderCol }}>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-accent/15 flex items-center justify-center text-base">
                              🍔
                            </div>
                            <div>
                              <div className="font-black text-xs leading-snug">{rest.name}</div>
                              <div className="text-[10px] mt-1 opacity-70" style={{ color: textSub }}>
                                Owner: {rest.owner?.name} • {rest.createdAt.includes('T') ? 'Today' : rest.createdAt}
                              </div>
                            </div>
                          </div>
                          <span
                            className="text-[9px] font-bold uppercase px-3 py-1.5 rounded-full"
                            style={{
                              background: isPending ? 'rgba(245,179,1,0.12)' : isApproved ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                              color: isPending ? '#F5B301' : isApproved ? '#22c55e' : '#ef4444',
                              border: `1px solid ${isPending ? 'rgba(245,179,1,0.3)' : isApproved ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`
                            }}
                          >
                            {rest.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. SVG Area Chart (Weekly Orders) */}
                <div className="rounded-3xl p-8 border flex flex-col shadow-md" style={{ background: cardBg, borderColor: borderCol }}>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="font-black text-base lg:text-lg leading-tight">Orders Overview</h3>
                      <p className="text-[11px] mt-1" style={{ color: textSub }}>Daily order transaction trends</p>
                    </div>
                    <select className="text-[10px] font-bold rounded-lg px-3 py-2 outline-none border cursor-pointer" style={{ background: inputBg, borderColor: borderCol }}>
                      <option>This week</option>
                      <option>Last month</option>
                    </select>
                  </div>

                  {/* SVG Area Chart */}
                  <div className="flex-1 flex flex-col justify-end min-h-[180px] pt-4 relative">
                    <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible z-10">
                      <defs>
                        <linearGradient id="orderGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#F5B301" stopOpacity="0.45" />
                          <stop offset="100%" stopColor="#F5B301" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <line x1="0" y1="20" x2="200" y2="20" stroke={borderCol} strokeWidth="0.5" strokeDasharray="3" />
                      <line x1="0" y1="50" x2="200" y2="50" stroke={borderCol} strokeWidth="0.5" strokeDasharray="3" />
                      <line x1="0" y1="80" x2="200" y2="80" stroke={borderCol} strokeWidth="0.5" strokeDasharray="3" />

                      <path
                        d="M 0 90 L 15 75 Q 30 50 45 68 T 75 40 T 105 85 T 135 30 T 165 24 T 200 65 L 200 90 Z"
                        fill="url(#orderGrad)"
                      />
                      <path
                        d="M 0 90 L 15 75 Q 30 50 45 68 T 75 40 T 105 85 T 135 30 T 165 24 T 200 65"
                        fill="none"
                        stroke="#F5B301"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      
                      <circle cx="135" cy="30" r="4.5" fill="#F5B301" stroke={cardBg} strokeWidth="1.5" />
                      <circle cx="165" cy="24" r="4.5" fill="#F5B301" stroke={cardBg} strokeWidth="1.5" />
                    </svg>
                    
                    <div className="flex justify-between mt-5 text-[9px] font-black uppercase tracking-widest opacity-60" style={{ color: textSub }}>
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span>Sun</span>
                    </div>
                  </div>
                </div>

                {/* 3. Doughnut Chart (Registration Status) */}
                <div className="rounded-3xl p-8 border flex flex-col shadow-md" style={{ background: cardBg, borderColor: borderCol }}>
                  <div>
                    <h3 className="font-black text-base lg:text-lg leading-tight">Registration Status</h3>
                    <p className="text-[11px] mt-1" style={{ color: textSub }}>Platform onboarding diagnostics</p>
                  </div>

                  <div className="flex-1 grid grid-cols-2 gap-8 items-center mt-6">
                    <div className="relative flex items-center justify-center">
                      <svg width="130" height="130" viewBox="0 0 36 36" className="w-[130px] h-[130px]">
                        <circle cx="18" cy="18" r="15.91" fill="none" stroke={borderCol} strokeWidth="2.8" />
                        <circle cx="18" cy="18" r="15.91" fill="none" stroke="#22c55e" strokeWidth="3"
                          strokeDasharray="75 25" strokeDashoffset="25" />
                        <circle cx="18" cy="18" r="15.91" fill="none" stroke="#F5B301" strokeWidth="3.2"
                          strokeDasharray="15 85" strokeDashoffset="-50" />
                        <circle cx="18" cy="18" r="15.91" fill="none" stroke="#ef4444" strokeWidth="3.2"
                          strokeDasharray="10 90" strokeDashoffset="-65" />
                      </svg>
                      <div className="absolute text-center">
                        <div className="text-2xl font-black leading-none">245</div>
                        <div className="text-[8px] font-black uppercase tracking-widest mt-1 opacity-65" style={{ color: textSub }}>Total</div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      {[
                        { label: 'Pending', count: 18, color: '#F5B301' },
                        { label: 'Approved', count: 198, color: '#22c55e' },
                        { label: 'Rejected', count: 29, color: '#ef4444' }
                      ].map(({ label, count, color }) => (
                        <div key={label} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full" style={{ background: color }}></span>
                            <span className="font-semibold text-inherit opacity-75">{label}</span>
                          </div>
                          <span className="font-extrabold">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Operational Grid (gap-8, p-8) */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* Left Side Combinator */}
                <div className="lg:col-span-3 flex flex-col gap-10">
                  
                  {/* Top Performing Restaurants Row (Spacious columns gap-8) */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-black text-base lg:text-lg leading-tight">Top performing Restaurants</h3>
                      <button
                        onClick={() => setActiveTab('users')}
                        className="text-xs font-black hover:underline"
                        style={{ color: '#F5B301' }}
                      >
                        View All
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
                      {[
                        { name: 'The Green Bowl', rating: '4.8', reviews: '230', orders: '1,246', revenue: '$4,230', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&q=80' },
                        { name: 'Spice Route', rating: '4.6', reviews: '180', orders: '1,034', revenue: '$3,560', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&q=80' },
                        { name: 'Pizza Point', rating: '4.7', reviews: '210', orders: '987', revenue: '$2,980', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&q=80' },
                        { name: 'Burger House', rating: '4.9', reviews: '160', orders: '876', revenue: '$2,340', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80' }
                      ].map(r => (
                        <div key={r.name} className="rounded-3xl border overflow-hidden flex flex-col shadow-sm" style={{ background: cardBg, borderColor: borderCol }}>
                          <div className="h-36 relative">
                            <img src={r.img} alt={r.name} className="w-full h-full object-cover" />
                            <div className="absolute top-3.5 right-3.5 bg-black/85 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9px] font-black text-amber-400">
                              ★ {r.rating}
                            </div>
                          </div>
                          <div className="p-5">
                            <h4 className="font-extrabold text-xs truncate leading-snug">{r.name}</h4>
                            <div className="flex justify-between items-center mt-3.5 text-[10px] font-black">
                              <span style={{ color: textSub }}>{r.orders} Orders</span>
                              <span style={{ color: '#F5B301' }}>{r.revenue} Rev</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Promo Banner + Logs Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Horizontal Promo Banner */}
                    <div className="rounded-3xl p-8 border relative overflow-hidden flex flex-col justify-end min-h-[180px] shadow-md" style={{ borderColor: borderCol }}>
                      <img src="https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80" alt="BBQ Wings promo" className="absolute inset-0 w-full h-full object-cover z-0" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent z-10" />
                      <div className="relative z-20">
                        <h4 className="text-white font-extrabold text-sm mb-1">Food that brings people together</h4>
                        <p className="text-white/60 text-[10px] mb-4">Great taste, happy life</p>
                        <button
                          onClick={() => setActiveTab('approve')}
                          className="px-4.5 py-2.5 rounded-full text-[9px] font-black border-none cursor-pointer hover:scale-105 transition-all shadow-md"
                          style={{ background: '#F5B301', color: '#000' }}
                        >
                          Explore Restaurants
                        </button>
                      </div>
                    </div>

                    {/* Recent Activities Logs */}
                    <div className="rounded-3xl p-8 border flex flex-col justify-between shadow-md" style={{ background: cardBg, borderColor: borderCol }}>
                      <div className="flex items-center justify-between mb-5">
                        <h4 className="font-black text-xs uppercase tracking-widest text-inherit opacity-60">Recent Activities</h4>
                        <button className="text-[10px] font-black text-accent hover:underline" style={{ color: '#F5B301' }}>View All</button>
                      </div>

                      <div className="flex flex-col gap-4">
                        {recentActivities.slice(0, 4).map(act => (
                          <div key={act.id} className="flex items-start gap-4 text-xs py-1.5">
                            <span className="text-[10px] mt-0.5 flex-shrink-0">
                              {act.type === 'pending' ? '🔔' : act.type === 'approval' ? '✅' : act.type === 'rejection' ? '❌' : '⚙️'}
                            </span>
                            <div className="flex-1 leading-relaxed">
                              <span className="font-bold text-inherit">{act.text}</span>
                              <span className="text-[9px] block text-inherit mt-1.5 opacity-55 font-semibold">{act.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right categories column (p-8) */}
                <div className="flex flex-col gap-8">
                  
                  {/* Top Categories Card */}
                  <div className="rounded-3xl p-8 border flex flex-col shadow-md" style={{ background: cardBg, borderColor: borderCol }}>
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="font-black text-xs uppercase tracking-widest text-inherit opacity-60">Top Categories</h4>
                      <button className="text-[10px] font-black text-accent hover:underline" style={{ color: '#F5B301' }}>View All</button>
                    </div>

                    <div className="flex flex-col gap-4.5">
                      {[
                        { name: 'Main Course', count: '1,245', icon: '🍲' },
                        { name: 'Drinks', count: '876', icon: '🥤' },
                        { name: 'Desserts', count: '432', icon: '🍰' },
                        { name: 'Fast Food', count: '1,234', icon: '🍕' }
                      ].map(cat => (
                        <div key={cat.name} className="flex items-center justify-between text-xs py-3.5 border-b" style={{ borderColor: borderCol }}>
                          <div className="flex items-center gap-3 font-extrabold">
                            <span>{cat.icon}</span>
                            <span>{cat.name}</span>
                          </div>
                          <span className="font-black opacity-60" style={{ color: textSub }}>{cat.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* System Status Check */}
                  <div className="rounded-3xl p-8 border flex flex-col shadow-md" style={{ background: cardBg, borderColor: borderCol }}>
                    <h4 className="font-black text-xs uppercase tracking-widest text-inherit opacity-60 mb-6">System Status</h4>
                    
                    <div className="flex flex-col gap-5">
                      {[
                        { label: 'Server Status', val: 'Online', status: 'ok', Icon: Server },
                        { label: 'Database', val: 'Online', status: 'ok', Icon: Database },
                        { label: 'Storage', val: '72% Used', status: 'warning', Icon: HardDrive },
                        { label: 'Active Users', val: '1,245', status: 'ok', Icon: Activity }
                      ].map(({ label, val, status, Icon }) => (
                        <div key={label} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <Icon size={14} style={{ color: textSub }} className="opacity-70" />
                            <span className="font-extrabold opacity-75" style={{ color: textSub }}>{label}</span>
                          </div>
                          <span
                            className="font-black text-[10px] px-3.5 py-0.5 rounded-full"
                            style={{
                              background: status === 'ok' ? 'rgba(34,197,94,0.12)' : 'rgba(245,179,1,0.12)',
                              color: status === 'ok' ? '#22c55e' : '#F5B301'
                            }}
                          >
                            {val}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 2: APPROVE RESTAURANTS VIEW (Spacious Card layouts: p-8 & gap-8) */}
          {activeTab === 'approve' && (
            <motion.div
              key="approve-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex flex-col gap-10"
            >
              <div>
                <h2 className="text-xl lg:text-2xl font-black tracking-tight leading-none">Approve Restaurant Submissions</h2>
                <p className="text-sm mt-3" style={{ color: textSub }}>Verify credentials, address, and menu offerings from onboarded restaurant merchants.</p>
              </div>

              {pendingRestaurants.length === 0 ? (
                <div className="rounded-3xl p-20 border text-center flex flex-col items-center justify-center min-h-[400px]" style={{ background: cardBg, borderColor: borderCol }}>
                  <span className="text-6xl mb-6">🎉</span>
                  <h3 className="font-black text-lg mb-2">All Caught Up!</h3>
                  <p className="text-xs max-w-sm leading-relaxed" style={{ color: textSub }}>There are no pending restaurant registration verification requests left at the moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <AnimatePresence>
                    {pendingRestaurants.map(rest => (
                      <motion.div
                        key={rest._id}
                        layout
                        initial={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.3 } }}
                        className="rounded-3xl border overflow-hidden shadow-md flex flex-col justify-between"
                        style={{ background: cardBg, borderColor: borderCol }}
                      >
                        <div>
                          {/* visual banner */}
                          <div className="h-44 relative bg-accent/20 flex items-center justify-center text-4xl">
                            🍲
                            <span className="absolute bottom-4 left-4 text-[10px] font-black uppercase text-black bg-white px-3.5 py-1 rounded-full tracking-wider shadow-sm">
                              {rest.cuisineType.split(',')[0]}
                            </span>
                          </div>

                          <div className="p-8">
                            <h3 className="font-black text-lg truncate mb-2">{rest.name}</h3>
                            <p className="text-xs line-clamp-3 leading-relaxed mb-6" style={{ color: textSub }}>{rest.description}</p>
                            
                            <div className="flex flex-col gap-4 border-t pt-6 text-xs" style={{ borderColor: borderCol }}>
                              <div className="flex justify-between items-center">
                                <span style={{ color: textSub }}>Owner Name:</span>
                                <span className="font-extrabold">{rest.owner?.name}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span style={{ color: textSub }}>Owner Email:</span>
                                <span className="font-extrabold truncate max-w-[150px]">{rest.owner?.email}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span style={{ color: textSub }}>Cuisine Focus:</span>
                                <span className="font-extrabold text-accent">{rest.cuisineType}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Control buttons */}
                        <div className="p-8 pt-0 border-t flex gap-4 mt-6" style={{ borderColor: borderCol, paddingTop: 24 }}>
                          <button
                            onClick={() => handleApprove(rest._id, rest.name)}
                            className="flex-1 py-3.5 rounded-full font-bold text-xs border-none cursor-pointer hover:-translate-y-0.5 transition-all text-center"
                            style={{ background: '#F5B301', color: '#000' }}
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={() => openRejectionModal(rest._id)}
                            className="flex-1 py-3.5 rounded-full font-bold text-xs border bg-transparent cursor-pointer hover:bg-red-500/10 transition-all text-center text-red-500"
                            style={{ borderColor: 'rgba(239,68,68,0.4)' }}
                          >
                            ✗ Reject
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: USER & RESTAURANTS MANAGEMENT (Airy Table cells: px-8 py-6) */}
          {activeTab === 'users' && (
            <motion.div
              key="users-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex flex-col gap-10"
            >
              <div>
                <h2 className="text-xl lg:text-2xl font-black tracking-tight leading-none">All Platform Members & Accounts</h2>
                <p className="text-sm mt-3" style={{ color: textSub }}>Perform security checks, change system roles, or suspend user access.</p>
              </div>

              {/* Filtering Controls */}
              <div className="rounded-3xl p-8 border flex flex-col md:flex-row gap-6 items-center justify-between shadow-sm" style={{ background: cardBg, borderColor: borderCol }}>
                <div className="relative w-full max-w-md">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: textSub }}>
                    <Search size={18} />
                  </span>
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search users by name, email..."
                    className="w-full text-xs rounded-2xl py-4 pl-12 pr-4 outline-none border transition-all duration-200"
                    style={{
                      background: inputBg,
                      borderColor: inputBorder,
                      color: inputColor,
                    }}
                  />
                </div>

                <div className="flex items-center gap-4.5 w-full md:w-auto">
                  <span className="text-xs font-bold whitespace-nowrap opacity-75" style={{ color: textSub }}>Filter Role:</span>
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="text-xs font-bold rounded-2xl px-5 py-4 outline-none border cursor-pointer w-full md:w-auto"
                    style={{ background: inputBg, borderColor: inputBorder, color: inputColor }}
                  >
                    <option value="">All Roles</option>
                    <option value="admin">Super Admin</option>
                    <option value="owner">Restaurant Owner</option>
                    <option value="customer">Customer</option>
                  </select>
                </div>
              </div>

              {/* Users Table (Spacious cells: px-8 py-6) */}
              <div className="rounded-3xl border overflow-hidden shadow-md" style={{ background: cardBg, borderColor: borderCol }}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr style={{ background: dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
                        <th className="px-8 py-6 text-xs font-black uppercase tracking-widest" style={{ color: textSub }}>Member Info</th>
                        <th className="px-8 py-6 text-xs font-black uppercase tracking-widest" style={{ color: textSub }}>Email Address</th>
                        <th className="px-8 py-6 text-xs font-black uppercase tracking-widest" style={{ color: textSub }}>System Role</th>
                        <th className="px-8 py-6 text-xs font-black uppercase tracking-widest" style={{ color: textSub }}>Account Status</th>
                        <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-right" style={{ color: textSub }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ divideColor: borderCol }}>
                      {users.map(u => (
                        <tr key={u._id} className="hover:bg-opacity-5 transition-colors" style={{ hover: { background: dark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)' } }}>
                          <td className="px-8 py-6 flex items-center gap-5">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs uppercase ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : u.role === 'owner' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
                              {u.name.substring(0, 2)}
                            </div>
                            <div>
                              <div className="font-black text-xs leading-none">{u.name}</div>
                              <div className="text-[10px] mt-2 opacity-50 font-bold" style={{ color: textSub }}>ID: {u._id}</div>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-xs font-semibold leading-relaxed">{u.email}</td>
                          <td className="px-8 py-6">
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u._id, e.target.value)}
                              className="text-xs font-bold rounded-xl px-3 py-2 outline-none border cursor-pointer"
                              style={{ background: inputBg, borderColor: inputBorder, color: inputColor }}
                            >
                              <option value="admin">Super Admin</option>
                              <option value="owner">Restaurant Owner</option>
                              <option value="customer">Customer</option>
                            </select>
                          </td>
                          <td className="px-8 py-6">
                            <button
                              onClick={() => handleToggleActive(u._id, u.isActive)}
                              className="border-none bg-transparent cursor-pointer flex items-center gap-2.5 text-xs font-bold transition-all hover:opacity-80"
                              style={{ color: u.isActive ? '#22c55e' : '#ef4444' }}
                            >
                              {u.isActive ? (
                                <>
                                  <CheckCircle2 size={16} /> Active
                                </>
                              ) : (
                                <>
                                  <XCircle size={16} /> Suspended
                                </>
                              )}
                            </button>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-4">
                              <button
                                onClick={() => handleToggleActive(u._id, u.isActive)}
                                className="p-2.5 rounded-xl border bg-transparent hover:bg-opacity-10 cursor-pointer text-xs"
                                style={{
                                  borderColor: u.isActive ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)',
                                  color: u.isActive ? '#ef4444' : '#22c55e'
                                }}
                                title={u.isActive ? 'Suspend User' : 'Activate User'}
                              >
                                {u.isActive ? <UserX size={15} /> : <UserCheck size={15} />}
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(u._id)}
                                className="p-2.5 rounded-xl border bg-transparent border-red-500/30 text-red-500 hover:bg-red-500/10 cursor-pointer text-xs"
                                title="Delete User"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {users.length === 0 && (
                  <div className="p-20 text-center text-xs opacity-60 font-semibold" style={{ color: textSub }}>
                    No members found matching the search criteria.
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 4: REPORTS TAB */}
          {activeTab === 'reports' && (
            <motion.div
              key="reports-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-3xl p-20 border text-center flex flex-col items-center justify-center min-h-[440px]"
              style={{ background: cardBg, borderColor: borderCol }}
            >
              <BarChart3 size={54} style={{ color: '#F5B301', marginBottom: 24 }} />
              <h3 className="font-black text-lg mb-3">Platform Analytics & Reports</h3>
              <p className="text-xs max-w-sm leading-relaxed" style={{ color: textSub }}>
                Platform financial reports, merchant audits, and user transaction statistics compile dynamically here. Real-time exports will be available.
              </p>
            </motion.div>
          )}

          {/* TAB 5: SETTINGS TAB */}
          {activeTab === 'settings' && (
            <motion.div
              key="settings-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-3xl p-16 border flex flex-col gap-10"
              style={{ background: cardBg, borderColor: borderCol }}
            >
              <div>
                <h3 className="font-black text-lg lg:text-xl tracking-tight">System Configuration</h3>
                <p className="text-xs mt-3 leading-relaxed" style={{ color: textSub }}>Control platform permissions, maintenance flags, and notification rules.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t" style={{ borderColor: borderCol }}>
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-bold opacity-75">Platform Merchant Auto-Approval</label>
                  <select className="text-xs rounded-2xl p-4 outline-none border w-full cursor-pointer" style={{ background: inputBg, borderColor: inputBorder, color: inputColor }}>
                    <option>Disabled (Manual Admin Audit Required)</option>
                    <option>Auto-Approve Certified Owners</option>
                  </select>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-xs font-bold opacity-75">Platform Maintenance Mode</label>
                  <select className="text-xs rounded-2xl p-4 outline-none border w-full cursor-pointer" style={{ background: inputBg, borderColor: inputBorder, color: inputColor }}>
                    <option>Offline Maintenance Flags (Disabled)</option>
                    <option>Enable Sandbox Safe Mode</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* ─── REJECTION MODAL OVERLAY ─────────────────────────────────────── */}
      <AnimatePresence>
        {rejectingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRejectingId(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="relative rounded-3xl p-8 border w-full max-w-lg shadow-2xl z-10"
              style={{ background: cardBg, borderColor: borderCol }}
            >
              <h3 className="font-black text-lg mb-2">Reject Restaurant Request</h3>
              <p className="text-xs mb-5 leading-relaxed" style={{ color: textSub }}>Please enter internal notes or reason for rejecting this restaurant. This feedback will be sent directly to the owner.</p>

              <textarea
                value={rejectionNotes}
                onChange={(e) => setRejectionNotes(e.target.value)}
                placeholder="Reason for rejection (e.g. Invalid licensing proof, low image resolutions...)"
                rows={5}
                className="w-full text-xs rounded-2xl p-4 outline-none border resize-none transition-all"
                style={{
                  background: inputBg,
                  borderColor: inputBorder,
                  color: inputColor,
                }}
                onFocus={(e) => e.target.style.borderColor = '#ef4444'}
                onBlur={(e) => e.target.style.borderColor = inputBorder}
              />

              <div className="flex gap-4.5 justify-end mt-6">
                <button
                  onClick={() => setRejectingId(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold border bg-transparent cursor-pointer hover:bg-gray-500/10"
                  style={{ borderColor: borderCol }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold border-none cursor-pointer bg-red-500 text-white hover:bg-red-600 shadow-md"
                >
                  Reject Application
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── USER DELETE CONFIRM MODAL ────────────────────────────────────── */}
      <AnimatePresence>
        {confirmDeleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmDeleteId(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="relative rounded-3xl p-8 border w-full max-w-md shadow-2xl z-10"
              style={{ background: cardBg, borderColor: borderCol }}
            >
              <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mx-auto mb-4.5">
                <AlertCircle size={26} />
              </div>
              <h3 className="font-black text-lg text-center mb-2">Delete Platform Member?</h3>
              <p className="text-xs text-center mb-6 leading-relaxed" style={{ color: textSub }}>This action is permanent and cannot be undone. All active sessions, menus, or logs related to this member will be detached.</p>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold border bg-transparent cursor-pointer hover:bg-gray-500/10"
                  style={{ borderColor: borderCol }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold border-none cursor-pointer bg-red-500 text-white hover:bg-red-600 shadow-md"
                >
                  Delete Account
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
