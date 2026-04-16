import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { toggleTheme } from '../../store/slices/themeSlice';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { motion } from 'framer-motion';


const Header = () => {
  const { token, user } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const dispatch = useDispatch();

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav style={{ 
      padding: '1rem 2rem', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      borderBottom: '1px solid var(--glass-border)',
      background: 'var(--panel-bg)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button 
          onClick={() => dispatch(toggleSidebar())}
          style={{ 
            background: 'none', 
            border: 'none', 
            fontSize: '1.5rem', 
            cursor: 'pointer', 
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          ☰
        </button>
        <Link to="/" style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          textDecoration: 'none',
          background: 'linear-gradient(135deg, var(--text-main) 0%, var(--primary) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Gravity Shop
        </Link>
      </div>


      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: '500' }}>Catalog</Link>
        <Link to="/wishlist" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: '500', position: 'relative' }}>
          Wishlist
          {wishlistItems.length > 0 && (
            <span style={{ position: 'absolute', top: '-8px', right: '-12px', background: 'var(--primary)', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '0.7rem' }}>
              {wishlistItems.length}
            </span>
          )}
        </Link>
        <Link to="/cart" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: '500', position: 'relative' }}>
          Cart
          {cartCount > 0 && (
            <span style={{ position: 'absolute', top: '-8px', right: '-12px', background: 'var(--success)', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '0.7rem' }}>
              {cartCount}
            </span>
          )}
        </Link>
        
        <button 
          onClick={() => dispatch(toggleTheme())}
          style={{ 
            background: 'none', 
            padding: '0.5rem', 
            borderRadius: '50%', 
            border: '1px solid var(--glass-border)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            cursor: 'pointer',
            marginLeft: '1rem'
          }}
          title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
        >
          {mode === 'light' ? '🌙' : '☀️'}
        </button>

        {token ? (
          <>
            <Link to="/dashboard" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: '500' }}>Dashboard</Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1rem', borderLeft: '1px solid var(--glass-border)' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Hi, {user?.name?.split(' ')[0] || 'User'}</span>
              <button 
                onClick={() => dispatch(logout())}
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/login" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: '500', padding: '0.5rem 1rem' }}>Sign In</Link>
            <Link to="/register" style={{ 
              backgroundColor: 'var(--primary)', 
              color: 'white', 
              textDecoration: 'none', 
              fontWeight: '600', 
              padding: '0.5rem 1.25rem', 
              borderRadius: '10px' 
            }}>
              Join Free
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
