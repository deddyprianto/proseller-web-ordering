import React, { Component } from 'react';

export default class TotalSurchargeAmount extends Component {
  render() {
    let props = this.props.data
    return (
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        <div style={{ color: "gray", fontSize: 14 }}>Surcharge Amount</div>
        <div style={{ fontWeight: "bold", color: "gray", fontSize: 14 }}>
          {this.props.getCurrency(props.dataBasket.totalSurchargeAmount)}
        </div>
      </div>
    );
  }
}
