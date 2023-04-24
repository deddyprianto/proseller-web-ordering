import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { OrderAction } from 'redux/actions/OrderAction';
import loader from '../style/styles.module.css';

const ButtonPrice = ({ changeFormatURl, color }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const date = useSelector((state) => state.appointmentReducer.date);
  const time = useSelector((state) => state.appointmentReducer.time);
  const staffID = useSelector((state) => state.appointmentReducer.staffID);

  const handleSubmit = async () => {
    if (date && time && staffID) {
      const payload = {
        staffId: staffID,
        bookingTime: time,
        bookingDate: date,
        note: 'extNotes',
      };
      setIsLoading(true);
      const data = await dispatch(OrderAction.submitCartAppointment(payload));
      setIsLoading(false);
      if (data.message === 'Cart submitted successfully') {
        window.location.href = changeFormatURl('/bookingconfirm');
      }
    }
  };

  return (
    <div
      onClick={handleSubmit}
      style={{
        width: '95%',
        margin: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        borderRadius: '10px',
        padding: '5px',
        fontSize: '16px',
        fontWeight: 600,
        textTransform: 'capitalize',
        backgroundColor:
          date && time && staffID ? color.primary : 'rgba(183, 183, 183, 1)',
        cursor: date && time && staffID ? 'pointer' : 'not-allowed',
        pointerEvents: !date && !time && !staffID && 'none',
        marginBottom: '5px',
        marginTop: '5px',
      }}
    >
      {isLoading ? <span className={loader.loader}></span> : 'Book this date'}
    </div>
  );
};

export default ButtonPrice;
