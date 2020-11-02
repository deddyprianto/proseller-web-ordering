import React, { Component } from 'react';

export default class TableNo extends Component {
  render() {
    let props = this.props.data
    return (
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        <div style={{ color: "gray", fontSize: 14 }}>{
          (
            (props.orderingMode === "TAKEAWAY") ||
            (props.orderingMode === "STOREPICKUP") ||
            (props.orderingMode === "STORECHECKOUT")
          ) ? "Queue No." : "Table No."}</div>
        <div style={{ fontWeight: "bold", fontSize: 14 }}>{
          (
            (props.orderingMode === "TAKEAWAY") ||
            (props.orderingMode === "STOREPICKUP") ||
            (props.orderingMode === "STORECHECKOUT")
          ) ? props.dataBasket.queueNo : ((props.scanTable && (props.scanTable.table || props.scanTable.tableNo)) || props.dataBasket.tableNo)}</div>
      </div>
    );
  }
}
