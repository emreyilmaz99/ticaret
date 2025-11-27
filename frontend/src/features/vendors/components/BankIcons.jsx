import React from 'react';

export const ZiraatIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="4" fill="#E30613"/>
    <path d="M7 17V7H10.5C12.5 7 13.5 8 13.5 10C13.5 11.5 12.5 12.5 11 12.5H9V17H7Z" fill="white"/>
    <path d="M14 17V12H16V15H18V12H20V17H14Z" fill="white"/>
    <path d="M4 17V12H6V17H4Z" fill="white"/>
  </svg>
);

export const GarantiIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="4" fill="#005F33"/>
    <path d="M12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6ZM12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16Z" fill="white"/>
    <path d="M12 14V10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <path d="M10 12H14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const IsBankasiIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="4" fill="#1F4E79"/>
    <path d="M12 5V19" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M8 8C8 8 10 6 12 6C14 6 16 8 16 10C16 12 14 13 12 13C10 13 8 14 8 16C8 18 10 20 12 20C14 20 16 18 16 18" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

export const AkbankIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="4" fill="#ED1C24"/>
    <path d="M12 6L6 18H8.5L9.75 15.5H14.25L15.5 18H18L12 6ZM10.5 13.5L12 9.5L13.5 13.5H10.5Z" fill="white"/>
  </svg>
);

export const YapiKrediIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="4" fill="#004F9F"/>
    <circle cx="12" cy="12" r="6" stroke="white" strokeWidth="2"/>
    <path d="M12 6V12L16 16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const VakifBankIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="4" fill="#FCB131"/>
    <path d="M6 7L12 19L18 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const HalkbankIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="4" fill="#0099D8"/>
    <circle cx="12" cy="12" r="7" fill="white"/>
    <path d="M12 7V17" stroke="#0099D8" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M8 12H16" stroke="#0099D8" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

export const QNBIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="4" fill="#880060"/>
    <path d="M12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6ZM14 14L10 10M10 14L14 10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const OtherBankIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="4" fill="#64748B"/>
    <path d="M4 10V20H20V10M2 10L12 4L22 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 14V17M12 14V17M16 14V17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const getBankIcon = (bankName, size = 24) => {
  if (!bankName) return <OtherBankIcon size={size} />;
  const name = bankName.toLowerCase();
  if (name.includes('ziraat')) return <ZiraatIcon size={size} />;
  if (name.includes('garanti')) return <GarantiIcon size={size} />;
  if (name.includes('iş') || name.includes('is bank')) return <IsBankasiIcon size={size} />;
  if (name.includes('akbank')) return <AkbankIcon size={size} />;
  if (name.includes('yapı') || name.includes('yapi')) return <YapiKrediIcon size={size} />;
  if (name.includes('vakıf') || name.includes('vakif')) return <VakifBankIcon size={size} />;
  if (name.includes('halk')) return <HalkbankIcon size={size} />;
  if (name.includes('qnb') || name.includes('finans')) return <QNBIcon size={size} />;
  return <OtherBankIcon size={size} />;
};
