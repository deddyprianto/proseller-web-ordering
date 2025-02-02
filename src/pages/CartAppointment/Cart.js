import React, { useEffect, useState } from 'react';
import fontStyles from './style/styles.module.css';
import { useSelector, useDispatch } from 'react-redux';
import PlaceIcon from '@mui/icons-material/Place';
import ItemServiceCart from './component/ItemServiceCart';
import { OrderAction } from 'redux/actions/OrderAction';
import LoadingOverlayCustom from 'components/loading/LoadingOverlay';
import Date from './component/Date';
import ServiceStylist from './component/ServiceStylist';
import ButtonPrice from './component/ButtonPrice';
import RenderNotes from './component/RenderNotes';
import Swal from 'sweetalert2';
import Paper from '@mui/material/Paper';
import Time from './component/Time';
import screen from 'hooks/useWindowSize';
import { getDistance } from 'geolib';
import config from 'config';
import { isEmptyArray, isEmptyObject } from 'helpers/CheckEmpty';
import AppointmentHeader from 'components/appointmentHeader';
import { CONSTANT } from 'helpers';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

const Cart = () => {
  const responsiveDesign = screen();
  const dispatch = useDispatch();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [locationKeys, setLocationKeys] = useState([]);
  const useStyles = makeStyles(() => ({
    paper: { minWidth: '350px', overflow: 'hidden' },
  }));
  const classes = useStyles();
  const gadgetScreen = responsiveDesign.width < 980;
  const isOpenModalLeavePage = useSelector(
    (state) => state.appointmentReducer.isOpenModalLeavePage
  );
  const responseSubmit = useSelector(
    (state) => state.appointmentReducer.responseSubmit
  );
  const setting = useSelector((state) => state.order.setting);
  const responseAddCart = useSelector(
    (state) => state.appointmentReducer.responseAddCart
  );
  const timeslot = useSelector((state) => state.appointmentReducer.timeSlot);
  const cartAppointment = useSelector(
    (state) => state.appointmentReducer.cartAppointment
  );
  const color = useSelector((state) => state.theme.color);
  const companyInfo = useSelector((state) => state.masterdata.companyInfo.data);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const menuSidebar = useSelector((state) => state.theme.menu);
  const indexPath = useSelector((state) => state.appointmentReducer.indexPath);

  useEffect(() => {
    if (!isLoggedIn) {
      history.push('/outlets');
    }
  }, [history, isLoggedIn]);

  useEffect(() => {
    if (responseSubmit.error) {
      Swal.fire({
        icon: 'info',
        iconColor: '#333',
        title: responseSubmit.error,
        allowOutsideClick: false,
        confirmButtonText: 'OK',
        confirmButtonColor: color.primary,
        customClass: {
          confirmButton: fontStyles.buttonSweetAlert,
          icon: fontStyles.customIconColor,
        },
      });
    }
  }, [responseSubmit, color.primary]);

  useEffect(() => {
    if (timeslot?.isError) {
      Swal.fire({
        icon: 'info',
        iconColor: '#333',
        title: timeslot?.message,
        allowOutsideClick: false,
        confirmButtonText: 'Go to location page',
        confirmButtonColor: color.primary,
        customClass: {
          confirmButton: fontStyles.buttonSweetAlert,
          icon: fontStyles.customIconColor,
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          history.push('/location');
        }
      });
    }
  }, [timeslot, history, color.primary]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await dispatch(
          OrderAction.getTimeSlotAppointment(cartAppointment.outlet.id)
        );
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    if (!isEmptyObject(cartAppointment)) {
      loadData();
    }
  }, [cartAppointment, dispatch]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await dispatch(OrderAction.getCartAppointment());
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    isLoggedIn && loadData();
  }, [responseAddCart, dispatch, isLoggedIn]);

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
          history.replace('/cartappointment');
        }
      }
    });
  }, [cartAppointment, locationKeys, dispatch, history]);

  let distance = '';
  const locationCustomer = JSON.parse(
    localStorage.getItem(`${config.prefix}_locationCustomer`)
  );
  if (locationCustomer && cartAppointment.outlet?.length) {
    distance = Number(
      (getDistance(locationCustomer, cartAppointment.outlet) / 1000).toFixed(2)
    );
  }
  const settingAppoinment = setting.find((items) => {
    return items.settingKey === 'ShowServicePrice';
  });
  const handleCurrency = (value) => {
    const price = value || 0;
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

  const handleButtonSure = async () => {
    if (cartAppointment?.details?.length > 0) {
      setIsLoading(true);
      await dispatch(OrderAction.deleteCartAppointment());
      setIsLoading(false);
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

  const Timeline = () => {
    if (gadgetScreen) {
      return (
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '33px',
          }}
        >
          <div
            style={{
              width: '77%',
              marginBottom: '10px',
              display: 'flex',
              justifyItems: 'center',
              alignItems: 'center',
            }}
          >
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
              1
            </div>
            <div
              style={{
                minWidth: '126px',
                fontWeight: 600,
                margin: '0 7px',
                color: color.primary,
                fontSize: '14px',
              }}
            >
              Fill Booking Details
            </div>
            <hr
              style={{
                width: '100%',
                padding: 0,
                margin: 0,
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
                backgroundColor: 'rgba(183, 183, 183, 1)',
                color: 'white',
                borderRadius: '100%',
                margin: '0 7px',
              }}
            >
              2
            </div>
            <div
              style={{
                fontWeight: 500,
                color: 'rgba(183, 183, 183, 1)',
              }}
            >
              Conf
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
          <div style={{ width: '25%' }} />
          <div
            style={{
              width: '80%',
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
            }}
          >
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
              1
            </div>
            <div
              style={{
                minWidth: '126px',
                fontWeight: 600,
                margin: '0 7px',
                color: color.primary,
                fontSize: '14px',
              }}
            >
              Fill Booking Details
            </div>
            <hr
              style={{
                width: '100%',
                padding: 0,
                margin: 0,
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
                backgroundColor: 'rgba(183, 183, 183, 1)',
                color: 'white',
                borderRadius: '100%',
                margin: '0 7px',
              }}
            >
              2
            </div>
            <div
              style={{
                fontWeight: 500,
                marginLeft: '4px',
                color: 'rgba(183, 183, 183, 1)',
              }}
            >
              Conf
            </div>
          </div>
        </div>
      );
    }
  };
  const LabelAnythingelse = () => {
    return (
      <div>
        <div
          style={{
            marginTop: '30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'black' }}>
            Anything else?
          </div>
          <div
            onClick={() =>
              (window.location.href = changeFormatURl('/appointment'))
            }
            style={{
              border: `1px solid ${color.primary}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color.primary,
              width: '174px',
              borderRadius: '10px',
              padding: '5px',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            ADD MORE SERVICES
          </div>
        </div>
        <hr
          style={{
            backgroundColor: 'rgba(249, 249, 249, 1)',
            margin: '20px 0px',
          }}
        />
      </div>
    );
  };
  const SelectedOutlet = () => {
    return (
      <div
        style={{
          marginTop: '20px',
        }}
      >
        <div style={{ fontWeight: 'bold', color: 'black', fontSize: '16px' }}>
          Selected Outlet
        </div>
        <div
          style={{
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            padding: '10px 5px',
            borderRadius: '10px',
            width: '100%',
            margin: 'auto',
            display: 'grid',
            gridTemplateColumns: '25px 1fr 100px',
            gridTemplateRows: '1fr',
            gap: '0px 0px',
            gridAutoFlow: 'row',
            gridTemplateAreas: '". . ."',
            cursor: 'pointer',
            marginTop: '10px',
          }}
        >
          <PlaceIcon
            sx={{
              justifySelf: 'end',
              fontSize: '20px',
              marginTop: '5px',
              marginRight: '5px',
            }}
          />
          <div style={{ fontSize: '14px', fontWeight: 500, color: 'black' }}>
            <div>{cartAppointment?.outlet?.name}</div>
            <div style={{ color: 'rgba(157, 157, 157, 1)' }}>
              {cartAppointment?.outlet?.address}
            </div>
          </div>
          <div
            style={{
              fontWeight: 500,
              color: 'rgba(183, 183, 183, 1)',
              fontSize: '14px',
              width: '100%',
              lineHeight: '20px',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            {distance && `${distance}km`}
          </div>
        </div>
        <hr
          style={{
            backgroundColor: 'rgba(249, 249, 249, 1)',
            margin: '20px 0px',
          }}
        />
      </div>
    );
  };
  const Price = () => {
    if (settingAppoinment?.settingValue) {
      return (
        <div
          style={{
            width: '95%',
            margin: 'auto',
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: '10px',
          }}
        >
          <div style={{ fontWeight: 600, fontSize: '16px', color: 'black' }}>
            Estimated Price
          </div>
          <div
            style={{
              fontWeight: 'bold',
              color: color.primary,
              fontSize: '18px',
            }}
          >
            {handleCurrency(cartAppointment?.totalNettAmount)}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };
  const RenderItemService = () => {
    return (
      <div
        style={{
          marginTop: '15px',
        }}
      >
        <p style={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>
          Services
        </p>
        {cartAppointment?.details?.map((item) => (
          <ItemServiceCart
            gadgetScreen={gadgetScreen}
            selectedLocation={cartAppointment?.outlet}
            outletID={cartAppointment?.outlet}
            key={item.id}
            item={item}
            setIsLoading={setIsLoading}
            settingAppoinment={settingAppoinment?.settingValue}
          />
        ))}
        <hr
          style={{
            backgroundColor: 'rgba(249, 249, 249, 1)',
            margin: '20px 0px',
          }}
        />
      </div>
    );
  };
  const RenderNavigationBottom = () => {
    return (
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
                bottom: responsiveDesign.height < 500 ? 0 : 70,
                left: 'auto',
                position: 'fixed',
                padding: '0px 10px',
                backgroundColor: '#F2F2F2',
              }
            : {
                padding: 0,
                margin: 0,
              }
        }
      >
        <Price />
        <ButtonPrice
          changeFormatURl={changeFormatURl}
          color={color}
          cartAppointment={cartAppointment}
        />
      </Paper>
    );
  };

  return (
    <LoadingOverlayCustom active={isLoading} spinner text='Please wait...'>
      {gadgetScreen ? (
        <div className={fontStyles.myFont}>
          <div style={{ paddingTop: '6px' }}>
            <AppointmentHeader
              color={color}
              label='Appointment Booking'
              onBack={() =>
                (window.location.href = changeFormatURl('/appointment'))
              }
            />
            <div
              style={{
                paddingBottom: responsiveDesign.height > 600 ? 200 : 20,
                paddingLeft: '16px',
                paddingRight: '16px',
              }}
            >
              <Timeline />
              <RenderItemService />
              <LabelAnythingelse />
              <SelectedOutlet />
              <Date
                timeslot={!isEmptyArray(timeslot) ? timeslot : []}
                color={color}
                isLoading={isLoading}
              />
              <Time
                messageTimeSlot={timeslot?.isError && timeslot.message}
                timeslot={!isEmptyArray(timeslot) ? timeslot : []}
              />
              <ServiceStylist color={color} />
              <RenderNotes />
            </div>
          </div>
          {responsiveDesign.height > 600 && <RenderNavigationBottom />}
        </div>
      ) : (
        <div className={fontStyles.myFont} style={{ width: '100vw' }}>
          <div
            style={{
              width: '45%',
              marginTop: '10px',
              marginLeft: 'auto',
              marginRight: 'auto',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
              overflowY: 'auto',
              paddingLeft: '16px',
              paddingRight: '16px',
            }}
          >
            <AppointmentHeader
              color={color}
              label='Appointment Booking'
              onBack={() => history.goBack()}
            />
            <Timeline />
            <RenderItemService />
            <LabelAnythingelse />
            <SelectedOutlet />
            <Date
              timeslot={!isEmptyArray(timeslot) ? timeslot : []}
              color={color}
              isLoading={isLoading}
            />
            <Time
              messageTimeSlot={timeslot?.isError && timeslot.message}
              timeslot={!isEmptyArray(timeslot) ? timeslot : []}
            />
            <ServiceStylist color={color} />
            <RenderNotes />
            <Price />
            <ButtonPrice
              changeFormatURl={changeFormatURl}
              color={color}
              cartAppointment={cartAppointment}
            />
          </div>
        </div>
      )}
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

export default Cart;
