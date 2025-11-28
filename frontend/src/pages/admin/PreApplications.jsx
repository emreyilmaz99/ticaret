import React from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { getVendors, updateVendorStatus } from '../../features/vendor/api/vendorApi';
import { FaCheck, FaTimes } from 'react-icons/fa';

const PreApplications = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['preApplications'],
    queryFn: async () => {
      const res = await getVendors({ status: 'pre_pending', per_page: 50 });
      return res.data; // assume API responds with { data: [...], meta }
    },
    staleTime: 1000 * 60
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }) => updateVendorStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['preApplications']);
      queryClient.invalidateQueries(['vendors']);
      alert('Durum güncellendi');
    },
    onError: (err) => alert('Güncelleme başarısız: ' + (err.response?.data?.message || err.message))
  });

  if (isLoading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {(error.message || 'Bilinmeyen hata')}</div>;

  const vendors = data?.data || [];

  return (
    <div>
      <h1 style={{ marginBottom: 16 }}>Ön Başvurular</h1>
      <p style={{ color: '#64748b', marginBottom: 16 }}>Bu listede yalnızca ön başvuru (pre_pending) statüsündeki satıcılar gösterilir.</p>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: 12, textAlign: 'left' }}>Mağaza</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Yetkili</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Vergi No</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Telefon</th>
              <th style={{ padding: 12, textAlign: 'right' }}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map(v => (
              <tr key={v.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: 12 }}>{v.storeName || v.name}</td>
                <td style={{ padding: 12 }}>{v.email}</td>
                <td style={{ padding: 12 }}>{v.tax_id || '-'}</td>
                <td style={{ padding: 12 }}>{v.phone || '-'}</td>
                <td style={{ padding: 12, textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button onClick={() => {
                        if (!confirm('Bu ön başvuruyu onaylamak istiyor musunuz?')) return;
                        mutation.mutate({ id: v.id, status: 'pre_approved' });
                      }}
                      style={{ padding: 8, borderRadius: 6, border: '1px solid #dcfce7', background: '#dcfce7', color: '#16a34a', cursor: 'pointer' }}>
                      <FaCheck />
                    </button>

                    <button onClick={() => {
                        if (!confirm('Bu ön başvuruyu reddetmek istiyor musunuz?')) return;
                        mutation.mutate({ id: v.id, status: 'pre_rejected' });
                      }}
                      style={{ padding: 8, borderRadius: 6, border: '1px solid #fee2e2', background: '#fff1f2', color: '#ef4444', cursor: 'pointer' }}>
                      <FaTimes />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default PreApplications;
