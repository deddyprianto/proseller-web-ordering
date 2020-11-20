import React, { Component } from "react";
import { connect } from "react-redux";
import TableNo from "./tableNo";
import StatusOrder from "./statusOrder";
import OrderingMode from "./orderingMode";
import TotalSurchargeAmount from "./TotalSurchargeAmount";
import PickupDateTime from "./pickupDateTime";
import DeliveryAddressBasket from "./deliveryAddressBasket";
import ProviderDeliveryBasket from "./providerDeliveryBasket";
import { Button } from "reactstrap";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import config from "../../config";

class MenuBasket extends Component {
  render() {
    let {colorTheme, data, basket, productQuantity} = this.props
    let props = data;
    let { minQty, maxQty, minAmount, maxAmount } = this.props.orderValidation;
    minQty = minQty || 0
    maxQty = maxQty || 0
    minAmount = minAmount || 0
    maxAmount = maxAmount || 0

    let deficiencyAmount = minAmount - basket.totalNettAmount
    let deficiencyAmountPercent = (basket.totalNettAmount/minAmount) * 100
    if(deficiencyAmount < 0) deficiencyAmount = 0
    if(deficiencyAmountPercent > 100) deficiencyAmountPercent = 100

    let deficiencyFreeDelivery = 0
    let deficiencyFreeDeliveryPercent = 0
    if(props.provaiderDelivery && props.provaiderDelivery.minPurchaseForFreeDelivery){
      deficiencyFreeDelivery = props.provaiderDelivery.minPurchaseForFreeDelivery - basket.totalNettAmount
      deficiencyFreeDeliveryPercent = (basket.totalNettAmount/props.provaiderDelivery.minPurchaseForFreeDelivery) * 100
      if(deficiencyFreeDelivery < 0) deficiencyFreeDelivery = 0
      if(deficiencyFreeDeliveryPercent > 100) deficiencyFreeDeliveryPercent = 100
    }
    
    return (
      <div style={{ marginTop: -8 }}>
        <div
          style={{
            border: "1px solid #DCDCDC",
            borderRadius: 5,
            marginTop: 10,
          }}
        >
          {basket.totalNettAmount >= minAmount ? (
            basket.totalNettAmount <= maxAmount || maxAmount === 0 ? (
              productQuantity >= minQty ? (
                productQuantity <= maxQty || maxQty === 0 ? null : (
                  <div>
                    <div className="small text-left text-warning-theme" style={{ lineHeight: "17px", textAlign: "center", padding: 5 }}>
                      {
                        `Your order has exceeded maximum quantity for
                        ${config.checkNickName(props.dataBasket.orderingMode, props.storeDetail)} (maximum quantity ${maxQty}). 
                        Please remove some item from your order.`
                      }
                    </div>
                  </div>
                )
              ) : (
                  <div>
                    <div className="small text-left text-warning-theme" style={{ lineHeight: "17px", textAlign: "center", padding: 5 }}>
                      {
                        `Your order hasn't reached minimum quantity for
                        ${config.checkNickName(props.dataBasket.orderingMode, props.storeDetail)} (minimum quantity ${minQty}). 
                        Please add more item to your order.`
                      }
                    </div>
                  </div>
                )
            ) : (
                <div>
                  <div className="small text-left text-warning-theme" style={{ lineHeight: "17px", textAlign: "center", padding: 5 }}>
                    {
                      `Your order has exceeded maximum amount for
                      ${config.checkNickName(props.dataBasket.orderingMode, props.storeDetail)} (maximum amount ${this.props.getCurrency(maxAmount)}). 
                      Please remove some item from your order.`
                    }
                  </div>
                </div>
              )
          ) : (
              <div>
                <div className="small text-left text-warning-theme" style={{ lineHeight: "17px", textAlign: "center", padding: 5 }}>
                  {
                    `Your order hasn't reached minimum amount for
                    ${config.checkNickName(props.dataBasket.orderingMode, props.storeDetail)} (minimum amount ${this.props.getCurrency(minAmount)}). 
                    Please add more item to your order.`
                  }
                </div>
              </div>
            )}
        </div>

        <div
          style={{
            border: "1px solid #DCDCDC",
            borderRadius: 5,
            marginTop: 10,
          }}
        >
          {
            minAmount > 0 &&
            <div style={{textAlign: "left", padding: 10, fontSize: 12}}>
              {`${this.props.getCurrency(deficiencyAmount)} more to min order of ${this.props.getCurrency(minAmount)}`}
              <div style={{ backgroundColor: "gray", borderRadius: 5}} >
                <div style={{
                  height: 5, width: `${deficiencyAmountPercent}%`, 
                  backgroundColor: deficiencyAmountPercent === 100 ? "#067E30" : colorTheme.primary, 
                  borderRadius: 5
                }}/>
              </div>
            </div>
          }
          {
            props.provaiderDelivery &&
            props.provaiderDelivery.minPurchaseForFreeDelivery &&
            props.dataBasket.orderingMode === "DELIVERY" &&
            <div style={{textAlign: "left", padding: 10, fontSize: 12}}>
              {`${this.props.getCurrency(Number(deficiencyFreeDelivery))} more to free delivery`}
              <div style={{ backgroundColor: "gray", borderRadius: 5}} >
                <div style={{
                  height: 5, width: `${deficiencyFreeDeliveryPercent}%`, 
                  backgroundColor: deficiencyFreeDeliveryPercent === 100 ? "#067E30" : colorTheme.primary, 
                  borderRadius: 5
                }}/>
              </div>
            </div>
          }
        </div>

        {props.dataBasket &&
          (props.dataBasket.tableNo || props.scanTable) &&
          props.dataBasket.orderingMode !== "DELIVERY" &&
          props.dataBasket.orderingMode !== "TAKEAWAY" &&
          props.dataBasket.outlet && (
            <div style={{ textAlign: "left" }}>
              <TableNo data={props} />
            </div>
          )}
        {props.dataBasket && (
          <div style={{ textAlign: "left" }}>
            <StatusOrder data={props} />
          </div>
        )}

        <div style={{ textAlign: "left" }}>
          <OrderingMode
            data={props}
            roleDisableNotPending={this.props.roleDisableNotPending}
            setOrderingMode={(mode) => this.props.setOrderingMode(mode)}
            getCurrency={(price) => this.props.getCurrency(price)}
            isLoggedIn={this.props.isLoggedIn}
          />
        </div>

        {props.dataBasket.totalSurchargeAmount > 0 && (
          <TotalSurchargeAmount
            data={props}
            getCurrency={(price) => this.props.getCurrency(price)}
          />
        )}

        {/* {props.dataBasket.totalTaxAmount > 0 && (
          <TaxAmount
            data={props}
            getCurrency={(price) => this.props.getCurrency(price)}
          />
        )} */}

        {props.orderingMode && props.orderingMode === "DELIVERY" && (
          <div>
            {
              <DeliveryAddressBasket
                data={props}
                roleBtnClear={this.props.roleBtnClear}
                handleOpenLogin={() => this.props.handleOpenLogin()}
                isLoggedIn={this.props.isLoggedIn}
              />
            }
            {
              props.deliveryProvaider &&
              props.deliveryProvaider.length > 1 && (
                <ProviderDeliveryBasket
                  data={props}
                  roleBtnClear={this.props.roleBtnClear}
                  handleSetProvaider={(item) =>
                    this.props.handleSetProvaider(item)
                  }
                />
              )
            }

            {
              !props.deliveryProvaider &&
              props.dataBasket.orderingMode === "DELIVERY" &&
              <div
                style={{
                  border: "1px solid #DCDCDC",
                  borderRadius: 5,
                  marginTop: 10,
                }}
              >
                <div className="small text-left color-active" style={{ lineHeight: "17px", textAlign: "center", padding: 5 }}>
                  The delivery provider has not set it. 
                  Please confirm with the service provider.
                </div>
              </div>
            }

          </div>
        )}

        {
          props.orderingMode && 
          props.storeDetail.timeSlots && 
          props.storeDetail.timeSlots.length > 0 && 
          props.storeDetail.orderingMode !== 'DINEIN' &&
          <PickupDateTime
            data={props}
            roleBtnClear={this.props.roleBtnClear}
            isLoggedIn={this.props.isLoggedIn}
            handleSetState={(field, value) =>
              this.props.handleSetState(field, value)
            }
          />
        }

        <div style={{ border: "1px solid #DCDCDC", borderRadius: 5, marginTop: 10, }}> 
          {
            props.provaiderDelivery &&
            props.provaiderDelivery.minPurchaseForFreeDelivery &&
            props.orderingMode === "DELIVERY" &&
            <div>
              <div className="small text-left color-active" style={{ lineHeight: "17px", textAlign: "center", padding: 5 }}>
                {`Enjoy free delivery when your order amount is more than ${this.props.getCurrency(Number(props.provaiderDelivery.minPurchaseForFreeDelivery))}`}
              </div>
              <div style={{ height: 1, backgroundColor: "#CDCDCD", width: "100%", marginTop: 10, marginBottom: 10 }} />
            </div>
          }

          <div style={{ marginLeft: 10, marginRight: 10 }}>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }} >
              <div style={{ fontWeight: "bold" }}> Subtotal </div>
              <div style={{ fontWeight: "bold" }} >
                {`${this.props.getCurrency(props.dataBasket.totalGrossAmount)}`}
              </div>
            </div>
          </div>

