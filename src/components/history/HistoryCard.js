import React, { Component } from 'react';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import moment from 'moment';
import _ from 'lodash';

export default class InboxCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingShow: true,
      isLoading: false,
    };
  }

  getCurrency = (price) => {
    if (price != undefined) {
      let code = this.props.countryCode
      let currency = { code: 'en-US', currency: 'SGD' };
      if (code === "SG") currency = { code: 'en-US', currency: 'SGD' };

      if (price === "-") price = 0;
      let result = price.toLocaleString(currency.code, { style: 'currency', currency: currency.currency });
      return result
    }
  };

  render() {
    const { items } = this.props
    return (
      <div style={{
        display: "flex", flexDirection: "row", boxShadow: "1px 2px 5px rgba(128, 128, 128, 0.5)",
        padding: 10, justifyContent: "space-between", alignItems: "center", borderRadius: 5,
        marginBottom: 10, cursor: "pointer", backgroundColor: "#FFF", height: 80
      }}>
        <>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", }}>
            <ShoppingBasketIcon className="border-theme" style={{
              fontSize: 50, borderRadius: 5, padding: 5
            }} />
            <div style={{ marginLeft: 10, textAlign: "left" }}>
              <div className="modal-title" style={{ fontWeight: "bold", fontSize: 16 }}>{items.outlet && items.outlet.name}</div>
              <div style={{ fontWeight: "bold", fontSize: 14 }}>
                {this.getCurrency(items.price)}
              </div>
            </div>
          </div>
          <div>
            <div className="modal-title" style={{ fontWeight: "bold", fontSize: 14, textAlign: "right" }}>
              {items.point > 0 ? (items.point + " points") : null}
            </div>
            <div style={{
              color: "gray", fontSize: 10, textAlign: "right", marginTop: 10,
              fontStyle: 'italic'
            }}>{moment(items.salesDate).format('DD/MM/YY HH:mm')}</div>
          </div>
        </>
      </div>
    );
  }
}
