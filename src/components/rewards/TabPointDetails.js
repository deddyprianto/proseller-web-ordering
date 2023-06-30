import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import ScheduleIcon from '@material-ui/icons/Schedule';

import useWindowSize from 'hooks/useWindowSize';
import './styles/tabPointDetails.css';

const TabPointDetails = ({ detailPoint, campaignDescription }) => {
  const color = useSelector((state) => state.theme.color);
  const screenSize = useWindowSize();

  return (
    <div>
      <div className='container-my-point'>
        <div className='text-my-point'>My Points</div>
        <div className='text-total-point'>{detailPoint.point.toFixed(2)}</div>
      </div>
      <div className='container-detail'>
        {campaignDescription ? (
          <div
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: color.font,
              whiteSpace: 'pre-line',
            }}
          >
            {campaignDescription}
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
              Campaign Rules
            </div>
            <div
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: color.font,
                whiteSpace: 'pre',
              }}
            >
              {`${detailPoint.netSpendToPoint.split(':')[0]} : ${
                detailPoint.netSpendToPoint.split(':')[1]
              }`}
            </div>
            <div
              style={{
                fontSize: '14px',
                fontWeight: '400',
                color: color.font,
              }}
            >
              {`Get ${
                detailPoint.netSpendToPoint.split(':')[1]
              } points for every $${
                detailPoint.netSpendToPoint.split(':')[0]
              } Purchases`}
            </div>
          </div>
        )}
        <div
          style={{
            textAlign: 'center',
            margin: `25px 0 ${screenSize.height * 0.1}px`,
          }}
        >
          {detailPoint.detail.map((items, index) => (
            <div key={index} className='container-history-point'>
              <ScheduleIcon style={{ fontSize: '30px' }} />
              <div style={{ marginLeft: '10px' }}>
                <div className='container-label'>
                  <div>Point :</div>
                  <div
                    style={{
                      marginLeft: '5px',
                      color: color.font,
                    }}
                  >
                    {items.pointBalance.toFixed(2)}
                  </div>
                </div>

                <div className='container-label'>
                  <div>Expiry :</div>
                  <div
                    style={{
                      marginLeft: '5px',
                      color: color.font,
                    }}
                  >
                    {moment(items.expiryDate).format('DD-MM-YYYY')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabPointDetails;
