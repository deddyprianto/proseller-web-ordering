import React from 'react';
import PropTypes from 'prop-types';
import ContentLoader, {
  List as ListLoading,
  Facebook,
} from 'react-content-loader';
import Box from '@mui/material/Box';

const Loading = ({ loadingType }) => {
  const NestedList = (props) => (
    <ContentLoader {...props}>
      <rect x='0' y='0' rx='3' ry='3' width='350' height='10' />
      <rect x='20' y='20' rx='3' ry='3' width='320' height='10' />
      <rect x='20' y='40' rx='3' ry='3' width='270' height='10' />
      <rect x='0' y='60' rx='3' ry='3' width='350' height='10' />
      <rect x='20' y='80' rx='3' ry='3' width='300' height='10' />
      <rect x='20' y='100' rx='3' ry='3' width='180' height='10' />
    </ContentLoader>
  );

  const ButtonList = (props) => (
    <ContentLoader {...props}>
      <rect x='0' y='19' rx='5' ry='5' width='399' height='35' />
      <rect x='0' y='60' rx='5' ry='5' width='399' height='35' />
      <rect x='0' y='100' rx='5' ry='5' width='399' height='35' />
    </ContentLoader>
  );

  const Code = (props) => (
    <ContentLoader {...props}>
      <rect x='0' y='0' width='67' height='11' rx='3' />
      <rect x='76' y='0' width='140' height='11' rx='3' />
      <rect x='127' y='48' width='53' height='11' rx='3' />
      <rect x='187' y='48' width='72' height='11' rx='3' />
      <rect x='18' y='48' width='100' height='11' rx='3' />
      <rect x='0' y='71' width='37' height='11' rx='3' />
      <rect x='18' y='23' width='140' height='11' rx='3' />
      <rect x='166' y='23' width='173' height='11' rx='3' />
    </ContentLoader>
  );

  const Element = (props) => {
    return (
      <ContentLoader
        backgroundColor='#f3f3f3'
        foregroundColor='#ecebeb'
        {...props}
      >
        <rect x='48' y='8' rx='3' ry='3' width='88' height='6' />
        <rect x='48' y='26' rx='3' ry='3' width='52' height='6' />
        <rect x='0' y='56' rx='3' ry='3' width='410' height='6' />
        <rect x='0' y='72' rx='3' ry='3' width='380' height='6' />
        <rect x='0' y='88' rx='3' ry='3' width='178' height='6' />
        <circle cx='20' cy='20' r='20' />
      </ContentLoader>
    );
  };

  switch (loadingType) {
    case 'NestedList':
      return (
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          <NestedList viewBox='10 -10 350 250' />
        </Box>
      );
    case 'facebook':
      return (
        <Box sx={{ width: '100%' }}>
          <Facebook />
        </Box>
      );
    case 'code':
      return (
        <Box sx={{ width: '100%' }}>
          <Code viewBox='0 0 340 84' />
        </Box>
      );
    case 'element':
      return (
        <Box sx={{ width: '100%' }}>
          <Element viewBox='0 0 400 160' />
        </Box>
      );
    case 'ButtonList':
      return (
        <Box sx={{ width: '100%' }}>
          <ButtonList viewBox='0 0 400 160' />
        </Box>
      );
    default:
      return (
        <Box sx={{ width: '100%' }}>
          <ListLoading viewBox='0 0 400 160' />
        </Box>
      );
  }
};

Loading.defaultProps = {
  loadingType: '',
};

Loading.propTypes = {
  loadingType: PropTypes.string,
};

export default Loading;
