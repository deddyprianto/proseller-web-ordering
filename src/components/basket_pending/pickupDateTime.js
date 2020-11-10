import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";

class PickupDateTime extends Component {
  render() {
    let props = this.props.data;
    let textTitle = props.orderingMode;
    if (textTitle === "STOREPICKUP") textTitle = "Pickup"
    if (textTitle === "STORECHECKOUT") textTitle = "Pickup"
    if (textTitle === "DELIVERY") textTitle = "Delivery"
    if (textTitle === "TAKEAWAY") textTitle = "Pickup"
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div style={{ fontSize: 14 }}>
          {textTitle} Date & Time
        </div>
        <div style={{fontWeight: "bold", fontSize: 14, lineHeight: "20px"}}>
          <div>{`${moment(props.orderActionDate).format('DD MMM YYYY')}`}</div>
          <div>{`${props.dataBasket.orderActionTimeSlot}`}</div>
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

export default connect(mapStateToProps, {})(PickupDateTime);
