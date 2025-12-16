import React from 'react';
import PropTypes from 'prop-types';
import { FaWallet, FaMoneyBillWave } from 'react-icons/fa';

/**
 * WalletCard Component - Ana cüzdan kartı
 */
const WalletCard = ({ walletData, onWithdraw, onSettings, styles }) => {
  return (
    <div style={styles.walletCard}>
      <div style={styles.walletIcon}>
        <FaWallet size={150} />
      </div>
      
      <div style={styles.walletContent}>
        <p style={styles.walletLabel}>Çekilebilir Bakiye</p>
        <h2 style={styles.walletAmount}>{walletData.availableBalance}</h2>
        
        <div style={styles.walletActions}>
          <button style={styles.withdrawBtn} onClick={onWithdraw}>
            <FaMoneyBillWave /> Para Çek
          </button>
          <button style={styles.settingsBtn} onClick={onSettings}>
            Hesap Ayarları
          </button>
        </div>
      </div>
    </div>
  );
};

WalletCard.propTypes = {
  walletData: PropTypes.shape({
    availableBalance: PropTypes.string.isRequired,
  }).isRequired,
  onWithdraw: PropTypes.func.isRequired,
  onSettings: PropTypes.func.isRequired,
  styles: PropTypes.object.isRequired,
};

export default WalletCard;
