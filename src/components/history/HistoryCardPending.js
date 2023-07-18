import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import './style/style.css';

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

  const checkQueueNo = () => {
    if (items.orderingMode === 'DINEIN' && items.tableNo) {
      return items.tableNo ? items.tableNo + ' - ' : '';
    } else {
      return items.queueNo ? items.queueNo + ' - ' : '';
    }
  };

  return (
    <div
      className='default-font'
      style={{
        boxShadow: '0px 4px 10px 0px rgba(0, 0, 0, 0.10)',
        padding: '12px 0px',
        borderRadius: '8px',
        cursor: 'pointer',
        width: '100%',
        marginTop: '5px',
      }}
    >
      <div
        style={{
          height: '21px',
          fontSize: '14px',
          padding: '0px 16px',
          fontWeight: 600,
          color: props.color.primary,
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>Ordering</div>
        {items.status === 'COMPLETED' && items.point > 0 && (
          <div
            style={{
              backgroundColor: '#38A405',
              padding: '1px 10px',
              color: 'white',
              borderRadius: '100px',
              fontSize: '12px',
            }}
          >
            {items.point + ' points'}
          </div>
        )}
      </div>
      <div
        style={{
          backgroundColor: 'rgb(242, 242, 242)',
          marginTop: '16px',
          padding: '8px 16px',
        }}
      >
        <div style={{ color: 'black', fontWeight: 600, fontSize: '16px' }}>
          {checkNameOutlet(items.outlet?.name)}
        </div>
        <div
          style={{
            color: '#9D9D9D',
            fontWeight: 600,
            fontSize: '14px',
            marginTop: '5px',
          }}
        >
          {`${checkQueueNo()} ${items.details.length} items - ${getCurrency(
            items.totalNettAmount - discount
          )}`}
        </div>
      </div>

      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '16px',
          padding: '0px 16px',
        }}
      >
        <div
          style={{
            color: props.color.primary,
            fontWeight: 600,
            fontSize: '14px',
          }}
        >
          {items.status.replace(/_/g, ' ')}
        </div>

        <div
          className='font-color-theme'
          style={{
            fontSize: '12px',
            color: '#9D9D9D',
            fontWeight: 600,
          }}
        >
          {moment(items.createdAt).format('DD/MM/YY HH:mm')}
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
