import React, { Component } from "react";
import { connect } from "react-redux";
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
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div style={{ color: "gray", fontSize: 14 }}>
          Ordering Mode
        </div>
        <div style={{fontWeight: "bold", fontSize: 14}}>
          {config.checkNickName(props.dataBasket.orderingMode, props.storeDetail)}
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
