import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../utils/urlHelper';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await api.get(`/user/orders/${id}`);
        setOrder(response.data.data);
      } catch (error) {
        toast.error('Failed to fetch order details');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, navigate]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '#f59e0b';
      case 'completed':
      case 'delivered': return 'var(--success)';
      case 'cancelled': return 'var(--error)';
      default: return 'var(--text-muted)';
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '5rem' }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading order details...</p>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="page-container">
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <button 
              onClick={() => navigate('/dashboard')}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '0.5rem', padding: 0 }}
            >
              ← Back to Dashboard
            </button>
            <h1 style={{ fontSize: '1.75rem' }}>Order Details #{order.id}</h1>
          </motion.div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ 
              padding: '0.5rem 1.25rem', 
              borderRadius: '30px', 
              background: `${getStatusColor(order.status)}15`, 
              color: getStatusColor(order.status),
              fontWeight: '700',
              fontSize: '0.9rem',
              textTransform: 'capitalize',
              border: `1px solid ${getStatusColor(order.status)}30`
            }}>
              {order.status}
            </span>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Payment ID</p>
            <p style={{ fontWeight: '700' }}>{order.payment_id}</p>
          </div>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Payment Method</p>
            <p style={{ fontWeight: '700' }}>{order.payment_method}</p>
          </div>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Order Date</p>
            <p style={{ fontWeight: '700' }}>{new Date(order.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="glass-card" style={{ marginBottom: '2rem', padding: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: '700' }}>Items Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {order.items?.map((item) => (
              <div key={item.id} style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', padding: '1rem', background: 'var(--panel-bg)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '10px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                  <img 
                    src={getImageUrl(item.product, '60x60')} 
                    alt={item.product?.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/60x60?text=No+Img'; }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: '700', fontSize: '1rem' }}>{item.product?.name}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Qty: {item.quantity} × ${Number(item.unit_price).toFixed(2)}</p>
                </div>
                <p style={{ fontWeight: '800', fontSize: '1.1rem' }}>${(item.quantity * item.unit_price).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
             <div style={{ textAlign: 'right', minWidth: '200px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                   <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                   <span style={{ fontWeight: '600' }}>${Number(order.total_price).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                   <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
                   <span style={{ color: 'var(--success)', fontWeight: '600' }}>FREE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                   <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>Total Amount</span>
                   <span style={{ fontWeight: '800', fontSize: '1.5rem', color: 'var(--primary)' }}>${Number(order.total_price).toFixed(2)}</span>
                </div>
             </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: '700' }}>Shipping Information</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
            {order.shipping_address}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
