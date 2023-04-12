import React, { Component } from 'react';

export default class TableNo extends Component {
  render() {
    let props = this.props.data;

    const tableNoChecker = () => {
      return (
        (props.scanTable &&
          (props.scanTable.table || props.scanTable.tableNo)) ||
        props.dataBasket.tableNo
      );
    };

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ fontSize: 14 }}>
          {tableNoChecker() ? 'Table No.' : 'Queue No.'}
        </div>
        <div style={{ fontSize: 14, textTransform: 'uppercase' }}>
          {tableNoChecker() || props.dataBasket.queueNo}
        </div>
      </div>
    );
  }
}
