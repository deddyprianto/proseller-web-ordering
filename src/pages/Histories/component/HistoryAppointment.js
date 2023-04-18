import React, { useState, useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import { useSelector, useDispatch } from 'react-redux';
import Tab from '@mui/material/Tab';
import fontStyles from '../style/styles.module.css';
import { OrderAction } from 'redux/actions/OrderAction';
import ItemHistory from './ItemHistory';
import '../style/styles.module.css';

const HistoryAppointment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [tabName, setTabName] = useState('SUBMITTED');
  const [tabNameAPI, setTabNameAPI] = useState('SUBMITTED');
  const bookingHistory = useSelector(
    (state) => state.appointmentReducer.bookingHistory
  );
  const color = useSelector((state) => state.theme.color);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      const data = await dispatch(OrderAction.getBooikingHistory(tabNameAPI));
      console.log(data);
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
        textTransform: 'capitalize',
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
      <div style={{ width: '100%', marginTop: '20px' }}>
        <div
          style={{
            marginBottom: '10px',
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
              value='CONFIRMED'
              onClick={() => {
                setTabName('CONFIRMED');
                setTabNameAPI('CONFIRMED');
              }}
              label='Up coming'
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
  const RenderAnimationLoading = () => {
    return (
      <div className='lds-spinner' style={{ marginTop: '200px' }}>
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

  return (
    <React.Fragment>
      <RenderTabHeaderMobile />
      {isLoading ? (
        <RenderAnimationLoading />
      ) : (
        <div style={{ height: '60vh', overflowY: 'auto' }}>
          {bookingHistory?.map((item) => {
            return <ItemHistory key={item.id} item={item} color={color} />;
          })}
        </div>
      )}
    </React.Fragment>
  );
};

export default HistoryAppointment;
