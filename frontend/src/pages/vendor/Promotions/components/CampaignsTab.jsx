// src/pages/vendor/Promotions/components/CampaignsTab.jsx
import React from 'react';
import { FaBox, FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { styles } from '../styles';

const CampaignsTab = ({ 
  campaigns, 
  onAdd, 
  onEdit, 
  onDelete, 
  onToggle 
}) => {
  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('tr-TR');
  };

  const isExpired = (campaign) => {
    return new Date(campaign.ends_at) < new Date();
  };

  const isNotStarted = (campaign) => {
    return new Date(campaign.starts_at) > new Date();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button style={styles.addButton} onClick={onAdd}>
          <FaPlus /> Yeni Kampanya
        </button>
      </div>

      {campaigns.length === 0 ? (
        <div style={{ ...styles.card, ...styles.emptyState }}>
          <FaBox style={styles.emptyIcon} />
          <p style={styles.emptyText}>Henüz kampanya oluşturmadınız.</p>
          <button style={{ ...styles.addButton, margin: '16px auto 0' }} onClick={onAdd}>
            <FaPlus /> İlk Kampanyayı Oluştur
          </button>
        </div>
      ) : (
        campaigns.map((campaign) => (
          <div 
            key={campaign.id} 
            style={{ 
              ...styles.card, 
              ...(campaign.is_active ? {} : styles.cardInactive) 
            }}
          >
            <div style={styles.couponHeader}>
              <div style={styles.couponInfo}>
                <div style={styles.couponTitleRow}>
                  <span style={styles.campaignBadge}>
                    {campaign.buy_quantity} Al {campaign.pay_quantity} Öde
                  </span>
                  <span style={styles.couponName}>{campaign.name}</span>
                  {!campaign.is_active && (
                    <span style={styles.badgeInactive}>Pasif</span>
                  )}
                  {isExpired(campaign) && (
                    <span style={styles.badgeExpired}>Sona Erdi</span>
                  )}
                  {isNotStarted(campaign) && (
                    <span style={styles.badgeNotStarted}>Başlamadı</span>
                  )}
                </div>
                
                <div style={{ ...styles.couponMeta, marginBottom: '8px' }}>
                  <span>Tarih: {formatDate(campaign.starts_at)} - {formatDate(campaign.ends_at)}</span>
                </div>

                {campaign.products && campaign.products.length > 0 && (
                  <div style={styles.productTagsRow}>
                    {campaign.products.slice(0, 5).map(product => (
                      <span key={product.id} style={styles.productTag}>
                        {product.name}
                      </span>
                    ))}
                    {campaign.products.length > 5 && (
                      <span style={styles.moreProducts}>
                        +{campaign.products.length - 5} ürün daha
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              <div style={styles.actionsContainer}>
                <button 
                  onClick={() => onToggle(campaign.id)}
                  style={{ 
                    ...styles.toggleBtn,
                    ...(campaign.is_active ? styles.toggleActive : styles.toggleInactive)
                  }}
                >
                  {campaign.is_active ? <FaToggleOn /> : <FaToggleOff />}
                </button>
                <button 
                  onClick={() => onEdit(campaign)}
                  style={styles.actionBtn}
                >
                  <FaEdit />
                </button>
                <button 
                  onClick={() => onDelete(campaign.id)}
                  style={styles.deleteBtn}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CampaignsTab;
