import React, { useState, useLayoutEffect, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import config from 'config';
import { Link, useHistory } from 'react-router-dom';
import _ from 'lodash';
import moment from 'moment';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import SendIcon from '@mui/icons-material/Send';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import ProductCartList from '../components/productCartList';
import { isEmptyArray } from 'helpers/CheckEmpty';
import OrderingModeDialog from 'components/orderingModeDialog';
import TimeSlotDialog from 'components/timeSlot/TimeSlot';

const encryptor = require('simple-encryptor')(process.env.REACT_APP_KEY_DATA);

const mapStateToProps = (state) => {
  return {
    color: state.theme.color,
    basket: state.order.basket,
    companyInfo: state.masterdata.companyInfo.data,
    isLoggedIn: state.auth.isLoggedIn,

    defaultOutlet: state.outlet.defaultOutlet,
    deliveryAddress: state.order.deliveryAddress,
    orderingMode: state?.order?.orderingMode,
    orderActionDate: state.order.orderActionDate,
    orderActionTime: state.order.orderActionTime,
    orderActionTimeSlot: state.order.orderActionTimeSlot,
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
  const history = useHistory();
  const gadgetScreen = width < 600;
  const styles = {
    rootPaper: {
      marginBottom: 10,
      backgroundColor: props.color.background,
    },
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
    totalDiscount: {
      fontWeight: 'bold',
      color: 'red',
      fontSize: 16,
    },
    inclusiveTax: {
      color: '#808080',
      fontSize: 12,
    },
    typography: {
      color: 'white',
      fontSize: 13,
      fontWeight: 'bold',
      marginY: 1,
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
    grandTotalGadgetScreen: {
      width: '100%',
      margin: 0,
      top: 'auto',
      right: 'auto',
      bottom: 70,
      left: 'auto',
      position: 'fixed',
      padding: 10,
      backgroundColor: props.color.background,
    },
    grandTotalFullScreen: {
      backgroundColor: props.color.background,
    },
    emptyText: {
      marginTop: 10,
      fontSize: 14,
      lineHeight: '17px',
      fontWeight: 600,
    },
    rootMode: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: 10,
      alignItems: 'center',
      alignContent: 'center',
    },
    mode: {
      borderRadius: 5,
      width: '50%',
      height: 35,
      textTransform: 'none',
      backgroundColor: props.color.primary,
    },
  };

  const [openOrderingMode, setOpenOrderingMode] = useState(false);
  const [openTimeSlot, setOpenTimeSlot] = useState(false);
  const [timeSlotLabel, setTimeSlotLabel] = useState({});

  useEffect(() => {
    const orderTimeSlotTime = localStorage.getItem(
      `${config.prefix}_order_action_time`
    );
    const orderTimeSlotDate = localStorage.getItem(
      `${config.prefix}_order_action_date`
    );

    if (!_.isEmpty(orderTimeSlotTime) && !_.isEmpty(orderTimeSlotDate)) {
      setTimeSlotLabel({
        date: moment(orderTimeSlotDate).format('DD MMM YYYY'),
        time: orderTimeSlotTime,
      });
    }
  }, [timeSlotLabel]);

  if (_.isEmpty(props.defaultOutlet)) {
    history.push('/outlets');
  }

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

  const handleCloseOrderingMode = () => {
    setOpenOrderingMode(false);
  };

  const handleCloseTimeSlot = () => {
    setOpenTimeSlot(false);
  };

  const handleOpenOrderingMode = () => {
    setOpenOrderingMode(true);
  };

  const renderPickupDateTime = () => {
    return (
      <Paper variant='outlined' style={styles.rootPaper}>
        <div style={styles.rootMode}>
          <Typography style={styles.subTotal}>Pickup Date & Time</Typography>
          <Button
            style={styles.mode}
            startIcon={<AccessTimeIcon style={styles.icon} />}
            variant='outlined'
            onClick={() => setOpenTimeSlot(true)}
          >
            {timeSlotLabel ? (
              <Box flexDirection='column'>
                <Typography style={styles.typography}>
                  {timeSlotLabel?.date}
                </Typography>
                <Typography style={styles.typography}>
                  {timeSlotLabel?.time}
                </Typography>
              </Box>
            ) : (
              'Select Date & Time'
            )}
          </Button>
        </div>
      </Paper>
    );
  };

  const renderOrderingMode = () => {
    return (
      <Paper variant='outlined' style={styles.rootPaper}>
        <div style={styles.rootMode}>
          <Typography style={styles.subTotal}>Ordering Mode</Typography>
          <Button
            style={styles.mode}
            startIcon={<SendIcon style={styles.icon} />}
            variant='outlined'
            onClick={() => handleOpenOrderingMode()}
          >
            <Typography style={styles.typography}>
              {props.orderingMode || 'Ordering Mode'}
            </Typography>
          </Button>
        </div>
      </Paper>
    );
  };

  const renderDeliveryAddress = () => {
    if (props.orderingMode !== 'DELIVERY') {
      return;
    }
    return (
      <Paper variant='outlined' style={styles.rootPaper}>
        <div style={styles.rootMode}>
          <Typography style={styles.subTotal}>Delivery Address</Typography>
          <Button
            style={styles.mode}
            startIcon={<ContactMailIcon style={styles.icon} />}
            variant='outlined'
            component={Link}
            to='/delivery-address'
          >
            <Typography style={styles.typography}>Delivery Address</Typography>
          </Button>
        </div>
      </Paper>
    );
  };

  const renderSubTotal = () => {
    return (
      <Paper variant='outlined' style={styles.rootPaper}>
        <div>
          {props.basket?.totalDiscountAmount !== 0 && (
            <div style={styles.rootSubTotal}>
              <Typography style={styles.subTotal}>Subtotal b/f disc</Typography>
              <Typography style={styles.subTotal}>
                {handleCurrency(props.basket?.totalGrossAmount)}
              </Typography>
            </div>
          )}
          {props.basket?.exclusiveTax !== 0 && (
            <div style={styles.rootExclusiveTax}>
              <Typography style={styles.subTotal}>Tax</Typography>
              <Typography style={styles.subTotal}>
                {handleCurrency(props.basket.exclusiveTax)}
              </Typography>
            </div>
          )}
          {props.basket?.totalDiscountAmount !== 0 && (
            <div style={styles.rootExclusiveTax}>
              <Typography style={styles.totalDiscount}>Discount</Typography>
              <Typography style={styles.totalDiscount}>
                - {handleCurrency(props.basket.totalDiscountAmount)}
              </Typography>
            </div>
          )}
          {props.basket?.totalNettAmount !== 0 && (
            <div style={styles.rootSubTotal}>
              <Typography style={styles.subTotal}>Subtotal</Typography>
              <Typography style={styles.subTotal}>
                {handleCurrency(props.basket.totalNettAmount)}
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

  const handleConfirmAndPay = () => {
    localStorage.setItem(
      `${config.prefix}_dataSettle`,
      JSON.stringify(
        encryptor.encrypt({
          dataBasket: props.basket,
          deliveryAddress: props.deliveryAddress,
          storeDetail: props.defaultOutlet,
          pointsToRebateRatio: '0:0',
          orderingMode: props.orderingMode,
          orderActionDate: props.orderActionDate,
          orderActionTime: props.orderActionTime,
          orderActionTimeSlot: props.orderActionTimeSlot,
        })
      )
    );
    props.history.push('/payment');
  };

  const renderGrandTotal = () => {
    return (
      <Paper
        variant={gadgetScreen ? 'elevation' : 'outlined'}
        square={gadgetScreen}
        elevation={gadgetScreen ? 3 : 0}
        style={
          gadgetScreen
            ? styles.grandTotalGadgetScreen
            : styles.grandTotalFullScreen
        }
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

        <div style={styles.rootSubmitButton}>
          <Button
            style={styles.button}
            startIcon={<MonetizationOnIcon style={styles.icon} />}
            variant='outlined'
            //TODO; handle disabled button
            onClick={() => {
              if (props.isLoggedIn) {
                handleConfirmAndPay();
              } else {
                handleLogin();
              }
            }}
          >
            <Typography style={styles.typography}>Confirm & Pay</Typography>
          </Button>
        </div>
      </Paper>
    );
  };

  const renderCart = () => {
    if (gadgetScreen) {
      return (
        <>
          <div style={styles.rootCartGadgetSize}>
            <ProductCartList />
            {renderOrderingMode()}
            {renderDeliveryAddress()}
            {renderPickupDateTime()}
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
          {renderOrderingMode()}
          {renderDeliveryAddress()}
          {renderPickupDateTime()}
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
      <OrderingModeDialog
        open={openOrderingMode}
        onClose={() => handleCloseOrderingMode()}
        defaultOutlet={props.defaultOutlet}
      />
      <TimeSlotDialog
        open={openTimeSlot}
        onClose={() => handleCloseTimeSlot()}
        defaultOutlet={props.defaultOutlet}
      />
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
  deliveryAddress: {},
  defaultOutlet: {},
  orderingMode: {},
  orderActionDate: {},
  orderActionTime: {},
  orderActionTimeSlot: {},
  history: null,
};

Cart.propTypes = {
  basket: PropTypes.object,
  color: PropTypes.object,
  companyInfo: PropTypes.object,
  defaultOutlet: PropTypes.object,
  deliveryAddress: PropTypes.object,
  history: PropTypes.func,
  isLoggedIn: PropTypes.bool,
  orderActionDate: PropTypes.object,
  orderActionTime: PropTypes.object,
  orderActionTimeSlot: PropTypes.object,
  orderingMode: PropTypes.object,
};

export default connect(mapStateToProps)(Cart);
