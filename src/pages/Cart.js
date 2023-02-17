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
import Swal from 'sweetalert2';
import OrderingModeTable from 'components/orderingModeTable';

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
      paddingLeft: 15,
      paddingRight: 15,
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
      marginTop: 10,
      opacity: 0.5,
    },
    rootSubTotalItem: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingLeft: 10,
      paddingRight: 10,
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
      paddingBottom: 1,
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
    gapContainer: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      marginTop: 15,
    },
    bottomLineContainer: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
    },
    gap: {
      backgroundColor: '#D6D6D6',
      width: '95%',
      opacity: 0.5,
    },
  };
  const [dataDeliveryProvider, setDataDeliveryProvider] = useState('');
  const [openDrawerBottom, setOpenDrawerBottom] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [openOrderingMode, setOpenOrderingMode] = useState(false);
  const [openOrderingTable, setOpenOrderingTable] = useState(false);
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
    props.dispatch({ type: 'INDEX_VOUCHER', payload: {} });
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
    if (props.history.location.state?.data) {
      props.dispatch({ type: 'SET_ORDERING_MODE', payload: '' });
      props.dispatch({ type: 'ORDERING_MODE_ACTIVE', data: '' });
      props.dispatch({ type: 'ITEM_ORDERING_MODE', data: {} });
      props.dispatch({ type: 'SET_ORDERING_MODES', payload: [] });
      props.dispatch({ type: 'SET_ORDERING_MODE_DISPlAY_NAME', data: '' });
      handleOpenOrderingMode();
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await props.dispatch(OrderAction.getCart());
      setIsLoading(false);
    };
    loadData();
  }, [props.basketUpdate, props.basket?.details?.length]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await props.dispatch(OrderAction.checkOfflineCart());
      setIsLoading(false);
    };
    loadData();
  }, []);

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
    if (props?.basket?.details && props.basket.details.length) {
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
    if (props.orderingMode) {
      return props.orderingMode;
    } else {
      return 'Ordering Mode';
    }
  };

  const handleDisabled = () => {
    const isAllItemUnavailable = props.basket?.details.every(
      (item) => item.orderingStatus === 'UNAVAILABLE'
    );
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
    if (isAllItemUnavailable) {
      return isAllItemUnavailable;
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

  const RenderDateTime = () => {
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
              boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
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
    } else {
      return null;
    }
  };

  const RenderDineIcon = () => {
    return (
      <svg
        width='20'
        height='20'
        viewBox='0 0 128 128'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M105.551 16.0838V16.0559L106.025 16V16.0559L105.551 16.0838Z'
          fill='black'
        />
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M27.9904 56.5541C28.1413 55.6317 28.2924 54.7076 28.3655 53.7828C25.4807 53.7828 22.5949 53.7689 19.7091 53.7549C16.8231 53.7409 13.937 53.727 11.0518 53.727H6.83511C6.74123 53.727 6.6427 53.7305 6.54176 53.7342C6.04318 53.7521 5.48597 53.7721 5.14142 53.3773C4.93129 53.1366 4.99322 52.8577 5.08513 52.582C5.16301 52.3484 5.24525 52.1161 5.32749 51.8838C5.39331 51.6979 5.45913 51.512 5.52271 51.3254C5.83206 50.4175 6.1528 49.5135 6.47354 48.6094C6.83857 47.5805 7.20361 46.5515 7.55187 45.517C8.6929 42.1272 9.89403 38.7576 11.0952 35.388C12.3575 31.8466 13.6199 28.3053 14.8124 24.7406C15.3463 23.1449 15.9115 21.5573 16.4761 19.9717C16.5233 19.8393 16.5704 19.7069 16.6175 19.5744C16.6595 19.4564 16.6983 19.3189 16.7394 19.1734C16.8905 18.6378 17.0724 17.9933 17.5584 17.8099C17.7277 17.7461 17.9068 17.7605 18.0851 17.7749C18.1613 17.7811 18.2374 17.7872 18.3124 17.7872H19.9041C20.8307 17.7872 21.7576 17.7942 22.6842 17.8012C23.6103 17.8082 24.5362 17.8151 25.4612 17.8151C28.6733 17.8151 31.8852 17.8361 35.0969 17.857C38.3081 17.878 41.519 17.8989 44.7296 17.8989C45.6838 17.8989 46.638 17.8978 47.5922 17.8967C50.771 17.8929 53.9496 17.8892 57.1284 17.927C57.708 17.9338 58.2881 17.9421 58.8686 17.9503C60.8108 17.978 62.7567 18.0056 64.6962 17.9826C68.9116 17.9325 73.1279 17.9296 77.3445 17.9267C81.5618 17.9239 85.7793 17.921 89.9964 17.8709C96.6577 17.7917 103.329 17.7577 109.991 17.7601C110.681 17.7604 110.912 18.5623 111.089 19.1806C111.124 19.303 111.157 19.4182 111.192 19.5186C111.862 21.4871 112.552 23.4515 113.249 25.4108C113.98 27.4624 114.692 29.5205 115.403 31.5786C116.113 33.6298 116.822 35.6811 117.55 37.7258C117.663 38.0431 117.776 38.3603 117.889 38.6776C118.792 41.2114 119.696 43.7484 120.547 46.2989C120.832 47.1546 121.136 48.0043 121.44 48.854C121.744 49.7037 122.048 50.5534 122.334 51.4092C122.399 51.6056 122.469 51.8006 122.539 51.9956C122.608 52.1906 122.678 52.3856 122.743 52.582C122.816 52.7999 122.888 53.0339 122.774 53.252C122.518 53.7425 121.917 53.7347 121.429 53.7284C121.375 53.7277 121.323 53.727 121.273 53.727H117.084C114.147 53.727 111.21 53.7409 108.273 53.7549C105.336 53.7689 102.399 53.7828 99.4631 53.7828C99.5361 54.7076 99.6872 55.6317 99.8381 56.5541C99.9307 57.1204 100.023 57.6861 100.098 58.2509C100.39 60.4774 100.715 62.7009 101.04 64.9239C101.164 65.7713 101.288 66.6187 101.41 67.4662C102.061 71.9837 102.701 76.503 103.34 81.0224C103.983 85.5613 104.625 90.1002 105.279 94.6374C105.805 98.2853 106.33 101.933 106.839 105.584C106.859 105.725 106.878 105.866 106.898 106.007C107.01 106.816 107.123 107.625 107.242 108.432C107.262 108.565 107.3 108.69 107.338 108.813C107.42 109.083 107.498 109.341 107.37 109.633C106.59 111.402 104.341 112.717 102.535 111.568C102.216 111.366 101.936 111.102 101.703 110.806C101.486 110.53 101.222 110.11 101.123 109.773C101.009 109.387 100.962 108.961 100.916 108.546C100.897 108.375 100.879 108.205 100.856 108.042C100.777 107.482 100.692 106.924 100.606 106.366C100.548 105.984 100.489 105.603 100.433 105.221C100.204 103.671 99.9696 102.121 99.7348 100.572C99.4999 99.022 99.2651 97.4725 99.0366 95.922C98.7947 94.2797 98.546 92.6384 98.2972 90.997C98.048 89.3532 97.7989 87.7093 97.5566 86.0644C97.4002 85.0029 97.2419 83.9412 97.0777 82.8809C97.0499 82.7023 97.0166 82.5209 96.983 82.3382C96.9018 81.8965 96.8193 81.4471 96.8102 81.0099L63.0486 81.3729L31.0184 81.0099C31.0093 81.4471 30.9267 81.8966 30.8455 82.3382C30.8119 82.5209 30.7786 82.7023 30.7508 82.8809C30.5866 83.9412 30.4283 85.0029 30.2719 86.0644C30.0296 87.7093 29.7805 89.3532 29.5313 90.997C29.2826 92.6384 29.0338 94.2797 28.7919 95.922C28.5633 97.4738 28.3282 99.0246 28.0932 100.575C27.8585 102.124 27.6239 103.672 27.3956 105.221C27.3394 105.603 27.281 105.984 27.2225 106.366C27.137 106.924 27.0515 107.482 26.9728 108.042C26.9498 108.205 26.9311 108.375 26.9122 108.546C26.8663 108.961 26.8192 109.387 26.7059 109.773C26.6067 110.11 26.3426 110.53 26.1256 110.806C25.8927 111.102 25.612 111.366 25.2937 111.568C23.4878 112.717 21.238 111.402 20.4588 109.633C20.33 109.341 20.4086 109.083 20.4908 108.813C20.5283 108.69 20.5665 108.565 20.5861 108.432C20.707 107.616 20.8208 106.797 20.9346 105.979C20.9529 105.847 20.9712 105.716 20.9896 105.584C21.4982 101.933 22.0238 98.2853 22.5495 94.6374C23.2012 90.1138 23.8417 85.5885 24.4822 81.0632C25.1238 76.5302 25.7653 71.9973 26.4182 67.4662C26.5403 66.6186 26.6643 65.771 26.7882 64.9234C27.1132 62.7006 27.4383 60.4773 27.731 58.2509C27.8053 57.6861 27.8978 57.1204 27.9904 56.5541ZM32.5894 48.8061L13.5444 48.6343L14.2791 46.4868L21.7451 24.7541L21.9416 24.2682L22.313 24.2387H23.2903L26.9765 24.2101L68.1662 23.981L102.654 24.2101L106.005 24.2387H106.898L107.242 24.2682L107.438 24.7541L107.843 25.9281L114.904 46.4868L115.639 48.6343L96.594 48.8061L74.6169 48.9779L64.6197 49.0925L54.5666 48.9779L32.5894 48.8061ZM35.5333 56.394L35.7729 54.6187L61.6596 54.7046L93.4106 54.6187L93.6502 56.394L96.1548 73.5167L96.3986 75.292L90.0037 75.4349L75.8177 75.6931L65.3178 75.9219L39.1798 75.4349L32.7849 75.292L33.0287 73.5167L35.5333 56.394Z'
          fill={props.color.primary}
        />
      </svg>
    );
  };

  const RenderTableMode = () => {
    return (
      <div
        onClick={() => {
          setOpenOrderingTable(true);
        }}
        style={{
          width: '100%',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
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
            Table Number
          </Typography>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginRight: '10px',
            }}
          >
            <RenderDineIcon />
            <Typography
              style={{
                fontSize: '13px',
                color: '#8A8D8E',
                fontWeight: 500,
                marginLeft: '5px',
              }}
              className={fontStyleCustom.myFont}
            >
              01
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

  const RenderOrderingMode = () => {
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
          boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
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

  const RenderDeliveryAddress = () => {
    if (props.orderingMode !== 'DELIVERY') {
      return null;
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
          boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
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

  const RenderDeliveryProvider = ({ name, deliveryAddress }) => {
    if (deliveryAddress) {
      return (
        <div
          style={{
            width: '100%',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
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
    } else {
      return null;
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
          <>
            <div style={styles.rootSubTotalItem}>
              <Typography
                className={fontStyleCustom.myFont}
                style={styles.subTotal}
              >
                Subtotal b/f disc.
              </Typography>
              <Typography
                className={fontStyleCustom.myFont}
                style={styles.subTotal}
              >
                {handleCurrency(props.basket?.totalGrossAmount)}
              </Typography>
            </div>
            <div style={styles.gapContainer} />
          </>
          {props.basket?.totalDiscountAmount !== 0 && (
            <>
              <div style={styles.rootSubTotalItem}>
                <Typography
                  className={fontStyleCustom.myFont}
                  style={styles.totalDiscount}
                >
                  Discount
                </Typography>
                <Typography
                  className={fontStyleCustom.myFont}
                  style={styles.totalDiscount}
                >
                  - {handleCurrency(props.basket?.totalDiscountAmount)}
                </Typography>
              </div>
              <div style={styles.gapContainer} />
            </>
          )}
          {props.basket?.totalSurchargeAmount !== 0 && (
            <>
              <div style={styles.rootSubTotalItem}>
                <Typography
                  className={fontStyleCustom.myFont}
                  style={styles.subTotal}
                >
                  Service Charge
                </Typography>
                <Typography
                  className={fontStyleCustom.myFont}
                  style={styles.subTotal}
                >
                  {handleCurrency(props.basket?.totalSurchargeAmount)}
                </Typography>
              </div>
              <div style={styles.gapContainer}>
                <hr style={styles.gap} />
              </div>
            </>
          )}

          <>
            <div style={styles.rootSubTotalItem}>
              <Typography
                className={fontStyleCustom.myFont}
                style={styles.subTotal}
              >
                Subtotal
              </Typography>
              <Typography
                className={fontStyleCustom.myFont}
                style={styles.subTotal}
              >
                {handleCurrency(
                  props.basket?.totalGrossAmount +
                    props.basket?.totalSurchargeAmount -
                    props.basket?.totalDiscountAmount
                )}
              </Typography>
            </div>
            <div style={styles.gapContainer} />
          </>

          {props.basket?.orderingMode === 'DELIVERY' && (
            <>
              {props.basket?.provider?.deliveryFee !== 0 && (
                <div style={styles.rootSubTotalItem}>
                  <Typography
                    className={fontStyleCustom.myFont}
                    style={styles.subTotal}
                  >
                    Delivery Fee
                  </Typography>
                  <Typography
                    className={fontStyleCustom.myFont}
                    style={styles.subTotal}
                  >
                    {handleCurrency(props.basket?.provider?.deliveryFee)}
                  </Typography>
                </div>
              )}
              {props.basket?.provider?.deliveryFee === 0 &&
              props.basket?.orderingMode === 'DELIVERY' ? (
                <div style={styles.rootSubTotalItem}>
                  <Typography
                    className={fontStyleCustom.myFont}
                    style={styles.subTotal}
                  >
                    Delivery Fee
                  </Typography>
                  <Typography
                    className={fontStyleCustom.myFont}
                    style={styles.subTotal}
                  >
                    Free
                  </Typography>
                </div>
              ) : null}
              <div style={styles.gapContainer} />
            </>
          )}

          {props.basket?.totalTaxAmount > 0 && (
            <>
              <div style={styles.rootSubTotalItem}>
                <Typography
                  className={fontStyleCustom.myFont}
                  style={styles.subTotal}
                >
                  Tax
                </Typography>
                <Typography
                  className={fontStyleCustom.myFont}
                  style={styles.subTotal}
                >
                  {handleCurrency(props.basket?.totalTaxAmount)}
                </Typography>
              </div>
              <div style={styles.gapContainer} />
            </>
          )}

          <div style={styles.bottomLineContainer}>
            <hr style={styles.gap} />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <p
              style={{
                fontWeight: 800,
                fontSize: '16px',
                margin: 0,
                padding: '0px 0px 0px 10px',
              }}
            >
              Grand Total
            </p>
            <p
              style={{
                fontWeight: 700,
                fontSize: '16px',
                margin: 0,
                padding: 0,
                paddingRight: '10px',
                color: props.color?.primary,
              }}
            >
              {handleCurrency(props.basket?.totalNettAmount)}
            </p>
          </div>
        </div>
      </div>
    );
  };
  const renderButtonDisable = () => {
    return (
      <div
        style={{
          padding:
            props.basket?.inclusiveTax !== 0 ? '5px 0px 0px 0px' : '7px 10px',
          width: '70%',
        }}
      >
        <Button
          onClick={() => {
            if (props.isLoggedIn) {
              if (props.defaultOutlet.orderingStatus === 'UNAVAILABLE') {
                Swal.fire({
                  title: '<p>The outlet is not available</p>',
                  text: `${props.defaultOutlet.name} is currently not available,please select another outlet`,
                  allowOutsideClick: false,
                  confirmButtonText: 'OK',
                  confirmButtonColor: props.color?.primary,
                  customClass: {
                    confirmButton: fontStyleCustom.buttonSweetAlert,
                    text: fontStyleCustom.textModalOutlet,
                  },
                }).then(() => {
                  history.push('/outlets');
                });
              } else {
                handleConfirmAndPay();
              }
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

  const filterBasketItemUnavailable = props.basket?.details?.filter(
    (item) => item.orderingStatus === 'UNAVAILABLE'
  );

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
            <RenderOrderingMode />
            {props.orderingMode === 'DINEIN' &&
              props.defaultOutlet.enableTableNumber && <RenderTableMode />}
            <RenderDeliveryAddress />
            <RenderDeliveryProvider
              name='Choose Delivery Provider'
              deliveryAddress={props.deliveryAddress}
            />
            <RenderDateTime />
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
              <RenderOrderingMode />
              {props.orderingMode === 'DINEIN' && <RenderTableMode />}
              <RenderDeliveryAddress />
              <RenderDeliveryProvider
                name='Choose Delivery Provider'
                deliveryAddress={props.deliveryAddress}
              />
              <RenderDateTime />
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
        {openOrderingTable && (
          <OrderingModeTable
            gadgetScreen={gadgetScreen}
            open={openOrderingTable}
            onClose={() => setOpenOrderingTable(false)}
            colorState={props.color}
            defaultOutlet={props.defaultOutlet}
          />
        )}
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
