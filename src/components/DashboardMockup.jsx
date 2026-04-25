import {
  IMG_REST_GREEN_BOWL,
  IMG_REST_SPICE_ROUTE,
  IMG_REST_PIZZA_POINT,
  IMG_REST_BURGER_HOUSE,
  IMG_DASHBOARD_PREVIEW,
} from '../constants/images';

export default function DashboardMockup() {
  if (IMG_DASHBOARD_PREVIEW) {
    return (
      <img src={IMG_DASHBOARD_PREVIEW} alt="Admin Dashboard" className="w-full block rounded-2xl"/>
    );
  }

  const stats = [
    { icon: '🏪', value: '245',label: 'Restaurants', trend: '+12%' },
    { icon: '👤', value: '328',label: 'Owners',trend: '+16%' },
    { icon: '👥', value: '2,543',label: 'Customers',trend: '+14%' },
    { icon: '📦', value: '8,672',label: 'Orders',trend: '+21%' },
    { icon: '💰', value: '$24,560',label: 'Revenue',trend: '+12%' },
  ];

  const recentItems = ['The Green Bowl', 'Spice Route', 'Pizza Point', 'Burger House', 'Ocean Delight'];
  const bars  = [40, 65, 45, 80, 55, 70, 60];
  const days  = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const thumbs = [IMG_REST_GREEN_BOWL, IMG_REST_SPICE_ROUTE, IMG_REST_PIZZA_POINT, IMG_REST_BURGER_HOUSE];

  return (
    <div style={{ background: '#0B1020', padding: 14, borderRadius: 16, fontFamily: 'DM Sans, sans-serif' }}>

      {/* Top bar */}
      {/* FIX: background string was broken — had a stray quote inside the value */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 12, padding: '7px 10px',
        background: 'rgba(255,255,255,0.04)', borderRadius: 8,
      }}>
        <span style={{ color: '#F5B301', fontWeight: 700, fontSize: 11 }}>🍽 Delicious Food</span>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9 }}>👋 Welcome back, Super Admin!</span>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>Super Admin ▾</span>
      </div>

      {/* Stat cards */}
      {/* FIX: arrow function was missing `return` — changed to parenthesised return */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 6, marginBottom: 10 }}>
        {stats.map(({ icon, value, label, trend }) => (
          <div key={label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 7, padding: '8px 6px', textAlign: 'center' }}>
            <div style={{ fontSize: 14 }}>{icon}</div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 11, margin: '3px 0 1px' }}>{value}</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 8 }}>{label}</div>
            <div style={{ color: '#22c55e', fontSize: 8 }}>↑ {trend}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 8 }}>

        {/* Recent registrations */}
        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 7, padding: 8 }}>
          <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 8, marginBottom: 6, fontWeight: 600 }}>Recent Registrations</div>
          {recentItems.slice(0, 4).map((r, i) => (
            <div key={r} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '3px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 8,
            }}>
              <span style={{ color: 'rgba(255,255,255,0.75)' }}>{r}</span>
              <span style={{ color: i < 2 ? '#F5B301' : '#22c55e', fontSize: 7 }}>{i < 2 ? 'Pending' : 'Approved'}</span>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 7, padding: 8 }}>
          <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 8, marginBottom: 6, fontWeight: 600 }}>Orders Overview</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 52 }}>
            {bars.map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: 2, background: `rgba(245,179,1,${0.25 + i * 0.1})` }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
            {days.map((d) => (
              <span key={d} style={{ color: 'rgba(255,255,255,0.3)', fontSize: 7 }}>{d}</span>
            ))}
          </div>
        </div>

        {/* Donut chart */}
        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 7, padding: 8 }}>
          <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 8, marginBottom: 6, fontWeight: 600 }}>Registration Status</div>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0' }}>
            <svg width="56" height="56" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
              <circle cx="28" cy="28" r="20" fill="none" stroke="#22c55e" strokeWidth="7" strokeDasharray="81 45" strokeDashoffset="25" />
              <circle cx="28" cy="28" r="20" fill="none" stroke="#F5B301" strokeWidth="7" strokeDasharray="7 119" strokeDashoffset="-56" />
              <circle cx="28" cy="28" r="20" fill="none" stroke="#ef4444" strokeWidth="7" strokeDasharray="10 116" strokeDashoffset="-63" />
              <text x="28" y="32" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700">245</text>
            </svg>
          </div>
          <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8 }}>
            <div>🟢 Approved 198</div>
            <div>🟡 Pending 18</div>
            <div>🔴 Rejected 29</div>
          </div>
        </div>
      </div>

      {/* Restaurant thumbnails */}
      {/* FIX: img style string was broken — `'width: 100%, height: 100%'` is not valid JS, split into separate properties */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 5 }}>
        {thumbs.map((src, i) => (
          <div key={i} style={{ borderRadius: 5, overflow: 'hidden', height: 44, background: '#1a2035' }}>
            {src && (
              <img
                src={src}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
              />
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
