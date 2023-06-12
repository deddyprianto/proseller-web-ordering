import React, { useState, useEffect, useRef } from 'react';
import Tabs from '@mui/material/Tabs';
import { useSelector } from 'react-redux';
import Tab from '@mui/material/Tab';

import fontStyles from '../style/styles.module.css';
import ItemHistory from './ItemHistory';
import useHistoryAppointment from 'hooks/useHistoryAppointment';
import config from 'config';
import useMobileSize from 'hooks/useMobileSize';

const HistoryAppointment = () => {
  const historyRef = useRef();
  const [pageNumber, setPageNumber] = useState(1);
  const mobileSize = useMobileSize();

  const [tabName, setTabName] = useState('SUBMITTED');
  const [tabNameAPI, setTabNameAPI] = useState('SUBMITTED');
  const [skip, setSkip] = useState(10);

  const { historyAppointment, loading, error, hasMore, isEmptyData } =
    useHistoryAppointment({
      take: 10,
      skip,
      pageNumber,
      tabNameAPI,
    });

  const setting = useSelector((state) => state.order.setting);
  const color = useSelector((state) => state.theme.color);

  const settingAppoinment = setting.find((items) => {
    return items.settingKey === 'ShowServicePrice';
  });

    return dateStr;
  };
  const getTime = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    return timeStr.split(' ')[0];
  };

  // some eff
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
    console.log(historyRef.current);
    return () => {
      if (tempRef) observer.unobserve(tempRef);
    };
  }, [loading, hasMore]);

  if (historyAppointment.length === 0 && !loading) {
    return (
      <>
        <img src={config.url_emptyImage} alt='is empty' />
        <div>Data is empty</div>
      </>
    );
  }

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

  const styleSheet = {
    muiSelected: {
      '&.MuiButtonBase-root': {
        fontSize: '14px',
        fontWeight: 700,
        textTransform: 'capitalize',
        '&:hover': {
          color: 'rgba(138, 141, 142, 1)',
        },
      },
      '&.Mui-selected': {
        color: color.primary,
        fontSize: '14px',
        textTransform: 'capitalize',
      },
      '&.MuiTab-labelIcon': {
        fontSize: '14px',
        textTransform: 'capitalize',
      },
    },
    indicator: {
      '& .MuiTabScrollButton-root': {
        padding: 0,
        margin: 0,
        width: 15,
      },
      '& .MuiTabs-indicator': {
        backgroundColor: color.primary,
      },
    },
    indicatorForMobileView: {
      '& .MuiTabs-indicator': {
        backgroundColor: color.primary,
      },
    },
  };

  const RenderTabHeaderMobile = () => {
    return (
      <div
        style={{
          width: '100%',
          position: 'fixed',
          top: mobileSize ? '165px' : '175px',
          backgroundColor: '#ffffff',
        }}
      >
        <div
          style={{
            width: '95%',
            margin: 'auto',
            borderBottom: '1px solid rgba(138, 141, 142, .4)',
          }}
        >
          <Tabs
            value={tabName}
            sx={styleSheet.indicatorForMobileView}
            variant='scrollable'
            scrollButtons='auto'
            aria-label='scrollable auto tabs example'
          >
            <Tab
              value='SUBMITTED'
              onClick={() => {
                setTabName('SUBMITTED');
                setTabNameAPI('SUBMITTED');
              }}
              label='Submitted'
              className={fontStyles.myFont}
              sx={styleSheet.muiSelected}
            />
            <Tab
              value='UPCOMING'
              onClick={() => {
                setTabName('UPCOMING');
                setTabNameAPI('CONFIRMED');
              }}
              label='Upcoming'
              className={fontStyles.myFont}
              sx={styleSheet.muiSelected}
            />
            <Tab
              value='ONGOING'
              onClick={() => {
                setTabName('ONGOING');
                setTabNameAPI('CONFIRMED');
              }}
              label='Ongoing'
              className={fontStyles.myFont}
              sx={styleSheet.muiSelected}
            />
            <Tab
              value='COMPLETED'
              onClick={() => {
                setTabName('COMPLETED');
                setTabNameAPI('COMPLETED');
              }}
              label='Completed'
              className={fontStyles.myFont}
              sx={styleSheet.muiSelected}
            />
            <Tab
              value='CANCELLED'
              onClick={() => {
                setTabName('CANCELLED');
                setTabNameAPI('CANCELLED');
              }}
              label='Canceled'
              className={fontStyles.myFont}
              sx={styleSheet.muiSelected}
            />
          </Tabs>
        </div>
      </div>
    );
  };

  const filterBookingHistory = historyAppointment.filter((item) => {
    const combineDateTime = `${item.bookingDate} ${item.bookingTime.start}`;
    const compareDate =
      tabName === 'UPCOMING'
        ? new Date(combineDateTime).getTime() > new Date().getTime()
        : new Date(combineDateTime).getTime() <= new Date().getTime();
    return compareDate;
  });
  const RenderItemHistory = () => {
    if (tabNameAPI === 'CONFIRMED') {
      return filterBookingHistory.map((item, index) => {
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
    <React.Fragment>
      <RenderTabHeaderMobile />
      <div style={{ height: '60vh', overflowY: 'auto', paddingBottom: 70 }}>
        <RenderItemHistory />
        {loading && <RenderAnimationLoading />}
        {isEmptyData && (
          <div style={{ width: '100%' }}>
            <p
              className='default-font'
              style={{ color: '#9D9D9D', marginLeft: '20px' }}
            >
              You are all caught up
            </p>
          </div>
        )}
        {error?.message && (
          <p style={{ marginLeft: '10px' }}>{error?.message}</p>
        )}
      </div>
    </React.Fragment>
  );
};

export default HistoryAppointment;
