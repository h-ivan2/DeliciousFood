import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import RestaurantCard from '../components/RestaurantCard';
import DashboardMockup from '../components/DashboardMockup';

import { BtnPrimary, BtnOutline, Tag, Icons } from '../components/ui';

import {
  IMG_HERO_BG,
  IMG_REST_GREEN_BOWL,
  IMG_REST_SPICE_ROUTE,
  IMG_REST_PIZZA_POINT,
  IMG_REST_BURGER_HOUSE,
  IMG_REST_OCEAN_DELIGHT,
} from '../constants/images';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: 'easeOut' },
});

const RESTAURANTS = [
  {
    img: IMG_REST_GREEN_BOWL,
    name: 'The Green Bowl',
    rating: '4.8',
    reviews: '230',
    time: '25-30 min',
  },
  {
    img: IMG_REST_SPICE_ROUTE,
    name: 'Spice Route',
    rating: '4.6',
    reviews: '180',
    time: '30-35 min',
  },
  {
    img: IMG_REST_PIZZA_POINT,
    name: 'Pizza Point',
    rating: '4.7',
    reviews: '210',
    time: '20-25 min',
  },
  {
    img: IMG_REST_BURGER_HOUSE,
    name: 'Burger House',
    rating: '4.9',
    reviews: '160',
    time: '25-30 min',
  },
  {
    img: IMG_REST_OCEAN_DELIGHT,
    name: 'Ocean Delight',
    rating: '4.4',
    reviews: '130',
    time: '30-35 min',
  },
];

const CATEGORIES = [
  'All',
  'Pizza',
  'Burgers',
  'Italian',
  'Desserts',
  'More',
];

const FEATURES = [
  {
    icon: '🏪',
    title: 'Role-Based System',
    desc: 'Super Admin, Owners & Customers — each with tailored dashboards.',
  },
  {
    icon: '📋',
    title: 'Menu & Order Management',
    desc: 'Create menus, manage orders & categories easily in one place.',
  },
  {
    icon: '📍',
    title: 'Real-Time Tracking',
    desc: 'Track orders and delivery updates live on an interactive map.',
  },
  {
    icon: '📈',
    title: 'Scalable Solution',
    desc: 'Built to grow with your restaurant from day one to thousands.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Sarah M.',
    role: 'Restaurant Owner',
    text: 'Delicious Food transformed how we manage our restaurant. Orders are up 40% since joining!',
    rating: 5,
  },
  {
    name: 'James K.',
    role: 'Customer',
    text: 'Finding great restaurants near me has never been easier. Love the real-time order tracking!',
    rating: 5,
  },
  {
    name: 'Priya R.',
    role: 'Restaurant Owner',
    text: 'The dashboard gives us complete control. Menu management and analytics are a breeze now.',
    rating: 5,
  },
];

const HERO_STATS = [
  { value: '245+', label: 'Restaurants' },
  { value: '2,500+', label: 'Happy Customers' },
  { value: '$24K+', label: 'Revenue Managed' },
];

