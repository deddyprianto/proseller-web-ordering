import React, { useLayoutEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import fontStyles from './style/styles.module.css';

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
const BookingConfirm = ({ props }) => {
  const [width] = useWindowSize();
  const gadgetScreen = width < 980;

  const color = useSelector((state) => state.theme.color);

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
            console.log('lol');
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
            fontWeight: 500,
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
              color: color.primary,
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
          borderRadius: '20px',
          padding: '10px 0px',
        }}
      >
        <div style={{ width: '90%', margin: 'auto', marginTop: '15px' }}>
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
              <div style={{ fontWeight: 500, fontSize: '14px' }}>
                Start Time
              </div>
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
      </div>
    );
  };
  const BookingNotes = () => {
    return (
      <div
        style={{
          width: '90%',
          margin: 'auto',
          backgroundColor: `${color.primary}10`,
          borderRadius: '20px',
          padding: '10px 0px',
        }}
      >
        <div style={{ width: '90%', margin: 'auto', marginTop: '15px' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
            Booking Notes
          </div>
          <div style={{ fontSize: '14px', fontWeight: 500, marginTop: '10px' }}>
            At vero eos et accusamus et iusto odio dignios ducimus qui
            blanditiis praesentium voluptat deleniti atque corrupti quos dolores
            et qua
          </div>
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

  const Price = () => {
    return (
      <div
        style={{
          width: '93%',
          margin: 'auto',
          marginTop: '40px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ fontWeight: 600, fontSize: '16px' }}>Estimated Price</div>
        <div
          style={{ fontWeight: 'bold', color: color.primary, fontSize: '16px' }}
        >
          SGD 15.00
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
        Confirm Booking
      </div>
    );
  };

  const ResponsiveLayout = () => {
    if (gadgetScreen) {
      return (
        <div
          className={fontStyles.myFont}
          style={{
            height: '90vh',
            overflowY: 'auto',
          }}
        >
          <Header />
          <Timeline />
          <BookingDetail />
          <BookingNotes />
          <ServiceDetail />
          <Information />
          <Price />
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
              <Header />
              <BookingDetail />
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
