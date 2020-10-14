import React, { useEffect } from "react";
import { connect } from "react-redux";

import { Col, Row, Button } from "reactstrap";
import ItemsBasket from "./itemsBasket";
import MenuBasket from "./menuBasket";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import config from "../../config";

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
  basket,
  handleSetState
}) => {
  if (!outlet.orderValidation) {
    outlet = data.storeDetail
    if (!outlet.orderValidation) outlet = config.getValidation(outlet)
  }

  const roleBtnClear = () => {
    let props = data;
    return (basket &&
      basket.status === "SUBMITTED" &&
      props.orderingMode &&
      (
        props.orderingMode === "TAKEAWAY" ||
        props.orderingMode === "STOREPICKUP" ||
        props.orderingMode === "STORECHECKOUT"
      )) ||
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
    let props = data;
    return !props.btnBasketOrder ||
      props.storeDetail &&
      props.storeDetail.orderingStatus === "UNAVAILABLE" ||
      basket && basket.status === "PROCESSING" ||
      basket && basket.status === "READY_FOR_COLLECTION" ||
      (basket &&
        basket.status === "SUBMITTED" &&
        basket.orderingMode === "DINEIN" &&
        basket.outlet.outletType === "RESTO") ||
      (((basket && basket.status === "SUBMITTED") ||
        basket.status === "CONFIRMED") &&
        props.orderingMode &&
        (
          props.orderingMode === "TAKEAWAY" ||
          props.orderingMode === "STOREPICKUP" ||
          props.orderingMode === "STORECHECKOUT"
        )
      ) ||
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
    let props = data;
    return (
      props.settle ||
      (props.orderingMode &&
        (
          props.orderingMode === "TAKEAWAY" ||
          props.orderingMode === "STOREPICKUP" ||
          props.orderingMode === "STORECHECKOUT" ||
          props.orderingMode === "DELIVERY"
        )
      ) ||
      (props.orderingMode &&
        props.orderingMode === "DINEIN" &&
        basket &&
        basket.outlet.outletType === "QUICKSERVICE" &&
        basket.outlet.enableTableScan === false) ||
      (basket && basket.status !== "PENDING")
    );
  };

  const roleIconSettle = () => {
    let props = data;
    return (
      props.settle ||
      (props.orderingMode &&
        (
          props.orderingMode === "TAKEAWAY" ||
          props.orderingMode === "STOREPICKUP" ||
          props.orderingMode === "STORECHECKOUT" ||
          props.orderingMode === "DELIVERY"
        )
      ) ||
      (props.orderingMode &&
        props.orderingMode === "DINEIN" &&
        basket &&
        basket.outlet.outletType === "QUICKSERVICE" &&
        ((basket && basket.outlet.enableTableScan === false) ||
          basket.outlet.enableTableScan === "-")) ||
      (basket && basket.status !== "PENDING") ||
      (props.storeDetail &&
        props.storeDetail.enableTableScan !== false &&
        props.scanTable
      ) ||
      (
        props.scanTable &&
        props.scanTable.table
      )
    );
  };

  const roleTitleSettle = () => {
    return roleIconSettle();
  };

  let props = data;
  // const basket = data.dataBasket;
  const orderingModeField = data.dataBasket.orderingMode === "DINEIN" ? "dineIn" : data.dataBasket.orderingMode === "DELIVERY" ? "delivery" : "takeAway";

  const productQuantity =
    basket &&
    basket.details &&
    basket.details.reduce((acc, item) => ({ quantity: acc.quantity + item.quantity })).quantity;

  const { minQty, maxQty, minAmount, maxAmount } = outlet.orderValidation[orderingModeField];

  useEffect(() => {
    if (deliveryAddress) {
      console.log("delivery address changed");
    }
  }, [deliveryAddress, data, outlet]);

  const btnSattleStatusDisable = (
    roleBtnSettle() ||
    basket.totalGrossAmount < minAmount ||
    (basket &&
      basket.totalGrossAmount > maxAmount &&
      maxAmount > 0) ||
    productQuantity < minQty ||
    (productQuantity > maxQty && maxQty > 0) ||
    data.dataBasket.orderingMode === "DELIVERY" &&
    !deliveryProvider ||
    deliveryProvider &&
    deliveryProvider.deliveryFeeFloat < 0
  )

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
            handleSetState={(field, value) =>
              handleSetState(field, value)
            }
            handleClear={(dataBasket) => handleClear(dataBasket)}
            roleBtnClear={roleBtnClear()}
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
            handleSetState={(field, value) =>
              handleSetState(field, value)
            }
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
                  {getCurrency(basket && basket.totalNettAmount)}
                </div>
              </div>
            </div> */}

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
                  <div>
                    <div className="small text-left text-danger" style={{ lineHeight: "17px", textAlign: "center" }}>
                      {
                        `Your order has exceeded maximum allowed item quantity for
                      ${data.dataBasket.orderingMode} (maximum quantity ${maxQty}). 
                      Please remove some item from your cart.`
                      }
                    </div>
                    <div style={{ height: 1, backgroundColor: "#CDCDCD", width: "100%", marginTop: 10, marginBottom: 10 }} />
                  </div>
                )
              ) : (
                  <div>
                    <div className="small text-left text-danger" style={{ lineHeight: "17px", textAlign: "center" }}>
                      {
                        `Your order hasn't reached minimum allowed item quantity for
                      ${data.dataBasket.orderingMode} (minimum quantity ${minQty}). 
                      Please add some item to your cart.`
                      }
                    </div>
                    <div style={{ height: 1, backgroundColor: "#CDCDCD", width: "100%", marginTop: 10, marginBottom: 10 }} />
                  </div>
                )
            ) : (
                <div>
                  <div className="small text-left text-danger" style={{ lineHeight: "17px", textAlign: "center" }}>
                    {
                      `Your order has exceeded maximum allowed order amount for
                    ${data.dataBasket.orderingMode} ( maximum amount ${getCurrency(maxAmount)}). 
                    Please remove some item from your cart.`
                    }
                  </div>
                  <div style={{ height: 1, backgroundColor: "#CDCDCD", width: "100%", marginTop: 10, marginBottom: 10 }} />
                </div>
              )
          ) : (
              <div>
                <div className="small text-left text-danger" style={{ lineHeight: "17px", textAlign: "center" }}>
                  {
                    `Your order hasn't reached minimum allowed order amount for
                  ${data.dataBasket.orderingMode} (minimum amount ${getCurrency(minAmount)}). 
                  Please add some item to your cart.`
                  }
                </div>
                <div style={{ height: 1, backgroundColor: "#CDCDCD", width: "100%", marginTop: 10, marginBottom: 10 }} />
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
              {
                getCurrency(
                  data.dataBasket.totalNettAmount + 
                  (data.dataBasket.orderingMode === "DELIVERY" && deliveryProvider && deliveryProvider.deliveryFeeFloat)
                )
              }
            </div>
          </div>

          {basket.status === "PROCESSING" ||
            basket.status === "READY_FOR_COLLECTION" ||
            basket.status === "READY_FOR_DELIVERY" ||
            basket.status === "ON_THE_WAY" ? (
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
                  disabled={btnSattleStatusDisable}
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
    basket: state.order.basket,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewCartBasket);
