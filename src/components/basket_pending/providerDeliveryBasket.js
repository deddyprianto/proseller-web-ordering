import React, { Component } from 'react';
import { connect } from 'react-redux';

class ProviderDeliveryBasket extends Component {
  render() {
    let props = this.props.data;

    const awb = props.dataBasket.deliveryRefNo || null;

    function renderAWB(params) {
      if (awb) {
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ fontSize: 14 }}>Air Waybill (AWB) </div>
            <div style={{ fontWeight: 'bold', fontSize: 14 }}>
              {props?.dataBasket?.deliveryRefNo}
            </div>
          </div>
        );
      } else {
        return;
      }
    }

    return (
      <>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ fontSize: 14 }}>Provider</div>
          <div style={{ fontWeight: 'bold', fontSize: 14 }}>
            {props.dataBasket.deliveryProvider}
          </div>
        </div>
        {renderAWB()}
      </>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    color: state.theme.color,
  };
};

export default connect(mapStateToProps, {})(ProviderDeliveryBasket);
