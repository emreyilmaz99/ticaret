import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAdminProfile } from '../../auth/api/authApi';
import { FaWallet, FaShoppingBag, FaUsers, FaArrowUp } from 'react-icons/fa';

export const DashboardStats = () => {
  const { data: admin, isLoading: loading } = useQuery({
    queryKey: ['adminProfile'],
    queryFn: async () => {
      const response = await getAdminProfile();
      return response.data.data;
    },
    staleTime: 1000 * 60 * 30, // 30 dakika boyunca profili tekrar çekme
  });

  if (loading) return <div style={{ padding: '20px', color: 'var(--text-muted)' }}>Veriler yükleniyor...</div>;

  // İstatistik Kartı Bileşeni (Tekrar kullanmak için)
  const StatCard = ({ title, value, icon, color, trend }) => (
    <div style={{ 
      backgroundColor: 'var(--bg-card)', 
      padding: '24px', 
      borderRadius: 'var(--radius)', 
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      border: '1px solid #e2e8f0'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>{title}</p>
          <h3 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-main)', marginTop: '4px' }}>{value}</h3>
        </div>
        <div style={{ 
          backgroundColor: color + '20', // Rengin %20 opak hali
          color: color, 
          padding: '12px', 
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon}
        </div>
      </div>
      
      {trend && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#10b981', fontWeight: '500' }}>
          <FaArrowUp size={10} />
          <span>{trend}</span>
          <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>geçen aya göre</span>
        </div>
      )}
    </div>
  );

  return (
    <div>
      {/* ÜST BİLGİ KARTI */}
      <div style={{ 
        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', 
        color: '#ffffff',
        padding: '28px 32px', 
        borderRadius: '16px', 
        marginBottom: '32px',
        boxShadow: 'none',
        border: '1px solid #e2e8f0',
      }}>
        <h1 style={{ 
          fontSize: '26px', 
          fontWeight: '800', 
          marginBottom: '6px',
          letterSpacing: '-0.02em',
          margin: 0,
          color: '#ffffff',
        }}>
          Hoş Geldin, {admin?.name} 👋
        </h1>
        <p style={{ 
          fontSize: '15px',
          margin: '6px 0 0 0',
          color: '#ffffff',
          opacity: 0.9,
        }}>
          Bugün mağazanda neler olup bittiğine bir göz atalım.
        </p>
      </div>

      {/* İSTATİSTİKLER GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        <StatCard 
          title="Toplam Satış" 
          value="₺124,500" 
          icon={<FaWallet size={20} />} 
          color="#4f46e5" // Indigo
          trend="%12.5"
        />
        <StatCard 
          title="Yeni Siparişler" 
          value="45" 
          icon={<FaShoppingBag size={20} />} 
          color="#f59e0b" // Amber
          trend="%8.2"
        />
        <StatCard 
          title="Aktif Kullanıcılar" 
          value="1,203" 
          icon={<FaUsers size={20} />} 
          color="#10b981" // Emerald
          trend="%2.1"
        />
      </div>
    </div>
  );
};
