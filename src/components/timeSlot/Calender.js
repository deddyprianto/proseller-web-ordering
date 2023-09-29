import React, { useCallback, useEffect, useState } from 'react';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { OrderAction } from '../../redux/actions/OrderAction';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';
import 'swiper/swiper.scss';
import DropDownCustomSelect from './DropDownSelect';
import useMobileSize from '../../hooks/useMobileSize';
import { CONSTANT } from 'helpers';
import { useStyles } from 'helpers/additionallStyle';
import { dateExistsInComparisons } from 'helpers/helperFunctionLoginGuest';

const Calendar = ({ onClose, validationOrderingGuestMode }) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  const [getDateBaseOnClick, setGetDateBaseOnClick] = useState();
  const [selectTimeDropDown, setSelectTimeDropDown] = useState('');
  const [dates, setDates] = useState([]);
  const [mode, setMode] = useState();
  const [months, setMonths] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [timeList, setTimeList] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(4);
  const [selector, setSelector] = useState('');
  const [selectTime, setselectTime] = useState();
  const [dateActive, setDateActive] = useState('');
  const [monthActive, setMonthActive] = useState('');
  const [yearActive, setYearActive] = useState('');
  const [getAllDateForTimeSlot, setGetAllDateForTimeSlot] = useState([]);

  const dispatch = useDispatch();
  const mobileSize = useMobileSize();

  const { orderingModeGuestCheckout } = useSelector(
    (state) => state.guestCheckoutCart
  );
  const saveTimeSlotCalendar = useSelector(
    (state) => state.guestCheckoutCart.saveTimeSlotCalendar
  );
  const saveTimeSlotForEdit = useSelector(
    (state) => state.guestCheckoutCart.saveTimeSlotForEdit
  );

  const color = useSelector((state) => state.theme.color);
  const styles = useStyles(mobileSize, color);
  const dataTime = useSelector((state) => state.outlet.defaultOutlet);
  const dateEdit = useSelector((state) => state.guestCheckoutCart);
  const orderingMode = useSelector((state) => state.order.orderingMode);
  const timeslot = useSelector((state) => state.guestCheckoutCart);

  const days = ['San', 'Mon', 'Tue', 'Wed', 'Tur', 'Fri', 'Sat'];

  const loadingData = (role) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(role);
      }, 100);
    });
  };

  const getDatesGuestMode = useCallback(() => {
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
  }, [selectedMonth, selectedYear]);

  const getAllDateGuest = () => {
    let monthArr = [];
    const weeks = moment().add(0, 'weeks').startOf('week');
    for (let i = 0; i < 150; i++) {
      monthArr.push(weeks.clone().add(i, 'day').format('YYYY MM DD'));
    }

    const dateNow = new Date();
    dateNow.setHours(0, 0, 0, 0);
    let timeStamp = new Date(dateNow).getTime();
    const listDate = monthArr.filter(
      (item) => new Date(item).getTime() >= timeStamp
    );
    return listDate;
  };

  const getYearsGuest = useCallback(() => {
    const years = [];
    const start = moment()
      .year(moment().format('YYYY'))
      .clone()
      .startOf('years');

    const yearStart = start.clone().subtract(16, 'years');
    const yearEnd = moment().add(16, 'y');

    while (yearEnd.diff(yearStart, 'years') >= 1) {
      years.push(
        Array(4)
          .fill(0)
          .map(() => yearStart.add(1, 'year').clone().format('YYYY'))
      );
    }
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = years.slice(indexOfFirstPost, indexOfLastPost);
    return currentPosts;
  }, [currentPage, postsPerPage]);

  useEffect(() => {
    if (!saveTimeSlotForEdit) {
      setGetDateBaseOnClick(formattedDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveTimeSlotForEdit]);

  useEffect(() => {
    const mode = localStorage.getItem('settingGuestMode');
    setMode(mode);
  }, []);
  useEffect(() => {
    const currentYear = moment().format('YYYY');
    const currentMonth = moment().format('MMM');
    const monthList = moment.months();
    setSelectedYear(currentYear);
    setSelectedMonth(currentMonth);
    setMonths(monthList);
  }, []);
  useEffect(() => {
    const currentDates = getDatesGuestMode();
    setDates(currentDates);
  }, [selectedYear, selectedMonth, getDatesGuestMode]);

  useEffect(() => {
    const currentYear = getYearsGuest();
    setYears(currentYear);
  }, [currentPage, getYearsGuest]);

  useEffect(() => {
    const allDate = getAllDateGuest();
    setGetAllDateForTimeSlot(allDate);
  }, []);

  useEffect(() => {
    const printTime = async () => {
      let dateTime = new Date();
      let payload = {
        clientTimezone: Math.abs(dateTime.getTimezoneOffset()),
        date: moment(dateTime).format('YYYY-MM-DD'),
        maxDays: 90,
        orderingMode: orderingModeGuestCheckout || orderingMode,
        outletID: dataTime?.sortKey,
      };

      try {
        let data = await dispatch(OrderAction.getTimeSlot(payload));
        loadingData(data).then((res) => setTimeList(res?.data));
      } catch (error) {
        alert(error);
      }
    };
    printTime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeFormatDate = (itemDate) => {
    return itemDate.split(' ').join('-');
  };

  const handleSaveDateTime = async () => {
    const formatDate = `${moment(selectTime).format('DD')}-${moment(selectTime)
      .format('MM')
      .toLocaleUpperCase()}-${moment(selectTime)
      .format('YYYY')
      .toLocaleUpperCase()}`;
    try {
      await dispatch(OrderAction.setData(formatDate, 'SET_ORDER_ACTION_DATE'));
      await dispatch(
        OrderAction.setData(selectTimeDropDown, 'SET_ORDER_ACTION_TIME_SLOT')
      );
    } catch (error) {
      console.log(error);
    }
    onClose(true);
  };

  const handleSaveDateTimeForGuestMode = async () => {
    const formatDate = `${moment(selectTime).format('YYYY')}-${moment(
      selectTime
    )
      .format('MM')
      .toLocaleUpperCase()}-${moment(selectTime)
      .format('DD')
      .toLocaleUpperCase()}`;
    const splitTime = selectTimeDropDown.split('-')[0];
    const finalTime = splitTime.split(' ')[0];
    try {
      await dispatch(OrderAction.saveDateGuest(formatDate, CONSTANT.SAVE_DATE));
      await dispatch(
        OrderAction.saveTimeSlotGuest(finalTime, CONSTANT.SAVE_TIMESLOT)
      );
      await dispatch(
        OrderAction.saveTimeGuest(selectTimeDropDown, CONSTANT.SAVE_TIME)
      );
      dispatch({
        type: CONSTANT.SAVE_TIMESLOT_FOR_EDIT,
        payload: formatDate,
      });
      dispatch({ type: CONSTANT.SAVE_TIMESLOT_CALENDER, payload: '' });
    } catch (error) {
      console.log(error);
    }
    onClose(true);
  };

  const handleMonthSliderGuest = (direction) => {
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
              handleMonthSliderGuest('last');
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
            handleMonthSliderGuest('last');
          }}
        >
          <KeyboardArrowLeft style={{ color: 'black' }} />
        </Button>
      );
    }
  };

  const renderMonthSlider = () => {
    return (
      <div style={styles.wrapperMonthSlider}>
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
            handleMonthSliderGuest('next');
          }}
        >
          <KeyboardArrowRight style={{ color: 'black' }} />
        </Button>
      </div>
    );
  };

  const renderYearSlider = () => {
    let yearStart;
    let yearEnd;
    if (years.length === 0) {
      yearStart = '';
      yearEnd = '';
    } else {
      yearStart = years[0][0];
      yearEnd = years[3][3];
    }
    return (
      <div style={styles.wrapperYearSlider}>
        <Button
          onClick={() => {
            setCurrentPage((prev) => prev - 1);
          }}
        >
          <KeyboardArrowLeft />
        </Button>
        <Typography style={{ fontSize: 12, fontWeight: 'bold' }}>
          {yearStart} - {yearEnd}
        </Typography>
        <Button
          onClick={() => {
            setCurrentPage((prev) => prev + 1);
          }}
        >
          <KeyboardArrowRight />
        </Button>
      </div>
    );
  };

  const renderDeliveryDayItem = (item) => {
    return (
      <div style={styles.circle} key={item}>
        <Typography style={{ fontSize: 10, color: '#4D86A0' }}>
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

  const dateArrayMaxDaysGuest = [];
  if (
    validationOrderingGuestMode?.maxDays &&
    validationOrderingGuestMode?.maxDays !== 0
  ) {
    const days = validationOrderingGuestMode?.maxDays;
    const startDate = moment();
    const endDate = moment().add(days - 1, 'days');

    const currentDate = startDate.clone();

    while (currentDate.isSameOrBefore(endDate)) {
      const formattedDate = {
        date: currentDate.format('YYYY-MM-DD'),
      };
      dateArrayMaxDaysGuest.push(formattedDate);
      currentDate.add(1, 'day');
    }
  }

  // start Refactoring code
  const createStyleFontDate = (isThisMonth, isActive) => {
    if (!isThisMonth) {
      return {
        fontSize: 11,
        color: '#667080',
      };
    } else if (isActive) {
      return styles.textDateSelected;
    } else {
      return styles.textDate;
    }
  };

  const createStyleCircle = (isThisMonth, isActive) => {
    return isActive && isThisMonth ? styles.circleActive : styles.circle;
  };

  const renderDateItem = (
    item,
    dateActive,
    selectedMonth,
    setSelectTimeDropDown,
    setDateActive,
    handleMonthSliderGuest,
    timeList
  ) => {
    const itemDate = item.split(' ');
    const date = Number(itemDate[2]);
    const month = itemDate[1];
    const year = itemDate[0];
    const isActive = dateActive === date;
    const isThisMonth = selectedMonth === month;

    const combineDateNMonth = moment()
      .year(year)
      .month(month)
      .date(date)
      .format('YYYYMMDD');

    const availableDateFromAPI = timeList.some((item) => {
      const arr = item.date.split('-');
      const stringToInt = arr.join('');

      return combineDateNMonth === stringToInt;
    });

    const styleFontDate = createStyleFontDate(isThisMonth, isActive);
    const styleCircle = createStyleCircle(isThisMonth, isActive);

    return (
      <div
        key={item}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '5px',
          pointerEvents: !availableDateFromAPI ? 'none' : 'auto',
        }}
        onClick={() => {
          setSelectTimeDropDown('');
          setDateActive(date);
          if (date === 1) {
            handleMonthSliderGuest('next');
          }
        }}
      >
        <div style={styleCircle}>
          <Typography
            style={{
              ...styleFontDate,
              opacity: availableDateFromAPI ? 1 : 0.2,
              cursor: availableDateFromAPI ? 'pointer' : 'not-allowed',
            }}
          >
            {date}
          </Typography>
        </div>
      </div>
    );
  };

  const renderDeliveryDateItemGuestCO = (item) => {
    if (
      validationOrderingGuestMode?.maxDays &&
      validationOrderingGuestMode?.maxDays !== 0
    ) {
      return renderDateItem(
        item,
        dateActive,
        selectedMonth,
        setSelectTimeDropDown,
        setDateActive,
        handleMonthSliderGuest,
        dateArrayMaxDaysGuest
      );
    } else {
      return renderDateItem(
        item,
        dateActive,
        selectedMonth,
        setSelectTimeDropDown,
        setDateActive,
        handleMonthSliderGuest,
        timeList
      );
    }
  };

  // end Refactoring code

  const renderDeliveryDate = () => {
    const result = dates.map((date, i) => {
      return (
        <div key={i} style={styles.wrapperDeliveryDate}>
          {date.map((item) => {
            return renderDeliveryDateItemGuestCO(item);
          })}
        </div>
      );
    });

    return (
      <div style={styles.body}>
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

  const renderDeliveryMonthItem = (item) => {
    const getSubstrMonth = item.substring(0, 3);
    const combineYearNMonth = moment()
      .year(selectedYear)
      .month(item)
      .format('YYYYMM');

    const yearFilterFromAPI = timeList.some((item) => {
      const getYYMM = item.date.split('-');
      getYYMM.pop();
      const joinArrayItem = getYYMM.join('');
      return combineYearNMonth === joinArrayItem;
    });

    return (
      <p
        style={
          getSubstrMonth === monthActive
            ? {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '40px',
                height: '40px',
                backgroundColor: yearFilterFromAPI
                  ? color.primary
                  : 'transparent',
                borderRadius: '100%',
                color: yearFilterFromAPI ? 'white' : 'black',
                opacity: yearFilterFromAPI ? 1 : 0.2,
                fontSize: mobileSize ? '11px' : '13px',
                marginLeft: '4px',
                marginRight: '4px',
              }
            : {
                color: 'black',
                fontSize: mobileSize ? '11px' : '13px',
                paddingLeft: '10px',
                paddingRight: '10px',
                opacity: yearFilterFromAPI ? 1 : 0.2,
                cursor: yearFilterFromAPI ? 'pointer' : 'not-allowed',
                pointerEvents: !yearFilterFromAPI && 'none',
              }
        }
        onClick={() => {
          setMonthActive(item.substring(0, 3));
          setSelectedMonth(item.substring(0, 3));
        }}
      >
        {getSubstrMonth}
      </p>
    );
  };

  const renderDeliveryMonth = () => {
    const itemMonth = months.map((month) => {
      return renderDeliveryMonthItem(month);
    });
    return <div style={styles.gridMonth}>{itemMonth}</div>;
  };

  const renderMonth = () => {
    return (
      <div>
        {renderMonthSlider()}
        <div style={{ marginTop: 20 }} />
        {renderDeliveryMonth()}
      </div>
    );
  };
  const renderDeliveryYearItem = (item) => {
    const availableYearFromAPI = timeList.some(
      (items) => items.date.split('-')[0] === item
    );

    return (
      <p
        style={
          item === yearActive
            ? {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '40px',
                height: '40px',
                backgroundColor: color.primary,
                borderRadius: '100%',
                color: 'white',
                fontSize: mobileSize ? '11px' : '13px',
                marginLeft: '4px',
                marginRight: '4px',
              }
            : {
                color: 'black',
                fontSize: mobileSize ? '11px' : '13px',
                paddingLeft: '10px',
                paddingRight: '10px',
                opacity: availableYearFromAPI ? 1 : 0.2,
                cursor: availableYearFromAPI ? 'pointer' : 'not-allowed',
                pointerEvents: !availableYearFromAPI && 'none',
              }
        }
        onClick={() => {
          setSelectedYear(item);
          setYearActive(item);
        }}
      >
        {item}
      </p>
    );
  };

  const renderDeliveryYear = () => {
    const result = years.map((year) => {
      return (
        <Stack
          key={year}
          direction='row'
          justifyContent='space-between'
          alignItems='center'
          sx={{ paddingTop: '10px', paddingBottom: '10px' }}
        >
          {year.map((item) => {
            return renderDeliveryYearItem(item);
          })}
        </Stack>
      );
    });
    return <div>{result}</div>;
  };

  const renderYear = () => {
    return (
      <div>
        {renderYearSlider()}
        <div style={{ marginTop: 20 }} />
        {renderDeliveryYear()}
      </div>
    );
  };

  const renderConfirmButton = () => {
    const buttonDisabled = !selectTimeDropDown;

    const isTimeSlotEditExist = timeslot.timeslot ? false : buttonDisabled;
    const disableApplyButton = !dateActive;

    if (selector === 'date' || selector === 'month' || selector === 'year') {
      return (
        <Stack
          direction='row'
          justifyContent='space-evenly'
          alignItems='center'
          mt={2}
        >
          <button
            onClick={() => setSelector('dateTime')}
            style={styles.buttonCancel}
          >
            Back
          </button>
          <button
            disabled={disableApplyButton}
            style={styles.buttonConfirm}
            onClick={() => {
              const getSelectedAllDate = `${dateActive}-${selectedMonth}-${selectedYear}`;
              setselectTime(getSelectedAllDate);
              setSelector('');
              const formatForSendApi = moment()
                .year(selectedYear)
                .month(selectedMonth)
                .date(dateActive)
                .format('YYYY MM DD');
              setGetDateBaseOnClick(changeFormatDate(formatForSendApi));
              if (!validationOrderingGuestMode?.maxDays) {
                dispatch({
                  type: CONSTANT.SAVE_TIMESLOT_CALENDER,
                  payload: changeFormatDate(formatForSendApi),
                });
              }

              dispatch({ type: CONSTANT.SAVE_DATE, payload: '' });
              dispatch({ type: CONSTANT.SAVE_TIMESLOT, payload: '' });
              dispatch({ type: CONSTANT.SAVE_TIME, payload: '' });
            }}
          >
            Apply
          </button>
        </Stack>
      );
    } else {
      return (
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='center'
          mt={2}
        >
          <button onClick={onClose} style={styles.buttonCancel}>
            Cancel
          </button>
          <button
            onClick={() => {
              if (mode === 'GuestMode') {
                handleSaveDateTimeForGuestMode();
              } else {
                handleSaveDateTime();
              }
            }}
            disabled={isTimeSlotEditExist}
            style={styles.buttonConfirm}
          >
            Confirm
          </button>
        </Stack>
      );
    }
  };

  const compareDateLocalWithDateApi = (changeFormatDate) => {
    return timeList.some((item) => item?.date === changeFormatDate);
  };

  const nameDay = (item) => {
    return moment().format('YYYY-MM-DD') === item
      ? 'TODAY'
      : moment(item).format('ddd').toLocaleUpperCase();
  };

  let filteredItem;
  let dateListEdit;

  if (saveTimeSlotCalendar) {
    if (!validationOrderingGuestMode?.maxDays) {
      getAllDateForTimeSlot.sort((item) => {
        if (saveTimeSlotCalendar === item.split(' ').join('-')) {
          return -1;
        } else {
          return 1;
        }
      });
      const splitFormatDate = saveTimeSlotCalendar.split('-').join('');

      const dateFiltered = getAllDateForTimeSlot.filter(
        (item) => Number(item.split(' ').join('')) >= Number(splitFormatDate)
      );

      const dateSorted = dateFiltered.sort(
        (a, b) => Number(a.split(' ').join('')) - Number(b.split(' ').join(''))
      );
      filteredItem = dateSorted;
    }
  }

  if (dateEdit.date || saveTimeSlotForEdit) {
    if (!validationOrderingGuestMode?.maxDays) {
      getAllDateForTimeSlot.sort((item) => {
        if (dateEdit.date === item.split(' ').join('-')) {
          return -1;
        } else {
          return 1;
        }
      });
      const splitFormatDate = saveTimeSlotForEdit.split('-').join('');

      const dateFiltered = getAllDateForTimeSlot.filter(
        (item) => Number(item.split(' ').join('')) >= Number(splitFormatDate)
      );

      const dateSorted = dateFiltered.sort(
        (a, b) => Number(a.split(' ').join('')) - Number(b.split(' ').join(''))
      );
      dateListEdit = dateSorted;
    }
  }

  const renderChildTimeSlotScroolGuestCO = (arrayDate) => {
    if (
      validationOrderingGuestMode?.maxDays &&
      validationOrderingGuestMode?.maxDays !== 0
    ) {
      const data = arrayDate;
      const modifyLengthArray = 5;

      data.length = modifyLengthArray;
    }
    return arrayDate?.map((itemDate) => {
      const baseStyleStack = {
        width: '80px',
        height: '100px',
        borderRadius: '10px',
      };
      const baseCycleStyle = {
        display: 'flex',
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
      };

      const stackStyle =
        changeFormatDate(itemDate) === dateEdit.date ||
        changeFormatDate(itemDate) === getDateBaseOnClick
          ? {
              ...baseStyleStack,
              backgroundColor: color.primary,
              border: `1px solid ${color.primary}80`,
              color: 'white',
            }
          : !compareDateLocalWithDateApi(changeFormatDate(itemDate)) ||
            dateExistsInComparisons(itemDate, dateArrayMaxDaysGuest)
          ? {
              ...baseStyleStack,
              backgroundColor: 'white',
              border: `1px solid ${color.primary}80`,
              color: 'gray',
              opacity: '.4',
              pointerEvents: 'none',
              cursor: 'not-allowed',
            }
          : {
              ...baseStyleStack,
              backgroundColor: 'white',
              border: `1px solid ${color.primary}80`,
              color: color.primary,
            };

      const cycleStyle =
        changeFormatDate(itemDate) === dateEdit.date ||
        changeFormatDate(itemDate) === getDateBaseOnClick
          ? {
              ...baseCycleStyle,
              color: color.primary,
              backgroundColor: 'white',
            }
          : !compareDateLocalWithDateApi(changeFormatDate(itemDate))
          ? {
              ...baseCycleStyle,
              backgroundColor: color.primary,
            }
          : {
              ...baseCycleStyle,
              backgroundColor: color.primary,
              color: 'white',
            };

      return (
        <SwiperSlide
          key={changeFormatDate(itemDate)}
          style={{ flexShrink: 'unset' }}
        >
          <Stack
            direction='column'
            alignItems='center'
            justifyContent='space-around'
            sx={stackStyle}
            onClick={() => {
              setSelectTimeDropDown('');
              setselectTime(changeFormatDate(itemDate));
              setGetDateBaseOnClick(changeFormatDate(itemDate));
              dispatch({ type: CONSTANT.SAVE_DATE, payload: '' });
              dispatch({ type: CONSTANT.SAVE_TIMESLOT, payload: '' });
              dispatch({ type: CONSTANT.SAVE_TIME, payload: '' });
            }}
          >
            <Typography>{nameDay(changeFormatDate(itemDate))}</Typography>
            <div style={cycleStyle}>
              <Typography>
                {moment(changeFormatDate(itemDate)).format('DD')}
              </Typography>
            </div>
            <Typography>
              {moment(changeFormatDate(itemDate))
                .format('MM')
                .toLocaleUpperCase()}
            </Typography>
          </Stack>
        </SwiperSlide>
      );
    });
  };
  const renderTimeScroll = () => {
    if (!timeList) {
      return (
        <Stack direction='column' alignItems='center' justifyContent='center'>
          <Typography
            style={{ fontSize: '13px', color: 'gray', padding: '20px' }}
          >
            Wait we get your Time...
          </Typography>
        </Stack>
      );
    } else {
      if (filteredItem) {
        return renderChildTimeSlotScroolGuestCO(filteredItem);
      } else if (dateListEdit) {
        return renderChildTimeSlotScroolGuestCO(dateListEdit);
      } else {
        return renderChildTimeSlotScroolGuestCO(getAllDateForTimeSlot);
      }
    }
  };

  const renderAvailableText = () => {
    return (
      <Stack
        direction='column'
        spacing={3}
        width='100%'
        justifyContent='center'
        alignItems='center'
        divider={
          <Divider orientation='horizontal' flexItem sx={{ opacity: 0.3 }} />
        }
      >
        <Stack
          direction='row'
          spacing={{ xs: 1, sm: 2, md: 2 }}
          justifyContent='space-between'
          alignItems='center'
          width='100%'
        >
          <div style={styles.wrapListTextAvailabel}>
            <div style={styles.wrapTextNotAvailable} />
            <Typography
              sx={{
                fontSize: mobileSize ? '10px' : '13px',
                fontWeight: 'bold',
                marginLeft: '5px',
              }}
            >
              Not Available
            </Typography>
          </div>
          <div style={styles.wrapListTextAvailabel}>
            <div style={styles.wrapTextAvailable} />
            <Typography
              sx={{
                fontSize: mobileSize ? '10px' : '13px',
                fontWeight: 'bold',
                marginLeft: '5px',
              }}
            >
              Available
            </Typography>
          </div>
          <div style={styles.wrapListTextAvailabel}>
            <div style={styles.wrapTextChoosenDate} />
            <Typography
              sx={{
                fontSize: mobileSize ? '10px' : '13px',
                fontWeight: 'bold',
                marginLeft: '5px',
              }}
            >
              Choosen Date
            </Typography>
          </div>
        </Stack>
        <div style={{ width: '100%' }}>
          <DropDownCustomSelect
            setSelectTimeDropDown={setSelectTimeDropDown}
            selectTimeDropDown={selectTimeDropDown}
            timeList={timeList}
            getDateBaseOnClick={getDateBaseOnClick}
            valueEditTimeSlot={timeslot}
          />
        </div>
        <Stack
          direction='row'
          spacing={{ xs: 1, sm: 2, md: 4 }}
          justifyContent='space-between'
          alignItems='center'
          width='100%'
          sx={styles.wrapperChooseDateTime}
        >
          <Typography
            sx={{
              marginLeft: '3px',
              fontWeight: 'bold',
              fontSize: mobileSize ? '10px' : '13px',
              paddingTop: !dateEdit?.date && '10px',
              paddingBottom: !dateEdit?.date && '10px',
            }}
          >
            Chosen Date & Time
          </Typography>
          <Stack
            direction='column'
            justifyContent='center'
            alignItems='flex-end'
            spacing={{ xs: '4px', sm: 1, lg: 1 }}
            style={{ width: '50%' }}
          >
            <div style={{ display: 'flex' }}>
              <Typography sx={styles.textChooseDateTime}>
                {dateEdit?.date
                  ? `${moment(dateEdit.date).format('DD')} /`
                  : selectTime
                  ? `${moment(selectTime).format('DD')} /`
                  : ''}
              </Typography>
              <Typography sx={styles.textChooseDateTime}>
                {dateEdit?.date
                  ? `${moment(dateEdit.date)
                      .format('MM')
                      .toLocaleUpperCase()} / `
                  : selectTime
                  ? `${moment(selectTime).format('MM').toLocaleUpperCase()} / `
                  : ''}
              </Typography>
              <Typography sx={styles.textChooseDateTime}>
                {dateEdit?.date
                  ? moment(dateEdit.date).format('YYYY').toLocaleUpperCase()
                  : selectTime
                  ? moment(selectTime).format('YYYY').toLocaleUpperCase()
                  : ''}
              </Typography>
            </div>
            <div style={{ display: 'flex' }}>
              <Typography sx={styles.textChooseDateTime}>
                {timeslot?.timeslot
                  ? `At ${timeslot.timeslot}`
                  : selectTimeDropDown
                  ? `At ${selectTimeDropDown}`
                  : ''}
              </Typography>
            </div>
          </Stack>
        </Stack>
      </Stack>
    );
  };

  const renderTime = () => {
    const isMaxDays = validationOrderingGuestMode?.maxDays;
    const isShowSeeMoreDateGuesCO =
      isMaxDays !== undefined && isMaxDays !== null && isMaxDays <= 5;
    return (
      <Stack
        direction='column'
        spacing={2}
        justifyContent='center'
        alignItems='center'
      >
        <Swiper
          style={{
            width: '100%',
          }}
          slidesPerView='auto'
          spaceBetween={12}
        >
          {renderTimeScroll()}
        </Swiper>
        {!isShowSeeMoreDateGuesCO && (
          <div
            style={styles.wrapSeeMoreDate}
            onClick={() => setSelector('date')}
          >
            <Typography
              sx={{
                color: color.primary,
                fontWeight: 'bold',
                fontSize: '12px',
              }}
            >
              See More Date
            </Typography>
            <KeyboardArrowRight style={{ color: '#4D86A0' }} />
          </div>
        )}
        {renderAvailableText()}
      </Stack>
    );
  };

  const renderBody = () => {
    switch (selector) {
      case 'date':
        return <div>{renderDate()}</div>;
      case 'month':
        return <div>{renderMonth()}</div>;
      case 'year':
        return <div>{renderYear()}</div>;
      default:
        return <div>{renderTime()}</div>;
    }
  };
  return (
    <div>
      <div style={{ marginTop: 20 }} />
      {renderBody()}
      <div style={{ marginTop: 16 }} />
      {renderConfirmButton()}
    </div>
  );
};

export default Calendar;
