// src/components/modals/CompareModal/styles.js
export const getCompareModalStyles = (compareCount) => ({
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: '20px',
  },
  
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    width: '100%',
    maxWidth: '1100px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  
  header: {
    padding: '28px 32px',
    borderBottom: '1px solid #E5E7EB',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
    fontFamily: '"Inter", sans-serif',
    letterSpacing: '-0.5px',
  },
  
  scrollContent: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: compareCount === 1 ? '32px 120px' : '32px',
  },
  
  grid: {
    display: 'grid',
    gridTemplateColumns: compareCount === 1 ? '1fr' : `repeat(${compareCount}, 1fr)`,
    gap: '20px',
    maxWidth: compareCount === 1 ? '500px' : '100%',
    margin: compareCount === 1 ? '0 auto' : '0',
  },
});
