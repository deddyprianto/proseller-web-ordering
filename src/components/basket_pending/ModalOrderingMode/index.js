import React, { Component } from "react";
import { connect } from "react-redux";

class ModalOrderingMode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEmenu: window.location.pathname.includes("emenu"),
    };
  }

  checkOrderValidation(validation, type) {
    if (type === "titleAmount") {
      if (validation.minAmount === 0 && validation.maxAmount > 0) {
        return "Amount maximum"
      } else if (validation.minAmount > 0 && validation.maxAmount === 0) {
        return "Amount minimum"
      } else {
        return "Amount range"
      }
    } else if (type === "descAmount") {
      if (validation.minAmount === 0 && validation.maxAmount > 0) {
        return this.props.getCurrency(validation.maxAmount)
      } else if (validation.minAmount > 0 && validation.maxAmount === 0) {
        return this.props.getCurrency(validation.minAmount)
      } else {
        return `${this.props.getCurrency(validation.minAmount)} to ${this.props.getCurrency(validation.maxAmount)}`
      }
    } else if (type === "titleQty") {
      if (validation.minQty === 0 && validation.maxQty > 0) {
        return "Item quantity maximum"
      } else if (validation.minQty > 0 && validation.maxQty === 0) {
        return "Item quantity minimum"
      } else {
        return "Item quantity range"
      }
    } else if (type === "descQty") {
      if (validation.minQty === 0 && validation.maxQty > 0) {
        return `${validation.maxQty} items`
      } else if (validation.minQty > 0 && validation.maxQty === 0) {
        return `${validation.minQty} items`
      } else {
        return `${validation.minQty} to ${validation.maxQty} items`
      }
    }
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
                                <strong style={{ marginRight: 5 }}>
                                  {this.checkOrderValidation(outlet.orderValidation.dineIn, "titleAmount")}
                                </strong>
                                {this.checkOrderValidation(outlet.orderValidation.dineIn, "descAmount")}
                              </div>
                            ) : null}
                          {outlet.orderValidation.dineIn.minQty ||
                            outlet.orderValidation.dineIn.maxQty ? (
                              <div style={{ display: "flex", marginTop: -10 }}>
                                <strong style={{ marginRight: 5 }}>
                                  {this.checkOrderValidation(outlet.orderValidation.dineIn, "titleQty")}
                                </strong>
                                {this.checkOrderValidation(outlet.orderValidation.dineIn, "descQty")}
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
                                <strong style={{ marginRight: 5 }}>
                                  {this.checkOrderValidation(outlet.orderValidation.takeAway, "titleAmount")}
                                </strong>
                                {this.checkOrderValidation(outlet.orderValidation.takeAway, "descAmount")}
                              </div>
                            ) : null}
                          {outlet.orderValidation.takeAway.minQty ||
                            outlet.orderValidation.takeAway.maxQty ? (
                              <div style={{ display: "flex", marginTop: -10 }}>
                                <strong style={{ marginRight: 5 }}>
                                  {this.checkOrderValidation(outlet.orderValidation.takeAway, "titleQty")}
                                </strong>
                                {this.checkOrderValidation(outlet.orderValidation.takeAway, "descQty")}
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
                        height: (outlet.orderValidation.storepickup.minAmount ? 80 : 50), alignItems: "center", justifyContent: "center",
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
                        outlet.orderValidation.storepickup &&
                        <div style={{ fontSize: 12, marginTop: -5 }}>
                          <div style={{ height: 1, width: "100%", backgroundColor: "#CDCDCD", marginTop: 5 }} />
                          {outlet.orderValidation.storepickup.minAmount ||
                            outlet.orderValidation.storepickup.maxAmount ? (
                              <div style={{ display: "flex" }}>
                                <strong style={{ marginRight: 5 }}>
                                  {this.checkOrderValidation(outlet.orderValidation.storepickup, "titleAmount")}
                                </strong>
                                {this.checkOrderValidation(outlet.orderValidation.storepickup, "descAmount")}
                              </div>
                            ) : null}
                          {outlet.orderValidation.storepickup.minQty ||
                            outlet.orderValidation.storepickup.maxQty ? (
                              <div style={{ display: "flex", marginTop: -10 }}>
                                <strong style={{ marginRight: 5 }}>
                                  {this.checkOrderValidation(outlet.orderValidation.storepickup, "titleQty")}
                                </strong>
                                {this.checkOrderValidation(outlet.orderValidation.storepickup, "descQty")}
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
                                <strong style={{ marginRight: 5 }}>
                                  {this.checkOrderValidation(outlet.orderValidation.storecheckout, "titleAmount")}
                                </strong>
                                {this.checkOrderValidation(outlet.orderValidation.storecheckout, "descAmount")}
                              </div>
                            ) : null}
                          {outlet.orderValidation.storecheckout.minQty ||
                            outlet.orderValidation.storecheckout.maxQty ? (
                              <div style={{ display: "flex", marginTop: -10 }}>
                                <strong style={{ marginRight: 5 }}>
                                  {this.checkOrderValidation(outlet.orderValidation.storecheckout, "titleQty")}
                                </strong>
                                {this.checkOrderValidation(outlet.orderValidation.storecheckout, "descQty")}
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
                                <strong style={{ marginRight: 5 }}>
                                  {this.checkOrderValidation(outlet.orderValidation.delivery, "titleAmount")}
                                </strong>
                                {this.checkOrderValidation(outlet.orderValidation.delivery, "descAmount")}
                              </div>
                            ) : null}
                          {outlet.orderValidation.delivery.minQty ||
                            outlet.orderValidation.delivery.maxQty ? (
                              <div style={{ display: "flex", marginTop: -10 }}>
                                <strong style={{ marginRight: 5 }}>
                                  {this.checkOrderValidation(outlet.orderValidation.delivery, "titleQty")}
                                </strong>
                                {this.checkOrderValidation(outlet.orderValidation.delivery, "descQty")}
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
