import React from 'react';
import { connect } from 'react-redux';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import moment from 'moment';

import { ReactComponent as IcGift } from 'assets/icons/ic_gift.svg';

const InboxCard = (props) => {
  const getCurrency = (price) => {
    if (props.companyInfo) {
      if (price !== undefined) {
        const { currency } = props.companyInfo;
        if (!price || price === '-') price = 0;
        let result = price.toLocaleString(currency.locale, {
          style: 'currency',
          currency: currency.code,
        });
        return result;
      }
    }
  };

  const checkNameOutlet = (outletName) => {
    let nameSplit = outletName?.split(' ');
    let nameMerge = '';
    nameSplit?.forEach((element) => {
      if (`${nameMerge} ${element}`.length > 20) return;
      nameMerge = `${nameMerge} ${element}`;
    });
    return nameMerge;
  };

  const { items } = props;
  let discount = 0;
  if (props.items.payments) {
    props.items.payments.forEach((item) => {
      if (item.paymentType === 'voucher' || item.paymentType === 'point') {
        discount += item.paymentAmount;
      }
    });
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        boxShadow: '0px 0px 5px rgba(128, 128, 128, 0.5)',
        border: '1px solid #CDCDCD',
        padding: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 5,
        marginBottom: 10,
        cursor: 'pointer',
        height: 80,
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <ShoppingBasketIcon
          className='border-theme'
          style={{
            fontSize: 50,
            borderRadius: 5,
            padding: 5,
          }}
        />
        <div style={{ marginLeft: 10, textAlign: 'left', width: '100%' }}>
          <div
            className='modal-title'
            style={{ fontWeight: 'bold', fontSize: 14, lineHeight: '17px' }}
          >
            {checkNameOutlet(items.outlet?.name)}
          </div>
          <div
            className='modal-title'
            style={{
              fontWeight: 'bold',
              fontSize: 12,
              maxWidth: 170,
              marginTop: 5,
            }}
          >
            {items.status.replace(/_/g, ' ')}
          </div>
          <div
            className='modal-title'
            style={{ fontWeight: 'bold', fontSize: 10, lineHeight: '17px' }}
          >
            {`${items.queueNo} - ${items.details.length} items - ${getCurrency(
              items.totalNettAmount - discount
            )}`}
          </div>
        </div>
        <div
          className='font-color-theme'
          style={{
            fontSize: 10,
            textAlign: 'right',
            width: '100%',
            lineHeight: '17px',
            alignSelf: 'end',
            color: '#9D9D9D',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {items.status === 'COMPLETED' && items.point > 0 && (
            <div
              className='modal-title'
              style={{
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'end',
                marginBottom: '18px',
              }}
            >
              <IcGift
                color={props.color.primary}
                style={{ marginRight: '3px' }}
              />
              <span>{items.point + ' points'}</span>
            </div>
          )}

          <div>{moment(items.createdOn).format('DD/MM/YY HH:mm')}</div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    companyInfo: state.masterdata.companyInfo.data,
    color: state.theme.color,
  };
};

export default connect(mapStateToProps, {})(InboxCard);
