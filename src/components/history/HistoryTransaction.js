import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import Grid from '@mui/material/Grid';
import Loading from 'components/loading/Loading';
import { HistoryAction } from '../../redux/actions/HistoryAction';
import config from '../../config';
import HistoryCard from './HistoryCardPending';
import ModalDetailHistory from './ModalDetailHistory';

const HistoryTransaction = ({ countryCode }) => {
  const [data, setData] = useState([]);
  const [detailData, setDetailData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      let response = await dispatch(
        HistoryAction.getTransaction({
          take: 1000,
          skip: 0,
        })
      );
      if (response.ResultCode === 200) {
        setData(response.data);
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (isLoading) return <Loading loadingType='NestedList' />;

  if (data.length === 0 && !isLoading) {
    return (
      <>
        <img src={config.url_emptyImage} alt='is empty' />
        <div>Data is empty</div>
      </>
    );
  }

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
        {data.map((items, index) => {
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
        })}
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
