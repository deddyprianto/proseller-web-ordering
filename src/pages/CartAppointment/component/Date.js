import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';
import 'swiper/swiper.scss';
import moment from 'moment';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import SeeMoreDate from './SeeMoreDate';
import { CONSTANT } from 'helpers';
import { isEmptyArray } from 'helpers/CheckEmpty';
import LoaderSkeleton from './LoaderSkeleton';

const Date = ({ timeslot, color }) => {
  const [isConfirmButtonPressed, setIsConfirmButtonPressed] = useState(false);
  const [isOpenModalDate, setIsOpenModalDate] = useState(false);
  const dispatch = useDispatch();
  const useStyless = makeStyles(() => ({
    paper: { minWidth: '340px', borderRadius: '100px' },
  }));
  const classes = useStyless();
  const isListDateSelected = useSelector(
    (state) => state.appointmentReducer.isDateSelected
  );
  const date = useSelector((state) => state.appointmentReducer.date);
  const messageTimeSlot = useSelector(
    (state) => state.appointmentReducer.messageTimeSlot
  );
  const dateSorted = useSelector(
    (state) => state.appointmentReducer.dateSorted
  );

  const showListDate = isConfirmButtonPressed ? dateSorted : timeslot;

  useEffect(() => {
    const dateNow = showListDate.find((item) => item.timeSlot.length > 0);
    dispatch({
      type: CONSTANT.DATE_APPOINTMENT,
      payload: changeFormatDate(dateNow?.date),
    });
  }, [timeslot]);

  const changeFormatDate = (itemDate) => {
    if (itemDate) {
      return itemDate.split(' ').join('-');
    }
  };

  const handleSelectedDate = (item) => {
    dispatch({
      type: CONSTANT.IS_DATE_SELECTED,
      payload: true,
    });
    dispatch({
      type: CONSTANT.TIME_APPOINTMENT,
      payload: '',
    });
    dispatch({
      type: CONSTANT.TIME_ACTIVE_DROPDOWN_CART_APPOINTMENT,
      payload: '',
    });
    dispatch({
      type: CONSTANT.DATE_APPOINTMENT,
      payload: changeFormatDate(item.date),
    });
  };

  const sortDate = (dateChoosen) => {
    timeslot.sort((item) => {
      if (dateChoosen === item.date) {
        return -1;
      } else {
        return 1;
      }
    });

    const splitFormatDate = dateChoosen.split('-').join('');

    const dateFiltered = timeslot.filter(
      (item) => Number(item.date.split('-').join('')) >= Number(splitFormatDate)
    );

    const dateSorted = dateFiltered.sort(
      (a, b) =>
        Number(a.date.split('-').join('')) - Number(b.date.split('-').join(''))
    );
    return dateSorted;
  };

  const getDates = () => {
    let calendar = [];
    const currentDate = moment().startOf('day');

    const endDate = currentDate.clone().add(13, 'days');

    const day = currentDate.clone();

    while (day.isBefore(endDate, 'day')) {
      calendar.push(day.format('YYYY-MM-DD'));
      day.add(1, 'day');
    }

    return calendar;
  };

  const DateLabel = ({ dateStr }) => {
    const date = new window.Date(dateStr);
    const dayOfWeek = date.getDay();
    const weekdays = ['sun', 'mon', 'tue', 'wed', 'thurs', 'fri', 'sat'];
    const dayOfMonth = date.getDate().toString().padStart(2, '0');

    return (
      <React.Fragment>
        <div
          style={{
            fontSize: '12px',
            fontWeight: 500,
            textTransform: 'capitalize',
          }}
        >
          {weekdays[dayOfWeek]}
        </div>
        <div style={{ fontSize: '22px', fontWeight: 600 }}>{dayOfMonth}</div>
      </React.Fragment>
    );
  };

  const renderListDate = () => {
    const customListDates = getDates().map((date) => {
      const matchingDate = showListDate.find((obj) => obj.date === date);
      if (matchingDate) {
        return { date, timeSlot: matchingDate.timeSlot };
      }
      return { date, timeSlot: [] };
    });

    if (isEmptyArray(timeslot)) {
      return <LoaderSkeleton />;
    } else if (!messageTimeSlot) {
      return (
        <div
          style={{
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
            {customListDates.map((item) => {
              const isDateSelected = date === changeFormatDate(item?.date);
              const dateNow = customListDates.find(
                (item) => item.timeSlot.length > 0
              );
              const dateAvailable = dateNow?.date === item.date;
              const checkDate = !isListDateSelected
                ? dateAvailable
                : isDateSelected;
              return (
                <SwiperSlide key={item.date} style={{ flexShrink: 'unset' }}>
                  <div
                    onClick={() => {
                      handleSelectedDate(item);
                    }}
                    style={{
                      backgroundColor: checkDate
                        ? color.primary
                        : 'rgba(249, 249, 249, 1)',
                      borderRadius: '32px',
                      height: '80px',
                      width: '60px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: checkDate ? 'white' : 'black',
                      opacity: isEmptyArray(item.timeSlot) && 0.3,
                      pointerEvents: isEmptyArray(item.timeSlot) && 'none',
                      boxShadow: checkDate
                        ? '1px 1px 4px rgba(0, 0, 0, 0.4)'
                        : 'none',
                    }}
                  >
                    <DateLabel dateStr={item?.date} />
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
      );
    } else {
      return null;
    }
  };
  return (
    <React.Fragment>
      {renderListDate()}
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
            setIsConfirmButtonPressed={setIsConfirmButtonPressed}
            sortDate={sortDate}
          />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default Date;
