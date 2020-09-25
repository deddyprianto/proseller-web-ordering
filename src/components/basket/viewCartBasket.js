import React, { Component } from "react";
import { connect } from "react-redux";

import { Col, Row, Button } from "reactstrap";
import ItemsBasket from "./itemsBasket";
import MenuBasket from "./menuBasket";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { isEmptyArray, isEmptyObject } from "../../helpers/CheckEmpty";

class ViewCartBasket extends Component {
  roleBtnClear = () => {
    let props = this.props.data;
    return (props.dataBasket.status === "SUBMITTED" &&
      props.orderingMode &&
      props.orderingMode === "TAKEAWAY") ||
      (props.dataBasket.status !== "PENDING" &&
        props.dataBasket.orderingMode === "DINEIN" &&
        props.dataBasket.outlet.outletType === "QUICKSERVICE") ||
      (props.dataBasket.orderingMode === "DELIVERY" &&
        props.dataBasket.status !== "PENDING") ||
      props.dataBasket.status === "CONFIRMED" ||
      props.dataBasket.status === "PROCESSING" ||
      props.dataBasket.status === "READY_FOR_COLLECTION"
      ? true
      : false;
  };

  roleDisableNotPending = () => {
    let props = this.props.data;
    return props.dataBasket && props.dataBasket.status !== "PENDING"
      ? true
      : false;
  };

  roleBtnSettle = () => {
    let props = this.props.data;
    return !props.btnBasketOrder ||
      props.storeDetail.orderingStatus === "UNAVAILABLE" ||
      props.dataBasket.status === "PROCESSING" ||
      props.dataBasket.status === "READY_FOR_COLLECTION" ||
      (props.dataBasket.status === "SUBMITTED" &&
        props.dataBasket.orderingMode === "DINEIN" &&
        props.dataBasket.outlet.outletType === "RESTO") ||
      // (this.props.isLoggedIn && props.selectedCard === null && (props.newTotalPrice === "0" ? props.totalPrice : props.newTotalPrice) > 0) ||
      ((props.dataBasket.status === "SUBMITTED" ||
        props.dataBasket.status === "CONFIRMED") &&
        props.orderingMode &&
        props.orderingMode === "TAKEAWAY") ||
      (props.dataBasket.status !== "PENDING" &&
        props.dataBasket.status !== "PENDING_PAYMENT" &&
        props.dataBasket.orderingMode === "DINEIN" &&
        props.dataBasket.outlet.outletType === "QUICKSERVICE") ||
      (props.dataBasket.orderingMode === "DELIVERY" &&
        props.dataBasket.status !== "PENDING" &&
        props.dataBasket.status !== "PENDING_PAYMENT") ||
      (this.props.isLoggedIn &&
        !props.provaiderDelivery &&
        props.orderingMode &&
        props.orderingMode === "DELIVERY")
      ? true
      : false;
  };

  roleOnClickSettle = () => {
    let props = this.props.data;
    return (
      props.settle ||
      (props.orderingMode &&
        (props.orderingMode === "TAKEAWAY" ||
          props.orderingMode === "DELIVERY")) ||
      (props.orderingMode &&
        props.orderingMode === "DINEIN" &&
        props.dataBasket &&
        props.dataBasket.outlet.outletType === "QUICKSERVICE" &&
        props.dataBasket.outlet.enableTableScan === false) ||
      (props.dataBasket && props.dataBasket.status !== "PENDING")
    );
  };

  roleBackgroundSettle = () => {
    let props = this.props.data;
    return (
      props.settle ||
      (props.orderingMode &&
        (props.orderingMode === "TAKEAWAY" ||
          props.orderingMode === "DELIVERY")) ||
      (props.orderingMode &&
        props.orderingMode === "DINEIN" &&
        props.dataBasket &&
        props.dataBasket.outlet.outletType === "QUICKSERVICE" &&
        props.dataBasket.outlet.enableTableScan === false) ||
      (props.dataBasket && props.dataBasket.status !== "PENDING")
    );
  };

  roleIconSettle = () => {
    let props = this.props.data;
    return (
      props.settle ||
      (props.orderingMode &&
        (props.orderingMode === "TAKEAWAY" ||
          props.orderingMode === "DELIVERY")) ||
      (props.orderingMode &&
        props.orderingMode === "DINEIN" &&
        props.dataBasket &&
        props.dataBasket.outlet.outletType === "QUICKSERVICE" &&
        (props.dataBasket.outlet.enableTableScan === false ||
          props.dataBasket.outlet.enableTableScan === "-")) ||
      (props.dataBasket && props.dataBasket.status !== "PENDING") ||
      (props.storeDetail &&
        props.storeDetail.enableTableScan !== false &&
        props.scanTable)
    );
  };

