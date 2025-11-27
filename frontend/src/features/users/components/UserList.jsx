import React, { useState } from 'react';
import { FaSearch, FaUser, FaTrash, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, deleteUser } from '../api/userApi';

const UserList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const queryClient = useQueryClient();

  // React Query ile Veri Çekme
  const { data: users = [], isLoading: loading } = useQuery({
    queryKey: ['users', currentPage],
    queryFn: async () => {
      const response = await getUsers(currentPage);
      // API yanıtı { data: [...], meta: ... } veya { data: { data: [...] } } olabilir.
      // AdminList'teki gibi response.data.data kontrolü yapalım.
      return response.data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 dakika
  });

  // Silme İşlemi
  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
    onError: (error) => {
      console.error('Error deleting user:', error);
      alert('Kullanıcı silinemedi.');
    }
  });

  const handleDelete = async (id) => {
    if (window.confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) {
      deleteMutation.mutate(id);
    }
  };

  // Filtreleme
  const filteredUsers = Array.isArray(users) ? users.filter(user => 
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  ) : [];

  // Sayfalama (Client-side pagination for now if API returns all, or handle server-side if needed)
  // Assuming API returns all for now based on AdminList logic, but let's be safe.
  // If API is paginated, we should use server data. For now, let's assume client-side filtering of the fetched page/list.
  
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div style={{ padding: '24px', color: 'var(--text-muted)' }}>Yükleniyor...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header & Actions */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        backgroundColor: 'var(--bg-card)', 
        padding: '16px 24px', 
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Kullanıcı Ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '10px 10px 10px 36px',
                borderRadius: 'var(--radius)',
                border: '1px solid #e2e8f0',
                outline: 'none',
                width: '300px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>
        
        <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Toplam <strong>{filteredUsers.length}</strong> kullanıcı
        </div>
      </div>

      {/* Tablo */}
      <div style={{ 
        backgroundColor: 'var(--bg-card)', 
        borderRadius: 'var(--radius)', 
        boxShadow: 'var(--shadow-sm)', 
        border: '1px solid #e2e8f0',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Kullanıcı</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email</th>
              <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Kayıt Tarihi</th>
              <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '50%', 
                        backgroundColor: '#e0e7ff', 
                        color: '#4338ca',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: '16px'
                      }}>
                        <FaUser />
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{user.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ID: #{user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>{user.email}</td>
                  <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>
                    {new Date(user.created_at).toLocaleDateString('tr-TR')}
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button 
                      onClick={() => handleDelete(user.id)}
                      style={{ 
                        padding: '8px', 
                        color: '#ef4444', 
                        backgroundColor: '#fee2e2', 
                        border: 'none', 
                        borderRadius: '6px', 
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      title="Sil"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Kullanıcı bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '24px', gap: '8px' }}>
            <button 
              onClick={() => paginate(currentPage - 1)} 
              disabled={currentPage === 1}
              style={{
                padding: '8px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                backgroundColor: currentPage === 1 ? '#f1f5f9' : 'white',
                color: currentPage === 1 ? '#94a3b8' : 'var(--text-main)',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              <FaChevronLeft />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => (
              <button 
                key={i + 1} 
                onClick={() => paginate(i + 1)}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  backgroundColor: currentPage === i + 1 ? 'var(--primary)' : 'white',
                  color: currentPage === i + 1 ? 'white' : 'var(--text-main)',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                {i + 1}
              </button>
            ))}

            <button 
              onClick={() => paginate(currentPage + 1)} 
              disabled={currentPage === totalPages}
              style={{
                padding: '8px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                backgroundColor: currentPage === totalPages ? '#f1f5f9' : 'white',
                color: currentPage === totalPages ? '#94a3b8' : 'var(--text-main)',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
