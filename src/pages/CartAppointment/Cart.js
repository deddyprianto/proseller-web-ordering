import React, { useEffect, useLayoutEffect, useState } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import fontStyles from './style/styles.module.css';
import { useSelector, useDispatch } from 'react-redux';
import PlaceIcon from '@mui/icons-material/Place';
import DropDownCustomSelect from './component/DropDownCustomSelect';
import ItemServiceCart from './component/ItemServiceCart';
import { OrderAction } from 'redux/actions/OrderAction';
import LoadingOverlayCustom from 'components/loading/LoadingOverlay';
import '../Appointment/style/loadingspin.css';
import { isEmptyObject } from 'helpers/CheckEmpty';
import Date from './component/Date';
import ServiceStylist from './component/ServiceStylist';
import ButtonPrice from './component/ButtonPrice';
import RenderNotes from './component/RenderNotes';

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

const Cart = (props) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [width] = useWindowSize();
  const gadgetScreen = width < 980;
  // some sl
  const locationAppointment = useSelector(
    (state) => state.appointmentReducer.locationAppointment
  );
  const timeslot = useSelector((state) => state.appointmentReducer.timeSlot);
  const defaultOutlet = useSelector((state) => state.outlet.defaultOutlet);
  const responseAddTocart = useSelector(
    (state) => state.appointmentReducer.responseAddTocart
  );
  const cartAppointment = useSelector(
    (state) => state.appointmentReducer.cartAppointment
  );
  const color = useSelector((state) => state.theme.color);
  const companyInfo = useSelector((state) => state.masterdata.companyInfo.data);

  // some Effect
  useEffect(() => {
    const loadData = async () => {
      await dispatch(OrderAction.getTimeSlotAppointment(defaultOutlet.id));
    };
    if (!isEmptyObject(defaultOutlet)) {
      loadData();
    }
  }, [defaultOutlet]);

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
  }, [responseAddTocart]);

  //some fn
  const handleCurrency = (price) => {
    if (price) {
      const result = price.toLocaleString(companyInfo?.currency?.locale, {
        style: 'currency',
        currency: companyInfo?.currency?.code,
      });

      return result;
    }
  };
  const styleSheet = {
    container: {
      width: '40%',
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
  const changeFormatURl = (path) => {
    const url = window.location.href;
    let urlConvert = url.replace(/\/[^/]+$/, path);
    return urlConvert;
  };
  const RenderAnimationLoading = () => {
    return (
      <div className='lds-spinner'>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
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
          marginTop: '20px',
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
            fontSize: '20px',
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
          marginTop: '35px',
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
            width: '75%',
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
              fontWeight: 500,
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
      <div style={{ width: '93%', margin: 'auto' }}>
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
          width: '93%',
          margin: 'auto',
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
          <div style={{ fontWeight: 'bold', color: 'black', fontSize: '16px' }}>
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
            <div>
              {!isEmptyObject(locationAppointment)
                ? locationAppointment.name
                : defaultOutlet.name}
            </div>
            <div style={{ color: 'rgba(157, 157, 157, 1)' }}>
              {!isEmptyObject(locationAppointment)
                ? locationAppointment?.address
                : defaultOutlet?.address}
            </div>
          </div>
          <div></div>
          <div style={{ justifySelf: 'end', fontWeight: 500, color: 'black' }}>
            800m
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

  const Time = () => {
    const date = useSelector((state) => state.appointmentReducer.date);
    const filterTimeSlot = timeslot.find((item) => item.date === date);
    const [timeActive, setTimeActive] = useState('');

    return (
      <div
        style={{
          width: '93%',
          margin: 'auto',
          marginTop: '20px',
          marginBottom: '20px',
        }}
      >
        <p style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
          Select Time
        </p>
        <div style={{ width: '100%' }}>
          <DropDownCustomSelect
            setTimeActive={setTimeActive}
            timeActive={timeActive}
            timeList={filterTimeSlot?.timeSlot}
          />
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
    return (
      <div
        style={{
          width: '93%',
          margin: 'auto',
          marginTop: '20px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ fontWeight: 600, fontSize: '16px', color: 'black' }}>
          Estimated Price
        </div>
        <div
          style={{ fontWeight: 'bold', color: color.primary, fontSize: '18px' }}
        >
          {handleCurrency(cartAppointment?.totalNettAmount)}
        </div>
      </div>
    );
  };
  const RenderItemService = () => {
    return (
      <div
        style={{
          width: '93%',
          margin: 'auto',
          marginTop: '15px',
        }}
      >
        <p style={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>
          Services
        </p>
        {cartAppointment?.details?.map((item) => (
          <ItemServiceCart
            outletID={defaultOutlet}
            key={item.id}
            item={item}
            setIsLoading={setIsLoading}
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
  const ResponsiveLayout = () => {
    if (gadgetScreen) {
      return (
        <div
          className={fontStyles.myFont}
          style={{ height: '90vh', overflowY: 'auto' }}
        >
          <Header />
          <Timeline />
          <RenderItemService />
          <LabelAnythingelse />
          <SelectedOutlet />
          <Date timeslot={timeslot} color={color} />
          <Time />
          <ServiceStylist color={color} />
          <RenderNotes />
          <Price />
          <ButtonPrice changeFormatURl={changeFormatURl} color={color} />
        </div>
      );
    } else {
      return (
        <div className={fontStyles.myFont} style={{ width: '100vw' }}>
          <div style={styleSheet.container}>
            <Header />
            <Timeline />
            <RenderItemService />
            <LabelAnythingelse />
            <SelectedOutlet />
            <Date timeslot={timeslot} color={color} />
            <Time />
            <ServiceStylist color={color} />
            <RenderNotes />
            <Price />
            <ButtonPrice changeFormatURl={changeFormatURl} color={color} />
          </div>
        </div>
      );
    }
  };
  return (
    <LoadingOverlayCustom
      active={isLoading}
      spinner={<RenderAnimationLoading />}
      text='please wait...'
    >
      <ResponsiveLayout />
    </LoadingOverlayCustom>
  );
};

export default Cart;
