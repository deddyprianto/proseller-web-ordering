import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";

import { Col, Row, Button } from "reactstrap";
import ItemsBasket from "./itemsBasket";
import MenuBasket from "./menuBasket";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { isEmptyArray, isEmptyObject } from "../../helpers/CheckEmpty";

const ViewCartBasket = ({
  data,
  deliveryProvider,
  deliveryAddress,
  outlet,
  color,
  getCurrency,
  cancelSelectVoucher,
  cancelSelectPoint,
  handleRedeemVoucher,
  handleRedeemPoint,
  handleSubmit,
  handleSettle,
  handleClear,
  setViewCart,
  scrollPoint,
  setPoint,
  setOrderingMode,
  handleSetProvaider,
  handleOpenLogin,
  isLoggedIn,
}) => {
  const roleBtnClear = () => {
    let props = data;
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

  const roleDisableNotPending = () => {
    let props = data;
    return props.dataBasket && props.dataBasket.status !== "PENDING"
      ? true
      : false;
  };

  const roleBtnSettle = () => {
    let props = data;
    return !props.btnBasketOrder ||
      props.storeDetail.orderingStatus === "UNAVAILABLE" ||
      props.dataBasket.status === "PROCESSING" ||
      props.dataBasket.status === "READY_FOR_COLLECTION" ||
      (props.dataBasket.status === "SUBMITTED" &&
        props.dataBasket.orderingMode === "DINEIN" &&
        props.dataBasket.outlet.outletType === "RESTO") ||
      // (props.isLoggedIn && props.selectedCard === null && (props.newTotalPrice === "0" ? props.totalPrice : props.newTotalPrice) > 0) ||
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
      (isLoggedIn &&
        !deliveryProvider &&
        props.orderingMode &&
        props.orderingMode === "DELIVERY")
      ? true
      : false;
  };

  const roleOnClickSettle = () => {
    let props = data;
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

  const roleBackgroundSettle = () => {
    let props = data;
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

  const roleIconSettle = () => {
    let props = data;
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

  const roleTitleSettle = () => {
    return roleIconSettle();
  };

  let props = data;
  const basket = data.dataBasket;
  const orderingModeField =
    data.dataBasket.orderingMode === "DINEIN"
      ? "dineIn"
      : data.dataBasket.orderingMode === "DELIVERY"
      ? "delivery"
      : "takeAway";
  const productQuantity = basket.details.reduce((acc, item) => ({
    quantity: acc.quantity + item.quantity,
  })).quantity;
  const { minQty, maxQty, minAmount, maxAmount } = outlet.orderValidation[
    orderingModeField
  ];

  useEffect(() => {
    if (deliveryAddress) {
      console.log("delivery address changed");
    }
  }, [deliveryAddress]);

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
            data={data}
            dataBasket={props.dataBasket}
            countryCode={props.countryCode}
            getCurrency={(price) => getCurrency(price)}
            handleSetState={(field, value) =>
              props.handleSetState(field, value)
            }
            handleClear={(dataBasket) => props.handleClear(dataBasket)}
            roleBtnClear={roleBtnClear()}
          />
        </Col>
        <Col xs="12" sm="6">
          <MenuBasket
            color={color}
            data={data}
            isLoggedIn={isLoggedIn}
            cancelSelectVoucher={() => cancelSelectVoucher()}
            cancelSelectPoint={() => cancelSelectPoint()}
            handleRedeemVoucher={() => handleRedeemVoucher()}
            handleRedeemPoint={() => handleRedeemPoint()}
            getCurrency={(price) => getCurrency(price)}
            roleBtnClear={roleBtnClear()}
            roleDisableNotPending={roleDisableNotPending()}
            roleOnClickSettle={roleOnClickSettle()}
            roleIconSettle={roleIconSettle()}
            roleTitleSettle={roleTitleSettle()}
            roleBtnSettle={roleBtnSettle()}
            handleSubmit={() => handleSubmit()}
            handleSettle={() => handleSettle()}
            handleClear={() => handleClear()}
            setViewCart={(status) => setViewCart(status)}
            scrollPoint={(data) => scrollPoint(data)}
            setPoint={(point) => setPoint(point)}
            setOrderingMode={(mode) => setOrderingMode(mode)}
            handleSetProvaider={(item) => handleSetProvaider(item)}
            handleOpenLogin={() => handleOpenLogin()}
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
                  {getCurrency(props.dataBasket.totalNettAmount)}
                </div>
              </div>
            </div> */}

          {isLoggedIn &&
            deliveryProvider &&
            props.orderingMode &&
            props.orderingMode === "DELIVERY" && (
              <div style={{ marginLeft: 10, marginRight: 10 }}>
                {deliveryProvider ? (
                  deliveryProvider.deliveryFeeFloat < 0 ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ fontWeight: "bold", color: "gray" }}>
                        Delivery is not available in your area.
                      </div>
                    </div>
                  ) : deliveryProvider.deliveryFee ? (
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
                      >{`${deliveryProvider.deliveryFee}`}</div>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ fontWeight: "bold", color: "gray" }}>
                        Checking delivery availability...
                      </div>
                    </div>
                  )
                ) : null}
              </div>
            )}

          {/* {
              (props.discountVoucher + props.discountPoint) > 0 &&
              <div style={{ marginLeft: 10, marginRight: 10 }}>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  <div style={{ fontWeight: "bold", color: "#03AC0E" }}>Discount</div>
                  <div style={{ fontWeight: "bold", color: "#03AC0E" }}>{`${getCurrency(props.discountVoucher + props.discountPoint)}`}</div>
                </div>
              </div>
            } */}

          {basket.totalGrossAmount >= minAmount ? (
            basket.totalGrossAmount <= maxAmount || maxAmount === 0 ? (
              productQuantity >= minQty ? (
                productQuantity <= maxQty || maxQty === 0 ? null : (
                  <div className="small text-left">
                    <strong>
                      Your order has exceeded maximum allowed item quantity for{" "}
                      {basket.orderingMode}. Please remove some item from your
                      cart.
                    </strong>
                  </div>
                )
              ) : (
                <div className="small text-left">
                  <strong>
                    Your order hasn't reached minimum allowed item quantity for{" "}
                    {basket.orderingMode}. Please remove some item from your
                    cart.
                  </strong>
                </div>
              )
            ) : (
              <div className="small text-left">
                <strong>
                  Your order has exceeded maximum allowed order amount for{" "}
                  {basket.orderingMode}. Please remove some item from your cart.
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
              style={{
                fontWeight: "bold",
                color: color.primary,
                fontSize: 16,
              }}
            >
              TOTAL
            </div>
            <div
              style={{
                fontWeight: "bold",
                color: color.primary,
                fontSize: 16,
              }}
            >
              {getCurrency(props.dataBasket.totalNettAmount)}
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
                onClick={() => setViewCart(false)}
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
                    disabled={roleBtnClear()}
                    onClick={() => props.handleClear()} style={{
                      boxShadow: "1px 2px 5px rgba(128, 128, 128, 0.5)", width: "45%", backgroundColor: "#c00a27",
                      color: "#FFF", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center",
                    }} >
                    <DeleteIcon style={{ fontSize: 20, marginRight: 5 }} /> Clear
                  </Button> */}
              <Button
                disabled={
                  roleBtnSettle() ||
                  basket.totalGrossAmount < minAmount ||
                  (basket.totalGrossAmount > maxAmount && maxAmount > 0) ||
                  productQuantity < minQty ||
                  (productQuantity > maxQty && maxQty > 0) ||
                  !deliveryProvider ||
                  !deliveryProvider.deliveryFeeFloat ||
                  deliveryProvider.deliveryFeeFloat < 0
                }
                onClick={() => {
                  roleTitleSettle() ? handleSettle() : handleSubmit();
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
                {roleIconSettle() ? (
                  <MonetizationOnIcon
                    style={{ fontSize: 20, marginRight: 5 }}
                  />
                ) : (
                  <CheckCircleIcon style={{ fontSize: 20, marginRight: 5 }} />
                )}
                {roleTitleSettle() ? "Confirm & Pay" : "Submit"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    outlet: state.outlet.defaultOutlet,
    color: state.theme.color,
    deliveryProvider: state.order.selectedDeliveryProvider,
    deliveryAddress: state.order.deliveryAddress,
    isLoggedIn: state.auth.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewCartBasket);
