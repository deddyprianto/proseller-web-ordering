import React, { useState, useEffect, Fragment, useRef } from 'react';
import { useDispatch } from 'react-redux';

import useWindowSize from 'hooks/useWindowSize';
import { CampaignAction } from 'redux/actions/CampaignAction';
import { IconRewards } from 'assets/iconsSvg/Icons';
import LoadingSpinner from './LoadingSpinner';

import './styles/tabPendingPoints.css';

const TabPendingPoints = ({ type }) => {
  const screenSize = useWindowSize();
  const dispatch = useDispatch();
  const rewardRef = useRef();

  const [pendingRewards, setPendingRewards] = useState([]);
  const [isLoading, setIsLoading] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [skip, setSkip] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      const res = await dispatch(
        CampaignAction.getPendingRewards({ skip, take: 10 }, type)
      );

      const checkDataLength = res?.data?.length < res?.dataLength;
      setHasMore(checkDataLength);

      if (checkDataLength) {
        setPendingRewards((prev) => [
          ...new Map(
            [...prev, ...res.data].map((item) => [item['id'], item])
          ).values(),
        ]);
      } else {
        setPendingRewards(res.data);
      }
      setIsLoading(false);
    };

    if (isMounted) {
      setIsLoading(true);
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [dispatch, type, skip]);

  useEffect(() => {
    if (isLoading) return;
    let tempRef = null;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setSkip((prev) => prev + 10);
      }
    });
    if (rewardRef.current) {
      observer.observe(rewardRef.current);
      tempRef = rewardRef.current;
    }

    return () => {
      if (tempRef) observer.unobserve(tempRef);
    };
  }, [isLoading, hasMore]);

  return (
    <div
      style={{
        padding: '0 16px',
        margin: `0 0 ${pendingRewards?.length ? screenSize.height * 0.1 : 0}px`,
      }}
    >
      {pendingRewards?.length ? (
        pendingRewards.map((item, index) => (
          <div
            ref={pendingRewards.length === index + 1 ? rewardRef : null}
            key={index}
            className='text-pending-point'
          >
            You have <b>{item.amount}</b> outstanding {type}s from your
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
                You have no outstanding {type}. Create order to get {type}s!
              </span>
            </Fragment>
          )}
        </div>
      )}
    </div>
  );
};

export default TabPendingPoints;
