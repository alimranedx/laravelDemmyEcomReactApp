import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/client';
import toast from 'react-hot-toast';

const TrackOrder = () => {
  const [paymentId, setPaymentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!paymentId.trim()) return;

    setLoading(true);
    setOrder(null);
    try {
      const response = await api.get(`/track-order/${paymentId.trim()}`);
      setOrder(response.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order not found');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'var(--success)';
      case 'pending': return '#f59e0b';
      case 'processing': return 'var(--primary)';
      case 'cancelled': return 'var(--error)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div className="page-container">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
          style={{ textAlign: 'center', padding: '3rem 2rem', marginBottom: '2rem' }}
        >
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Track Your Order</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Enter your unique Payment ID to see the current status of your delivery.
          </p>

          <form onSubmit={handleTrack} style={{ display: 'flex', gap: '1rem', maxWidth: '500px', margin: '0 auto' }}>
            <input 
              type="text" 
              value={paymentId} 
              onChange={(e) => setPaymentId(e.target.value)} 
              placeholder="e.g. PAY-XXXX-XXXX"
              required 
              style={{ marginBottom: 0 }}
            />
            <button type="submit" disabled={loading} style={{ whiteSpace: 'nowrap' }}>
              {loading ? 'Searching...' : 'Track Now'}
            </button>
          </form>
        </motion.div>

        <AnimatePresence>
          {order && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card"
              style={{ padding: '2.5rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Order Information</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Placed on {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ 
                    padding: '0.5rem 1.25rem', 
                    borderRadius: '30px', 
                    background: `${getStatusColor(order.status)}15`, 
                    color: getStatusColor(order.status),
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    border: `1px solid ${getStatusColor(order.status)}30`
                  }}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div style={{ padding: '1.25rem', background: 'var(--panel-bg)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Payment ID</p>
                  <p style={{ fontWeight: '700' }}>{order.payment_id}</p>
                </div>
                <div style={{ padding: '1.25rem', background: 'var(--panel-bg)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Payment Method</p>
                  <p style={{ fontWeight: '700' }}>{order.payment_method}</p>
                </div>
                <div style={{ padding: '1.25rem', background: 'var(--panel-bg)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Total Amount</p>
                  <p style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '1.25rem' }}>${Number(order.total_price).toFixed(2)}</p>
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>Items Ordered</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {order.items?.map((item) => (
                    <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', background: 'var(--panel-bg)', borderRadius: '12px' }}>
                      <div style={{ width: '50px', height: '50px', borderRadius: '8px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        <img src={item.product?.image_url} alt={item.product?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: '600', fontSize: '0.95rem' }}>{item.product?.name}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Qty: {item.quantity} × ${Number(item.price).toFixed(2)}</p>
                      </div>
                      <p style={{ fontWeight: '700' }}>${(item.quantity * item.price).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Shipping Address</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>{order.shipping_address}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TrackOrder;
