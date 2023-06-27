import React from 'react';
import EmailIcon from '@material-ui/icons/Email';
import DraftsIcon from '@material-ui/icons/Drafts';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { CONSTANT } from 'helpers';
import customStyleFont from './css/style.module.css';

const InboxCard = ({ items }) => {  
  const dispatch = useDispatch();
  const history = useHistory();
  return (
    <div
      onClick={() => {
        dispatch({
          type: CONSTANT.KEY_GET_BROADCAST_DETAIL,
          data: items,
        });
        history.push('/inboxdetail');
      }}
      className={customStyleFont.myFont}
      style={{
        boxShadow: '0px 4px 10px 0px rgba(0, 0, 0, 0.10)',
        padding: 10,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'row',
        margin: 5,
        borderRadius: 5,
        marginTop: '16px',
      }}
    >
      {!items.isRead ? (
        <div style={{ position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              top: 3,
              right: 8,
              width: '16px',
              height: '16px',
              borderRadius: '100%',
              backgroundColor: 'rgba(207, 48, 48, 1)',
            }}
          />
          <EmailIcon
            className='customer-group-name'
            style={{
              height: 50,
              width: 50,
              marginRight: 10,
            }}
          />
        </div>
      ) : (
        <DraftsIcon
          style={{
            height: 50,
            width: 50,
            marginRight: 10,
          }}
        />
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '100%',
          textAlign: 'left',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <div
            className={!items.isRead ? 'customer-group-name' : ''}
            style={{ fontWeight: 'bold', fontSize: '14px' }}
          >
            {items.name.length > 20
              ? items.name.substring(0, 20).concat('...')
              : items.name}
          </div>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 500,
              color: 'rgba(183, 183, 183, 1)',
            }}
          >
            {moment(items.createdOn).format('DD/MM/YY HH:mm')}
          </div>
        </div>
        <div style={{ fontSize: '12px' }}>
          {items.message.substring(0, 35).concat('...')}
        </div>
      </div>
    </div>
  );
};

export default InboxCard;
