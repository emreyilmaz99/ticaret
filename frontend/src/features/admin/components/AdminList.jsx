import React, { useState } from 'react';
import { FaSearch, FaUserShield, FaEdit, FaTrash, FaPlus, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Pagination from '../../../components/ui/Pagination';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdmins, deleteAdmin } from '../api/adminApi';
import { useToast } from '../../../components/common/Toast';

const AdminList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: admins = [], isLoading: loading } = useQuery({
    queryKey: ['admins'],
    queryFn: async () => {
      const response = await getAdmins({ per_page: 100 });
      return response.data?.data || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries(['admins']);
      toast.success('Yönetici Silindi', 'Yönetici başarıyla silindi.', 3000);
    },
    onError: (error) => { 
      console.error('Error deleting admin:', error); 
      toast.error('Hata', 'Silme işlemi başarısız oldu.', 4000); 
    }
  });

  const handleDelete = async (id) => {
    if (window.confirm('Bu yöneticiyi silmek istediğinize emin misiniz?')) {
      deleteMutation.mutate(id);
    }
  };

  const getRoleBadge = (role) => {
    const roleMap = {
      'super-admin': { label: 'Süper Yönetici', bg: '#e0e7ff', color: '#4338ca' },
      'admin': { label: 'Yönetici', bg: '#dbeafe', color: '#1e40af' },
      'editor': { label: 'Editör', bg: '#f3e8ff', color: '#7e22ce' },
      'moderator': { label: 'Moderatör', bg: '#ffedd5', color: '#c2410c' },
    };
    const config = roleMap[role] || { label: role, bg: '#f1f5f9', color: '#475569' };
    return (
      <span style={{ backgroundColor: config.bg, color: config.color, padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{config.label}</span>
    );
  };

  const filteredAdmins = admins.filter(admin => admin.name.toLowerCase().includes(searchTerm.toLowerCase()) || admin.email.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAdmins.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-card)', padding: '16px 24px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Yönetici ara..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} style={{ padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', width: '250px', fontFamily: 'Inter, sans-serif' }} />
          </div>
        </div>

        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 2px 4px rgba(79, 70, 229, 0.2)' }}>
          <FaPlus /> Yeni Yönetici Ekle
        </button>
      </div>

      <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Yönetici</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Roller</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Durum</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Kayıt Tarihi</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'right' }}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>Yükleniyor...</td></tr>
            ) : currentItems.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>Kayıt bulunamadı.</td></tr>
            ) : (
              currentItems.map((admin) => (
                <tr key={admin.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', backgroundColor: '#e0e7ff', color: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        <FaUserShield />
                      </div>
                      <div>
                        <p style={{ fontWeight: '600', color: 'var(--text-main)' }}>{admin.name}</p>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{admin.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>{admin.roles && admin.roles.map((role, index) => (<React.Fragment key={index}>{getRoleBadge(role)}</React.Fragment>))}</div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>{admin.is_active ? (<span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#166534', fontSize: '13px', fontWeight: '500' }}><FaCheckCircle /> Aktif</span>) : (<span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#991b1b', fontSize: '13px', fontWeight: '500' }}><FaTimesCircle /> Pasif</span>)}</td>
                  <td style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '13px' }}>{new Date(admin.created_at).toLocaleDateString('tr-TR')}</td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button title="Düzenle" style={{ padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: 'white', color: 'var(--text-muted)', cursor: 'pointer' }}><FaEdit /></button>
                      <button onClick={() => handleDelete(admin.id)} title="Sil" style={{ padding: '8px', borderRadius: '6px', border: '1px solid #fee2e2', backgroundColor: '#fff1f2', color: '#ef4444', cursor: 'pointer' }}><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0' }}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredAdmins.length}
            perPage={itemsPerPage}
            onPageChange={paginate}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminList;
