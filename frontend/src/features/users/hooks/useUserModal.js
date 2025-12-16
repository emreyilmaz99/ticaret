// src/features/users/hooks/useUserModal.js
import { useState, useEffect, useCallback } from 'react';
import { MODAL_TABS } from '../shared/constants';

export const useUserModal = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'view' | 'edit'
  const [activeTab, setActiveTab] = useState(MODAL_TABS.DETAILS);
  const [editForm, setEditForm] = useState({});
  const [userOrders, setUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const openViewModal = useCallback((user) => {
    setSelectedUser(user);
    setModalMode('view');
    setActiveTab(MODAL_TABS.DETAILS);
  }, []);

  const openEditModal = useCallback((userDetail) => {
    if (userDetail) {
      setEditForm({
        name: userDetail.name || '',
        email: userDetail.email || '',
        phone: userDetail.phone || '',
        gender: userDetail.gender || '',
        birth_date: userDetail.birth_date || '',
        is_active: userDetail.is_active ?? true,
      });
      setModalMode('edit');
    }
  }, []);

  const closeModal = useCallback(() => {
    setSelectedUser(null);
    setModalMode(null);
    setEditForm({});
    setActiveTab(MODAL_TABS.DETAILS);
    setUserOrders([]);
  }, []);

  const loadUserOrders = useCallback(async (userId) => {
    setLoadingOrders(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`http://127.0.0.1:8000/api/v1/admin/users/${userId}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setUserOrders(data.data.orders || []);
      }
    } catch (error) {
      console.error('Siparişler yüklenirken hata:', error);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  // Load orders when switching to orders tab
  useEffect(() => {
    if (activeTab === MODAL_TABS.ORDERS && selectedUser?.id && userOrders.length === 0) {
      loadUserOrders(selectedUser.id);
    }
  }, [activeTab, selectedUser?.id, userOrders.length, loadUserOrders]);

  return {
    // State
    selectedUser,
    modalMode,
    activeTab,
    editForm,
    userOrders,
    loadingOrders,
    // Actions
    setSelectedUser,
    setModalMode,
    setActiveTab,
    setEditForm,
    openViewModal,
    openEditModal,
    closeModal,
    loadUserOrders,
  };
};
