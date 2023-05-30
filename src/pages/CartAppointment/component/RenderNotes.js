import { CONSTANT } from 'helpers';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const RenderNotes = () => {
  const dispatch = useDispatch();
  const textNotes = useSelector((state) => state.appointmentReducer.textNotes);
  return (
    <div
      style={{
        marginTop: '20px',
      }}
    >
      <p style={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>
        Add booking notes
      </p>
      <div
        style={{
          width: '100%',
          border: '1px solid rgba(184, 184, 184, 1)',
          borderRadius: '5px',
          color: 'rgba(183, 183, 183, 1)',
          fontSize: '14px',
        }}
      >
        <textarea
          onChange={(e) =>
            dispatch({ type: CONSTANT.TEXT_NOTE, payload: e.target.value })
          }
          placeholder='Example: Please confirm the availability'
          style={{ border: 'none', outline: 'none', color: 'black' }}
          maxlength='140'
        ></textarea>
        <p
          style={{
            padding: 0,
            margin: 0,
            textAlign: 'right',
            fontSize: '12px',
            paddingRight: '10px',
          }}
        >
          {textNotes.length}/140
        </p>
      </div>
      <hr
        style={{
          backgroundColor: 'rgba(249, 249, 249, 1)',
          margin: '20px 0px',
        }}
      />
    </div>
  );
};

export default RenderNotes;
