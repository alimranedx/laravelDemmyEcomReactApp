import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromCart, updateQuantity } from '../store/slices/cartSlice';
import { motion } from 'framer-motion';
import { getImageUrl } from '../utils/urlHelper';


const Cart = () => {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);


  if (items.length === 0) {
    return (
      <div className="page-container" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h1>Your Cart is Empty</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Looks like you haven't added anything yet.</p>
        <Link to="/"><button>Go Shopping</button></Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>Shopping Cart</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          {items.map((item) => (
            <div key={item.id} style={{ display: 'flex', gap: '1.5rem', padding: '1rem 0', borderBottom: '1px solid var(--glass-border)', alignItems: 'center' }}>
              <img 
                src={getImageUrl(item)} 
                alt={item.name} 
                style={{ width: '80px', height: '80px', objectFit: 'contain', borderRadius: '8px', background: 'rgba(255,255,255,0.05)' }} 
              />
              <div style={{ flexGrow: 1 }}>
                <Link to={`/products/${item.id}`} style={{ textDecoration: 'none', color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: '600' }}>
                  {item.name}
                </Link>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>${item.price}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))} style={{ padding: '0.2rem 0.6rem', fontSize: '1rem' }}>-</button>
                <span style={{ width: '30px', textAlign: 'center' }}>{item.quantity}</span>
                <button onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))} style={{ padding: '0.2rem 0.6rem', fontSize: '1rem' }}>+</button>
              </div>
              <p style={{ fontWeight: '700', minWidth: '80px', textAlign: 'right' }}>${(item.price * item.quantity).toFixed(2)}</p>
              <button onClick={() => dispatch(removeFromCart(item.id))} style={{ backgroundColor: 'transparent', color: 'var(--error)', padding: '0.5rem', marginLeft: '1rem' }}>
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="glass-card" style={{ height: 'fit-content' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Order Summary</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span>Shipping</span>
            <span style={{ color: 'var(--success)' }}>FREE</span>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '1rem 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1.25rem', fontWeight: '700' }}>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <Link to="/checkout" style={{ width: '100%', display: 'block' }}>
            <button style={{ width: '100%', padding: '1rem' }}>Proceed to Checkout</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
