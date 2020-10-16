import React, { Component } from "react";
import { connect } from "react-redux";

import SendIcon from "@material-ui/icons/Send";
import { Button } from "reactstrap";
import config from "../../config";

class OrderingMode extends Component {
  componentDidMount = () => {
    let props = this.props.data;
    if (!props.dataBasket.orderingMode || props.dataBasket.orderingMode === "") {
      document.getElementById("ordering-mode-basket-btn").click();
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
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontWeight: "bold", color: "gray", fontSize: 14 }}>
            Ordering Mode
          </div>
          <Button
            disabled={this.props.roleDisableNotPending}
            id="ordering-mode-basket-btn"
            data-toggle="modal"
            data-target="#ordering-mode-basket-modal"
            style={{
              fontWeight: "bold",
              color: "#FFF",
              cursor: "pointer",
              backgroundColor: this.props.color.secondary,
              width: 140,
              justifyContent: "space-between",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              fontSize: 12,
            }}
          >
            <SendIcon style={{ fontSize: 16 }} />
            {config.checkNickName(props.dataBasket.orderingMode, props.storeDetail)}
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    color: state.theme.color,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderingMode);
