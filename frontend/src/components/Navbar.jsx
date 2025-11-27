import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', backgroundColor: '#333', color: 'white' }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '20px' }}>E-Ticaret</Link>
      <div>
        <Link to="/" style={{ color: 'white', marginRight: '15px' }}>Anasayfa</Link>
        <Link to="/products" style={{ color: 'white' }}>Ürünler</Link>
      </div>
      <div>
        <FaUser style={{ marginRight: '10px' }} />
        <FaShoppingCart />
      </div>
    </nav>
  );
};

export default Navbar;