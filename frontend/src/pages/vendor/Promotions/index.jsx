// src/pages/vendor/Promotions/index.jsx
import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import useVendorPromotions from './useVendorPromotions';
import { styles } from './styles';
import {
  PromotionsHeader,
  PromotionsTabs,
  CouponsTab,
  CampaignsTab,
  CouponModal,
  CampaignModal
} from './components';

const VendorPromotionsPage = () => {
  const {
    // Data
    coupons,
    campaigns,
    products,
    isLoading,

    // UI State
    activeTab,
    setActiveTab,

    // Coupon Modal
    showCouponModal,
    editingCoupon,
    openCouponModal,
    closeCouponModal,

    // Campaign Modal
    showCampaignModal,
    editingCampaign,
    openCampaignModal,
    closeCampaignModal,

    // Handlers
    handleDeleteCoupon,
    handleDeleteCampaign,
    handleSaveCoupon,
    handleSaveCampaign,

    // Mutations
    toggleCouponMutation,
    toggleCampaignMutation,
    isCouponSaving,
    isCampaignSaving
  } = useVendorPromotions();

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <FaSpinner className="spin" style={styles.spinner} />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{styles.globalStyles}</style>

      <PromotionsHeader />

      <PromotionsTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        couponsCount={coupons.length}
        campaignsCount={campaigns.length}
      />

      {activeTab === 'coupons' && (
        <CouponsTab
          coupons={coupons}
          onAdd={() => openCouponModal()}
          onEdit={(coupon) => openCouponModal(coupon)}
          onDelete={handleDeleteCoupon}
          onToggle={(id) => toggleCouponMutation.mutate(id)}
        />
      )}

      {activeTab === 'campaigns' && (
        <CampaignsTab
          campaigns={campaigns}
          onAdd={() => openCampaignModal()}
          onEdit={(campaign) => openCampaignModal(campaign)}
          onDelete={handleDeleteCampaign}
          onToggle={(id) => toggleCampaignMutation.mutate(id)}
        />
      )}

      {showCouponModal && (
        <CouponModal
          coupon={editingCoupon}
          onClose={closeCouponModal}
          onSave={handleSaveCoupon}
          isLoading={isCouponSaving}
        />
      )}

      {showCampaignModal && (
        <CampaignModal
          campaign={editingCampaign}
          products={products}
          onClose={closeCampaignModal}
          onSave={handleSaveCampaign}
          isLoading={isCampaignSaving}
        />
      )}
    </div>
  );
};

export default VendorPromotionsPage;
