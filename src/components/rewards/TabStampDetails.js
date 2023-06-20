import React from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';

import DefaultStampsImage from './StampsImage';
import useWindowSize from 'hooks/useWindowSize';
import './styles/tabStampDetails.css';

const TabStampDetails = () => {
  const stamps = useSelector((state) => state.customer.stamps);
  const screenSize = useWindowSize();

  const data = stamps?.stampsItem;
  const image = stamps?.stampsImage;

  return (
    <div>
      <div className='container-my-stamp'>
        <div className='container-stamp-img'>
          {data?.length && <DefaultStampsImage stampsItem={data} />}
        </div>
        <div className='container-stamp-title'>{stamps?.stampsTitle}</div>
      </div>

      <div
        style={{
          margin: `0 0 ${screenSize.height * 0.1}px`,
          padding: '10px',
        }}
      >
        <div
          className='container-stamp-desc'
          style={{ textAlign: image ? 'justify' : 'center' }}
        >
          {stamps?.stampsSubTitle} <br /> {stamps?.stampsDesc}
        </div>

        {image && (
          <div className='container-stamp-desc'>
            <img
              src={image}
              alt='My stamps'
              style={{ width: '100%', maxWidth: '333px' }}
            />
          </div>
        )}
        <br />
        {stamps?.expiryDate && (
          <span className='color'>
            <b>
              Your stamp will expire on{' '}
              {moment(stamps?.expiryDate).format('DD MMM YYYY')}
            </b>
          </span>
        )}
      </div>
    </div>
  );
};

export default TabStampDetails;
