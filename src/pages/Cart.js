import React, { useState, useLayoutEffect, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import config from 'config';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ProductCartList from 'components/productCartList';
import OrderingModeDialog from 'components/orderingModeDialog';
import TimeSlotDialog from 'components/timeSlot/TimeSlotLogin';
import LoadingOverlayCustom from 'components/loading/LoadingOverlay';
import SelectProviderDialog from './DeliveryAddress/components/SelectProviderDialog';

import { isEmptyArray, isEmptyObject } from 'helpers/CheckEmpty';

import { PaymentAction } from 'redux/actions/PaymentAction';
import { OrderAction } from 'redux/actions/OrderAction';

import { CONSTANT } from '../helpers/';
import moment from 'moment';
import Drawer from '@mui/material/Drawer';
import fontStyleCustom from 'pages/GuestCheckout/style/styles.module.css';
import IconDown from 'assets/images/VectorDown.png';
import iconRight from 'assets/images/iconRight.png';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const encryptor = require('simple-encryptor')(process.env.REACT_APP_KEY_DATA);

const mapStateToProps = (state) => {
  return {
    color: state.theme.color,
    basket: state.order.basket,
    companyInfo: state.masterdata.companyInfo.data,
    isLoggedIn: state.auth.isLoggedIn,
    defaultOutlet: state.outlet.defaultOutlet,
    deliveryAddress: state.order.deliveryAddress,
    orderingMode: state.order.orderingMode,
    orderingModeDisplayName: state.order.orderingModeDisplayName,
    orderActionDate: state.order.orderActionDate,
    orderActionTime: state.order.orderActionTime,
    orderActionTimeSlot: state.order.orderActionTimeSlot,
    selectedDeliveryProvider: state.order.selectedDeliveryProvider,
    basketUpdate: state.order.basketUpdate,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

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
  const history = useHistory();
  const [width] = useWindowSize();
  const gadgetScreen = width < 980;
  const styles = {
    rootPaper: {
      marginBottom: 10,
      paddingBottom: 10,
      backgroundColor: props.color.background,
    },
    rootEmptyCart: {
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 150,
    },
    rootCart: {
      paddingLeft: 200,
      paddingRight: 200,
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
    rootSubTotalItem: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 10,
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
      padding: '0px 10px',
    },
    grandTotal: {
      fontWeight: 'bold',
      color: props.color.primary,
      fontSize: 16,
    },
    subTotal: {
      fontWeight: 500,
      fontSize: 16,
    },
    totalDiscount: {
      fontWeight: 500,
      color: 'red',
      fontSize: 16,
    },
    inclusiveTax: {
      color: '#808080',
      fontSize: 12,
    },
    typography: {
      color: 'white',
      fontSize: 12,
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
      backgroundColor: props.color.background,
    },
    grandTotalFullScreen: {
      padding: 0,
      margin: 0,
      backgroundColor: 'red',
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
      padding: 0,
      backgroundColor: props.color.primary,
    },
    warningText: {
      fontSize: '1.2rem',
      fontStyle: 'italic',
      fontWeight: 500,
      color: props.color.textWarningColor,
      maxWidth: 'fit-content',
      marginX: 1,
    },
  };
  const [dataDeliveryProvider, setDataDeliveryProvider] = useState('');
  const [openDrawerBottom, setOpenDrawerBottom] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [openOrderingMode, setOpenOrderingMode] = useState(false);
  const [openTimeSlot, setOpenTimeSlot] = useState(false);
  const [openSelectDeliveryProvider, setOpenSelectDeliveryProvider] =
    useState(false);

  const [previousTotalItem, setPreviousTotalItem] = useState(0);

  const [selectTimeSlotAvailable, setSelectTimeSlotAvailable] = useState(false);

  const [dataCalculateFee, setDataCalculateFee] = useState();

  useEffect(() => {
    if (props.orderingMode !== 'DELIVERY') {
      props.dispatch({ type: 'SET_DELIVERY_ADDRESS', data: null });
    }
  }, [props.orderingMode]);

  useEffect(() => {
    props.dispatch({
      type: 'SAVE_DETAIL_TOP_UP_SVC',
      payload: {},
    });
  }, []);

  useEffect(() => {
    const getDataProviderListAndFee = async () => {
      if (props.deliveryAddress) {
        setIsLoading(true);
        let payload = {
          outletId: props.basket?.outlet?.id,
          cartID: props.basket?.cartID,
          deliveryAddress: props.deliveryAddress,
        };

        let responseCalculateFee = await props.dispatch(
          OrderAction.getCalculateFee(payload)
        );

        if (!_.isEmpty(responseCalculateFee)) {
          setDataCalculateFee(responseCalculateFee);
        }

        setIsLoading(false);
      }
    };

    getDataProviderListAndFee();
  }, [props.deliveryAddress]);

  useEffect(() => {
    props.dispatch({
      type: 'SAVE_DETAIL_TOP_UP_SVC',
      payload: {},
    });
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await props.dispatch(OrderAction.getCart());
      await props.dispatch(OrderAction.checkOfflineCart());
      setIsLoading(false);
    };
    loadData();
  }, [props.basketUpdate, props.basket?.details?.length]);

  useEffect(() => {
    const getDataTimeSlot = async () => {
      let dateTime = new Date();
      let maxDays = 90;

      if (!isEmptyArray(props.defaultOutlet)) {
        maxDays = props.defaultOutlet?.timeSlots[0]?.interval;
      }

      let payload = {
        outletID: props.defaultOutlet.sortKey,
        clientTimezone: Math.abs(dateTime.getTimezoneOffset()),
        date: moment(dateTime).format('YYYY-MM-DD'),
        maxDays: maxDays,
        orderingMode: props.orderingMode,
      };

      const response = await props.dispatch(OrderAction.getTimeSlot(payload));

      if (!response) {
        setSelectTimeSlotAvailable(false);
      } else {
        setSelectTimeSlotAvailable(true);
      }
    };
    if (
      props.orderingMode === CONSTANT.ORDERING_MODE_DELIVERY ||
      props.orderingMode === CONSTANT.ORDERING_MODE_STORE_PICKUP ||
      props.orderingMode === CONSTANT.ORDERING_MODE_TAKE_AWAY
    ) {
      getDataTimeSlot();
    }
  }, [props.orderingMode]);

  useEffect(() => {
    const checkLoginAndOrderingMode = async () => {
      if (
        !props.orderingMode &&
        !isEmptyArray(props.basket.details) &&
        props.isLoggedIn
      ) {
        setOpenOrderingMode(true);
      }
    };

    checkLoginAndOrderingMode();
  }, []);

  useEffect(() => {
    const handleRemoveOrderingMode = async () => {
      const orderingModeLocal = localStorage.getItem(
        `${config.prefix}_ordering_mode`
      );
      if (isEmptyArray(props.basket.details) && orderingModeLocal) {
        await props.dispatch(OrderAction.setData({}, 'REMOVE_ORDERING_MODE'));
        await props.dispatch(
          OrderAction.setData({}, 'DELETE_ORDER_ACTION_TIME_SLOT')
        );
        await props.dispatch(
          OrderAction.setData({}, 'SET_SELECTED_DELIVERY_PROVIDERS')
        );
        await props.dispatch(
          OrderAction.setData({}, 'SET_SELECTED_DELIVERY_PROVIDERS')
        );
        await props.dispatch(
          OrderAction.setData(null, 'SET_ORDERING_MODE_DISPlAY_NAME')
        );
        localStorage.removeItem(`${config.prefix}_delivery_providers`);
        localStorage.removeItem(`${config.prefix}_delivery_address`);
        localStorage.removeItem(`${config.prefix}_ordering_mode`);
        localStorage.removeItem(`${config.prefix}_ordering_mode_display_name`);
      }
    };

    handleRemoveOrderingMode();
  }, [props.basket.details]);

  useEffect(() => {
    props.dispatch(PaymentAction.clearAll());
  }, [props]);

  /**
   * Side effect when basket updated
   * @description When all product in cart were removed, redirect to '/' page.
   */
  useEffect(() => {
    if (props?.basket?.details) {
      setPreviousTotalItem(props.basket.details.length);
    } else {
      if (previousTotalItem > 0) {
        history.push('/');
      }
    }
  }, [previousTotalItem, props?.basket, history]);

  const handleCurrency = (price) => {
    if (props?.companyInfo) {
      const result = price?.toLocaleString(
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

  const handleLogin = () => {
    document.getElementById('login-register-btn').click();
  };

  const handleRenderOrderingModeLabel = () => {
    if (props.orderingModeDisplayName) {
      return props.orderingModeDisplayName;
    } else if (props.orderingMode) {
      return props.orderingMode;
    } else {
      return 'Ordering Mode';
    }
  };

  const handleDisabled = () => {
    const someItemIsUnavailable = !props.basket?.details.every((item) => {
      const itemIsUnavailable =
        item.orderingStatus && item.orderingStatus === 'UNAVAILABLE';
      const itemHasStock =
        item.product?.currentStock && item.quantity > item.product.currentStock;
      return itemIsUnavailable || !itemHasStock;
    });

    if (someItemIsUnavailable) {
      return someItemIsUnavailable;
    }

    if (props.orderingMode === CONSTANT.ORDERING_MODE_DELIVERY) {
      let isAllCompleted = false;
      if (selectTimeSlotAvailable) {
        isAllCompleted =
          props.orderingMode &&
          props.orderActionDate &&
          props.orderActionTime &&
          props.orderActionTimeSlot &&
          props.deliveryAddress &&
          !isEmptyObject(props.selectedDeliveryProvider) &&
          !props.selectedDeliveryProvider?.deliveryProviderError?.status;
      } else {
        isAllCompleted =
          props.orderingMode &&
          props.deliveryAddress &&
          !isEmptyObject(props.selectedDeliveryProvider) &&
          !props.selectedDeliveryProvider?.deliveryProviderError?.status;
      }

      return !isAllCompleted;
    } else if (props.orderingMode === CONSTANT.ORDERING_MODE_STORE_PICKUP) {
      let isAllCompleted = false;
      if (selectTimeSlotAvailable) {
        isAllCompleted =
          props.orderingMode &&
          props.orderActionDate &&
          props.orderActionTime &&
          props.orderActionTimeSlot;
      } else {
        isAllCompleted = !!props.orderingMode;
      }

      return !isAllCompleted;
    } else if (props.orderingMode === CONSTANT.ORDERING_MODE_TAKE_AWAY) {
      let isAllCompleted = false;
      if (selectTimeSlotAvailable) {
        isAllCompleted =
          props.orderingMode &&
          props.orderActionDate &&
          props.orderActionTime &&
          props.orderActionTimeSlot;
      } else {
        isAllCompleted = !!props.orderingMode;
      }

      return !isAllCompleted;
    }

    return !props.orderingMode;
  };

  const handleConfirmAndPay = () => {
    if (
      props.basket &&
      props.deliveryAddress &&
      props.defaultOutlet &&
      props.orderingMode &&
      props.orderActionDate &&
      props.orderActionTime &&
      props.orderActionTimeSlot
    ) {
      localStorage.setItem(
        `${config.prefix}_dataSettle`,
        JSON.stringify(
          encryptor.encrypt({
            dataBasket: props.basket,
            deliveryAddress: props.deliveryAddress,
            deliveryProvider: props.selectedDeliveryProvider,
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
    }

    props.history.push('/payment');
  };

  const renderWarning = (value) => {
    return (
      <Typography sx={styles.warningText}>* Please Select {value}</Typography>
    );
  };

  const renderDateTimeValue = () => {
    if (!isEmptyObject(props.orderActionTimeSlot)) {
      return (
        <Box flexDirection='column'>
          <Typography style={styles.typography}>
            {props.orderActionDate}
          </Typography>
          <Typography style={styles.typography}>
            {props.orderActionTimeSlot}
          </Typography>
        </Box>
      );
    } else {
      return (
        <Typography style={styles.typography}>Select Date & Time</Typography>
      );
    }
  };

  const renderDateTime = () => {
    const isStorePickUp =
      props.orderingMode === CONSTANT.ORDERING_MODE_STORE_PICKUP && true;
    const isTakeAway =
      props.orderingMode === CONSTANT.ORDERING_MODE_TAKE_AWAY && true;
    const isDelivery =
      props.orderingMode === CONSTANT.ORDERING_MODE_DELIVERY &&
      props.deliveryAddress &&
      props.selectedDeliveryProvider &&
      selectTimeSlotAvailable;

    const orderingModeWarning = !isEmptyObject(props?.orderActionTimeSlot)
      ? null
      : isStorePickUp
      ? renderWarning('Pickup Date & Time.')
      : renderWarning('Delivery Date & Time.');

    if (selectTimeSlotAvailable) {
      if (isDelivery || isStorePickUp || isTakeAway) {
        return (
          <div
            onClick={() => {
              setOpenTimeSlot(true);
            }}
            style={{
              width: '100%',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
              marginTop: '10px',
              marginBottom: '10px',
              padding: '15px 5px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box flexDirection='column'>
                <Typography
                  className={fontStyleCustom.myFont}
                  style={{
                    fontWeight: 700,
                    fontSize: '14px',
                  }}
                >
                  Choose Date & Time
                </Typography>
              </Box>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginRight: '10px',
                }}
              >
                <div>
                  <Typography
                    style={{
                      fontSize: '13px',
                      color: '#8A8D8E',
                      fontWeight: 500,
                      textAlign: 'center',
                    }}
                    className={fontStyleCustom.myFont}
                  >
                    {props.orderActionTimeSlot && props.orderActionDate}
                  </Typography>
                  <Typography
                    style={{
                      textAlign: 'center',
                      fontSize: '13px',
                      color: '#8A8D8E',
                      fontWeight: 500,
                    }}
                    className={fontStyleCustom.myFont}
                  >
                    {props.orderActionTimeSlot}
                  </Typography>
                </div>
                <img
                  src={iconRight}
                  alt='myIcon'
                  style={{ marginLeft: '5px' }}
                />
              </div>
            </div>
          </div>
        );
      }
    }
    return;
  };

  const renderOrderingMode = () => {
    return (
      <div
        onClick={() => {
          if (!props.isLoggedIn) {
            handleLogin();
          } else {
            handleOpenOrderingMode();
          }
        }}
        style={{
          width: '100%',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
          marginTop: '10px',
          marginBottom: '10px',
          padding: '20px 5px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography
            style={{ fontSize: '14px', color: 'black', fontWeight: 700 }}
            className={fontStyleCustom.myFont}
          >
            Ordering Mode
          </Typography>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginRight: '10px',
            }}
          >
            <Typography
              style={{ fontSize: '13px', color: '#8A8D8E', fontWeight: 500 }}
              className={fontStyleCustom.myFont}
            >
              {handleRenderOrderingModeLabel()}
            </Typography>
            <img src={iconRight} alt='myIcon' style={{ marginLeft: '5px' }} />
          </div>
        </div>

        {props.orderingMode === 'STOREPICKUP' && (
          <div style={{ marginTop: '20px' }}>
            <hr
              style={{
                backgroundColor: '#8A8D8E',
                opacity: 0.5,
              }}
            />
            <div
              style={{ fontSize: '14px', fontWeight: 700, color: '#B7B7B7' }}
            >
              Outlet Address
            </div>
            <div
              style={{ color: '#B7B7B7', fontSize: '14px', fontWeight: 500 }}
            >
              {props.defaultOutlet?.address}, {props.defaultOutlet?.city} -{' '}
              {props.defaultOutlet?.postalCode}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderDeliveryAddress = () => {
    if (props.orderingMode !== 'DELIVERY') {
      return;
    }
    return (
      <div
        onClick={() => {
          history.push('/delivery-address');
        }}
        style={{
          width: '100%',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
          marginTop: '10px',
          marginBottom: '10px',
          padding: '20px 0px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            style={{
              fontSize: '14px',
              marginLeft: '5px',
              color: 'black',
              fontWeight: 700,
            }}
            className={fontStyleCustom.myFont}
          >
            Delivery Address
          </Typography>
          <img src={iconRight} alt='myIcon' style={{ marginRight: '10px' }} />
        </div>
        <div
          style={{
            width: '100%',
            padding: '0px 3px',
          }}
        >
          {props.deliveryAddress && (
            <Typography
              className={fontStyleCustom.myFont}
              style={{
                fontSize: '15px',
                color: '#8A8D8E',
                marginLeft: '5px',
                lineHeight: 2,
              }}
            >
              <hr
                style={{
                  marginTop: '20px',
                  backgroundColor: '#8A8D8E',
                  opacity: 0.2,
                }}
              />
              <table>
                <tr>
                  <td style={{ padding: 0, margin: 0 }}>
                    {props.deliveryAddress.street}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      textAlign: 'left',
                      width: '100%',
                      display: '-webkit-box',
                      WebkitLineClamp: '3',
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      padding: 0,
                      margin: 0,
                    }}
                  >
                    {props.deliveryAddress.addressName},
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: 0, margin: 0 }}>
                    {props.deliveryAddress.unitNo}, {props.deliveryAddress.city}
                    ,{props.deliveryAddress.postalCode}
                  </td>
                </tr>
              </table>
            </Typography>
          )}
        </div>
      </div>
    );
  };
  const handleSelectDeliveryProvider = async (value) => {
    setIsLoading(true);

    await props.dispatch({
      type: 'SET_SELECTED_DELIVERY_PROVIDERS',
      data: value,
    });

    const response = await props.dispatch(
      OrderAction.changeOrderingMode({
        orderingMode: 'DELIVERY',
        provider: value,
      })
    );

    await props.dispatch(
      OrderAction.setData(response.data, CONSTANT.DATA_BASKET)
    );

    setIsLoading(false);
    setOpenSelectDeliveryProvider(false);
  };

  const deliveryIcon = (colorState) => {
    return (
      <svg
        width='40'
        height='40'
        viewBox='0 0 128 128'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M48.0774 87.5351C47.8138 87.5221 47.5218 87.5092 47.1987 87.5015C45.2914 87.442 42.7199 87.442 39.1353 87.442C35.5481 87.442 32.9766 87.442 31.0719 87.5015C30.7488 87.5118 30.4568 87.5221 30.1931 87.5351C30.5192 89.6731 31.6005 91.6235 33.2409 93.0328C34.8814 94.4421 36.9726 95.217 39.1353 95.217C41.298 95.217 43.3891 94.4421 45.0296 93.0328C46.6701 91.6235 47.7514 89.6731 48.0774 87.5351ZM39.1353 100.364C41.002 100.364 42.8503 99.9965 44.5749 99.2822C46.2995 98.5679 47.8665 97.5208 49.1864 96.2009C50.5063 94.881 51.5533 93.314 52.2677 91.5894C52.982 89.8649 53.3497 88.0165 53.3497 86.1498C53.3497 85.0023 53.3497 84.1934 52.9801 83.6248C52.104 82.2732 49.1422 82.2732 39.1353 82.2732C24.9209 82.2732 24.9209 82.2732 24.9209 86.1498C24.9209 89.9197 26.4185 93.5352 29.0842 96.2009C31.7499 98.8666 35.3654 100.364 39.1353 100.364ZM82.2308 43.5066H94.7007V74.5198H89.5318V48.6755H86.4951L79.1475 86.6408L74.0717 85.6588L82.2308 43.5066ZM101.027 95.0351C102.194 94.8119 103.306 94.361 104.298 93.7082C105.291 93.0554 106.145 92.2134 106.812 91.2304C107.48 90.2474 107.947 89.1426 108.187 87.9791C108.427 86.8155 108.436 85.6161 108.212 84.4492L113.288 83.4775C113.997 87.1802 113.205 91.0128 111.088 94.1322C108.971 97.2516 105.702 99.4022 101.999 100.111C98.2964 100.82 94.4638 100.028 91.3444 97.9114C88.225 95.7943 86.0744 92.5248 85.3657 88.8221L90.4415 87.8504C90.6647 89.0173 91.1156 90.1288 91.7684 91.1214C92.4212 92.114 93.2632 92.9683 94.2462 93.6355C95.2292 94.3027 96.334 94.7697 97.4976 95.0098C98.6611 95.25 99.8605 95.2586 101.027 95.0351V95.0351Z'
          fill={colorState}
        />
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M105.997 76.6184C104.294 75.4258 102.303 74.7114 100.23 74.5497C98.1575 74.388 96.0793 74.7849 94.2121 75.699C92.3448 76.6131 90.7567 78.011 89.6131 79.7472C88.4696 81.4834 87.8123 83.4944 87.7097 85.5709L110.044 81.6322C109.195 79.6131 107.792 77.8752 105.997 76.6184V76.6184ZM96.409 69.6017C100.278 68.9198 104.263 69.6153 107.672 71.5672C111.081 73.5192 113.698 76.6041 115.069 80.2857C116.247 83.4439 113.885 86.2041 111.228 86.6693L88.3223 90.7113C85.6681 91.1765 82.5047 89.3933 82.528 86.0232C82.5565 82.0949 83.9609 78.3008 86.4969 75.3006C89.0329 72.3004 92.5402 70.2839 96.409 69.6017V69.6017ZM55.9341 53.8444H32.6742C31.9888 53.8444 31.3314 54.1167 30.8467 54.6013C30.3621 55.086 30.0898 55.7434 30.0898 56.4288V61.5977H58.5186V56.4288C58.5186 55.7434 58.2463 55.086 57.7616 54.6013C57.2769 54.1167 56.6196 53.8444 55.9341 53.8444ZM32.6742 48.6755C30.6179 48.6755 28.6458 49.4924 27.1918 50.9464C25.7378 52.4004 24.9209 54.3725 24.9209 56.4288V64.1821C24.9209 64.8676 25.1932 65.5249 25.6779 66.0096C26.1625 66.4943 26.8199 66.7666 27.5053 66.7666H61.103C61.7884 66.7666 62.4458 66.4943 62.9305 66.0096C63.4151 65.5249 63.6874 64.8676 63.6874 64.1821V56.4288C63.6874 54.3725 62.8706 52.4004 61.4165 50.9464C59.9625 49.4924 57.9904 48.6755 55.9341 48.6755H32.6742Z'
          fill={colorState}
        />
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M55.9354 66.7665H38.0666C27.7987 66.7665 19.5827 73.5765 17.6186 82.2731H55.6485C55.7507 82.2784 55.8517 82.2493 55.9354 82.1904V66.7665ZM38.0666 61.5977C23.6713 61.5977 12 72.6539 12 86.2945C12 86.9277 12.5427 87.442 13.2147 87.442H55.6485C58.662 87.442 61.1043 85.1289 61.1043 82.2731V63.6652C61.1043 62.5229 60.1274 61.5977 58.923 61.5977H38.0666V61.5977ZM92.1175 33.1689H86.9486C85.5778 33.1689 84.263 33.7134 83.2937 34.6828C82.3243 35.6521 81.7798 36.9669 81.7798 38.3377C81.7798 39.7086 82.3243 41.0233 83.2937 41.9927C84.263 42.962 85.5778 43.5066 86.9486 43.5066H92.1175V33.1689ZM86.9486 28C84.2069 28 81.5774 29.0892 79.6387 31.0279C77.7 32.9666 76.6109 35.596 76.6109 38.3377C76.6109 41.0795 77.7 43.7089 79.6387 45.6476C81.5774 47.5863 84.2069 48.6755 86.9486 48.6755H95.6969C96.5756 48.6755 97.2864 47.9622 97.2864 47.0861V29.5894C97.2864 29.1679 97.1189 28.7636 96.8208 28.4655C96.5228 28.1675 96.1185 28 95.6969 28H86.9486V28Z'
          fill={colorState}
        />
        <path
          d='M67.1686 30.5844L79.897 32.8226L79.0002 37.9139L66.2744 35.6758L67.1686 30.5844Z'
          fill={colorState}
        />
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M84.3638 87.442H53.3506V82.2731H84.3638V87.442ZM79.1949 74.5198H55.935V69.3509H79.1949V74.5198Z'
          fill={colorState}
        />
      </svg>
    );
  };

  const renderElipsIcon = () => {
    return (
      <svg
        width='128'
        height='128'
        viewBox='0 0 128 128'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <circle cx='64' cy='64' r='64' fill={props.color?.primary} />
      </svg>
    );
  };

  const renderButtonProvider = () => {
    if (!dataCalculateFee) {
      return (
        <Typography
          className={fontStyleCustom.myFont}
          style={{
            color: props.color.primary,
            textAlign: 'center',
            fontWeight: 700,
            fontSize: '14px',
          }}
        >
          {!props.deliveryAddress
            ? 'Please fill your form customer detail'
            : 'Loading...'}
        </Typography>
      );
    } else {
      return dataCalculateFee?.dataProvider?.map((item) => {
        const conditionName = dataDeliveryProvider === item.name ? true : false;
        return (
          <div
            key={item.name}
            style={{
              marginBottom: '10px',
              width: '100%',
            }}
          >
            <div
              onClick={() => {
                handleSelectDeliveryProvider(item);
                setDataDeliveryProvider(item.name);
                setOpenAccordion(true);
              }}
              style={{
                backgroundColor: conditionName
                  ? `${props.color.primary}33`
                  : 'white',
                border: `1px solid ${props.color.primary}`,
                borderRadius: '10px',
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px',
              }}
            >
              {deliveryIcon(props.color.primary)}

              <div style={{ flex: 1, paddingLeft: '10px' }}>
                <Typography
                  className={fontStyleCustom.myFont}
                  style={{
                    fontSize: '14px',
                    color: props.color.primary,
                    fontWeight: 700,
                  }}
                >
                  {item.name}
                </Typography>
                <Typography
                  className={fontStyleCustom.myFont}
                  style={{
                    fontSize: '14px',
                    color: props.color.primary,
                    fontWeight: 700,
                  }}
                >{`(SGD ${item?.deliveryFee})`}</Typography>
              </div>
              <div style={{ flex: 0 }}>
                <div
                  style={{
                    borderRadius: '100%',
                    border: `1px solid ${props.color.primary}`,
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '2px',
                  }}
                >
                  {conditionName && renderElipsIcon()}
                </div>
              </div>
            </div>
          </div>
        );
      });
    }
  };

  const renderDeliveryProvider = (name) => {
    if (props.deliveryAddress) {
      return (
        <div
          style={{
            width: '100%',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
            marginTop: '10px',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Accordion
            sx={{
              boxShadow: 'none',
              padding: 0,
              margin: 0,
              width: '100%',
            }}
            expanded={openAccordion}
            onChange={() => setOpenAccordion(!openAccordion)}
          >
            <AccordionSummary
              sx={{ padding: '0', margin: '0' }}
              expandIcon={
                <ExpandMoreIcon
                  sx={{ width: '20px', height: '20px', marginRight: '10px' }}
                />
              }
              aria-controls='panel1a-content'
              id='panel1a-header'
            >
              <div
                style={{
                  width: gadgetScreen ? '80vw' : '35vw',
                }}
              >
                <Typography
                  style={{
                    fontSize: '14px',
                    color: 'black',
                    fontWeight: 700,
                    paddingLeft: '5px',
                  }}
                  className={fontStyleCustom.myFont}
                >
                  {name}
                </Typography>
              </div>
            </AccordionSummary>
            <AccordionDetails style={{ padding: '0 5px', margin: 0 }}>
              {renderButtonProvider()}
            </AccordionDetails>
          </Accordion>
        </div>
      );
    }
  };

  const handleSubtotal = () => {
    if (props.basket?.totalDiscountAmount !== 0) {
      const subTotalAfterDiscount =
        props.basket?.totalGrossAmount - props.basket.totalDiscountAmount;
      return subTotalAfterDiscount;
    }
    return props.basket?.totalGrossAmount;
  };

  const renderSubTotal = () => {
    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 0px',
          }}
        >
          <div style={{ width: '100%', textAlign: 'center', fontWeight: 700 }}>
            Total Details
          </div>
          <div
            onClick={() => setOpenDrawerBottom(false)}
            style={{ marginRight: '10px', fontWeight: 700 }}
          >
            X
          </div>
        </div>
        <div style={{ width: '100%' }}>
          <hr
            style={{
              backgroundColor: '#D6D6D6',
              padding: 0,
              margin: 0,
              opacity: 0.5,
            }}
          />
        </div>

        <div
          style={{
            width: '100%',
            backgroundColor: 'white',
            marginBottom: '10px',
            padding: '10px',
          }}
        >
          {props.basket?.totalDiscountAmount !== 0 && (
            <>
              <div style={styles.rootSubTotalItem}>
                <Typography
                  style={styles.subTotal}
                  className={fontStyleCustom.myFont}
                >
                  Subtotal b/f disc
                </Typography>
                <Typography style={styles.subTotal}>
                  {handleCurrency(props.basket?.totalGrossAmount)}
                </Typography>
              </div>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <hr
                  style={{
                    backgroundColor: '#D6D6D6',
                    width: '95%',
                    opacity: 0.5,
                  }}
                />
              </div>
            </>
          )}

          {props.basket?.exclusiveTax !== 0 && (
            <>
              <div style={styles.rootSubTotalItem}>
                <Typography style={styles.subTotal}>Tax</Typography>
                <Typography style={styles.subTotal}>
                  {handleCurrency(props.basket.exclusiveTax)}
                </Typography>
              </div>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <hr
                  style={{
                    backgroundColor: '#D6D6D6',
                    width: '95%',
                    opacity: 0.5,
                  }}
                />
              </div>
            </>
          )}
          {props.basket?.totalDiscountAmount !== 0 && (
            <>
              <div style={styles.rootSubTotalItem}>
                <Typography style={styles.totalDiscount}>Discount</Typography>
                <Typography style={styles.totalDiscount}>
                  - {handleCurrency(props.basket.totalDiscountAmount)}
                </Typography>
              </div>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <hr
                  style={{
                    backgroundColor: '#D6D6D6',
                    width: '95%',
                    opacity: 0.5,
                  }}
                />
              </div>
            </>
          )}
          {props.basket?.totalGrossAmount !== 0 && (
            <>
              <div style={styles.rootSubTotalItem}>
                <Typography style={styles.subTotal}>Subtotal</Typography>
                <Typography style={styles.subTotal}>
                  {handleCurrency(handleSubtotal())}
                </Typography>
              </div>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <hr
                  style={{
                    backgroundColor: '#D6D6D6',
                    width: '95%',
                    opacity: 0.5,
                  }}
                />
              </div>
            </>
          )}
          {props.basket.totalSurchargeAmount !== 0 && (
            <>
              <div style={styles.rootSubTotalItem}>
                <Typography style={styles.subTotal}>
                  Surcharge Amount
                </Typography>
                <Typography style={styles.subTotal}>
                  {handleCurrency(props.basket.totalSurchargeAmount)}
                </Typography>
              </div>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <hr
                  style={{
                    backgroundColor: '#D6D6D6',
                    width: '95%',
                    opacity: 0.5,
                  }}
                />
              </div>
            </>
          )}

          {props.orderingMode === 'DELIVERY' &&
            !isEmptyObject(props.selectedDeliveryProvider) && (
              <>
                {props.basket?.provider &&
                  props.basket?.provider?.deliveryFee !== 0 && (
                    <div style={styles.rootSubTotalItem}>
                      <Typography style={styles.subTotal}>
                        Delivery Fee
                      </Typography>
                      <Typography style={styles.subTotal}>
                        {handleCurrency(props.basket?.provider?.deliveryFee)}
                      </Typography>
                    </div>
                  )}

                {props.basket?.provider?.deliveryFee === 0 &&
                props.orderingMode === 'DELIVERY' ? (
                  <div style={styles.rootSubTotalItem}>
                    <Typography style={styles.subTotal}>
                      Delivery Fee
                    </Typography>
                    <Typography style={styles.subTotal}>Free</Typography>
                  </div>
                ) : null}
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <hr
                    style={{
                      backgroundColor: '#D6D6D6',
                      width: '95%',
                      opacity: 0.5,
                    }}
                  />
                </div>
              </>
            )}
        </div>
      </div>
    );
  };
  const renderButtonDisable = () => {
    return (
      <div
        style={{
          paddingTop: 15,
          paddingRight: 10,
          paddingLeft: 10,
          paddingBottom: 10,
          width: '70%',
        }}
      >
        <Button
          onClick={() => {
            if (props.isLoggedIn) {
              handleConfirmAndPay();
            } else {
              handleLogin();
            }
          }}
          disabled={handleDisabled()}
          style={{
            backgroundColor: props.color.primary,
            borderRadius: '15px',
            padding: '20px',
            width: '100%',
          }}
        >
          <Typography
            className={fontStyleCustom.myFont}
            sx={{
              fontWeight: 500,
              fontSize: '14px',
              color: 'white',
            }}
          >
            Payment
          </Typography>
        </Button>
      </div>
    );
  };

  const renderTotal = () => {
    return (
      <Paper
        variant='elevation'
        square={gadgetScreen}
        elevation={gadgetScreen ? 3 : 3}
        sx={
          gadgetScreen
            ? styles.grandTotalGadgetScreen
            : {
                padding: 0,
                margin: 0,
              }
        }
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: gadgetScreen ? '0px 10px' : '0px',
          }}
        >
          <div
            style={{
              width: '30%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              paddingLeft: gadgetScreen ? '0px' : '10px',
            }}
          >
            <Typography
              className={fontStyleCustom.myFont}
              sx={{ fontWeight: 500, fontSize: '14px' }}
            >
              GRAND TOTAL
            </Typography>
            <div
              onClick={() => setOpenDrawerBottom(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography
                className={fontStyleCustom.myFont}
                sx={{ fontWeight: 700, fontSize: '14px' }}
              >
                {handleCurrency(props.basket?.totalNettAmount)}
              </Typography>
              <img
                src={IconDown}
                style={{ marginLeft: '10px' }}
                alt='myIcon'
                width={12}
                height={10}
              />
            </div>
          </div>

          {renderButtonDisable()}
        </div>

        {props.basket?.inclusiveTax !== 0 && (
          <div style={styles.rootInclusiveTax}>
            <Typography style={styles.inclusiveTax}>
              {handleCurrency(props.basket?.inclusiveTax)}
            </Typography>
          </div>
        )}
      </Paper>
    );
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
            disabled={handleDisabled()}
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
            {renderDeliveryProvider('Choose Delivery Provider')}
            {renderDateTime()}
          </div>
          {renderTotal()}
        </>
      );
    }
    return (
      <div style={{ width: '100vw' }}>
        <div
          style={{
            width: '45%',
            marginLeft: 'auto',
            marginRight: 'auto',
            backgroundColor: 'white',
            height: '99.3vh',
            borderRadius: '8px',
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
            display: 'grid',
            gridTemplateColumns: '1fr',
            gridTemplateRows: '1fr 85px',
            gap: '0px 15px',
            gridTemplateAreas: '"."\n    "."',
          }}
        >
          <div
            style={{
              marginTop: '15%',
              padding: '0px 10px',
              overflowY: 'auto',
            }}
          >
            <ProductCartList />
            <div style={styles.cartGridRight}>
              {renderOrderingMode()}
              {renderDeliveryAddress()}
              {renderDeliveryProvider('Choose Delivery Provider')}
              {renderDateTime()}
            </div>
          </div>
          {renderTotal()}
        </div>
      </div>
    );
  };

  const renderCartOrEmpty = () => {
    if (!isEmptyArray(props.basket.details)) {
      return <div>{renderCart()}</div>;
    } else {
      return (
        <div style={styles.rootEmptyCart}>
          <img src={config.url_emptyImage} alt='is empty' />
          <Typography style={styles.emptyText}>Data is empty</Typography>
        </div>
      );
    }
  };

  return (
    <LoadingOverlayCustom active={isLoading} spinner text='Loading...'>
      <Box
        component='div'
        sx={{
          flexGrow: 1,
        }}
      >
        {openSelectDeliveryProvider && (
          <SelectProviderDialog
            open={openSelectDeliveryProvider}
            onClose={() => setOpenSelectDeliveryProvider(false)}
          />
        )}

        {openOrderingMode && (
          <OrderingModeDialog
            open={openOrderingMode}
            onClose={() => handleCloseOrderingMode()}
          />
        )}
        {openTimeSlot && (
          <TimeSlotDialog
            open={openTimeSlot}
            onClose={() => handleCloseTimeSlot()}
          />
        )}
        <Drawer
          anchor='bottom'
          open={openDrawerBottom}
          onClose={() => setOpenDrawerBottom((prev) => !prev)}
        >
          {renderSubTotal()}
        </Drawer>

        {renderCartOrEmpty()}
      </Box>
    </LoadingOverlayCustom>
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
  orderingModeDisplayName: '',
  orderActionDate: {},
  orderActionTime: {},
  orderActionTimeSlot: {},
  history: null,
  selectedDeliveryProvider: {},
  dispatch: null,
};

Cart.propTypes = {
  basket: PropTypes.object,
  color: PropTypes.object,
  companyInfo: PropTypes.object,
  defaultOutlet: PropTypes.object,
  deliveryAddress: PropTypes.object,
  dispatch: PropTypes.func,
  history: PropTypes.func,
  isLoggedIn: PropTypes.bool,
  orderActionDate: PropTypes.object,
  orderActionTime: PropTypes.object,
  orderActionTimeSlot: PropTypes.object,
  orderingMode: PropTypes.object,
  orderingModeDisplayName: PropTypes.object,
  selectedDeliveryProvider: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
