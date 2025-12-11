// src/pages/user/Cart/CheckoutModal.jsx
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FiX, FiMapPin, FiCreditCard, FiLoader, FiArrowRight, FiCheck, FiShield } from 'react-icons/fi';

/**
 * Checkout Modal - iyzico ödeme formu
 */
const CheckoutModal = ({
  isOpen,
  onClose,
  step,
  paymentHtml,
  selectedAddress,
  totals,
  onStartPayment,
  isLoading,
  isMobile,
}) => {
  const paymentContainerRef = useRef(null);

  // iyzico script'lerini yükle
  useEffect(() => {
    if (step === 'payment' && paymentHtml && paymentContainerRef.current) {
      // Popup yerine responsive form kullanmak için HTML'i modifiye et
      let modifiedHtml = paymentHtml;
      
      // iyziInit fonksiyonuna responsive parametresi ekle
      // iyzico'nun popup açmasını engelle
      if (modifiedHtml.includes('iyziInit')) {
        modifiedHtml = modifiedHtml.replace(
          /iyziInit\s*=\s*\{/,
          'iyziInit = { responsive: true, '
        );
      }
      
      // HTML'i container'a ekle
      paymentContainerRef.current.innerHTML = modifiedHtml;
      
      // Script'leri manuel olarak çalıştır
      const scripts = paymentContainerRef.current.querySelectorAll('script');
      scripts.forEach((script) => {
        const newScript = document.createElement('script');
        newScript.type = 'text/javascript';
        if (script.src) {
          newScript.src = script.src;
          newScript.async = true;
        } else {
          // Script içeriğini de responsive için modifiye et
          let scriptContent = script.textContent;
          if (scriptContent.includes('iyziInit') && !scriptContent.includes('responsive')) {
            scriptContent = scriptContent.replace(
              /iyziInit\s*=\s*\{/,
              'iyziInit = { responsive: true, '
            );
          }
          newScript.textContent = scriptContent;
        }
        document.body.appendChild(newScript);
      });

      // Cleanup - modal kapanınca scriptleri temizle
      return () => {
        const iyzicoScripts = document.querySelectorAll('script[src*="iyzipay"]');
        iyzicoScripts.forEach(s => s.remove());
      };
    }
  }, [step, paymentHtml]);

  if (!isOpen) return null;

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      backdropFilter: 'blur(4px)',
      padding: isMobile ? '12px' : '20px',
    },
    modal: {
      backgroundColor: 'white',
      width: '100%',
      maxWidth: step === 'payment' ? '500px' : '600px',
      maxHeight: step === 'payment' ? '95vh' : '90vh',
      borderRadius: isMobile ? '16px' : '24px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    },
    header: {
      padding: isMobile ? '16px 20px' : '24px',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#f8fafc',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    iconWrapper: {
      width: '40px',
      height: '40px',
      borderRadius: '12px',
      backgroundColor: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#059669',
    },
    headerTitle: {
      margin: 0,
      fontSize: isMobile ? '16px' : '18px',
      fontWeight: '700',
      color: '#1e293b',
    },
    headerSubtitle: {
      margin: 0,
      fontSize: '13px',
      color: '#64748b',
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#64748b',
      fontSize: '20px',
      padding: '8px',
      borderRadius: '8px',
      transition: 'background 0.2s',
    },
    content: {
      padding: isMobile ? '20px' : '24px',
      overflowY: 'auto',
      flex: 1,
    },
    addressCard: {
      padding: '16px',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      backgroundColor: 'white',
    },
    addressLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '8px',
    },
    addressTitle: {
      fontWeight: '600',
      color: '#1e293b',
    },
    addressText: {
      margin: 0,
      fontSize: '14px',
      color: '#64748b',
      lineHeight: '1.5',
    },
    footer: {
      padding: isMobile ? '16px 20px' : '20px 24px',
      borderTop: '1px solid #e2e8f0',
      backgroundColor: '#f8fafc',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '16px',
      flexWrap: 'wrap',
    },
    totalText: {
      fontSize: '14px',
      color: '#64748b',
    },
    totalAmount: {
      fontWeight: '700',
      color: '#059669',
      fontSize: isMobile ? '18px' : '20px',
    },
    payBtn: {
      padding: isMobile ? '12px 24px' : '14px 32px',
      backgroundColor: '#059669',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: isMobile ? '14px' : '15px',
      boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
      transition: 'all 0.2s',
    },
    payBtnDisabled: {
      backgroundColor: '#cbd5e1',
      cursor: 'not-allowed',
      boxShadow: 'none',
    },
    processingContainer: {
      textAlign: 'center',
      padding: '60px 20px',
    },
    spinnerIcon: {
      animation: 'spin 1s linear infinite',
    },
    securityNote: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      marginTop: '16px',
      fontSize: '12px',
      color: '#94a3b8',
    },
  };

  const getStepIcon = () => {
    switch (step) {
      case 'address':
        return <FiMapPin size={20} />;
      case 'payment':
        return <FiCreditCard size={20} />;
      case 'processing':
        return <FiLoader size={20} style={styles.spinnerIcon} />;
      default:
        return <FiCreditCard size={20} />;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 'address':
        return 'Sipariş Onayı';
      case 'payment':
        return 'Ödeme';
      case 'processing':
        return 'İşleniyor...';
      default:
        return 'Ödeme';
    }
  };

  const getStepSubtitle = () => {
    switch (step) {
      case 'address':
        return 'Teslimat adresinizi kontrol edin';
      case 'payment':
        return 'Kart bilgilerinizi güvenle girin';
      case 'processing':
        return 'Lütfen bekleyin';
      default:
        return '';
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.iconWrapper}>
              {getStepIcon()}
            </div>
            <div>
              <h3 style={styles.headerTitle}>{getStepTitle()}</h3>
              <p style={styles.headerSubtitle}>{getStepSubtitle()}</p>
            </div>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>
            <FiX />
          </button>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {/* Address Confirmation Step */}
          {step === 'address' && selectedAddress && (
            <div>
              <div style={styles.addressCard}>
                <div style={styles.addressLabel}>
                  <FiCheck color="#059669" />
                  <span style={styles.addressTitle}>{selectedAddress.label || 'Teslimat Adresi'}</span>
                </div>
                <p style={styles.addressText}>
                  <strong>{selectedAddress.full_name}</strong> - {selectedAddress.phone}
                </p>
                <p style={styles.addressText}>
                  {selectedAddress.address_line}, {selectedAddress.neighborhood}, {selectedAddress.district}/{selectedAddress.city}
                </p>
              </div>
              
              <div style={styles.securityNote}>
                <FiShield size={14} />
                <span>Ödemeniz iyzico güvencesiyle gerçekleştirilecektir</span>
              </div>
            </div>
          )}

          {/* Payment Step - iyzico form */}
          {step === 'payment' && (
            <div 
              ref={paymentContainerRef}
              id="iyzipay-checkout-form"
              className="iyzipay-checkout-form-wrapper"
              style={{ 
                minHeight: '500px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            />
          )}

          {/* Processing Step */}
          {step === 'processing' && (
            <div style={styles.processingContainer}>
              <FiLoader size={48} color="#059669" style={styles.spinnerIcon} />
              <p style={{ color: '#64748b', marginTop: '24px', fontSize: '16px' }}>
                Ödeme formu hazırlanıyor...
              </p>
            </div>
          )}
        </div>

        {/* Footer - sadece address step'te göster */}
        {step === 'address' && (
          <div style={styles.footer}>
            <div>
              <span style={styles.totalText}>Toplam: </span>
              <span style={styles.totalAmount}>
                {(totals?.total || 0).toLocaleString('tr-TR')} TL
              </span>
            </div>
            <button
              style={{
                ...styles.payBtn,
                ...(isLoading ? styles.payBtnDisabled : {}),
              }}
              onClick={onStartPayment}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <FiLoader style={styles.spinnerIcon} /> İşleniyor...
                </>
              ) : (
                <>
                  Ödemeye Geç <FiArrowRight />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Spin animation & iyzico styles */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        /* iyzico form responsive düzenleme */
        .iyzipay-checkout-form-wrapper {
          width: 100%;
        }
        
        .iyzipay-checkout-form-wrapper #iyzipay-checkout-form {
          width: 100% !important;
          max-width: 100% !important;
        }
        
        .iyzipay-checkout-form-wrapper iframe {
          width: 100% !important;
          min-height: 500px !important;
          border: none !important;
        }

        /* iyzico popup override - modal içinde göster */
        #iyzi-checkout-form {
          position: relative !important;
          width: 100% !important;
          height: auto !important;
          min-height: 500px !important;
        }
      `}</style>
    </div>
  );
};

CheckoutModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  step: PropTypes.oneOf(['address', 'processing', 'payment']).isRequired,
  paymentHtml: PropTypes.string,
  selectedAddress: PropTypes.object,
  totals: PropTypes.object,
  onStartPayment: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  isMobile: PropTypes.bool,
};

CheckoutModal.defaultProps = {
  isLoading: false,
  isMobile: false,
};

export default CheckoutModal;
