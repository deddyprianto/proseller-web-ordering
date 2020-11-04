import React, { Component } from "react";
import { connect } from "react-redux";
import config from "../../config";

class DeliveryAddressBasket extends Component {
  handleGet() {
    if (!this.props.handleOpenLogin()) return;
    localStorage.setItem(`${config.prefix}_getDeliveryAddress`, true);
  }
  render() {
    let props = this.props.data;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: 14 }}>
          Delivery Address
        </div>
        <div style={{fontWeight: "bold", fontSize: 14}}>
          {props.dataBasket.deliveryAddress.addressName.substring(0, 15)}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    color: state.theme.color,
  };
};

export default connect(mapStateToProps, {})(DeliveryAddressBasket);
