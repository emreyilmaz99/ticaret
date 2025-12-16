// src/pages/admin/Applications/hooks/useApplicationFilters.js
import { useState, useMemo } from 'react';

/**
 * Application filtering and search logic
 * Handles search term, status filter, and hover state for application tables
 */
const useApplicationFilters = (applications = [], vendors = []) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [hoveredRow, setHoveredRow] = useState(null);

  // Filter applications (pre-applications)
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = !searchTerm || 
        app.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.phone?.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [applications, searchTerm, statusFilter]);

  // Filter vendors (pending activation)
  const filteredVendors = useMemo(() => {
    return vendors.filter(vendor => {
      const matchesSearch = !searchTerm || 
        vendor.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.phone?.includes(searchTerm);
      
      return matchesSearch;
    });
  }, [vendors, searchTerm]);

  // Calculate stats for pre-applications
  const preStats = useMemo(() => ({
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  }), [applications]);

  // Calculate stats for vendors
  const vendorStats = useMemo(() => ({
    total: vendors.length,
  }), [vendors]);

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  return {
    // Search & Filter State
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    hoveredRow,
    setHoveredRow,
    
    // Filtered Data
    filteredApplications,
    filteredVendors,
    
    // Stats
    preStats,
    vendorStats,
    
    // Utils
    resetFilters,
  };
};

export default useApplicationFilters;
