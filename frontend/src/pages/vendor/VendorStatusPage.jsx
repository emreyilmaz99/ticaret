import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  FaCheckCircle, 
  FaClock, 
  FaTimesCircle, 
  FaExclamationTriangle,
  FaStore,
  FaCreditCard,
  FaArrowRight,
  FaFileAlt
} from 'react-icons/fa';
import api from '../../services/api';

const VendorStatusPage = () => {
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['vendor-application-status'],
    queryFn: async () => {
      const response = await api.get('/vendor/application/status');
      return response.data.data;
    },
  });

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0fdf4'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{
            width: '40px',
            height: '40px',
            border: '4px solid #dcfce7',
            borderTopColor: '#16a34a',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: '#64748b' }}>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fef2f2'
      }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <FaTimesCircle size={48} color="#ef4444" style={{ marginBottom: '16px' }} />
          <h2 style={{ color: '#991b1b', marginBottom: '8px' }}>Hata</h2>
          <p style={{ color: '#dc2626' }}>{error.message}</p>
        </div>
      </div>
    );
  }

  const status = data;

  // Status-based UI configuration
  const getStatusConfig = () => {
    switch (status.vendor_status) {
      case 'pending_pre_approval':
        return {
          icon: <FaClock size={48} />,
          color: '#f59e0b',
          bgColor: '#fef3c7',
          borderColor: '#fcd34d',
          title: 'Ön Başvurunuz İnceleniyor',
          description: 'Başvurunuz admin ekibimiz tarafından inceleniyor. En kısa sürede size dönüş yapacağız.',
          showAction: false,
        };
      
      case 'pre_approved':
        return {
          icon: <FaFileAlt size={48} />,
          color: '#3b82f6',
          bgColor: '#dbeafe',
          borderColor: '#93c5fd',
          title: 'Ön Başvurunuz Onaylandı! 🎉',
          description: 'Tebrikler! Ön başvurunuz onaylandı. Şimdi temel başvurunuzu tamamlayarak satışa başlayabilirsiniz.',
          showAction: true,
          actionText: 'Temel Başvuruyu Tamamla',
          actionPath: '/vendor/full-application',
        };
      
      case 'pending_full_approval':
        return {
          icon: <FaClock size={48} />,
          color: '#8b5cf6',
          bgColor: '#ede9fe',
          borderColor: '#c4b5fd',
          title: 'Temel Başvurunuz İnceleniyor',
          description: 'Temel başvurunuz ve ödeme bilgileriniz inceleniyor. Bu işlem genellikle 1-2 iş günü sürmektedir.',
          showAction: false,
        };
      
      case 'active':
        return {
          icon: <FaCheckCircle size={48} />,
          color: '#16a34a',
          bgColor: '#dcfce7',
          borderColor: '#86efac',
          title: 'Hesabınız Aktif! 🎉',
          description: 'Tebrikler! Artık ürünlerinizi satışa sunabilir ve ödeme alabilirsiniz.',
          showAction: true,
          actionText: 'Panele Git',
          actionPath: '/vendor/dashboard',
        };
      
      case 'suspended':
        return {
          icon: <FaExclamationTriangle size={48} />,
          color: '#f59e0b',
          bgColor: '#fef3c7',
          borderColor: '#fcd34d',
          title: 'Hesabınız Askıya Alındı',
          description: 'Hesabınız geçici olarak askıya alınmıştır. Detaylar için destek ile iletişime geçin.',
          showAction: false,
        };
      
      case 'banned':
        return {
          icon: <FaTimesCircle size={48} />,
          color: '#ef4444',
          bgColor: '#fef2f2',
          borderColor: '#fca5a5',
          title: 'Hesabınız Yasaklandı',
          description: 'Hesabınız platformdan yasaklanmıştır. İtiraz için destek ile iletişime geçebilirsiniz.',
          showAction: false,
        };
      
      default:
        return {
          icon: <FaClock size={48} />,
          color: '#64748b',
          bgColor: '#f1f5f9',
          borderColor: '#cbd5e1',
          title: 'Durum Belirsiz',
          description: 'Hesabınızın durumu kontrol ediliyor.',
          showAction: false,
        };
    }
  };

  const config = getStatusConfig();

  // Check if there's a rejection reason to show
  const showRejection = status.latest_rejection_reason && status.vendor_status === 'pre_approved';

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f0fdf4',
      backgroundImage: 'radial-gradient(#dcfce7 1px, transparent 1px)',
      backgroundSize: '24px 24px',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        {/* Main Status Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
          border: `2px solid ${config.borderColor}`,
          overflow: 'hidden'
        }}>
          {/* Status Header */}
          <div style={{
            backgroundColor: config.bgColor,
            padding: '40px',
            textAlign: 'center',
            borderBottom: `1px solid ${config.borderColor}`
          }}>
            <div style={{ color: config.color, marginBottom: '16px' }}>
              {config.icon}
            </div>
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              color: '#1e293b',
              marginBottom: '12px'
            }}>
              {config.title}
            </h1>
            <p style={{ 
              color: '#64748b', 
              fontSize: '15px',
              lineHeight: '1.6',
              maxWidth: '400px',
              margin: '0 auto'
            }}>
              {config.description}
            </p>
          </div>

          {/* Status Details */}
          <div style={{ padding: '32px' }}>
            {/* Rejection Warning */}
            {showRejection && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '24px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '12px' 
                }}>
                  <FaExclamationTriangle color="#ef4444" style={{ marginTop: '2px' }} />
                  <div>
                    <p style={{ 
                      fontWeight: '600', 
                      color: '#991b1b', 
                      marginBottom: '4px',
                      fontSize: '14px'
                    }}>
                      Önceki Başvurunuz Reddedildi
                    </p>
                    <p style={{ color: '#dc2626', fontSize: '13px' }}>
                      {status.latest_rejection_reason}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Status Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Vendor Status */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FaStore color="#64748b" />
                  <span style={{ color: '#475569', fontWeight: '500' }}>Hesap Durumu</span>
                </div>
                <span style={{
                  backgroundColor: config.bgColor,
                  color: config.color,
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '600'
                }}>
                  {status.vendor_status_label}
                </span>
              </div>

              {/* iyzico Status */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FaCreditCard color="#64748b" />
                  <span style={{ color: '#475569', fontWeight: '500' }}>Ödeme Durumu</span>
                </div>
                <span style={{
                  backgroundColor: status.iyzico_status === 'active' ? '#dcfce7' : '#f1f5f9',
                  color: status.iyzico_status === 'active' ? '#16a34a' : '#64748b',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '600'
                }}>
                  {status.iyzico_status_label}
                </span>
              </div>
            </div>

            {/* Action Button */}
            {config.showAction && (
              <button
                onClick={() => navigate(config.actionPath)}
                style={{
                  width: '100%',
                  marginTop: '32px',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  padding: '16px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 6px -1px rgba(22, 163, 74, 0.2)'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#15803d'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
              >
                {config.actionText}
                <FaArrowRight size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Help Text */}
        <p style={{
          textAlign: 'center',
          marginTop: '24px',
          color: '#64748b',
          fontSize: '14px'
        }}>
          Sorularınız mı var?{' '}
          <a href="mailto:destek@example.com" style={{ color: '#16a34a', fontWeight: '600' }}>
            Destek ile iletişime geçin
          </a>
        </p>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default VendorStatusPage;
