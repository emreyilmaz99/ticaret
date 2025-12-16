// src/pages/vendor/Promotions/useVendorPromotions.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../../components/common/Toast';
import apiClient from '@lib/apiClient';

const useVendorPromotions = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem('vendor_token');
    if (!token) navigate('/vendor/login');
  }, [navigate]);

  // ============ STATE ============
  const [activeTab, setActiveTab] = useState('coupons');
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [editingCampaign, setEditingCampaign] = useState(null);

  // ============ QUERIES ============
  const { data: couponsData, isLoading: couponsLoading } = useQuery({
    queryKey: ['vendor', 'coupons'],
    queryFn: async () => {
      const res = await apiClient.get('/v1/vendor/coupons');
      return res.data;
    }
  });

  const { data: campaignsData, isLoading: campaignsLoading } = useQuery({
    queryKey: ['vendor', 'campaigns'],
    queryFn: async () => {
      const res = await apiClient.get('/v1/vendor/campaigns');
      return res.data;
    }
  });

  const { data: productsData } = useQuery({
    queryKey: ['vendor', 'products-for-campaign'],
    queryFn: async () => {
      const res = await apiClient.get('/v1/vendor/products?per_page=1000');
      return res.data;
    }
  });

  // Derived data
  const coupons = couponsData?.data || [];
  const campaigns = campaignsData?.data || [];
  const products = productsData?.data?.products || productsData?.data || [];
  const isLoading = couponsLoading || campaignsLoading;

  // ============ COUPON MUTATIONS ============
  const createCouponMutation = useMutation({
    mutationFn: async (data) => {
      const res = await apiClient.post('/v1/vendor/coupons', data);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success('Başarılı', data.message || 'Kupon oluşturuldu');
      queryClient.invalidateQueries({ queryKey: ['vendor', 'coupons'] });
      closeCouponModal();
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Kupon oluşturulamadı');
    }
  });

  const updateCouponMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await apiClient.put(`/v1/vendor/coupons/${id}`, data);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success('Başarılı', data.message || 'Kupon güncellendi');
      queryClient.invalidateQueries({ queryKey: ['vendor', 'coupons'] });
      closeCouponModal();
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Güncelleme başarısız');
    }
  });

  const deleteCouponMutation = useMutation({
    mutationFn: async (id) => {
      const res = await apiClient.delete(`/v1/vendor/coupons/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success('Başarılı', data.message || 'Kupon silindi');
      queryClient.invalidateQueries({ queryKey: ['vendor', 'coupons'] });
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Silme başarısız');
    }
  });

  const toggleCouponMutation = useMutation({
    mutationFn: async (id) => {
      const res = await apiClient.put(`/v1/vendor/coupons/${id}/toggle`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success('Başarılı', data.message);
      queryClient.invalidateQueries({ queryKey: ['vendor', 'coupons'] });
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'İşlem başarısız');
    }
  });

  // ============ CAMPAIGN MUTATIONS ============
  const createCampaignMutation = useMutation({
    mutationFn: async (data) => {
      const res = await apiClient.post('/v1/vendor/campaigns', data);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success('Başarılı', data.message || 'Kampanya oluşturuldu');
      queryClient.invalidateQueries({ queryKey: ['vendor', 'campaigns'] });
      closeCampaignModal();
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Kampanya oluşturulamadı');
    }
  });

  const updateCampaignMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await apiClient.put(`/v1/vendor/campaigns/${id}`, data);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success('Başarılı', data.message || 'Kampanya güncellendi');
      queryClient.invalidateQueries({ queryKey: ['vendor', 'campaigns'] });
      closeCampaignModal();
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Güncelleme başarısız');
    }
  });

  const deleteCampaignMutation = useMutation({
    mutationFn: async (id) => {
      const res = await apiClient.delete(`/v1/vendor/campaigns/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success('Başarılı', data.message || 'Kampanya silindi');
      queryClient.invalidateQueries({ queryKey: ['vendor', 'campaigns'] });
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'Silme başarısız');
    }
  });

  const toggleCampaignMutation = useMutation({
    mutationFn: async (id) => {
      const res = await apiClient.put(`/v1/vendor/campaigns/${id}/toggle`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success('Başarılı', data.message);
      queryClient.invalidateQueries({ queryKey: ['vendor', 'campaigns'] });
    },
    onError: (err) => {
      toast.error('Hata', err.response?.data?.message || 'İşlem başarısız');
    }
  });

  // ============ MODAL HANDLERS ============
  const openCouponModal = (coupon = null) => {
    setEditingCoupon(coupon);
    setShowCouponModal(true);
  };

  const closeCouponModal = () => {
    setShowCouponModal(false);
    setEditingCoupon(null);
  };

  const openCampaignModal = (campaign = null) => {
    setEditingCampaign(campaign);
    setShowCampaignModal(true);
  };

  const closeCampaignModal = () => {
    setShowCampaignModal(false);
    setEditingCampaign(null);
  };

  // ============ ACTION HANDLERS ============
  const handleDeleteCoupon = (id) => {
    if (confirm('Kuponu silmek istediğinize emin misiniz?')) {
      deleteCouponMutation.mutate(id);
    }
  };

  const handleDeleteCampaign = (id) => {
    if (confirm('Kampanyayı silmek istediğinize emin misiniz?')) {
      deleteCampaignMutation.mutate(id);
    }
  };

  const handleSaveCoupon = (data) => {
    if (editingCoupon) {
      updateCouponMutation.mutate({ id: editingCoupon.id, data });
    } else {
      createCouponMutation.mutate(data);
    }
  };

  const handleSaveCampaign = (data) => {
    if (editingCampaign) {
      updateCampaignMutation.mutate({ id: editingCampaign.id, data });
    } else {
      createCampaignMutation.mutate(data);
    }
  };

  return {
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

    // Mutations for loading states
    toggleCouponMutation,
    toggleCampaignMutation,
    isCouponSaving: createCouponMutation.isPending || updateCouponMutation.isPending,
    isCampaignSaving: createCampaignMutation.isPending || updateCampaignMutation.isPending
  };
};

export default useVendorPromotions;
