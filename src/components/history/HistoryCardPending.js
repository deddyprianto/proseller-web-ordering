import React, { Component } from 'react';
import { connect } from 'react-redux';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import moment from 'moment';


class InboxCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingShow: true,
      isLoading: false,
    };
  }

  getCurrency = (price) => {
    if (this.props.companyInfo) {
      if (price !== undefined) {
        const { currency } = this.props.companyInfo;
        if (!price || price === '-') price = 0;
        let result = price.toLocaleString(currency.locale, {
          style: 'currency',
          currency: currency.code,
        });
        return result;
      }
    }
  };

  checkNameOutlet(outletName) {
    let nameSplit = outletName.split(' ');
    let nameMerge = '';
    nameSplit.forEach((element) => {
      if (`${nameMerge} ${element}`.length > 20) return;
      nameMerge = `${nameMerge} ${element}`;
    });
    return nameMerge;
  }

  render() {
    const { items } = this.props;
    let discount = 0;
    if (items.payments) {
      items.payments.forEach((items) => {
        if (items.paymentType === 'voucher' || items.paymentType === 'point') {
          discount += items.paymentAmount;
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
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
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
          <div style={{ marginLeft: 10, textAlign: 'left' }}>
            <div
              className='modal-title'
              style={{ fontWeight: 'bold', fontSize: 14, lineHeight: '17px' }}
            >
              {this.checkNameOutlet(items.outlet.name)}
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
              {`${items.queueNo} - ${
                items.details.length
              } items - ${this.getCurrency(items.totalNettAmount - discount)}`}
            </div>
          </div>
        </div>
        <div>
          <div
            className='font-color-theme'
            style={{
              fontSize: 10,
              textAlign: 'right',
              marginTop: 10,
              width: '100%',
              bottom: 10,
              right: 25,
              position: 'absolute',
              fontStyle: 'italic',
            }}
          >
            {moment(items.createdOn).format('DD/MM/YY HH:mm')}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    companyInfo: state.masterdata.companyInfo.data,
  };
};

export default connect(mapStateToProps, {})(InboxCard);
