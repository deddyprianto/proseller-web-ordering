import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import config from 'config';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import Swal from 'sweetalert2';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';

import ProductCartList from 'components/productCartList';
import OrderingModeDialog from 'components/orderingModeDialog';
import TimeSlotDialog from 'components/timeSlot/TimeSlotLogin';
import LoadingOverlayCustom from 'components/loading/LoadingOverlay';
import SelectProviderDialog from './DeliveryAddress/components/SelectProviderDialog';
import fontStyleCustom from 'pages/GuestCheckout/style/styles.module.css';
import IconDown from 'assets/images/VectorDown.png';
import iconRight from 'assets/images/iconRight.png';
import OrderingModeTable from 'components/orderingModeTable';

import { isEmptyArray, isEmptyObject } from 'helpers/CheckEmpty';
import { CONSTANT } from '../helpers/';
import { isEmpty } from 'helpers/utils';

import { PaymentAction } from 'redux/actions/PaymentAction';
import { OrderAction } from 'redux/actions/OrderAction';
import { OutletAction } from 'redux/actions/OutletAction';
import { IconDelivery, IconDineIn, IconElips } from 'assets/iconsSvg/Icons';
import useWindowSize from 'hooks/useWindowSize';
import {
  AccordionCart,
  ContainerStorePickUP,
  RenderTableMode,
} from 'components/componentHelperCart';


const encryptor = require('simple-encryptor')(process.env.REACT_APP_KEY_DATA);

const RenderDeliveryAddress = ({ orderingMode, history, deliveryAddress }) => {
  if (orderingMode !== 'DELIVERY') {
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
        {deliveryAddress && (
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
                  {deliveryAddress.street}
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
                  {deliveryAddress.addressName},
                </td>
              </tr>
              <tr>
                <td style={{ padding: 0, margin: 0 }}>
                  {deliveryAddress.unitNo}, {deliveryAddress.city},
                  {deliveryAddress.postalCode}
                </td>
              </tr>
            </table>
          </Typography>
        )}
      </div>
    </div>
  );
};

const RenderDeliveryProvider = ({
  name,
  deliveryAddress,
  openAccordion,
  setOpenAccordion,
  gadgetScreen,
  renderButtonProvider,
}) => {
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
        <AccordionCart
          openAccordion={openAccordion}
          setOpenAccordion={setOpenAccordion}
          gadgetScreen={gadgetScreen}
          fontStyleCustom={fontStyleCustom}
          name={name}
          renderButtonProvider={renderButtonProvider}
        />
      </div>
    );
  } else {
    return null;
  }
};

