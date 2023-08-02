import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import DetailHistoryAppointment from './DetailHistoryAppointment';
import fontStyles from '../style/styles.module.css';

const ItemHistory = ({ item, color, tabName, settingAppoinment }) => {
  const [isOpenModalDetail, setIsOpenModalDetail] = useState(false);
  const companyInfo = useSelector((state) => state.masterdata.companyInfo.data);

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

  return (
    <React.Fragment>
      <div
        className={fontStyles.myFont}
        onClick={() => setIsOpenModalDetail(true)}
        style={{
          borderRadius: '8px',
          boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.10)',
          padding: '12px 0px',
          margin: '15px 0px',
        }}
      >
        <div
          style={{
            width: '100%',
            padding: '0px 16px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: color.primary,
            }}
          >
            Appointment
          </div>
        </div>
        <div
          style={{
            backgroundColor: 'rgb(242, 242, 242)',
            padding: '8px 16px',
            marginTop: '12px',
          }}
        >
          <div style={{ marginTop: '8px', fontWeight: 600, fontSize: '16px' }}>
            {item.outlet?.name}
          </div>
          <div
            style={{
              marginTop: '8px',
              fontWeight: 600,
              fontSize: '14px',
              color: '#9D9D9D',
            }}
          >
            <div
              style={{
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                color: 'black',
              }}
            >
              <div style={{ fontWeight: 600, fontSize: '14px' }}>
                {changeFormatDate(item.bookingDate)}
              </div>
              <div
                style={{
                  margin: '0px 10px',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                -
              </div>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>
                {item.bookingTime.start}
              </div>
            </div>
          </div>
          <div style={{ marginTop: '8px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '14px',
                color: 'rgba(157, 157, 157, 1)',
                fontWeight: 600,
              }}
            >
              <div>
                <span>{item?.details?.length}</span> Service
              </div>
              <div style={{ margin: '0px 10px' }}> - </div>
              <div>{handleCurrency(item.totalNettAmount)}</div>
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: '14px',
            height: '21px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0px 16px',
          }}
        >
          <div
            style={{
              fontSize: '14px',
              fontWeight: 700,
              color: color.primary,
            }}
          >
            {tabName}
          </div>
          <div style={{ fontSize: '12px', color: '#B7B7B7', fontWeight: 600 }}>
            <div>{moment(item.createdAt).format('DD/MM/YY HH:mm')}</div>
          </div>
        </div>
      </div>
      <DetailHistoryAppointment
        tabName={tabName}
        handleCurrency={handleCurrency}
        item={item}
        setIsOpenModalDetail={setIsOpenModalDetail}
        isOpenModalDetail={isOpenModalDetail}
        settingAppoinment={settingAppoinment}
      />
    </React.Fragment>
  );
};

export default ItemHistory;
