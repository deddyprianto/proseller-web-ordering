import React from 'react';
import ContentLoader from 'react-content-loader';

const LoaderSkleton = (props) => (
  <div style={{ width: '100%' }}>
    <ContentLoader
      speed={1}
      width='90%'
      style={{ marginLeft: '18px' }}
      height={100}
      viewBox='0 0 476 124'
      backgroundColor='#f3f3f3'
      foregroundColor='#ecebeb'
      {...props}
    >
      <rect x='100' y='8' rx='3' ry='3' width='100' height='10' />
      <rect x='100' y='30' rx='3' ry='3' width='50' height='10' />
      <rect x='100' y='50' rx='3' ry='3' width='410' height='10' />
      <rect x='100' y='70' rx='3' ry='3' width='380' height='10' />
      <rect x='100' y='90' rx='3' ry='3' width='178' height='10' />
      <circle cx='40' cy='40' r='40' />
    </ContentLoader>
  </div>
);

export default LoaderSkleton;
