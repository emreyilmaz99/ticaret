// src/components/admin/AdminSidebar.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaHome, FaBox, FaUsers, FaSignOutAlt, FaStore, 
  FaUserShield, FaPercentage, FaLeaf, FaLayerGroup, FaShoppingBag, FaReceipt, FaStar, FaCommentAlt,
  FaChevronDown, FaChevronRight, FaUserCheck, FaUserClock, FaTags
} from 'react-icons/fa';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  const toggleGroup = (groupKey) => {
    setExpandedGroups(prev => 
      prev.includes(groupKey) 
        ? prev.filter(key => key !== groupKey)
        : [...prev, groupKey] 
    );
  };

  // Kategorize edilmiş menü yapısı
  const menuGroups = [
    {
      key: 'genel',
      label: 'Genel',
      items: [
        { path: '/admin/dashboard', icon: FaHome, label: 'Özet' },
      ]
    },
    {
      key: 'saticilar',
      label: 'Satıcı Yönetimi',
      icon: FaStore,
      items: [
        { path: '/admin/active-vendors', icon: FaUserCheck, label: 'Aktif Satıcılar' },
        { path: '/admin/vendors', icon: FaUserClock, label: 'Başvuru Onayları' },
        { path: '/admin/vendor-applications', icon: FaUsers, label: 'Ön Başvurular' },
      ]
    },
    {
      key: 'urunler',
      label: 'Ürün Yönetimi',
      icon: FaBox,
      items: [
        { path: '/admin/products', icon: FaBox, label: 'Ürünler' },
        { path: '/admin/categories', icon: FaLayerGroup, label: 'Kategoriler' },
        { path: '/admin/featured-deals', icon: FaStar, label: 'Öne Çıkan Ürünler' },
      ]
    },
    {
      key: 'siparis',
      label: 'Sipariş & Satış',
      icon: FaShoppingBag,
      items: [
        { path: '/admin/orders', icon: FaShoppingBag, label: 'Siparişler' },
        { path: '/admin/reviews', icon: FaCommentAlt, label: 'Değerlendirmeler' },
      ]
    },
    {
      key: 'finans',
      label: 'Finansal İşlemler',
      icon: FaPercentage,
      items: [
        { path: '/admin/commission-plans', icon: FaPercentage, label: 'Komisyon Planları' },
        { path: '/admin/tax-classes', icon: FaReceipt, label: 'Vergi Sınıfları (KDV)' },
      ]
    },
    {
      key: 'kullanici',
      label: 'Kullanıcı Yönetimi',
      icon: FaUsers,
      items: [
        { path: '/admin/users', icon: FaUsers, label: 'Kullanıcılar' },
        { path: '/admin/admins', icon: FaUserShield, label: 'Yöneticiler' },
      ]
    },
  ];

  // Menü item component'i
  const MenuItem = ({ item }) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;
    
    return (
      <Link 
        to={item.path} 
        style={{
          color: isActive ? 'white' : '#94a3b8',
          backgroundColor: isActive ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 16px',
          paddingLeft: '40px',
          borderRadius: '8px',
          transition: 'all 0.2s ease',
          fontWeight: isActive ? '600' : '500',
          fontSize: '13px',
          position: 'relative',
          borderLeft: isActive ? '3px solid #10b981' : '3px solid transparent',
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = 'rgba(148, 163, 184, 0.1)';
            e.currentTarget.style.color = '#cbd5e1';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#94a3b8';
          }
        }}
      >
        <Icon size={14} />
        <span>{item.label}</span>
        {isActive && (
          <div style={{
            marginLeft: 'auto',
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            animation: 'pulse 2s infinite',
          }} />
        )}
      </Link>
    );
  };

  // Grup başlığı component'i
  const GroupHeader = ({ group }) => {
    const isExpanded = expandedGroups.includes(group.key);
    const Icon = group.icon;
    const hasActiveChild = group.items?.some(item => location.pathname === item.path);
    
    return (
      <div
        onClick={() => group.items && toggleGroup(group.key)}
        style={{
          color: hasActiveChild ? '#10b981' : '#cbd5e1',
          cursor: group.items ? 'pointer' : 'default',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 16px',
          borderRadius: '10px',
          transition: 'all 0.2s ease',
          fontWeight: '700',
          fontSize: '13px',
          backgroundColor: hasActiveChild ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
          marginTop: group.key === 'genel' ? '0' : '16px',
        }}
        onMouseEnter={(e) => {
          if (group.items) {
            e.currentTarget.style.backgroundColor = 'rgba(148, 163, 184, 0.1)';
          }
        }}
        onMouseLeave={(e) => {
          if (!hasActiveChild) {
            e.currentTarget.style.backgroundColor = 'transparent';
          } else {
            e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
          }
        }}
      >
        {Icon && <Icon size={16} />}
        <span style={{ flex: 1 }}>{group.label}</span>
        {group.items && (
          isExpanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />
        )}
      </div>
    );
  };

  return (
    <div style={{
      width: '260px',
      height: '100vh',
      background: 'linear-gradient(180deg, #052e16 0%, #064e3b 100%)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px',
      position: 'fixed',
      left: 0,
      top: 0,
      boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
      zIndex: 1000,
    }}>
      {/* LOGO ALANI */}
      <div style={{ marginBottom: '32px', paddingLeft: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
          }}>
            <FaLeaf size={20} color="white" />
          </div>
          <div>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: '700', 
              letterSpacing: '-0.5px', 
              color: 'white',
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}>
              Ticaret<span style={{ color: '#10b981' }}>Panel</span>
            </h2>
            <p style={{ fontSize: '11px', color: '#6ee7b7', marginTop: '2px', fontWeight: '500' }}>
              Yönetici Konsolu
            </p>
          </div>
        </div>
      </div>

      {/* MENÜ LİNKLERİ */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        flex: 1, 
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingRight: '4px',
      }}>
        {menuGroups.map(group => (
          <div key={group.key}>
            <GroupHeader group={group} />
            {group.items && expandedGroups.includes(group.key) && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                marginTop: '4px',
                marginBottom: '4px',
              }}>
                {group.items.map(item => (
                  <MenuItem key={item.path} item={item} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ÇIKIŞ BUTONU */}
      <button 
        onClick={handleLogout}
        style={{ 
          marginTop: 'auto', 
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
          color: '#fca5a5', 
          border: '1px solid rgba(239, 68, 68, 0.2)', 
          padding: '14px', 
          borderRadius: '12px', 
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          fontSize: '14px',
          fontWeight: '600',
          transition: 'all 0.25s ease',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.1) 100%)';
          e.currentTarget.style.color = '#f87171';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)';
          e.currentTarget.style.color = '#fca5a5';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <FaSignOutAlt /> Oturumu Kapat
      </button>

      {/* Pulse Animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default AdminSidebar;