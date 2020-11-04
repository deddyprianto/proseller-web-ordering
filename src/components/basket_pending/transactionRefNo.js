import React, { Component } from 'react';

export default class TransactionRefNo extends Component {
  render() {
    let props = this.props.data
    return (
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        <div style={{ ontSize: 14 }}>
          Ref No.
        </div>
        <div style={{ fontWeight: "bold", fontSize: 14 }}>
          {props.dataBasket.transactionRefNo}
        </div>
      </div>
    );
  }
}
