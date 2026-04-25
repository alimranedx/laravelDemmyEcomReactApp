import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, fetchMe } from '../../store/slices/authSlice';
import api from '../../api/client';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { confirmAction } from '../../utils/alerts';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/user/dashboard');
      setMetrics(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchMe());
    fetchDashboardData();
  }, [dispatch]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
        fetchDashboardData();
        return;
    }
    setLoading(true);
    try {
      const response = await api.get(`/user/orders?q=${searchQuery}`);
      setMetrics(prev => ({
        ...prev,
        latest_orders: response.data.data
      }));
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleCancelOrder = async (orderId) => {
    const confirmed = await confirmAction({
      title: 'Cancel Order?',
      text: 'This action will revert your order and return items to stock.',
      confirmButtonText: 'Yes, Cancel',
      cancelButtonText: 'No, Keep it',
      danger: true
    });

    if (!confirmed) return;
    
    setCancellingId(orderId);
    try {
      await api.post(`/user/orders/${orderId}/cancel`);
      toast.success('Order cancelled successfully');
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Failed to cancel order:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b' };
      case 'completed':
      case 'delivered': return { bg: 'rgba(16, 185, 129, 0.1)', text: 'var(--success)' };
      case 'cancelled': return { bg: 'rgba(239, 68, 68, 0.1)', text: 'var(--error)' };
      default: return { bg: 'rgba(107, 114, 128, 0.1)', text: 'var(--text-muted)' };
    }
  };

  return (
    <div className="page-container">
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          User Dashboard
        </motion.h1>
        <button 
          onClick={handleLogout} 
          style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.6rem 1.2rem', borderRadius: '10px' }}
        >
          Sign Out
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card"
        >
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '600' }}>Profile Information</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
             <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 'bold', color: 'white', border: '3px solid var(--glass-border)' }}>
               {user?.name?.charAt(0) || 'U'}
             </div>
             <div>
               <p style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.25rem' }}>{user?.name || 'Loading...'}</p>
               <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user?.email}</p>
             </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card"
        >
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '600' }}>Account Statistics</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ textAlign: 'center', padding: '1.25rem', background: 'var(--panel-bg)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Orders</p>
              <p style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary)' }}>{metrics?.statistics?.total_orders || 0}</p>
            </div>
            <div style={{ textAlign: 'center', padding: '1.25rem', background: 'var(--panel-bg)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Member Since</p>
              <p style={{ fontSize: '1rem', fontWeight: '600' }}>{user?.created_at ? new Date(user.created_at).getFullYear() : '2026'}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card"
        style={{ marginTop: '2.5rem', overflowX: 'auto' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Recent Orders</h2>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', maxWidth: '350px', width: '100%' }}>
            <input 
              type="text" 
              placeholder="Search Payment ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', marginBottom: 0 }}
            />
            <button type="submit" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Search</button>
          </form>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
             <div className="spinner"></div>
             <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Fetching your history...</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                <th style={{ padding: '1.25rem 0', color: 'var(--text-muted)', fontWeight: '500', fontSize: '0.9rem' }}>Order ID</th>
                <th style={{ padding: '1.25rem 0', color: 'var(--text-muted)', fontWeight: '500', fontSize: '0.9rem' }}>Payment ID</th>
                <th style={{ padding: '1.25rem 0', color: 'var(--text-muted)', fontWeight: '500', fontSize: '0.9rem' }}>Date</th>
                <th style={{ padding: '1.25rem 0', color: 'var(--text-muted)', fontWeight: '500', fontSize: '0.9rem' }}>Status</th>
                <th style={{ padding: '1.25rem 0', color: 'var(--text-muted)', fontWeight: '500', fontSize: '0.9rem' }}>Total</th>
                <th style={{ padding: '1.25rem 0', color: 'var(--text-muted)', fontWeight: '500', fontSize: '0.9rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {metrics?.latest_orders?.map((order) => {
                const statusInfo = getStatusColor(order.status);
                return (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '1.25rem 0', fontWeight: '500' }}>#{order.id}</td>
                    <td style={{ padding: '1.25rem 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{order.payment_id}</td>
                    <td style={{ padding: '1.25rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: '1.25rem 0' }}>
                      <span style={{ 
                        padding: '0.35rem 0.85rem', 
                        borderRadius: '20px', 
                        fontSize: '0.75rem', 
                        fontWeight: '600',
                        backgroundColor: statusInfo.bg, 
                        color: statusInfo.text,
                        textTransform: 'capitalize'
                      }}>
                        {order.status || 'Pending'}
                      </span>
                    </td>
                    <td style={{ padding: '1.25rem 0', fontWeight: '700' }}>${order.total}</td>
                    <td style={{ padding: '1.25rem 0', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', background: 'var(--panel-bg)', color: 'var(--text-main)', border: '1px solid var(--glass-border)' }}>Details</button>
                        {(order.status?.toLowerCase() === 'pending' || !order.status) && (
                          <button 
                            onClick={() => handleCancelOrder(order.id)}
                            disabled={cancellingId === order.id}
                            style={{ 
                              padding: '0.4rem 0.8rem', 
                              fontSize: '0.75rem', 
                              backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                              color: 'var(--error)', 
                              border: '1px solid rgba(239, 68, 68, 0.2)' 
                            }}
                          >
                            {cancellingId === order.id ? '...' : 'Cancel'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {(!metrics?.latest_orders || metrics.latest_orders.length === 0) && (
                <tr>
                  <td colSpan="5" style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>No recent orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
