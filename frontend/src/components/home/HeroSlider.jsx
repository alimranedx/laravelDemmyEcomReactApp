import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { getImageUrl } from '../../utils/urlHelper';

const HeroSlider = ({ products }) => {
  const dispatch = useDispatch();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (products.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === products.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [products.length]);

  if (products.length === 0) return null;

  const currentProd = products[current];

  return (
    <div style={{ 
      position: 'relative', 
      height: '500px', 
      width: '100%', 
      overflow: 'hidden', 
      borderRadius: '24px', 
      marginBottom: '4rem',
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid var(--glass-border)'
    }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            padding: '3rem 5rem',
            background: 'linear-gradient(90deg, rgba(0,0,0,0.4) 0%, transparent 60%)'
          }}
        >
          <div style={{ flex: 1, zIndex: 2, maxWidth: '500px' }}>
            <motion.span 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{ 
                background: 'var(--primary)', 
                color: 'white', 
                padding: '0.4rem 1rem', 
                borderRadius: '20px', 
                fontSize: '0.8rem', 
                fontWeight: 'bold',
                display: 'inline-block',
                marginBottom: '1.5rem'
              }}
            >
              LATEST ARRIVAL
            </motion.span>
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1rem', lineHeight: 1.1 }}
            >
              {currentProd.name}
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{ color: 'var(--text-muted)', fontSize: '1.15rem', marginBottom: '2rem', lineHeight: 1.6 }}
            >
              {currentProd.description?.substring(0, 120)}...
            </motion.p>
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Price starts from</span>
                <span style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)' }}>${currentProd.price}</span>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Link to={`/products/${currentProd.id}`} style={{ textDecoration: 'none' }}>
                  <button style={{ 
                    padding: '0.75rem 1.5rem', 
                    fontSize: '0.9rem', 
                    borderRadius: '12px', 
                    background: 'rgba(255,255,255,0.05)', 
                    border: '1px solid var(--glass-border)', 
                    color: 'var(--text-main)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem'
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    View
                  </button>
                </Link>
                <button 
                  onClick={() => dispatch(addToCart(currentProd))}
                  style={{ 
                    padding: '0.75rem 1.5rem', 
                    fontSize: '0.9rem', 
                    borderRadius: '12px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    background: 'linear-gradient(135deg, var(--primary) 0%, #818cf8 100%)',
                    boxShadow: '0 8px 20px -5px rgba(99, 102, 241, 0.3)'
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                  Add
                </button>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
          >
            <div style={{ 
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {/* Decorative Circle Background */}
              <div style={{ 
                position: 'absolute', 
                width: '400px', 
                height: '400px', 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, var(--primary) 0%, rgba(129, 140, 248, 0.2) 100%)', 
                filter: 'blur(60px)',
                zIndex: 0,
                opacity: 0.3
              }} />
              
              <img 
                src={getImageUrl(currentProd, '800x600')} 
                alt={currentProd.name} 
                style={{ 
                  maxHeight: '90%', 
                  maxWidth: '100%', 
                  objectFit: 'contain', 
                  zIndex: 2,
                  filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))'
                }} 
              />
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Pagination dots */}
      <div style={{ 
        position: 'absolute', 
        bottom: '2rem', 
        left: '5rem', 
        display: 'flex', 
        gap: '0.75rem', 
        zIndex: 10 
      }}>
        {products.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            style={{
              width: idx === current ? '30px' : '10px',
              height: '10px',
              borderRadius: '5px',
              background: idx === current ? 'var(--primary)' : 'rgba(255,255,255,0.2)',
              border: 'none',
              padding: 0,
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>

      {/* Manual Navigation */}
      <div style={{ 
        position: 'absolute', 
        right: '5rem', 
        bottom: '2rem', 
        display: 'flex', 
        gap: '1rem', 
        zIndex: 10 
      }}>
        <button 
          onClick={() => setCurrent((prev) => (prev === 0 ? products.length - 1 : prev - 1))}
          style={{ background: 'var(--social-bg)', color: 'var(--text-h)', border: '1px solid var(--glass-border)', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          ←
        </button>
        <button 
          onClick={() => setCurrent((prev) => (prev === products.length - 1 ? 0 : prev + 1))}
          style={{ background: 'var(--social-bg)', color: 'var(--text-h)', border: '1px solid var(--glass-border)', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          →
        </button>
      </div>
    </div>
  );
};

export default HeroSlider;
