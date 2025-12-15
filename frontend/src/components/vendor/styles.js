export const sidebarStyles = {
  container: (isMobile, isOpen) => ({
    width: '260px',
    height: '100vh',
    background: 'linear-gradient(rgb(5, 46, 22) 0%, rgb(6, 78, 59) 100%)',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px',
    position: 'fixed',
    left: 0,
    top: 0,
    boxShadow: '4px 0 24px rgba(0, 0, 0, 0.15)',
    zIndex: 1000,
    transition: 'transform 0.3s ease-in-out',
    transform: isMobile ? (isOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none',
  }),
  logoContainer: {
    marginBottom: '32px',
    paddingLeft: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  logoBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
  },
  logoText: {
    fontSize: '20px',
    fontWeight: '700',
    letterSpacing: '-0.5px',
    color: 'white',
    margin: 0,
    fontFamily: "'Plus Jakarta Sans', sans-serif"
  },
  logoSubText: {
    fontSize: '11px',
    color: '#6ee7b7',
    marginTop: '2px',
    margin: 0,
    fontWeight: '500',
    fontFamily: "'Plus Jakarta Sans', sans-serif"
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  menuContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
    overflowY: 'auto'
  },
  sectionTitle: {
    fontSize: '11px',
    textTransform: 'uppercase',
    color: '#86efac',
    fontWeight: '700',
    marginBottom: '12px',
    paddingLeft: '10px',
    letterSpacing: '1px',
    fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif"
  },
  link: (isActive) => ({
    color: isActive ? 'white' : '#94a3b8',
    backgroundColor: isActive ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 16px',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    fontWeight: isActive ? '600' : '500',
    fontSize: '13px',
    marginBottom: '2px',
    borderLeft: isActive ? '3px solid #10b981' : '3px solid transparent',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }),
  logoutContainer: {
    borderTop: '1px solid rgba(255,255,255,0.1)',
    paddingTop: '20px'
  },
  logoutButton: {
    width: '100%',
    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
    color: '#fca5a5',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    padding: '14px',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.25s ease',
    fontFamily: "'Plus Jakarta Sans', sans-serif"
  }
};
