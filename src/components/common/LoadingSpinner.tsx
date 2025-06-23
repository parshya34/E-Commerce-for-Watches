import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-primary-600 animate-spin"></div>
        <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-r-4 border-accent-500 animate-spin animation-delay-150"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;