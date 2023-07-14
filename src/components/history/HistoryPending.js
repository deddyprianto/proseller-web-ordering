import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';

import config from 'config';
import InboxCard from './HistoryCardPending';
import useMobileSize from 'hooks/useMobileSize';

const encryptor = require('simple-encryptor')(process.env.REACT_APP_KEY_DATA);

const HistoryPending = ({ dataPending, dataPendingLength, isAppointment }) => {
  const mobileSize = useMobileSize();

  const setLocalStorageItem = (items) => {
    localStorage.setItem(
      `${config.prefix}_dataBasket`,
      JSON.stringify(encryptor.encrypt(items))
    );
  };

  if (dataPendingLength === 0) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <img src={config.url_emptyImage} alt='is empty' />
        <div>Data is empty</div>
      </div>
    );
  }

  return (
    <div
      style={{
        marginTop: '16px',
        height: '60vh',
        overflowY: 'auto',
        paddingBottom: 20,
      }}
    >
      <Grid
        container
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, md: 12 }}
      >
        {dataPending.map((items, index) => {
          return (
            <Grid item xs={4} md={6} key={index}>
              <Link
                to={items.isPaymentComplete ? '/history/detail' : '/basket'}
                onClick={() => setLocalStorageItem(items)}
              >
                <InboxCard items={items} />
              </Link>
            </Grid>
          );
        })}
        <div
          style={{ width: '100%', marginTop: dataPending?.length ? 0 : '20px' }}
        >
          <p
            className='default-font'
            style={{ color: '#9D9D9D', textAlign: 'center', marginTop: '10px' }}
          >
            You are all caught up
          </p>
        </div>
      </Grid>
    </div>
  );
};

HistoryPending.defaultProps = {
  dataPending: [],
  dataPendingLength: 0,
};

HistoryPending.propTypes = {
  dataPending: PropTypes.arrayOf(PropTypes.object),
  dataPendingLength: PropTypes.number,
};

export default HistoryPending;
