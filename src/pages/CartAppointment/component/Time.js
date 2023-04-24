import React from 'react';
import { useSelector } from 'react-redux';
import DropDownCustomSelect from './DropDownCustomSelect';

const Time = ({ messageTimeSlot, timeslot }) => {
  const date = useSelector((state) => state.appointmentReducer.date);
  const filterTimeSlot = timeslot?.find((item) => item.date === date);
  if (!messageTimeSlot) {
    return (
      <div
        style={{
          width: '93%',
          margin: 'auto',
          marginTop: '20px',
          marginBottom: '20px',
        }}
      >
        <p style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}>
          Select Time
        </p>
        <div style={{ width: '100%' }}>
          <DropDownCustomSelect timeList={filterTimeSlot?.timeSlot} />
        </div>
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

export default Time;
