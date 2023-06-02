import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CONSTANT } from 'helpers';

const ButtonPrice = ({ changeFormatURl, color, cartAppointment }) => {
  const dispatch = useDispatch();
  const date = useSelector((state) => state.appointmentReducer.date);
  const time = useSelector((state) => state.appointmentReducer.time);
  const staffID = useSelector((state) => state.appointmentReducer.staffID);

  const handleSubmit = async () => {
    if (date && time && staffID) {
      dispatch({
        type: CONSTANT.CART_SAVE_APPOINTMENT,
        payload: cartAppointment,
      });
      window.location.href = changeFormatURl('/bookingconfirm');
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
      Book this date
    </div>
  );
};

export default ButtonPrice;
