import React, { useEffect, useLayoutEffect, useState, createRef } from 'react';
import fontStyles from './style/styles.module.css';
import { useSelector, useDispatch } from 'react-redux';
import successsubmit from 'assets/gif/successsubmit.gif';
import Paper from '@mui/material/Paper';
import Confetti from 'react-confetti';
import { CONSTANT } from 'helpers';
import { convertTimeToStr, convertFormatDate } from 'helpers/appointmentHelper';

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

const Timeline = ({ gadgetScreen, color }) => {
  if (gadgetScreen) {
    return (
      <div
        style={{
          marginTop: '40px',
          marginBottom: '10px',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontWeight: 500,
          width: '58%',
        }}
      >
        <div
          style={{
            minWidth: '103px',
            color: 'rgba(183, 183, 183, 1)',
            fontWeight: 500,
          }}
        >
          m Your Booking
        </div>
        <hr
          style={{
            width: '100%',
            padding: 0,
            margin: '0 7px',
            backgroundColor: 'rgba(183, 183, 183, 1)',
          }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
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
              fontWeight: 500,
              borderRadius: '100%',
            }}
          >
            3
          </div>
          <div
            style={{
              marginLeft: '5px',
              color: color.primary,
              fontWeight: 600,
            }}
          >
            Finish
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div
        style={{
          marginTop: '20px',
          width: '58%',
          marginBottom: '10px',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontWeight: 500,
        }}
      >
        <div
          style={{
            minWidth: '103px',
            color: 'rgba(183, 183, 183, 1)',
            fontWeight: 500,
          }}
        >
          m Your Booking
        </div>
        <hr
          style={{
            width: '50%',
            padding: 0,
            margin: '0 7px',
            backgroundColor: 'rgba(183, 183, 183, 1)',
          }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
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
              fontWeight: 500,
              borderRadius: '100%',
            }}
          >
            3
          </div>
          <div
            style={{
              marginLeft: '5px',
              color: color.primary,
              fontWeight: 600,
            }}
          >
            Finish
          </div>
        </div>
      </div>
    );
  }
};
const RenderHr = ({ color }) => {
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

const ButtonPrice = ({ color, dispatch, changeFormatURlBookingSubmitted }) => {
  return (
    <div
      onClick={() => {
        dispatch({
          type: CONSTANT.TAB_STATE_HISTORY,
          payload: 'Appointment',
        });
        dispatch({ type: CONSTANT.INDEX_FOOTER, payload: 1 });
        window.location.href = changeFormatURlBookingSubmitted('/history');
      }}
      style={{
        width: '93%',
        margin: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color.primary,
        color: 'white',
        borderRadius: '10px',
        padding: '5px',
        fontSize: '14px',
        fontWeight: 600,
      }}
    >
      View Booking History
    </div>
  );
};

const BookingSubmitted = () => {
  const dispatch = useDispatch();
  const ref = createRef();
  const [showConfetti, setShowConfetti] = useState(true);
  const [width] = useWindowSize();
  const gadgetScreen = width < 980;

  const setting = useSelector((state) => state.order.setting);
  const color = useSelector((state) => state.theme.color);
  const companyInfo = useSelector((state) => state.masterdata.companyInfo.data);
  const responseSubmit = useSelector(
    (state) => state.appointmentReducer.responseSubmit
  );
  useEffect(() => {
    const cleanUp = setTimeout(() => {
      setShowConfetti(false);
    }, 10000);
    return () => {
      clearTimeout(cleanUp);
    };
  }, []);

  const settingAppoinment = setting.find((items) => {
    return items.settingKey === 'EnableAdditionalInfoBookingSummary';
  });
  const settingAppoinmentShowPrice = setting.find((items) => {
    return items.settingKey === 'ShowServicePrice';
  });

  const handleCurrencyBookingSubmitted = (price) => {
    if (price) {
      const result = price.toLocaleString(companyInfo?.currency?.locale, {
        style: 'currency',
        currency: companyInfo?.currency?.code,
      });

      return result;
    }
  };
  const changeFormatURlBookingSubmitted = (path) => {
    const url = window.location.href;
    let urlConvert = url.replace(/\/[^/]+$/, path);
    return urlConvert;
  };

  if (performance.getEntriesByType('navigation')[0].type === 'reload') {
    window.location.href = '/';
  }

  useEffect(() => {
    const handlePopstate = () => {
      window.location.href = changeFormatURlBookingSubmitted('/history');
    };

    window.addEventListener('popstate', handlePopstate);

    return () => {
      window.removeEventListener('popstate', handlePopstate);
    };
  }, []);

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

  const MessageAndLabel = () => {
    return (
      <div
        style={{
          width: '90%',
          margin: 'auto',
          marginTop: '30px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img src={successsubmit} alt='success' />
        <div
          style={{ fontSize: '22px', fontWeight: 'bold', color: color.primary }}
        >
          Booking Submitted
        </div>
        <div
          style={{
            fontWeight: 500,
            color: 'rgba(183, 183, 183, 1)',
            fontSize: '14px',
            marginTop: '10px',
          }}
        >
          Thank you! Your booking has been submitted!
        </div>
      </div>
    );
  };
  const BookingDetailsubmitted = () => {
    return (
      <div
        style={{
          width: '93%',
          margin: 'auto',
          marginTop: '40px',
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
                {convertFormatDate(responseSubmit.bookingDate)}
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
                {responseSubmit.serviceTime?.start}
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
                {responseSubmit.staff.name}
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
                {convertTimeToStr(responseSubmit?.totalDuration)}
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
              {responseSubmit.outlet.name}
            </div>
            <div
              style={{
                fontWeight: 600,
                color: 'rgba(157, 157, 157, 1)',
                fontSize: '14px',
              }}
            >
              {responseSubmit.outlet?.address}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const BookingNotesSubmitted = () => {
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
            {responseSubmit.note ? responseSubmit.note : '-'}
          </div>
        </div>
      </div>
    );
  };
  const ServiceDetailSubmitted = () => {
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
          {responseSubmit.details.map((item) => (
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
                  ? handleCurrencyBookingSubmitted(item.product.retailPrice)
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
                ? handleCurrencyBookingSubmitted(responseSubmit.totalNettAmount)
                : convertTimeToStr(responseSubmit.totalDuration)}
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

  const RenderMainContent = () => {
    return (
      <div style={{ height: '80vh ', overflowY: 'auto' }}>
        <div
          style={{
            paddingBottom: 100,
          }}
        >
          <MessageAndLabel />
          <BookingDetailsubmitted />
          <BookingNotesSubmitted />
          <RenderHr color={color} />
          <ServiceDetailSubmitted />
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
                  padding: '10px 5px',
                  backgroundColor: 'white',
                }
              : {
                  padding: 0,
                  margin: 0,
                }
          }
        >
          <ButtonPrice
            changeFormatURlBookingSubmitted={changeFormatURlBookingSubmitted}
            color={color}
            dispatch={dispatch}
          />
        </Paper>
      </div>
    );
  };

  const responsiveLayout = () => {
    if (gadgetScreen) {
      return (
        <div
          className={fontStyles.myFont}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gridTemplateRows: '70px 1fr',
            gridAutoColumns: '1fr',
            gap: '0px 0px',
            gridAutoFlow: 'row',
            gridTemplateAreas: '"."\n    "."',
          }}
        >
          <Timeline color={color} gadgetScreen={gadgetScreen} />
          <RenderMainContent />
        </div>
      );
    } else {
      return (
        <div className={fontStyles.myFont} style={{ width: '100vw' }}>
          <div style={styleSheet.container}>
            <Timeline color={color} gadgetScreen={gadgetScreen} />
            <MessageAndLabel />
            <BookingDetailsubmitted />
            <BookingNotesSubmitted />
            <RenderHr color={color} />
            <ServiceDetailSubmitted />
            <Information />
            <ButtonPrice
              changeFormatURlBookingSubmitted={changeFormatURlBookingSubmitted}
              color={color}
              dispatch={dispatch}
            />
          </div>
        </div>
      );
    }
  };

  return (
    <React.Fragment>
      {responsiveLayout()}
      {showConfetti && <Confetti />}
    </React.Fragment>
  );
};

export default BookingSubmitted;
