import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';
import 'swiper/swiper.scss';
import ItemHistory from './ItemHistory';
import useHistoryAppointment from 'hooks/useHistoryAppointment';


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

const HistoryAppointment = () => {
  const historyRef = useRef();
  const [tabNameAPI, setTabNameAPI] = useState('SUBMITTED');

  const [tabName, setTabName] = useState('Submitted');
  const [pageNumber, setPageNumber] = useState(1);
  const [skip, setSkip] = useState(0);
  const { historyAppointment, loading, error, hasMore, setHasMore } =
    useHistoryAppointment({
      take: 10,
      skip,
      pageNumber,
      tabNameAPI,
      tabName,
    });
  const setting = useSelector((state) => state.order.setting);
  const color = useSelector((state) => state.theme.color);

  const settingAppoinment = setting.find((items) => {
    return items.settingKey === 'ShowServicePrice';
  });

  useEffect(() => {
    if (loading) return;
    let tempRef = null;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setSkip((prev) => prev + 10);
        setPageNumber((prev) => prev + 1);
      }
    });
    if (historyRef.current) {
      observer.observe(historyRef.current);
      tempRef = historyRef.current;
    }
    return () => {
      if (tempRef) observer.unobserve(tempRef);
    };
  }, [loading, hasMore]);

  const renderTabHeaderMobile = () => {
    const labelAppointment = [
      {
        label: 'Submitted',
        query: 'SUBMITTED',
      },
      {
        label: 'Upcoming',
        query: 'CONFIRMED',
      },
      {
        label: 'Ongoing',
        query: 'CONFIRMED',
      },
      {
        label: 'Completed',
        query: 'COMPLETED',
      },
      {
        label: 'Canceled',
        query: 'CANCELLED',
      },
    ];
    return (
      <Swiper
        style={{ width: '100%', margin: '16px 0px' }}
        slidesPerView='auto'
        spaceBetween={10}
      >
        {labelAppointment.map((item) => (
          <SwiperSlide
            key={item.label}
            style={{ flexShrink: 'unset' }}
            onClick={() => {
              setTabName(item.label);
              setTabNameAPI(item.query);
              setSkip(0);
              setPageNumber(1);
              setHasMore(false);
            }}
          >
            <div
              style={{
                width: '128px',
                textAlign: 'center',
                padding: '5px 16px',
                borderRadius: '8px',
                color: item.label === tabName ? 'white' : color.primary,
                backgroundColor:
                  item.label === tabName ? color.primary : 'white',
                border: `1px solid ${color.primary}`,
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              {item.label}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    );
  };

  const filterBookingHistory = historyAppointment.filter((item) => {
    const combineDateTime = `${item.bookingDate} ${item.bookingTime.start}`;
    const compareDate =
      tabName === 'Upcoming'
        ? new Date(combineDateTime).getTime() > new Date().getTime()
        : new Date(combineDateTime).getTime() <= new Date().getTime();
    return compareDate;
  });
  const renderItemHistory = () => {
    if (tabNameAPI === 'CONFIRMED') {
      return filterBookingHistory.map((item, index) => {
        if (filterBookingHistory.length === index + 1) {
          return (
            <div ref={historyRef} key={item.id}>
              <ItemHistory
                item={item}
                color={color}
                tabName={tabName}
                settingAppoinment={settingAppoinment?.settingValue}
              />
            </div>
          );
        } else {
          return (
            <ItemHistory
              key={item.id}
              item={item}
              color={color}
              tabName={tabName}
              settingAppoinment={settingAppoinment?.settingValue}
            />
          );
        }
      });
    } else {
      return historyAppointment.map((item, index) => {
        if (historyAppointment.length === index + 1) {
          return (
            <div ref={historyRef} key={item.id}>
              <ItemHistory
                item={item}
                color={color}
                tabName={tabName}
                settingAppoinment={settingAppoinment?.settingValue}
              />
            </div>
          );
        } else {
          return (
            <ItemHistory
              key={item.id}
              item={item}
              color={color}
              tabName={tabName}
              settingAppoinment={settingAppoinment?.settingValue}
            />
          );
        }
      });
    }
  };

  return (
    <div>
      {renderTabHeaderMobile()}
      <div
        style={{
          height: '60vh',
          overflowY: 'auto',
          paddingBottom: 85,
          paddingLeft: '2px',
          paddingRight: '2px',
        }}
      >
        {renderItemHistory()}
        {loading && <RenderAnimationLoading />}
        {!hasMore && !loading && (
          <div style={{ width: '100%' }}>
            <p
              className='default-font'
              style={{ color: '#9D9D9D', textAlign: 'center' }}
            >
              You are all caught up
            </p>
          </div>
        )}
        {error?.message && (
          <p style={{ marginLeft: '10px' }}>{error?.message}</p>
        )}
      </div>
    </div>
  );
};

export default HistoryAppointment;