export default function LandingPage() {
  const { dark } = useTheme();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState('All');

  const bg = dark ? '#070B14' : '#f8f5f0';
  const sectionAlt = dark ? '#0B1020' : '#ffffff';
  const textSub = dark
    ? 'rgba(255,255,255,0.6)'
    : '#666666';

  return (
    <div style={{ background: bg, minHeight: '100vh' }}>
      <Navbar />

      {/* HERO SECTION */}
      <section
        className="relative flex items-center overflow-hidden"
        style={{ minHeight: '100vh', paddingTop: 70 }}
      >
        {/* BACKGROUND */}
        <div className="absolute inset-0 z-0">
          <img
            src={IMG_HERO_BG}
            alt=""
            className="w-full h-full object-cover"
            style={{ opacity: dark ? 0.12 : 0.08 }}
          />

          <div
            className="absolute inset-0"
            style={{
              background: dark
                ? 'radial-gradient(ellipse at 20% 50%, rgba(245,179,1,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(139,26,26,0.07) 0%, transparent 60%)'
                : 'radial-gradient(ellipse at 20% 50%, rgba(245,179,1,0.1) 0%, transparent 60%)',
            }}
          />
        </div>

        <div className="max-w-[1280px] mx-auto px-6 py-20 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* LEFT SIDE */}
            <div>
              <motion.div {...fadeUp(0.05)} className="mb-6">
                <Tag>
                  ✦ All-in-one Restaurant Management System
                </Tag>
              </motion.div>

              <motion.h1
                {...fadeUp(0.15)}
                className="font-display font-black leading-[1.08] mb-4"
                style={{ fontSize: 'clamp(36px,4.5vw,64px)' }}
              >
                Powering{' '}
                <span
                  style={{
                    color: dark
                      ? 'rgba(255,255,255,0.95)'
                      : '#1a1a1a',
                  }}
                >
                  Restaurants.
                </span>

                <br />

                <span className="gradient-text">
                  Delighting Customers.
                </span>
              </motion.h1>

              <motion.p
                {...fadeUp(0.25)}
                className="text-lg leading-relaxed mb-10 max-w-[480px]"
                style={{ color: textSub }}
              >
                Delicious Food is a complete platform that helps
                restaurants manage, grow, and serve better —
                from dashboard to doorstep.
              </motion.p>

              {/* FEATURES SMALL */}
              <motion.div
                {...fadeUp(0.3)}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
              >
                {[
                  {
                    icon: '🎯',
                    title: 'Manage & Grow',
                    sub: 'Powerful tools for restaurant owners',
                  },
                  {
                    icon: '⚡',
                    title: 'Seamless Experience',
                    sub: 'Easy ordering & real-time tracking',
                  },
                  {
                    icon: '🛡',
                    title: 'Full Control',
                    sub: 'Super admin oversight & analytics',
                  },
                ].map(({ icon, title, sub }) => (
                  <div
                    key={title}
                    className="flex gap-2.5 items-start"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 text-base"
                      style={{
                        backgroundColor:
                          'rgba(245,179,1,0.15)',
                      }}
                    >
                      {icon}
                    </div>

                    <div>
                      <div className="font-bold text-xs mb-0.5">
                        {title}
                      </div>

                      <div
                        className="text-xs leading-snug"
                        style={{ color: textSub }}
                      >
                        {sub}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* BUTTONS */}
              <motion.div
                {...fadeUp(0.35)}
                className="flex flex-wrap gap-3 mb-12"
              >
                <BtnPrimary
                  onClick={() => navigate('/signup')}
                  style={{
                    fontSize: 15,
                    padding: '14px 30px',
                  }}
                >
                  Get Started Now <Icons.Arrow />
                </BtnPrimary>

                <BtnOutline
                  dark={dark}
                  style={{
                    fontSize: 15,
                    padding: '14px 28px',
                  }}
                >
                  <Icons.Play /> Watch Demo
                </BtnOutline>
              </motion.div>

              {/* STATS */}
              <motion.div
                {...fadeUp(0.45)}
                className="flex gap-8"
              >
                {HERO_STATS.map(({ value, label }) => (
                  <div key={label}>
                    <div
                      className="font-display font-extrabold text-accent"
                      style={{ fontSize: 26 }}
                    >
                      {value}
                    </div>

                    <div
                      className="text-xs mt-0.5"
                      style={{ color: textSub }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* RIGHT SIDE */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block relative"
            >
              <div className="relative">
                <div
                  className="absolute inset-8 rounded-3xl"
                  style={{
                    background:
                      'radial-gradient(ellipse, rgba(245,179,1,0.15) 0%, transparent 70%)',
                  }}
                />

                <div
                  className="relative rounded-2xl overflow-hidden"
                  style={{
                    boxShadow:
                      '0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
                  }}
                >
                  <DashboardMockup />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        className="py-20"
        style={{ background: sectionAlt }}
      >
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                }}
                whileHover={{ y: -6 }}
                className={`rounded-2xl p-7 ${
                  dark ? 'glass-dark' : 'glass-light'
                }`}
              >
                <div className="text-4xl mb-5">
                  {f.icon}
                </div>

                <div className="font-bold text-base mb-2">
                  {f.title}
                </div>

                <p
                  className="text-sm leading-relaxed"
                  style={{ color: textSub }}
                >
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RESTAURANTS */}
      <section
        className="py-20"
        style={{ background: bg }}
      >
        <div className="max-w-[1280px] mx-auto px-6">

          <div className="flex gap-2.5 mb-8 flex-wrap">
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat)}
                className="rounded-full font-medium text-sm cursor-pointer transition-all duration-200 border-none"
                style={{
                  padding: '8px 20px',
                  background:
                    activeCategory === cat
                      ? '#F5B301'
                      : 'transparent',

                  color:
                    activeCategory === cat
                      ? '#000'
                      : dark
                      ? 'rgba(255,255,255,0.65)'
                      : '#555',

                  border:
                    activeCategory === cat
                      ? 'none'
                      : `1px solid ${
                          dark
                            ? 'rgba(255,255,255,0.12)'
                            : '#e2e2e2'
                        }`,
                }}
              >
                {cat}
              </motion.button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {RESTAURANTS.map((r, i) => (
              <RestaurantCard
                key={r.name}
                {...r}
                delay={i * 0.08}
              />
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section
        className="py-20"
        style={{ background: sectionAlt }}
      >
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                }}
                className={`rounded-2xl p-8 ${
                  dark ? 'glass-dark' : 'glass-light'
                }`}
              >
                <Icons.Quote />

                <p
                  className="text-sm leading-relaxed my-4"
                  style={{ color: textSub }}
                >
                  "{t.text}"
                </p>

                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Icons.Star key={j} />
                  ))}
                </div>

                <div>
                  <div className="font-bold text-sm">
                    {t.name}
                  </div>

                  <div className="text-xs text-accent mt-0.5">
                    {t.role}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-24 text-center"
        style={{
          background:
            'linear-gradient(135deg, rgba(245,179,1,0.09), rgba(139,26,26,0.07))',
        }}
      >
        <div className="max-w-[680px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="font-display font-black mb-5"
              style={{
                fontSize: 'clamp(28px, 4vw, 52px)',
              }}
            >
              Ready to grow your{' '}
              <span className="gradient-text">
                restaurant?
              </span>
            </h2>

            <p
              className="text-lg mb-10 leading-relaxed"
              style={{ color: textSub }}
            >
              Join 245+ restaurants already using
              Delicious Food to reach more customers
              and boost revenue.
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <BtnPrimary
                onClick={() => navigate('/signup')}
                style={{
                  fontSize: 16,
                  padding: '16px 40px',
                }}
              >
                Start for Free <Icons.Arrow />
              </BtnPrimary>

              <BtnOutline
                dark={dark}
                onClick={() => navigate('/login')}
                style={{
                  fontSize: 16,
                  padding: '16px 36px',
                }}
              >
                Sign In
              </BtnOutline>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}