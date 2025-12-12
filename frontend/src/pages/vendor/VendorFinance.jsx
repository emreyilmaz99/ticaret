import React from 'react';
import { FaWallet, FaArrowUp, FaArrowDown, FaHistory, FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';

const VendorFinance = () => {
  const transactions = [
    { id: 'TRX-9876', date: '27 Kas 2025', type: 'payout', description: 'Haftalık Ödeme', amount: '₺12,450.00', status: 'completed' },
    { id: 'TRX-9875', date: '26 Kas 2025', type: 'sale', description: 'Sipariş #1024 Geliri', amount: '₺1,299.00', status: 'completed' },
    { id: 'TRX-9874', date: '25 Kas 2025', type: 'refund', description: 'İade #1019', amount: '-₺450.00', status: 'completed' },
    { id: 'TRX-9873', date: '24 Kas 2025', type: 'sale', description: 'Sipariş #1022 Geliri', amount: '₺3,499.00', status: 'pending' },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#1e293b' }}>
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '24px',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        padding: '28px 32px',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>Finans & Ödemeler</h1>
          <p style={{ color: '#64748b', fontSize: '15px', margin: '6px 0 0 0' }}>Kazançlarınızı ve ödeme geçmişinizi buradan takip edin</p>
        </div>
      </div>

      {/* Wallet Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        {/* Main Wallet Card */}
        <div style={{ 
          backgroundColor: '#14532d', 
          backgroundImage: 'linear-gradient(135deg, #14532d 0%, #064e3b 100%)',
          borderRadius: '24px', 
          padding: '32px', 
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}>
          <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.1 }}>
            <FaWallet size={150} />
          </div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: '14px', opacity: 0.8, marginBottom: '8px' }}>Çekilebilir Bakiye</p>
            <h2 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '24px', letterSpacing: '-1px' }}>₺24,850.50</h2>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{ 
                backgroundColor: 'white', 
                color: '#14532d', 
                border: 'none', 
                padding: '12px 24px', 
                borderRadius: '12px', 
                fontWeight: '700', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}>
                <FaMoneyBillWave /> Para Çek
              </button>
              <button style={{ 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                color: 'white', 
                border: '1px solid rgba(255,255,255,0.3)', 
                padding: '12px 24px', 
                borderRadius: '12px', 
                fontWeight: '600', 
                cursor: 'pointer' 
              }}>
                Hesap Ayarları
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '20px', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: '#fef3c7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', marginBottom: '16px' }}>
            <FaHistory size={20} />
          </div>
          <p style={{ color: '#64748b', fontSize: '13px', fontWeight: '600' }}>Bekleyen Ödeme</p>
          <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>₺3,499.00</h3>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Gelecek Çarşamba ödenecek</p>
        </div>

        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '20px', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: '#dbeafe', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', marginBottom: '16px' }}>
            <FaCreditCard size={20} />
          </div>
          <p style={{ color: '#64748b', fontSize: '13px', fontWeight: '600' }}>Toplam Ödenen</p>
          <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>₺148,250</h3>
          <p style={{ fontSize: '12px', color: '#10b981', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FaArrowUp size={10} /> Geçen aya göre +%12
          </p>
        </div>
      </div>

      {/* Transaction History */}
      <div style={{ backgroundColor: 'white', borderRadius: '20px', border: '1px solid #f1f5f9', padding: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px', color: '#0f172a' }}>Son İşlemler</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
              <th style={{ textAlign: 'left', padding: '12px', color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>İŞLEM ID</th>
              <th style={{ textAlign: 'left', padding: '12px', color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>TARİH</th>
              <th style={{ textAlign: 'left', padding: '12px', color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>AÇIKLAMA</th>
              <th style={{ textAlign: 'right', padding: '12px', color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>TUTAR</th>
              <th style={{ textAlign: 'right', padding: '12px', color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>DURUM</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((trx, index) => (
              <tr key={index} style={{ borderBottom: index !== transactions.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                <td style={{ padding: '16px 12px', fontWeight: '600', color: '#475569', fontSize: '13px' }}>{trx.id}</td>
                <td style={{ padding: '16px 12px', color: '#64748b', fontSize: '13px' }}>{trx.date}</td>
                <td style={{ padding: '16px 12px', color: '#0f172a', fontWeight: '500' }}>{trx.description}</td>
                <td style={{ padding: '16px 12px', textAlign: 'right', fontWeight: '700', color: trx.amount.startsWith('-') ? '#ef4444' : '#10b981' }}>
                  {trx.amount}
                </td>
                <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                  <span style={{ 
                    padding: '6px 12px', 
                    borderRadius: '20px', 
                    fontSize: '11px', 
                    fontWeight: '700',
                    backgroundColor: trx.status === 'completed' ? '#dcfce7' : '#fef3c7',
                    color: trx.status === 'completed' ? '#16a34a' : '#d97706',
                    textTransform: 'uppercase'
                  }}>
                    {trx.status === 'completed' ? 'Tamamlandı' : 'Bekliyor'}
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

export default VendorFinance;
