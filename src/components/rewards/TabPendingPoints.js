import React, { useState, useEffect, Fragment } from 'react';
import { useDispatch } from 'react-redux';

import useWindowSize from 'hooks/useWindowSize';
import { CampaignAction } from 'redux/actions/CampaignAction';
import { IconRewards } from 'assets/iconsSvg/Icons';
import LoadingSpinner from './LoadingSpinner';

import './styles/tabPendingPoints.css';

const TabPendingPoints = () => {
  const screenSize = useWindowSize();
  const dispatch = useDispatch();

  const [pendingPoints, setPendingPoints] = useState([]);
  const [isLoading, setIsLoading] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      const res = await dispatch(
        CampaignAction.getPendingRewards({ skip: 0, take: 10 }, 'point')
      );
      setPendingPoints(res.data);
      setIsLoading(false);
    };

    fetchData();
  }, [dispatch]);

  return (
    <div
      style={{
        padding: '0 16px',
        margin: `0 0 ${pendingPoints?.length ? screenSize.height * 0.1 : 0}px`,
      }}
    >
      {pendingPoints?.length ? (
        pendingPoints.map((item, index) => (
          <div key={index} className='text-pending-point'>
            You have <b>{item.amount}</b> outstanding point from your
            transaction: <b>{item.transactionRefNo}</b>
          </div>
        ))
      ) : (
        <div
          className='container-loading'
          style={{ height: `${screenSize.height * 0.7}px` }}
        >
          {isLoading ? (
            <LoadingSpinner loading={isLoading} />
          ) : (
            <Fragment>
              <IconRewards />
              <span style={{ marginTop: '36px' }}>
                You have no outstanding stamp. Create order to get stamps!
              </span>
            </Fragment>
          )}
        </div>
      )}
    </div>
  );
};

export default TabPendingPoints;
