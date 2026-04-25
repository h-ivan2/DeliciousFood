import { useTheme } from '../../context/ThemeContext';
import { IMG_LOGO } from '../../constants/images';

// ─────────────────────────────────────────────
// LOGO
// ─────────────────────────────────────────────
export function Logo({ size = 'md', onClick }) {
  const sizeMap = { sm: 32, md: 40, lg: 52 };
  const px = sizeMap[size] || 40;

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-2.5 cursor-pointer select-none"
    >
      {IMG_LOGO ? (
        <img src={IMG_LOGO} alt="Delicious Food Logo" style={{ width: px, height: px * 0.7, objectFit: 'contain' }} />
      ) : (
        <div
          className="flex items-center justify-center flex-shrink-0 text-2xl rounded-xl"
          style={{
            width: px,
            height: px,
            background: 'linear-gradient(135deg, #F5B301, #c98f00)',
            fontSize: px * 0.45,
          }}
        >
          🍽
        </div>
      )}
      <div>
        <div
          className="font-display font-bold leading-tight"
          style={{ fontSize: size === 'lg' ? 22 : size === 'sm' ? 14 : 17 }}
        >
          Delicious Food
        </div>
        {size !== 'sm' && (
          <div className="text-accent text-xs font-medium tracking-wide">
            Good Food, Good Mood
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// THEME TOGGLE
// ─────────────────────────────────────────────
export function ThemeToggle() {
  const { dark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="relative flex-shrink-0 rounded-full transition-colors duration-300 border-none outline-none cursor-pointer"
      style={{
        width: 48,
        height: 26,
        background: dark ? '#F5B301' : '#d1d5db',
      }}
    >
      <div
        className="absolute top-[3px] flex items-center justify-center rounded-full bg-white shadow-md transition-all duration-300"
        style={{
          width: 20,
          height: 20,
          left: dark ? 25 : 3,
          fontSize: 11,
        }}
      >
        {dark ? '🌙' : '☀️'}
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────
// BUTTONS
// ─────────────────────────────────────────────
export function BtnPrimary({ children, onClick, className = '', style = {} }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 font-bold rounded-full border-none cursor-pointer font-body transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(245,179,1,0.4)] ${className}`}
      style={{
        background: '#F5B301',
        color: '#000',
        padding: '14px 32px',
        fontSize: 15,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function BtnOutline({ children, onClick, dark = true, className = '', style = {} }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 font-semibold rounded-full cursor-pointer font-body transition-all duration-200 ${className}`}
      style={{
        background: 'transparent',
        color: dark ? '#fff' : '#1a1a1a',
        padding: '14px 32px',
        fontSize: 15,
        border: `1.5px solid ${dark ? 'rgba(255,255,255,0.3)' : '#1a1a1a'}`,
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#F5B301';
        e.currentTarget.style.color = '#F5B301';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = dark ? 'rgba(255,255,255,0.3)' : '#1a1a1a';
        e.currentTarget.style.color = dark ? '#fff' : '#1a1a1a';
      }}
    >
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────
// TAG / BADGE
// ─────────────────────────────────────────────
export function Tag({ children }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent rounded-full px-3.5 py-1.5"
      style={{
        border: '1px solid rgba(245,179,1,0.4)',
        background: 'rgba(245,179,1,0.08)',
      }}
    >
      {children}
    </span>
  );
}

// ─────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────
export const Icons = {
  Sun: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  Moon: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  Star: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#F5B301">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Arrow: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  Eye: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
  EyeOff: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ),
  Mail: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  Lock: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  User: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Phone: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6A16 16 0 0 0 15.4 16.1l.95-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F5B301" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Play: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  ),
  Quote: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="#F5B301">
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
    </svg>
  ),
  Heart: ({ filled = false }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? '#F5B301' : 'none'} stroke={filled ? '#F5B301' : 'currentColor'} strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  Clock: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Menu: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  Close: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Google: () => (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  ),
  Apple: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  ),
  Facebook: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
};
