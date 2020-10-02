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
    const { outlet, companyInfo } = this.props;
    const { isEmenu } = this.state;
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
              <h5 style={{ fontSize: 17, marginTop: 10 }} className="color">
                Select your dining preference
              </h5>
            </div>
            <div className="modal-body">
              <div className="col-md-12">
                <div className={styles.orderingModes}>
                  {props.storeDetail.enableDineIn === true && (
                    <div
                      className={styles.orderMode}
                      data-dismiss="modal"
                      onClick={() => this.props.setOrderingMode("DINEIN")}
                    >
                      <h5 className="color" style={{ fontWeight: 1000 }}>
                        DINEIN
                      </h5>
                      <i className="fa fa-cutlery color icon-order"></i>
                      {
                        outlet.orderValidation.dineIn &&
                        <div className={styles.validation}>
                          {outlet.orderValidation.dineIn.minAmount ||
                            outlet.orderValidation.dineIn.maxAmount ? (
                              <div>
                                <div>
                                  <strong>Amount range</strong>
                                </div>{" "}
                                {companyInfo && companyInfo.data.currency.code}{" "}
                                {outlet.orderValidation.dineIn.minAmount} to{" "}
                                {companyInfo && companyInfo.data.currency.code}{" "}
                                {outlet.orderValidation.dineIn.maxAmount}
                              </div>
                            ) : null}
                          {outlet.orderValidation.dineIn.minQty ||
                            outlet.orderValidation.dineIn.maxQty ? (
                              <div>
                                <div>
                                  <strong>Item quantity range</strong>
                                </div>{" "}
                                {outlet.orderValidation.dineIn.minQty} to{" "}
                                {outlet.orderValidation.dineIn.maxQty} items
                              </div>
                            ) : null}
                        </div>
                      }
                      <button
                        className="btn btn-block btn-footer"
                        style={{ marginTop: 37 }}
                      >
                        <b>Select</b>
                      </button>
                    </div>
                  )}
                  {props.storeDetail.enableTakeAway === true && (
                    <div
                      className={styles.orderMode}
                      data-dismiss="modal"
                      onClick={() => this.props.setOrderingMode("TAKEAWAY")}
                    >
                      <h5 className="color" style={{ fontWeight: 1000 }}>
                        TAKE AWAY
                      </h5>
                      <i className="fa fa-shopping-basket color icon-order"></i>
                      {
                        outlet.orderValidation.takeAway &&
                        <div className={styles.validation}>
                          {outlet.orderValidation.takeAway.minAmount ||
                            outlet.orderValidation.takeAway.maxAmount ? (
                              <div>
                                <div>
                                  <strong>Amount range</strong>
                                </div>{" "}
                                {companyInfo && companyInfo.data.currency.code}{" "}
                                {outlet.orderValidation.takeAway.minAmount} to{" "}
                                {companyInfo && companyInfo.data.currency.code}{" "}
                                {outlet.orderValidation.takeAway.maxAmount}
                              </div>
                            ) : null}
                          {outlet.orderValidation.takeAway.minQty ||
                            outlet.orderValidation.takeAway.maxQty ? (
                              <div>
                                <div>
                                  <strong>Item quantity range</strong>
                                </div>{" "}
                                {outlet.orderValidation.takeAway.minQty} to{" "}
                                {outlet.orderValidation.takeAway.maxQty} items
                              </div>
                            ) : null}
                        </div>
                      }
                      <button
                        className="btn btn-block btn-footer"
                        style={{ marginTop: 37 }}
                      >
                        <b>Select</b>
                      </button>
                    </div>
                  )}

                  {props.storeDetail.enableStorePickUp === true && (
                    <div
                      className={styles.orderMode}
                      data-dismiss="modal"
                      onClick={() => this.props.setOrderingMode("STOREPICKUP")}
                    >
                      <h5 className="color" style={{ fontWeight: 1000 }}>
                        STOREPICKUP
                      </h5>
                      <i className="fa fa-shopping-basket color icon-order"></i>

                      {
                        outlet.orderValidation.stroepickup &&
                        <div className={styles.validation}>
                          {outlet.orderValidation.stroepickup.minAmount ||
                            outlet.orderValidation.stroepickup.maxAmount ? (
                              <div>
                                <div>
                                  <strong>Amount range</strong>
                                </div>{" "}
                                {companyInfo && companyInfo.data.currency.code}{" "}
                                {outlet.orderValidation.stroepickup.minAmount} to{" "}
                                {companyInfo && companyInfo.data.currency.code}{" "}
                                {outlet.orderValidation.stroepickup.maxAmount}
                              </div>
                            ) : null}
                          {outlet.orderValidation.stroepickup.minQty ||
                            outlet.orderValidation.stroepickup.maxQty ? (
                              <div>
                                <div>
                                  <strong>Item quantity range</strong>
                                </div>{" "}
                                {outlet.orderValidation.stroepickup.minQty} to{" "}
                                {outlet.orderValidation.stroepickup.maxQty} items
                              </div>
                            ) : null}
                        </div>
                      }
                      <button
                        className="btn btn-block btn-footer"
                        style={{ marginTop: 37 }}
                      >
                        <b>Select</b>
                      </button>
                    </div>
                  )}

                  {props.storeDetail.enableStoreCheckOut === true && (
                    <div
                      className={styles.orderMode}
                      data-dismiss="modal"
                      onClick={() => this.props.setOrderingMode("STORECHECKOUT")}
                    >
                      <h5 className="color" style={{ fontWeight: 1000 }}>
                        STORECHECKOUT
                      </h5>
                      <i className="fa fa-shopping-basket color icon-order"></i>
                      {
                        outlet.orderValidation.storecheckout &&
                        <div className={styles.validation}>
                          {outlet.orderValidation.storecheckout.minAmount ||
                            outlet.orderValidation.storecheckout.maxAmount ? (
                              <div>
                                <div>
                                  <strong>Amount range</strong>
                                </div>{" "}
                                {companyInfo && companyInfo.data.currency.code}{" "}
                                {outlet.orderValidation.storecheckout.minAmount} to{" "}
                                {companyInfo && companyInfo.data.currency.code}{" "}
                                {outlet.orderValidation.storecheckout.maxAmount}
                              </div>
                            ) : null}
                          {outlet.orderValidation.storecheckout.minQty ||
                            outlet.orderValidation.storecheckout.maxQty ? (
                              <div>
                                <div>
                                  <strong>Item quantity range</strong>
                                </div>{" "}
                                {outlet.orderValidation.storecheckout.minQty} to{" "}
                                {outlet.orderValidation.storecheckout.maxQty} items
                              </div>
                            ) : null}
                        </div>
                      }
                      <button
                        className="btn btn-block btn-footer"
                        style={{ marginTop: 37 }}
                      >
                        <b>Select</b>
                      </button>
                    </div>
                  )}

                  {props.storeDetail.enableDelivery === true && (
                    <div
                      className={styles.orderMode}
                      data-dismiss="modal"
                      onClick={() => this.props.setOrderingMode("DELIVERY")}
                    >
                      <h5 className="color" style={{ fontWeight: 1000 }}>
                        DELIVERY
                      </h5>
                      <i className="fa fa-car color icon-order"></i>
                      {
                        outlet.orderValidation.delivery &&
                        <div className={styles.validation}>
                          {outlet.orderValidation.delivery.minAmount ||
                            outlet.orderValidation.delivery.maxAmount ? (
                              <div>
                                <div>
                                  <strong>Amount range</strong>
                                </div>{" "}
                                {companyInfo && companyInfo.data.currency.code}{" "}
                                {outlet.orderValidation.delivery.minAmount} to{" "}
                                {companyInfo && companyInfo.data.currency.code}{" "}
                                {outlet.orderValidation.delivery.maxAmount}
                              </div>
                            ) : null}
                          {outlet.orderValidation.delivery.minQty ||
                            outlet.orderValidation.delivery.maxQty ? (
                              <div>
                                <div>
                                  <strong>Item quantity range</strong>
                                </div>{" "}
                                {outlet.orderValidation.delivery.minQty} to{" "}
                                {outlet.orderValidation.delivery.maxQty} items
                              </div>
                            ) : null}
                        </div>
                      }
                      <button
                        className="btn btn-block btn-footer"
                        style={{ marginTop: 37 }}
                      >
                        <b>Select</b>
                      </button>
                    </div>
                  )}
                </div>
                <p
                  id="dismiss-ordering-mode-basket-modal"
                  data-dismiss="modal"
                  className="color"
                  style={{
                    cursor: "pointer",
                    textDecoration: "underline",
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
