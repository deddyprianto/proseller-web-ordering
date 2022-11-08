/* eslint-disable react/button-has-type */
import React, { useState, useRef } from 'react';
import TrackOrderIcon from '../../assets/images/searchtrackorder.png';
import style from './style/style.module.css';
import { useHistory } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSelector, useDispatch } from 'react-redux';
import { OrderAction } from 'redux/actions/OrderAction';
import LoadingOverlay from 'react-loading-overlay';
import ArrowLeftIcons from 'assets/images/panah.png';
import IconsWrong from 'assets/images/IconsWrong.png';

const TrackOrder = () => {
  const [isLoading, setIsLoading] = useState(false);
  const inputFieldRef = useRef(null);
  const dispatch = useDispatch();
  const color = useSelector((state) => state.theme.color);
  const matches = useMediaQuery('(min-width:1200px)');
  const history = useHistory();
  const [trackOrderNotif, setTrackOrderNotif] = useState(false);
  const [messageNotif, setMessageNotif] = useState('');

  const handleTrackOrder = async () => {
    if (!inputFieldRef.current.value) {
      setTrackOrderNotif(!trackOrderNotif);
      setMessageNotif(
        'You’ve entered wrong Ref. No., please enter the correct one.'
      );
    } else {
      setIsLoading(true);
      let response = await dispatch(
        OrderAction.getTrackOrder(inputFieldRef.current.value)
      );
      if (response?.resultCode === 404) {
        setTrackOrderNotif(!trackOrderNotif);
        setMessageNotif(
          'You’ve entered wrong Ref. No., please enter the correct one.'
        );
      } else {
        history.push('/ordertrackhistory');
      }
      setIsLoading(false);
    }
  };

  const renderNotif = () => {
    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
        }}
      >
        <div
          style={{
            width: '95%',
            borderRadius: '10px',
            backgroundColor: '#CE0E0E',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <img
            src={IconsWrong}
            onClick={() => setTrackOrderNotif((prev) => !prev)}
            style={{
              flex: 0,
              alignSelf: 'center',
              cursor: 'pointer',
              margin: '0px 10px',
            }}
          />

          <p
            style={{
              margin: 0,
              padding: '5px 0px',
              textAlign: 'left',
              flex: 1,
            }}
            className={style.title}
          >
            {messageNotif}
          </p>
        </div>
      </div>
    );
  };
  const headerTrackOrder = () => {
    return (
      <div className={style.containerHeader}>
        {trackOrderNotif && renderNotif()}
        <img
          style={{ paddingLeft: '10px' }}
          src={ArrowLeftIcons}
          onClick={() => history.goBack()}
        />
        <div className={style.title}>Track Order</div>
      </div>
    );
  };
  return (
    <LoadingOverlay active={isLoading} spinner text='Loading...'>
      <div
        style={{
          width: matches ? '30%' : '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          height: matches ? '100vh' : '90vh',
          overflowY: 'auto',
        }}
      >
        <div className={style.container}>
          <div className={style.containerMain}>
            {headerTrackOrder()}
            <img
              src={TrackOrderIcon}
              alt='icon search'
              width={200}
              height={100}
            />
            <h1 className={style.title2}>
              You can track your order by input the Ref. no
            </h1>
            <div className={style.containerInput}>
              <p className={style.title3}>Ref. No.</p>
              <div className={style.borderInput}>
                <input
                  ref={inputFieldRef}
                  placeholder='Input Text'
                  style={{ paddingLeft: '10px', width: '100%' }}
                />
              </div>
            </div>
          </div>
          <div className={style.bottomFooter}>
            <button
              style={{
                backgroundColor: color.primary,
                fontFamily: 'Plus Jakarta Sans',
                fontSize: '14px',
                borderRadius: '10px',
                width: '95%',
                textAlign: 'center',
                color: 'white',
                padding: '10px',
                cursor: 'pointer',
              }}
              onClick={handleTrackOrder}
            >
              Track Order
            </button>
          </div>
          <div style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
    </LoadingOverlay>
  );
};

export default TrackOrder;
