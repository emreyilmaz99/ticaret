// Re-export wrapper for backward compatibility
// This component shows only active vendors by passing mode='active_only' to VendorList
import React from 'react';
import VendorList from './VendorList';
import { VENDOR_MODES } from '../shared/constants';

const ActiveVendorList = (props) => {
  return <VendorList mode={VENDOR_MODES.ACTIVE_ONLY} {...props} />;
};

export default ActiveVendorList;
