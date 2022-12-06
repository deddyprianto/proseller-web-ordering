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
import circleActive from 'assets/images/bulatActive.png';
import iconVespa from 'assets/images/2.png';

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

  const [selectTimeSlotAvailable, setSelectTimeSlotAvailable] = useState(false);

  const [dataCalculateFee, setDataCalculateFee] = useState();

  useEffect(() => {
    if (props.orderingMode !== 'DELIVERY') {
      props.dispatch({ type: 'SET_DELIVERY_ADDRESS', data: null });
    }
  }, [props.orderingMode]);

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
      payload: value,
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
                setOpenAccordion(false);
              }}
              style={{
                backgroundColor: conditionName ? '#4386A133' : 'white',
                border: '1px solid #4386A1',
                borderRadius: '10px',
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px',
              }}
            >
              <img src={iconVespa} alt='vespa' style={{ flex: 0 }} />

              <div style={{ flex: 1, paddingLeft: '10px' }}>
                <Typography
                  className={fontStyleCustom.myFont}
                  style={{
                    fontSize: '14px',
                    color: '#4386A1',
                    fontWeight: 700,
                  }}
                >
                  {item.name}
                </Typography>
                <Typography
                  className={fontStyleCustom.myFont}
                  style={{
                    fontSize: '14px',
                    color: '#4386A1',
                    fontWeight: 700,
                  }}
                >{`(SGD ${item?.deliveryFee})`}</Typography>
              </div>
              <div style={{ flex: 0 }}>
                <div
                  style={{
                    borderRadius: '100%',
                    border: '1px solid #4386A1',
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {conditionName && (
                    <img src={circleActive} width={11} height={11} />
                  )}
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
