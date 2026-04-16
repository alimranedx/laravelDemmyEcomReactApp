import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { closeSidebar } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';

const Sidebar = () => {
  const { isSidebarOpen } = useSelector((state) => state.ui);
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const menuItems = [
    { label: 'Home', path: '/', icon: '🏠' },
    { label: 'Shop Catalog', path: '/', icon: '🛍️' },
    { label: 'My wishlist', path: '/wishlist', icon: '❤️' },
    { label: 'Shopping Cart', path: '/cart', icon: '🛒' },
    { label: 'My Dashboard', path: '/dashboard', icon: '📊', protected: true },
  ];

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeSidebar())}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(4px)',
              zIndex: 998,
            }}
          />

          {/* Sidebar Drawer */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '300px',
              height: '100%',
              background: 'var(--panel-bg)',
              backdropFilter: 'blur(40px)',
              borderRight: '1px solid var(--glass-border)',
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
              padding: '2rem 1.5rem',
              boxShadow: '20px 0 50px rgba(0,0,0,0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>Menu</span>
              <button 
                onClick={() => dispatch(closeSidebar())}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            {/* Profile Summary */}
            <div style={{ padding: '1.5rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', marginBottom: '2rem' }}>
              {token ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white' }}>
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p style={{ fontWeight: '600', fontSize: '0.95rem' }}>{user?.name}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Member Since 2026</p>
                  </div>
                </div>
              ) : (
                <div>
                  <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Welcome, Guest</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Sign in to sync your wishlist and cart.</p>
                  <Link to="/login" onClick={() => dispatch(closeSidebar())}>
                    <button className="btn-primary" style={{ width: '100%', padding: '0.6rem' }}>Login / Register</button>
                  </Link>
                </div>
              )}
            </div>

            {/* Navigation Links */}
            <nav style={{ flexGrow: 1 }}>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {menuItems.map((item) => (
                  (item.protected && !token) ? null : (
                    <li key={item.path} style={{ marginBottom: '0.5rem' }}>
                      <Link 
                        to={item.path} 
                        onClick={() => dispatch(closeSidebar())}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '1rem', 
                          padding: '1rem', 
                          borderRadius: '12px', 
                          textDecoration: 'none', 
                          color: 'var(--text-main)',
                          transition: 'all 0.2s ease',
                          background: 'transparent'
                        }}
                        className="sidebar-link"
                      >
                        <span>{item.icon}</span>
                        <span style={{ fontWeight: '500' }}>{item.label}</span>
                      </Link>
                    </li>
                  )
                ))}
              </ul>
            </nav>

            {/* Footer Actions */}
            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', marginTop: 'auto' }}>
              {token && (
                <button 
                  onClick={() => {
                    dispatch(logout());
                    dispatch(closeSidebar());
                  }}
                  style={{ 
                    width: '100%', 
                    padding: '1rem', 
                    background: 'rgba(239, 68, 68, 0.05)', 
                    color: '#ef4444', 
                    border: '1px solid rgba(239, 68, 68, 0.1)', 
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontWeight: '600'
                  }}
                >
                  🚪 Logout
                </button>
              )}
              <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                Gravity Shop v1.0.4
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
