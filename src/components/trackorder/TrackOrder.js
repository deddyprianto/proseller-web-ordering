/* eslint-disable react/button-has-type */
import React, { useState, useRef, useEffect } from 'react';
import TrackOrderIcon from '../../assets/images/searchtrackorder.png';
import style from './style/style.module.css';
import { useHistory } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSelector, useDispatch } from 'react-redux';
import { OrderAction } from 'redux/actions/OrderAction';
import LoadingOverlay from 'react-loading-overlay';
import ArrowLeftIcons from 'assets/images/panah.png';
import IconsWrong from 'assets/images/IconsWrong.png';
import screen from 'hooks/useWindowSize';

const TrackOrder = () => {
  const responsiveDesign = screen();
  const [isLoading, setIsLoading] = useState(false);
  const inputFieldRef = useRef(null);
  const dispatch = useDispatch();
  const color = useSelector((state) => state.theme.color);
  const matches = useMediaQuery('(min-width:1200px)');
  const history = useHistory();
  const [trackOrderNotif, setTrackOrderNotif] = useState(false);
  const [messageNotif, setMessageNotif] = useState('');

  useEffect(() => {
    if (trackOrderNotif) {
      setTimeout(() => {
        setTrackOrderNotif(false);
      }, 2000);
    }
  }, [trackOrderNotif]);

  const handleTrackOrder = async () => {
    if (!inputFieldRef.current.value) {
      setTrackOrderNotif(!trackOrderNotif);
      setMessageNotif(
        'You’ve entered wrong Ref. No., please enter the correct one.'
      );
    } else {
      setIsLoading(true);
      const wordsRegex = /^\b(?:\w|-)+\b$/;
      let response = await dispatch(
        OrderAction.getTrackOrder(inputFieldRef.current.value)
      );
      if (response?.resultCode === 404) {
        setTrackOrderNotif(!trackOrderNotif);
        setMessageNotif(
          'You’ve entered wrong Ref. No., please enter the correct one.'
        );
      } else if (!wordsRegex.test(inputFieldRef.current.value)) {
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
      <div
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gridTemplateRows: '1fr',
          paddingTop: matches ? '20px' : '7.5rem',
          marginTop: matches ? '20px' : '0px',
        }}
      >
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
          width: matches ? '40%' : '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          height: matches ? '100vh' : '85vh',
          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gridTemplateRows: matches
              ? '1fr 100px'
              : `1fr ${responsiveDesign.height < 600 ? '45px' : '65px'}`,
            gap: '0px 0px',
            gridAutoFlow: 'row',
            gridTemplateAreas: '"."\n    "."\n    "."',
            height: matches ? '100vh' : '100%',
          }}
        >
          <div
            style={{
              marginTop: matches && '5rem',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              overflowY: 'auto',
            }}
          >
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

          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: matches
                ? 'flex-end'
                : responsiveDesign.height < 600
                ? 'center'
                : 'flex-start',
              marginBottom: matches ? '5px' : '0px',
            }}
          >
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
