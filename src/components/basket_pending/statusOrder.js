import React, { Component } from 'react';

export default class StatusOrder extends Component {
  render() {
    let props = this.props.data
    return (
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        <div style={{ fontSize: 14 }}>Status Order</div>
        <div className="color-active" style={{
          fontWeight: "bold", borderRadius: 5, fontSize: 13, textAlign: "right",
        }}>
          {props.dataBasket.status}
        </div>
      </div>
    );
  }
}
