import React, { useState, useRef, useEffect } from 'react';
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
  const { historyTransaction, loading, error, hasMore, isEmptyData } =
    useHistoryTransaction({
      take: 10,
      skip,
      pageNumber,
    });

  const gridRef = useRef();

  useEffect(() => {
    if (loading) return;
    let tempRef = null;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setSkip((prev) => prev + 10);
        setPageNumber((prev) => prev + 1);
      }
    });
    if (gridRef.current) {
      observer.observe(gridRef.current);
      tempRef = gridRef.current;
    }

    return () => {
      if (tempRef) observer.unobserve(tempRef);
    };
  }, [loading, hasMore]);

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
      <div className='lds-spinner'>
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
      <div
        style={{
          width: '95%',
          margin: 'auto',
          marginTop: '20px',
          height: '75vh',
          overflowY: 'auto',
        }}
      >
        <Grid
          container
          direction='row'
          justifyContent='space-between'
          alignItems='center'
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, md: 12 }}
          sx={{ paddingBottom: '50px' }}
        >
          {historyTransaction.map((items, index) => {
            if (historyTransaction.length === index + 1) {
              return (
                <Grid
                  ref={gridRef}
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
          {loading && <RenderAnimationLoading />}
          {isEmptyData && (
            <div style={{ width: '100%' }}>
              <p
                className='default-font'
                style={{ color: '#9D9D9D', marginLeft: '20px' }}
              >
                You are all caught up
              </p>
            </div>
          )}
          {error?.message && (
            <p style={{ marginLeft: '10px' }}>{error?.message}</p>
          )}
        </Grid>
      </div>
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
