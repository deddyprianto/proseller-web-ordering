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

const Date = ({ timeslot, color }) => {
  const [isConfirmButtonPressed, setIsConfirmButtonPressed] = useState(false);
  const [isOpenModalDate, setIsOpenModalDate] = useState(false);
  const dispatch = useDispatch();
  const useStyless = makeStyles(() => ({
    paper: { minWidth: '340px', borderRadius: '100px' },
  }));
  const classes = useStyless();
  const date = useSelector((state) => state.appointmentReducer.date);
  const dateSorted = useSelector(
    (state) => state.appointmentReducer.dateSorted
  );
  const getDateNow = () => {
    const now = new window.Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };

  useEffect(() => {
    dispatch({
      type: CONSTANT.DATE_APPOINTMENT,
      payload: changeFormatDate(getDateNow()),
    });
  }, []);

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
    // const dateSorted = listDate.map((a) => a.split(' ').join('-'));
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

  const showListDate = isConfirmButtonPressed ? dateSorted : getAllDate();

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
          <div style={{ fontWeight: 'bold', color: 'black', fontSize: '16px' }}>
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
                    dispatch({
                      type: CONSTANT.DATE_APPOINTMENT,
                      payload: changeFormatDate(item),
                    });
                  }}
                  style={{
                    backgroundColor:
                      date === changeFormatDate(item)
                        ? color.primary
                        : 'rgba(249, 249, 249, 1)',
                    borderRadius: '32px',
                    height: '80px',
                    width: '60px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: date === changeFormatDate(item) ? 'white' : 'black',
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
            setIsConfirmButtonPressed={setIsConfirmButtonPressed}
            sortDate={sortDate()}
          />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default Date;
