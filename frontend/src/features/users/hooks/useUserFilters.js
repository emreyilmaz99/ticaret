// src/features/users/hooks/useUserFilters.js
import { useState, useEffect } from 'react';
import { DEFAULT_FILTERS, DEFAULT_SORT, DEFAULT_PAGINATION } from '../shared/constants';

export const useUserFilters = () => {
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGINATION.currentPage);
  const [perPage] = useState(DEFAULT_PAGINATION.perPage);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState(DEFAULT_SORT.sortBy);
  const [sortOrder, setSortOrder] = useState(DEFAULT_SORT.sortOrder);
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const updateFilter = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchTerm('');
    setCurrentPage(1);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return {
    // State
    currentPage,
    perPage,
    searchTerm,
    debouncedSearch,
    filters,
    sortBy,
    sortOrder,
    showFilters,
    // Actions
    setCurrentPage,
    setSearchTerm,
    handleSort,
    updateFilter,
    resetFilters,
    toggleFilters,
  };
};
