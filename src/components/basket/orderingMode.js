import React, { Component } from "react";
import { connect } from "react-redux";

import SendIcon from "@material-ui/icons/Send";
import { Button } from "reactstrap";
import ModalOrderingMode from "./ModalOrderingMode";

class OrderingMode extends Component {
  componentDidMount = async () => {
    if (!this.props.basket.orderingMode) {
      if (this.props.orderingModes.length === 1) {
        await this.props.dispatch({
          type: "SET_ORDERING_MODE",
          payload: this.props.orderingModes[0],
        });
        this.props.setOrderingMode(this.props.orderingModes[0]);
      } else {
        document.getElementById("ordering-mode-basket-btn").click();
      }
    }
  };

  componentDidUpdate = async () => {
    if (!this.props.orderingMode) {
      if (this.props.orderingModes.length === 1) {
        await this.props.dispatch({
          type: "SET_ORDERING_MODE",
          payload: this.props.orderingModes[0],
        });
        this.props.setOrderingMode(this.props.orderingModes[0]);
      } else {
        document.getElementById("ordering-mode-basket-btn").click();
      }
    }
  };

  mapOrderingModeName = (outlet, orderingMode) => {
    if (!outlet) {
      return orderingMode;
    }
    switch (orderingMode) {
      case "DELIVERY":
        return outlet.deliveryName || orderingMode;
      case "TAKEAWAY":
        return outlet.takeAwayName || orderingMode;
      case "DINEIN":
        return outlet.dineInName || orderingMode;
      case "STOREPICKUP":
        return outlet.storePickUpName || orderingMode;
      case "STORECHECKOUT":
        return outlet.storeCheckOutName || orderingMode;

      default:
        return orderingMode;
    }
  };

  render() {
    let props = this.props.data;

    return (
      <div
        style={{
          border: "1px solid #DCDCDC",
          borderRadius: 5,
          marginTop: 10,
          padding: 10,
        }}
      >
        {
          <ModalOrderingMode
            data={props}
            setOrderingMode={(mode) => this.props.setOrderingMode(mode)}
            getCurrency={(price) => this.props.getCurrency(price)}
          />
        }
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontWeight: "bold", fontSize: 14 }}>Ordering Mode</div>
          <Button
            disabled={this.props.roleDisableNotPending}
            id="ordering-mode-basket-btn"
            data-toggle="modal"
            data-target="#ordering-mode-basket-modal"
            className="btn-ordering"
            style={{
              fontWeight: "bold",
              cursor: "pointer",
              backgroundColor: this.props.color.primary,
              width: 140,
              justifyContent: "space-between",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              fontSize: 12,
            }}
          >
            <SendIcon style={{ fontSize: 16 }} />
            {/* {config.checkNickName(props.orderingMode, props.storeDetail)} */}
            {this.mapOrderingModeName(
              this.props.outlet,
              this.props.basket.orderingMode
            )}
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    color: state.theme.color,
    orderingModes: state.order.orderingModes,
    outlet: state.outlet.defaultOutlet,
    orderingMode: state.order.orderingMode,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderingMode);
