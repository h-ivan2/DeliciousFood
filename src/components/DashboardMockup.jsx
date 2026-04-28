import { IMG_DASHBOARD_PREVIEW } from '../constants/images';

export default function DashboardMockup() {
  return (
    <div className="relative w-full">
      {/* Laptop outer frame */}
      <div style={{
        background: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
        borderRadius: 16,
        padding: '12px 12px 0 12px',
        boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)',
      }}>
        {/* Screen bezel top — camera dot */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 20,
          marginBottom: 6,
        }}>
          <div style={{
            width: 6, height: 6,
            borderRadius: '50%',
            background: '#444',
          }} />
        </div>

        {/* Screen — your dashboard image */}
        <div style={{
          borderRadius: '8px 8px 0 0',
          overflow: 'hidden',
          background: '#0B1020',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <img
            src={IMG_DASHBOARD_PREVIEW}
            alt="Super Admin Dashboard"
            style={{
              width: '100%',
              display: 'block',
              maxHeight: 420,
              objectFit: 'cover',
              objectPosition: 'top',
            }}
          />
        </div>
      </div>

      {/* Laptop base / hinge */}
      <div style={{
        background: 'linear-gradient(to bottom, #222, #333)',
        height: 14,
        borderRadius: '0 0 4px 4px',
        marginTop: -1,
      }} />

      {/* Laptop bottom stand */}
      <div style={{
        background: 'linear-gradient(to bottom, #2a2a2a, #1e1e1e)',
        height: 10,
        borderRadius: '0 0 20px 20px',
        marginTop: 0,
        boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
      }} />

      {/* Glow effect under */}
      <div style={{
        position: 'absolute',
        bottom: -30,
        left: '10%',
        right: '10%',
        height: 40,
        background: 'rgba(245,179,1,0.15)',
        filter: 'blur(20px)',
        borderRadius: '50%',
      }} />
    </div>
  );
}