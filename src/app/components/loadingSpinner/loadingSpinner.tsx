import React from 'react';

const LoadingSpinner = ({ size = 'w-6 h-6' }) => {
  return (
    <div className={`border-4 border-t-4 border-blue-600 border-solid rounded-full animate-spin ${size}`} style={{ borderTopColor: '#ffffff' }}></div>
  );
};

export default LoadingSpinner;

