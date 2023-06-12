import React, { useState, useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import { useSelector, useDispatch } from 'react-redux';
import Tab from '@mui/material/Tab';

import fontStyles from '../style/styles.module.css';
import { OrderAction } from 'redux/actions/OrderAction';
import ItemHistory from './ItemHistory';
import MyLoader from 'pages/Appointment/component/LoaderSkleton';
import useMobileSize from 'hooks/useMobileSize';

const HistoryAppointment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const mobileSize = useMobileSize();

  const [tabName, setTabName] = useState('SUBMITTED');
  const [tabNameAPI, setTabNameAPI] = useState('SUBMITTED');

  const setting = useSelector((state) => state.order.setting);
  const bookingHistory = useSelector(
    (state) => state.appointmentReducer.bookingHistory
  );
  const color = useSelector((state) => state.theme.color);

  const settingAppoinment = setting.find((items) => {
    return items.settingKey === 'ShowServicePrice';
  });

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      await dispatch(OrderAction.getBooikingHistory(tabNameAPI));
      setIsLoading(false);
    };
    if (tabName) {
      getData();
    }
  }, [tabName]);

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
  const RenderItemHistory = () => {
    if (tabNameAPI === 'CONFIRMED') {
      const filterBookingHistory = bookingHistory.filter((item) => {
        const combineDateTime = `${item.bookingDate} ${item.bookingTime.start}`;
        const compareDate =
          tabName === 'UPCOMING'
            ? new Date(combineDateTime).getTime() > new Date().getTime()
            : new Date(combineDateTime).getTime() <= new Date().getTime();
        return compareDate;
      });
      return filterBookingHistory.map((item) => (
        <ItemHistory
          key={item.id}
          item={item}
          color={color}
          tabName={tabName}
          settingAppoinment={settingAppoinment?.settingValue}
        />
      ));
    } else {
      return bookingHistory.map((item) => (
        <ItemHistory
          key={item.id}
          item={item}
          color={color}
          tabName={tabName}
          settingAppoinment={settingAppoinment?.settingValue}
        />
      ));
    }
  };
  return (
    <React.Fragment>
      <RenderTabHeaderMobile />
      {isLoading ? (
        <div style={{ width: '95%', margin: 'auto' }}>
          <MyLoader />
        </div>
      ) : (
        <div
          style={{
            paddingBottom: '80px',
            marginTop: mobileSize ? '230px' : '245px',
          }}
        >
          <RenderItemHistory />
        </div>
      )}
    </React.Fragment>
  );
};

export default HistoryAppointment;