const RenderOrderingMode = ({
  isLoggedIn,
  handleLogin,
  handleOpenOrderingMode,
  orderingMode,
  defaultOutlet,
}) => {
  const handleRenderOrderingModeLabel = () => {
    if (orderingMode) {
      return orderingMode;
    } else {
      return 'Ordering Mode';
    }
  };

  return (
    <div
      id='ordering-mode-option'
      onClick={() => {
        if (!isLoggedIn) {
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

      {orderingMode === 'STOREPICKUP' && (
        <ContainerStorePickUP defaultOutlet={defaultOutlet}/>
      )}
    </div>
  );
};

const RenderDateTime = ({
  orderingMode,
  deliveryAddress,
  selectedDeliveryProvider,
  selectTimeSlotAvailable,
  setOpenTimeSlot,
  orderActionDate,
  orderActionTimeSlot,
}) => {
  const isStorePickUp = orderingMode === CONSTANT.ORDERING_MODE_STORE_PICKUP;
  const isTakeAway = orderingMode === CONSTANT.ORDERING_MODE_TAKE_AWAY;
  const isDelivery =
    orderingMode === CONSTANT.ORDERING_MODE_DELIVERY &&
    deliveryAddress &&
    selectedDeliveryProvider &&
    selectTimeSlotAvailable;

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
                  {orderActionTimeSlot && orderActionDate}
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
                  {orderActionTimeSlot}
                </Typography>
              </div>
              <img src={iconRight} alt='myIcon' style={{ marginLeft: '5px' }} />
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  } else {
    return null;
  }
};

const Cart = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { width } = useWindowSize();
  const gadgetScreen = width < 980;

  const color = useSelector((state) => state.theme.color);
  const basket = useSelector((state) => state.order.basket);
  const companyInfo = useSelector((state) => state.masterdata.companyInfo.data);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const defaultOutlet = useSelector((state) => state.outlet.defaultOutlet);
  const deliveryAddress = useSelector((state) => state.order.deliveryAddress);
  const orderingMode = useSelector((state) => state.order.orderingMode);
  const orderActionDate = useSelector((state) => state.order.orderActionDate);
  const orderActionTime = useSelector((state) => state.order.orderActionTime);
  const orderActionTimeSlot = useSelector(
    (state) => state.order.orderActionTimeSlot
  );
  const selectedDeliveryProvider = useSelector(
    (state) => state.order.selectedDeliveryProvider
  );
  const basketUpdate = useSelector((state) => state.order.basketUpdate);
  const noTable = useSelector((state) => state.order.noTable);
  const orderingSetting = useSelector((state) => state.order.orderingSetting);

  const styles = {
    rootPaper: {
      marginBottom: 10,
      paddingBottom: 10,
      backgroundColor: color.background,
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
      color: color.primary,
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
      backgroundColor: color.primary,
    },
    grandTotalGadgetScreen: {
      width: '100%',
      margin: 0,
      top: 'auto',
      right: 'auto',
      bottom: 70,
      left: 'auto',
      position: 'fixed',
      backgroundColor: color.background,
      paddingTop: '2px',
      paddingBottom: '10px',
      paddingLeft: '16px',
      paddingRight: '16px',
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
      backgroundColor: color.primary,
    },
    warningText: {
      fontSize: '1.2rem',
      fontStyle: 'italic',
      fontWeight: 500,
      color: color.textWarningColor,
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
  const [isSelectedOrderingMode, setIsSelectedOrderingMode] = useState(false);

  useEffect(() => {
    if (orderingMode !== 'DELIVERY') {
      dispatch({ type: 'SET_DELIVERY_ADDRESS', data: null });
    }
  }, [orderingMode, dispatch]);

  useEffect(() => {
    dispatch({
      type: 'SAVE_DETAIL_TOP_UP_SVC',
      payload: {},
    });
    dispatch({ type: 'INDEX_VOUCHER', payload: {} });
  }, [dispatch]);

  useEffect(() => {
    const getDataProviderListAndFee = async () => {
      if (deliveryAddress) {
        setIsLoading(true);
        let payload = {
          outletId: basket?.outlet?.id,
          cartID: basket?.cartID,
          deliveryAddress: deliveryAddress,
        };

        let responseCalculateFee = await dispatch(
          OrderAction.getCalculateFee(payload)
        );

        if (!isEmpty(responseCalculateFee)) {
          setDataCalculateFee(responseCalculateFee);
        }

        setIsLoading(false);
      }
    };

    getDataProviderListAndFee();
  }, [deliveryAddress, basket, dispatch]);

  useEffect(() => {
    if (history.location.state?.data) {
      dispatch({ type: 'SET_ORDERING_MODE', payload: '' });
      dispatch({ type: 'ORDERING_MODE_ACTIVE', data: '' });
      dispatch({ type: 'ITEM_ORDERING_MODE', data: {} });
      dispatch({ type: 'SET_ORDERING_MODES', payload: [] });
      dispatch({ type: 'SET_ORDERING_MODE_DISPlAY_NAME', data: '' });
    }
  }, [dispatch, history.location.state?.data]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await dispatch(OrderAction.getCart());
      setIsLoading(false);
    };
    loadData();
  }, [basketUpdate, basket?.details?.length, dispatch]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setIsLoading(true);
      await dispatch(OrderAction.checkOfflineCart());
      setIsLoading(false);
    };

    if (isMounted) {
      loadData();
    }

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  useEffect(() => {
    const getDataTimeSlot = async () => {
      let dateTime = new Date();
      let maxDays = 90;

      if (!isEmptyArray(defaultOutlet)) {
        maxDays = defaultOutlet?.timeSlots[0]?.interval;
      }

      let payload = {
        outletID: defaultOutlet.sortKey,
        clientTimezone: Math.abs(dateTime.getTimezoneOffset()),
        date: moment(dateTime).format('YYYY-MM-DD'),
        maxDays: maxDays,
        orderingMode: orderingMode,
      };

      const response = await dispatch(OrderAction.getTimeSlot(payload));

      if (!response) {
        setSelectTimeSlotAvailable(false);
      } else {
        setSelectTimeSlotAvailable(true);
      }
    };
    if (
      orderingMode === CONSTANT.ORDERING_MODE_DELIVERY ||
      orderingMode === CONSTANT.ORDERING_MODE_STORE_PICKUP ||
      orderingMode === CONSTANT.ORDERING_MODE_TAKE_AWAY
    ) {
      getDataTimeSlot();
    }
  }, [orderingMode, defaultOutlet, dispatch]);

  useEffect(() => {
    let isMounted = true;
    const checkLoginAndOrderingMode = async () => {
      if (
        !isEmptyArray(basket.details) &&
        isLoggedIn &&
        orderingSetting?.AllowedOrderingMode
      ) {
        !orderingMode
          ? handleOpenOrderingMode()
          : handleNoAvailableOrderingMode();
      }
    };

    if (isMounted) {
      checkLoginAndOrderingMode();
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basket.details?.length, orderingSetting?.AllowedOrderingMode]);

  useEffect(() => {
    const handleRemoveOrderingMode = async () => {
      const orderingModeLocal = localStorage.getItem(
        `${config.prefix}_ordering_mode`
      );
      if (isEmptyArray(basket.details) && orderingModeLocal) {
        await dispatch(OrderAction.setData({}, 'REMOVE_ORDERING_MODE'));
        await dispatch(
          OrderAction.setData({}, 'DELETE_ORDER_ACTION_TIME_SLOT')
        );
        await dispatch(
          OrderAction.setData({}, 'SET_SELECTED_DELIVERY_PROVIDERS')
        );
        await dispatch(
          OrderAction.setData({}, 'SET_SELECTED_DELIVERY_PROVIDERS')
        );
        await dispatch(
          OrderAction.setData(null, 'SET_ORDERING_MODE_DISPlAY_NAME')
        );
        await dispatch({ type: CONSTANT.NO_TABLE, payload: '' });
        localStorage.removeItem(`${config.prefix}_delivery_providers`);
        localStorage.removeItem(`${config.prefix}_delivery_address`);
        localStorage.removeItem(`${config.prefix}_ordering_mode`);
        localStorage.removeItem(`${config.prefix}_ordering_mode_display_name`);
      }
    };

    handleRemoveOrderingMode();
  }, [basket.details, dispatch]);

  useEffect(() => {
    dispatch(PaymentAction.clearAll());
  }, [dispatch]);

  /**
   * Side effect when basket updated
   * @description When all product in cart were removed, redirect to '/' page.
   */
  useEffect(() => {
    if (basket?.details && basket.details.length) {
      setPreviousTotalItem(basket.details.length);
    } else {
      if (previousTotalItem > 0) {
        history.push('/');
      }
    }
  }, [previousTotalItem, basket, history]);

  const handleCurrency = (price) => {
    if (companyInfo) {
      const result = price?.toLocaleString(companyInfo?.currency?.locale, {
        style: 'currency',
        currency: companyInfo?.currency?.code,
      });
      return result;
    }
  };

  const handleCloseOrderingMode = () => {
    setOpenOrderingMode(false);
  };

  const handleCloseTimeSlot = () => {
    setOpenTimeSlot(false);
  };

  const handleOpenOrderingMode = async (isSelected = true) => {
    const intersectOrderingMode = await getIntersectOrderingMode();
    if (intersectOrderingMode.length === 1) {
      (!isSelectedOrderingMode || !isSelected) &&
        intersectOrderingMode.forEach(async (item) => {
          dispatch({ type: 'ITEM_ORDERING_MODE', data: item });
          dispatch({ type: 'ORDERING_MODE_ACTIVE', data: item });

          dispatch({
            type: 'SET_ORDERING_MODE',
            payload: item.name,
          });

          const responseChangeOrderingMode = await dispatch(
            OrderAction.changeOrderingMode({
              orderingMode: item.name,
              provider: selectedDeliveryProvider
                ? selectedDeliveryProvider
                : {},
            })
          );

          await dispatch(
            OrderAction.setData(
              item.displayName,
              'SET_ORDERING_MODE_DISPlAY_NAME'
            )
          );

          await dispatch(
            OrderAction.setData(
              responseChangeOrderingMode.data,
              CONSTANT.DATA_BASKET
            )
          );

          setIsSelectedOrderingMode(true);
        });
    } else if (intersectOrderingMode.length < 1) {
      modalNoAvailableOrderingMode();
    } else {
      setOpenOrderingMode(true);
    }
  };

  const handleNoAvailableOrderingMode = async () => {
    const intersectOrderingMode = await getIntersectOrderingMode();
    if (intersectOrderingMode.length < 1) {
      modalNoAvailableOrderingMode();
    }
  };

  const modalNoAvailableOrderingMode = () => {
    Swal.fire({
      title: `<p style='padding-top: 10px'>No Ordering Mode Available</p>`,
      html: `<h5 style='color:#B7B7B7; font-size:14px'>There are no available ordering modes, please select another outlet</h5>`,
      allowOutsideClick: false,
      confirmButtonText: 'Select Outlet',
      confirmButtonColor: color?.primary,
      width: '40em',
      customClass: {
        confirmButton: fontStyleCustom.buttonSweetAlert,
        title: fontStyleCustom.fontTitleSweetAlert,
      },
    }).then(() => {
      history.push('/outlets');
    });
  };

  const getIntersectOrderingMode = async () => {
    setIsLoading(true);
    const data = await dispatch(
      OutletAction?.fetchSingleOutlet(basket?.outlet)
    );

    const orderingModesField = [
      {
        isEnabledFieldName: 'enableStorePickUp',
        name: CONSTANT.ORDERING_MODE_STORE_PICKUP,
        displayName: data?.storePickUpName || null,
      },
      {
        isEnabledFieldName: 'enableDelivery',
        name: CONSTANT.ORDERING_MODE_DELIVERY,
        displayName: data?.deliveryName || null,
      },
      {
        isEnabledFieldName: 'enableTakeAway',
        name: CONSTANT.ORDERING_MODE_TAKE_AWAY,
        displayName: data?.takeAwayName || null,
      },
      {
        isEnabledFieldName: 'enableDineIn',
        name: CONSTANT.ORDERING_MODE_DINE_IN,
        displayName: data?.dineInName || null,
      },
    ];

    const intersectOrderingMode = orderingModesField.filter((mode) => {
      const isEnabled = Boolean(data[mode?.isEnabledFieldName]);
      const isAllowed = orderingSetting?.AllowedOrderingMode?.includes(
        mode.name
      );
      return isEnabled && isAllowed;
    });

    setIsLoading(false);

    return intersectOrderingMode;
  };

  const handleLogin = () => {
    document.getElementById('login-register-btn').click();
  };
  const handleDisabled = () => {
    const isAllItemUnavailable = basket?.details.every(
      (item) => item.orderingStatus === 'UNAVAILABLE'
    );
    const someItemIsUnavailable = !basket?.details.every((item) => {
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
    if (orderingMode === CONSTANT.ORDERING_MODE_DELIVERY) {
      let isAllCompleted = false;
      if (selectTimeSlotAvailable) {
        isAllCompleted =
          orderingMode &&
          orderActionDate &&
          orderActionTime &&
          orderActionTimeSlot &&
          deliveryAddress &&
          !isEmptyObject(selectedDeliveryProvider) &&
          !selectedDeliveryProvider?.deliveryProviderError?.status;
      } else {
        isAllCompleted =
          orderingMode &&
          deliveryAddress &&
          !isEmptyObject(selectedDeliveryProvider) &&
          !selectedDeliveryProvider?.deliveryProviderError?.status;
      }

      return !isAllCompleted;
    } else if (orderingMode === CONSTANT.ORDERING_MODE_STORE_PICKUP) {
      let isAllCompleted = false;
      if (selectTimeSlotAvailable) {
        isAllCompleted =
          orderingMode &&
          orderActionDate &&
          orderActionTime &&
          orderActionTimeSlot;
      } else {
        isAllCompleted = !!orderingMode;
      }

      return !isAllCompleted;
    } else if (orderingMode === CONSTANT.ORDERING_MODE_TAKE_AWAY) {
      let isAllCompletedValidation = false;
      if (selectTimeSlotAvailable) {
        isAllCompletedValidation =
          orderingMode &&
          orderActionDate &&
          orderActionTime &&
          orderActionTimeSlot;
      } else {
        isAllCompletedValidation = !!orderingMode;
      }
      return !isAllCompletedValidation;
    } else if (orderingMode === CONSTANT.ORDERING_MODE_DINE_IN) {
      let isAllCompleted = false;
      if (defaultOutlet.enableTableNumber) {
        isAllCompleted = orderingMode && noTable;
      } else {
        isAllCompleted = !!orderingMode;
      }
      return !isAllCompleted;
    }

    return !orderingMode;
  };

  const handleConfirmAndPay = () => {
    !defaultOutlet.enableTableNumber &&
      dispatch({ type: CONSTANT.NO_TABLE, payload: '' });

    if (
      basket &&
      deliveryAddress &&
      defaultOutlet &&
      orderingMode &&
      orderActionDate &&
      orderActionTime &&
      orderActionTimeSlot
    ) {
      localStorage.setItem(
        `${config.prefix}_dataSettle`,
        JSON.stringify(
          encryptor.encrypt({
            dataBasket: basket,
            deliveryAddress: deliveryAddress,
            deliveryProvider: selectedDeliveryProvider,
            storeDetail: defaultOutlet,
            pointsToRebateRatio: '0:0',
            orderingMode: orderingMode,
            orderActionDate: orderActionDate,
            orderActionTime: orderActionTime,
            orderActionTimeSlot: orderActionTimeSlot,
          })
        )
      );
      history.push('/payment');
    }

    history.push('/payment');
  };

  const handleSelectDeliveryProvider = async (value) => {
    setIsLoading(true);

    await dispatch({
      type: 'SET_SELECTED_DELIVERY_PROVIDERS',
      data: value,
    });

    const response = await dispatch(
      OrderAction.changeOrderingMode({
        orderingMode: 'DELIVERY',
        provider: value,
      })
    );

    await dispatch(OrderAction.setData(response.data, CONSTANT.DATA_BASKET));

    setIsLoading(false);
    setOpenSelectDeliveryProvider(false);
  };

  const renderButtonProvider = () => {
    if (!dataCalculateFee) {
      return (
        <Typography
          className={fontStyleCustom.myFont}
          style={{
            color: color.primary,
            textAlign: 'center',
            fontWeight: 700,
            fontSize: '14px',
          }}
        >
          {!deliveryAddress
            ? 'Please fill your form customer detail'
            : 'Loading...'}
        </Typography>
      );
    } else {
      return dataCalculateFee?.dataProvider?.map((item) => {
        const conditionName =
          basket?.provider?.name === item.name ? true : false;
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
                setOpenAccordion(true);
              }}
              style={{
                backgroundColor: conditionName ? `${color.primary}33` : 'white',
                border: `1px solid ${color.primary}`,
                borderRadius: '10px',
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px',
              }}
            >
              <IconDelivery color={color.primary} />

              <div style={{ flex: 1, paddingLeft: '10px' }}>
                <Typography
                  className={fontStyleCustom.myFont}
                  style={{
                    fontSize: '14px',
                    color: color.primary,
                    fontWeight: 700,
                  }}
                >
                  {item.name}
                </Typography>
                <Typography
                  className={fontStyleCustom.myFont}
                  style={{
                    fontSize: '14px',
                    color: color.primary,
                    fontWeight: 700,
                  }}
                >{`(SGD ${item?.deliveryFee})`}</Typography>
              </div>
              <div style={{ flex: 0 }}>
                <div
                  style={{
                    borderRadius: '100%',
                    border: `1px solid ${color.primary}`,
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '2px',
                  }}
                >
                  {conditionName && <IconElips color={color.primary} />}
                </div>
              </div>
            </div>
          </div>
        );
      });
    }
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
                {handleCurrency(basket?.totalGrossAmount)}
              </Typography>
            </div>
            <div style={styles.gapContainer} />
          </>
          {basket?.totalDiscountAmount !== 0 && (
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
                  - {handleCurrency(basket?.totalDiscountAmount)}
                </Typography>
              </div>
              <div style={styles.gapContainer} />
            </>
          )}
          {basket?.totalSurchargeAmount !== 0 && (
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
                  {handleCurrency(basket?.totalSurchargeAmount)}
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
                  basket?.totalGrossAmount +
                    basket?.totalSurchargeAmount -
                    basket?.totalDiscountAmount
                )}
              </Typography>
            </div>
            <div style={styles.gapContainer} />
          </>

          {basket?.orderingMode === 'DELIVERY' && (
            <>
              {basket?.provider?.deliveryFee !== 0 && (
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
                    {handleCurrency(basket?.provider?.deliveryFee)}
                  </Typography>
                </div>
              )}
              {basket?.provider?.deliveryFee === 0 &&
              basket?.orderingMode === 'DELIVERY' ? (
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

          {basket?.totalTaxAmount > 0 && (
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
                  {handleCurrency(basket?.totalTaxAmount)}
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
                color: color?.primary,
              }}
            >
              {handleCurrency(basket?.totalNettAmount)}
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
          padding: basket?.inclusiveTax !== 0 ? '5px 0px 0px 0px' : '0px',
          width: '60%',
        }}
      >
        <Button
          onClick={async () => {
            if (isLoggedIn) {
              const currentOutlet = await dispatch(
                OutletAction.getOutletById(defaultOutlet.id)
              );
              const intersectOrderingMode = await getIntersectOrderingMode();

              const checkOrderingMode = intersectOrderingMode?.find(
                (val) => val.name === orderingMode
              );

              if (currentOutlet.orderingStatus === 'UNAVAILABLE') {
                Swal.fire({
                  title: `<p style='padding-top: 10px'>The outlet is not available</p>`,
                  html: `<h5 style='color:#B7B7B7; font-size:14px'>${currentOutlet.name} is currently offline,<br>please select another outlet</h5>`,
                  width: '40em',
                  allowOutsideClick: false,
                  confirmButtonText: 'OK',
                  confirmButtonColor: color?.primary,
                  customClass: {
                    confirmButton: fontStyleCustom.buttonSweetAlert,
                    text: fontStyleCustom.textModalOutlet,
                  },
                }).then(() => {
                  history.push('/outlets');
                });
              } else if (intersectOrderingMode.length < 1) {
                modalNoAvailableOrderingMode();
              } else if (!checkOrderingMode) {
                Swal.fire({
                  title: `<p style='padding-top: 10px'>Ordering mode is not available</p>`,
                  html: `<h5 style='color:#B7B7B7; font-size:14px'>${orderingMode} is currently not available,<br>please select another ordering mode</h5>`,
                  allowOutsideClick: false,
                  width: '40em',
                  confirmButtonText: 'OK',
                  confirmButtonColor: color?.primary,
                  customClass: {
                    confirmButton: fontStyleCustom.buttonSweetAlert,
                    title: fontStyleCustom.fontTitleSweetAlert,
                  },
                })
                  .then(async () => {
                    setIsSelectedOrderingMode(false);
                  })
                  .finally(() => handleOpenOrderingMode(false));
              } else {
                handleConfirmAndPay();
              }
            } else {
              handleLogin();
            }
          }}
          disabled={handleDisabled()}
          style={{
            backgroundColor: color.primary,
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
        elevation={3}
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
          }}
        >
          <div
            style={{
              width: '40%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              paddingLeft: gadgetScreen ? '0px' : '10px',
            }}
          >
            <Typography
              className={fontStyleCustom.myFont}
              sx={{ fontWeight: 600, fontSize: '16px' }}
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
                {handleCurrency(basket?.totalNettAmount)}
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

  const renderCart = () => {
    if (gadgetScreen) {
      return (
        <>
          <div style={styles.rootCartGadgetSize}>
            <ProductCartList />
            <RenderOrderingMode
              isLoggedIn={isLoggedIn}
              handleLogin={handleLogin}
              handleOpenOrderingMode={handleOpenOrderingMode}
              orderingMode={orderingMode}
              defaultOutlet={defaultOutlet}
            />
            {orderingMode === 'DINEIN' && defaultOutlet.enableTableNumber && (
              <RenderTableMode
                setOpenOrderingTable={setOpenOrderingTable}
                noTable={noTable}
                color={color}
                orderingMode={orderingMode}
                defaultOutlet={defaultOutlet}
                fontStyleCustom={fontStyleCustom}
              />
            )}
            <RenderDeliveryAddress
              orderingMode={orderingMode}
              history={history}
              deliveryAddress={deliveryAddress}
            />
            <RenderDeliveryProvider
              name='Choose Delivery Provider'
              deliveryAddress={deliveryAddress}
              openAccordion={openAccordion}
              setOpenAccordion={setOpenAccordion}
              gadgetScreen={gadgetScreen}
              renderButtonProvider={renderButtonProvider}
            />
            <RenderDateTime
              orderingMode={orderingMode}
              deliveryAddress={deliveryAddress}
              selectedDeliveryProvider={selectedDeliveryProvider}
              selectTimeSlotAvailable={selectTimeSlotAvailable}
              setOpenTimeSlot={setOpenTimeSlot}
              orderActionDate={orderActionDate}
              orderActionTimeSlot={orderActionTimeSlot}
            />
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
            gridTemplateRows: '1fr 70px',
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
              <RenderOrderingMode
                isLoggedIn={isLoggedIn}
                handleLogin={handleLogin}
                handleOpenOrderingMode={handleOpenOrderingMode}
                orderingMode={orderingMode}
                defaultOutlet={defaultOutlet}
              />
              {orderingMode === 'DINEIN' && (
                <RenderTableMode
                  setOpenOrderingTable={setOpenOrderingTable}
                  noTable={noTable}
                  color={color}
                  orderingMode={orderingMode}
                  defaultOutlet={defaultOutlet}
                  fontStyleCustom={fontStyleCustom}
                />
              )}
              <RenderDeliveryAddress
                orderingMode={orderingMode}
                history={history}
                deliveryAddress={deliveryAddress}
              />
              <RenderDeliveryProvider
                name='Choose Delivery Provider'
                deliveryAddress={deliveryAddress}
                openAccordion={openAccordion}
                setOpenAccordion={setOpenAccordion}
                gadgetScreen={gadgetScreen}
                renderButtonProvider={renderButtonProvider}
              />
              <RenderDateTime
                orderingMode={orderingMode}
                deliveryAddress={deliveryAddress}
                selectedDeliveryProvider={selectedDeliveryProvider}
                selectTimeSlotAvailable={selectTimeSlotAvailable}
                setOpenTimeSlot={setOpenTimeSlot}
                orderActionDate={orderActionDate}
                orderActionTimeSlot={orderActionTimeSlot}
              />
            </div>
          </div>
          {renderTotal()}
        </div>
      </div>
    );
  };

  const renderCartOrEmpty = () => {
    if (!isEmptyArray(basket.details)) {
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
            colorState={color}
            defaultOutlet={defaultOutlet}
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
            onClose={handleCloseOrderingMode}
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

export default Cart;
