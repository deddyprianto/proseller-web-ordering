import React, { useEffect, useLayoutEffect, useState } from 'react';
import { isEmptyArray } from 'helpers/CheckEmpty';
import { useSelector, useDispatch } from 'react-redux';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import LoadingOverlayCustom from 'components/loading/LoadingOverlay';
import Swal from 'sweetalert2';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

import IconsArrowLeft from 'assets/images/IconsArrowLeft.png';
import circleActive from 'assets/images/bulatActive.png';
import fontStyleCustom from './style/styles.module.css';
import IconDown from 'assets/images/VectorDown.png';
import addIcon from 'assets/images/add.png';
import editIcon from 'assets/images/edit.png';
import iconRight from 'assets/images/iconRight.png';
import iconSeru from 'assets/images/IconsSeru.png';
import iconVespa from 'assets/images/2.png';
import OrderingModeDialogGuestCheckout from 'components/orderingModeDialog/OrderingModeDialogGuestCheckout';
import config from 'config';
import { OrderAction } from 'redux/actions/OrderAction';
import { CONSTANT } from 'helpers';
import TimeSlotDialog from 'components/timeSlot/TimeSlotGuestCo';
import ModalFormDeliveryCustomerDetail from './ModalFormDeliveryCustomerDetail';
import { useFormik } from 'formik';
import * as yup from 'yup';
import InputBase from '@mui/material/InputBase';
import countryCodes from 'country-codes-list';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import Drawer from '@mui/material/Drawer';
import iconDown from 'assets/images/IconDown.png';
import ProductAddModal from 'components/ProductList/components/ProductAddModal';
import SearchInput, { createFilter } from 'react-search-input';
import search from 'assets/images/search.png';

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

