import React, { useLayoutEffect, useState } from 'react';
import fontStyles from './style/styles.module.css';
import { useSelector, useDispatch } from 'react-redux';

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
const BookingSubmitted = () => {
  const color = useSelector((state) => state.theme.color);

  const [width] = useWindowSize();
  const gadgetScreen = width < 980;

  const changeFormatURl = (path) => {
    const url = window.location.href;
    let urlConvert = url.replace(/\/[^/]+$/, path);
    return urlConvert;
  };

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

  const IconsReflexology = () => {
    return (
      <svg
        width='18'
        height='18'
        viewBox='0 0 18 18'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M3 13.5C3.41421 13.5 3.75 13.1642 3.75 12.75C3.75 12.3358 3.41421 12 3 12C2.58579 12 2.25 12.3358 2.25 12.75C2.25 13.1642 2.58579 13.5 3 13.5Z'
          stroke={color.primary}
          stroke-width='1.25'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
        <path
          d='M6.75 4.5C7.16421 4.5 7.5 4.16421 7.5 3.75C7.5 3.33579 7.16421 3 6.75 3C6.33579 3 6 3.33579 6 3.75C6 4.16421 6.33579 4.5 6.75 4.5Z'
          stroke={color.primary}
          stroke-width='1.25'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
        <path
          d='M3 16.5L6 15V12.75H15M8.25 15H15M6 10.5L8.25 9L9 6C11.25 6.75 11.25 9 11.25 10.5'
          stroke={color.primary}
          stroke-width='1.25'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
      </svg>
    );
  };
  const Timeline = () => {
    return (
      <div
        style={{
          width: '65%',
          marginTop: '35px',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontWeight: 500,
        }}
      >
        <div style={{ color: 'rgba(183, 183, 183, 1)', fontWeight: 500 }}>
          m Your Booking
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
            2
          </div>
          <div style={{ marginLeft: '10px' }}>Finish</div>
        </div>
      </div>
    );
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
        <IconsReflexology />
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
          Booking Submitted
        </div>
        <div
          style={{
            fontWeight: 500,
            color: 'rgba(183, 183, 183, 1)',
            fontSize: '14px',
          }}
        >
          Thank you! Your booking has been submitted!
        </div>
      </div>
    );
  };
  const BookingDetail = () => {
    return (
      <div style={{ width: '90%', margin: 'auto', marginTop: '40px' }}>
        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
          Booking Detail
        </div>
        <div
          style={{
            marginTop: '15px',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr 1fr 1fr',
            gridAutoColumns: '1fr',
            gap: '0px 0px',
            gridAutoFlow: 'row',
            gridTemplateAreas: '". ."\n    ". ."\n    "end-col end-col"',
          }}
        >
          <div>
            <div style={{ fontWeight: 500, fontSize: '14px' }}>Date</div>
            <div
              style={{
                fontWeight: 700,
                color: color.primary,
                fontSize: '14px',
              }}
            >
              January, 09th 2023
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 500, fontSize: '14px' }}>Start Time</div>
            <div
              style={{
                fontWeight: 700,
                color: color.primary,
                fontSize: '14px',
              }}
            >
              14:30
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 500, fontSize: '14px' }}>Stylist</div>
            <div
              style={{
                fontWeight: 700,
                color: color.primary,
                fontSize: '14px',
              }}
            >
              Cody Fisher
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 500, fontSize: '14px' }}>Duration</div>
            <div
              style={{
                fontWeight: 700,
                color: color.primary,
                fontSize: '14px',
              }}
            >
              90 Minutes
            </div>
          </div>
          <div style={{ gridArea: 'end-col' }}>
            <div style={{ fontWeight: 500, fontSize: '14px' }}>Outlet</div>
            <div
              style={{
                fontWeight: 700,
                fontSize: '14px',
                color: color.primary,
              }}
            >
              Connection One
            </div>
            <div
              style={{
                fontWeight: 700,
                color: 'rgba(157, 157, 157, 1)',
                fontSize: '14px',
              }}
            >
              169 Bukit Merah Central, Singapore
            </div>
          </div>
        </div>
      </div>
    );
  };

  const BookingNotes = () => {
    return (
      <div style={{ width: '90%', margin: 'auto', marginTop: '40px' }}>
        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
          Booking Notes
        </div>
        <div style={{ fontSize: '14px', fontWeight: 500, marginTop: '10px' }}>
          At vero eos et accusamus et iusto odio dignios ducimus qui blanditiis
          praesentium voluptat deleniti atque corrupti quos dolores et qua
        </div>
      </div>
    );
  };

  const ServiceDetail = () => {
    const name = [
      {
        name: 'Finishing Short Hair Cut Title Goes in Finishing Short Hair Cut Title Goes in',
        price: 'SGD 15.00',
      },
      { name: 'Big Bouncy Blow-Dry', price: 'SGD 15.00' },
      { name: 'Estimated Price', price: 'SGD 15.00' },
    ];
    return (
      <div
        style={{
          width: '90%',
          margin: 'auto',
          marginTop: '40px',
        }}
      >
        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
          Service Detail
        </div>
        {name.map((item) => (
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
              }}
            >
              {item.name}
            </div>
            <div
              style={{
                fontWeight: 'bold',
                justifySelf: 'self-end',
                color: color.primary,
                fontSize: '14px',
              }}
            >
              {item.price}
            </div>
          </div>
        ))}
      </div>
    );
  };
  const Information = () => {
    return (
      <div
        style={{
          width: '90%',
          margin: 'auto',
          marginTop: '40px',
          marginBottom: '20px',
        }}
      >
        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Information</div>
        <div style={{ fontSize: '14px', fontWeight: 600 }}>Price & Payment</div>
        <ul
          style={{
            fontSize: '14px',
            color: color.primary,
            margin: 0,
            marginLeft: '25px',
            fontWeight: 500,
          }}
        >
          <li>Price above is estimation cannot be used as a reference</li>
          <li>This booking can be paid at outlet</li>
          <li>We only accept cashless payment</li>
        </ul>
        <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '10px' }}>
          Appointment
        </div>
        <ul
          style={{
            fontSize: '14px',
            color: color.primary,
            margin: 0,
            marginLeft: '25px',
            fontWeight: 500,
          }}
        >
          <li>Please come 10 minutes before the appointment</li>
          <li>Wearing mask is a must</li>
        </ul>
        <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '10px' }}>
          Cancellation Policy
        </div>
        <ul
          style={{
            fontSize: '14px',
            color: color.primary,
            margin: 0,
            marginLeft: '25px',
            fontWeight: 500,
          }}
        >
          <li>
            If you need to make any changes to your reservation, please contact
            us at least 24 hours in advance.
          </li>
        </ul>
      </div>
    );
  };

  const ButtonPrice = () => {
    return (
      <div
        onClick={() => {
          window.location.href = changeFormatURl('/history');
        }}
        style={{
          width: '93%',
          margin: 'auto',
          marginTop: '20px',
          marginBottom: '20px',
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

  const ResponsiveLayout = () => {
    if (gadgetScreen) {
      return (
        <div
          className={fontStyles.myFont}
          style={{ height: '90vh', overflowY: 'auto' }}
        >
          <Timeline />
          <MessageAndLabel />
          <BookingDetail />
          <BookingNotes />
          <ServiceDetail />
          <Information />
          <ButtonPrice />
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
              <Timeline />
            </di>
          </div>
        </div>
      );
    }
  };

  return (
    <div>
      <ResponsiveLayout />
    </div>
  );
};

export default BookingSubmitted;
