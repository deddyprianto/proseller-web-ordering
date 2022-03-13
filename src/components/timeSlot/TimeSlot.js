import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import moment from 'moment';
import { OrderAction } from 'redux/actions/OrderAction';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { isEmptyArray } from 'helpers/CheckEmpty';
import { isEmptyObject } from 'jquery';

const TimeSlotDialog = ({ open, onClose }) => {
  const colorState = useSelector((state) => state.theme.color);
  const orderingMode = useSelector((state) => state.order.orderingMode);
  const defaultOutlet = useSelector((state) => state.outlet.defaultOutlet);
  const dateSlotSelected = useSelector((state) => state.order.orderActionDate);
  const timeSlotSelected = useSelector((state) => state.order.orderActionTime);

  const dispatch = useDispatch();
  const style = {
    dialogContent: {
      '& .MuiDialogContent-root': {
        paddingBottom: 0,
        justifyContent: 'space-between',
      },
    },
    buttonSave: {
      textTransform: 'none',
      fontSize: '1.5rem',
      fontWeight: 600,
      color: colorState.textButtonColor,
      backgroundColor: colorState.primary,
      height: 40,
      '&:hover': {
        backgroundColor: '#DCDCDC',
      },
    },
    dialogTitle: {
      borderBottom: '1px solid #e5e5e5',
      marginBottom: 2,
    },
    boxContent: {
      display: 'flex',
      flexDirection: 'column',
      m: 'auto',
      paddingY: '0.5rem',
    },
    button: {
      width: '100%',
      borderRadius: 2,
      height: 45,
      marginBottom: '0.5rem',
      color: colorState.primary,
      boxShadow: '0 0 2px 0px #666',
      fontWeight: 600,
      fontSize: 14,
    },
    buttonSelected: {
      width: '100%',
      borderRadius: 2,
      height: 45,
      marginBottom: '0.5rem',
      color: colorState.primary,
      fontWeight: 600,
      fontSize: 14,
      borderStyle: 'solid',
      borderWidth: 'thin',
      borderColor: 'rgb(61, 70, 79)',
    },
  };

  const [textTitle, setTextTitle] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDate, setSelectedDate] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [availableTime, setAvailableTime] = useState([]);
  let dateList = [];

  const [showMore, setShowMore] = useState(false);
  const [startIndex, setStartIndex] = useState(
    dateSlotSelected || selectedDate
  );

  const dateMax = availableTimeSlots[availableTimeSlots?.length - 1]?.date;
  const dateMin = moment(new Date()).format('YYYY-MM-DD');

  const handleCheckTextTitle = useCallback(async () => {
    if (orderingMode === 'DELIVERY') {
      setTextTitle('Delivery');
    } else {
      setTextTitle('Pickup');
    }
  }, [orderingMode]);

  const handleChangeTime = (event) => {
    setSelectedTime(event.target.value);
  };

  const handleSaveDateTime = async () => {
    setIsLoading(true);
    const [orderActionTime] = selectedTime?.split('-');

    try {
      // date of time slot
      await dispatch(
        OrderAction.setData(selectedDate, 'SET_ORDER_ACTION_DATE')
      );

      // action time slot range
      await dispatch(
        OrderAction.setData(orderActionTime?.trim(), 'SET_ORDER_ACTION_TIME')
      );

      //action time slot
      await dispatch(
        OrderAction.setData(selectedTime, 'SET_ORDER_ACTION_TIME_SLOT')
      );
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
    onClose();
  };

  const getOutletAndTimeData = useCallback(
    async (orderingMode) => {
      setIsLoading(true);
      let dateTime = new Date();
      let maxDays = 90;

      if (!isEmptyArray(defaultOutlet)) {
        maxDays = defaultOutlet?.timeSlots[0]?.interval;
      }

      let payload = {
        outletID: defaultOutlet.sortKey,
        clientTimezone: Math.abs(dateTime.getTimezoneOffset()),
        date: moment(dateTime).format('YYYY-MM-DD'),
        maxDays: maxDays,
        orderingMode: orderingMode,
      };

      const response = await dispatch(OrderAction.getTimeSlot(payload));

      if (response.resultCode === 200) {
        if (dateSlotSelected) {
          setSelectedDate(dateSlotSelected);
        } else {
          setSelectedDate(response.data[0].date);
        }
        setAvailableTimeSlots(response.data);
      }
      setIsLoading(false);
    },
    [dateSlotSelected]
  );

  useEffect(() => {
    handleCheckTextTitle();
    getOutletAndTimeData(orderingMode);
    setShowMore(false);
  }, [getOutletAndTimeData, handleCheckTextTitle, open, orderingMode]);

  //render time slot button
  const renderButton = () => {
    for (let index = 0; index < 5; index++) {
      const temp = moment(startIndex).add(index, 'days');
      dateList.push(moment(temp).format('YYYY-MM-DD'));
    }

    const render = dateList.map((item, index) => {
      return (
        <Grid item xs={2} key={index}>
          <LoadingButton
            sx={{
              textAlign: 'center',
              padding: 0,
              minHeight: 70,
              minWidth: '40px',
              maxWidth: '200px',
              width: '100%',
              '&:hover': {
                backgroundColor: colorState.primary,
              },
              backgroundColor:
                item === selectedDate ? colorState.primary : '#dcdcdc',
              color:
                item === selectedDate
                  ? colorState.textButtonColor
                  : colorState.font,
            }}
            loading={false}
            loadingIndicator='Loading...'
            variant='contained'
            disabled={isLoading}
            key={index}
            onClick={() => {
              setSelectedTime(null);
              setSelectedDate(item);
            }}
          >
            <Grid
              container
              direction='column'
              justifyContent='center'
              alignItems='center'
            >
              <Grid item>
                <Typography fontWeight={500}>
                  {item === moment(new Date()).format('YYYY-MM-DD')
                    ? 'Today'
                    : moment(item).format('ddd')}
                </Typography>
              </Grid>
              <Grid item>
                <Typography fontWeight='bold' fontSize={18}>
                  {moment(item).format('DD')}
                </Typography>
              </Grid>
              <Grid item>
                <Typography fontWeight='bold' fontSize={12}>
                  {moment(item).format('MMM')}
                </Typography>
              </Grid>
            </Grid>
          </LoadingButton>
        </Grid>
      );
    });
    return render;
  };

  useEffect(() => {
    const handleCheckAvailableTime = async () => {
      const filterSelectedDateAvailable = await availableTimeSlots.filter(
        (item) => item.date === selectedDate
      );
      if (filterSelectedDateAvailable) {
        setAvailableTime(filterSelectedDateAvailable);
      }
    };

    handleCheckAvailableTime();
  }, [availableTimeSlots, selectedDate]);

  const renderMenuItemSelectTime = () => {
    return availableTime[0]?.timeSlot
      ?.filter((item) => item.isAvailable)
      .map((item, index) => {
        return (
          <MenuItem value={item?.time} key={index}>
            {item?.time}
          </MenuItem>
        );
      });
  };

  return (
    <Dialog fullWidth maxWidth='md' open={open} onClose={onClose}>
      <DialogTitle sx={style.dialogTitle}>
        <Typography
          fontSize={20}
          fontWeight={700}
          className='color'
          textAlign='center'
        >
          {`${textTitle} Date & Time`}
        </Typography>
      </DialogTitle>
      <DialogContent sx={style.dialogContent}>
        <Grid
          container
          direction='row'
          justifyContent='space-between'
          alignItems='center'
        >
          <Grid item xs={6} marginBottom={1}>
            <Typography
              fontSize={12}
              fontWeight={600}
              color={colorState.secondary}
            >
              {`${textTitle} Time`}
            </Typography>
          </Grid>
          <Grid item xs={6} marginBottom={1}>
            <Typography
              fontSize={12}
              fontWeight={600}
              textAlign='right'
              color={colorState.secondary}
              onClick={() => setShowMore(!showMore)}
              textTransform={false}
            >
              Show {`${showMore ? 'Less' : 'More'}`}
            </Typography>
          </Grid>
        </Grid>
        {showMore ? (
          <Calendar
            className='calender'
            onClickDay={(value) => {
              setStartIndex(moment(value).format('YYYY-MM-DD'));
              setSelectedDate(moment(value).format('YYYY-MM-DD'));
            }}
            maxDate={new Date(dateMax)}
            minDate={new Date(dateMin)}
            value={new Date(selectedDate)}
          />
        ) : (
          <Grid container columns={10} spacing={1} marginBottom={2}>
            {renderButton()}
          </Grid>
        )}

        {availableTime?.length === 0 && !isLoading ? (
          <Typography className='text text-warning-theme small'>
            {`Your Selected ${textTitle} date: ${moment(selectedDate).format(
              'DD MMM YYYY'
            )}, doesn't have any available time slot. The next available time slot is ${moment(
              selectedDate
            )
              .add('d', 1)
              .format('DD MMM YYYY')}.`}
          </Typography>
        ) : (
          <FormControl sx={{ marginTop: 2, width: '100%' }}>
            <InputLabel id='demo-simple-select-autowidth-label'>
              {textTitle} Time
            </InputLabel>
            <Select
              defaultValue={timeSlotSelected}
              disabled={isEmptyObject(selectedDate)}
              labelId='demo-simple-select-autowidth-label'
              id='demo-simple-select-autowidth'
              value={selectedTime}
              onChange={handleChangeTime}
              sx={{ width: '100%' }}
              label={`${textTitle} Time`}
            >
              {renderMenuItemSelectTime()}
            </Select>
          </FormControl>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <LoadingButton
          loading={isLoading}
          fullWidth
          disabled={selectedTime && selectedDate ? false : true}
          sx={style.buttonSave}
          onClick={() => handleSaveDateTime()}
        >
          Set Date & Time
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

TimeSlotDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default TimeSlotDialog;
