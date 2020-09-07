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
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", }}>
          <ShoppingBasketIcon className="border-theme" style={{
            fontSize: 50, borderRadius: 5, padding: 5
          }} />
          <div style={{ marginLeft: 10, textAlign: "left" }}>
            <div className="modal-title" style={{ fontWeight: "bold", fontSize: 16 }}>{items.outlet.name}</div>
            <div style={{
              color: "#FFF",
              backgroundColor: (
                items.status === "PENDING" && "red" ||
                items.status === "SUBMITTED" && "orange" ||
                items.status === "CONFIRMED" && "green" ||
                items.status === "PROCESSING" && "green" ||
                items.status === "READY_FOR_COLLECTION" && "green" ||
                items.status === "READY_FOR_DELIVERY" && "green" ||
                items.status === "ON_THE_WAY" && "green" ||
                "red"
              ), fontWeight: "bold", fontSize: 12, paddingLeft: 10, paddingRight: 10,
              borderRadius: 5, textAlign: "center"
            }}>{items.status.replace(/_/g, " ")}</div>
          </div>
        </div>
        <div>
          <div className="modal-title" style={{ fontWeight: "bold", fontSize: 14, textAlign: "right" }}>
            {items.details.length + " items"}
          </div>
          <div style={{
            color: "gray", fontSize: 10, textAlign: "right", marginTop: 10
          }}>{moment(items.createdOn).format('DD/MM/YY HH:mm')}</div>
        </div>
      </div>
    );
  }
}
