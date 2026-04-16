import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { clearCart } from '../store/slices/cartSlice';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/client';



const Checkout = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if this is a single product checkout
  const singleProduct = location.state?.singleProduct;
  const { items: cartItems } = useSelector((state) => state.cart);
  const checkoutItems = singleProduct ? [singleProduct] : cartItems;
  
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [shipping, setShipping] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    address: '',
    city: '',
    postalCode: ''
  });

  // Redirect if cart is empty and not a single product checkout
  useEffect(() => {
    if (checkoutItems.length === 0 && step !== 3) {
      navigate('/cart');
    }
  }, [checkoutItems.length, navigate, step]);

  const total = checkoutItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);


  const handleComplete = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        items: checkoutItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity || 1
        })),
        shipping_address: `${shipping.firstName} ${shipping.lastName}, ${shipping.address}, ${shipping.city}, ${shipping.postalCode}`,
        payment_method: 'Stripe' // Default for now as per docs
      };

      const response = await api.post('/user/checkout', payload);
      setOrderId(response.data.id || response.data.order_id || 'GRAV-' + Math.floor(Math.random() * 90000));
      if (!singleProduct) {
        dispatch(clearCart());
      }
      setStep(3);
    } catch (err) {
      console.error('Checkout failed:', err);
      setError(err.response?.data?.message || 'Checkout failed. Please check your stock or connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleShippingChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  return (
    <div className="page-container">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', position: 'relative' }}>
          <div style={{ textAlign: 'center', flex: 1, zIndex: 1 }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: step >= 1 ? 'var(--primary)' : 'var(--panel-bg)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem', fontWeight: 'bold' }}>1</div>
            <span style={{ fontSize: '0.8rem', color: step >= 1 ? 'var(--text-main)' : 'var(--text-muted)' }}>Shipping</span>
          </div>
          <div style={{ textAlign: 'center', flex: 1, zIndex: 1 }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: step >= 2 ? 'var(--primary)' : 'var(--panel-bg)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem', fontWeight: 'bold' }}>2</div>
            <span style={{ fontSize: '0.8rem', color: step >= 2 ? 'var(--text-main)' : 'var(--text-muted)' }}>Payment</span>
          </div>
          <div style={{ textAlign: 'center', flex: 1, zIndex: 1 }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: step >= 3 ? 'var(--success)' : 'var(--panel-bg)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem', fontWeight: 'bold' }}>3</div>
            <span style={{ fontSize: '0.8rem', color: step >= 3 ? 'var(--text-main)' : 'var(--text-muted)' }}>Success</span>
          </div>
          <div style={{ position: 'absolute', top: '20px', left: '16%', right: '16%', height: '2px', background: 'var(--glass-border)', zIndex: 0 }}></div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-card">
              <h2 style={{ marginBottom: '1.5rem' }}>Shipping Information</h2>
              <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <input type="text" name="firstName" placeholder="First Name" required value={shipping.firstName} onChange={handleShippingChange} />
                  <input type="text" name="lastName" placeholder="Last Name" required value={shipping.lastName} onChange={handleShippingChange} />
                </div>
                <input type="text" name="address" placeholder="Address Line 1" required value={shipping.address} onChange={handleShippingChange} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <input type="text" name="city" placeholder="City" required value={shipping.city} onChange={handleShippingChange} />
                  <input type="text" name="postalCode" placeholder="Postal Code" required value={shipping.postalCode} onChange={handleShippingChange} />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Continue to Payment</button>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-card">
              <h2 style={{ marginBottom: '1.5rem' }}>Payment Method</h2>
              
              {error && (
                <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--error)', borderRadius: '8px', color: 'var(--error)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  {error}
                </div>
              )}

              <div style={{ padding: '1.5rem', border: '2px solid var(--primary)', borderRadius: '12px', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(var(--primary-rgb), 0.05)' }}>
                <div>
                  <p style={{ fontWeight: '600' }}>Credit / Debit Card</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Visa, Mastercard, Amex</p>
                </div>
                <span style={{ fontSize: '1.5rem' }}>💳</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input type="text" placeholder="Card Number" defaultValue="4242 4242 4242 4242" disabled />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <input type="text" placeholder="MM / YY" defaultValue="12/28" disabled />
                  <input type="password" placeholder="CVC" defaultValue="123" disabled />
                </div>
              </div>

              <div style={{ marginTop: '2.5rem', padding: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Shipping To:</span>
                    <span style={{ maxWidth: '200px', textAlign: 'right', fontSize: '0.9rem' }}>{shipping.address}, {shipping.city}</span>
                 </div>
                 <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)', margin: '0.8rem 0' }} />
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Subtotal ({checkoutItems.length} {checkoutItems.length === 1 ? 'item' : 'items'})</span>
                    <span>${total.toFixed(2)}</span>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
                    <span style={{ color: 'var(--success)', fontWeight: '600' }}>FREE</span>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: '700' }}>
                    <span>Total Amount</span>
                    <span style={{ color: 'var(--primary)' }}>${total.toFixed(2)}</span>
                 </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, backgroundColor: 'transparent', border: '1px solid var(--glass-border)' }}>Back</button>
                <button 
                  onClick={handleComplete} 
                  className="btn-primary" 
                  style={{ flex: 2 }}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Pay & Complete Order'}
                </button>
              </div>
            </motion.div>

          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🎉</div>
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Order Confirmed!</h2>
              <p style={{ color: 'var(--text-muted)', margin: '1.5rem 0', fontSize: '1.1rem', lineHeight: '1.6' }}>
                Thank you for your purchase. Your order number is <strong style={{ color: 'var(--text-main)' }}>#{orderId}</strong>.<br/>
                We've processed your payment of <strong style={{ color: 'var(--primary)' }}>${total.toFixed(2)}</strong> for {checkoutItems.length} {checkoutItems.length === 1 ? 'item' : 'items'}.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                <button onClick={() => navigate('/dashboard')} style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}>View My Orders</button>
                <button className="btn-primary" onClick={() => navigate('/')}>Back to Shop</button>
              </div>
            </motion.div>

          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Checkout;
