// src/pages/public/VendorStore/components/LoadingState.jsx
import React from 'react';

const LoadingState = () => {
  return (
    <div style={styles.container}>
      {/* Header Skeleton */}
      <div style={styles.headerSkeleton}>
        <div style={styles.coverSkeleton} />
        <div style={styles.headerContent}>
          <div style={styles.logoSkeleton} />
          <div style={styles.infoSkeleton}>
            <div style={styles.nameSkeleton} />
            <div style={styles.statsSkeleton} />
          </div>
        </div>
      </div>

      {/* Nav Skeleton */}
      <div style={styles.navSkeleton}>
        <div style={styles.tabsSkeleton}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={styles.tabSkeleton} />
          ))}
        </div>
      </div>

      {/* Content Skeleton */}
      <div style={styles.contentWrapper}>
        <div style={styles.sidebarSkeleton}>
          {[1, 2, 3].map(i => (
            <div key={i} style={styles.filterSkeleton} />
          ))}
        </div>
        <div style={styles.gridSkeleton}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} style={styles.cardSkeleton}>
              <div style={styles.imageSkeleton} />
              <div style={styles.cardContent}>
                <div style={styles.lineSkeleton} />
                <div style={styles.lineShortSkeleton} />
                <div style={styles.priceSkeleton} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const shimmer = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

const skeletonBase = {
  backgroundColor: '#e2e8f0',
  backgroundImage: 'linear-gradient(90deg, #e2e8f0 0%, #f1f5f9 50%, #e2e8f0 100%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
  borderRadius: '8px',
};

const styles = {
  container: {
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
  },
  headerSkeleton: {
    position: 'relative',
  },
  coverSkeleton: {
    ...skeletonBase,
    height: '200px',
    borderRadius: 0,
  },
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'flex-end',
    gap: '20px',
    marginTop: '-60px',
  },
  logoSkeleton: {
    ...skeletonBase,
    width: '120px',
    height: '120px',
    borderRadius: '16px',
    border: '4px solid #fff',
  },
  infoSkeleton: {
    paddingBottom: '16px',
    flex: 1,
  },
  nameSkeleton: {
    ...skeletonBase,
    width: '200px',
    height: '32px',
    marginBottom: '12px',
  },
  statsSkeleton: {
    ...skeletonBase,
    width: '400px',
    height: '48px',
  },
  navSkeleton: {
    backgroundColor: '#fff',
    borderBottom: '1px solid #e2e8f0',
    marginTop: '70px',
  },
  tabsSkeleton: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '16px 24px',
    display: 'flex',
    gap: '16px',
  },
  tabSkeleton: {
    ...skeletonBase,
    width: '100px',
    height: '40px',
  },
  contentWrapper: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '24px',
    display: 'flex',
    gap: '24px',
  },
  sidebarSkeleton: {
    width: '260px',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  filterSkeleton: {
    ...skeletonBase,
    height: '150px',
  },
  gridSkeleton: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '20px',
  },
  cardSkeleton: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  imageSkeleton: {
    ...skeletonBase,
    aspectRatio: '1/1',
    borderRadius: 0,
  },
  cardContent: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  lineSkeleton: {
    ...skeletonBase,
    width: '100%',
    height: '16px',
  },
  lineShortSkeleton: {
    ...skeletonBase,
    width: '60%',
    height: '16px',
  },
  priceSkeleton: {
    ...skeletonBase,
    width: '80px',
    height: '24px',
    marginTop: '8px',
  },
};

// Inject keyframes
const styleSheet = document.createElement('style');
styleSheet.textContent = shimmer;
document.head.appendChild(styleSheet);

export default LoadingState;
