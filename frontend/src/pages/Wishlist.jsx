import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchWishlist, removeFromWishlistServer } from '../store/slices/wishlistSlice';
import { addToCart } from '../store/slices/cartSlice';
import { motion } from 'framer-motion';
import { getImageUrl } from '../utils/urlHelper';
import toast from 'react-hot-toast';


const Wishlist = () => {
  const { items, loading, error } = useSelector((state) => state.wishlist);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, token]);


  if (loading && items.length === 0) {
    return (
      <div className="page-container" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Loading your favorites...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page-container" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <h1 style={{ marginBottom: '1rem' }}>Your Wishlist is Empty</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Save your favorite items for later!</p>
          <Link to="/"><button className="btn-primary">Explore Products</button></Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <motion.h1 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        style={{ marginBottom: '2.5rem' }}
      >
        My Wishlist
      </motion.h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
        {items.map((prod, idx) => (
          <motion.div 
            key={prod.id || idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="glass-card"
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            <div style={{ height: '220px', backgroundColor: 'var(--panel-bg)', borderRadius: '16px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
               <img 
                 src={getImageUrl(prod)} 
                 alt={prod.name} 
                 style={{ maxHeight: '90%', maxWidth: '90%', objectFit: 'contain', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))' }} 
               />
            </div>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>{prod.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', flexGrow: 1, lineHeight: '1.6' }}>
              {prod.description?.substring(0, 80)}...
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)', letterSpacing: '-0.5px' }}>${prod.price}</span>
                <button 
                  onClick={() => {
                    dispatch(removeFromWishlistServer(prod.id));
                    toast.success('Removed from wishlist');
                  }}
                  style={{ 
                    backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                    color: 'var(--error)', 
                    border: '1px solid rgba(239, 68, 68, 0.2)', 
                    padding: '0.6rem',
                    width: '35px',
                    height: '35px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Remove from wishlist"
                >
                  ✕
                </button>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => {
                    dispatch(addToCart(prod));
                    toast.success(`${prod.name} added to cart`);
                  }}
                  className="btn-primary"
                  style={{ flex: 1, padding: '0.75rem', fontSize: '0.85rem', background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)' }}
                >
                  Add to Cart
                </button>
                <button 
                  onClick={() => navigate('/checkout', { state: { singleProduct: { ...prod, quantity: 1 } } })}
                  className="btn-primary"
                  style={{ flex: 1.5, padding: '0.75rem', fontSize: '0.85rem' }}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
