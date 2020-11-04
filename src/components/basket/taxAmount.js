import React, { Component } from 'react';

export default class TaxAmount extends Component {
  render() {
    let props = this.props.data
    return (
      <div style={{ border: "1px solid #DCDCDC", borderRadius: 5, marginTop: 10, padding: 10 }}>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <div style={{ fontWeight: "bold", fontSize: 14 }}>Tax Amount</div>
          <div style={{ fontWeight: "bold", fontSize: 14 }}>
            {this.props.getCurrency(props.dataBasket.totalTaxAmount)}
          </div>
        </div>
      </div>
    );
  }
}
