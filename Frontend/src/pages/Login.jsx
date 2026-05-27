import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Logo, ThemeToggle, Icons } from '../components/ui';
import { IMG_LOGIN_BG, IMG_LOGO } from '../constants/images';
import { authService } from '../services/api';

const QUOTES = [
  { text: 'Good food is the foundation of genuine happiness.', author: 'Auguste Escoffier' },
  { text: 'People who love to eat are always the best people.', author: 'Julia Child' },
  { text: 'One cannot think well, love well, sleep well, if one has not dined well.', author: 'Virginia Woolf' },
];

export default function Login() {
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const bg = dark ? '#070B14' : '#f8f5f0';
  const cardBg = dark ? '#0B1020' : '#ffffff';
  const inputBg = dark ? 'rgba(255,255,255,0.05)' : '#ffffff';
  const inputBorder = dark ? 'rgba(255,255,255,0.1)' : '#e2e2e2';
  const inputColor = dark ? '#fff' : '#1a1a1a';
  const labelColor = dark ? 'rgba(255,255,255,0.75)' : '#333';
  const subColor = dark ? 'rgba(255,255,255,0.45)' : '#888';
  const dividerColor = dark ? 'rgba(255,255,255,0.08)' : '#e8e8e8';

  return (
    <div className="min-h-screen flex" style={{ background: bg }}>
      {/* LEFT PANEL — Form */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col"
        style={{
          width: '100%',
          maxWidth: 580,
          background: cardBg,
          padding: '40px 52px',
          overflowY: 'auto',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between mb-10">
          <Logo onClick={() => navigate('/')} />
          <ThemeToggle />
        </div>

        {/* Heading */}
        <div className="mb-6 flex flex-col items-start">
          <h1 className="font-display font-black text-3xl mb-1.5">
            Welcome back 👋
          </h1>
          <p className="mb-4" style={{ color: subColor, fontSize: 15 }}>Sign in to continue to your account</p>
          
          <button
            onClick={() => {
              setEmail('admin@delicious.com');
              setPassword('admin123');
              setErrorMsg('');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-full px-3 py-1.5 border border-dashed hover:bg-opacity-20 cursor-pointer transition-all duration-200"
            style={{
              borderColor: '#F5B301',
              background: 'rgba(245,179,1,0.08)',
              color: '#F5B301',
            }}
          >
            ⚡ Quick Login: Super Admin
          </button>
        </div>

        {/* Form fields */}
        <div className="flex flex-col gap-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: labelColor }}>
              Email or Phone number
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: subColor }}>
                <Icons.Mail />
              </span>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email or phone number"
                className="w-full rounded-xl outline-none transition-all duration-200 text-sm"
                style={{
                  padding: '13px 16px 13px 44px',
                  background: inputBg,
                  border: `1.5px solid ${inputBorder}`,
                  color: inputColor,
                  fontFamily: 'DM Sans, sans-serif',
                }}
                onFocus={(e) => { e.target.style.borderColor = '#F5B301'; e.target.style.background = 'rgba(245,179,1,0.05)'; }}
                onBlur={(e) => { e.target.style.borderColor = inputBorder; e.target.style.background = inputBg; }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: labelColor }}>
              Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: subColor }}>
                <Icons.Lock />
              </span>
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-xl outline-none transition-all duration-200 text-sm"
                style={{
                  padding: '13px 44px 13px 44px',
                  background: inputBg,
                  border: `1.5px solid ${inputBorder}`,
                  color: inputColor,
                  fontFamily: 'DM Sans, sans-serif',
                }}
                onFocus={(e) => { e.target.style.borderColor = '#F5B301'; e.target.style.background = 'rgba(245,179,1,0.05)'; }}
                onBlur={(e) => { e.target.style.borderColor = inputBorder; e.target.style.background = inputBg; }}
              />
              <button
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 border-none bg-transparent cursor-pointer"
                style={{ color: subColor }}
              >
                {showPass ? <Icons.EyeOff /> : <Icons.Eye />}
              </button>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div
                onClick={() => setRemember((r) => !r)}
                className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all duration-200"
                style={{
                  background: remember ? '#F5B301' : 'transparent',
                  border: `2px solid ${remember ? '#F5B301' : inputBorder}`,
                }}
              >
                {remember && (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span className="text-sm" style={{ color: labelColor }}>Remember me</span>
            </label>
            <button className="text-sm font-semibold text-accent border-none bg-transparent cursor-pointer hover:underline">
              Forgot password?
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <p className="text-xs text-red-500 font-semibold mt-1">
              ⚠️ {errorMsg}
            </p>
          )}

          {/* Sign In button */}
          <motion.button
            whileHover={!loading ? { y: -2, boxShadow: '0 8px 28px rgba(245,179,1,0.4)' } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            className={`w-full rounded-full font-bold text-base flex items-center justify-center gap-2 border-none cursor-pointer transition-all duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            style={{ background: '#F5B301', color: '#000', padding: '15px', fontFamily: 'DM Sans, sans-serif' }}
            onClick={async () => {
              if (loading) return;
              setErrorMsg('');
              if (!email || !password) {
                setErrorMsg('Please fill in both email and password');
                return;
              }
              setLoading(true);
              try {
                const res = await authService.login(email, password);
                if (res.success) {
                  if (res.user.role === 'admin') {
                    navigate('/admin');
                  } else {
                    setErrorMsg('Access denied. Currently only Super Admin dashboard is built!');
                  }
                }
              } catch (err) {
                setErrorMsg(err.message);
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
            {!loading && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            )}
          </motion.button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px" style={{ background: dividerColor }} />
          <span className="text-xs" style={{ color: subColor }}>or continue with</span>
          <div className="flex-1 h-px" style={{ background: dividerColor }} />
        </div>

        {/* Social buttons */}
        <div className="flex gap-3">
          {[
            { icon: <Icons.Google />, label: 'Google' },
            { icon: <Icons.Apple />, label: 'Apple' },
            { icon: <Icons.Facebook />, label: 'Facebook' },
          ].map(({ icon, label }) => (
            <motion.button
              key={label}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 font-medium text-sm cursor-pointer transition-all duration-200"
              style={{
                border: `1.5px solid ${inputBorder}`,
                background: 'transparent',
                color: inputColor,
                fontFamily: 'DM Sans, sans-serif',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#F5B301'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = inputBorder; }}
            >
              {icon} {label}
            </motion.button>
          ))}
        </div>

        {/* Sign up link */}
        <p className="text-center text-sm mt-8" style={{ color: subColor }}>
          Don't have an account?{' '}
          <button onClick={() => navigate('/signup')} className="font-bold text-accent border-none bg-transparent cursor-pointer hover:underline">
            Sign up
          </button>
        </p>
      </motion.div>

      {/* RIGHT PANEL — Food image + quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="hidden md:flex flex-1 relative overflow-hidden"
      >
        <img src={IMG_LOGIN_BG} alt="Food" className="absolute inset-0 w-full h-full object-cover" />
        {/* Dark overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.1) 100%)' }} />

        {/* Quote */}
        <div className="absolute bottom-10 left-10 right-10">
          <motion.div
            key={quoteIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-4xl mb-3" style={{ color: '#F5B301', fontFamily: 'serif' }}>"</div>
            <p className="text-white font-bold text-xl leading-snug mb-3 max-w-sm">
              {QUOTES[quoteIdx].text}
            </p>
            <p className="text-accent font-semibold text-sm">— {QUOTES[quoteIdx].author}</p>
          </motion.div>

          {/* Dots */}
          <div className="flex gap-2 mt-6">
            {QUOTES.map((_, i) => (
              <button
                key={i}
                onClick={() => setQuoteIdx(i)}
                className="rounded-full border-none cursor-pointer transition-all duration-300"
                style={{
                  width: i === quoteIdx ? 24 : 8,
                  height: 8,
                  background: i === quoteIdx ? '#F5B301' : 'rgba(255,255,255,0.4)',
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
