import React from 'react';
import { FinanceHeader, WalletCard, SecondaryStatsCards, TransactionTable } from './components';
import useVendorFinance from './useVendorFinance';
import { getStyles } from './styles';

/**
 * VendorFinance Ana Sayfası
 * 143 satır → 25 satır (Componentlere bölündü)
 */
const VendorFinance = () => {
  const styles = getStyles();
  const { transactions, walletData, handleWithdraw, handleSettings } = useVendorFinance();

  return (
    <div style={styles.container}>
      <FinanceHeader styles={styles} />

      {/* Cards Grid */}
      <div style={styles.cardsGrid}>
        <WalletCard
          walletData={walletData}
          onWithdraw={handleWithdraw}
          onSettings={handleSettings}
          styles={styles}
        />
        <SecondaryStatsCards walletData={walletData} styles={styles} />
      </div>

      {/* Transaction History */}
      <TransactionTable transactions={transactions} styles={styles} />
    </div>
  );
};

export default VendorFinance;
