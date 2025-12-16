// src/features/vendor/hooks/useVendorFilters.js
import { useState } from 'react';
import { DEFAULT_PAGINATION } from '../shared/constants';

export const useVendorFilters = (initialTab = 'all') => {
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGINATION.currentPage);
  const [itemsPerPage] = useState(DEFAULT_PAGINATION.itemsPerPage);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page on tab change
  };

  const resetFilters = () => {
    setSearchTerm('');
    setActiveTab('all');
    setCurrentPage(1);
  };

  return {
    // State
    currentPage,
    itemsPerPage,
    searchTerm,
    activeTab,
    // Actions
    setCurrentPage,
    setSearchTerm: handleSearchChange,
    setActiveTab: handleTabChange,
    resetFilters,
  };
};
