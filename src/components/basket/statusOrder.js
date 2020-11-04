import React, { Component } from 'react';

export default class StatusOrder extends Component {
  render() {
    let props = this.props.data
    return (
      <div style={{ border: "1px solid #DCDCDC", borderRadius: 5, marginTop: 10, padding: 10 }}>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <div style={{ fontWeight: "bold", fontSize: 14 }}>Status Order</div>
          <div className="color-active" style={{
            fontWeight: "bold", borderRadius: 5, fontSize: 13, textAlign: "right",
          }}>
            {props.dataBasket.status}
          </div>
        </div>
      </div>
    );
  }
}
