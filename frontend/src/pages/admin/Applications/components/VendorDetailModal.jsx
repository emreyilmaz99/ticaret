// src/pages/admin/Applications/components/VendorDetailModal.jsx
import React, { useState } from 'react';
import { 
  FaTimes, FaBuilding, FaIdCard, FaUser, FaEnvelope, FaPhone, FaCalendarAlt, 
  FaStore, FaCreditCard, FaMapMarkerAlt, FaCheck, FaBan, FaInfoCircle,
  FaFileInvoice, FaClock, FaCheckCircle
} from 'react-icons/fa';

/**
 * Modern Vendor Detay Modalı - Senior Design
 */
const VendorDetailModal = ({ 
  vendor, 
  onClose, 
  onApprove, 
  onReject,
  showApproveButton = true,
  showRejectButton = false 
}) => {
  const [activeTab, setActiveTab] = useState('general');
  
  if (!vendor) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px',
      animation: 'fadeIn 0.2s ease'
    }} onClick={onClose}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '900px',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Header - Modern Gradient */}
        <div style={{
          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
          padding: '28px 32px 24px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 60%)',
            pointerEvents: 'none'
          }}></div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            position: 'relative',
            zIndex: 1
          }}>
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '8px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  🏪
                </div>
                <div>
                  <h2 style={{
                    margin: 0,
                    fontSize: '28px',
                    fontWeight: '700',
                    color: 'white',
                    letterSpacing: '-0.5px'
                  }}>
                    {vendor.company_name || vendor.storeName}
                  </h2>
                  <p style={{
                    margin: '4px 0 0 0',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>Satıcı Başvurusu</span>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      background: vendor.status === 'approved' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(251, 191, 36, 0.3)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      fontWeight: '600'
                    }}>
                      {vendor.status === 'approved' ? '✓ Onaylandı' : 'Beklemede'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={onClose} 
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '18px',
                transition: 'all 0.2s',
                position: 'relative',
                zIndex: 2
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <FaTimes />
            </button>
          </div>
          
          {/* Tabs */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginTop: '20px',
            position: 'relative',
            zIndex: 1
          }}>
            {[
              { id: 'general', label: 'Genel Bilgiler', icon: <FaInfoCircle /> },
              { id: 'address', label: 'Adres Bilgileri', icon: <FaMapMarkerAlt /> },
              { id: 'bank', label: 'Banka Bilgileri', icon: <FaCreditCard /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  background: activeTab === tab.id 
                    ? 'rgba(255, 255, 255, 0.25)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: activeTab === tab.id ? '600' : '500',
                  fontSize: '14px',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backdropFilter: 'blur(10px)',
                  border: activeTab === tab.id 
                    ? '1px solid rgba(255, 255, 255, 0.3)' 
                    : '1px solid rgba(255, 255, 255, 0.15)'
                }}
                onMouseEnter={e => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  }
                }}
                onMouseLeave={e => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body - Scrollable Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '32px',
          background: '#f9fafb'
        }}>
          
          {/* Genel Bilgiler Tab */}
          {activeTab === 'general' && (
            <div style={{animation: 'fadeInContent 0.3s ease'}}>
              {/* Şirket ve İletişim Bilgileri */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
                marginBottom: '24px'
              }}>
                {/* Şirket Bilgileri Card */}
                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '20px',
                    paddingBottom: '16px',
                    borderBottom: '2px solid #f3f4f6'
                  }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '20px',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
                    }}>
                      <FaBuilding />
                    </div>
                    <h3 style={{
                      margin: 0,
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#111827',
                      letterSpacing: '-0.3px'
                    }}>
                      Şirket Bilgileri
                    </h3>
                  </div>
                  
                  <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#6b7280',
                        marginBottom: '6px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Şirket Adı
                      </label>
                      <div style={{
                        fontSize: '15px',
                        color: '#111827',
                        fontWeight: '600',
                        padding: '10px 14px',
                        background: '#f9fafb',
                        borderRadius: '10px',
                        border: '1px solid #e5e7eb'
                      }}>
                        {vendor.company_name || vendor.storeName || '-'}
                      </div>
                    </div>
                    
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#6b7280',
                        marginBottom: '6px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Vergi Numarası
                      </label>
                      <div style={{
                        fontSize: '15px',
                        color: '#111827',
                        fontWeight: '600',
                        padding: '10px 14px',
                        background: '#f9fafb',
                        borderRadius: '10px',
                        border: '1px solid #e5e7eb',
                        fontFamily: 'monospace'
                      }}>
                        {vendor.tax_id || '-'}
                      </div>
                    </div>
                    
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#6b7280',
                        marginBottom: '6px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Satıcı Tipi
                      </label>
                      <div style={{
                        fontSize: '15px',
                        color: '#111827',
                        fontWeight: '600',
                        padding: '10px 14px',
                        background: '#f9fafb',
                        borderRadius: '10px',
                        border: '1px solid #e5e7eb'
                      }}>
                        {vendor.merchant_type || 'Bireysel'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* İletişim Bilgileri Card */}
                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '20px',
                    paddingBottom: '16px',
                    borderBottom: '2px solid #f3f4f6'
                  }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '20px',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)'
                    }}>
                      <FaUser />
                    </div>
                    <h3 style={{
                      margin: 0,
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#111827',
                      letterSpacing: '-0.3px'
                    }}>
                      İletişim Bilgileri
                    </h3>
                  </div>
                  
                  <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#6b7280',
                        marginBottom: '6px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Yetkili Kişi
                      </label>
                      <div style={{
                        fontSize: '15px',
                        color: '#111827',
                        fontWeight: '600',
                        padding: '10px 14px',
                        background: '#f9fafb',
                        borderRadius: '10px',
                        border: '1px solid #e5e7eb'
                      }}>
                        {vendor.full_name || vendor.owner || '-'}
                      </div>
                    </div>
                    
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#6b7280',
                        marginBottom: '6px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        E-posta Adresi
                      </label>
                      <div style={{
                        fontSize: '14px',
                        color: '#111827',
                        fontWeight: '600',
                        padding: '10px 14px',
                        background: '#f9fafb',
                        borderRadius: '10px',
                        border: '1px solid #e5e7eb',
                        wordBreak: 'break-all',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <FaEnvelope style={{fontSize: '12px', color: '#6b7280'}} />
                        {vendor.email}
                      </div>
                    </div>
                    
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#6b7280',
                        marginBottom: '6px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Telefon Numarası
                      </label>
                      <div style={{
                        fontSize: '15px',
                        color: '#111827',
                        fontWeight: '600',
                        padding: '10px 14px',
                        background: '#f9fafb',
                        borderRadius: '10px',
                        border: '1px solid #e5e7eb',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <FaPhone style={{fontSize: '12px', color: '#6b7280'}} />
                        {vendor.phone || '-'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tarih ve Durum Bilgileri */}
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '20px',
                  paddingBottom: '16px',
                  borderBottom: '2px solid #f3f4f6'
                }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '20px',
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)'
                  }}>
                    <FaClock />
                  </div>
                  <h3 style={{
                    margin: 0,
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#111827',
                    letterSpacing: '-0.3px'
                  }}>
                    Başvuru Bilgileri
                  </h3>
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '16px'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6b7280',
                      marginBottom: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Başvuru Tarihi
                    </label>
                    <div style={{
                      fontSize: '15px',
                      color: '#111827',
                      fontWeight: '600',
                      padding: '10px 14px',
                      background: '#f9fafb',
                      borderRadius: '10px',
                      border: '1px solid #e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <FaCalendarAlt style={{fontSize: '14px', color: '#6b7280'}} />
                      {formatDate(vendor.created_at)}
                    </div>
                  </div>
                  
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6b7280',
                      marginBottom: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Durum
                    </label>
                    <div style={{
                      fontSize: '15px',
                      fontWeight: '700',
                      padding: '10px 14px',
                      background: vendor.status === 'approved' ? '#dcfce7' : '#fef3c7',
                      color: vendor.status === 'approved' ? '#059669' : '#d97706',
                      borderRadius: '10px',
                      border: '1px solid',
                      borderColor: vendor.status === 'approved' ? '#86efac' : '#fcd34d',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      {vendor.status === 'approved' ? <FaCheckCircle /> : <FaClock />}
                      {vendor.status === 'approved' ? 'Onaylandı' : 'Onay Bekliyor'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Adres Bilgileri Tab */}
          {activeTab === 'address' && (
            <div style={{animation: 'fadeInContent 0.3s ease'}}>
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '28px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '24px',
                  paddingBottom: '20px',
                  borderBottom: '2px solid #f3f4f6'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '22px',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                  }}>
                    <FaMapMarkerAlt />
                  </div>
                  <h3 style={{
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#111827',
                    letterSpacing: '-0.3px'
                  }}>
                    Adres Bilgileri
                  </h3>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '20px'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6b7280',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Şehir
                    </label>
                    <div style={{
                      fontSize: '15px',
                      color: '#111827',
                      fontWeight: '600',
                      padding: '12px 16px',
                      background: '#f9fafb',
                      borderRadius: '10px',
                      border: '1px solid #e5e7eb',
                      minHeight: '44px',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      {vendor.city || '-'}
                    </div>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6b7280',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      İlçe
                    </label>
                    <div style={{
                      fontSize: '15px',
                      color: '#111827',
                      fontWeight: '600',
                      padding: '12px 16px',
                      background: '#f9fafb',
                      borderRadius: '10px',
                      border: '1px solid #e5e7eb',
                      minHeight: '44px',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      {vendor.district || '-'}
                    </div>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6b7280',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Posta Kodu
                    </label>
                    <div style={{
                      fontSize: '15px',
                      color: '#111827',
                      fontWeight: '600',
                      padding: '12px 16px',
                      background: '#f9fafb',
                      borderRadius: '10px',
                      border: '1px solid #e5e7eb',
                      minHeight: '44px',
                      display: 'flex',
                      alignItems: 'center',
                      fontFamily: 'monospace'
                    }}>
                      {vendor.postal_code || '-'}
                    </div>
                  </div>
                </div>

                <div style={{marginTop: '20px'}}>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6b7280',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Detaylı Adres
                  </label>
                  <div style={{
                    fontSize: '15px',
                    color: '#111827',
                    fontWeight: '500',
                    padding: '14px 16px',
                    background: '#f9fafb',
                    borderRadius: '10px',
                    border: '1px solid #e5e7eb',
                    minHeight: '80px',
                    lineHeight: '1.6'
                  }}>
                    {vendor.address || 'Adres bilgisi girilmemiş'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Banka Bilgileri Tab */}
          {activeTab === 'bank' && (
            <div style={{animation: 'fadeInContent 0.3s ease'}}>
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '28px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '24px',
                  paddingBottom: '20px',
                  borderBottom: '2px solid #f3f4f6'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '22px',
                    boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)'
                  }}>
                    <FaCreditCard />
                  </div>
                  <h3 style={{
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#111827',
                    letterSpacing: '-0.3px'
                  }}>
                    Banka Hesap Bilgileri
                  </h3>
                </div>

                {vendor.iban ? (
                  <div style={{
                    display: 'grid',
                    gap: '20px'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#6b7280',
                        marginBottom: '8px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Banka Adı
                      </label>
                      <div style={{
                        fontSize: '16px',
                        color: '#111827',
                        fontWeight: '700',
                        padding: '14px 18px',
                        background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
                        borderRadius: '12px',
                        border: '2px solid #e9d5ff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <span style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '16px'
                        }}>
                          🏦
                        </span>
                        {vendor.bankName || '-'}
                      </div>
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#6b7280',
                        marginBottom: '8px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        IBAN Numarası
                      </label>
                      <div style={{
                        fontSize: '16px',
                        color: '#111827',
                        fontWeight: '700',
                        padding: '14px 18px',
                        background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
                        borderRadius: '12px',
                        border: '2px solid #e9d5ff',
                        fontFamily: 'monospace',
                        letterSpacing: '1.5px',
                        wordBreak: 'break-all'
                      }}>
                        {vendor.iban}
                      </div>
                    </div>

                    <div style={{
                      marginTop: '8px',
                      padding: '16px',
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px'
                    }}>
                      <FaInfoCircle style={{
                        color: '#3b82f6',
                        fontSize: '18px',
                        marginTop: '2px',
                        flexShrink: 0
                      }} />
                      <div style={{
                        fontSize: '13px',
                        color: '#1e40af',
                        lineHeight: '1.5'
                      }}>
                        <strong>Bilgi:</strong> Ödeme işlemleri bu IBAN üzerinden gerçekleştirilecektir. 
                        Banka bilgilerinin doğruluğunu kontrol ediniz.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: '#9ca3af',
                    fontSize: '15px'
                  }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '16px',
                      background: '#f3f4f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      fontSize: '28px'
                    }}>
                      💳
                    </div>
                    <p style={{margin: 0, fontWeight: '600'}}>
                      Banka bilgisi girilmemiş
                    </p>
                    <p style={{margin: '8px 0 0 0', fontSize: '13px'}}>
                      Satıcı henüz banka bilgilerini eklememiş
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer - Action Buttons */}
        <div style={{
          padding: '24px 32px',
          borderTop: '1px solid #f3f4f6',
          background: '#fafafa',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          borderBottomLeftRadius: '24px',
          borderBottomRightRadius: '24px'
        }}>
          <button 
            onClick={onClose} 
            style={{
              padding: '14px 28px',
              borderRadius: '12px',
              border: '2px solid #e5e7eb',
              background: 'white',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '15px',
              color: '#6b7280',
              transition: 'all 0.2s',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#d1d5db';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.07)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
            }}
          >
            Kapat
          </button>
          
          {showRejectButton && (
            <button 
              onClick={() => onReject(vendor)}
              style={{
                padding: '14px 28px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: 'white',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '15px',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(239, 68, 68, 0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
              }}
            >
              <FaBan /> Reddet
            </button>
          )}
          
          {showApproveButton && (
            <button 
              onClick={() => onApprove(vendor)}
              style={{
                padding: '14px 32px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '15px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(16, 185, 129, 0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
              }}
            >
              <FaCheck /> Onayla
            </button>
          )}
        </div>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { 
              opacity: 0;
              transform: translateY(20px) scale(0.95);
            }
            to { 
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          @keyframes fadeInContent {
            from { 
              opacity: 0;
              transform: translateY(10px);
            }
            to { 
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default VendorDetailModal;
