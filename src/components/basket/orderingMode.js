import React, { Component } from "react";
import { connect } from "react-redux";

import SendIcon from "@material-ui/icons/Send";
import { Button } from "reactstrap";
import ModalOrderingMode from "./ModalOrderingMode";
import config from "../../config";

class OrderingMode extends Component {
  componentDidMount = () => {
    let props = this.props.data;
    if (this.props.basket.orderingMode === undefined || this.props.basket.orderingMode === "") {
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
          <div style={{ fontWeight: "bold", fontSize: 14 }}>
            Ordering Mode
          </div>
          <Button
            disabled={this.props.roleDisableNotPending}
            id="ordering-mode-basket-btn"
            data-toggle="modal"
            data-target="#ordering-mode-basket-modal"
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
            {this.props.basket.orderingMode}
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