          {
            props.provaiderDelivery &&
            props.orderingMode &&
            props.orderingMode === "DELIVERY" && (
            <div style={{ marginLeft: 10, marginRight: 10 }}>
              {
                props.provaiderDelivery ? (
                  props.provaiderDelivery.deliveryFeeFloat < 0 ? (
                  <div className="small text-left text-warning-theme" style={{ 
                    lineHeight: "17px", textAlign: "center", marginTop: 10 
                  }}>
                    Delivery is not available in your area.
                  </div>
                  ) : props.provaiderDelivery.deliveryFee ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ fontWeight: "bold" }}>
                        Delivery Fee
                      </div>
                      <div
                        style={{ fontWeight: "bold" }}
                      >{`${props.provaiderDelivery.deliveryFee}`}</div>
                    </div>
                  ) : (
                    <div className="small text-left text-warning-theme" style={{ lineHeight: "17px", textAlign: "center" }}>
                      Checking delivery availability...
                    </div>
                  )
                ) : null
              }
            </div>
          )}

          <div style={{ marginLeft: 10, marginRight: 10 }}>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }} >
              <div style={{ fontWeight: "bold" }}> Tax Amount </div>
              <div style={{ fontWeight: "bold" }} >
                {`${this.props.getCurrency(props.dataBasket.totalTaxAmount)}`}
              </div>
            </div>
          </div>
        </div>

        {
          props.widthSelected >= 1200 && 
          <div style={{ border: "1px solid #DCDCDC", borderRadius: 5, marginTop: 10, }}> 
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginLeft: 10,
                  marginRight: 10,
                }}
              >
                <div style={{ fontWeight: "bold", color: this.props.color.primary, fontSize: 16, }} > TOTAL </div>
                <div style={{ fontWeight: "bold", color: this.props.color.primary, fontSize: 16, }} >
                  {
                    this.props.getCurrency(
                      props.dataBasket.totalNettAmount
                    )
                  }
                </div>
              </div>
              {props.dataBasket.status === "PROCESSING" ||
              props.dataBasket.status === "READY_FOR_COLLECTION" ||
              props.dataBasket.status === "READY_FOR_DELIVERY" ||
              props.dataBasket.status === "ON_THE_WAY" ? (
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
                    style={{
                      width: "100%",
                      fontWeight: "bold",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center", height: 50
                    }}
                    onClick={() => this.props.setViewCart(false)}
                  >
                    <i className="fa fa-shopping-cart" aria-hidden="true" style={{fontSize: 20, marginRight: 10}}/>
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
                  <Button
                    disabled={this.props.btnSattleStatusDisable}
                    onClick={() => {
                      this.props.roleTitleSettle
                        ? this.props.handleSettle()
                        : this.props.handleSubmit();
                    }}
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
                    {this.props.roleIconSettle ? (
                      <MonetizationOnIcon
                        style={{ fontSize: 20, marginRight: 5 }}
                      />
                    ) : (
                        <CheckCircleIcon style={{ fontSize: 20, marginRight: 5 }} />
                      )}
                    {this.props.roleTitleSettle ? "Confirm & Pay" : "Submit"}
                  </Button>
                </div>
              )}
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    deliveryProviders: state.order.deliveryProviders,
    colorTheme: state.theme.color
  };
};
const mapDispatchToProps = (dispatch) => {
  return { dispatch };
};
export default connect(mapStateToProps, mapDispatchToProps)(MenuBasket);
