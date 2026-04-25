import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../api/client';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/auth/register', formData);
      toast.success('Registration successful! Please sign in.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please check your details.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
        style={{ width: '100%', maxWidth: '450px' }}
      >
        <h1 style={{ fontSize: '1.8rem', textAlign: 'center' }}>Create Account</h1>
        {error && <p style={{ color: 'var(--error)', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>Full Name</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              placeholder="Jane Doe"
              required 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>Email Address</label>
            <input 
              type="email" 
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              placeholder="jane@example.com"
              required 
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>Password</label>
              <input 
                type="password" 
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                placeholder="••••••••"
                required 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>Confirm</label>
              <input 
                type="password" 
                value={formData.password_confirmation} 
                onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})} 
                placeholder="••••••••"
                required 
              />
            </div>
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', marginTop: '1.5rem' }}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
