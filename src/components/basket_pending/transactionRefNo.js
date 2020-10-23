import React, { Component } from 'react';

export default class TransactionRefNo extends Component {
  render() {
    let props = this.props.data
    return (
      <div style={{ border: "1px solid #DCDCDC", borderRadius: 5, marginTop: 10, padding: 10 }}>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <div style={{ fontWeight: "bold", color: "gray", fontSize: 14 }}>
            Ref No.
          </div>
          <div style={{ fontWeight: "bold", color: "gray", fontSize: 14 }}>
            {props.dataBasket.transactionRefNo}
          </div>
        </div>
      </div>
    );
  }
}
