import React from "react";
import { connect } from "react-redux";

import { Col, Row, Button } from "reactstrap";
import ItemsBasket from "./itemsBasket";
import MenuBasket from "./menuBasket";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import config from "../../config";

const ViewCartBasket = ({
  data,
  deliveryProvider,
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
  basket,
  handleSetState,
  dataBasket,
  updateCartInfo,
}) => {
  // if (!basket.details && data.dataBasket) basket = data.dataBasket;
  // if (data.dataBasket && data.dataBasket.details) basket = data.dataBasket;
  if (dataBasket && dataBasket.details) {
    basket = data.dataBasket;
    data.basket = dataBasket;
  }
  if (!outlet.orderValidation) {
    outlet = data.storeDetail;
    if (!outlet.orderValidation) outlet = config.getValidation(outlet);
  }

  let props = data;
  const roleBtnClear = () => {
    return (basket &&
      basket.status === "SUBMITTED" &&
      props.orderingMode &&
      (props.orderingMode === "TAKEAWAY" ||
        props.orderingMode === "STOREPICKUP" ||
        props.orderingMode === "STORECHECKOUT")) ||
      (basket &&
        basket.status !== "PENDING" &&
        basket.orderingMode === "DINEIN" &&
        basket.outlet.outletType === "QUICKSERVICE") ||
      (basket &&
        basket.orderingMode === "DELIVERY" &&
        basket.status !== "PENDING") ||
      basket.status === "CONFIRMED" ||
      basket.status === "PROCESSING" ||
      basket.status === "READY_FOR_COLLECTION"
      ? true
      : false;
  };

  const roleDisableNotPending = () => {
    return basket && basket.status !== "PENDING" ? true : false;
  };

  const roleBtnSettle = () => {
    return !props.btnBasketOrder ||
      (props.storeDetail &&
        props.storeDetail.orderingStatus === "UNAVAILABLE") ||
      (basket && basket.status === "PROCESSING") ||
      (basket && basket.status === "READY_FOR_COLLECTION") ||
      (basket &&
        basket.status === "SUBMITTED" &&
        basket.orderingMode === "DINEIN" &&
        basket.outlet.outletType === "RESTO") ||
      (((basket && basket.status === "SUBMITTED") ||
        basket.status === "CONFIRMED") &&
        props.orderingMode &&
        (props.orderingMode === "TAKEAWAY" ||
          props.orderingMode === "STOREPICKUP" ||
          props.orderingMode === "STORECHECKOUT")) ||
      (basket &&
        basket.status !== "PENDING" &&
        basket.status !== "PENDING_PAYMENT" &&
        basket.orderingMode === "DINEIN" &&
        basket.outlet.outletType === "QUICKSERVICE") ||
      (basket &&
        basket.orderingMode === "DELIVERY" &&
        basket.status !== "PENDING" &&
        basket.status !== "PENDING_PAYMENT") ||
      (isLoggedIn &&
        !deliveryProvider &&
        props.orderingMode &&
        props.orderingMode === "DELIVERY")
      ? true
      : false;
  };

  const roleOnClickSettle = () => {
    return (
      props.settle ||
      (props.orderingMode &&
        (props.orderingMode === "TAKEAWAY" ||
          props.orderingMode === "STOREPICKUP" ||
          props.orderingMode === "STORECHECKOUT" ||
          props.orderingMode === "DELIVERY")) ||
      (props.orderingMode &&
        props.orderingMode === "DINEIN" &&
        basket &&
        basket.outlet.outletType === "QUICKSERVICE" &&
        basket.outlet.enableTableScan === false) ||
      (basket && basket.status !== "PENDING")
    );
  };

  const roleIconSettle = () => {
    return (
      props.settle ||
      (props.orderingMode &&
        (props.orderingMode === "TAKEAWAY" ||
          props.orderingMode === "STOREPICKUP" ||
          props.orderingMode === "STORECHECKOUT" ||
          props.orderingMode === "DELIVERY")) ||
      (props.orderingMode &&
        props.orderingMode === "DINEIN" &&
        basket &&
        basket.outlet.outletType === "QUICKSERVICE" &&
        ((basket && basket.outlet.enableTableScan === false) ||
          basket.outlet.enableTableScan === "-")) ||
      (basket && basket.status !== "PENDING") ||
      (props.storeDetail &&
        props.storeDetail.enableTableScan !== false &&
        props.scanTable &&
        props.scanTable.table) ||
      (props.scanTable &&
        props.scanTable.table &&
        basket.outlet.outletType !== "RESTO")
    );
  };

  const roleTitleSettle = () => {
    return roleIconSettle();
  };

  const orderingModeField =
    data.dataBasket.orderingMode === "DINEIN"
      ? "dineIn"
      : data.dataBasket.orderingMode === "DELIVERY"
      ? "delivery"
      : "takeAway";

  const productQuantity =
    basket &&
    basket.details &&
    basket.details.reduce((acc, item) => ({
      quantity: acc.quantity + item.quantity,
    })).quantity;

  let { minQty, maxQty, minAmount, maxAmount } =
    outlet.orderValidation[orderingModeField];
  minQty = minQty || 0;
  maxQty = maxQty || 0;
  minAmount = minAmount || 0;
  maxAmount = maxAmount || 0;

  const btnSattleStatusDisable =
    !(
      basket.outlet.outletType === "RESTO" &&
      basket.orderingMode === "DINEIN" &&
      basket.isPaymentComplete === false
    ) &&
    (roleBtnSettle() ||
      basket.totalGrossAmount < minAmount ||
      (basket && basket.totalGrossAmount > maxAmount && maxAmount > 0) ||
      productQuantity < minQty ||
      (productQuantity > maxQty && maxQty > 0) ||
      (data.dataBasket.orderingMode === "DELIVERY" && !deliveryProvider) ||
      (deliveryProvider && deliveryProvider.deliveryFeeFloat < 0) ||
      (props.timeslotData &&
        props.timeslotData.length > 0 &&
        !props.orderActionTimeSlot &&
        data.dataBasket.orderingMode !== "DINEIN"));
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
            dataBasket={basket}
            countryCode={props.countryCode}
            getCurrency={(price) => getCurrency(price)}
            handleSetState={(field, value) => handleSetState(field, value)}
            handleClear={(dataBasket) => handleClear(dataBasket)}
            roleBtnClear={roleBtnClear()}
            updateCartInfo={updateCartInfo}
          />
        </Col>
        <Col xs="12" sm="6">
          <MenuBasket
            color={color}
            data={data}
            basket={basket}
            productQuantity={productQuantity}
            orderValidation={outlet.orderValidation[orderingModeField]}
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
            btnSattleStatusDisable={btnSattleStatusDisable}
            handleSetState={(field, value) => handleSetState(field, value)}
            timeslotData={props.timeslotData}
          />
        </Col>
      </Row>

      {props.widthSelected < 1200 && (
        <div
          className="background-theme"
          style={{
            padding: 10,
            width: "101%",
            marginLeft: props.widthSelected >= 750 ? -65 : -15,
            marginBottom: props.widthSelected >= 1200 ? 0 : 70,
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
            position: "fixed",
            bottom: 0,
            boxShadow: "1px -2px 2px rgba(128, 128, 128, 0.5)",
            justifyContent: "center",
          }}
        >
          {deliveryProvider &&
            deliveryProvider.minPurchaseForFreeDelivery &&
            deliveryProvider.deliveryFeeFloat !== 0 &&
            props.orderingMode === "DELIVERY" && (
              <div>
                <div
                  className="small text-left color-active"
                  style={{ lineHeight: "17px", textAlign: "center" }}
                >
                  {`Enjoy free delivery when your order amount is more than ${getCurrency(
                    Number(deliveryProvider.minPurchaseForFreeDelivery)
                  )}`}
                </div>
                <div
                  style={{
                    height: 1,
                    backgroundColor: "#CDCDCD",
                    width: "100%",
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                />
              </div>
            )}

          {isLoggedIn &&
            deliveryProvider &&
            props.orderingMode &&
            props.orderingMode === "DELIVERY" && (
              <div style={{ marginLeft: 10, marginRight: 10 }}>
                {deliveryProvider ? (
                  deliveryProvider.deliveryFeeFloat < 0 ? (
                    <div
                      className="small text-left text-warning-theme"
                      style={{ lineHeight: "17px", textAlign: "center" }}
                    >
                      Delivery is not available in your area.
                    </div>
                  ) : null
                ) : null}
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
              GRAND TOTAL
            </div>
            <div
              style={{
                fontWeight: "bold",
                color: color.primary,
                fontSize: 16,
              }}
            >
              {getCurrency(basket.totalNettAmount)}
            </div>
          </div>

          {basket && basket.inclusiveTax > 0 && (
            <div
              style={{
                marginTop: -6,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginLeft: 10,
                marginRight: 10,
              }}
            >
              <div style={{ opacity: 0.6, fontSize: 12 }}>
                {" "}
                Inclusive Tax {basket.outlet.taxPercentage}%{" "}
              </div>
              <div style={{ opacity: 0.6, fontSize: 12 }}>
                {" "}
                {getCurrency(basket.inclusiveTax)}{" "}
              </div>
            </div>
          )}

          {!(
            basket.outlet.outletType === "RESTO" &&
            basket.orderingMode === "DINEIN"
          ) &&
          (basket.status === "PROCESSING" ||
            basket.status === "READY_FOR_COLLECTION" ||
            basket.status === "READY_FOR_DELIVERY" ||
            basket.status === "ON_THE_WAY") ? (
            <div
              style={{
                padding: 10,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Button
                className="button"
                style={{
                  width: "100%",
                  fontWeight: "bold",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 50,
                }}
                onClick={() => setViewCart(false)}
              >
                <i
                  className="fa fa-shopping-cart"
                  aria-hidden="true"
                  style={{ fontSize: 20, marginRight: 10 }}
                />
                Waiting Order
              </Button>
            </div>
          ) : (
            <div
              style={{
                padding: 10,
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
                disabled={btnSattleStatusDisable}
                onClick={() => {
                  roleOnClickSettle() ? handleSettle() : handleSubmit();
                }}
                className="button"
                style={{
                  boxShadow: "1px 2px 5px rgba(128, 128, 128, 0.5)",
                  width: "100%",
                  display: "flex",
                  fontWeight: "bold",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 50,
                }}
              >
                {roleIconSettle() ? (
                  <MonetizationOnIcon
                    style={{ fontSize: 20, marginRight: 5 }}
                  />
                ) : (
                  <CheckCircleIcon style={{ fontSize: 20, marginRight: 5 }} />
                )}
                {roleTitleSettle()
                  ? basket.outlet.outletType === "RESTO" &&
                    basket.orderingMode === "DINEIN"
                    ? "Settle"
                    : "Confirm & Pay"
                  : "Submit"}
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
    basket: state.order.basket,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewCartBasket);
