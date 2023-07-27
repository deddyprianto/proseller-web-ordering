import React, { useEffect, useLayoutEffect, useState } from 'react';
import { isEmptyArray } from 'helpers/CheckEmpty';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import countryCodes from 'country-codes-list';
import Swal from 'sweetalert2';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import useMediaQuery from '@mui/material/useMediaQuery';

import Drawer from '@mui/material/Drawer';
import CircularProgress from '@mui/material/CircularProgress';

import LoadingOverlayCustom from 'components/loading/LoadingOverlay';

import IconsArrowLeft from 'assets/images/IconsArrowLeft.png';
import fontStyleCustom from './style/styles.module.css';
import IconDown from 'assets/images/VectorDown.png';
import addIcon from 'assets/images/add.png';
import iconRight from 'assets/images/iconRight.png';
import iconSeru from 'assets/images/IconsSeru.png';
import OrderingModeDialogGuestCheckout from 'components/orderingModeDialog/OrderingModeDialogGuestCheckout';
import config from 'config';
import { OrderAction } from 'redux/actions/OrderAction';
import { CONSTANT } from 'helpers';
import TimeSlotDialog from 'components/timeSlot/TimeSlotGuestCo';
import ModalFormDeliveryCustomerDetail from './ModalFormDeliveryCustomerDetail';
import iconDown from 'assets/images/IconDown.png';
import ProductAddModal from 'components/ProductList/components/ProductAddModal';
import SearchInput, { createFilter } from 'react-search-input';
import search from 'assets/images/search.png';
import screen from 'hooks/useWindowSize';
import { OutletAction } from 'redux/actions/OutletAction';
import {
  IconDineIn,
  IconPlace,
  renderIconEdit,
  renderIconInformation,
} from 'assets/iconsSvg/Icons';
import OrderingModeTableGuestCO from 'components/orderingModeTableGuestCO';
import { ProductAction } from 'redux/actions/ProductAction';
import {
  AccordionCart,
  ContainerStorePickUP,
} from 'components/componentHelperCart';

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

