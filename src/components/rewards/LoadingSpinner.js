import React from 'react';
import { useSelector } from 'react-redux';

import './styles/loadingSpinner.css';

const LoadingSpinner = ({ loading = false }) => {
  const color = useSelector((state) => state.theme.color);

  const spinnerBorder = {
    borderTop: `3px solid ${color.primary}`,
    borderRight: `3px solid ${color.primary}`,
  };

  if (!loading) return null;

  return (
    <div className='spinner-container'>
      <div className='loading-spinner' style={spinnerBorder}></div>
    </div>
  );
};

export default LoadingSpinner;
