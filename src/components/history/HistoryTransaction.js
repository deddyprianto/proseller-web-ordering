import React, { useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Grid';
import config from '../../config';
import HistoryCard from './HistoryCardPending';
import ModalDetailHistory from './ModalDetailHistory';
import useHistoryTransaction from 'hooks/useHistoryTransaction';
import './style/style.css';

const HistoryTransaction = ({ countryCode }) => {
  const [detailData, setDetailData] = useState({});
  const [pageNumber, setPageNumber] = useState(1);
  const [skip, setSkip] = useState(10);
  const { historyTransaction, loading, error, hasMore } = useHistoryTransaction(
    {
      take: 10,
      skip,
      pageNumber,
    }
  );

  const observer = useRef();
  const lastEl = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setSkip((prev) => prev + 10);
          setPageNumber((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  if (historyTransaction.length === 0 && !loading) {
    return (
      <>
        <img src={config.url_emptyImage} alt='is empty' />
        <div>Data is empty</div>
      </>
    );
  }
  const RenderAnimationLoading = () => {
    return (
      <div
        className='lds-spinner'
        style={{ marginTop: historyTransaction.length === 0 ? '200px' : '0px' }}
      >
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
  };

  return (
    <>
      <ModalDetailHistory detail={detailData} countryCode />
      <Grid
        container
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, md: 12 }}
      >
        {historyTransaction.map((items, index) => {
          if (historyTransaction.length === index + 1) {
            return (
              <Grid
                ref={lastEl}
                item
                xs={4}
                md={6}
                key={index}
                data-toggle='modal'
                data-target='#detail-transaction-modal'
                onClick={() => setDetailData(items)}
              >
                <HistoryCard items={items} countryCode={countryCode} />
              </Grid>
            );
          } else {
            return (
              <Grid
                item
                xs={4}
                md={6}
                key={index}
                data-toggle='modal'
                data-target='#detail-transaction-modal'
                onClick={() => setDetailData(items)}
              >
                <HistoryCard items={items} countryCode={countryCode} />
              </Grid>
            );
          }
        })}
        {!error && loading && <RenderAnimationLoading />}
        {error?.message && (
          <p style={{ marginLeft: '10px' }}>
            You have reached the end of the list.
          </p>
        )}
      </Grid>
    </>
  );
};

HistoryTransaction.defaultProps = {
  countryCode: 'ID',
};

HistoryTransaction.propTypes = {
  countryCode: PropTypes.string,
};

export default HistoryTransaction;
