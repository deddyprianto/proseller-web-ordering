import React, { useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import config from 'config';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

import ProductCartList from '../components/productCartList';
import { isEmptyArray } from 'helpers/CheckEmpty';

const mapStateToProps = (state) => {
  return {
    color: state.theme.color,
    basket: state.order.basket,
    companyInfo: state.masterdata.companyInfo.data,
    isLoggedIn: state.auth.isLoggedIn,
  };
};

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

const Cart = ({ ...props }) => {
  const [width] = useWindowSize();
  const gadgetScreen = width < 600;
  const styles = {
    rootEmptyCart: {
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 150,
    },
    rootCart: {
      paddingLeft: 280,
      paddingRight: 280,
      paddingTop: 150,
      display: 'flex',
    },
    rootCartGadgetSize: {
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 100,
      paddingBottom: 300,
    },
    cartGridRight: {
      width: '100%',
      paddingLeft: 10,
    },
    cartGridLeft: {
      width: '100%',
      paddingRight: 10,
    },
    rootInclusiveTax: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingLeft: 10,
      paddingRight: 10,
    },
    rootExclusiveTax: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingLeft: 10,
      paddingRight: 10,
      paddingBottom: 10,
    },
    rootSubmitButton: {
      paddingTop: 15,
      paddingRight: 10,
      paddingLeft: 10,
      paddingBottom: 10,
    },
    rootSubTotal: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: 10,
    },
    rootGrandTotal: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingRight: 10,
      paddingLeft: 10,
      paddingTop: 10,
    },
    grandTotal: {
      fontWeight: 'bold',
      color: props.color.primary,
      fontSize: 16,
    },
    subTotal: {
      fontWeight: 'bold',
      color: '#808080',
      fontSize: 16,
    },
    inclusiveTax: {
      color: '#808080',
      fontSize: 12,
    },
    typography: {
      color: 'white',
      fontSize: 14,
      fontWeight: 'bold',
    },
    icon: {
      height: 20,
      width: 20,
      color: 'white',
    },
    button: {
      borderRadius: 5,
      width: '100%',
      height: 50,
      textTransform: 'none',
      backgroundColor: props.color.primary,
    },
    grandTotalGadgetSize: {
      width: '100%',
      margin: 0,
      top: 'auto',
      right: 'auto',
      bottom: 70,
      left: 'auto',
      position: 'fixed',
      padding: 10,
    },
    emptyText: {
      marginTop: 10,
      fontSize: 14,
      lineHeight: '17px',
      fontWeight: 600,
    },
  };

  const handleCurrency = (price) => {
    if (props?.companyInfo) {
      const result = price.toLocaleString(
        props?.companyInfo?.currency?.locale,
        {
          style: 'currency',
          currency: props?.companyInfo?.currency?.code,
        }
      );
      return result;
    }
  };

  const renderSubTotal = () => {
    return (
      <Paper variant='outlined'>
        <div>
          <div style={styles.rootSubTotal}>
            <Typography style={styles.subTotal}>Subtotal</Typography>
            <Typography style={styles.subTotal}>
              {handleCurrency(props.basket?.totalAmountBeforeSurcharge)}
            </Typography>
          </div>
          {props.basket?.exclusiveTax !== 0 && (
            <div style={styles.rootExclusiveTax}>
              <Typography style={styles.subTotal}>Tax</Typography>
              <Typography style={styles.subTotal}>
                {handleCurrency(props.basket.exclusiveTax)}
              </Typography>
            </div>
          )}
        </div>
      </Paper>
    );
  };

  const handleLogin = () => {
    document.getElementById('login-register-btn').click();
  };

  const renderButtonSubmit = () => {
    if (!props.isLoggedIn) {
      return (
        <Button
          style={styles.button}
          startIcon={<CheckCircleIcon style={styles.icon} />}
          variant='outlined'
          onClick={handleLogin}
        >
          <Typography style={styles.typography}>Submit</Typography>
        </Button>
      );
    }

    return (
      <Button
        style={styles.button}
        startIcon={<MonetizationOnIcon style={styles.icon} />}
        variant='outlined'
        // onClick={handleConfirmAndPay}
      >
        <Typography style={styles.typography}>Confirm & Pay</Typography>
      </Button>
    );
  };

  const renderGrandTotal = () => {
    return (
      <Paper
        variant={gadgetScreen ? 'elevation' : 'outlined'}
        square={gadgetScreen}
        elevation={gadgetScreen ? 3 : 0}
        style={gadgetScreen ? styles.grandTotalGadgetSize : {}}
      >
        <div style={styles.rootGrandTotal}>
          <Typography style={styles.grandTotal}>GRAND TOTAL</Typography>
          <Typography style={styles.grandTotal}>
            {handleCurrency(props.basket?.totalNettAmount)}
          </Typography>
        </div>
        {props.basket?.inclusiveTax !== 0 && (
          <div style={styles.rootInclusiveTax}>
            <Typography style={styles.inclusiveTax}>
              Inclusive Tax 7%
            </Typography>
            <Typography style={styles.inclusiveTax}>
              {handleCurrency(props.basket?.inclusiveTax)}
            </Typography>
          </div>
        )}

        <div style={styles.rootSubmitButton}>{renderButtonSubmit()}</div>
      </Paper>
    );
  };

  const renderCart = () => {
    if (gadgetScreen) {
      return (
        <>
          <div style={styles.rootCartGadgetSize}>
            <ProductCartList />
            {renderSubTotal()}
          </div>
          {renderGrandTotal()}
        </>
      );
    }
    return (
      <div style={styles.rootCart}>
        <div style={styles.cartGridLeft}>
          <ProductCartList />
        </div>
        <div style={styles.cartGridRight}>
          {renderSubTotal()}
          {renderGrandTotal()}
        </div>
      </div>
    );
  };

  return (
    <Box
      component='div'
      sx={{
        flexGrow: 1,
      }}
    >
      {!isEmptyArray(props.basket.details) ? (
        <div>{renderCart()}</div>
      ) : (
        <div style={styles.rootEmptyCart}>
          <img src={config.url_emptyImage} alt='is empty' />
          <Typography style={styles.emptyText}>Data is empty</Typography>
        </div>
      )}
    </Box>
  );
};

Cart.defaultProps = {
  basket: {},
  color: {},
  companyInfo: {},
  isLoggedIn: false,
};

Cart.propTypes = {
  basket: PropTypes.object,
  color: PropTypes.object,
  companyInfo: PropTypes.object,
  isLoggedIn: PropTypes.bool,
};

export default connect(mapStateToProps)(Cart);
