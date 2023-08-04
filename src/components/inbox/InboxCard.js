import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CONSTANT } from 'helpers';
import customStyleFont from './css/style.module.css';
import inboxMail from 'assets/images/inboxMail.png';
import inboxMailOpened from 'assets/images/inboxMailOpen.png';

const InboxCard = ({ items }) => {
  const theme = useSelector((state) => state.theme.color);
  const parser = new DOMParser();
  const doc = parser.parseFromString(items?.message, 'text/html');
  const firstElement = doc.querySelector('*');
  const separateString = firstElement ? firstElement.textContent : '';

  const dispatch = useDispatch();
  const history = useHistory();

  const customFormatDate = (inputDateString) => {
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
          <div
            style={{
              position: 'absolute',
              top: -2,
              right: -2,
              width: '8px',
              height: '8px',
              borderRadius: '100%',
              backgroundColor: 'rgba(207, 48, 48, 1)',
            }}
          />
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
        borderRadius: '12px',
        marginTop: '20px',
        background: theme.background,
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
              color: !items.isRead
                ? theme.font
                : 'var(--text-color-tertiary, #B7B7B7)',
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
            color: 'var(--text-color-tertiary, #B7B7B7)',
          }}
        >
          {customFormatDate(items.createdOn)}
        </div>
      </div>
      <div
        style={{
          fontSize: '14px',
          fontWeight: 500,
          paddingLeft: '29px',
          marginTop: '8px',
          color: 'var(--text-color-tertiary, #B7B7B7)',
        }}
      >
        {separateString.substring(0, 100).concat('...')}
      </div>
    </div>
  );
};

export default InboxCard;
