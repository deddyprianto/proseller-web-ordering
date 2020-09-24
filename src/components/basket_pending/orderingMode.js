import React, { Component } from "react";
import SendIcon from "@material-ui/icons/Send";
import { Button } from "reactstrap";
import ModalOrderingMode from "./ModalOrderingMode";

export default class OrderingMode extends Component {
  componentDidMount = () => {
    let props = this.props.data;
    if (!props.orderingMode || props.orderingMode === "") {
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
          />
        }
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
              backgroundColor: "#20a8d8",
              width: 140,
              justifyContent: "space-between",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              fontSize: 12,
            }}
          >
            <SendIcon style={{ fontSize: 16 }} />
            {props.orderingMode}
          </Button>
        </div>
      </div>
    );
  }
}
