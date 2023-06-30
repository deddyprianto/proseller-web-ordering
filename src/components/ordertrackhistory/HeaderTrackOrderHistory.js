/* eslint-disable react/prop-types */
import React from 'react';
import { useHistory } from 'react-router-dom';
import ArrowLeftIcons from '../../assets/images/panah.png';
import style from './style/style.module.css';

const HeaderTrackOrderHistory = ({ matches }) => {
  const history = useHistory();

  return (
    <div
      style={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gridTemplateRows: '1fr',
        marginTop: matches ? '95px' : '70px',
      }}
      onClick={() => history.goBack()}
    >
      <img
        src={ArrowLeftIcons}
        style={{ marginLeft: '10px' }}
        alt='ic_arrow_left'
      />
      <div className={style.title2} style={{ textAlign: 'center' }}>
        Order History
      </div>
    </div>
  );
};

export default HeaderTrackOrderHistory;
