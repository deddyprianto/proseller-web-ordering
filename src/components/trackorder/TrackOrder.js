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
import screen from 'hooks/useWindowSize';
import { CONSTANT } from 'helpers';

const TrackOrder = () => {
  const responsiveDesign = screen();
  const inputFieldRef = useRef(null);
  const dispatch = useDispatch();
  const color = useSelector((state) => state.theme.color);
  const matches = useMediaQuery('(min-width:1200px)');
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [trackOrderNotif, setTrackOrderNotif] = useState(false);
  const [messageNotif, setMessageNotif] = useState('');

  const handleTrackOrder = async () => {
    if (!inputFieldRef.current.value) {
      setTrackOrderNotif(true);
      setMessageNotif('Please input your Ref. No');
    } else {
      setIsLoading(true);
      let response = await dispatch(
        OrderAction.getTrackOrder(inputFieldRef.current.value)
      );
      setIsLoading(false);
      dispatch({
        type: CONSTANT.SAVE_ID_TRACKORDER,
        payload: inputFieldRef.current.value,
      });
      if (response?.resultCode === 404) {
        setTrackOrderNotif(true);
        setMessageNotif(
          'You’ve entered wrong Ref. No., please enter the correct one.'
        );
      } else {
        history.push('/ordertrackhistory');
      }
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
            backgroundColor: color.primary,
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '4px',
            height: '50px',
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
            alt='ic_wrong'
          />

          <p
            style={{
              margin: 0,
              padding: '10px 0px',
              textAlign: 'left',
              flex: 1,
              fontSize: '14px',
              lineHeight: '20px',
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
          marginTop: matches ? '80px' : '55px',
        }}
      >
        {trackOrderNotif && renderNotif()}
        <img
          style={{ paddingLeft: '10px' }}
          src={ArrowLeftIcons}
          onClick={() => history.goBack()}
          alt='ic_arrow_left'
        />
        <div className={style.title}>Track Order</div>
      </div>
    );
  };
  return (
    <LoadingOverlay active={isLoading} spinner text='Loading...'>
      <div
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: '1fr',
          gridTemplateRows: '80px 1fr 70px',
          gap: '0px 0px',
          height: `${responsiveDesign.height * 1}px`,
          width: matches ? '45%' : '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '20px',
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
          <div style={{ width: '100%', padding: '0 10px' }}>
            <button
              style={{
                backgroundColor: color.primary,
                fontFamily: 'Plus Jakarta Sans',
                fontSize: '14px',
                borderRadius: '10px',
                width: '100%',
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
        </div>
      </div>
    </LoadingOverlay>
  );
};

export default TrackOrder;
