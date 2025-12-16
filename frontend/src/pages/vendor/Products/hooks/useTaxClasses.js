// src/pages/vendor/Products/hooks/useTaxClasses.js
import { useQuery } from '@tanstack/react-query';
import apiClient from '@lib/apiClient';

const BACKEND_URL = 'http://127.0.0.1:8000';

export const useTaxClasses = () => {
  const { data: taxClasses = [], isLoading, error } = useQuery({
    queryKey: ['vendor-tax-classes'],
    queryFn: async () => {
      // Public endpoint - authentication gerekmez
      const response = await apiClient.get(`${BACKEND_URL}/api/v1/tax-classes`);
      // Sadece aktif vergi sınıflarını getir
      return (response.data.data.tax_classes || []).filter(tc => tc.is_active);
    }
  });

  return { taxClasses, isLoading, error };
};
