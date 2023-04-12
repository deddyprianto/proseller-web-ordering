import React from 'react';
import { useSelector } from 'react-redux';

const ButtonPrice = ({ changeFormatURl, color }) => {
  const textNotes = useSelector((state) => state.appointmentReducer.textNotes);
  return (
    <div
      onClick={() => {
        window.location.href = changeFormatURl('/bookingconfirm');
      }}
      style={{
        width: '93%',
        margin: 'auto',
        marginTop: '20px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: textNotes ? color.primary : 'rgba(183, 183, 183, 1)',
        cursor: 'pointer',
        pointerEvents: !textNotes && 'none',
        color: 'white',
        borderRadius: '10px',
        padding: '5px',
        fontSize: '16px',
        fontWeight: 600,
      }}
    >
      Book This Date
    </div>
  );
};

export default ButtonPrice;
