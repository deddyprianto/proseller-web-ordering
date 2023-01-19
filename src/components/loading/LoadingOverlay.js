import React from 'react';
import PropTypes from 'prop-types';
import LoadingOverlay from 'react-loading-overlay';

const LoadingOverlayCustom = ({ loadingText, children, ...props }) => {
  return (
    <LoadingOverlay
      text={loadingText}
      styles={{
        overlay: (base) => ({
          ...base,
          position: 'fixed',
          zIndex: 99999,
        }),
      }}
      {...props}
    >
      {children}
    </LoadingOverlay>
  );
};

LoadingOverlayCustom.defaultProps = {
  loadingText: 'Loading...',
};

LoadingOverlayCustom.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  loadingText: PropTypes.string,
};

export default LoadingOverlayCustom;
