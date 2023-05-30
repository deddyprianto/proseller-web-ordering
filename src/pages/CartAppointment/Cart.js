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
import { isEmptyObject } from 'helpers/CheckEmpty';
import AppointmentHeader from 'components/appointmentHeader';

const Cart = (props) => {
  const responsiveDesign = screen();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const gadgetScreen = responsiveDesign.width < 980;

  const responseSubmit = useSelector(
    (state) => state.appointmentReducer.responseSubmit
  );
  const setting = useSelector((state) => state.order.setting);
  const responseAddCart = useSelector(
    (state) => state.appointmentReducer.responseAddCart
  );
  const messageTimeSlot = useSelector(
    (state) => state.appointmentReducer.messageTimeSlot
  );
  const timeslot = useSelector((state) => state.appointmentReducer.timeSlot);
  const cartAppointment = useSelector(
    (state) => state.appointmentReducer.cartAppointment
  );
  const color = useSelector((state) => state.theme.color);
  const companyInfo = useSelector((state) => state.masterdata.companyInfo.data);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      props.history.push('/outlets');
    }
  }, []);

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
  }, [responseSubmit]);

  useEffect(() => {
    if (messageTimeSlot) {
      Swal.fire({
        icon: 'info',
        iconColor: '#333',
        title: messageTimeSlot,
        allowOutsideClick: false,
        confirmButtonText: 'Go to location page',
        confirmButtonColor: color.primary,
        customClass: {
          confirmButton: fontStyles.buttonSweetAlert,
          icon: fontStyles.customIconColor,
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          props.history.push('/location');
        }
      });
    }
  }, [messageTimeSlot]);

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
  }, [cartAppointment]);

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
  }, [responseAddCart]);

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
              display: 'grid',
              gridTemplateColumns: '1fr 145px 35px 40px 1fr',
              gridTemplateRows: '1fr',
              gap: '0px 0px',
              gridAutoFlow: 'row',
              gridTemplateAreas: '". . . . ."',
              justifyItems: 'center',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '24px',
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
                fontWeight: 600,
                margin: '0px 4px',
                color: color.primary,
                marginLeft: '5px',
                marginRight: '10px',
                fontSize: '14px',
              }}
            >
              Fill Booking Details
            </div>
            <hr
              style={{
                width: '30px',
                padding: 0,
                margin: 0,
                backgroundColor: 'rgba(183, 183, 183, 1)',
                height: '1px',
              }}
            />
            <div
              style={{
                width: '24px',
                height: '24px',
                lineHeight: '24px',
                textAlign: 'center',
                backgroundColor: 'rgba(183, 183, 183, 1)',
                color: 'white',
                borderRadius: '100%',
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
              conf
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
              width: '25%',
            }}
          />
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
                width: '24px',
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
                fontWeight: 600,
                margin: '0px 4px',
                color: color.primary,
              }}
            >
              Fill Booking Details
            </div>
            <hr
              style={{
                width: '40%',
                padding: 0,
                margin: '0px 10px',
                backgroundColor: 'rgba(183, 183, 183, 1)',
                height: '1px',
                opacity: 0.6,
              }}
            />
            <div
              style={{
                width: '24px',
                height: '24px',
                lineHeight: '24px',
                textAlign: 'center',
                backgroundColor: 'rgba(183, 183, 183, 1)',
                color: 'white',
                borderRadius: '100%',
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
              conf
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
            onClick={() => props.history.push('/appointment')}
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
              onBack={() => props.history.goBack()}
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
              <Date timeslot={timeslot} color={color} isLoading={isLoading} />
              <Time messageTimeSlot={messageTimeSlot} timeslot={timeslot} />
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
              onBack={() => props.history.goBack()}
            />
            <Timeline />
            <RenderItemService />
            <LabelAnythingelse />
            <SelectedOutlet />
            <Date timeslot={timeslot} color={color} isLoading={isLoading} />
            <Time />
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
    </LoadingOverlayCustom>
  );
};

export default Cart;
