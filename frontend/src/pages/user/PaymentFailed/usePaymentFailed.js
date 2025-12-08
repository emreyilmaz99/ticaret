// src/pages/user/PaymentFailed/usePaymentFailed.js
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCheckoutStatus } from '../../../features/checkout/api/checkoutApi';

export const usePaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // loading, failed, error
  const [orderDetails, setOrderDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const orderNumber = searchParams.get('order_number');

  useEffect(() => {
    const checkStatus = async () => {
      if (!orderNumber) {
        setStatus('error');
        return;
      }

      try {
        const response = await getCheckoutStatus(orderNumber);
        if (response.data.status === 'failed') {
          setStatus('failed');
          setOrderDetails(response.data.order);
          setErrorMessage(response.data.error_message || 'Ödeme işlemi sırasında bir hata oluştu.');
        } else {
          // If status is not failed (e.g. success), maybe redirect or show error?
          // For now, let's assume if we are here, it failed or we are checking why.
          // But the API might return success if the user manually navigated here?
          // Let's stick to the logic: if API says failed, show failed.
          setStatus('failed');
          setOrderDetails(response.data.order);
          setErrorMessage(response.data.error_message || 'Ödeme işlemi tamamlanamadı.');
        }
      } catch (error) {
        console.error('Payment status check failed:', error);
        setStatus('error');
      }
    };

    checkStatus();
  }, [orderNumber]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  return {
    status,
    orderDetails,
    orderNumber,
    errorMessage,
    formatPrice
  };
};
