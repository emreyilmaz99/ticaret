import React from 'react';

const Skeleton = ({ 
  width = '100%', 
  height = '20px', 
  borderRadius = '4px', 
  style = {},
  className = '' 
}) => {
  const skeletonStyle = {
    width,
    height,
    borderRadius,
    backgroundColor: '#e2e8f0',
    backgroundImage: 'linear-gradient(90deg, #e2e8f0 0px, #f1f5f9 40px, #e2e8f0 80px)',
    backgroundSize: '600px',
    animation: 'skeleton-loading 1.5s infinite linear',
    ...style,
  };

  return (
    <>
      <style>
        {`
          @keyframes skeleton-loading {
            0% { background-position: -100px; }
            40%, 100% { background-position: 200px; }
          }
        `}
      </style>
      <div className={className} style={skeletonStyle} />
    </>
  );
};

export default Skeleton;
