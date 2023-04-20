import React, { useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import fontStyles from './style/styles.module.css';
import Paper from '@mui/material/Paper';

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
  const [width] = useWindowSize();
  const gadgetScreen = width < 980;
  const outlet = useSelector((state) => state.outlet.outlets);
  const color = useSelector((state) => state.theme.color);
  const companyInfo = useSelector((state) => state.masterdata.companyInfo.data);
  const responseSubmit = useSelector(
    (state) => state.appointmentReducer.responseSubmit
  );
  // some fn
  const convertFormatDate = (dateStr) => {
    // Create a Date object from the date string
    const date = new window.Date(dateStr);
    // Define an array of month names
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    // Get the month name and day of the month as numbers
    const monthName = months[date.getMonth()];
    const dayOfMonth = date.getDate();

    // Determine the suffix for the day of the month
    let daySuffix;
    if (dayOfMonth % 10 === 1 && dayOfMonth !== 11) {
      daySuffix = 'st';
    } else if (dayOfMonth % 10 === 2 && dayOfMonth !== 12) {
      daySuffix = 'nd';
    } else if (dayOfMonth % 10 === 3 && dayOfMonth !== 13) {
      daySuffix = 'rd';
    } else {
      daySuffix = 'th';
    }

    // Create the formatted date string
    const formattedDate = `${monthName}, ${dayOfMonth}${daySuffix} ${date.getFullYear()}`;

    return formattedDate;
  };
  const SelectedOutlet = outlet.find(
    (item) => `outlet::${item.id}` === responseSubmit.outletId
  );
  const convertTimeToStr = (seconds) => {
    // Calculate the number of hours and minutes
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    // Create the formatted string
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    } else if (minutes > 0) {
      return `${minutes}min`;
    } else {
      return '';
    }
  };
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

  if (performance.getEntriesByType('navigation')[0].type === 'reload') {
    window.location.href = '/'; // replace with the URL of your home page
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
      display: 'grid',
      gridTemplateColumns: '1fr',
      gridTemplateRows: '1fr 85px',
      gap: '0px 15px',
      gridTemplateAreas: '"."\n    "."',
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
          marginTop: gadgetScreen ? '25px' : '0px',
          alignItems: 'center',
          justifyItems: 'center',
        }}
      >
        <ArrowBackIosIcon
          fontSize='large'
          onClick={() => {
            props.history.push('/appointment');
          }}
        />
        <p
          style={{
            padding: 0,
            margin: 0,
            justifySelf: 'start',
            fontWeight: 700,
            fontSize: '20px',
            color: color.primary,
          }}
        >
          Booking Summary
        </p>
      </div>
    );
  };
  const Timeline = () => {
    return (
      <div
        style={{
          width: '100%',
          marginTop: '35px',
          fontSize: '14px',
          display: 'grid',
          gridTemplateColumns: '123px 1fr 99px',
          gridTemplateRows: '1fr',
          gridAutoColumns: '1fr',
          gap: '0px 0px',
          gridAutoFlow: 'row',
          gridTemplateAreas: '". . ."',
          alignItems: 'center',
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
              width: '36px',
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
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <hr
            style={{
              width: '36px',
              padding: 0,
              margin: '0px 3px',
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
  };

  const BookingDetail = () => {
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
                {responseSubmit.serviceTime?.start} -{' '}
                {responseSubmit.serviceTime?.end}
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
              {SelectedOutlet.name}
            </div>
            <div
              style={{
                fontWeight: 600,
                color: 'rgba(157, 157, 157, 1)',
                fontSize: '14px',
              }}
            >
              {SelectedOutlet?.address}
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
            {responseSubmit.note ? responseSubmit.note : '-'}
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
                  fontWeight: 500,
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
                {handleCurrency(item.product.retailPrice)}
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
                fontWeight: 500,
                fontSize: '14px',
                color: 'black',
              }}
            >
              Estimated Price
            </div>
            <div
              style={{
                fontWeight: 'bold',
                justifySelf: 'self-end',
                color: color.primary,
                fontSize: '14px',
              }}
            >
              {handleCurrency(responseSubmit.totalNettAmount)}
            </div>
          </div>
        </div>
      </div>
    );
  };
  const Information = () => {
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
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'black' }}>
            Information
          </div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'black' }}>
            Price & Payment
          </div>
          <ul
            style={{
              fontSize: '14px',
              color: 'black',
              margin: 0,
              marginLeft: '25px',
              fontWeight: 500,
            }}
          >
            <li>Price above is estimation cannot be used as a reference</li>
            <li>This booking can be paid at outlet</li>
            <li>We only accept cashless payment</li>
          </ul>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 600,
              marginTop: '10px',
              color: 'black',
            }}
          >
            Appointment
          </div>
          <ul
            style={{
              fontSize: '14px',
              color: 'black',
              margin: 0,
              marginLeft: '25px',
              fontWeight: 500,
            }}
          >
            <li>Please come 10 minutes before the appointment</li>
            <li>Wearing mask is a must</li>
          </ul>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 600,
              marginTop: '10px',
              color: 'black',
            }}
          >
            Cancellation Policy
          </div>
          <ul
            style={{
              fontSize: '14px',
              color: 'black',
              margin: 0,
              marginLeft: '25px',
              fontWeight: 500,
            }}
          >
            <li>
              If you need to make any changes to your reservation, please
              contact us at least 24 hours in advance.
            </li>
          </ul>
        </div>
      </div>
    );
  };

  const Price = () => {
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
          style={{ fontWeight: 'bold', color: color.primary, fontSize: '18px' }}
        >
          {handleCurrency(responseSubmit?.totalNettAmount)}
        </div>
      </div>
    );
  };
  const ButtonPrice = () => {
    return (
      <div
        onClick={() => {
          window.location.href = changeFormatURl('/bookingsubmitted');
        }}
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
        Confirm Booking
      </div>
    );
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
  const ResponsiveLayout = () => {
    if (gadgetScreen) {
      return (
        <div className={fontStyles.myFont}>
          <div
            style={{
              paddingBottom: 200,
            }}
          >
            <Header />
            <Timeline />
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
                    backgroundColor: '#F2F2F2',
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
    } else {
      return (
        <div className={fontStyles.myFont} style={{ width: '100vw' }}>
          <div style={styleSheet.container}>
            <di
              style={{
                marginTop: '15%',
              }}
            >
              <Header />
              <Timeline />
              <BookingDetail />
              <BookingNotes />
              <RenderHr />
              <ServiceDetail />
              <Information />
              <Price />
              <ButtonPrice />
            </di>
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
