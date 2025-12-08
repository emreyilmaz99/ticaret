// src/pages/user/PaymentSuccess/usePaymentSuccess.js
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCheckoutStatus } from '../../../features/checkout/api/checkoutApi';

export const usePaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [orderDetails, setOrderDetails] = useState(null);
  const orderNumber = searchParams.get('order_number');

  useEffect(() => {
    const checkStatus = async () => {
      if (!orderNumber) {
        setStatus('error');
        return;
      }

      try {
        const response = await getCheckoutStatus(orderNumber);
        if (response.data.status === 'success') {
          setStatus('success');
          setOrderDetails(response.data.order);
        } else {
          setStatus('error');
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
    formatPrice
  };
};
