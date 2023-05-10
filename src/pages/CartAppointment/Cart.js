import React, { useEffect, useLayoutEffect, useState } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import fontStyles from './style/styles.module.css';
import { useSelector, useDispatch } from 'react-redux';
import PlaceIcon from '@mui/icons-material/Place';
import ItemServiceCart from './component/ItemServiceCart';
import { OrderAction } from 'redux/actions/OrderAction';
import LoadingOverlayCustom from 'components/loading/LoadingOverlay';
import { isEmptyArray, isEmptyObject } from 'helpers/CheckEmpty';
import Date from './component/Date';
import ServiceStylist from './component/ServiceStylist';
import ButtonPrice from './component/ButtonPrice';
import RenderNotes from './component/RenderNotes';
import { CONSTANT } from 'helpers';
import Swal from 'sweetalert2';
import Paper from '@mui/material/Paper';
import Time from './component/Time';
import screen from 'hooks/useWindowSize';
import { getDistance } from 'geolib';

const Cart = (props) => {
  const responsiveDesign = screen();
  const dispatch = useDispatch();
  const [getLocationMeters, setGetLocationMeters] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const gadgetScreen = responsiveDesign.width < 980;
  // some sl
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
  const outlet = useSelector((state) => state.outlet.outlets);
  const locationAppointment = useSelector(
    (state) => state.appointmentReducer.locationAppointment
  );
  const timeslot = useSelector((state) => state.appointmentReducer.timeSlot);
  const cartAppointment = useSelector(
    (state) => state.appointmentReducer.cartAppointment
  );
  const color = useSelector((state) => state.theme.color);
  const companyInfo = useSelector((state) => state.masterdata.companyInfo.data);
  // some eff
  useEffect(() => {
    if (
      locationAppointment?.latitude > 0 &&
      locationAppointment?.longitude > 0
    ) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const getMeterLocation = getDistance(
            {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
            {
              latitude: locationAppointment?.latitude,
              longitude: locationAppointment?.longitude,
            }
          );
          setGetLocationMeters(getMeterLocation);
        },
        (error) =>
          console.log(
            `the system wants to access your device's location ${error.message}`
          ),
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, [locationAppointment]);

  useEffect(() => {
    if (!isEmptyArray(outlet)) {
      if (isEmptyObject(locationAppointment)) {
        dispatch({ type: CONSTANT.LOCATION_APPOINTMENT, payload: outlet[0] });
      }
    }
  }, [outlet]);

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
          OrderAction.getTimeSlotAppointment(locationAppointment.id)
        );
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    if (!isEmptyObject(locationAppointment)) {
      loadData();
    }
  }, [locationAppointment]);

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
    loadData();
  }, [responseAddCart]);

  // some fn
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

  const Header = () => {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '50px 1fr 50px',
          gridTemplateRows: '1fr',
          gap: '0px 0px',
          gridAutoFlow: 'row',
          gridTemplateAreas: '". . ."',
          cursor: 'pointer',
          marginTop: '10px',
          marginBottom: '10px',
          alignItems: 'center',
          justifyItems: 'center',
        }}
      >
        <ArrowBackIosIcon
          fontSize='large'
          onClick={() => {
            props.history.goBack();
          }}
        />
        <p
          style={{
            padding: 0,
            margin: 0,
            justifySelf: 'start',
            fontWeight: 700,
            fontSize: '18px',
            color: color.primary,
          }}
        >
          Appointment Booking
        </p>
      </div>
    );
  };

  const Timeline = () => {
    return (
      <div
        style={{
          width: '100%',
          marginTop: '15px',
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
            justifyContent: 'end',
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
              width: '36px',
              padding: 0,
              margin: '0px 3px',
              backgroundColor: 'rgba(183, 183, 183, 1)',
              height: '2px',
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
    if (!isEmptyObject(locationAppointment)) {
      return (
        <div
          style={{
            marginTop: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '14px',
            }}
          >
            <div
              style={{ fontWeight: 'bold', color: 'black', fontSize: '16px' }}
            >
              Selected Outlet
            </div>
            <div
              onClick={() => props.history.push('/location')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: color.primary,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Change Outlet
            </div>
          </div>
          <div
            style={{
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
              padding: '10px 5px',
              borderRadius: '10px',
              width: '100%',
              margin: 'auto',
              display: 'grid',
              gridTemplateColumns: '1fr 250px 1fr 1fr',
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
              <div>{locationAppointment?.name}</div>
              <div style={{ color: 'rgba(157, 157, 157, 1)' }}>
                {locationAppointment?.address}
              </div>
            </div>
            <div></div>
            <div
              style={{
                justifySelf: 'center',
                fontWeight: 500,
                color: 'black',
                fontSize: '14px',
              }}
            >
              {getLocationMeters && `${getLocationMeters}m`}
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
    } else {
      return null;
    }
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
            outletID={locationAppointment}
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
        <ButtonPrice changeFormatURl={changeFormatURl} color={color} />
      </Paper>
    );
  };

  const RenderMainContent = () => {
    return (
      <div style={{ height: '80vh ', overflowY: 'auto' }}>
        <div
          style={{
            paddingBottom: 130,
          }}
        >
          <RenderItemService />
          <LabelAnythingelse />
          <SelectedOutlet />
          <Date timeslot={timeslot} color={color} isLoading={isLoading} />
          <Time messageTimeSlot={messageTimeSlot} timeslot={timeslot} />
          <ServiceStylist color={color} />
          <RenderNotes />
        </div>
        <RenderNavigationBottom />
      </div>
    );
  };

  return (
    <LoadingOverlayCustom active={isLoading} spinner text='Please wait...'>
      {gadgetScreen ? (
        <div className={fontStyles.myFont}>
          <div
            style={{
              paddingBottom: responsiveDesign.height > 600 ? 200 : 20,
              paddingLeft: '16px',
              paddingRight: '16px',
            }}
          >
            <Header />
            <Timeline />
            <RenderItemService />
            <LabelAnythingelse />
            <SelectedOutlet />
            <Date timeslot={timeslot} color={color} isLoading={isLoading} />
            <Time messageTimeSlot={messageTimeSlot} timeslot={timeslot} />
            <ServiceStylist color={color} />
            <RenderNotes />
          </div>
          {responsiveDesign.height > 600 && <RenderNavigationBottom />}
        </div>
      ) : (
        <div className={fontStyles.myFont} style={{ width: '100vw' }}>
          <div
            style={{
              width: '40%',
              marginLeft: 'auto',
              marginRight: 'auto',
              backgroundColor: 'white',
              height: '99.3vh',
              borderRadius: '8px',
              boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
              overflowY: 'auto',
              paddingLeft: '16px',
              paddingRight: '16px',
            }}
          >
            <Header />
            <Timeline />
            <RenderItemService />
            <LabelAnythingelse />
            <SelectedOutlet />
            <Date timeslot={timeslot} color={color} isLoading={isLoading} />
            <Time />
            <ServiceStylist color={color} />
            <RenderNotes />
            <Price />
            <ButtonPrice changeFormatURl={changeFormatURl} color={color} />
          </div>
        </div>
      )}
    </LoadingOverlayCustom>
  );
};

export default Cart;
