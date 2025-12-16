// src/features/users/components/UserList/index.jsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUsers, getUser } from '../../api/userApi';
import { useUserFilters } from '../../hooks/useUserFilters';
import { useUserModal } from '../../hooks/useUserModal';
import { useUserMutations } from '../../hooks/useUserMutations';
import UserFilters from './UserFilters';
import UserTable from './UserTable';
import UserDetailModal from './modals/UserDetailModal';
import UserEditForm from './modals/UserEditForm';
import DeleteConfirmModal from './modals/DeleteConfirmModal';
import { styles } from '../../shared/styles';

const UserList = () => {
  // Custom hooks
  const {
    currentPage,
    perPage,
    searchTerm,
    debouncedSearch,
    filters,
    sortBy,
    sortOrder,
    showFilters,
    setCurrentPage,
    setSearchTerm,
    handleSort,
    updateFilter,
    resetFilters,
    toggleFilters,
  } = useUserFilters();

  const {
    selectedUser,
    modalMode,
    activeTab,
    editForm,
    userOrders,
    loadingOrders,
    setActiveTab,
    setEditForm,
    openViewModal,
    openEditModal,
    closeModal,
    setModalMode,
  } = useUserModal();

  const { deleteMutation, toggleStatusMutation, updateMutation } = useUserMutations(selectedUser?.id);

  const [confirmDelete, setConfirmDelete] = useState(null);

  // Query users list
  const { data: response, isLoading } = useQuery({
    queryKey: ['users', currentPage, perPage, debouncedSearch, filters, sortBy, sortOrder],
    queryFn: () =>
      getUsers({
        page: currentPage,
        per_page: perPage,
        search: debouncedSearch,
        is_active: filters.is_active,
        gender: filters.gender,
        email_verified: filters.email_verified,
        sort_by: sortBy,
        sort_order: sortOrder,
      }),
    keepPreviousData: true,
  });

  const users = response?.data?.data ?? [];
  const meta = response?.data?.meta ?? null;

  // Query user detail
  const { data: userDetailResponse, isLoading: userDetailLoading } = useQuery({
    queryKey: ['user', selectedUser?.id],
    queryFn: () => getUser(selectedUser.id),
    enabled: !!selectedUser?.id && modalMode !== null,
  });
  const userDetail = userDetailResponse?.data ?? null;

  // Handlers
  const handleDeleteConfirm = () => {
    if (confirmDelete) {
      deleteMutation.mutate(confirmDelete.id);
      setConfirmDelete(null);
    }
  };

  const handleEditSubmit = () => {
    updateMutation.mutate(
      { id: selectedUser.id, data: editForm },
      {
        onSuccess: () => {
          setModalMode('view');
        },
      }
    );
  };

  const handleOpenEdit = () => {
    if (userDetail) {
      openEditModal(userDetail);
    }
  };

  const handleCancelEdit = () => {
    setModalMode('view');
  };

  return (
    <div style={styles.container}>
      {/* Filters */}
      <UserFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        showFilters={showFilters}
        onToggleFilters={toggleFilters}
        filters={filters}
        onFilterChange={updateFilter}
        onResetFilters={resetFilters}
        totalUsers={meta?.total}
      />

      {/* Table */}
      <UserTable
        users={users}
        isLoading={isLoading}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        onView={openViewModal}
        onToggleStatus={(id) => toggleStatusMutation.mutate(id)}
        onDelete={setConfirmDelete}
        meta={meta}
        onPageChange={setCurrentPage}
        isToggling={toggleStatusMutation.isLoading}
      />

      {/* User Detail Modal */}
      {modalMode === 'view' && selectedUser && (
        <UserDetailModal
          userDetail={userDetail}
          isLoading={userDetailLoading}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onEdit={handleOpenEdit}
          onClose={closeModal}
          userOrders={userOrders}
          loadingOrders={loadingOrders}
        />
      )}

      {/* User Edit Modal */}
      {modalMode === 'edit' && selectedUser && (
        <div style={styles.modalOverlay} onClick={handleCancelEdit}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <UserEditForm
              editForm={editForm}
              onFormChange={setEditForm}
              onSubmit={handleEditSubmit}
              onCancel={handleCancelEdit}
              isUpdating={updateMutation.isLoading}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        user={confirmDelete}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDelete(null)}
        isDeleting={deleteMutation.isLoading}
      />
    </div>
  );
};

export default UserList;
