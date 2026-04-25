import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';


import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import api from '../api/client';
import { motion } from 'framer-motion';
import { getImageUrl } from '../utils/urlHelper';
import ImageMagnifier from '../components/ImageMagnifier';
import toast from 'react-hot-toast';


const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);


  useEffect(() => {

    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
        // Initialize selected image with primary image path
        setSelectedImage(response.data.image_path);
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

  const allImages = product.images && product.images.length > 0 
    ? [product.image_path, ...product.images.filter(img => img.image_path !== product.image_path).map(img => img.image_path)]
    : [product.image_path];

  return (
    <div className="page-container">
      <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-block', marginBottom: '2rem' }}>
        &larr; Back to Catalog
      </Link>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem', alignItems: 'start', position: 'relative' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', zIndex: 10 }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            key={selectedImage} // Force re-animation on image change
            className="glass-card"
            style={{ padding: '1rem', display: 'flex', justifyContent: 'center', minHeight: '400px' }}
          >
            <ImageMagnifier 
              src={getImageUrl(selectedImage)} 
              width="100%"
              height="500px"
              zoomLevel={2.5}
            />
          </motion.div>

          {/* Thumbnail Gallery */}
          {allImages.length > 1 && (
            <div style={{ display: 'flex', gap: '0.8rem', overflowX: 'auto', padding: '0.5rem 0' }} className="custom-scrollbar">
              {allImages.map((img, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(img)}
                  style={{ 
                    width: '80px', 
                    height: '80px', 
                    flexShrink: 0, 
                    cursor: 'pointer',
                    borderRadius: '8px',
                    border: `2px solid ${selectedImage === img ? 'var(--primary)' : 'var(--glass-border)'}`,
                    overflow: 'hidden',
                    backgroundColor: 'var(--panel-bg)'
                  }}
                >
                  <img 
                    src={getImageUrl(img, '100x100')} 
                    alt={`Thumbnail ${idx}`} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ position: 'relative', zIndex: 1 }}
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
                toast.success(`${product.name} added to cart`);
              }} 
              style={{ 
                flex: 1, 
                padding: '1.25rem', 
                background: 'transparent', 
                border: '2px solid var(--primary)',
                color: 'var(--primary)',
                fontWeight: '700'
              }}
            >
              🛒 Add to Cart
            </button>
            <button 
              onClick={() => {
                navigate('/checkout', { state: { singleProduct: { ...product, quantity: 1 } } });
              }}
              style={{ flex: 1.5, padding: '1.25rem' }}
            >
              ⚡ Buy Now
            </button>
            {token && (
              <button 
                onClick={() => {
                  dispatch(toggleWishlist(product));
                  const isWishlisted = wishlistItems.some(item => item.id === product.id);
                  if (isWishlisted) {
                    toast.success('Removed from wishlist');
                  } else {
                    toast.success('Added to wishlist');
                  }
                }}
                style={{ 
                  padding: '1.25rem', 
                  backgroundColor: 'var(--panel-bg)', 
                  border: '1px solid var(--glass-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '60px',
                  color: 'var(--text-main)'
                }}
                title="Add to Wishlist"
              >
                ❤️
              </button>
            )}
          </div>


        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;
