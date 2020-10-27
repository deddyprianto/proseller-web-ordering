import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "reactstrap";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";

class ProviderDeliveryBasket extends Component {
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
        <div style={{ color: "gray", fontSize: 14 }}>
          Provider
        </div>
        <div style={{fontWeight: "bold", fontSize: 14}}>
          {props.provaiderDelivery.name.substring(0, 15)}
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

export default connect(mapStateToProps, {})(ProviderDeliveryBasket);
