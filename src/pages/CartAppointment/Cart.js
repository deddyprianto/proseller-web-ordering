import React, { useEffect, useLayoutEffect, useState } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import fontStyles from './style/styles.module.css';
import { useSelector, useDispatch } from 'react-redux';
import PlaceIcon from '@mui/icons-material/Place';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';
import 'swiper/swiper.scss';
import DropDownCustomSelect from './component/DropDownCustomSelect';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import ItemServiceCart from './component/ItemServiceCart';
import { OrderAction } from 'redux/actions/OrderAction';
import LoadingOverlayCustom from 'components/loading/LoadingOverlay';
import '../Appointment/style/loadingspin.css';
import { isEmptyObject } from 'helpers/CheckEmpty';
import moment from 'moment';
import SeeMoreDate from './component/SeeMoreDate';
import { CONSTANT } from 'helpers';

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
  const [selectTimeDropDown, setSelectTimeDropDown] = useState('');
  const useStyless = makeStyles(() => ({
    paper: { minWidth: '340px', borderRadius: '100px' },
  }));
  const classes = useStyless();
  const [width] = useWindowSize();
  const gadgetScreen = width < 980;
  // some sl
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

  // some fn
  const getDateNow = () => {
    const now = new window.Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };

  const changeFormatDate = (itemDate) => {
    return itemDate.split(' ').join('-');
  };
  const getAllDate = () => {
    let monthArr = [];
    const weeks = moment().add(0, 'weeks').startOf('week');
    for (let i = 0; i < 150; i++) {
      monthArr.push(weeks.clone().add(i, 'day').format('YYYY MM DD'));
    }

    const dateNow = new window.Date();
    dateNow.setHours(0, 0, 0, 0);
    let timeStamp = new window.Date(dateNow).getTime();
    const listDate = monthArr.filter(
      (item) => new window.Date(item).getTime() >= timeStamp
    );
    return listDate;
  };
  const convertDateName = (dateStr) => {
    const date = new window.Date(dateStr);
    const dayOfWeek = date.getDay();
    const weekdays = ['sun', 'mon', 'tue', 'wed', 'thurs', 'fri', 'sat'];
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const dayOfMonth = date.getDate().toString().padStart(2, '0');
    return weekdays[dayOfWeek];
  };
  const convertDate = (dateStr) => {
    const date = new window.Date(dateStr);
    const dayOfWeek = date.getDay();
    const weekdays = ['sun', 'mon', 'tue', 'wed', 'thurs', 'fri', 'sat'];
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const dayOfMonth = date.getDate().toString().padStart(2, '0');
    return dayOfMonth;
  };
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
          marginTop: gadgetScreen ? '25px' : '0px',
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
            <div>Connection One</div>
            <div style={{ color: 'rgba(157, 157, 157, 1)' }}>
              169 Bukit Merah Central, Singapore
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

  const Date = () => {
    // //   dispatch({
    //   type: CONSTANT.DATE_APPOINTMENT,
    //   payload: changeFormatDate(item),
    // });

    const date = useSelector((state) => state.appointmentReducer.date);
    const [isOpenModalDate, setIsOpenModalDate] = useState(false);
    const [dateActive, setDateActive] = useState(getDateNow());
    const sortDate = () => {
      timeslot.sort((item) => {
        if (date === item.date) {
          return -1;
        } else {
          return 1;
        }
      });
      const getDate = timeslot.map((item) => item.date);
      const splitFormatDate = date.split('-').join('');

      const dateFiltered = getDate.filter(
        (item) => Number(item.split('-').join('')) >= Number(splitFormatDate)
      );

      const dateSorted = dateFiltered.sort(
        (a, b) => Number(a.split('-').join('')) - Number(b.split('-').join(''))
      );
      return dateSorted;
    };

    const showListDate = date ? sortDate() : getAllDate();

    return (
      <React.Fragment>
        <div
          style={{
            width: '93%',
            margin: 'auto',
            marginTop: '20px',
            marginBottom: '20px',
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
              Select Date
            </div>
            <div
              onClick={() => setIsOpenModalDate(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: color.primary,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              See More Date
            </div>
          </div>
          <Swiper
            style={{ width: '100%', marginTop: '20px' }}
            slidesPerView='auto'
            spaceBetween={15}
          >
            {showListDate.map((item) => {
              return (
                <SwiperSlide style={{ flexShrink: 'unset' }}>
                  <div
                    onClick={() => {
                      setDateActive(changeFormatDate(item));
                    }}
                    style={{
                      backgroundColor:
                        dateActive === changeFormatDate(item)
                          ? color.primary
                          : 'rgba(249, 249, 249, 1)',
                      borderRadius: '32px',
                      height: '80px',
                      width: '50px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color:
                        dateActive === changeFormatDate(item)
                          ? 'white'
                          : 'black',
                      opacity: item.available && 0.3,
                      pointerEvents: item.available && 'none',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '12px',
                        fontWeight: 500,
                        textTransform: 'capitalize',
                      }}
                    >
                      {convertDateName(item)}
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: 600 }}>
                      {convertDate(item)}
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
          <hr
            style={{
              backgroundColor: 'rgba(249, 249, 249, 1)',
              margin: '20px 0px',
            }}
          />
        </div>
        <Dialog
          classes={{ paper: classes.paper }}
          fullWidth={false}
          maxWidth='sm'
          open={isOpenModalDate}
          onClose={() => setIsOpenModalDate(false)}
        >
          <DialogContent>
            <SeeMoreDate
              color={color}
              timeList={timeslot}
              setIsOpenModalDate={setIsOpenModalDate}
              setDateActive={setDateActive}
              dateActive={dateActive}
            />
          </DialogContent>
        </Dialog>
      </React.Fragment>
    );
  };

  const Time = () => {
    const [timeActive, setTimeActive] = useState('10.00');
    const time = [
      { time: '10.00' },
      { time: '11.00' },
      { time: '12.00' },
      { time: '13.00' },
    ];
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
            setSelectTimeDropDown={setSelectTimeDropDown}
            selectTimeDropDown={selectTimeDropDown}
            timeList={time}
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

  const ServiceStylist = () => {
    const [isActiveStylist, setIsActiveStylist] = useState('');
    const stylist = [
      {
        name: 'Cody Fisher',
      },
      {
        name: 'Floyd Miles',
      },
    ];
    return (
      <div
        style={{
          width: '93%',
          margin: 'auto',
          marginTop: '20px',
          marginBottom: '20px',
        }}
      >
        <p style={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>
          Select Stylist
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            fontWeight: 500,
            marginTop: '20px',
          }}
        >
          {stylist.map((item) => (
            <div
              onClick={() => setIsActiveStylist(item.name)}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: isActiveStylist === item.name && color.primary,
                color: isActiveStylist === item.name ? 'white' : 'black',
                borderRadius: '8px',
                padding: '10px',
                fontSize: '14px',
              }}
            >
              <img
                style={{
                  borderRadius: '10px',
                  width: '40px',
                  height: '36px',
                  marginRight: '10px',
                }}
                alt='logo'
              />
              <div>{item.name}</div>
            </div>
          ))}
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
  const Notes = () => {
    return (
      <div
        style={{
          width: '93%',
          margin: 'auto',
          marginTop: '20px',
        }}
      >
        <p style={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>
          Add booking notes
        </p>
        <div
          style={{
            width: '100%',
            border: '1px solid rgba(184, 184, 184, 1)',
            borderRadius: '5px',
            color: 'rgba(183, 183, 183, 1)',
            fontSize: '14px',
          }}
        >
          <textarea
            placeholder='Example: Please confirm the availability'
            style={{ border: 'none', outline: 'none' }}
          ></textarea>
          <p
            style={{
              padding: 0,
              margin: 0,
              textAlign: 'right',
              fontSize: '12px',
              paddingRight: '10px',
            }}
          >
            0/140
          </p>
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
        <div style={{ fontWeight: 600, fontSize: '14px', color: 'black' }}>
          Estimated Price
        </div>
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
          window.location.href = changeFormatURl('/bookingsummary');
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
          fontSize: '16px',
          fontWeight: 600,
        }}
      >
        Book This Date
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
          <Date />
          <Time />
          <ServiceStylist />
          <Notes />
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
              <Timeline />
              <RenderItemService />
              <LabelAnythingelse />
              <SelectedOutlet />
              <Date />
              <Time />
              <ServiceStylist />
              <Notes />
              <Price />
              <ButtonPrice />
            </di>
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
