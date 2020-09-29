import React, { Component } from "react";
import AddPromo from "./addPromo";
import TableNo from "./tableNo";
import StatusOrder from "./statusOrder";
import OrderingMode from "./orderingMode";
import TaxAmount from "./taxAmount";
import TotalSurchargeAmount from "./TotalSurchargeAmount";
import DeliveryAddressBasket from "./deliveryAddressBasket";
import ProviderDeliveryBasket from "./providerDeliveryBasket";
import { Button } from "reactstrap";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

export default class MenuBasket extends Component {
  render() {
    let props = this.props.data;
    return (
      <div style={{ marginTop: -8 }}>
        {/* {
          ((props.myVoucher && props.myVoucher.length > 0) || props.totalPoint > 0) && this.props.isLoggedIn &&
          <div style={{ textAlign: "left" }}>
            <AddPromo
              data={props}
              roleBtnClear={this.props.roleBtnClear}
              cancelSelectVoucher={() => this.props.cancelSelectVoucher()}
              cancelSelectPoint={() => this.props.cancelSelectPoint()}
              handleRedeemVoucher={() => this.props.handleRedeemVoucher()}
              handleRedeemPoint={() => this.props.handleRedeemPoint()}
              getCurrency={(price) => this.props.getCurrency(price)}
              scrollPoint={(data) => this.props.scrollPoint(data)}
              setPoint={(point) => this.props.setPoint(point)}
            />
          </div>
        } */}
        {props.dataBasket &&
          (props.dataBasket.tableNo || props.scanTable) &&
          props.dataBasket.orderingMode !== "DELIVERY" &&
          props.dataBasket.outlet && (
            <div style={{ textAlign: "left" }}>
              {" "}
              <TableNo data={props} />{" "}
            </div>
          )}
        {props.dataBasket && (
          <div style={{ textAlign: "left" }}>
            {" "}
            <StatusOrder data={props} />{" "}
          </div>
        )}

        <div style={{ textAlign: "left" }}>
          <OrderingMode
            data={props}
            roleDisableNotPending={this.props.roleDisableNotPending}
            setOrderingMode={(mode) => this.props.setOrderingMode(mode)}
            isLoggedIn={this.props.isLoggedIn}
          />
        </div>

        {props.dataBasket.totalSurchargeAmount > 0 && (
          <TotalSurchargeAmount
            data={props}
            getCurrency={(price) => this.props.getCurrency(price)}
          />
        )}

        {props.dataBasket.totalTaxAmount > 0 && (
          <TaxAmount
            data={props}
            getCurrency={(price) => this.props.getCurrency(price)}
          />
        )}

        {/* {this.props.isLoggedIn && <PaymentMethodBasket data={props} roleBtnClear={this.props.roleBtnClear} />} */}

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
              <ProviderDeliveryBasket
                data={props}
                roleBtnClear={this.props.roleBtnClear}
                handleSetProvaider={(item) =>
                  this.props.handleSetProvaider(item)
                }
              />
            }
          </div>
        )}

        {props.widthSelected >= 1200 && (
          <div
            style={{
              border: "1px solid #DCDCDC",
              borderRadius: 5,
              marginTop: 10,
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
                  color: this.props.color.primary,
                  fontSize: 16,
                }}
              >
                TOTAL
              </div>
              <div
                style={{
                  fontWeight: "bold",
                  color: this.props.color.primary,
                  fontSize: 16,
                }}
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
                <Button
                  className="profile-dashboard"
                  disabled={this.props.roleBtnSettle}
                  onClick={() => {
                    this.props.roleTitleSettle
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
        )}
      </div>
    );
  }
}
