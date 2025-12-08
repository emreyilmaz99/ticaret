export const sidebarStyles = {
  container: (isMobile, isOpen) => ({
    width: '280px',
    height: '100vh',
    backgroundColor: '#14532d',
    backgroundImage: 'linear-gradient(to bottom, #14532d, #064e3b)',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px',
    position: 'fixed',
    left: 0,
    top: 0,
    boxShadow: '4px 0 24px rgba(0,0,0,0.05)',
    zIndex: 1200,
    transition: 'transform 0.3s ease-in-out',
    transform: isMobile ? (isOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none',
  }),
  logoContainer: {
    marginBottom: '40px',
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
    width: '36px',
    height: '36px',
    backgroundColor: 'white',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#14532d'
  },
  logoText: {
    fontSize: '18px',
    fontWeight: '700',
    letterSpacing: '-0.5px',
    color: 'white',
    margin: 0
  },
  logoSubText: {
    fontSize: '11px',
    color: '#86efac',
    marginTop: '2px',
    margin: 0
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
    letterSpacing: '1px'
  },
  link: (isActive) => ({
    color: isActive ? 'white' : '#dcfce7',
    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '12px',
    transition: 'all 0.2s ease',
    fontWeight: isActive ? '600' : '400',
    fontSize: '14px',
    marginBottom: '4px'
  }),
  logoutContainer: {
    borderTop: '1px solid rgba(255,255,255,0.1)',
    paddingTop: '20px'
  },
  logoutButton: {
    width: '100%',
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    color: '#fca5a5',
    border: 'none',
    padding: '12px',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s'
  }
};
