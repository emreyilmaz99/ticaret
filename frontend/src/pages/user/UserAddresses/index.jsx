// src/pages/user/UserAddresses/index.jsx
import React from 'react';
import { FaMapMarkerAlt, FaPlus } from 'react-icons/fa';
import { useUserAddresses } from './useUserAddresses';
import { getStyles } from './styles';
import { AddressCard } from './components/AddressCard';
import { AddressForm } from './components/AddressForm';

const UserAddresses = () => {
  const {
    addresses,
    isLoading,
    showForm,
    setShowForm,
    editingId,
    isMobile,
    form,
    setForm,
    resetForm,
    editAddress,
    handleSubmit,
    deleteMutation,
    setDefaultMutation
  } = useUserAddresses();

  const styles = getStyles(isMobile);

  const handleAddClick = () => {
    setForm({
      label: 'Ev',
      full_name: '',
      phone: '',
      country: 'Türkiye',
      city: '',
      district: '',
      neighborhood: '',
      address_line: '',
      postal_code: '',
      is_default: false
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const handleSetDefault = (id) => {
    setDefaultMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>
          <FaMapMarkerAlt style={{ color: '#3b82f6' }} />
          Adreslerim
        </h2>
        {!showForm && (
          <button onClick={handleAddClick} style={styles.addButton}>
            <FaPlus /> Yeni Adres Ekle
          </button>
        )}
      </div>

      {showForm ? (
        <AddressForm 
          formData={form}
          setFormData={setForm}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          isEditing={!!editingId}
          styles={styles}
        />
      ) : (
        <>
          {addresses.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                <FaMapMarkerAlt />
              </div>
              <h3>Henüz kayıtlı adresiniz yok</h3>
              <p>Siparişlerinizi daha hızlı tamamlamak için adres ekleyin.</p>
              <button onClick={handleAddClick} style={styles.addButton}>
                Adres Ekle
              </button>
            </div>
          ) : (
            <div style={styles.grid}>
              {addresses.map(address => (
                <AddressCard
                  key={address.id}
                  address={address}
                  onEdit={editAddress}
                  onDelete={handleDelete}
                  onSetDefault={handleSetDefault}
                  styles={styles}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserAddresses;
