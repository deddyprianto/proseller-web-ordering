import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { CONSTANT } from 'helpers';

const SeeMoreDate = ({
  color,
  timeList,
  setIsOpenModalDate,
  setIsConfirmButtonPressed,
  sortDate,
}) => {
  const dateRedux = useSelector((state) => state.appointmentReducer.date);
  const [dateChoosen, setDateChoosen] = useState('');
  const dispatch = useDispatch();
  const [selector, setSelector] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [months, setMonths] = useState([]);
  const [dates, setDates] = useState([]);

  const days = ['San', 'Mon', 'Tue', 'Wed', 'Tur', 'Fri', 'Sat'];

  // some fn
  const handleButtonDisable = () => {
    if (dateChoosen) {
      return false;
    }
    return true;
  };
  const getDates = () => {
    let calender = [];
    const startDate = moment()
      .month(selectedMonth)
      .year(selectedYear)
      .clone()
      .startOf('month')
      .startOf('week');

    const endDate = moment()
      .month(selectedMonth)
      .year(selectedYear)
      .clone()
      .endOf('month');

    const day = startDate.clone().subtract(1, 'day');

    while (day.isBefore(endDate, 'day')) {
      calender.push(
        Array(7)
          .fill(0)
          .map(() => day.add(1, 'day').clone().format('YYYY MMM DD'))
      );
    }

    return calender;
  };
  const renderConditionButtonNextPrev = () => {
    const isMonthYearGreaterFromNow =
      Number(moment().month(selectedMonth).year(selectedYear).format('YYMM')) <=
      2212;

    if (isMonthYearGreaterFromNow) {
      return (
        <>
          <Button
            style={{ display: 'none' }}
            onClick={() => {
              handleMonthSlider('last');
            }}
          >
            <KeyboardArrowLeft style={{ color: 'black' }} />
          </Button>
          <div />
        </>
      );
    } else {
      return (
        <Button
          onClick={() => {
            handleMonthSlider('last');
          }}
        >
          <KeyboardArrowLeft style={{ color: 'black' }} />
        </Button>
      );
    }
  };
  const handleMonthSlider = (direction) => {
    if (direction === 'last') {
      const subtractResult = moment()
        .month(selectedMonth)
        .year(selectedYear)
        .subtract(1, 'months');
      const month = moment(subtractResult).format('MMM');
      const year = moment(subtractResult).format('YYYY');
      setSelectedMonth(month);
      setSelectedYear(year);
    }

    if (direction === 'next') {
      const addResult = moment()
        .month(selectedMonth)
        .year(selectedYear)
        .add(1, 'months');
      const month = moment(addResult).format('MMM');
      const year = moment(addResult).format('YYYY');

      setSelectedMonth(month);
      setSelectedYear(year);
    }
  };

  // some Effect
  useEffect(() => {
    const currentDates = getDates();
    setDates(currentDates);
  }, [selectedYear, selectedMonth]);
  useEffect(() => {
    const currentYear = moment().format('YYYY');
    const currentMonth = moment().format('MMM');
    const currentDate = Number(moment().format('DD'));
    const monthList = moment.months();
    setSelectedYear(currentYear);
    setSelectedMonth(currentMonth);
    setSelectedDate(currentDate);
    setMonths(monthList);
  }, []);

  const renderConfirmButton = () => {
    return (
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        mt={2}
      >
        <button
          onClick={() => setIsOpenModalDate(false)}
          style={{
            backgroundColor: 'white',
            border: `1px solid ${color.primary}`,
            color: color.primary,
            width: '48%',
            padding: '6px 0px',
            borderRadius: '10px',
            fontSize: '12px',
          }}
        >
          Cancel
        </button>
        <button
          onClick={() => {
            setIsConfirmButtonPressed(true);
            dispatch({ type: CONSTANT.DATE_APPOINTMENT, payload: dateChoosen });
            dispatch({ type: CONSTANT.DATE_SORTED, payload: sortDate });
            setIsOpenModalDate(false);
          }}
          disabled={handleButtonDisable()}
          style={{
            color: 'white',
            width: '48%',
            padding: '6px 0px',
            borderRadius: '10px',
            fontSize: '12px',
          }}
        >
          Confirm
        </button>
      </Stack>
    );
  };
  const renderMonthSlider = () => {
    return (
      <div
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gridTemplateRows: '1fr',
          gap: '0px 0px',
          gridAutoFlow: 'row',
          gridTemplateAreas: '". . ."',
          justifyItems: 'center',
          alignItems: 'center',
        }}
      >
        {renderConditionButtonNextPrev()}
        <Stack direction='row'>
          <Typography
            onClick={() => {
              setSelector('month');
            }}
            style={{
              fontSize: 12,
              fontWeight: 'bold',
              color: 'black',
              cursor: 'pointer',
            }}
          >
            {selectedMonth}
          </Typography>
          <Typography
            onClick={() => {
              setSelector('year');
            }}
            style={{
              fontSize: 12,
              fontWeight: 'bold',
              color: 'black',
              marginLeft: '5px',
              cursor: 'pointer',
            }}
          >
            {selectedYear}
          </Typography>
        </Stack>

        <Button
          onClick={() => {
            handleMonthSlider('next');
          }}
        >
          <KeyboardArrowRight style={{ color: 'black' }} />
        </Button>
      </div>
    );
  };
  const renderDeliveryDayItem = (item) => {
    return (
      <div key={item} style={{ textAlign: 'center', width: 26, height: 26 }}>
        <Typography style={{ fontSize: 10, color: color.primary }}>
          {item}
        </Typography>
      </div>
    );
  };
  const renderDeliveryDay = () => {
    const result = days.map((test) => {
      return renderDeliveryDayItem(test);
    });
    return (
      <Stack direction='row' justifyContent='space-between' width='100%'>
        {result}
      </Stack>
    );
  };

  const renderDeliveryDateItem = (item) => {
    const itemDate = item.split(' ');
    const date = Number(itemDate[2]);
    const month = itemDate[1];
    const year = itemDate[0];
    const combineDateNMonth = moment()
      .year(year)
      .month(month)
      .date(date)
      .format('YYYYMMDD');

    const years = combineDateNMonth.slice(0, 4);
    const months = combineDateNMonth.slice(4, 6);
    const days = combineDateNMonth.slice(6, 8);
    const formattedDate = `${years}-${months}-${days}`;
    const isActive = dateRedux === formattedDate;
    const isThisMonth = selectedMonth === month;

    const availableDateFromAPI = timeList.some((item) => {
      const arr = item.date.split('-');
      const stringToInt = arr.join('');

      return combineDateNMonth === stringToInt;
    });

    const styleFontDate = !isThisMonth
      ? {
          fontSize: 11,
          color: '#667080',
        }
      : isActive
      ? {
          fontSize: 11,
          color: 'white',
        }
      : { fontSize: 11, color: 'black' };

    const styleCircle =
      isActive && isThisMonth
        ? {
            display: 'flex',
            width: 25,
            height: 25,
            backgroundColor: color.primary,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 100,
            color: 'white',
          }
        : { textAlign: 'center', width: 26, height: 26 };

    return (
      <div
        key={item}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '5px',
          pointerEvents: !availableDateFromAPI && 'none',
          height: '40px',
        }}
        onClick={() => {
          setDateChoosen(formattedDate);
          dispatch({
            type: CONSTANT.DATE_APPOINTMENT,
            payload: formattedDate,
          });
          if (date === 1) {
            handleMonthSlider('next');
          }
        }}
      >
        <div style={styleCircle}>
          <Typography
            sx={{
              ...styleFontDate,
              opacity: availableDateFromAPI ? 1 : 0.2,
              cursor: availableDateFromAPI ? 'pointer' : 'not-allowed',
              padding: 0,
              margin: 0,
            }}
          >
            {date}
          </Typography>
        </div>
      </div>
    );
  };
  const renderDeliveryDate = () => {
    const result = dates.map((date, i) => {
      return (
        <div
          key={i}
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          {date.map((item) => {
            return renderDeliveryDateItem(item);
          })}
        </div>
      );
    });

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        {renderDeliveryDay()}
        {result}
      </div>
    );
  };

  const renderDate = () => {
    return (
      <div>
        {renderMonthSlider()}
        <div style={{ marginTop: 20 }} />
        {renderDeliveryDate()}
      </div>
    );
  };
  return (
    <div>
      {renderDate()}
      {renderConfirmButton()}
    </div>
  );
};

export default SeeMoreDate;
