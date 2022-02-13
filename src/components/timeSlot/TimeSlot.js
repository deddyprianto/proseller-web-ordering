import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';

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

const TimeSlotDialog = ({ open, onClose, defaultOutlet }) => {
  const colorState = useSelector((state) => state.theme.color);
  //orderingMode in down below is selected ordering mode from local storage.
  const orderingMode = useSelector((state) => state.order.orderingMode);

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

  const [showMore, setShowMore] = useState(false);

  const dateMax = availableTimeSlots[availableTimeSlots?.length - 1]?.date;
  const dateMin = moment().format('YYYY-MM-DD');

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

  const handleChangeDate = (value) => {
    setSelectedDate(value);
    setSelectedTime(value.timeSlot[0].time);
  };

  const handleSaveDateTime = async () => {
    setIsLoading(true);
    const [orderActionTime] = selectedTime?.split('-');

    try {
      // date of time slot
      await dispatch({
        type: 'SET_ORDER_ACTION_DATE',
        payload: selectedDate.date,
      });

      // action time slot range
      await dispatch({
        type: 'SET_ORDER_ACTION_TIME',
        payload: selectedTime,
      });

      //action time slot
      await dispatch({
        type: 'SET_ORDER_ACTION_TIME_SLOT',
        payload: orderActionTime,
      });
    } catch (error) {
      // console.log(error);
    }
    setIsLoading(false);
    onClose();
  };

  const getOutletAndTimeData = useCallback(async () => {
    let dateTime = new Date();
    let maxDays = 90;

    if (!_.isEmpty(defaultOutlet))
      maxDays = defaultOutlet?.timeSlots[0]?.interval;

    let payload = {
      outletID: `outlet::${defaultOutlet.id}`,
      clientTimezone: Math.abs(dateTime.getTimezoneOffset()),
      date: moment(dateTime).format('YYYY-MM-DD'),
      maxDays: maxDays,
      orderingMode,
    };

    const response = await dispatch(OrderAction.getTimeSlot(payload));

    if (response.resultCode === 200) {
      const filteredTimeSlot = response.data.filter((items) => {
        return items.timeSlot.filter((item) => {
          return item.isAvailable;
        });
      });
      setSelectedDate(filteredTimeSlot[0]);
      setAvailableTimeSlots(filteredTimeSlot);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleCheckTextTitle();
    getOutletAndTimeData();
    setShowMore(false);
  }, [open]);

  const renderButton = () => {
    const temp = [];
    for (let index = 0; index < 5; index++) {
      temp.push(availableTimeSlots[index]);
    }
    const render = temp.map((item, index) => {
      return (
        <Grid item xs={2} key={index}>
          <LoadingButton
            sx={{
              textAlign: 'center',
              padding: 0,
              minHeight: 70,
              minWidth: '55px',
              width: '18%',
              '&:hover': {
                backgroundColor: colorState.primary,
              },
              backgroundColor:
                item?.date === selectedDate?.date
                  ? colorState.primary
                  : '#dcdcdc',
              color:
                item?.date === selectedDate?.date
                  ? colorState.textButtonColor
                  : colorState.font,
            }}
            loading={false}
            loadingIndicator='Loading...'
            variant='contained'
            key={index}
            onClick={() => handleChangeDate(item)}
          >
            <Grid
              container
              direction='column'
              justifyContent='center'
              alignItems='center'
            >
              <Grid item>
                <Typography fontWeight={500}>
                  {index === 0 ? 'Today' : moment(item?.date).format('ddd')}
                </Typography>
              </Grid>
              <Grid item>
                <Typography fontWeight='bold' fontSize={18}>
                  {moment(item?.date).format('DD')}
                </Typography>
              </Grid>
              <Grid item>
                <Typography fontWeight='bold' fontSize={12}>
                  {moment(item?.date).format('MMM')}
                </Typography>
              </Grid>
            </Grid>
          </LoadingButton>
        </Grid>
      );
    });
    return render;
  };

  const renderMenuItemSelectTime = () => {
    return selectedDate?.timeSlot?.map((item, index) => {
      return (
        <MenuItem value={item?.time} key={index}>
          {item?.time}
        </MenuItem>
      );
    });
  };

  return (
    <Dialog fullWidth maxWidth={'md'} open={open} onClose={onClose}>
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
          <Grid item xs={6}>
            <Typography
              fontSize={12}
              fontWeight={600}
              color={colorState.secondary}
            >
              {`${textTitle} Time`}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography
              fontSize={12}
              fontWeight={600}
              textAlign='right'
              color={colorState.secondary}
              onClick={() => setShowMore(true)}
              textTransform={false}
            >
              Show More
            </Typography>
          </Grid>
        </Grid>
        {showMore ? (
          <Calendar
            className='calender'
            onChange={(value) => {
              //temp for selected object available time slot
              const [temp] = availableTimeSlots.filter(
                (item) => item.date === moment(value).format('YYYY-MM-DD')
              );

              setSelectedDate(temp);
            }}
            maxDate={new Date(dateMax)}
            minDate={new Date(dateMin)}
            value={new Date(selectedDate.date)}
          />
        ) : (
          <Grid container columns={10} spacing={1} marginBottom={2}>
            {renderButton()}
          </Grid>
        )}
        <FormControl sx={{ marginTop: 2, width: '100%' }}>
          <InputLabel id='demo-simple-select-autowidth-label'>
            {textTitle} Time
          </InputLabel>
          <Select
            disabled={_.isEmpty(selectedDate)}
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
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <LoadingButton
          loading={isLoading}
          fullWidth
          sx={style.buttonSave}
          onClick={() => handleSaveDateTime()}
        >
          Set Date & Time
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

TimeSlotDialog.defaultProps = {
  defaultOutlet: {},
  open: false,
  onClose: null,
};

TimeSlotDialog.propTypes = {
  defaultOutlet: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default TimeSlotDialog;
