import React, { useState, createRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Paper from '@mui/material/Paper';
import Swal from 'sweetalert2';
import { useHistory } from 'react-router-dom';

import fontStyles from './style/styles.module.css';
import loader from './style/styles.module.css';
import { OrderAction } from 'redux/actions/OrderAction';
import AppointmentHeader from 'components/appointmentHeader';
import {
  convertTimeToStr,
  convertFormatDate,
  phonePrefixFormatter,
} from 'helpers/appointmentHelper';
import { CONSTANT } from 'helpers';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import { isEmptyObject } from 'helpers/CheckEmpty';
import LoadingOverlayCustom from 'components/loading/LoadingOverlay';
import { OutletAction } from 'redux/actions/OutletAction';
import { isEmpty } from 'helpers/utils';
import fontStyleCustom from 'pages/GuestCheckout/style/styles.module.css';
import useWindowSize from 'hooks/useWindowSize';

const BookingConfirm = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const ref = createRef();
  const { width } = useWindowSize();
  const gadgetScreen = width < 980;
  const useStyles = makeStyles(() => ({
    paper: { minWidth: '350px', overflow: 'hidden' },
  }));
  const classes = useStyles();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDeleteCart, setIsLoadingDeleteCart] = useState(false);
  const [locationKeys, setLocationKeys] = useState([]);
  const setting = useSelector((state) => state.order.setting);
  const color = useSelector((state) => state.theme.color);
  const companyInfo = useSelector((state) => state.masterdata.companyInfo.data);
  const date = useSelector((state) => state.appointmentReducer.date);
  const time = useSelector((state) => state.appointmentReducer.time);
  const staff = useSelector((state) => state.appointmentReducer.staffID);
  const textNotes = useSelector((state) => state.appointmentReducer.textNotes);
  const cartSave = useSelector((state) => state.appointmentReducer.cartSave);
  const isOpenModalLeavePage = useSelector(
    (state) => state.appointmentReducer.isOpenModalLeavePage
  );
  const menuSidebar = useSelector((state) => state.theme.menu);
  const indexPath = useSelector((state) => state.appointmentReducer.indexPath);
  const cartAppointment = useSelector(
    (state) => state.appointmentReducer.cartAppointment
  );
  useEffect(() => {
    return history.listen((location) => {
      if (history.action === 'PUSH') {
        setLocationKeys([location.pathname]);
        if (
          location.pathname !== '/appointment' &&
          !isEmptyObject(cartAppointment)
        ) {
          dispatch({
            type: CONSTANT.IS_OPEN_MODAL_APPOINTMENT,
            payload: true,
          });
          history.replace('/bookingconfirm');
        }
      }
    });
  }, [cartAppointment, locationKeys, dispatch, history]);

  const handleButtonSure = async () => {
    if (cartAppointment?.details?.length > 0) {
      setIsLoadingDeleteCart(true);
      await dispatch(OrderAction.deleteCartAppointment());
      setIsLoadingDeleteCart(false);
    }
    dispatch({
      type: CONSTANT.IS_OPEN_MODAL_APPOINTMENT,
      payload: false,
    });
    let path;
    menuSidebar.navBar.forEach((item, i) => {
      if (i === indexPath) {
        path = item.path;
      }
    });
    localStorage.removeItem('LOCATION_APPOINTMENT_PERSISTED');
    dispatch({ type: CONSTANT.INDEX_FOOTER, payload: indexPath });
    window.location.href = changeFormatURl(path);
  };

  const handleConfirmButton = async () => {
    if (date && time && staff) {
      const payload = {
        staffId: staff.id,
        bookingTime: time,
        bookingDate: date,
        note: textNotes,
      };
      setIsLoading(true);
      const data = await dispatch(OrderAction.submitCartAppointment(payload));
      setIsLoading(false);
      if (data.message === 'Cart submitted successfully') {
        window.location.href = changeFormatURl('/bookingsubmitted');
      }
    }
  };
  const settingAppoinmentShowPrice = setting.find((items) => {
    return items.settingKey === 'ShowServicePrice';
  });
  const settingAppoinment = setting.find((items) => {
    return items.settingKey === 'EnableAdditionalInfoBookingSummary';
  });

  const handleCurrency = (price) => {
    if (price) {
      const result = price.toLocaleString(companyInfo?.currency?.locale, {
        style: 'currency',
        currency: companyInfo?.currency?.code,
      });

      return result;
    }
  };

  const changeFormatURl = (path) => {
    const url = window.location.href;
    let urlConvert = url.replace(/\/[^/]+$/, path);
    return urlConvert;
  };

  const handleContactUs = async () => {
    const currentOutlet = await dispatch(
      OutletAction.getOutletById(cartSave?.outlet?.id)
    );

    let phoneNumber = currentOutlet?.phoneNo;

    if (isNaN(phoneNumber?.charAt(0))) {
      phoneNumber = phoneNumber?.slice(1);
    }

    if (
      phoneNumber?.charAt(0) === '0' &&
      ![62, 65, 60].some((code) => phoneNumber.startsWith(code.toString()))
    ) {
      const phonePrefix = phonePrefixFormatter(currentOutlet?.countryCode);
      phoneNumber = phonePrefix + phoneNumber.slice(1);
    }

    if (!isEmpty(phoneNumber)) {
      const url = `https://api.whatsapp.com/send?phone=${phoneNumber}`;
      return window.open(url, '_blank');
    } else {
      Swal.fire({
        title: `<p style='padding-top: 10px'>Contact Number Not Available</p>`,
        html: `<h5 style='color:#B7B7B7; font-size:14px'>Sorry, the contact number is not available right now. Please, try again later.</h5>`,
        allowOutsideClick: false,
        confirmButtonColor: color?.primary,
        width: '40em',
        customClass: {
          confirmButton: fontStyleCustom.buttonSweetAlert,
          title: fontStyleCustom.fontTitleSweetAlert,
          container: fontStyles.swalContainer,
        },
      });
    }
  };

  if (performance.getEntriesByType('navigation')[0].type === 'reload') {
    window.location.href = '/';
  }

  const styleSheet = {
    container: {
      width: '45%',
      marginLeft: 'auto',
      marginRight: 'auto',
      backgroundColor: 'white',
      height: '99.3vh',
      borderRadius: '8px',
      boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
      overflowY: 'auto',
      marginTop: '10px',
    },
    gridStyle3Col: {
      display: 'grid',
      gridTemplateColumns: '50px 1fr 50px',
      gridTemplateRows: '1fr',
      gap: '0px 0px',
      gridAutoFlow: 'row',
      gridTemplateAreas: '". . ."',
      cursor: 'pointer',
    },
  };
  const Timeline = () => {
    if (gadgetScreen) {
      return (
        <div
          style={{
            width: '100%',
            display: 'flex',
            marginTop: '33px',
          }}
        >
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyItems: 'center',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                minWidth: '66px',
                color: 'rgba(183, 183, 183, 1)',
                fontWeight: 500,
              }}
            >
              g Details
            </div>
            <hr
              style={{
                width: '100%',
                padding: 0,
                margin: '0 7px',
                backgroundColor: 'rgba(183, 183, 183, 1)',
                height: '1px',
              }}
            />
            <div
              style={{
                minWidth: '24px',
                height: '24px',
                lineHeight: '24px',
                textAlign: 'center',
                backgroundColor: color.primary,
                color: 'white',
                borderRadius: '100%',
              }}
            >
              2
            </div>
            <div
              style={{
                minWidth: '144px',
                fontWeight: 600,
                margin: '0 7px',
                color: color.primary,
                fontSize: '14px',
              }}
            >
              Confirm Your Booking
            </div>
            <hr
              style={{
                width: '100%',
                padding: 0,
                margin: 0,
                backgroundColor: 'rgba(183, 183, 183, 1)',
              }}
            />
            <div
              style={{
                minWidth: '24px',
                height: '24px',
                lineHeight: '24px',
                textAlign: 'center',
                backgroundColor: 'rgba(183, 183, 183, 1)',
                color: 'white',
                borderRadius: '100%',
                margin: '0 7px',
              }}
            >
              3
            </div>
            <div
              style={{
                fontWeight: 500,
                color: 'rgba(183, 183, 183, 1)',
              }}
            >
              Fi
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div
          style={{
            width: '100%',
            marginTop: '25px',
            marginBottom: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
            }}
          >
            <div
              style={{
                minWidth: '58px',
                color: 'rgba(183, 183, 183, 1)',
                fontWeight: 500,
              }}
            >
              g Details
            </div>
            <hr
              style={{
                width: '100%',
                padding: 0,
                margin: '0 7px',
                backgroundColor: 'rgba(183, 183, 183, 1)',
                height: '1px',
              }}
            />
            <div
              style={{
                minWidth: '24px',
                height: '24px',
                lineHeight: '24px',
                textAlign: 'center',
                backgroundColor: color.primary,
                color: 'white',
                borderRadius: '100%',
              }}
            >
              2
            </div>
            <div
              style={{
                minWidth: '144px',
                fontWeight: 600,
                margin: '0 7px',
                color: color.primary,
                fontSize: '14px',
              }}
            >
              Confirm Your Booking
            </div>
            <hr
              style={{
                width: '100%',
                padding: 0,
                margin: 0,
                backgroundColor: 'rgba(183, 183, 183, 1)',
              }}
            />
            <div
              style={{
                minWidth: '24px',
                height: '24px',
                lineHeight: '24px',
                textAlign: 'center',
                backgroundColor: 'rgba(183, 183, 183, 1)',
                color: 'white',
                borderRadius: '100%',
                margin: '0 7px',
              }}
            >
              3
            </div>
            <div
              style={{
                fontWeight: 500,
                marginLeft: '4px',
                color: 'rgba(183, 183, 183, 1)',
              }}
            >
              Fi
            </div>
          </div>
        </div>
      );
    }
  };

  const BookingDetail = () => {
    return (
      <div
        style={{
          width: '93%',
          margin: 'auto',
          marginTop: '20px',
          backgroundColor: `${color.primary}10`,
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          padding: '10px 0px',
        }}
      >
        <div style={{ width: '90%', margin: 'auto', marginTop: '15px' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'black' }}>
            Booking Detail
          </div>
          <div
            style={{
              marginTop: '15px',
              width: '100%',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: '1fr 1fr',
              gridAutoColumns: '1fr',
              gap: '27px 0px',
              gridAutoFlow: 'row',
              gridTemplateAreas: '". ."\n    ". ."\n ',
            }}
          >
            <div>
              <div
                style={{ fontWeight: 600, fontSize: '14px', color: 'black' }}
              >
                Date
              </div>
              <div
                style={{
                  fontWeight: 700,
                  color: color.primary,
                  fontSize: '14px',
                }}
              >
                {convertFormatDate(date)}
              </div>
            </div>
            <div>
              <div
                style={{ fontWeight: 600, fontSize: '14px', color: 'black' }}
              >
                Start Time
              </div>
              <div
                style={{
                  fontWeight: 700,
                  color: color.primary,
                  fontSize: '14px',
                }}
              >
                {time}
              </div>
            </div>
            <div>
              <div
                style={{ fontWeight: 600, fontSize: '14px', color: 'black' }}
              >
                Stylist
              </div>
              <div
                style={{
                  fontWeight: 700,
                  color: color.primary,
                  fontSize: '14px',
                }}
              >
                {staff.name}
              </div>
            </div>
            <div>
              <div
                style={{ fontWeight: 600, fontSize: '14px', color: 'black' }}
              >
                Duration
              </div>
              <div
                style={{
                  fontWeight: 700,
                  color: color.primary,
                  fontSize: '14px',
                }}
              >
                {convertTimeToStr(cartSave.totalDuration)}
              </div>
            </div>
          </div>
          <div
            style={{ width: '100%', marginTop: '20px', marginBottom: '20px' }}
          >
            <div
              style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}
            >
              Outlet
            </div>
            <div
              style={{
                fontWeight: 700,
                fontSize: '14px',
                color: color.primary,
              }}
            >
              {cartSave.outlet.name}
            </div>
            <div
              style={{
                fontWeight: 600,
                color: 'rgba(157, 157, 157, 1)',
                fontSize: '14px',
              }}
            >
              {cartSave.outlet?.address}
            </div>
          </div>
        </div>
      </div>
    );
  };
  const BookingNotes = () => {
    return (
      <div
        style={{
          width: '93%',
          margin: 'auto',
          backgroundColor: `${color.primary}10`,
        }}
      >
        <div style={{ width: '90%', margin: 'auto' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'black' }}>
            Booking Notes
          </div>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: 'black',
            }}
          >
            {textNotes ? textNotes : '-'}
          </div>
        </div>
      </div>
    );
  };
  const ServiceDetail = () => {
    return (
      <div
        style={{
          width: '93%',
          margin: 'auto',
          backgroundColor: `${color.primary}10`,
          borderBottomLeftRadius: '20px',
          borderBottomRightRadius: '20px',
          paddingBottom: '20px',
        }}
      >
        <div style={{ width: '90%', margin: 'auto' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'black' }}>
            Service Detail
          </div>
          {cartSave?.details?.map((item) => (
            <div
              key={item.id}
              style={{
                marginTop: '10px',
                width: '100%',
                display: 'grid',
                gridTemplateColumns: '1fr 100px',
                gridTemplateRows: '1fr',
                gridAutoColumns: '1fr',
                gap: '0px 0px',
                gridAutoFlow: 'row',
                gridTemplateAreas: '". ."',
              }}
            >
              <div
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: 'black',
                }}
              >
                {item.product.name}
              </div>
              <div
                style={{
                  fontWeight: 'bold',
                  justifySelf: 'self-end',
                  color: color.primary,
                  fontSize: '14px',
                }}
              >
                {settingAppoinmentShowPrice?.settingValue
                  ? handleCurrency(item.product.retailPrice)
                  : convertTimeToStr(item.product.duration)}
              </div>
            </div>
          ))}
          <div
            style={{
              marginTop: '10px',
              width: '100%',
              display: 'grid',
              gridTemplateColumns: '1fr 100px',
              gridTemplateRows: '1fr',
              gridAutoColumns: '1fr',
              gap: '0px 0px',
              gridAutoFlow: 'row',
              gridTemplateAreas: '". ."',
            }}
          >
            <div
              style={{
                fontWeight: 600,
                color: 'black',
              }}
            >
              Estimated&nbsp;
              {settingAppoinmentShowPrice?.settingValue ? 'Price' : 'Duration'}
            </div>
            <div
              style={{
                fontWeight: 'bold',
                justifySelf: 'self-end',
                color: color.primary,
              }}
            >
              {settingAppoinmentShowPrice?.settingValue
                ? handleCurrency(cartSave.totalNettAmount)
                : convertTimeToStr(cartSave.totalDuration)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Information = () => {
    if (settingAppoinment?.settingValue) {
      const settingTextInformation = setting.find((items) => {
        return items.settingKey === 'AdditionalInfoBookingSummaryText';
      });
      return (
        <div
          style={{
            width: '93%',
            margin: 'auto',
            marginTop: '20px',
            marginBottom: '20px',
            backgroundColor: `${color.primary}10`,
            borderRadius: '20px',
            padding: '15px 0px',
          }}
        >
          <div style={{ width: '90%', margin: 'auto' }}>
            <div
              style={{ fontSize: '16px', fontWeight: 'bold', color: 'black' }}
            >
              Information
            </div>
            <div
              style={{
                color: 'black',
                fontWeight: 500,
                fontSize: '14px',
                marginTop: '16px',
              }}
              ref={ref}
              dangerouslySetInnerHTML={{
                __html: settingTextInformation?.settingValue,
              }}
            />
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const Price = () => {
    if (settingAppoinmentShowPrice?.settingValue) {
      return (
        <div
          style={{
            width: '93%',
            margin: 'auto',
            marginTop: '10px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ fontWeight: 600, fontSize: '18px', color: 'black' }}>
            Estimated Price
          </div>
          <div
            style={{
              fontWeight: 'bold',
              color: color.primary,
              fontSize: '18px',
            }}
          >
            {handleCurrency(cartSave.totalNettAmount)}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };
  const ButtonPrice = () => {
    if (settingAppoinmentShowPrice?.settingValue) {
      return (
        <div
          onClick={handleConfirmButton}
          style={{
            width: '93%',
            margin: 'auto',
            marginTop: '5px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: color.primary,
            color: 'white',
            borderRadius: '10px',
            padding: '5px',
            fontSize: '14px',
            fontWeight: 600,
            marginBottom: '5px',
          }}
        >
          {isLoading ? (
            <span className={loader.loader}></span>
          ) : (
            'Confirm Booking'
          )}
        </div>
      );
    } else {
      return (
        <div style={{ padding: '10px 0px', width: '99%', margin: 'auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: '1fr',
              gridAutoColumns: '1fr',
              gap: '0px 10px',
              gridAutoFlow: 'row',
              gridTemplateAreas: '". ."',
            }}
          >
            <div
              onClick={() => handleContactUs()}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                border: `1px solid ${color.primary}`,
                color: color.primary,
                borderRadius: '10px',
                padding: '5px',
                fontSize: '14px',
                fontWeight: 600,
                marginBottom: '5px',
              }}
            >
              Contact Us
            </div>
            <div
              onClick={handleConfirmButton}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: color.primary,
                color: 'white',
                borderRadius: '10px',
                padding: '5px',
                fontSize: '14px',
                fontWeight: 600,
                marginBottom: '5px',
              }}
            >
              {isLoading ? (
                <span className={loader.loader}></span>
              ) : (
                'Confirm Booking'
              )}
            </div>
          </div>
          <p
            style={{
              fontSize: '14px',
              fontWeight: 500,
              textAlign: 'center',
              padding: 0,
              margin: 0,
              color: 'black',
            }}
          >
            Please contact us regarding the total payment
          </p>
        </div>
      );
    }
  };
  const RenderHr = () => {
    return (
      <div
        style={{
          width: '93%',
          backgroundColor: `${color.primary}10`,
          padding: '10px 0px',
          margin: 'auto',
          display: 'grid',
          gridTemplateColumns: '50px 1fr 50px',
          gridTemplateRows: '1fr',
          gridAutoColumns: '1fr',
          gap: '0px 0px',
          gridAutoFlow: 'row',
          gridTemplateAreas: '". . ."',
        }}
      >
        <div
          style={{
            width: '30px',
            backgroundColor: 'white',
            height: '37px',
            borderRadius: '100%',
            marginLeft: '-10px',
            color: 'transparent',
          }}
        >
          p
        </div>
        <div style={{ width: '100%', color: 'transparent' }}>p</div>
        <div
          style={{
            justifySelf: 'end',
            width: '30px',
            backgroundColor: 'white',
            height: '37px',
            borderRadius: '100%',
            marginRight: '-10px',
            color: 'transparent',
          }}
        >
          p
        </div>
      </div>
    );
  };
  const RenderMainContent = () => {
    return (
      <div style={{ height: '80vh ', overflowY: 'auto' }}>
        <div
          style={{
            paddingBottom: 200,
          }}
        >
          <BookingDetail />
          <BookingNotes />
          <RenderHr />
          <ServiceDetail />
          <Information />
        </div>
        <Paper
          variant='elevation'
          square={gadgetScreen}
          elevation={0}
          sx={
            gadgetScreen
              ? {
                  zIndex: '999',
                  width: '100%',
                  margin: 0,
                  top: 'auto',
                  right: 'auto',
                  bottom: gadgetScreen.height < 500 ? 0 : 70,
                  left: 'auto',
                  position: 'fixed',
                  padding: '0px 10px',
                  backgroundColor: settingAppoinmentShowPrice?.settingValue
                    ? '#eaeaea'
                    : 'white',
                }
              : {
                  padding: 0,
                  margin: 0,
                }
          }
        >
          <Price />
          <ButtonPrice />
        </Paper>
      </div>
    );
  };
  const ResponsiveLayout = () => {
    if (gadgetScreen) {
      return (
        <div
          className={fontStyles.myFont}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gridTemplateRows: '100px 1fr',
            gridAutoColumns: '1fr',
            gap: '10px',
            gridAutoFlow: 'row',
            gridTemplateAreas: '"."\n    "."',
            paddingTop: '6px',
          }}
        >
          <div>
            <AppointmentHeader
              color={color}
              label='Booking Summary'
              onBack={() =>
                (window.location.href = changeFormatURl('/cartappointment'))
              }
            />
            <Timeline />
          </div>
          <RenderMainContent />
        </div>
      );
    } else {
      return (
        <div className={fontStyles.myFont} style={{ width: '100vw' }}>
          <div style={styleSheet.container}>
            <div style={{ paddingLeft: '16px' }}>
              <AppointmentHeader
                color={color}
                label='Booking Summary'
                onBack={() => history.push('/appointment')}
              />
            </div>
            <Timeline />
            <BookingDetail />
            <BookingNotes />
            <RenderHr />
            <ServiceDetail />
            <Information />
            <div style={{ marginTop: '50px' }}>
              <Price />
              <ButtonPrice />
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <LoadingOverlayCustom
      active={isLoadingDeleteCart}
      spinner
      text='Deleted your cart...'
    >
      <ResponsiveLayout />
      <Dialog
        fullWidth
        maxWidth='xs'
        open={isOpenModalLeavePage}
        onClose={() =>
          dispatch({ type: CONSTANT.IS_OPEN_MODAL_APPOINTMENT, payload: false })
        }
        classes={{ paper: classes.paper }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            marginTop: '15px',
          }}
        ></div>
        <DialogTitle
          className={fontStyles.myFont}
          sx={{
            fontWeight: 600,
            fontSize: '16px',
            textAlign: 'center',
            margin: 0,
            padding: 0,
          }}
        >
          Leaving Appointment Page
        </DialogTitle>
        <hr
          style={{
            backgroundColor: 'rgba(249, 249, 249, 1)',
            height: '2px',
            marginTop: '16px',
          }}
        />
        <div
          className={fontStyles.myFont}
          style={{
            color: 'rgba(183, 183, 183, 1)',
            fontSize: '14px',
            textAlign: 'center',
            fontWeight: 500,
            lineHeight: '21px',
          }}
        >
          Some booked services you have not submitted might not be saved in our
          system. Are you sure?
        </div>
        <hr
          style={{
            backgroundColor: 'rgba(249, 249, 249, 1)',
            height: '2px',
            marginTop: '16px',
          }}
        />
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            width: '100%',
            paddingLeft: '16px',
            paddingRight: '16px',
          }}
        >
          <button
            onClick={() =>
              dispatch({
                type: CONSTANT.IS_OPEN_MODAL_APPOINTMENT,
                payload: false,
              })
            }
            className={fontStyles.myFont}
            style={{
              backgroundColor: 'white',
              border: `1px solid ${color.primary}`,
              color: color.primary,
              width: '50%',
              padding: '6px 0px',
              borderRadius: '10px',
              fontSize: '14px',
              marginRight: '10px',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleButtonSure}
            className={fontStyles.myFont}
            style={{
              color: 'white',
              width: '50%',
              padding: '6px 0px',
              borderRadius: '10px',
              fontSize: '14px',
            }}
          >
            Yes, I’m Sure
          </button>
        </DialogActions>
      </Dialog>
    </LoadingOverlayCustom>
  );
};

export default BookingConfirm;
