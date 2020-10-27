import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
import moment from "moment";

class PickupDateTime extends Component {
  render() {
    let props = this.props.data;
    var textTitle = props.orderingMode;
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
        }}
      >
        <div style={{ color: "gray", fontSize: 14 }}>
          {textTitle} Date & Time
        </div>
        <div style={{fontWeight: "bold", fontSize: 14}}>
          {moment(props.orderActionDate).format('DD MMM YYYY')} at {props.orderActionTime}
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
