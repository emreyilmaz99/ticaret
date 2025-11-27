import React from 'react';
import { FaWallet, FaShoppingBag, FaBox, FaStar, FaArrowUp, FaArrowDown, FaBell, FaCalendarAlt } from 'react-icons/fa';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const VendorDashboard = () => {
  // Mock Data - Backend bağlandığında burası API'den gelecek
  const stats = [
    { title: 'Toplam Kazanç', value: '₺124,500', icon: <FaWallet />, change: '+12.5%', isPositive: true, color: '#10b981' },
    { title: 'Toplam Sipariş', value: '1,240', icon: <FaShoppingBag />, change: '+8.2%', isPositive: true, color: '#3b82f6' },
    { title: 'Aktif Ürünler', value: '48', icon: <FaBox />, change: '-2.4%', isPositive: false, color: '#f59e0b' },
    { title: 'Mağaza Puanı', value: '4.8', icon: <FaStar />, change: '+0.1', isPositive: true, color: '#8b5cf6' },
  ];

  const topProducts = [
    { name: 'Kablosuz Kulaklık Pro', sales: 124, revenue: '₺161,076', image: 'https://placehold.co/40' },
    { name: 'Akıllı Saat Series 5', sales: 89, revenue: '₺311,411', image: 'https://placehold.co/40' },
    { name: 'Mekanik Klavye RGB', sales: 56, revenue: '₺120,400', image: 'https://placehold.co/40' },
  ];

  const revenueData = [
    { name: 'Pzt', value: 4000 },
    { name: 'Sal', value: 3000 },
    { name: 'Çar', value: 2000 },
    { name: 'Per', value: 2780 },
    { name: 'Cum', value: 1890 },
    { name: 'Cmt', value: 2390 },
    { name: 'Paz', value: 3490 },
  ];

  const ordersData = [
    { name: 'Pzt', orders: 24 },
    { name: 'Sal', orders: 18 },
    { name: 'Çar', orders: 12 },
    { name: 'Per', orders: 16 },
    { name: 'Cum', orders: 10 },
    { name: 'Cmt', orders: 15 },
    { name: 'Paz', orders: 20 },
  ];

  const recentOrders = [
    { id: '#SIP-1024', customer: 'Ahmet Yılmaz', product: 'Kablosuz Kulaklık', date: '10 Dakika önce', amount: '₺1,299', status: 'Bekliyor' },
    { id: '#SIP-1023', customer: 'Ayşe Demir', product: 'Akıllı Saat', date: '2 Saat önce', amount: '₺3,499', status: 'Hazırlanıyor' },
    { id: '#SIP-1022', customer: 'Mehmet Kaya', product: 'Laptop Çantası', date: '5 Saat önce', amount: '₺450', status: 'Kargolandı' },
    { id: '#SIP-1021', customer: 'Zeynep Çelik', product: 'USB Hub', date: '1 Gün önce', amount: '₺299', status: 'Teslim Edildi' },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Bekliyor': return { backgroundColor: '#fef3c7', color: '#d97706' };
      case 'Hazırlanıyor': return { backgroundColor: '#dbeafe', color: '#2563eb' };
      case 'Kargolandı': return { backgroundColor: '#e0e7ff', color: '#4f46e5' };
      case 'Teslim Edildi': return { backgroundColor: '#dcfce7', color: '#16a34a' };
      default: return { backgroundColor: '#f3f4f6', color: '#4b5563' };
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#1e293b' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '8px' }}>
            Mağaza Paneli
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px' }}>
            Hoşgeldiniz, mağazanızın performans özeti burada.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Date Filter */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            backgroundColor: 'white', 
            padding: '10px 16px', 
            borderRadius: '10px', 
            border: '1px solid #e2e8f0',
            color: '#475569',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            <FaCalendarAlt /> Bu Hafta
          </div>

          {/* Notification Bell */}
          <div style={{ 
            width: '42px', 
            height: '42px', 
            backgroundColor: 'white', 
            borderRadius: '10px', 
            border: '1px solid #e2e8f0', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#64748b',
            cursor: 'pointer',
            position: 'relative'
          }}>
            <FaBell />
            <div style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%' }}></div>
          </div>

          <button style={{ 
            padding: '10px 20px', 
            backgroundColor: '#14532d', 
            border: 'none', 
            borderRadius: '10px', 
            fontWeight: '600', 
            color: 'white',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(20, 83, 45, 0.2)',
            transition: 'all 0.2s'
          }}>
            Yeni Ürün Ekle
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
        {stats.map((stat, index) => (
          <div key={index} style={{ 
            backgroundColor: 'white', 
            padding: '24px', 
            borderRadius: '16px', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
            border: '1px solid #f1f5f9'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px', 
                backgroundColor: `${stat.color}15`, 
                color: stat.color,
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                {stat.icon}
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px', 
                fontSize: '12px', 
                fontWeight: '600',
                color: stat.isPositive ? '#10b981' : '#ef4444',
                backgroundColor: stat.isPositive ? '#ecfdf5' : '#fef2f2',
                padding: '4px 8px',
                borderRadius: '20px'
              }}>
                {stat.isPositive ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
                {stat.change}
              </div>
            </div>
            <h3 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>{stat.value}</h3>
            <p style={{ color: '#64748b', fontSize: '13px', fontWeight: '500' }}>{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
        {/* Revenue Chart */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '24px', 
          borderRadius: '16px', 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)',
          border: '1px solid #f1f5f9'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '24px' }}>Haftalık Gelir Analizi</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: 'white' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products Widget (Replaces Orders Chart for now, or sits beside it if we had space, but let's stack or replace) */}
        {/* Actually, let's keep Orders Chart and add Top Products below or beside. 
            The user asked for "Top Products" to be added. 
            Let's put Top Products in the right column instead of Orders Chart, 
            and maybe move Orders Chart to full width or remove it if space is tight?
            Let's keep the layout 2fr 1fr. 
            Left: Revenue. Right: Top Products.
        */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '24px', 
          borderRadius: '16px', 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)',
          border: '1px solid #f1f5f9',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '24px' }}>Çok Satanlar</h3>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {topProducts.map((product, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '16px', borderBottom: index !== topProducts.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <img src={product.image} alt={product.name} style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: '#f1f5f9' }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', margin: 0 }}>{product.name}</h4>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>{product.sales} Satış</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#10b981' }}>{product.revenue}</span>
                </div>
              </div>
            ))}
            <button style={{ marginTop: 'auto', width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: 'white', color: '#475569', fontWeight: '600', cursor: 'pointer' }}>
              Tümünü Gör
            </button>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '24px', 
        borderRadius: '16px', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)',
        border: '1px solid #f1f5f9'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>Son Siparişler</h3>
          <button style={{ color: '#3b82f6', background: 'none', border: 'none', fontWeight: '600', cursor: 'pointer' }}>
            Tümünü Gör
          </button>
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
              <th style={{ textAlign: 'left', padding: '12px', color: '#64748b', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Sipariş No</th>
              <th style={{ textAlign: 'left', padding: '12px', color: '#64748b', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Müşteri</th>
              <th style={{ textAlign: 'left', padding: '12px', color: '#64748b', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Ürün</th>
              <th style={{ textAlign: 'left', padding: '12px', color: '#64748b', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Tarih</th>
              <th style={{ textAlign: 'left', padding: '12px', color: '#64748b', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Tutar</th>
              <th style={{ textAlign: 'left', padding: '12px', color: '#64748b', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Durum</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order, index) => (
              <tr key={index} style={{ borderBottom: index !== recentOrders.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                <td style={{ padding: '16px 12px', fontWeight: '600', color: '#0f172a' }}>{order.id}</td>
                <td style={{ padding: '16px 12px', color: '#475569' }}>{order.customer}</td>
                <td style={{ padding: '16px 12px', color: '#475569' }}>{order.product}</td>
                <td style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '13px' }}>{order.date}</td>
                <td style={{ padding: '16px 12px', fontWeight: '600', color: '#0f172a' }}>{order.amount}</td>
                <td style={{ padding: '16px 12px' }}>
                  <span style={{ 
                    ...getStatusStyle(order.status),
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorDashboard;
