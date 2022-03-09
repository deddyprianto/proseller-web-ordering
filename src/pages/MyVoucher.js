import React, { useState, useLayoutEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import MyVoucherList from 'components/myVoucherList/MyVoucherList';

const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
};

const MyVoucher = () => {
  const history = useHistory();
  const [width] = useWindowSize();
  const gadgetScreen = width < 900;
  const styles = {
    root: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'start',
      alignItems: 'center',
      color: 'black',
      marginTop: gadgetScreen ? 100 : 200,
      marginLeft: gadgetScreen ? 20 : 320,
      marginBottom: 10,
      textTransform: 'none',
      padding: 0,
    },
    icon: {
      width: 20,
      height: 20,
    },
    typography: {
      fontSize: 16,
      color: 'black',
    },
  };
  return (
    <Box component='div'>
      <Button style={styles.root} onClick={() => history.goBack()}>
        <ArrowBackIcon style={styles.icon} />
        <Typography style={styles.typography}>Use Voucher</Typography>
      </Button>
      <MyVoucherList />
    </Box>
  );
};

export default MyVoucher;
