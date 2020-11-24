import React, { Component } from 'react';

export default class TotalSurchargeAmount extends Component {
  render() {
    let props = this.props.data
    return (
      // <div style={{ border: "1px solid #DCDCDC", borderRadius: 5, marginTop: 10, padding: 10 }}>
      <div style={{ marginLeft: 10, marginRight: 10 }}>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <div style={{ fontWeight: "bold" }}>Service Charge</div>
          <div style={{ fontWeight: "bold" }}>
            {this.props.getCurrency(props.dataBasket.totalSurchargeAmount)}
          </div>
        </div>
      </div>
    );
  }
}