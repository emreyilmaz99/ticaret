/**
 * useVendorFinance Hook - Finance sayfası business logic
 */

import { useState, useMemo } from 'react';

export const useVendorFinance = () => {
  // Mock data - gerçek uygulamada API'den gelecek
  const [transactions] = useState([
    { 
      id: 'TRX-9876', 
      date: '27 Kas 2025', 
      type: 'payout', 
      description: 'Haftalık Ödeme', 
      amount: '₺12,450.00', 
      status: 'completed' 
    },
    { 
      id: 'TRX-9875', 
      date: '26 Kas 2025', 
      type: 'sale', 
      description: 'Sipariş #1024 Geliri', 
      amount: '₺1,299.00', 
      status: 'completed' 
    },
    { 
      id: 'TRX-9874', 
      date: '25 Kas 2025', 
      type: 'refund', 
      description: 'İade #1019', 
      amount: '-₺450.00', 
      status: 'completed' 
    },
    { 
      id: 'TRX-9873', 
      date: '24 Kas 2025', 
      type: 'sale', 
      description: 'Sipariş #1022 Geliri', 
      amount: '₺3,499.00', 
      status: 'pending' 
    },
  ]);

  const walletData = useMemo(() => ({
    availableBalance: '₺24,850.50',
    pendingAmount: '₺3,499.00',
    pendingDate: 'Gelecek Çarşamba ödenecek',
    totalPaid: '₺148,250',
    growthPercent: '+%12',
  }), []);

  const handleWithdraw = () => {
    // Para çekme işlemi
    console.log('Para çekme işlemi başlatıldı');
    // API call yapılacak
  };

  const handleSettings = () => {
    // Hesap ayarları
    console.log('Hesap ayarları açılıyor');
  };

  return {
    transactions,
    walletData,
    handleWithdraw,
    handleSettings,
  };
};

export default useVendorFinance;
