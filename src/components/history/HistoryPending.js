import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Grid';

import config from '../../config';

import { Link } from 'react-router-dom';
import HistoryCard from './HistoryCardPending';
const encryptor = require('simple-encryptor')(process.env.REACT_APP_KEY_DATA);

const HistoryPending = ({ dataPending, dataPendingLength }) => {
  const setLocalStorageItem = (items) => {
    localStorage.setItem(
      `${config.prefix}_dataBasket`,
      JSON.stringify(encryptor.encrypt(items))
    );
  };

  if (dataPendingLength === 0) {
    return (
      <>
        <img src={config.url_emptyImage} alt='is empty' />
        <div>Data is empty</div>
      </>
    );
  }

  return (
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
              <HistoryCard items={items} />
            </Link>
          </Grid>
        );
      })}
      <div style={{ width: '100%' }}>
        <p className='default-font' style={{ color: '#9D9D9D' }}>
          You are all caught up
        </p>
      </div>
    </Grid>
  );
};

HistoryPending.defaultProps = {
  dataPending: [],
  dataPendingLength: 0,
};

HistoryPending.propTypes = {
  dataPending: PropTypes.arrayOf(PropTypes.object),
  dataPendingLength: PropTypes.string,
};

export default HistoryPending;
