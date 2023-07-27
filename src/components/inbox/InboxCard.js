import React from 'react';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { CONSTANT } from 'helpers';
import customStyleFont from './css/style.module.css';
import inboxMail from 'assets/images/inboxMail.png';
import inboxMailOpened from 'assets/images/inboxMailOpened.png';

const InboxCard = ({ items }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const changeFormatDateLikeDesign = (inputDateString) => {
    const currentDate = new Date();
    const inputDate = new Date(inputDateString);

    const diffInMilliseconds = currentDate - inputDate;
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

    if (diffInMilliseconds < oneDayInMilliseconds) {
      return 'Today';
    } else if (diffInMilliseconds < 2 * oneDayInMilliseconds) {
      return 'Yesterday';
    } else if (inputDate.getFullYear() === currentDate.getFullYear()) {
      return inputDate.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
      });
    } else {
      return inputDate.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: '2-digit',
      });
    }
  };

  const renderIcon = () => {
    if (!items.isRead) {
      return (
        <div style={{ position: 'relative' }}>
          <img width={21} height={21} src={inboxMail} alt='icon mail' />
        </div>
      );
    } else {
      return (
        <img src={inboxMailOpened} height={21} width={21} alt='icon mail' />
      );
    }
  };

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
        padding: '16px',
        cursor: 'pointer',
        borderRadius: 5,
        marginTop: '20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          height: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {renderIcon()}
          <div
            className={!items.isRead ? 'customer-group-name' : ''}
            style={{
              fontWeight: 700,
              fontSize: '16px',
              marginLeft: '8px',
              textTransform: 'capitalize',
            }}
          >
            {items.name.length > 20
              ? items.name.substring(0, 20).concat('...')
              : items.name}
          </div>
        </div>
        <div
          style={{
            fontSize: '12px',
            fontWeight: 500,
            color: '#B7B7B7',
          }}
        >
          {changeFormatDateLikeDesign(
            moment(items.createdOn).format('DD/MM/YY HH:mm')
          )}
        </div>
      </div>
      <div
        style={{
          fontSize: '14px',
          fontWeight: 500,
          paddingLeft: '29px',
          marginTop: '8px',
          color: '#B7B7B7',
        }}
      >
        {items.message.substring(0, 100).concat('...')}
      </div>
    </div>
  );
};

export default InboxCard;
