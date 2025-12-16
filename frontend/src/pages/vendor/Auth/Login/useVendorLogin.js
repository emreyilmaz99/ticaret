import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../../components/common/Toast';
import apiClient from '../../../../lib/apiClient';

// Vendor Status Constants
export const VENDOR_STATUS = {
  ACTIVE: 'active',
  PENDING_FULL_APPLICATION: 'pending_full_application',
  PENDING_ACTIVATION: 'pending_activation',
  PENDING_INFO: 'pending_info',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended',
  BANNED: 'banned',
};

const useVendorLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await apiClient.post('/v1/vendor/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('vendor_token', data.token);
      showToast('Giriş başarılı!', 'success');

      // Status-based routing
      switch (data.vendor.status) {
        case VENDOR_STATUS.ACTIVE:
          navigate('/vendor/dashboard');
          break;
        case VENDOR_STATUS.PENDING_FULL_APPLICATION:
          navigate('/vendor/application');
          break;
        case VENDOR_STATUS.PENDING_ACTIVATION:
        case VENDOR_STATUS.PENDING_INFO:
          navigate('/vendor/status', {
            state: {
              status: data.vendor.status,
              message: 'Başvurunuz inceleniyor. Lütfen bekleyiniz.',
            },
          });
          break;
        case VENDOR_STATUS.REJECTED:
          navigate('/vendor/status', {
            state: {
              status: 'rejected',
              message: data.vendor.rejection_reason || 'Başvurunuz reddedildi.',
            },
          });
          break;
        case VENDOR_STATUS.SUSPENDED:
        case VENDOR_STATUS.BANNED:
          navigate('/vendor/status', {
            state: {
              status: data.vendor.status,
              message:
                data.vendor.status === VENDOR_STATUS.BANNED
                  ? 'Hesabınız kalıcı olarak askıya alınmıştır.'
                  : 'Hesabınız geçici olarak askıya alınmıştır.',
            },
          });
          break;
        default:
          navigate('/vendor/dashboard');
      }
    },
    onError: (error) => {
      // Handle pending/incomplete application
      if (error.response?.data?.vendor_status === VENDOR_STATUS.PENDING_FULL_APPLICATION) {
        showToast('Lütfen başvurunuzu tamamlayın', 'warning');
        navigate('/vendor/application');
        return;
      }

      showToast(error.response?.data?.message || 'Giriş başarısız oldu', 'error');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading: loginMutation.isPending,
    handleSubmit,
  };
};

export default useVendorLogin;
