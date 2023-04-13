import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LoadingButton from '@mui/lab/LoadingButton';

const ButtonPrice = ({ changeFormatURl, color }) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const payload = {
    staffId: '{id}',
    bookingTime: '{HH:mm}',
    bookingDate: '{YYYY-MM-DD}',
  };
  const handleSubmit = async () => {
    window.location.href = changeFormatURl('/bookingconfirm');
  };
  const textNotes = useSelector((state) => state.appointmentReducer.textNotes);

  return (
    <LoadingButton
      loading={isLoading}
      onClick={handleSubmit}
      sx={{
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
        textTransform: 'capitalize',
      }}
    >
      Book This Date
    </LoadingButton>
  );
};

export default ButtonPrice;
