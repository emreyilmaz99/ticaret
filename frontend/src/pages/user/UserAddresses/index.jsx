// src/pages/user/UserAddresses/index.jsx
import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPlus, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const styles = getStyles(isMobile);

  const handleAddClick = () => {
    setForm({
      label: 'Ev',
      full_name: '',
      phone: '',
      identity_number: '',
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

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAddresses = addresses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(addresses.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          editingId={editingId}
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
            <>
              <div style={styles.grid}>
                {currentAddresses.map(address => (
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

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div style={styles.pagination}>
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{
                      ...styles.pageBtn,
                      opacity: currentPage === 1 ? 0.5 : 1,
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <FaChevronLeft size={12} />
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      style={{
                        ...styles.pageBtn,
                        ...(currentPage === index + 1 ? styles.activePageBtn : {})
                      }}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{
                      ...styles.pageBtn,
                      opacity: currentPage === totalPages ? 0.5 : 1,
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <FaChevronRight size={12} />
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default UserAddresses;
