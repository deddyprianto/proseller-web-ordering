import React, { Component } from "react";
import { connect } from "react-redux";
import voucherIcon from "../../assets/images/voucher-icon.png";
import config from "../../config";
import calculateTAX from "../../helpers/TaxCalculation";
import styles from "./GiftVoucherModal/styles.module.css";
import { isEmptyObject } from "../../helpers/CheckEmpty";
const encryptor = require("simple-encryptor")(process.env.REACT_APP_KEY_DATA);

class ModalDetailSVC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      count: 1,
      detailPurchase: {},
    };
  }

  handlePurchaseSVC = async () => {
    let { dataDetail } = this.props;
    let { detailPurchase, count } = this.state;
    const { backupOutlet, defaultOutlet } = this.props;

    let outlet = defaultOutlet
    if (outlet === undefined || outlet.id === undefined) {
      outlet = backupOutlet
    }

    const payload = {
      outletDetail: outlet,
      detailPurchase,
      storeValueCard: dataDetail,
      detailPoint: this.props.campaignPoint,
      pointsToRebateRatio: this.props.campaignPoint.pointsToRebateRatio,
      pendingPoints: this.props.campaignPoint.pendingPoints || 0,
      dataBasket: {
        totalNettAmount: detailPurchase.totalNettAmount,
        outlet: {
          name: `${count} x ${dataDetail.name} SVC`,
        },
      },
      outlet: {
        name: `${count} x ${dataDetail.name} SVC`,
        enablePayAtPOS: false,
      },
      storeDetail: {
        name: `${count} x ${dataDetail.name} SVC`,
        enablePayAtPOS: false,
        enableRedeemPoint: true,
        paidMembership: true,
      },
      paySVC: true,
    };

    localStorage.setItem(
      `${config.prefix}_dataSettle`,
      JSON.stringify(encryptor.encrypt(payload))
    );
    this.props.history.push("/payment");
  };

  findTax = async (dataDetail) => {
    const { count } = this.state;
    const { backupOutlet, defaultOutlet } = this.props;

    let outlet = defaultOutlet
    if (outlet === undefined || outlet.id === undefined) {
      outlet = backupOutlet
    }

    let returnData = {
      outlet,
      details: [],
    };
    let product = {};
    product.unitPrice = dataDetail.retailPrice;
    product.quantity = count;
    product.product = dataDetail;
    returnData.details.push(product);

    const result = await calculateTAX(returnData.details, returnData, {});

    return result;
  };

  componentDidUpdate = async (prevProps) => {
    try {
      if (this.state.count === 1) {
        this.setState({
          detailPurchase: this.props.detailPurchase,
        });
      }
      if (prevProps.dataDetail.id !== this.props.dataDetail.id) {
        this.setState({ count: 1 });
      }
    } catch (e) {}
  };

  render() {
    let { dataDetail, getCurrency } = this.props;
    let { count, detailPurchase } = this.state;
    return (
      <div>
        <div
          className="modal fade"
          id="voucher-detail-modal"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal-dialog-product modal-dialog-centered modal-full"
            role="document"
          >
            {dataDetail && (
              <div
                className="modal-content"
                style={{ width: "100%", marginTop: 20, marginBottom: 20 }}
              >
                <div
                  className="modal-header"
                  style={{ display: "flex", justifyContent: "left" }}
                >
                  <h5
                    className="modal-title"
                    id="exampleModalLabel"
                    style={{ fontSize: 20 }}
                  >
                    {dataDetail.name}
                  </h5>
                  <button
                    id="btn-close-detail-voucher"
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    style={{
                      position: "absolute",
                      right: 10,
                      top: 13,
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{ fontSize: 30, color: "red" }}
                    >
                      ×
                    </span>
                  </button>
                </div>
                <div className="modal-body">
                  <img
                    style={{
                      width: "100%",
                      height: 150,
                      objectFit: "contain",
                      overflow: "hidden",
                    }}
                    src={dataDetail.image ? dataDetail.image : voucherIcon}
                    alt="voucher"
                  />

                  <div
                    style={{ width: "100%", textAlign: "center", marginTop: 5 }}
                  >
                    <div
                      className=""
                      style={{ fontSize: 18, fontWeight: "bold" }}
                    >
                      {dataDetail.name}
                    </div>
                    
                    <div
                      className="customer-group-name"
                      style={{ fontSize: 15, fontWeight: "bold" }}
                    >
                      {getCurrency(dataDetail.retailPrice)}
                    </div>
                    <br />
                    <hr />
                    <div style={{ fontSize: 14, textAlign: "justify" }}>
                      {dataDetail.description}
                    </div>
                  </div>

                  <div
                    className={styles.counter}
                    style={{ marginTop: 30, marginBottom: 50, height: isEmptyObject(detailPurchase) ? 100 : 20 }}
                  ></div>

                  {!isEmptyObject(detailPurchase) && (
                    <div style={{ marginBottom: 50 }}>
                      <hr />
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <p
                          style={{ fontWeight: "bold" }}
                          className="customer-gr"
                        >
                          Point Rewards
                        </p>
                        <p
                          style={{ fontWeight: "bold" }}
                          className="font-color-theme"
                        >
                          {dataDetail.pointReward * count}
                        </p>
                      </div>
                      <hr />
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <p
                          style={{ fontWeight: "bold" }}
                          className="customer-gr"
                        >
                          Tax Amount
                        </p>
                        <p
                          style={{ fontWeight: "bold" }}
                          className="font-color-theme"
                        >
                          {getCurrency(detailPurchase.totalTaxAmount)}
                        </p>
                      </div>
                      <hr />
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <p
                          style={{ fontWeight: "bold" }}
                          className="font-color-theme"
                        >
                          Total
                        </p>
                        <p
                          style={{ fontWeight: "bold" }}
                          className="font-color-theme"
                        >
                          {getCurrency(detailPurchase.totalNettAmount)}
                        </p>
                      </div>
                      <hr />
                    </div>
                  )}

                  <div
                    className="pizzaro-handheld-footer-bar"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      padding: 5,
                      paddingBottom: 20,
                      paddingTop: 20,
                    }}
                  >
                    <div className="control-quantity">
                      <button
                        disabled={count === 0}
                        style={{ minWidth: 40 }}
                        className="btn btn-increase"
                        onClick={async () => {
                          if (count > 0)
                            await this.setState({ count: count - 1 });
                          const result = await this.findTax(
                            this.props.dataDetail
                          );
                          this.setState({ detailPurchase: result });
                        }}
                      >
                        <b className="text-btn-theme" style={{ fontSize: 20 }}>
                          -
                        </b>
                      </button>
                      <b
                        className="color"
                        style={{
                          fontSize: 20,
                          minWidth: 40,
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        {count}
                      </b>
                      <button
                        style={{ minWidth: 40 }}
                        className="btn btn-increase"
                        onClick={async () => {
                          await this.setState({ count: count + 1 });
                          const result = await this.findTax(
                            this.props.dataDetail
                          );
                          this.setState({ detailPurchase: result });
                        }}
                      >
                        <b className="text-btn-theme" style={{ fontSize: 20 }}>
                          +
                        </b>
                      </button>
                    </div>
                    <div style={{ width: "100%", marginLeft: 10 }}>
                      <button
                        disabled={count < 1}
                        className="btn btn-block btn-footer"
                        onClick={() => this.handlePurchaseSVC()}
                      >
                        <b className="text-btn-theme">
                          Purchase {getCurrency(detailPurchase.totalNettAmount)}
                        </b>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    account: state.auth.account.idToken.payload,
    pointData: state.campaign.data,
    campaignPoint: state.campaign.data,
    defaultOutlet: state.outlet.defaultOutlet,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalDetailSVC);
