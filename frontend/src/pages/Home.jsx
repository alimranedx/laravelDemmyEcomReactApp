import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/urlHelper';
import HeroSlider from '../components/home/HeroSlider';
import { addToCart } from '../store/slices/cartSlice';


const Home = () => {
  const dispatch = useDispatch();
  const { items, loading, pagination } = useSelector((state) => state.products);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const [search, setSearch] = useState('');


  useEffect(() => {
    dispatch(fetchProducts({ page: 1, search, per_page: 50 }));
  }, [dispatch, search]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 500 &&
        !loading &&
        pagination.current_page < pagination.last_page
      ) {
        dispatch(fetchProducts({ 
          page: pagination.current_page + 1, 
          search, 
          per_page: 50, 
          append: true 
        }));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dispatch, loading, pagination, search]);



  const heroProducts = items.slice(0, 10);

  return (
    <div className="page-container">
      <HeroSlider products={heroProducts} />

      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 style={{ marginBottom: '0.25rem' }}>Full Catalog</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Showing {items.length} products</p>
        </motion.div>


        <div style={{ width: '300px' }}>
          <input 
            type="text" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      {loading && <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Updating catalog...</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
        {items.map((prod, idx) => (
          <motion.div 
            key={prod.id || idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (idx % 12) * 0.05 }}
            className="glass-card"
            style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}
          >
            {/* Same product card content as before... */}
            <button 
              onClick={() => dispatch(toggleWishlist(prod))}
              style={{ 
                position: 'absolute', 
                top: '1rem', 
                right: '1rem', 
                zIndex: 10, 
                background: 'rgba(255,255,255,0.1)', 
                border: 'none', 
                borderRadius: '50%', 
                width: '35px', 
                height: '35px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: 0,
                color: wishlistItems.find(item => item.id === prod.id) ? 'var(--error)' : 'white'
              }}
            >
              ❤️
            </button>
            <div style={{ height: '200px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
               <img 
                 src={getImageUrl(prod)} 
                 alt={prod.name} 
                 style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                 onError={(e) => {
                   e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                 }}
               />
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>{prod.name}</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)' }}>${prod.price}</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to={`/products/${prod.id}`} style={{ textDecoration: 'none' }}>
                  <button style={{ padding: '0.6rem 0.8rem', fontSize: '0.85rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    Details
                  </button>
                </Link>
                <button 
                  onClick={() => dispatch(addToCart(prod))}
                  style={{ padding: '0.6rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                  Add
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {loading && <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)' }}>Loading more products...</p>}


      {items.length === 0 && !loading && (
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <h2 style={{ color: 'var(--text-muted)' }}>No products found</h2>
        </div>
      )}
    </div>
  );
};

export default Home;