const CartGuestCheckout = () => {
  const [productSpecific, setProductSpecific] = useState();
  const [valueSearchCode, setValueSearchCode] = useState('');
  const [productDetailSpesific, setProductDetailSpesific] = useState();
  const [productEditModal, setProductEditModal] = useState(false);
  const [openDrawerBottom, setOpenDrawerBottom] = useState(false);
  const matches = useMediaQuery('(max-width:1200px)');
  const initialCodePhone = '+65';
  const history = useHistory();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [idGuestCheckout, setIdGuestCheckout] = useState();
  const [openOrderingMode, setOpenOrderingMode] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(false);
  const [dataDeliveryProvider, setDataDeliveryProvider] = useState('');
  const [dataCalculateFee, setDataCalculateFee] = useState();
  const [availableTime, setAvailableTime] = useState(false);
  const [openTimeSlot, setOpenTimeSlot] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [phoneCountryCode, setPhoneCountryCode] = useState(initialCodePhone);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  // const styleDrawerPaper = {
  //   '& .MuiDrawer-paper': {
  //     width: !matches ? '50%' : '100%',
  //   },
  // };

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

  const companyInfo = useSelector((state) => state.masterdata.companyInfo.data);
  const deliveryAddresGuest = useSelector(
    (state) => state.guestCheckoutCart.address
  );
  const defaultOutlet = useSelector((state) => state.outlet.defaultOutlet);
  const date = useSelector((state) => state.guestCheckoutCart.date);
  const timeslot = useSelector((state) => state.guestCheckoutCart.timeslot);
  const time = useSelector((state) => state.guestCheckoutCart.time);

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
    }
  }, [localStorage]);

  useEffect(() => {
    const clearStateResponse = async () => {
      await dispatch(OrderAction.clearResponse());
    };
    clearStateResponse();
  }, []);

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
  }, [
    idGuestCheckout,
    refreshData,
    saveEditResponse,
    orderingModeGuestCheckout,
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
  }, [orderingModeGuestCheckout]);

  useEffect(() => {
    const isBasketEmpty = basket.message === 'Cart it empty.';
    if (isBasketEmpty || orderingModeGuestCheckout) {
      setOpenOrderingMode(false);
    } else {
      setOpenOrderingMode(true);
    }
  }, [basket]);

  const [width] = useWindowSize();
  const gadgetScreen = width < 980;

  const styles = {
    rootCartGadgetSize: {
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 100,
      paddingBottom: 300,
    },
    emptyText: {
      marginTop: 10,
      fontSize: 14,
      lineHeight: '17px',
      fontWeight: 600,
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
      bottom: 70,
      left: 'auto',
      position: 'fixed',
      padding: '0px 10px',
      backgroundColor: color.background,
    },
    grandTotalFullScreen: {
      backgroundColor: color.background,
    },
    rootGrandTotal: {
      display: 'flex',
      justifyContent: 'space-between',
    },

    rootSubmitButton: {
      paddingTop: 15,
      paddingRight: 10,
      paddingLeft: 10,
      paddingBottom: 10,
      width: '70%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    rootInclusiveTax: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '5px',
    },
    inclusiveTax: {
      color: '#808080',
      fontSize: 12,
    },
    subTotal: {
      fontWeight: 500,
      color: 'black',
      fontSize: 14,
    },
    rootSubTotalItem: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 10,
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
      const finalValues = { ...values, phoneNo: val.join('') };
      // handleSaveAddressModeGuestCheckout(finalValues);
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

  const validateEmailRegex =
    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
  let email = formik.values.email;
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
      if (response.resultCode === 200) {
        window.location.href = response.data.url;
      }
      setIsLoading(false);
    } else if (orderingModeGuestCheckout === 'TAKEAWAY') {
      const finalVal = () => {
        const convertPhoneNumberTostring = formik.values.phoneNo.toString();
        let val = convertPhoneNumberTostring.split();
        val.unshift(phoneCountryCode);
        return { ...formik.values, phoneNo: val.join('') };
      };
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
      if (response.resultCode === 200) {
        window.location.href = response.data.url;
      }
      setIsLoading(false);
    } else if (orderingModeGuestCheckout === 'STOREPICKUP') {
      const finalVal = () => {
        const convertPhoneNumberTostring = formik.values.phoneNo.toString();
        let val = convertPhoneNumberTostring.split();
        val.unshift(phoneCountryCode);
        return { ...formik.values, phoneNo: val.join('') };
      };
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
      if (response.resultCode === 200) {
        window.location.href = response.data.url;
      }
      setIsLoading(false);
    }
    localStorage.removeItem(`${config.prefix}_locationPinned`);
  };

  const handleSubtotalForGuestCheckout = () => {
    if (basket?.totalDiscountAmount !== 0) {
      const subTotalAfterDiscount =
        basket?.totalGrossAmount - basket.totalDiscountAmount;
      return subTotalAfterDiscount;
    }
    return basket?.totalGrossAmount;
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
        <img src={IconsArrowLeft} onClick={() => history.push('/')} />
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
          marginBottom: '30px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: '16px', fontWeight: 700 }}>
            Need anything else?
          </div>
          <div style={{ fontSize: '14px', fontWeight: 500 }}>
            Add other dishes, if you want.
          </div>
        </div>
        <div>
          <Button
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

  const textItem = () => {
    return (
      <div
        className={fontStyleCustom.myFont}
        style={{
          width: '100%',
          marginBottom: '10px',
          marginTop: '10px',
        }}
      >
        <h1 style={{ fontSize: '16px' }}>Items</h1>
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

  const renderPrice = (item) => {
    if (item?.totalDiscAmount !== 0) {
      return (
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Typography style={{ color: color.font, fontSize: '16px' }}>
            {handleCurrency(item?.totalDiscAmount)}
          </Typography>
          <Typography
            style={{
              fontSize: '16px',
              textDecorationLine: 'line-through',
              marginRight: '10px',
              color: color.font,
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
        <Typography style={{ color: color.primary, fontSize: '16px' }}>
          {handleCurrency(item?.grossAmount)}
        </Typography>
      </div>
    );
  };
  const renderCartProductList = () => {
    return basket?.details.map((itemDetails) => {
      return (
        <div
          key={itemDetails?.productID}
          className={fontStyleCustom.myFont}
          style={{
            width: '100%',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
            marginTop: '10px',
            marginBottom: '10px',
            paddingTop: '10px',
            paddingBottom: '10px',
          }}
        >
          <div
            style={{
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
                    backgroundColor: color.primary,
                    borderRadius: '5px',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
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
                  {itemDetails?.product.name}
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
                <li style={{ marginTop: '10px' }}>
                  {itemDetails?.product.name}
                </li>
                <hr style={{ opacity: 0.5 }} />
                <li>{itemDetails?.product.categoryName}</li>
                <hr style={{ opacity: 0.5 }} />
                <li>
                  Add-On:
                  {itemDetails?.modifiers?.map((items) => {
                    return items?.modifier?.details.map((item) => {
                      return (
                        <ul key={item?.name} style={{ paddingLeft: '10px' }}>
                          <li>
                            <span
                              style={{
                                color: color.primary,
                                fontWeight: 600,
                              }}
                            >
                              {item?.quantity}x{' '}
                            </span>
                            {item?.name}{' '}
                            <span
                              style={{
                                color: color.primary,
                                fontWeight: 500,
                                fontSize: '12px',
                                fontStyle: 'italic',
                              }}
                            >
                              +{handleCurrency(item?.price)}
                            </span>
                          </li>
                        </ul>
                      );
                    });
                  })}
                </li>
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
              </ul>
            </div>
            <div>
              <img src={renderImageProduct(itemDetails)} />
            </div>
          </div>
          <div
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              width: '90%',
              marginTop: '10px',
              borderTop: '1px dashed #4386A1',
              marginBottom: '10px',
            }}
          />
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
                <Button
                  sx={{
                    width: '80px',
                    border: '1px solid #4386A1',
                    borderRadius: '10px',
                    paddingTop: '10px',
                    paddingBottom: '10px',
                    color: color.font,
                  }}
                  onClick={() => {
                    setProductDetailSpesific(itemDetails);
                    setProductSpecific(itemDetails.product);
                    setProductEditModal(true);
                  }}
                  startIcon={<img src={editIcon} />}
                >
                  Edit
                </Button>
                <IconButton
                  style={{
                    color: color.primary,
                  }}
                >
                  <DeleteIcon
                    fontSize='large'
                    onClick={() => {
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
                            setRefreshData(!refreshData);
                            Swal.fire('Deleted!', response.message, 'success');

                            dispatch({
                              type: CONSTANT.SAVE_EDIT_RESPONSE_GUESTCHECKOUT,
                              payload: {},
                            });
                          } else {
                            Swal.fire('Cancelled!', response, 'error');
                          }
                          setIsLoading(false);
                        }
                      });
                    }}
                  />
                </IconButton>
              </div>
              {renderPrice(itemDetails)}
            </div>
          </div>
        </div>
      );
    });
  };

  const renderLabelOrderingDetail = () => {
    return (
      <div style={{ width: '100%', marginTop: '25px' }}>
        <Typography
          style={{ fontSize: '14px', color: 'black', fontWeight: 700 }}
          className={fontStyleCustom.myFont}
        >
          Ordering Detail
        </Typography>
      </div>
    );
  };

  const renderOrderingMode = () => {
    return (
      <div
        onClick={() => setOpenOrderingMode(true)}
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
              {!orderingModeGuestCheckout
                ? 'Ordering Mode'
                : orderingModeGuestCheckout}
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
              style={{ fontSize: '14px', fontWeight: 700, color: '#B7B7B7' }}
            >
              Outlet Address
            </div>
            <div
              style={{ color: '#B7B7B7', fontSize: '14px', fontWeight: 500 }}
            >
              {defaultOutlet?.address}, {defaultOutlet?.city} -{' '}
              {defaultOutlet?.postalCode}
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleButtonDisable = (key) => {
    const reqDelivery = deliveryAddresGuest.deliveryAddress;
    const reqProvider = providerGuestCheckout;
    const reqTimeSlot = timeslot;
    const reqAvailableTime = availableTime;

    const isDeliveryActive = availableTime
      ? reqTimeSlot && reqAvailableTime && reqProvider
      : reqDelivery && reqProvider;

    const isTakeAwayActive = availableTime
      ? formRegexMail && reqTimeSlot
      : formRegexMail;

    const isPickUpActive = availableTime
      ? formRegexMail && reqTimeSlot
      : formRegexMail;

    switch (key) {
      case 'DELIVERY':
        if (isDeliveryActive) {
          return false;
        } else {
          return true;
        }
      case 'TAKEAWAY':
        if (isTakeAwayActive) {
          return false;
        } else {
          return true;
        }
      case 'STOREPICKUP':
        if (isPickUpActive) {
          return false;
        } else {
          return true;
        }
      default:
        return true;
    }
  };

  const renderButtonDisable = () => {
    return (
      <div style={styles.rootSubmitButton}>
        <Button
          onClick={handlePaymentGuestMode}
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

        {basket?.inclusiveTax !== 0 && (
          <div style={styles.rootInclusiveTax}>
            <Typography style={styles.inclusiveTax}>
              Inclusive Tax {handleCurrency(basket?.inclusiveTax)}
            </Typography>
          </div>
        )}
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
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
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
    const response = await dispatch(
      OrderAction.changeOrderingModeForGuestCheckout({
        orderingMode: 'DELIVERY',
        provider: item,
        guestID: basket.guestID,
      })
    );
    console.log(response);
    setIsLoading(false);
  };

  const renderButtonProvider = () => {
    if (!dataCalculateFee) {
      return (
        <Typography
          className={fontStyleCustom.myFont}
          style={{
            color: color.color,
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
    if (deliveryAddresGuest && orderingModeGuestCheckout === 'DELIVERY') {
      return (
        <div
          style={{
            width: '100%',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
            marginTop: '10px',
            marginBottom: '10px',
            padding: '10px',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          <Accordion
            sx={{ boxShadow: 'none' }}
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
          {basket?.provider?.deliveryFee !== 0 && (
            <>
              <div style={styles.rootSubTotalItem}>
                <Typography
                  className={fontStyleCustom.myFont}
                  style={styles.subTotal}
                >
                  Total
                </Typography>
                <Typography
                  className={fontStyleCustom.myFont}
                  style={styles.subTotal}
                >
                  {handleCurrency(basket?.totalGrossAmount)}
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
          {basket?.orderingMode === 'DELIVERY' && (
            <>
              {basket?.provider?.deliveryFee !== 0 && (
                <div style={styles.rootSubTotalItem}>
                  <Typography
                    className={fontStyleCustom.myFont}
                    style={styles.subTotal}
                  >
                    Delivery Cost
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
          {basket?.exclusiveTax !== 0 && (
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
                  {handleCurrency(basket?.exclusiveTax)}
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
          {basket?.totalSurchargeAmount !== 0 && (
            <>
              <div style={styles.rootSubTotalItem}>
                <Typography
                  className={fontStyleCustom.myFont}
                  style={styles.subTotal}
                >
                  Surcharge
                </Typography>
                <Typography
                  className={fontStyleCustom.myFont}
                  style={styles.subTotal}
                >
                  {handleCurrency(basket?.totalSurchargeAmount)}
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

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <p
              style={{
                fontWeight: 500,
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
                color: color.primary,
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

  const renderFormTakeAway = () => {
    const isTakeAway = orderingModeGuestCheckout === 'TAKEAWAY';
    if (isTakeAway) {
      return (
        <div
          style={{
            width: '100%',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
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
                <img src={iconSeru} />
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
                  color: 'black',
                }}
                value={formik.values.name || ''}
                size='small'
                placeholder='Your Name'
                onChange={formik.handleChange}
              />
            </Box>
            {renderErrorMessage(formik.errors.name)}
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
                        color: color.font,
                      }}
                    >
                      {phoneCountryCode}
                      <img src={iconDown} style={{ marginLeft: '5px' }} />
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
                        <img src={search} style={{ marginRight: '10px' }} />
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
                  }}
                  value={formik.values.phoneNo || ''}
                  size='small'
                  placeholder='Phone Number'
                  onChange={formik.handleChange}
                  type='number'
                />
              </div>
            </Box>
            {renderErrorMessage(formik.errors.phoneNo)}
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
                }}
                value={formik.values.email || ''}
                size='small'
                placeholder='Your Email'
                onChange={formik.handleChange}
              />
            </Box>
            {renderErrorMessage(formik.errors.email)}
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
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
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
                <img src={iconSeru} />
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
            {renderErrorMessage(formik.errors.name)}
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
                        color: color.font,
                      }}
                    >
                      {phoneCountryCode}
                      <img src={iconDown} style={{ marginLeft: '5px' }} />
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
                        <img src={search} style={{ marginRight: '10px' }} />
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
            {renderErrorMessage(formik.errors.phoneNo)}
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
            {renderErrorMessage(formik.errors.email)}
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
    return;
  };

  const renderCartForGuestCheckoutMode = () => {
    if (gadgetScreen) {
      return (
        <>
          <div style={styles.rootCartGadgetSize}>
            {renderTitleNameForCart()}
            {renderLabelNeedAnythingElse()}
            {textItem()}
            {renderCartProductList()}
            {renderLabelOrderingDetail()}
            {renderOrderingMode()}
            {renderFormTakeAway()}
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
            width: '40%',
            marginLeft: 'auto',
            marginRight: 'auto',
            backgroundColor: 'white',
            height: '100vh',
            borderRadius: '8px',
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              marginTop: '20%',
              padding: '0px 10px',
            }}
          >
            {renderTitleNameForCart()}
            {renderLabelNeedAnythingElse()}
            {textItem()}
            {renderCartProductList()}
            <div div style={styles.cartGridRight}>
              {renderLabelOrderingDetail()}
              {renderOrderingMode()}
              {renderFormTakeAway()}
              {renderFormPickUpStore()}
              {renderFormCustomerDetail()}
              {renderDeliveryProvider('Choose Delivery Provider')}
              {renderTimeSlot()}
              {renderTotal()}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCartGuestCheckout = () => {
    if (!isEmptyArray(basket?.details)) {
      return (
        <div style={{ width: '100%' }}>{renderCartForGuestCheckoutMode()}</div>
      );
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
      {productEditModal && (
        <ProductAddModal
          width={width}
          open={productEditModal}
          handleClose={() => setProductEditModal(false)}
          product={productSpecific}
          selectedProduct={productDetailSpesific}
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
