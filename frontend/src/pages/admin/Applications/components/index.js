// src/pages/admin/Applications/components/index.js
/**
 * Barrel export for Application components
 * Centralized imports for better organization
 */

// Tables
export { default as ApplicationTable } from './tables/ApplicationTable';
export { default as VendorTable } from './tables/ApplicationTable'; // Alias for backward compatibility
export { default as PreApplicationTable } from './tables/ApplicationTable'; // Alias for pre-applications

// Modals
export { default as VendorDetailModal } from './modals/VendorDetailModal';
export { default as PreApplicationDetailModal } from './PreApplicationDetailModal';
export { default as ApproveModal } from './ApproveModal';
export { default as RejectModal } from './RejectModal';

// Other Components
export { default as SearchBar } from './SearchBar';
export { default as InfoBox } from './InfoBox';
export { default as ApplicationTabs } from './ApplicationTabs';

// Shared Components (re-export from centralized location)
export * from '../shared/components';
