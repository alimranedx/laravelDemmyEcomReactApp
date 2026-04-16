import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import api from '../api/client';
import { motion } from 'framer-motion';
import { getImageUrl } from '../utils/urlHelper';


const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {

    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="page-container"><p>Loading details...</p></div>;
  if (error) return <div className="page-container"><h1>{error}</h1><Link to="/">Back to Catalog</Link></div>;

  return (
    <div className="page-container">
      <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-block', marginBottom: '2rem' }}>
        &larr; Back to Catalog
      </Link>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem', alignItems: 'start' }}>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card"
          style={{ padding: '1rem', display: 'flex', justifyContent: 'center' }}
        >
          <img 
            src={getImageUrl(product)} 
            alt={product.name} 
            style={{ width: '100%', maxHeight: '500px', objectFit: 'contain', borderRadius: '12px' }}
            onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found'; }}
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', display: 'inline-block', marginBottom: '1rem' }}>
            New Arrival
          </span>
          <h1 style={{ marginBottom: '1rem' }}>{product.name}</h1>
          <p style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '2rem' }}>
            ${product.price}
          </p>
          
          <div className="glass-card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Description</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
              {product.description || 'No description available for this product.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button 
              onClick={() => {
                dispatch(addToCart(product));
              }} 
              style={{ flex: 1, padding: '1.25rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}
            >
              Add to Cart
            </button>
            <button 
              onClick={() => {
                navigate('/checkout', { state: { singleProduct: { ...product, quantity: 1 } } });
              }}
              style={{ flex: 1.5, padding: '1.25rem' }}
            >
              Buy Now
            </button>
            <button 
              onClick={() => dispatch(toggleWishlist(product))}
              style={{ 
                padding: '1.25rem', 
                backgroundColor: 'rgba(255,255,255,0.05)', 
                border: '1px solid var(--glass-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '60px'
              }}
              title="Add to Wishlist"
            >
              ❤️
            </button>
          </div>


        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;
