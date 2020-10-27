import React, { Component } from 'react';

export default class StatusOrder extends Component {
  render() {
    let props = this.props.data
    return (
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        <div style={{ color: "gray", fontSize: 14 }}>Status Order</div>
        {
          props.dataBasket.status === "PENDING" || props.dataBasket.status === "PENDING_PAYMENT" &&
          <div style={{
            fontWeight: "bold", borderRadius: 5, fontSize: 13, color: "#c00a27",
            textAlign: "right", backgroundColor: "#FFF"
          }}>{props.dataBasket.status}</div>
        }
        {
          props.dataBasket.status === "SUBMITTED" &&
          <div style={{
            fontWeight: "bold", worderRadius: 8, fontSize: 13, color: "#ffa41b",
            textAlign: "right", backgroundColor: "#FFF"
          }}>{props.dataBasket.status}</div>
        }
        {
          (props.dataBasket.status === "CONFIRMED" ||
            props.dataBasket.status === "PROCESSING" ||
            props.dataBasket.status === "READY_FOR_COLLECTION" ||
            props.dataBasket.status === "READY_FOR_DELIVERY" ||
            props.dataBasket.status === "ON_THE_WAY"
          ) &&
          <div style={{
            fontWeight: "bold", borderRadius: 5, fontSize: 13, color: "green",
            textAlign: "right", backgroundColor: "#FFF"
          }}>{props.dataBasket.status}</div>
        }
      </div>
    );
  }
}
