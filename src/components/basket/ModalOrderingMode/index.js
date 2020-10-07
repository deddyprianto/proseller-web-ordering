import React, { Component } from "react";
import { connect } from "react-redux";

import styles from "./styles.module.css";

class ModalOrderingMode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEmenu: window.location.pathname.includes("emenu"),
    };
  }

  render() {
    let props = this.props.data;
    const { outlet } = this.props;
    return (
      <div
        className="modal fade"
        id="ordering-mode-basket-modal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-product modal-dialog-centered modal-full"
          role="document"
          style={{ justifyContent: "center", width: "100%" }}
        >
          <div className="modal-content modal-ordering-mode">
            <div
              className="modal-header modal-header-product"
              style={{ display: "flex", justifyContent: "center", padding: 7 }}
            >
              <h5 style={{ fontSize: 16, marginTop: 10 }} className="color">
                Select your dining preference
              </h5>
            </div>
            <div className="modal-body">
              <div className="col-md-12">
                <div style={{ justifyContent: "center" }}>
                  {props.storeDetail.enableDineIn === true && (
                    <div
                      className="order-mode"
                      data-dismiss="modal"
                      onClick={() => this.props.setOrderingMode("DINEIN")}
                      style={{
                        height: (outlet.orderValidation.dineIn.minAmount ? 80 : 50), alignItems: "center", justifyContent: "center",
                        padding: 5,
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "row", marginTop: 5, alignItems: "center", justifyContent: "center" }}>
                        <i className="fa fa-cutlery color icon-order" style={{ marginTop: 0, marginRight: 5, fontSize: 20 }}></i>
                        <div className="color" style={{ fontWeight: "bold", fontSize: 14 }}>
                          DINEIN
                        </div>
                      </div>
                      {
                        outlet.orderValidation.dineIn &&
                        <div style={{ fontSize: 12, marginTop: -5 }}>
                          <div style={{ height: 1, width: "100%", backgroundColor: "#CDCDCD", marginTop: 5 }} />
                          {outlet.orderValidation.dineIn.minAmount ||
                            outlet.orderValidation.dineIn.maxAmount ? (
                              <div style={{ display: "flex" }}>
                                <strong style={{ marginRight: 5 }}>Amount range</strong>
                                {
                                  `${this.props.getCurrency(outlet.orderValidation.dineIn.minAmount)} to 
                                  ${this.props.getCurrency(outlet.orderValidation.dineIn.maxAmount)}`
                                }
                              </div>
                            ) : null}
                          {outlet.orderValidation.dineIn.minQty ||
                            outlet.orderValidation.dineIn.maxQty ? (
                              <div style={{ display: "flex", marginTop: -10 }}>
                                <strong style={{ marginRight: 5 }}>Item quantity range</strong>
                                {outlet.orderValidation.dineIn.minQty} to{" "}
                                {outlet.orderValidation.dineIn.maxQty} items
                              </div>
                            ) : null}
                        </div>
                      }
                    </div>
                  )}
                  {props.storeDetail.enableTakeAway === true && (
                    <div
                      className="order-mode"
                      data-dismiss="modal"
                      onClick={() => this.props.setOrderingMode("TAKEAWAY")}
                      style={{
                        height: (outlet.orderValidation.takeAway.minAmount ? 80 : 50), alignItems: "center", justifyContent: "center",
                        padding: 5
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "row", marginTop: 5, alignItems: "center", justifyContent: "center" }}>
                        <i className="fa fa-shopping-basket color icon-order" style={{ marginTop: 0, marginRight: 5, fontSize: 20 }}></i>
                        <div className="color" style={{ fontWeight: "bold", fontSize: 14 }}>
                          TAKEAWAY
                        </div>
                      </div>
                      {
                        outlet.orderValidation.takeAway &&
                        <div style={{ fontSize: 12, marginTop: -5 }}>
                          <div style={{ height: 1, width: "100%", backgroundColor: "#CDCDCD", marginTop: 5 }} />
                          {outlet.orderValidation.takeAway.minAmount ||
                            outlet.orderValidation.takeAway.maxAmount ? (
                              <div style={{ display: "flex" }}>
                                <strong style={{ marginRight: 5 }}>Amount range</strong>
                                {
                                  `${this.props.getCurrency(outlet.orderValidation.takeAway.minAmount)} to 
                                  ${this.props.getCurrency(outlet.orderValidation.takeAway.maxAmount)}`
                                }
                              </div>
                            ) : null}
                          {outlet.orderValidation.takeAway.minQty ||
                            outlet.orderValidation.takeAway.maxQty ? (
                              <div style={{ display: "flex", marginTop: -10 }}>
                                <strong style={{ marginRight: 5 }}>Item quantity range</strong>
                                {outlet.orderValidation.takeAway.minQty} to{" "}
                                {outlet.orderValidation.takeAway.maxQty} items
                              </div>
                            ) : null}
                        </div>
                      }
                    </div>
                  )}

                  {props.storeDetail.enableStorePickUp === true && (
                    <div
                      className="order-mode"
                      data-dismiss="modal"
                      onClick={() => this.props.setOrderingMode("STOREPICKUP")}
                      style={{
                        height: (outlet.orderValidation.stroepickup.minAmount ? 80 : 50), alignItems: "center", justifyContent: "center",
                        padding: 5
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "row", marginTop: 5, alignItems: "center", justifyContent: "center" }}>
                        <i className="fa fa-shopping-basket color icon-order" style={{ marginTop: 0, marginRight: 5, fontSize: 20 }}></i>
                        <div className="color" style={{ fontWeight: "bold", fontSize: 14 }}>
                          STOREPICKUP
                      </div>
                      </div>

                      {
                        outlet.orderValidation.stroepickup &&
                        <div style={{ fontSize: 12, marginTop: -5 }}>
                          <div style={{ height: 1, width: "100%", backgroundColor: "#CDCDCD", marginTop: 5 }} />
                          {outlet.orderValidation.stroepickup.minAmount ||
                            outlet.orderValidation.stroepickup.maxAmount ? (
                              <div style={{ display: "flex" }}>
                                <strong style={{ marginRight: 5 }}>Amount range</strong>
                                {
                                  `${this.props.getCurrency(outlet.orderValidation.stroepickup.minAmount)} to 
                                  ${this.props.getCurrency(outlet.orderValidation.stroepickup.maxAmount)}`
                                }
                              </div>
                            ) : null}
                          {outlet.orderValidation.stroepickup.minQty ||
                            outlet.orderValidation.stroepickup.maxQty ? (
                              <div style={{ display: "flex", marginTop: -10 }}>
                                <strong style={{ marginRight: 5 }}>Item quantity range</strong>
                                {outlet.orderValidation.stroepickup.minQty} to{" "}
                                {outlet.orderValidation.stroepickup.maxQty} items
                              </div>
                            ) : null}
                        </div>
                      }
                    </div>
                  )}

                  {props.storeDetail.enableStoreCheckOut === true && (
                    <div
                      className="order-mode"
                      data-dismiss="modal"
                      onClick={() => this.props.setOrderingMode("STORECHECKOUT")}
                      style={{
                        height: (outlet.orderValidation.storecheckout.minAmount ? 80 : 50), alignItems: "center", justifyContent: "center",
                        padding: 5
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "row", marginTop: 5, alignItems: "center", justifyContent: "center" }}>
                        <i className="fa fa-shopping-basket color icon-order" style={{ marginTop: 0, marginRight: 5, fontSize: 20 }}></i>
                        <div className="color" style={{ fontWeight: "bold", fontSize: 14 }}>
                          STORECHECKOUT
                        </div>
                      </div>
                      {
                        outlet.orderValidation.storecheckout &&
                        <div style={{ fontSize: 12, marginTop: -5 }}>
                          <div style={{ height: 1, width: "100%", backgroundColor: "#CDCDCD", marginTop: 5 }} />
                          {outlet.orderValidation.storecheckout.minAmount ||
                            outlet.orderValidation.storecheckout.maxAmount ? (
                              <div style={{ display: "flex" }}>
                                <strong style={{ marginRight: 5 }}>Amount range</strong>
                                {
                                  `${this.props.getCurrency(outlet.orderValidation.storecheckout.minAmount)} to 
                                  ${this.props.getCurrency(outlet.orderValidation.storecheckout.maxAmount)}`
                                }
                              </div>
                            ) : null}
                          {outlet.orderValidation.storecheckout.minQty ||
                            outlet.orderValidation.storecheckout.maxQty ? (
                              <div style={{ display: "flex", marginTop: -10 }}>
                                <strong style={{ marginRight: 5 }}>Item quantity range</strong>
                                {outlet.orderValidation.storecheckout.minQty} to{" "}
                                {outlet.orderValidation.storecheckout.maxQty} items
                              </div>
                            ) : null}
                        </div>
                      }
                    </div>
                  )}

                  {props.storeDetail.enableDelivery === true && (
                    <div
                      className="order-mode"
                      data-dismiss="modal"
                      onClick={() => this.props.setOrderingMode("DELIVERY")}
                      style={{
                        height: (outlet.orderValidation.delivery.minAmount ? 80 : 50), alignItems: "center", justifyContent: "center",
                        padding: 5
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "row", marginTop: 5, alignItems: "center", justifyContent: "center" }}>
                        <i className="fa fa-car color icon-order" style={{ marginTop: 0, marginRight: 5, fontSize: 20 }}></i>
                        <div className="color" style={{ fontWeight: "bold", fontSize: 14 }}>
                          DELIVERY
                      </div>
                      </div>
                      {
                        outlet.orderValidation.delivery &&
                        <div style={{ fontSize: 12, marginTop: -5 }}>
                          <div style={{ height: 1, width: "100%", backgroundColor: "#CDCDCD", marginTop: 5 }} />
                          {outlet.orderValidation.delivery.minAmount ||
                            outlet.orderValidation.delivery.maxAmount ? (
                              <div style={{ display: "flex" }}>
                                <strong style={{ marginRight: 5 }}>Amount range</strong>
                                {
                                  `${this.props.getCurrency(outlet.orderValidation.delivery.minAmount)} to 
                                  ${this.props.getCurrency(outlet.orderValidation.delivery.maxAmount)}`
                                }
                              </div>
                            ) : null}
                          {outlet.orderValidation.delivery.minQty ||
                            outlet.orderValidation.delivery.maxQty ? (
                              <div style={{ display: "flex", marginTop: -10 }}>
                                <strong style={{ marginRight: 5 }}>Item quantity range</strong>
                                {outlet.orderValidation.delivery.minQty} to{" "}
                                {outlet.orderValidation.delivery.maxQty} items
                              </div>
                            ) : null}
                        </div>
                      }
                    </div>
                  )}
                </div>
                <p
                  id="dismiss-ordering-mode-basket-modal"
                  data-dismiss="modal"
                  className="color"
                  style={{
                    cursor: "pointer",
                    // textDecoration: "underline",
                    textAlign: "center",
                    marginTop: 30,
                    marginBottom: 20,
                  }}
                >
                  I'm just browsing
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    outlet: state.outlet.defaultOutlet,
    companyInfo: state.masterdata.companyInfo,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalOrderingMode);
