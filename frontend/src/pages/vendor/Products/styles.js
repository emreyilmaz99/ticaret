// src/pages/vendor/Products/styles.js

export const styles = {
  container: { 
    padding: '24px', 
    fontFamily: "'Inter', sans-serif", 
    color: '#1e293b' 
  },
  
  // --- Header Section ---
  pageHeader: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
    marginBottom: '24px',
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    padding: '28px 32px',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    flexWrap: 'wrap',
    gap: '16px',
  },
  headerLeft: { 
    display: 'flex', 
    alignItems: 'flex-start', 
    gap: '16px' 
  },
  headerIcon: { 
    fontSize: '28px', 
    color: '#059669',
    marginTop: '4px'
  },
  title: { 
    fontSize: '26px', 
    fontWeight: '800', 
    color: '#0f172a', 
    letterSpacing: '-0.02em',
    margin: 0
  },
  subtitle: { 
    color: '#64748b', 
    fontSize: '15px', 
    marginTop: '6px',
    margin: '6px 0 0 0'
  },
  addButton: { 
    backgroundColor: '#059669', 
    color: 'white', 
    border: 'none', 
    padding: '10px 20px', 
    borderRadius: '8px', 
    fontWeight: '600', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px', 
    cursor: 'pointer', 
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    fontSize: '14px'
  },
  buttonIcon: { 
    fontSize: '14px' 
  },

  // --- Stats Section ---
  statsBar: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
    gap: '16px', 
    marginBottom: '24px' 
  },
  statCard: { 
    backgroundColor: 'white', 
    padding: '20px', 
    borderRadius: '12px', 
    border: '1px solid #e2e8f0', 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '8px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  },
  statValue: { 
    fontSize: '24px', 
    fontWeight: '700', 
    color: '#1e293b' 
  },
  statLabel: { 
    fontSize: '14px', 
    color: '#64748b',
    fontWeight: '500'
  },

  // --- Toolbar Section ---
  toolbar: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    gap: '16px', 
    marginBottom: '24px', 
    flexWrap: 'wrap' 
  },
  searchWrapper: { 
    flex: 1, 
    position: 'relative', 
    minWidth: '300px' 
  },
  searchIcon: { 
    position: 'absolute', 
    left: '12px', 
    top: '50%', 
    transform: 'translateY(-50%)', 
    color: '#94a3b8' 
  },
  searchInput: { 
    width: '100%', 
    padding: '10px 10px 10px 40px', 
    borderRadius: '8px', 
    border: '1px solid #e2e8f0', 
    outline: 'none', 
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  toolbarRight: { 
    display: 'flex', 
    gap: '12px', 
    alignItems: 'center' 
  },
  sortSelect: { 
    padding: '10px', 
    borderRadius: '8px', 
    border: '1px solid #e2e8f0', 
    outline: 'none', 
    backgroundColor: 'white', 
    cursor: 'pointer',
    fontSize: '14px',
    color: '#334155'
  },
  viewToggle: { 
    display: 'flex', 
    backgroundColor: 'white', 
    borderRadius: '8px', 
    border: '1px solid #e2e8f0', 
    overflow: 'hidden' 
  },
  viewButton: { 
    padding: '10px', 
    border: 'none', 
    backgroundColor: 'transparent', 
    cursor: 'pointer', 
    color: '#64748b', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    width: '40px'
  },
  viewButtonActive: { 
    backgroundColor: '#f1f5f9', 
    color: '#0f172a' 
  },

  // --- Grid Section ---
  grid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
    gap: '24px' 
  },
  emptyState: { 
    textAlign: 'center', 
    padding: '48px', 
    color: '#64748b',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px dashed #cbd5e1'
  },

  // --- Product Card ---
  card: { 
    backgroundColor: 'white', 
    borderRadius: '12px', 
    border: '1px solid #e2e8f0', 
    overflow: 'hidden', 
    transition: 'transform 0.2s, box-shadow 0.2s', 
    display: 'flex', 
    flexDirection: 'column',
    position: 'relative',
    height: '100%'
  },
  cardImageWrapper: { 
    position: 'relative', 
    paddingTop: '75%', // 4:3 aspect ratio
    backgroundColor: '#f8fafc', 
    cursor: 'pointer', 
    overflow: 'hidden',
    borderBottom: '1px solid #f1f5f9'
  },
  cardImage: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    width: '100%', 
    height: '100%', 
    objectFit: 'cover',
    transition: 'transform 0.3s ease'
  },
  noImage: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    width: '100%', 
    height: '100%', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    color: '#cbd5e1',
    backgroundColor: '#f1f5f9'
  },
  featuredBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: '#fbbf24',
    color: '#fff',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    zIndex: 2,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  cardBody: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    gap: '8px'
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#0f172a',
    margin: 0,
    lineHeight: '1.4',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  cardCategory: {
    fontSize: '13px',
    color: '#64748b',
    margin: 0
  },
  cardMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: '12px',
    borderTop: '1px solid #f1f5f9'
  },
  cardPrice: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#059669'
  },
  cardStock: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '500'
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px',
    gap: '8px'
  },
  cardActions: {
    display: 'flex',
    gap: '4px'
  },
  actionBtn: {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    backgroundColor: 'white',
    color: '#64748b',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '14px'
  },
  
  // Status Styles
  statusActive: { 
    backgroundColor: '#dcfce7', 
    color: '#166534', 
    padding: '4px 8px', 
    borderRadius: '4px', 
    fontSize: '12px', 
    fontWeight: '600' 
  },
  statusDraft: { 
    backgroundColor: '#fef3c7', 
    color: '#92400e', 
    padding: '4px 8px', 
    borderRadius: '4px', 
    fontSize: '12px', 
    fontWeight: '600' 
  },
  statusPending: { 
    backgroundColor: '#e0f2fe', 
    color: '#075985', 
    padding: '4px 8px', 
    borderRadius: '4px', 
    fontSize: '12px', 
    fontWeight: '600' 
  },
  statusDefault: { 
    backgroundColor: '#f1f5f9', 
    color: '#475569', 
    padding: '4px 8px', 
    borderRadius: '4px', 
    fontSize: '12px', 
    fontWeight: '600' 
  },

  // --- Table Section ---
  tableWrapper: {
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '800px'
  },
  th: {
    padding: '16px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
    whiteSpace: 'nowrap'
  },
  tr: {
    borderBottom: '1px solid #f1f5f9',
    transition: 'background-color 0.1s'
  },
  td: {
    padding: '16px',
    color: '#334155',
    fontSize: '14px',
    verticalAlign: 'middle'
  },
  tableImageWrapper: {
    width: '48px',
    height: '48px',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#f1f5f9',
    border: '1px solid #e2e8f0',
    cursor: 'pointer'
  },
  tableImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  tableNoImage: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#cbd5e1'
  },
  productNameCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  productName: {
    fontWeight: '500',
    color: '#0f172a'
  },
  skuText: {
    display: 'block',
    fontSize: '12px',
    color: '#64748b',
    marginTop: '2px'
  },
  tableActions: {
    display: 'flex',
    gap: '8px'
  },

  // --- Legacy / Other Styles (Merged) ---
  header: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '32px' 
  },
  btnPrimary: { 
    backgroundColor: '#059669', 
    color: 'white', 
    border: 'none', 
    padding: '10px 20px', 
    borderRadius: '8px', 
    fontWeight: '600', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px', 
    cursor: 'pointer', 
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
  },
  btnSecondary: { 
    padding: '0 20px', 
    backgroundColor: 'white', 
    border: '1px solid #e2e8f0', 
    borderRadius: '8px', 
    color: '#475569', 
    fontWeight: '600', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px', 
    cursor: 'pointer' 
  },
  filterContainer: { 
    backgroundColor: 'white', 
    padding: '16px', 
    borderRadius: '12px', 
    marginBottom: '24px', 
    display: 'flex', 
    gap: '16px', 
    border: '1px solid #e2e8f0', 
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)' 
  },
  inputWrapper: { 
    flex: 1, 
    position: 'relative' 
  },
  inputIcon: { 
    position: 'absolute', 
    left: '16px', 
    top: '50%', 
    transform: 'translateY(-50%)', 
    color: '#94a3b8' 
  },
  input: { 
    width: '100%', 
    padding: '10px 12px', 
    borderRadius: '8px', 
    border: '1px solid #e2e8f0', 
    outline: 'none', 
    fontSize: '14px',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
  },
  tableContainer: { 
    backgroundColor: 'white', 
    borderRadius: '12px', 
    border: '1px solid #e2e8f0', 
    overflow: 'hidden', 
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)' 
  },
  table: { 
    width: '100%', 
    borderCollapse: 'collapse' 
  },
  th: { 
    padding: '16px', 
    textAlign: 'left', 
    fontSize: '12px', 
    fontWeight: '600', 
    color: '#64748b', 
    textTransform: 'uppercase', 
    backgroundColor: '#f8fafc', 
    borderBottom: '1px solid #e2e8f0' 
  },
  td: { 
    padding: '16px', 
    borderBottom: '1px solid #f1f5f9', 
    color: '#334155' 
  },
  // --- Modal Styles ---
  modalOverlay: { 
    position: 'fixed', 
    inset: 0, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    zIndex: 1200, 
    backdropFilter: 'blur(4px)' 
  },
  modal: { 
    backgroundColor: 'white', 
    width: '100%', 
    maxWidth: '900px', 
    borderRadius: '16px', 
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', 
    display: 'flex', 
    flexDirection: 'column', 
    maxHeight: '90vh',
    position: 'relative',
    margin: '20px'
  },
  modalHeader: { 
    padding: '20px 24px', 
    borderBottom: '1px solid #f1f5f9', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  modalTitle: { 
    fontSize: '18px', 
    fontWeight: '700', 
    color: '#0f172a',
    margin: 0
  },
  modalCloseBtn: {
    background: 'none',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
    fontSize: '16px'
  },
  modalTabs: {
    display: 'flex',
    padding: '0 24px',
    borderBottom: '1px solid #f1f5f9',
    gap: '24px',
    overflowX: 'auto'
  },
  modalTab: {
    padding: '16px 0',
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    color: '#64748b',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap'
  },
  modalTabActive: {
    color: '#059669',
    borderBottom: '2px solid #059669',
    fontWeight: '600'
  },
  modalBody: { 
    flex: 1, 
    overflowY: 'auto',
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  },
  modalFooter: { 
    padding: '20px 24px', 
    borderTop: '1px solid #f1f5f9', 
    display: 'flex', 
    justifyContent: 'flex-end', 
    gap: '12px', 
    backgroundColor: '#f8fafc', 
    borderBottomLeftRadius: '16px', 
    borderBottomRightRadius: '16px' 
  },
  cancelBtn: {
    padding: '10px 20px',
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    color: '#64748b',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    transition: 'all 0.2s'
  },
  submitBtn: {
    padding: '10px 20px',
    backgroundColor: '#059669',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    boxShadow: '0 2px 4px rgba(5, 150, 105, 0.2)',
    transition: 'all 0.2s'
  },
  
  // --- Form Styles ---
  select: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    outline: 'none',
    fontSize: '14px',
    backgroundColor: 'white',
    color: '#334155',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    outline: 'none',
    fontSize: '14px',
    minHeight: '100px',
    resize: 'vertical',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  },
  required: {
    color: '#ef4444',
    marginLeft: '4px'
  },
  radioGroup: {
    display: 'flex',
    gap: '24px',
    marginTop: '8px'
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer'
  },
  radioText: {
    fontSize: '14px',
    color: '#334155'
  },
  helpText: {
    display: 'block',
    fontSize: '12px',
    color: '#94a3b8',
    marginTop: '4px'
  },

  // --- Tab Content Styles ---
  tabContent: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    boxSizing: 'border-box',
    width: '100%',
    overflow: 'hidden',
  },

  // --- Switch Toggle Styles ---
  switchLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
  },
  switchText: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#334155',
  },
  switch: {
    width: '44px',
    height: '24px',
    backgroundColor: '#e2e8f0',
    borderRadius: '12px',
    position: 'relative',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  switchActive: {
    backgroundColor: '#059669',
  },
  switchHandle: {
    width: '20px',
    height: '20px',
    backgroundColor: '#fff',
    borderRadius: '50%',
    position: 'absolute',
    top: '2px',
    left: '2px',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
  },
  switchHandleActive: {
    left: '22px',
  },

  // --- Tags Styles (Modern Design) ---
  tagInputWrapper: {
    width: '100%',
    marginBottom: '12px',
  },
  tagInputField: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '14px',
    color: '#334155',
    backgroundColor: '#fff',
    outline: 'none',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
  },
  tagsListContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '10px',
    padding: '0',
    marginBottom: '8px',
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    minHeight: '52px',
    backgroundColor: '#f8fafc',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    transition: 'all 0.2s ease',
  },
  tag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 14px',
    backgroundColor: '#059669',
    color: '#ffffff',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    letterSpacing: '0.3px',
    boxShadow: '0 2px 6px rgba(5, 150, 105, 0.25)',
    transition: 'all 0.2s ease',
  },
  tagRemoveBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '18px',
    height: '18px',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    border: 'none',
    borderRadius: '50%',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '10px',
    padding: 0,
    marginLeft: '2px',
  },
  tagInput: {
    flex: 1,
    minWidth: '120px',
    padding: '6px 0',
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: '14px',
    color: '#334155',
  },

  // --- Confirm Modal Styles ---
  confirmOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1300,
    backdropFilter: 'blur(4px)'
  },
  confirmModal: {
    backgroundColor: 'white',
    width: '100%',
    maxWidth: '400px',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '16px',
    animation: 'scaleIn 0.2s ease-out'
  },
  confirmIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#fef2f2',
    color: '#ef4444',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px'
  },
  confirmTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0
  },
  confirmMessage: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
    lineHeight: '1.5'
  },
  confirmButtons: {
    display: 'flex',
    gap: '12px',
    width: '100%',
    marginTop: '8px'
  },
  confirmCancelBtn: {
    flex: 1,
    padding: '10px',
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    color: '#64748b',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  confirmDeleteBtn: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#ef4444',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)',
    transition: 'all 0.2s'
  },

  // --- Media Tab Styles ---
  imageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '16px',
    marginTop: '12px'
  },
  imageItem: {
    position: 'relative',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid #e2e8f0',
    aspectRatio: '1/1',
    backgroundColor: '#f8fafc'
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    cursor: 'pointer',
    transition: 'transform 0.2s'
  },
  imageDeleteBtn: {
    position: 'absolute',
    top: '4px',
    right: '4px',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    border: 'none',
    color: '#ef4444',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    zIndex: 2
  },
  mainImageBadge: {
    position: 'absolute',
    bottom: '4px',
    left: '4px',
    backgroundColor: '#059669',
    color: 'white',
    fontSize: '10px',
    padding: '2px 6px',
    borderRadius: '4px',
    fontWeight: '600',
    zIndex: 2
  },
  uploadArea: {
    border: '2px dashed #cbd5e1',
    borderRadius: '12px',
    padding: '32px',
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: '#f8fafc',
    transition: 'all 0.2s',
    position: 'relative'
  },
  fileInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer'
  },
  uploadLabel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    color: '#64748b',
    pointerEvents: 'none'
  },
  uploadIcon: {
    fontSize: '32px',
    color: '#94a3b8'
  },
  uploadHint: {
    fontSize: '12px',
    color: '#94a3b8'
  },
  newImagesPreview: {
    marginTop: '24px',
    borderTop: '1px solid #f1f5f9',
    paddingTop: '24px'
  },
  newImagesTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#334155',
    marginBottom: '12px'
  },

  sidebar: { 
    width: '240px', 
    backgroundColor: '#f8fafc', 
    borderRight: '1px solid #f1f5f9', 
    padding: '16px', 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '8px', 
    overflowY: 'auto' 
  },
  tabBtn: (active) => ({
    display: 'flex', 
    alignItems: 'center', 
    gap: '12px', 
    padding: '12px 16px', 
    borderRadius: '8px', 
    fontSize: '14px', 
    fontWeight: '500', 
    cursor: 'pointer',
    backgroundColor: active ? 'white' : 'transparent',
    color: active ? '#059669' : '#64748b',
    boxShadow: active ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
    border: active ? '1px solid #e2e8f0' : '1px solid transparent',
    width: '100%', 
    textAlign: 'left'
  }),
  contentArea: { 
    flex: 1, 
    padding: '32px', 
    overflowY: 'auto',
    overflowX: 'hidden',
    boxSizing: 'border-box',
  },
  formGroup: { 
    marginBottom: '16px',
    width: '100%',
    boxSizing: 'border-box',
  },
  label: { 
    display: 'block', 
    fontSize: '14px', 
    fontWeight: '500', 
    color: '#334155', 
    marginBottom: '8px',
    wordWrap: 'break-word',
  },
  readOnlyValue: {
    padding: '12px 16px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#475569',
    border: '1px solid #e2e8f0',
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    wordWrap: 'break-word',
  },
  formInput: { 
    width: '100%', 
    padding: '10px 12px', 
    borderRadius: '8px', 
    border: '1px solid #e2e8f0', 
    outline: 'none', 
    fontSize: '14px', 
    transition: 'border-color 0.2s' 
  },
  grid2: { 
    display: 'grid', 
    gridTemplateColumns: '1fr 1fr', 
    gap: '20px' 
  },
  grid4: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(4, 1fr)', 
    gap: '16px' 
  },

  // --- Variants Section ---
  variantsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '2px solid #e2e8f0'
  },
  variantsTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0
  },
  addVariantBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    backgroundColor: '#059669',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 2px 4px rgba(5, 150, 105, 0.2)'
  },
  emptyVariants: {
    textAlign: 'center',
    padding: '48px 24px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '2px dashed #cbd5e1'
  },
  variantsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  variantCard: { 
    padding: '20px', 
    border: '1px solid #e2e8f0', 
    borderRadius: '12px', 
    backgroundColor: '#fff', 
    position: 'relative',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.2s'
  },
  variantHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid #f1f5f9'
  },
  variantIndex: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#059669',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  variantDeleteBtn: {
    padding: '8px 12px',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  variantFields: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  variantRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px'
  },
  variantField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  variantLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#475569',
    marginBottom: '4px'
  },
  variantInput: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s',
    backgroundColor: '#fff'
  },
  variantSelect: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  inputWithPrefix: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  },
  inputPrefix: {
    position: 'absolute',
    left: '14px',
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '600',
    pointerEvents: 'none',
    zIndex: 1
  },
  inputWithPrefixField: {
    width: '100%',
    padding: '10px 14px 10px 32px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s',
    backgroundColor: '#fff'
  },

  uploadBox: { 
    border: '2px dashed #cbd5e1', 
    borderRadius: '12px', 
    padding: '32px', 
    textAlign: 'center', 
    cursor: 'pointer', 
    position: 'relative', 
    backgroundColor: '#f8fafc' 
  },
  statBadge: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px', 
    padding: '8px 16px', 
    borderRadius: '20px', 
    fontSize: '13px', 
    fontWeight: '600' 
  },
  gridCard: { 
    backgroundColor: 'white', 
    borderRadius: '12px', 
    border: '1px solid #e2e8f0', 
    overflow: 'hidden', 
    transition: 'transform 0.2s, box-shadow 0.2s', 
    display: 'flex', 
    flexDirection: 'column' 
  },
  gridCardImg: { 
    width: '100%', 
    aspectRatio: '1/1', 
    objectFit: 'cover', 
    backgroundColor: '#f1f5f9' 
  },
  gridCardBody: { 
    padding: '16px', 
    flex: 1, 
    display: 'flex', 
    flexDirection: 'column' 
  },
  statusBadge: (status) => ({
    padding: '4px 10px', 
    borderRadius: '20px', 
    fontSize: '12px', 
    fontWeight: '600',
    backgroundColor: 
      status === 'active' ? '#d1fae5' : 
      status === 'pending' ? '#fef3c7' : 
      status === 'rejected' ? '#fee2e2' : 
      status === 'inactive' ? '#e2e8f0' : 
      status === 'banned' ? '#fecaca' : '#f1f5f9',
    color: 
      status === 'active' ? '#047857' : 
      status === 'pending' ? '#b45309' : 
      status === 'rejected' ? '#dc2626' : 
      status === 'inactive' ? '#64748b' : 
      status === 'banned' ? '#991b1b' : '#475569'
  }),

  // --- Pagination Section ---
  pagination: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    marginTop: '32px',
    padding: '16px 0',
    borderTop: '1px solid #e2e8f0'
  },
  paginationInfo: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '500'
  },
  paginationButtons: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paginationBtn: {
    padding: '8px 12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    backgroundColor: '#fff',
    color: '#475569',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
    minWidth: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paginationBtnActive: {
    backgroundColor: '#059669',
    color: '#fff',
    borderColor: '#059669',
    fontWeight: '600'
  },
  paginationBtnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    pointerEvents: 'none'
  },
};

export const getStatusLabel = (status) => {
  const labels = {
    active: 'Yayında',
    pending: 'Onay Bekliyor',
    rejected: 'Reddedildi',
    inactive: 'Pasif',
    banned: 'Yasaklı',
    draft: 'Taslak'
  };
  return labels[status] || 'Taslak';
};
