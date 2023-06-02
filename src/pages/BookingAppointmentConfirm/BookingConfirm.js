import React, { useLayoutEffect, useState, createRef } from 'react';
import { useSelector } from 'react-redux';
import fontStyles from './style/styles.module.css';
import Paper from '@mui/material/Paper';
import { useDispatch } from 'react-redux';
import loader from './style/styles.module.css';
import { OrderAction } from 'redux/actions/OrderAction';
import AppointmentHeader from 'components/appointmentHeader';
import { convertTimeToStr, convertFormatDate } from 'helpers/appointmentHelper';

import { lsLoad } from 'helpers/localStorage';
import config from 'config';

const encryptor = require('simple-encryptor')(process.env.REACT_APP_KEY_DATA);
const account = encryptor.decrypt(lsLoad(`${config.prefix}_account`, true));

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

const BookingConfirm = (props) => {
  const dispatch = useDispatch();
  const ref = createRef();
  const [width] = useWindowSize();
  const gadgetScreen = width < 980;
  const [isLoading, setIsLoading] = useState(false);
  const setting = useSelector((state) => state.order.setting);
  const color = useSelector((state) => state.theme.color);
  const companyInfo = useSelector((state) => state.masterdata.companyInfo.data);
  const date = useSelector((state) => state.appointmentReducer.date);
  const time = useSelector((state) => state.appointmentReducer.time);
  const staff = useSelector((state) => state.appointmentReducer.staffID);
  const textNotes = useSelector((state) => state.appointmentReducer.textNotes);
  const cartSave = useSelector((state) => state.appointmentReducer.cartSave);

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

  const handleContactUs = () => {
    const phoneNumber = account?.accessToken?.payload?.phone_number?.slice(1);
    const url = `https://api.whatsapp.com/send?phone=${phoneNumber}`;
    return window.open(url, '_blank');
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
            fontSize: '14px',
            display: 'grid',
            gridTemplateColumns: '60px 40px 177px 40px 1fr',
            gridTemplateRows: '1fr',
            gap: '0px 0px',
            gridAutoFlow: 'row',
            gridTemplateAreas: '". . . . ."',
            padding: '0px',
            marginTop: '19px',
            alignItems: 'center',
            justifyItems: 'center',
          }}
        >
          <div style={{ color: 'rgba(183, 183, 183, 1)', fontWeight: 500 }}>
            g Details
          </div>
          <hr
            style={{
              width: '25px',
              padding: 0,
              margin: 0,
              backgroundColor: 'rgba(183, 183, 183, 1)',
            }}
          />
          <div
            style={{
              justifySelf: 'center',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div>
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  lineHeight: '24px',
                  textAlign: 'center',
                  backgroundColor: color.primary,
                  color: 'white',
                  fontWeight: 500,
                  borderRadius: '100%',
                }}
              >
                2
              </div>
            </div>
            <div
              style={{
                fontWeight: 600,
                color: color.primary,
                marginLeft: '5px',
              }}
            >
              Confirm Your Booking
            </div>
          </div>
          <hr
            style={{
              width: '25px',
              padding: 0,
              marginTop: '15px',
              backgroundColor: 'rgba(183, 183, 183, 1)',
            }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '24px',
                height: '24px',
                lineHeight: '24px',
                textAlign: 'center',
                backgroundColor: 'rgba(183, 183, 183, 1)',
                color: 'white',
                borderRadius: '100%',
                fontWeight: 500,
                marginRight: '2px',
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
              Finis
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div
          style={{
            width: '100%',
            fontSize: '14px',
            display: 'grid',
            gridTemplateColumns: '1fr 155px 1fr',
            gridTemplateRows: '1fr',
            gridAutoColumns: '1fr',
            gap: '0px 0px',
            gridAutoFlow: 'row',
            gridTemplateAreas: '". . ."',
            alignItems: 'center',
            padding: '0px',
            marginTop: gadgetScreen ? '30px' : '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ color: 'rgba(183, 183, 183, 1)', fontWeight: 500 }}>
              g Details
            </div>
            <hr
              style={{
                width: '150px',
                padding: 0,
                margin: 0,
                backgroundColor: 'rgba(183, 183, 183, 1)',
              }}
            />
            <div
              style={{
                width: '24px',
                height: '24px',
                lineHeight: '24px',
                textAlign: 'center',
                backgroundColor: color.primary,
                color: 'white',
                fontWeight: 500,
                borderRadius: '100%',
              }}
            >
              2
            </div>
          </div>

          <div
            style={{
              justifySelf: 'center',
              fontWeight: 600,
              margin: '0px',
              color: color.primary,
            }}
          >
            Confirm Your Booking
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: gadgetScreen ? 'center' : 'space-between',
              alignItems: 'center',
            }}
          >
            <hr
              style={{
                width: '170px',
                padding: 0,
                margin: '0px 5px',
                backgroundColor: 'rgba(183, 183, 183, 1)',
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
                fontWeight: 500,
                marginLeft: '4px',
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
              Finis
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
          {cartSave.details.map((item) => (
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
                fontSize: '14px',
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
                fontSize: '14px',
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
            gap: '0px 0px',
            gridAutoFlow: 'row',
            gridTemplateAreas: '"."\n    "."',
            paddingTop: '6px',
          }}
        >
          <div>
            <AppointmentHeader
              color={color}
              label='Booking Summary'
              onBack={() => props.history.push('/appointment')}
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
                onBack={() => props.history.push('/appointment')}
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
    <React.Fragment>
      <ResponsiveLayout />
    </React.Fragment>
  );
};

export default BookingConfirm;
