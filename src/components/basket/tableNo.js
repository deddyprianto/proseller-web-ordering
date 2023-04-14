import React, { Component } from 'react';

export default class TableNo extends Component {
  render() {
    let props = this.props.data;

    const tableNoChecker = () => {
      if (props.orderingMode === 'DINEIN') {
        return (
          (props.scanTable &&
            (props.scanTable.table || props.scanTable.tableNo)) ||
          props.dataBasket.tableNo
        );
      }
      return;
    };

    return (
      <div
        style={{
          border: '1px solid #DCDCDC',
          borderRadius: 5,
          marginTop: 10,
          padding: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ fontWeight: 'bold', fontSize: 14 }}>
            {tableNoChecker() ? 'Table No.' : 'Queue No.'}
          </div>
          <div style={{ fontWeight: 'bold', fontSize: 14 }}>
            {tableNoChecker() || props.dataBasket.queueNo}
          </div>
        </div>
      </div>
    );
  }
}
