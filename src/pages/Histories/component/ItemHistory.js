import React, { useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import DetailHistoryAppointment from './DetailHistoryAppointment';
import fontStyles from '../style/styles.module.css';
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

const ItemHistory = ({ item, color, tabName, settingAppoinment }) => {
  const [isOpenModalDetail, setIsOpenModalDetail] = useState(false);
  const companyInfo = useSelector((state) => state.masterdata.companyInfo.data);

  const [width] = useWindowSize();
  const gadgetScreen = width < 980;

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  // some fn
  const handleCurrency = (price) => {
    if (price) {
      const result = price.toLocaleString(companyInfo?.currency?.locale, {
        style: 'currency',
        currency: companyInfo?.currency?.code,
      });

      return result;
    }
  };
  const changeFormatDate = (dateStr) => {
    const date = new Date(dateStr);
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
    const monthName = months[date.getMonth()];
    const dayOfMonth = date.getDate();
    // Create the formatted date string
    const formattedDate = `${dayOfMonth} ${monthName} ${date.getFullYear()}`;

    return formattedDate;
  };

  const PlaceIcon = () => {
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke={color.primary}
        strokeWidth={1.5}
        strokeLinecap='round'
        strokeLinejoin='round'
        className='feather feather-map-pin'
      >
        <path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' />
        <circle cx={12} cy={10} r={3} />
      </svg>
    );
  };
  const AppointmentIcon = () => {
    return (
      <svg
        width='24'
        height='24'
        viewBox='0 0 240 240'
        fill='white'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M210 130V60C210 54.6957 207.893 49.6086 204.142 45.8579C200.391 42.1071 195.304 40 190 40H50C44.6957 40 39.6086 42.1071 35.8579 45.8579C32.1071 49.6086 30 54.6957 30 60V200C30 205.304 32.1071 210.391 35.8579 214.142C39.6086 217.893 44.6957 220 50 220H130M160 20V60M80 20V60M30 100H210M190 160V220M160 190H220'
          stroke={color.primary}
          strokeWidth='20'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    );
  };
  const ResponsiveLayout = () => {
    if (gadgetScreen) {
      return (
        <div
          className={fontStyles.myFont}
          onClick={() => setIsOpenModalDetail(true)}
          style={{
            width: '91%',
            margin: 'auto',
            borderRadius: '10px',
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)',
            marginTop: '10px',
            marginBottom: '10px',
            padding: '5px 0px',
          }}
        >
          {/* row CALENDER ICON */}
          <div
            style={{
              width: '95%',
              margin: 'auto',
              display: 'grid',
              gridTemplateColumns: '30px 1fr 77px',
              gridTemplateRows: '1fr',
              gap: '0px 0px',
              gridAutoFlow: 'row',
              gridTemplateAreas: '". ."',
              fontSize: '16px',
              fontWeight: 500,
              color: 'black',
              marginTop: '15px',
            }}
          >
            <AppointmentIcon />
            <div
              style={{
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                marginLeft: '10px',
                fontWeight: 'bold',
              }}
            >
              <div style={{ fontSize: '16px' }}>
                {changeFormatDate(item.bookingDate)}
              </div>
              <div style={{ margin: '0px 10px', fontSize: '16px' }}>-</div>
              <div style={{ fontSize: '16px' }}>{item.bookingTime.start}</div>
            </div>
            {tabName === 'COMPLETED' && (
              <div
                style={{
                  backgroundColor: 'rgba(56, 164, 5, 1)',
                  borderRadius: '20px',
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: 600,
                  width: '100%',
                  textAlign: 'center',
                }}
              >
                {item?.rewards?.points} points
              </div>
            )}
          </div>
          {/* ROW PLACE ICON */}
          <div
            style={{
              width: '95%',
              margin: 'auto',
              marginTop: '15px',
              display: 'grid',
              gridTemplateColumns: '30px 1fr',
              gridTemplateRows: '1fr',
              gap: '0px 0px',
              gridAutoFlow: 'row',
              gridTemplateAreas: '". ."',
            }}
          >
            <div
              style={{
                justifySelf: 'center',
                marginTop: '5px',
                marginRight: '5px',
                fontWeight: 'bold',
              }}
            >
              <PlaceIcon />
            </div>
            <div>
              <div
                style={{
                  color: 'black',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginLeft: '10px',
                }}
              >
                {item.outlet?.name}
              </div>
              <div
                style={{
                  color: 'rgba(157, 157, 157, 1)',
                  fontSize: '13px',
                  fontWeight: 600,
                  marginLeft: '10px',
                }}
              >
                {item.outlet?.address}
              </div>
            </div>
          </div>
          <div
            style={{
              width: '95%',
              margin: 'auto',
              display: 'flex',
              alignItems: 'center',
              marginTop: '10px',
              fontSize: '14px',
              color: 'rgba(157, 157, 157, 1)',
              fontWeight: 600,
            }}
          >
            <div>
              <span style={{ marginRight: '3px' }}>
                {item?.details?.length}
              </span>{' '}
              Service
            </div>
            <div style={{ margin: '0px 10px' }}> - </div>
            <div>{handleCurrency(item.totalNettAmount)}</div>
          </div>
        </div>
      );
    } else {
      return (
        <div
          className={fontStyles.myFont}
          onClick={() => setIsOpenModalDetail(true)}
          style={{
            width: '91%',
            margin: 'auto',
            borderRadius: '10px',
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)',
            marginTop: '10px',
            marginBottom: '10px',
            padding: '5px 0px',
          }}
        >
          <div
            style={{
              width: '95%',
              margin: 'auto',
              display: 'flex',
              alignItems: 'center',
              fontSize: '16px',
              fontWeight: 500,
              color: 'black',
              marginTop: '15px',
            }}
          >
            <AppointmentIcon />
            <div
              style={{
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                marginLeft: '10px',
              }}
            >
              <div style={{ fontSize: '16px' }}>
                {changeFormatDate(item.bookingDate)}
              </div>
              <div style={{ margin: '0px 10px', fontSize: '16px' }}>-</div>
              <div style={{ fontSize: '16px' }}>{item.bookingTime.start}</div>
            </div>
            {tabName === 'COMPLETED' && (
              <div
                style={{
                  backgroundColor: 'rgba(56, 164, 5, 1)',
                  borderRadius: '20px',
                  padding: '0px 10px',
                  color: 'white',
                  fontSize: '13px',
                  width: '100%',
                  height: '30px',
                  fontWeight: 600,
                }}
              >
                {item?.rewards?.points} points
              </div>
            )}
          </div>
          <div
            style={{
              width: '95%',
              margin: 'auto',
              display: 'flex',
              marginTop: '10px',
            }}
          >
            <div style={{ marginTop: '5px' }}>
              <PlaceIcon />
            </div>
            <div>
              <div
                style={{
                  color: 'black',
                  fontSize: '16px',
                  fontWeight: 500,
                  marginLeft: '10px',
                }}
              >
                {item.outlet?.name}
              </div>
              <div
                style={{
                  color: 'rgba(157, 157, 157, 1)',
                  fontSize: '13px',
                  fontWeight: 600,
                  marginLeft: '10px',
                }}
              >
                {item.outlet?.address}
              </div>
            </div>
          </div>
          <div
            style={{
              width: '95%',
              margin: 'auto',
              display: 'flex',
              alignItems: 'center',
              marginTop: '10px',
              fontSize: '14px',
              color: 'rgba(157, 157, 157, 1)',
              fontWeight: 500,
            }}
          >
            <div>D1005</div>
            <div style={{ margin: '0px 10px' }}> - </div>
            <div>{item?.details?.length} Service</div>
            <div style={{ margin: '0px 10px' }}> - </div>
            <div>{handleCurrency(item.totalNettAmount)}</div>
          </div>
        </div>
      );
    }
  };
  return (
    <React.Fragment>
      <ResponsiveLayout />
      <Dialog
        fullScreen={fullScreen}
        fullWidth
        maxWidth='md'
        open={isOpenModalDetail}
        onClose={() => setIsOpenModalDetail(false)}
      >
        <DetailHistoryAppointment
          tabName={tabName}
          handleCurrency={handleCurrency}
          item={item}
          setIsOpenModalDetail={setIsOpenModalDetail}
          settingAppoinment={settingAppoinment}
        />
      </Dialog>
    </React.Fragment>
  );
};

export default ItemHistory;
