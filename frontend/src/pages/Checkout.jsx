import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { clearCart, updateQuantity } from '../store/slices/cartSlice';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/client';

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // { orderId, total, phone }
  const navigate = useNavigate();
  const location = useLocation();

  const singleProduct = location.state?.singleProduct;
  const [singleProductQty, setSingleProductQty] = useState(singleProduct?.quantity || 1);
  const { items: cartItems } = useSelector((state) => state.cart);
  const checkoutItems = singleProduct 
    ? [{ ...singleProduct, quantity: singleProductQty }] 
    : cartItems;
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'Cash on Delivery',
  });

  // Redirect if there's nothing to checkout
  useEffect(() => {
    if (checkoutItems.length === 0 && !success) {
      navigate('/');
    }
  }, [checkoutItems.length, navigate, success]);

  const total = checkoutItems.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const shippingAddress = [
      form.name,
      form.phone,
      form.address,
      form.city,
      form.postalCode,
    ]
      .filter(Boolean)
      .join(', ');

    try {
      let response;

      if (token) {
        // Logged-in user — authenticated endpoint
        response = await api.post('/user/checkout', {
          items: checkoutItems.map((item) => ({
            product_id: item.id,
            quantity: item.quantity || 1,
          })),
          shipping_address: shippingAddress,
          payment_method: form.paymentMethod,
        });
        if (!singleProduct) dispatch(clearCart());
      } else {
        // Guest — public COD endpoint
        response = await api.post('/guest-checkout', {
          items: checkoutItems.map((item) => ({
            product_id: item.id,
            quantity: item.quantity || 1,
          })),
          guest_phone: form.phone,
          shipping_address: shippingAddress,
        });
        if (!singleProduct) dispatch(clearCart());
      }

      const data = response.data?.data;
      setSuccess({
        orderId: data?.id || 'ORD-' + Math.floor(Math.random() * 90000),
        total,
        phone: form.phone,
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Could not place your order. Please check your details and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ─── Success Screen ────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card"
          style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center', padding: '3rem 2rem' }}
        >
          <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🎉</div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Order Placed!</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.7', marginBottom: '0.5rem' }}>
            Your order <strong style={{ color: 'var(--text-main)' }}>#{success.orderId}</strong> has been confirmed.
          </p>
          <p style={{ color: 'var(--primary)', fontSize: '1.4rem', fontWeight: '800', marginBottom: '1.5rem' }}>
            ${success.total.toFixed(2)}
          </p>

          <div style={{
            padding: '1rem 1.5rem',
            background: 'rgba(16,185,129,0.07)',
            border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: '12px',
            marginBottom: '2rem',
          }}>
            <p style={{ fontWeight: '600', color: 'var(--success)' }}>🛵 Cash on Delivery</p>
            {success.phone && (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                We'll call <strong>{success.phone}</strong> to confirm your delivery.
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {token && (
              <button
                onClick={() => navigate('/dashboard')}
                style={{ background: 'transparent', border: '1px solid var(--glass-border)' }}
              >
                📦 My Orders
              </button>
            )}
            <button onClick={() => navigate('/')}>🛍️ Continue Shopping</button>
          </div>

          {!token && (
            <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '700' }}>
                Create an account
              </Link>{' '}
              to track your orders anytime.
            </p>
          )}
        </motion.div>
      </div>
    );
  }

  // ─── Checkout Form ─────────────────────────────────────────────────────────
  return (
    <div className="page-container">
      <div style={{ maxWidth: '820px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>

        {/* Left: Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card"
        >
          <h2 style={{ marginBottom: '0.4rem' }}>Delivery Details</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
            No account needed — just your phone and address.
          </p>

          {error && (
            <div style={{
              padding: '1rem',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid var(--error)',
              borderRadius: '10px',
              color: 'var(--error)',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label style={labelStyle}>Your Name (optional)</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Alimran"
              value={form.name}
              onChange={handleChange}
            />

            <label style={labelStyle}>Phone Number <span style={{ color: 'var(--error)' }}>*</span></label>
            <input
              type="tel"
              name="phone"
              placeholder="+880 1712 345678"
              required
              value={form.phone}
              onChange={handleChange}
              pattern="[+0-9\s\-]{7,20}"
              title="Enter a valid phone number"
            />

            <label style={labelStyle}>Delivery Address <span style={{ color: 'var(--error)' }}>*</span></label>
            <input
              type="text"
              name="address"
              placeholder="House No, Street, Area"
              required
              value={form.address}
              onChange={handleChange}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>City / District <span style={{ color: 'var(--error)' }}>*</span></label>
                <input
                  type="text"
                  name="city"
                  placeholder="Dhaka"
                  required
                  value={form.city}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label style={labelStyle}>Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  placeholder="1212"
                  value={form.postalCode}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Payment method — COD always available, card if logged in */}
            <label style={labelStyle}>Payment Method</label>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <label style={radioCard(form.paymentMethod === 'Cash on Delivery')}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash on Delivery"
                  checked={form.paymentMethod === 'Cash on Delivery'}
                  onChange={handleChange}
                  style={{ display: 'none' }}
                />
                <span style={{ fontSize: '1.3rem' }}>💵</span>
                <div>
                  <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>Cash on Delivery</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pay when received</p>
                </div>
              </label>

              {token && (
                <label style={radioCard(form.paymentMethod === 'Card')}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Card"
                    checked={form.paymentMethod === 'Card'}
                    onChange={handleChange}
                    style={{ display: 'none' }}
                  />
                  <span style={{ fontSize: '1.3rem' }}>💳</span>
                  <div>
                    <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>Card Payment</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Visa / Mastercard</p>
                  </div>
                </label>
              )}
            </div>

            <button
              type="submit"
              style={{ width: '100%', padding: '1.1rem', fontSize: '1rem' }}
              disabled={loading}
            >
              {loading ? '⏳ Placing Order...' : '🛵 Confirm Order'}
            </button>

            {!token && (
              <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700' }}>Sign in</Link>
                {' '}to track orders & use card payment
              </p>
            )}
          </form>
        </motion.div>

        {/* Right: Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card"
          style={{ padding: '1.5rem', position: 'sticky', top: '6rem' }}
        >
          <h3 style={{ marginBottom: '1.25rem', fontSize: '1rem', fontWeight: '700' }}>Order Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {checkoutItems.map((item) => (
              <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-main)', fontWeight: '600', flex: 1, marginRight: '0.5rem' }}>
                    {item.name}
                  </span>
                  <span style={{ fontWeight: '700', whiteSpace: 'nowrap' }}>
                    ${(item.price * (item.quantity || 1)).toFixed(2)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>${item.price} / unit</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button 
                      type="button"
                      onClick={() => {
                        if (singleProduct) {
                          setSingleProductQty(prev => Math.max(1, prev - 1));
                        } else {
                          dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }));
                        }
                      }}
                      style={{ padding: '0.1rem 0.5rem', fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}
                    >
                      -
                    </button>
                    <span style={{ fontSize: '0.9rem', width: '25px', textAlign: 'center', fontWeight: '700' }}>{item.quantity}</span>
                    <button 
                      type="button"
                      onClick={() => {
                        if (singleProduct) {
                          setSingleProductQty(prev => prev + 1);
                        } else {
                          dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }));
                        }
                      }}
                      style={{ padding: '0.1rem 0.5rem', fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
              <span style={{ color: 'var(--success)', fontWeight: '600' }}>FREE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: '800' }}>
              <span>Total</span>
              <span style={{ color: 'var(--primary)' }}>${total.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

const labelStyle = {
  display: 'block',
  marginBottom: '0.35rem',
  fontSize: '0.85rem',
  color: 'var(--text-muted)',
  fontWeight: '600',
};

const radioCard = (selected) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.85rem 1rem',
  borderRadius: '12px',
  border: `2px solid ${selected ? 'var(--primary)' : 'var(--glass-border)'}`,
  background: selected ? 'rgba(99,102,241,0.07)' : 'transparent',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
});

export default Checkout;