  roleTitleSettle = () => {
    return this.roleIconSettle();
  };

  render() {
    let props = this.props.data;
    const basket = this.props.data.dataBasket;
    const orderingModeField =
      this.props.data.dataBasket.orderingMode === "DINEIN"
        ? "dineIn"
        : this.props.data.dataBasket.orderingMode === "DELIVERY"
        ? "delivery"
        : "takeAway";
    const productQuantity = basket.details.reduce((acc, item) => ({
      quantity: acc.quantity + item.quantity,
    })).quantity;
    console.log(productQuantity);
    const {
      minQty,
      maxQty,
      minAmount,
      maxAmount,
    } = this.props.outlet.orderValidation[orderingModeField];
    return (
      <div
        style={{
          marginLeft: props.widthSelected >= 1200 ? 100 : 0,
          marginRight: props.widthSelected >= 1200 ? 100 : 0,
        }}
      >
        <Row>
          <Col xs="12" sm="6">
            <ItemsBasket
              data={this.props.data}
              dataBasket={this.props.dataBasket}
              countryCode={this.props.countryCode}
              getCurrency={(price) => this.props.getCurrency(price)}
              handleSetState={(field, value) =>
                this.props.handleSetState(field, value)
              }
              handleClear={(dataBasket) => this.props.handleClear(dataBasket)}
              roleBtnClear={this.roleBtnClear()}
            />
          </Col>
          <Col xs="12" sm="6">
            <MenuBasket
              data={this.props.data}
              isLoggedIn={this.props.isLoggedIn}
              cancelSelectVoucher={() => this.props.cancelSelectVoucher()}
              cancelSelectPoint={() => this.props.cancelSelectPoint()}
              handleRedeemVoucher={() => this.props.handleRedeemVoucher()}
              handleRedeemPoint={() => this.props.handleRedeemPoint()}
              getCurrency={(price) => this.props.getCurrency(price)}
              roleBtnClear={this.roleBtnClear()}
              roleDisableNotPending={this.roleDisableNotPending()}
              roleOnClickSettle={this.roleOnClickSettle()}
              roleIconSettle={this.roleIconSettle()}
              roleTitleSettle={this.roleTitleSettle()}
              roleBtnSettle={this.roleBtnSettle()}
              handleSubmit={() => this.props.handleSubmit()}
              handleSettle={() => this.props.handleSettle()}
              handleClear={() => this.props.handleClear()}
              setViewCart={(status) => this.props.setViewCart(status)}
              scrollPoint={(data) => this.props.scrollPoint(data)}
              setPoint={(point) => this.props.setPoint(point)}
              setOrderingMode={(mode) => this.props.setOrderingMode(mode)}
              handleSetProvaider={(item) => this.props.handleSetProvaider(item)}
              handleOpenLogin={() => this.props.handleOpenLogin()}
              isLoggedIn={this.props.isLoggedIn}
            />
          </Col>
        </Row>

        {props.widthSelected < 1200 && (
          <div
            style={{
              backgroundColor: "#FFF",
              padding: 10,
              width: "101%",
              marginLeft: props.widthSelected >= 750 ? -65 : -15,
              marginBottom: props.widthSelected >= 1200 ? 0 : 45,
              display: "flex",
              flexDirection: "column",
              alignItems: "left",
              position: "fixed",
              bottom: 0,
              boxShadow: "1px -2px 2px rgba(128, 128, 128, 0.5)",
              justifyContent: "center",
            }}
          >
            {/* <div style={{ marginLeft: 10, marginRight: 10 }}>
              <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                <div style={{ fontWeight: "bold", color: "gray" }}>Sub Total</div>
                <div style={{ fontWeight: "bold", color: "gray" }}>
                  {this.props.getCurrency(props.dataBasket.totalNettAmount)}
                </div>
              </div>
            </div> */}

            {props.provaiderDelivery &&
              props.orderingMode &&
              props.orderingMode === "DELIVERY" && (
                <div style={{ marginLeft: 10, marginRight: 10 }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ fontWeight: "bold", color: "gray" }}>
                      Delivery Fee
                    </div>
                    <div
                      style={{ fontWeight: "bold", color: "gray" }}
                    >{`${props.provaiderDelivery.deliveryFee}`}</div>
                  </div>
                </div>
              )}

            {/* {
              (props.discountVoucher + props.discountPoint) > 0 &&
              <div style={{ marginLeft: 10, marginRight: 10 }}>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  <div style={{ fontWeight: "bold", color: "#03AC0E" }}>Discount</div>
                  <div style={{ fontWeight: "bold", color: "#03AC0E" }}>{`${this.props.getCurrency(props.discountVoucher + props.discountPoint)}`}</div>
                </div>
              </div>
            } */}

            {basket.totalGrossAmount >= minAmount ? (
              basket.totalGrossAmount <= maxAmount || maxAmount === 0 ? (
                productQuantity >= minQty ? (
                  productQuantity <= maxQty || maxQty === 0 ? null : (
                    <div className="small text-left">
                      <strong>
                        Your order has exceeded maximum allowed item quantity
                        for {basket.orderingMode}. Please remove some item from
                        your cart.
                      </strong>
                    </div>
                  )
                ) : (
                  <div className="small text-left">
                    <strong>
                      Your order hasn't reached minimum allowed item quantity
                      for {basket.orderingMode}. Please remove some item from
                      your cart.
                    </strong>
                  </div>
                )
              ) : (
                <div className="small text-left">
                  <strong>
                    Your order has exceeded maximum allowed order amount for{" "}
                    {basket.orderingMode}. Please remove some item from your
                    cart.
                  </strong>
                </div>
              )
            ) : (
              <div className="small text-left">
                <strong>
                  Your order hasn't reached minimum allowed order amount for{" "}
                  {basket.orderingMode}. Please remove some item from your cart.
                </strong>
              </div>
            )}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginLeft: 10,
                marginRight: 10,
              }}
            >
              <div
                style={{ fontWeight: "bold", color: "#c00a27", fontSize: 16 }}
              >
                TOTAL
              </div>
              <div
                style={{ fontWeight: "bold", color: "#c00a27", fontSize: 16 }}
              >
                {this.props.getCurrency(props.dataBasket.totalNettAmount)}
              </div>
            </div>

            {props.dataBasket.status === "PROCESSING" ||
            props.dataBasket.status === "READY_FOR_COLLECTION" ||
            props.dataBasket.status === "READY_FOR_DELIVERY" ||
            props.dataBasket.status === "ON_THE_WAY" ? (
              <div
                style={{
                  padding: 10,
                  backgroundColor: "#FFF",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  style={{
                    boxShadow: "1px 2px 5px rgba(128, 128, 128, 0.5)",
                    width: "100%",
                    backgroundColor: "green",
                    color: "#FFF",
                    fontWeight: "bold",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onClick={() => this.props.setViewCart(false)}
                >
                  <ShoppingCartIcon style={{ fontSize: 20, marginRight: 10 }} />{" "}
                  Waiting Order
                </Button>
              </div>
            ) : (
              <div
                style={{
                  padding: 10,
                  backgroundColor: "#FFF",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {/* <Button
                    disabled={this.roleBtnClear()}
                    onClick={() => this.props.handleClear()} style={{
                      boxShadow: "1px 2px 5px rgba(128, 128, 128, 0.5)", width: "45%", backgroundColor: "#c00a27",
                      color: "#FFF", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center",
                    }} >
                    <DeleteIcon style={{ fontSize: 20, marginRight: 5 }} /> Clear
                  </Button> */}
                <Button
                  disabled={
                    this.roleBtnSettle() ||
                    basket.totalGrossAmount < minAmount ||
                    (basket.totalGrossAmount > maxAmount && maxAmount > 0) ||
                    productQuantity < minQty ||
                    (productQuantity > maxQty && maxQty > 0)
                  }
                  onClick={() => {
                    this.roleTitleSettle()
                      ? this.props.handleSettle()
                      : this.props.handleSubmit();
                  }}
                  style={{
                    boxShadow: "1px 2px 5px rgba(128, 128, 128, 0.5)",
                    width: "100%",
                    display: "flex",
                    color: "#FFF",
                    fontWeight: "bold",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 40,
                  }}
                >
                  {" "}
                  {this.roleIconSettle() ? (
                    <MonetizationOnIcon
                      style={{ fontSize: 20, marginRight: 5 }}
                    />
                  ) : (
                    <CheckCircleIcon style={{ fontSize: 20, marginRight: 5 }} />
                  )}
                  {this.roleTitleSettle() ? "Confirm & Pay" : "Submit"}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    outlet: state.outlet.defaultOutlet,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewCartBasket);