const RenderTableMode = ({
  setOpenOrderingTable,
  noTable,
  color,
  orderingModeGuestCheckout,
  defaultOutlet,
}) => {
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
          {noTable ? (
            <IconDineIn color={color.primary} />
          ) : (
            <div
              style={{
                fontSize: '13px',
                color: '#8A8D8E',
                fontWeight: 600,
              }}
            >
              Choose Table
            </div>
          )}
          <Typography
            style={{
              fontSize: '13px',
              color: '#8A8D8E',
              fontWeight: 500,
              marginLeft: '5px',
              textTransform: 'uppercase',
            }}
            className={fontStyleCustom.myFont}
          >
            {noTable}
          </Typography>
          <img src={iconRight} alt='myIcon' style={{ marginLeft: '5px' }} />
        </div>
      </div>

      {orderingModeGuestCheckout === 'STOREPICKUP' && (
        <div style={{ marginTop: '20px' }}>
          <hr
            style={{
              backgroundColor: '#8A8D8E',
              opacity: 0.5,
            }}
          />
          <div
            style={{
              fontSize: '14px',
              fontWeight: 700,
              color: '#B7B7B7',
            }}
          >
            Outlet Address
          </div>
          <div
            style={{
              color: '#B7B7B7',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            {defaultOutlet?.address}, {defaultOutlet?.city} -{' '}
            {defaultOutlet?.postalCode}
          </div>
        </div>
      )}
    </div>
  );
};

const CartGuestCheckout = () => {
  const [availableTime, setAvailableTime] = useState(false);
  const [openOrderingTable, setOpenOrderingTable] = useState(false);
  const responsiveDesign = screen();
  const [showErrorName, setShowErrorName] = useState(false);
  const [showErrorPhone, setShowErrorPhone] = useState(false);
  const [showErrorEmail, setShowErrorEmail] = useState(false);
  const [productSpecific, setProductSpecific] = useState();
  const [valueSearchCode, setValueSearchCode] = useState('');
  const [selectedProductBasketUpdate, setSelectedProductBasketUpdate] =
    useState({});
  const [productDetail, setProductDetail] = useState({});
  const [productEditModal, setProductEditModal] = useState(false);
  const [openDrawerBottom, setOpenDrawerBottom] = useState(false);
  const matches = useMediaQuery('(max-width:1200px)');
  const initialCodePhone = '+65';
  const history = useHistory();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState([]);
  const [idGuestCheckout, setIdGuestCheckout] = useState();
  const [openOrderingMode, setOpenOrderingMode] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(false);
  const [dataDeliveryProvider, setDataDeliveryProvider] = useState('');
  const [dataCalculateFee, setDataCalculateFee] = useState();
  const [openTimeSlot, setOpenTimeSlot] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [phoneCountryCode, setPhoneCountryCode] = useState(initialCodePhone);
  const [isSelectedOrderingMode, setIsSelectedOrderingMode] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const basket = useSelector((state) => state.guestCheckoutCart.data);
  const saveEditResponse = useSelector(
    (state) => state.guestCheckoutCart.saveEditResponse
  );
  const addressTakeAway = useSelector(
    (state) => state.guestCheckoutCart.addressTakeAway
  );

  const providerGuestCheckout = useSelector(
    (state) => state.guestCheckoutCart.providerGuestCheckout
  );
  const color = useSelector((state) => state.theme.color);
  const orderingModeGuestCheckout = useSelector(
    (state) => state.guestCheckoutCart.orderingModeGuestCheckout
  );
  const modalDeliveryAddress = useSelector(
    (state) => state.guestCheckoutCart.modalDeliveryAddress
  );
  const isCartDeleted = useSelector(
    (state) => state.guestCheckoutCart.isCartDeleted
  );
  const itemOrderingMode = useSelector(
    (state) => state.guestCheckoutCart.orderingModeGuestCheckoutObj
  );
  const companyInfo = useSelector((state) => state.masterdata.companyInfo.data);
  const deliveryAddresGuest = useSelector(
    (state) => state.guestCheckoutCart.address
  );
  const defaultOutlet = useSelector((state) => state.outlet.defaultOutlet);
  const date = useSelector((state) => state.guestCheckoutCart.date);
  const timeslot = useSelector((state) => state.guestCheckoutCart.timeslot);
  const time = useSelector((state) => state.guestCheckoutCart.time);
  const noTable = useSelector((state) => state.guestCheckoutCart.noTable);
  const orderingSetting = useSelector((state) => state.order.orderingSetting);

  const loadingData = (role) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(role);
      }, 100);
    });
  };

  useEffect(() => {
    const idGuestCheckout = localStorage.getItem('idGuestCheckout');
    if (idGuestCheckout) {
      setIdGuestCheckout(idGuestCheckout);
    } else {
      history.push('/');
    }
  }, [history]);

  useEffect(() => {
    const clearStateResponse = async () => {
      await dispatch(OrderAction.clearResponse());
    };
    clearStateResponse();
  }, [dispatch]);

  useEffect(() => {
    const fetchBasket = async () => {
      if (idGuestCheckout) {
        setIsLoading(true);
        await dispatch(
          OrderAction.getCartGuestMode(`guest::${idGuestCheckout}`)
        );
        setIsLoading(false);
      }
    };
    fetchBasket();
    setShowErrorName(false);
    setShowErrorPhone(false);
    setShowErrorEmail(false);
  }, [
    idGuestCheckout,
    saveEditResponse,
    orderingModeGuestCheckout,
    isCartDeleted,
    dispatch,
  ]);

  useEffect(() => {
    const getDataProviderListAndFee = async () => {
      if (deliveryAddresGuest?.deliveryAddress) {
        let payload = {
          outletId: basket?.outlet?.id,
          cartID: basket?.cartID,
          deliveryAddress: deliveryAddresGuest?.deliveryAddress,
        };
        if (deliveryAddresGuest) {
          let responseCalculateFee = await dispatch(
            OrderAction.getCalculateFee(payload)
          );
          if (responseCalculateFee) {
            loadingData(responseCalculateFee).then((res) =>
              setDataCalculateFee(res)
            );
          }
        }
      }
    };
    getDataProviderListAndFee();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveryAddresGuest?.deliveryAddress]);

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
        orderingMode: orderingModeGuestCheckout,
      };

      const response = await dispatch(OrderAction.getTimeSlot(payload));
      if (!response) {
        setAvailableTime(false);
      } else {
        setAvailableTime(true);
      }
    };
    getDataTimeSlot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderingModeGuestCheckout]);

  useEffect(() => {
    const checkOrderingMode = async () => {
      if (!isEmptyArray(basket.details)) {
        !orderingModeGuestCheckout
          ? handleOpenOrderingMode()
          : handleNoAvailableOrderingMode();
      }
    };

    checkOrderingMode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basket.details?.length]);

  const [width] = useWindowSize();
  const gadgetScreen = width < 980;

  const styles = {
    containerDataEmpty: {
      width: gadgetScreen ? '100%' : '45%',
      marginLeft: 'auto',
      marginRight: 'auto',
      backgroundColor: 'white',
      height: '99vh',
      borderRadius: '8px',
      boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
      overflowY: 'auto',
    },
    rootCartGadgetSize: {
      paddingLeft: 15,
      paddingRight: 15,
      paddingTop: 100,
      paddingBottom: 300,
    },
    emptyText: {
      marginTop: 10,
      fontSize: 14,
      lineHeight: '17px',
      fontWeight: 600,
      textAlign: 'center',
    },
    rootEmptyCart: {
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 150,
    },
    grandTotalGadgetScreen: {
      width: '100%',
      margin: 0,
      top: 'auto',
      right: 'auto',
      bottom: responsiveDesign.height < 500 ? 0 : 70,
      left: 'auto',
      position: 'fixed',
      paddingTop: '5px',
      paddingBottom: '10px',
      paddingLeft: '16px',
      paddingRight: '16px',
      backgroundColor: color.background,
    },
    grandTotalFullScreen: {
      backgroundColor: color.background,
      marginBottom: '10px',
    },
    rootGrandTotal: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px',
    },

    rootSubmitButton: {
      width: '60%',
      display: 'flex',
      justifyContent: 'end',
      alignItems: 'center',
    },
    rootInclusiveTax: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingLeft: 10,
      paddingRight: 10,
      marginTop: 10,
      opacity: 0.5,
    },
    inclusiveTax: {
      color: '#808080',
      fontSize: 12,
    },
    subTotal: {
      fontWeight: 500,
      fontSize: 16,
    },
    rootSubTotalItem: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingLeft: 10,
      paddingRight: 10,
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

  const myCountryCodesObject = countryCodes.customList(
    'countryCode',
    '{countryNameEn}: +{countryCallingCode}'
  );
  const optionCodePhone = Object.keys(myCountryCodesObject).map(
    (key) => myCountryCodesObject[key]
  );
  optionCodePhone.sort((a, b) => {
    let item = a.substring(a.indexOf(':') + 2);
    if (item === initialCodePhone) {
      return -1;
    } else {
      return 1;
    }
  });
  const filteredPhoneCode = optionCodePhone.filter(
    createFilter(valueSearchCode)
  );

  const validationSchemaForGuestCheckout = yup.object({
    name: yup.string().required('Please enter your Name'),
    phoneNo: yup.number().required('Please enter your Phone Number'),
    email: yup.string().required('Please enter your Email'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema: validationSchemaForGuestCheckout,
    initialValues: {
      name: '',
      phoneNo: '',
      email: '',
    },
    validateOnChange: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      Object.keys(values).forEach((key) => {
        if (values[key] === null || values[key] === '') {
          values[key] = undefined;
        }
      });
      const convertPhoneNumberTostring = values.phoneNo.toString();
      let val = convertPhoneNumberTostring.split();
      val.unshift(phoneCountryCode);

      resetForm();
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'Your address has been saved',
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });
  const validateEmailRegex = /^[\w-.+]+@([\w-]+\.)+[\w-]{2,4}$/;

  let email = formik.values.email?.toLowerCase();
  const formRegexMail = validateEmailRegex.test(email);

  const handlePaymentGuestMode = async () => {
    if (orderingModeGuestCheckout === 'DELIVERY') {
      const objectSubmitCart = {
        cartID: basket.cartID,
        outletID: basket.outletID,
        guestID: basket.guestID,
        customerDetails: {
          name: deliveryAddresGuest.deliveryAddress.name,
          email: deliveryAddresGuest.deliveryAddress.email,
          phoneNumber: deliveryAddresGuest.deliveryAddress.phoneNo,
        },
        payments: [
          {
            paymentType: companyInfo.paymentTypes[0].paymentID,
            paymentID: companyInfo.paymentTypes[0].paymentID,
          },
        ],
        deliveryAddress: deliveryAddresGuest.deliveryAddress,
        orderingMode: orderingModeGuestCheckout,
        tableNo: '-',
        clientTimezone: Math.abs(new Date().getTimezoneOffset()),
        orderActionDate: date ? date : new Date().toISOString().split('T')[0],
        orderActionTime: time
          ? time
          : new Date().getHours() + ':' + new Date().getUTCMinutes(),
        orderActionTimeSlot: timeslot ? timeslot : null,
      };
      setIsLoading(true);
      const response = await dispatch(
        OrderAction.paymentGuestMode(objectSubmitCart)
      );
      setIsLoading(false);
      if (response.resultCode >= 400) {
        Swal.fire({
          title: 'Alert',
          text: response?.data?.message,
          icon: 'error',
          confirmButtonColor: color.primary,
        });
        return;
      }
      if (response.resultCode === 200) {
        window.location.href = response.data.url;
      }
    } else if (
      orderingModeGuestCheckout === 'TAKEAWAY' ||
      orderingModeGuestCheckout === 'DINEIN'
    ) {
      const { name, email } = formik.values;
      if (name === '') {
        setShowErrorName(true);
      } else if (email.length && !formRegexMail) {
        setShowErrorEmail(true);
      } else {
        const objectSubmitCart = {
          cartID: basket.cartID,
          outletID: basket.outletID,
          guestID: basket.guestID,
          customerDetails: {
            name: name,
            email: email,
          },
          payments: [
            {
              paymentType: companyInfo.paymentTypes[0].paymentID,
              paymentID: companyInfo.paymentTypes[0].paymentID,
            },
          ],
          deliveryAddress: {},
          orderingMode: orderingModeGuestCheckout,
          tableNo: noTable || null,
          clientTimezone: Math.abs(new Date().getTimezoneOffset()),
          orderActionDate: date ? date : new Date().toISOString().split('T')[0],
          orderActionTime: time
            ? time
            : new Date().getHours() + ':' + new Date().getMinutes(),
          orderActionTimeSlot: timeslot ? timeslot : null,
        };
        setIsLoading(true);
        const response = await dispatch(
          OrderAction.paymentGuestMode(objectSubmitCart)
        );
        setIsLoading(false);
        if (response.resultCode >= 400) {
          Swal.fire({
            title: 'Alert',
            text: response?.data?.message,
            icon: 'error',
            confirmButtonColor: color.primary,
          });
          return;
        }
        if (response.resultCode === 200) {
          window.location.href = response.data.url;
        }

        setShowErrorName(false);
        setShowErrorEmail(false);
      }
    } else if (orderingModeGuestCheckout === 'STOREPICKUP') {
      const finalVal = () => {
        const convertPhoneNumberTostring = formik.values.phoneNo.toString();
        let val = convertPhoneNumberTostring.split();
        val.unshift(phoneCountryCode);
        return { ...formik.values, phoneNo: val.join('') };
      };
      if (formik.values.name && formik.values.phoneNo && formik.values.email) {
        const objectSubmitCart = {
          cartID: basket.cartID,
          outletID: basket.outletID,
          guestID: basket.guestID,
          customerDetails: {
            name: finalVal().name,
            email: finalVal().email,
            phoneNumber: finalVal().phoneNo,
          },
          payments: [
            {
              paymentType: companyInfo.paymentTypes[0].paymentID,
              paymentID: companyInfo.paymentTypes[0].paymentID,
            },
          ],
          deliveryAddress: {},
          orderingMode: orderingModeGuestCheckout,
          tableNo: '-',
          clientTimezone: Math.abs(new Date().getTimezoneOffset()),
          orderActionDate: date ? date : new Date().toISOString().split('T')[0],
          orderActionTime: time
            ? time
            : new Date().getHours() + ':' + new Date().getMinutes(),
          orderActionTimeSlot: timeslot ? timeslot : null,
        };
        setIsLoading(true);
        const response = await dispatch(
          OrderAction.paymentGuestMode(objectSubmitCart)
        );
        setIsLoading(false);
        if (response.resultCode >= 400) {
          Swal.fire({
            title: 'Alert',
            text: response?.data?.message,
            icon: 'error',
            confirmButtonColor: color.primary,
          });
          return;
        }
        if (response.resultCode === 200) {
          window.location.href = response.data.url;
        }
      }
    }

    localStorage.removeItem(`${config.prefix}_locationPinned`);
  };

  const handleEditItemCart = async (index, itemDetails) => {
    const temp = [...isLoadingEdit];
    temp[index] = true;
    setIsLoadingEdit(temp);

    setSelectedProductBasketUpdate(itemDetails);
    setProductSpecific(itemDetails.product);

    const productById = await dispatch(
      ProductAction.getProductById(
        { outlet: basket?.outlet?.id },
        itemDetails?.product?.id?.split('_')[0]
      )
    );

    setProductDetail(productById);
    temp[index] = false;
    setIsLoadingEdit(temp);
    setProductEditModal(true);
  };
  const handleDeleteItemCart = (itemDetails) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You sure to delete this?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        const response = await dispatch(
          OrderAction.processRemoveCartGuestCheckoutMode(
            basket.guestID,
            itemDetails
          )
        );
        if (response?.resultCode === 200) {
          Swal.fire('Deleted!', response.message, 'success');

          dispatch({
            type: CONSTANT.SAVE_EDIT_RESPONSE_GUESTCHECKOUT,
            payload: {},
          });
          if (basket.details.length === 1) {
            dispatch({
              type: CONSTANT.SET_ORDERING_MODE_GUEST_CHECKOUT,
              payload: '',
            });
            history.push('/');
          }
        } else {
          Swal.fire('Cancelled!', response, 'error');
        }
        setIsLoading(false);
      }
    });
  };
  const handleFilter = (value) => {
    return value === 'TRUE';
  };

  const handleOpenOrderingMode = async (isSelected = true) => {
    setIsLoading(true);
    const intersectOrderingMode = await getIntersectOrderingMode();
    setIsLoading(false);
    if (intersectOrderingMode.length === 1) {
      (!isSelectedOrderingMode || !isSelected) &&
        intersectOrderingMode.forEach(async (item) => {
          await dispatch(
            OrderAction.changeOrderingModeForGuestCheckout({
              guestID: idGuestCheckout,
              orderingMode: item.name,
              provider: {},
            })
          );
          dispatch({
            type: CONSTANT.SET_ORDERING_MODE_GUEST_CHECKOUT,
            payload: item.name,
          });
          dispatch({
            type: CONSTANT.SET_ORDERING_MODE_GUEST_CHECKOUT_OBJ,
            payload: item,
          });
          dispatch({ type: CONSTANT.SAVE_ADDRESS_PICKUP, payload: null });
          dispatch({ type: CONSTANT.SAVE_ADDRESS_TAKEAWAY, payload: null });
          dispatch({
            type: CONSTANT.SAVE_ADDRESS_GUESTMODE,
            payload: { deliveryAddress: null },
          });
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

    const orderingModesFieldFiltered = orderingModesField.filter((mode) =>
      handleFilter(data[mode?.isEnabledFieldName]?.toString()?.toUpperCase())
    );

    const intersectOrderingMode = orderingModesFieldFiltered.filter((mode) =>
      orderingSetting?.AllowedOrderingMode?.some((item) => item === mode.name)
    );

    return intersectOrderingMode;
  };

  const renderTitleNameForCart = () => {
    return (
      <div
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gridTemplateRows: '1fr',
          gap: '0px 0px',
          gridTemplateAreas: '". . ."',
          marginBottom: '20px',
        }}
      >
        <img
          alt='ic_arrow_left'
          src={IconsArrowLeft}
          onClick={() => history.push('/')}
        />
        <div
          style={{
            fontSize: '16px',
            fontWeight: 700,
            justifySelf: 'center',
          }}
          className={fontStyleCustom.myFont}
        >
          Cart
        </div>
      </div>
    );
  };

  const renderLabelNeedAnythingElse = () => {
    return (
      <div
        className={fontStyleCustom.myFont}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #C1C1C1',
          borderTop: '1px solid #C1C1C1',
          margin: '25px -15px 0',
          padding: '15px',
        }}
      >
        <div>
          <div style={{ fontSize: '16px', fontWeight: 700 }}>
            Need anything else?
          </div>
          <div style={{ fontSize: '14px', fontWeight: 500 }}>
            Add other items. if you want.
          </div>
        </div>
        <div>
          <Button
            id='add-more-button'
            onClick={() => history.push('/')}
            startIcon={<img src={addIcon} alt='addIcon' />}
            sx={{
              backgroundColor: color.primary,
              borderRadius: '10px',
              width: '120px',
              height: '40px',
              color: 'white',
              fontSize: '12px',
            }}
          >
            Add More
          </Button>
        </div>
      </div>
    );
  };

  const renderImageProduct = (item) => {
    if (item.product.defaultImageURL) {
      return item.product.defaultImageURL;
    } else {
      if (item.defaultImageURL) {
        return item.defaultImageURL;
      }
      if (color.productPlaceholder) {
        return color.productPlaceholder;
      }
      return config.image_placeholder;
    }
  };

  const handleCurrency = (price) => {
    if (companyInfo) {
      const result = price?.toLocaleString(companyInfo?.currency?.locale, {
        style: 'currency',
        currency: companyInfo?.currency?.code,
      });
      return result;
    }
  };

  const renderPrice = (item, isDisable) => {
    if (item?.totalDiscAmount !== 0) {
      return (
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Typography
            style={{
              color: isDisable ? '#8A8D8E' : color.primary,
              fontSize: '16px',
            }}
          >
            {handleCurrency(item?.totalDiscAmount)}
          </Typography>
          <Typography
            style={{
              fontSize: '16px',
              textDecorationLine: 'line-through',
              marginRight: '10px',
              color: isDisable ? '#8A8D8E' : color.primary,
            }}
          >
            {handleCurrency(item?.grossAmount)}
          </Typography>
        </div>
      );
    }

    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Typography
          style={{
            color: isDisable ? '#8A8D8E' : color.primary,
            fontSize: '16px',
          }}
        >
          {handleCurrency(item?.grossAmount)}
        </Typography>
      </div>
    );
  };

  const renderTextBanner = (text = 'You have unavailable item') => {
    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'flex-start',
          marginTop: '20px',
          flexDirection: 'column',
        }}
      >
        <h1
          style={{
            fontSize: '14px',
            padding: 0,
            margin: 0,
            letterSpacing: '.5px',
            marginLeft: '3px',
            color: 'red',
          }}
        >
          {text}
        </h1>
        <div
          style={{
            display: 'flex',
            marginLeft: '3px',
            alignItems: 'center',
          }}
        >
          {renderIconInformation('red')}
          <p
            style={{
              padding: 0,
              margin: 0,
              color: 'red',
              fontSize: '12px',
              marginLeft: '5px',
            }}
          >
            Item(s) will not be included in your payment
          </p>
        </div>
      </div>
    );
  };

  const renderItemAddOn = (itemDetails, isDisable) => {
    return (
      <React.Fragment>
        <hr style={{ opacity: 0.5 }} />
        <li>
          Add-On:
          {itemDetails?.modifiers?.map((items) => {
            return items?.modifier?.details.map((item) => {
              return (
                <ul key={item?.name} style={{ paddingLeft: '10px' }}>
                  <li>
                    <div
                      style={{
                        display: 'flex',
                        marginTop: '5px',
                      }}
                    >
                      <div
                        style={{
                          color: isDisable ? '#8A8D8E' : color?.primary,
                          fontWeight: 600,
                          marginRight: '2px',
                        }}
                      >
                        {item?.quantity}x{' '}
                      </div>
                      <div
                        style={{
                          color: isDisable ? '#8A8D8E' : `${color?.font}80`,
                          fontWeight: 500,
                          fontSize: '12px',
                        }}
                      >
                        {item?.name}{' '}
                        <span style={{ fontWeight: 'bold' }}>
                          {`(${handleCurrency(item?.price)})`}
                        </span>
                        {item.orderingStatus === 'UNAVAILABLE' && (
                          <span
                            style={{
                              verticalAlign: '-webkit-baseline-middle',
                              marginLeft: '2px',
                            }}
                          >
                            {renderIconInformation('red', '17')}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                </ul>
              );
            });
          })}
        </li>
      </React.Fragment>
    );
  };

  const renderRemark = (itemDetails) => {
    return (
      <li>
        <table>
          <tr>
            <td
              className={fontStyleCustom.title}
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
              <span style={{ fontWeight: 700 }}>Notes: </span>
              {itemDetails?.remark}
            </td>
          </tr>
        </table>
      </li>
    );
  };

  const renderButtonEditDelete = (itemDetails, isDisable, index) => {
    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '90%',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
            }}
          >
            {(!isDisable || !isEmptyArray(itemDetails.modifiers)) && (
              <Button
                id='edit-item-button'
                sx={{
                  width: '80px',
                  border: `1px solid ${color?.primary}`,
                  borderRadius: '10px',
                  padding: '5px 0px',
                  textTransform: 'capitalize',
                  fontSize: '14px',
                  color: color?.primary,
                }}
                onClick={() => handleEditItemCart(index, itemDetails)}
                disabled={isLoadingEdit[index]}
                startIcon={
                  !isLoadingEdit[index] && renderIconEdit(color?.primary)
                }
              >
                {isLoadingEdit[index] ? (
                  <CircularProgress size={25} sx={{ color: color?.primary }} />
                ) : (
                  'Edit'
                )}
              </Button>
            )}
            <div
              id='delete-item-button'
              onClick={() => handleDeleteItemCart(itemDetails)}
              style={{
                marginLeft: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <IconButton
                style={{
                  color: color?.primary,
                  fontSize: '14px',
                  fontWeight: 500,
                  padding: 0,
                  margin: 0,
                  marginRight: '5px',
                }}
              >
                <DeleteIcon fontSize='large' />
              </IconButton>
              <p
                style={{
                  margin: 0,
                  padding: 0,
                  color: color?.primary,
                  fontWeight: 500,
                  fontSize: '14px',
                }}
              >
                Delete
              </p>
            </div>
          </div>
          {renderPrice(itemDetails, isDisable)}
        </div>
      </div>
    );
  };

  const renderItemList = (itemDetails, isDisable, index) => {
    return (
      <div
        key={itemDetails?.id}
        className={fontStyleCustom.myFont}
        style={{
          width: '100%',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
          marginTop: '10px',
          marginBottom: '10px',
          paddingTop: '10px',
          paddingBottom: '10px',
        }}
      >
        <div
          style={{
            pointerEvents: isDisable && 'none',
            maxWidth: 'min(1280px, 100% - 20px)',
            marginLeft: 'auto',
            marginRight: 'auto',
            display: 'grid',
            gridTemplateColumns: '1.6fr 0.4fr',
            gridTemplateRows: '1fr',
            gap: '0px 0px',
            gridTemplateAreas: '". ."',
          }}
        >
          <div style={{ width: '100%' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '8px',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: isDisable ? '#8A8D8E' : color.primary,
                  borderRadius: '5px',
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '5px',
                }}
              >
                {itemDetails?.quantity}x
              </div>
              <div
                style={{
                  fontWeight: 'bold',
                  marginLeft: '5px',
                  fontSize: '14px',
                }}
              >
                {itemDetails?.product.name} ({' '}
                {handleCurrency(itemDetails?.grossAmount)} )
              </div>
            </div>

            <ul
              style={{
                color: '#8A8D8E',
                fontSize: '13px',
                padding: 0,
                margin: 0,
                listStyle: 'none',
              }}
            >
              {!isEmptyArray(itemDetails.modifiers) &&
                renderItemAddOn(itemDetails, isDisable)}

              {itemDetails?.remark && renderRemark(itemDetails)}
            </ul>
          </div>
          <div>
            <img
              alt='logo'
              src={renderImageProduct(itemDetails)}
              className={isDisable ? fontStyleCustom.filter : undefined}
            />
          </div>
        </div>
        <div
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            width: '90%',
            marginTop: '10px',
            borderTop: `1px dashed ${isDisable ? '#8A8D8E' : color.primary}`,
            marginBottom: '10px',
          }}
        />
        {renderButtonEditDelete(itemDetails, isDisable, index)}
      </div>
    );
  };

  const renderCartProductList = () => {
    const isDisable = true;
    return (
      <div>
        <div
          className={fontStyleCustom.myFont}
          style={{ fontSize: '16px', fontWeight: 700 }}
        >
          Items
        </div>
        {basket?.details?.map((itemDetails, index) => {
          if (itemDetails.orderingStatus === 'UNAVAILABLE') {
            if (itemDetails.modifiers.length > 0) {
              return (
                <div key={itemDetails?.id}>
                  {renderTextBanner('Add On Unavailable')}
                  {renderItemList(itemDetails, isDisable, index)}
                </div>
              );
            } else {
              return (
                <div key={itemDetails?.id}>
                  {renderTextBanner('Item Unavailable')}
                  {renderItemList(itemDetails, isDisable, index)}
                </div>
              );
            }
          } else {
            return renderItemList(itemDetails, false, index);
          }
        })}
      </div>
    );
  };

  const renderLabelOrderingDetail = () => {
    return (
      <div style={{ width: '100%', marginTop: '25px' }}>
        <Typography
          style={{ fontSize: '14px', color: 'black', fontWeight: 700 }}
          className={fontStyleCustom.myFont}
        >
          Ordering Details
        </Typography>
      </div>
    );
  };

  const renderOrderingMode = () => {
    return (
      <div
        id='ordering-mode-option'
        onClick={() => handleOpenOrderingMode()}
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
              marginLeft: '0px',
              marginRight: '10px',
            }}
          >
            <Typography
              style={{ fontSize: '13px', color: '#8A8D8E', fontWeight: 500 }}
              className={fontStyleCustom.myFont}
            >
              {!orderingModeGuestCheckout
                ? 'Ordering Mode'
                : orderingModeGuestCheckout}
            </Typography>
            <img
              src={iconRight}
              alt='myIcon'
              style={{ marginLeft: '5px', marginRight: '0px' }}
            />
          </div>
        </div>

        {orderingModeGuestCheckout === 'STOREPICKUP' && (
          <ContainerStorePickUP defaultOutlet={defaultOutlet} />
        )}
      </div>
    );
  };
  const handleDisableBtnDelivery = (isDeliveryActive) => {
    return !isDeliveryActive;
  };
  const handleDisableBtnTakeAway = (isTakeAwayActive) => {
    return !isTakeAwayActive;
  };
  const handleDisableBtnStorePickUp = (isPickUpActive) => {
    return !isPickUpActive;
  };
  const handleDisableBtnDineIn = (isDineInActive) => {
    return !isDineInActive;
  };

  const handleButtonDisable = (key) => {
    const isAllItemUnavailable = basket?.details.every(
      (item) => item.orderingStatus === 'UNAVAILABLE'
    );
    if (isAllItemUnavailable) {
      return isAllItemUnavailable;
    }
    const reqDelivery = deliveryAddresGuest.deliveryAddress;
    const reqProvider = providerGuestCheckout;
    const reqTimeSlot = timeslot;
    const reqAvailableTime = availableTime;
    const requiredForm = formik.values.name;

    const isDeliveryActive = availableTime
      ? reqTimeSlot && reqAvailableTime && reqProvider
      : reqDelivery && reqProvider;

    const isTakeAwayActive = availableTime
      ? requiredForm && reqTimeSlot
      : requiredForm;

    const isPickUpActive = availableTime
      ? requiredForm && reqTimeSlot
      : requiredForm;

    const checkTableNo = defaultOutlet.enableTableNumber ? noTable : true;
    const isDineInActive = availableTime
      ? requiredForm && reqTimeSlot && checkTableNo
      : requiredForm && checkTableNo;

    switch (key) {
      case 'DELIVERY':
        return handleDisableBtnDelivery(isDeliveryActive);
      case 'TAKEAWAY':
        return handleDisableBtnTakeAway(isTakeAwayActive);
      case 'STOREPICKUP':
        return handleDisableBtnStorePickUp(isPickUpActive);
      case 'DINEIN':
        return handleDisableBtnDineIn(isDineInActive);
      default:
        return true;
    }
  };

  const renderButtonDisable = () => {
    return (
      <div style={styles.rootSubmitButton}>
        <Button
          onClick={async () => {
            setIsLoading(true);
            const currentOutlet = await dispatch(
              OutletAction.getOutletById(defaultOutlet.id)
            );
            setIsLoading(false);

            const intersectOrderingMode = await getIntersectOrderingMode();

            const checkOrderingMode = intersectOrderingMode?.find(
              (val) => val.name === itemOrderingMode.name
            );

            if (currentOutlet.orderingStatus === 'UNAVAILABLE') {
              Swal.fire({
                title: `<p style='padding-top: 10px'>The outlet is not available</p>`,
                html: `<h5 style='color:#B7B7B7; font-size:14px'>${defaultOutlet.name} is currently not available, please select another outlet</h5>`,
                width: '40em',
                allowOutsideClick: false,
                confirmButtonText: 'OK',
                confirmButtonColor: color?.primary,
                customClass: {
                  confirmButton: fontStyleCustom.buttonSweetAlert,
                  title: fontStyleCustom.fontTitleSweetAlert,
                },
              }).then(() => {
                history.push('/outlets');
              });
            } else if (intersectOrderingMode.length < 1) {
              modalNoAvailableOrderingMode();
            } else if (!checkOrderingMode) {
              Swal.fire({
                title: `<p style='padding-top: 10px'>Ordering mode is not available</p>`,
                html: `<h5 style='color:#B7B7B7; font-size:14px'>${itemOrderingMode.name} is currently not available, please select another ordering mode</h5>`,
                allowOutsideClick: false,
                width: '40em',
                confirmButtonText: 'OK',
                confirmButtonColor: color?.primary,
                customClass: {
                  confirmButton: fontStyleCustom.buttonSweetAlert,
                  title: fontStyleCustom.fontTitleSweetAlert,
                },
              }).then(() => {
                setIsSelectedOrderingMode(false);
                handleOpenOrderingMode(false);
              });
            } else {
              handlePaymentGuestMode();
            }
          }}
          disabled={handleButtonDisable(orderingModeGuestCheckout)}
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
                padding: '0px 16px',
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

  const renderFormCustomerDetail = () => {
    if (orderingModeGuestCheckout === 'DELIVERY') {
      return (
        <div
          style={{
            width: '100%',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
            marginTop: '10px',
            marginBottom: '10px',
            padding: '20px 0px',
          }}
          onClick={() =>
            dispatch({ type: CONSTANT.MODAL_DELIVERY_ADDRESS, payload: true })
          }
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
              Customer Detail
            </Typography>
            <img src={iconRight} alt='myIcon' style={{ marginRight: '10px' }} />
          </div>
          <div
            style={{
              width: '100%',
              padding: '0px 3px',
            }}
          >
            {deliveryAddresGuest?.deliveryAddress && (
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
                      {deliveryAddresGuest?.deliveryAddress?.name}
                      <span style={{ marginLeft: '5px', marginRight: '5px' }}>
                        |
                      </span>
                      {deliveryAddresGuest?.deliveryAddress?.phoneNo}, <br />
                      {deliveryAddresGuest?.deliveryAddress?.email}
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
                      {deliveryAddresGuest?.deliveryAddress?.address},
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: 0, margin: 0 }}>
                      {deliveryAddresGuest?.deliveryAddress?.unitNo},
                      {deliveryAddresGuest?.deliveryAddress?.postalCode}
                    </td>
                  </tr>
                </table>
              </Typography>
            )}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };
  const handleSelectDeliveryProviderGuest = async (item) => {
    setIsLoading(true);
    dispatch({
      type: CONSTANT.SET_DELIVERY_PROVIDER_GUEST_CHECKOUT,
      payload: item,
    });
    await dispatch(
      OrderAction.changeOrderingModeForGuestCheckout({
        orderingMode: 'DELIVERY',
        provider: item,
        guestID: basket.guestID,
      })
    );
    setIsLoading(false);
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
        <circle cx='64' cy='64' r='64' fill={color?.primary} />
      </svg>
    );
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
          {!deliveryAddresGuest.deliveryAddress
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
                handleSelectDeliveryProviderGuest(item);
                setDataDeliveryProvider(item.name);
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
              {deliveryIcon(color.primary)}

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
    if (deliveryAddresGuest && orderingModeGuestCheckout === 'DELIVERY') {
      return (
        <div
          style={{
            width: '100%',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
            marginTop: '10px',
            marginBottom: '10px',
            padding: '10px',
            display: 'flex',
            justifyContent: 'space-around',
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
    }
  };
  const renderSubtotalForGuestCheckMode = () => {
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
  const renderErrorMessage = (item) => {
    if (item) {
      return (
        <Typography
          className='text text-warning-theme small'
          sx={{
            lineHeight: '15px',
            marginTop: 1,
          }}
        >
          {item}
        </Typography>
      );
    } else {
      return;
    }
  };

  const renderFormTakeAwayAndDineIn = () => {
    const isTakeAway = orderingModeGuestCheckout === 'TAKEAWAY';
    const isDineIn = orderingModeGuestCheckout === 'DINEIN';
    if (isTakeAway || isDineIn) {
      return (
        <div
          style={{
            width: '100%',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
            marginTop: '10px',
            marginBottom: '10px',
            padding: '20px 5px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography
            style={{ fontSize: '14px', color: 'black', fontWeight: 700 }}
            className={fontStyleCustom.myFont}
          >
            Customer Details
          </Typography>

          <form
            onSubmit={formik.handleSubmit}
            autoComplete='off'
            noValidate
            style={{ padding: '0 5px' }}
          >
            <Box sx={{ marginTop: '1rem' }}>
              <Typography
                className={fontStyleCustom.myFont}
                fontSize={12}
                fontWeight='500'
                color='#666'
                marginBottom='10px'
              >
                Name <span className='required'>*</span>
              </Typography>
              <Box
                disabled={isLoading}
                name='name'
                component={InputBase}
                fullWidth
                border='1px solid #ccc'
                borderRadius='7px'
                height={30}
                fontSize='1.2rem'
                margin='dense'
                sx={{
                  paddingX: '1rem',
                  paddingTop: '2rem',
                  paddingBottom: '2rem',
                  marginBottom: '0.5rem',
                  color: 'black',
                }}
                value={formik.values.name || ''}
                size='small'
                placeholder='Your Name'
                onChange={formik.handleChange}
              />
            </Box>
            {showErrorName && renderErrorMessage('Please enter your Name')}

            <Box sx={{ marginTop: '1rem' }}>
              <Typography
                className={fontStyleCustom.myFont}
                fontSize={12}
                fontWeight='500'
                color='#666'
                marginBottom='10px'
              >
                Email
              </Typography>
              <Box
                disabled={isLoading}
                name='email'
                component={InputBase}
                fullWidth
                border='1px solid #ccc'
                borderRadius='7px'
                height={30}
                fontSize='1.2rem'
                margin='dense'
                sx={{
                  paddingX: '1rem',
                  paddingTop: '2rem',
                  paddingBottom: '2rem',
                  marginBottom: '0.5rem',
                }}
                value={formik.values?.email?.toLowerCase() || ''}
                size='small'
                placeholder='Your Email'
                onChange={formik.handleChange}
              />
            </Box>
            <Typography
              className={fontStyleCustom.myFont}
              fontWeight='500'
              color='#8A8D8E'
              marginLeft='16px'
            >
              Please input email if you wish to receive receipt
            </Typography>
            {showErrorEmail &&
              renderErrorMessage('Please enter a valid Email address')}
          </form>
        </div>
      );
    }
  };

  const renderFormPickUpStore = () => {
    const isStorePickUp = orderingModeGuestCheckout === 'STOREPICKUP';
    const nameField = addressTakeAway?.deliveryAddress.name;
    const splitPhoneNo = addressTakeAway?.deliveryAddress.phoneNo;
    const phoneNoField = splitPhoneNo?.split(phoneCountryCode)[1];
    const emailField = addressTakeAway?.deliveryAddress.email;
    if (isStorePickUp) {
      return (
        <div
          style={{
            width: '100%',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
            marginTop: '10px',
            marginBottom: '10px',
            padding: '20px 5px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div>
            <h1 style={{ fontSize: '16px' }}>Customer Detail</h1>
            <div
              style={{
                display: 'flex',
              }}
            >
              <div style={{ width: '30px', paddingTop: '5px' }}>
                <img src={iconSeru} alt='ic_seru' />
              </div>
              <p
                style={{
                  color: '#8A8D8E',
                  margin: 0,
                  padding: 0,
                  fontSize: '14px',
                }}
              >
                We will not collect mobile number and email data from this
                transaction.
              </p>
            </div>
          </div>
          <form
            onSubmit={formik.handleSubmit}
            autoComplete='off'
            noValidate
            style={{ padding: '0 5px' }}
          >
            <Box sx={{ marginTop: '1rem' }}>
              <Typography
                className={fontStyleCustom.myFont}
                fontSize={12}
                fontWeight='500'
                color='#666'
                marginBottom='10px'
              >
                Name <span className='required'>*</span>
              </Typography>
              <Box
                disabled={isLoading}
                name='name'
                component={InputBase}
                fullWidth
                border='1px solid #ccc'
                borderRadius='7px'
                height={30}
                fontSize='1.2rem'
                margin='dense'
                sx={{
                  paddingX: '1rem',
                  paddingTop: '2rem',
                  paddingBottom: '2rem',
                  marginBottom: '0.5rem',
                  fontWeight: nameField && 'bold',
                }}
                value={formik.values.name || ''}
                size='small'
                placeholder={nameField ? nameField : 'Jhon Doe'}
                onChange={formik.handleChange}
              />
            </Box>
            {showErrorName && renderErrorMessage('Please enter your Name')}

            <Box sx={{ marginTop: '1rem' }}>
              <Typography
                className={fontStyleCustom.myFont}
                fontSize={12}
                fontWeight='500'
                color='#666'
              >
                Phone Number <span className='required'>*</span>
              </Typography>
              <div
                style={{
                  border: '1px solid rgba(141, 141, 141, 0.44)',
                  borderRadius: '7px',
                  display: 'flex',
                  marginBottom: '1rem',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <div
                  style={{
                    width: '35%',
                    border: 0,
                    borderRadius: 0,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Dropdown
                    isOpen={dropdownOpen}
                    toggle={toggle}
                    direction='down'
                    className={fontStyleCustom.dropDownMenu}
                    size='100px'
                  >
                    <DropdownToggle
                      style={{
                        width: '100%',
                        backgroundColor: 'transparent',
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        fontWeight: 500,
                        fontSize: '16px',
                        color: 'gray',
                      }}
                    >
                      {phoneCountryCode}
                      <img
                        src={iconDown}
                        style={{ marginLeft: '5px' }}
                        alt='ic_down'
                      />
                    </DropdownToggle>
                    <DropdownMenu
                      style={{
                        width: matches ? '80vw' : '27.5vw',
                        borderRadius: '10px',
                        paddingLeft: '10px',
                        height: '235px',
                        overflowY: 'auto',
                        marginTop: '5px',
                      }}
                    >
                      <div
                        style={{
                          width: '97%',
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid #ddd',
                          borderRadius: '10px',
                          justifyContent: 'space-between',
                          margin: '5px 0px',
                        }}
                      >
                        <div style={{ width: '100%' }}>
                          <SearchInput
                            placeholder='Search for country code'
                            style={{
                              width: '100%',
                              padding: '10px',
                              marginLeft: '5px',
                              border: 'none',
                              outline: 'none',
                            }}
                            onChange={(e) => setValueSearchCode(e)}
                          />
                        </div>
                        <img
                          src={search}
                          style={{ marginRight: '10px' }}
                          alt='ic_search'
                        />
                      </div>
                      {filteredPhoneCode.map((item, i) => {
                        const getPhoneCodeFromStr = item.substring(
                          item.indexOf(':') + 1
                        );
                        return (
                          <DropdownItem
                            style={{
                              cursor: 'pointer',
                              fontFamily: 'Plus Jakarta Sans',
                              color: 'black',
                              fontWeight: 500,
                              fontSize: '16px',
                              padding: '5px 0 0 0',
                              margin: 0,
                              opacity: 0.9,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                            header
                            key={item}
                          >
                            <p
                              style={{
                                padding: '0px 0px 7px 0px',
                                margin: 0,
                                cursor: 'pointer',
                                color: i === 0 ? color.primary : 'black',
                              }}
                              onClick={() => {
                                setPhoneCountryCode(getPhoneCodeFromStr);
                                setDropdownOpen(false);
                              }}
                            >
                              {item}
                            </p>
                            <hr style={{ width: '95%' }} />
                          </DropdownItem>
                        );
                      })}
                    </DropdownMenu>
                  </Dropdown>
                </div>
                <Box
                  disabled={isLoading}
                  name='phoneNo'
                  component={InputBase}
                  fullWidth
                  height={30}
                  fontSize='1.2rem'
                  margin='dense'
                  sx={{
                    paddingTop: '2.5rem',
                    paddingBottom: '2rem',
                    fontWeight: phoneNoField && 'bold',
                  }}
                  value={formik.values.phoneNo || ''}
                  size='small'
                  placeholder={
                    phoneNoField ? phoneNoField : 'eg: +65 xxx xxx xxx'
                  }
                  onChange={formik.handleChange}
                  type='number'
                />
              </div>
            </Box>
            {showErrorPhone &&
              renderErrorMessage('Please enter your PhoneNumber')}
            <Box sx={{ marginTop: '1rem' }}>
              <Typography
                className={fontStyleCustom.myFont}
                fontSize={12}
                fontWeight='500'
                color='#666'
                marginBottom='10px'
              >
                Email <span className='required'>*</span>
              </Typography>
              <Box
                disabled={isLoading}
                name='email'
                component={InputBase}
                fullWidth
                border='1px solid #ccc'
                borderRadius='7px'
                height={30}
                fontSize='1.2rem'
                margin='dense'
                sx={{
                  paddingX: '1rem',
                  paddingTop: '2rem',
                  paddingBottom: '2rem',
                  marginBottom: '0.5rem',
                  fontWeight: emailField && 'bold',
                }}
                value={formik.values.email || ''}
                size='small'
                placeholder={emailField ? emailField : 'jon.doe@gmail.com'}
                onChange={formik.handleChange}
              />
            </Box>
            {showErrorEmail && renderErrorMessage('Please enter your Email')}
          </form>
        </div>
      );
    }
  };

  const renderTimeSlot = () => {
    const isDelivery =
      availableTime && orderingModeGuestCheckout === 'DELIVERY';
    const isPickUp =
      availableTime && orderingModeGuestCheckout === 'STOREPICKUP';
    const isTakeAway =
      availableTime && orderingModeGuestCheckout === 'TAKEAWAY';

    if (isDelivery || isPickUp || isTakeAway) {
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
                  {date}
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
                  {timeslot && `At ${timeslot}`}
                </Typography>
              </div>
              <img src={iconRight} alt='myIcon' style={{ marginLeft: '5px' }} />
            </div>
          </div>
        </div>
      );
    }
  };

  const isUnavailableExist = basket?.details?.some(
    (item) => item.orderingStatus === 'UNAVAILABLE'
  );

  const isOrderingStatusUnavailable = basket?.details?.every(
    (item) => item.orderingStatus === 'UNAVAILABLE'
  );

  const renderTextInformationUnAvailabeItem = () => {
    if (isOrderingStatusUnavailable) {
      return null;
    }
    if (isUnavailableExist) {
      return (
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {renderIconInformation('red')}
          <h1
            style={{
              fontSize: '14px',
              padding: 0,
              margin: 0,
              letterSpacing: '.5px',
              marginLeft: '3px',
              color: color?.primary,
            }}
          >
            You have unavailable item
          </h1>
        </div>
      );
    }
  };

  const renderOutletInfo = () => {
    return (
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid #C1C1C1',
          margin: '0 -15px 20px',
          padding: '0 15px 15px',
        }}
      >
        <div style={{ color: '#9D9D9D' }}>You are ordering from</div>
        <div
          style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}
        >
          <IconPlace stroke={color.primary} />{' '}
          <span style={{ marginLeft: '8px', color: color.primary }}>
            <strong>{defaultOutlet?.name}</strong>
          </span>
        </div>
      </div>
    );
  };

  const renderCartForGuestCheckoutMode = () => {
    if (gadgetScreen) {
      return (
        <>
          <div style={styles.rootCartGadgetSize}>
            {renderTitleNameForCart()}
            {renderOutletInfo()}
            {renderTextInformationUnAvailabeItem()}
            {renderCartProductList()}
            {renderLabelNeedAnythingElse()}
            {renderLabelOrderingDetail()}
            {renderOrderingMode()}
            {orderingModeGuestCheckout === 'DINEIN' &&
              defaultOutlet.enableTableNumber && <RenderTableMode />}
            {renderFormTakeAwayAndDineIn()}
            {renderFormPickUpStore()}
            {renderFormCustomerDetail()}
            {renderDeliveryProvider('Choose Delivery Provider')}
            {renderTimeSlot()}
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
            {renderTitleNameForCart()}
            {renderLabelNeedAnythingElse()}
            {renderTextInformationUnAvailabeItem()}
            {renderCartProductList()}
            <div div style={styles.cartGridRight}>
              {renderLabelOrderingDetail()}
              {renderOrderingMode()}
              {orderingModeGuestCheckout === 'DINEIN' &&
                defaultOutlet.enableTableNumber && <RenderTableMode />}
              {renderFormTakeAwayAndDineIn()}
              {renderFormPickUpStore()}
              {renderFormCustomerDetail()}
              {renderDeliveryProvider('Choose Delivery Provider')}
              {renderTimeSlot()}
            </div>
          </div>
          {renderTotal()}
        </div>
      </div>
    );
  };
  const renderEmptyData = () => {
    return (
      <div style={{ width: '100vw' }}>
        <div style={styles.containerDataEmpty}>
          <div
            style={{
              marginTop: '20%',
              padding: '0px 10px',
            }}
          >
            <img src={config.url_emptyImage} alt='is empty' />
            <Typography style={styles.emptyText}>Data is empty</Typography>
          </div>
        </div>
      </div>
    );
  };
  // ROOT
  const renderCartGuestCheckout = () => {
    if (!isEmptyArray(basket?.details)) {
      return renderCartForGuestCheckoutMode();
    } else {
      return renderEmptyData();
    }
  };

  return (
    <LoadingOverlayCustom active={isLoading} spinner text='Please wait...'>
      {productEditModal && (
        <ProductAddModal
          width={width}
          open={productEditModal}
          handleClose={() => setProductEditModal(false)}
          product={productSpecific}
          selectedProduct={selectedProductBasketUpdate}
          productDetail={productDetail}
        />
      )}
      {openOrderingTable && (
        <OrderingModeTableGuestCO
          gadgetScreen={gadgetScreen}
          open={openOrderingTable}
          onClose={() => setOpenOrderingTable(false)}
          colorState={color}
          defaultOutlet={defaultOutlet}
        />
      )}
      {modalDeliveryAddress && (
        <ModalFormDeliveryCustomerDetail
          modalDeliveryAddress={modalDeliveryAddress}
        />
      )}
      {openOrderingMode && (
        <OrderingModeDialogGuestCheckout
          idGuestCheckout={`guest::${idGuestCheckout}`}
          open={openOrderingMode}
          onClose={() => setOpenOrderingMode(false)}
        />
      )}
      {openTimeSlot && (
        <TimeSlotDialog
          open={openTimeSlot}
          onClose={() => setOpenTimeSlot(false)}
        />
      )}
      <Drawer
        anchor='bottom'
        open={openDrawerBottom}
        onClose={() => setOpenDrawerBottom((prev) => !prev)}
      >
        {renderSubtotalForGuestCheckMode()}
      </Drawer>
      {renderCartGuestCheckout()}
    </LoadingOverlayCustom>
  );
};

export default CartGuestCheckout;
