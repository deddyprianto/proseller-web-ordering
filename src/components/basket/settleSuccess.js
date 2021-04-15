import React, { Component } from "react";
import { Button } from "reactstrap";
import { connect } from "react-redux";
import ModalStatus from "./ModalSatatus";
import config from "../../config";

const encryptor = require("simple-encryptor")(process.env.REACT_APP_KEY_DATA);
const Swal = require("sweetalert2");

class SettleSuccess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countryCode: "SG",
      settleSuccess: null,
      orderingMode: "",
      dataBasket: null,
      paymentSuccess: {},
      infoCompany: {},
      successIcon: "",
    };
  }

  componentDidMount = async () => {
    Swal.close();
    document.getElementById("open-modal-status").click();
    let paymentSuccess = encryptor.decrypt(
      JSON.parse(localStorage.getItem(`${config.prefix}_paymentSuccess`))
    );
    let infoCompany = encryptor.decrypt(
      JSON.parse(localStorage.getItem(`${config.prefix}_infoCompany`))
    );
    let settleSuccess = encryptor.decrypt(
      JSON.parse(localStorage.getItem(`${config.prefix}_settleSuccess`))
    );
    let dataBasket = encryptor.decrypt(
      JSON.parse(localStorage.getItem(`${config.prefix}_dataBasket`))
    );
    const { orderingMode } = this.props;

    console.log(paymentSuccess);
    console.log(settleSuccess);

    let settingConfig = this.props.setting.find((items) => {
      return items.settingKey === "PaymentSuccessIcon";
    });
    if (settingConfig)
      this.setState({ successIcon: settingConfig.settingValue });

    this.setState({
      countryCode: infoCompany.countryCode,
      currency: infoCompany.currency,
      infoCompany,
      settleSuccess,
      orderingMode,
      paymentSuccess,
      dataBasket,
    });
    setTimeout(() => {
      try {
        document.getElementById("open-modal-status").click();
      } catch (error) {}
    }, 2500);
  };

  getCurrency = (price) => {
    if (this.props.companyInfo) {
      if (price !== undefined) {
        const { currency } = this.props.companyInfo;
        if (!price || price === "-") price = 0;
        let result = price.toLocaleString(currency.locale, {
          style: "currency",
          currency: currency.code,
        });
        return result.split(currency.code)[1];
      }
    }
  };

  getMonth(value) {
    var mount = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return mount[value];
  }

  getDate(date) {
    var tanggal = new Date(date);
    return (
      tanggal.getDate() +
      " " +
      this.getMonth(tanggal.getMonth()) +
      " " +
      tanggal.getFullYear() +
      " • " +
      tanggal.getHours() +
      ":" +
      tanggal.getMinutes()
    );
  }

  goBack = async () => {
    localStorage.removeItem(`${config.prefix}_dataBasket`);
    localStorage.removeItem(`${config.prefix}_scanTable`);
    localStorage.removeItem(`${config.prefix}_selectedVoucher`);
    localStorage.removeItem(`${config.prefix}_selectedPoint`);

    if (this.state.settleSuccess.paidMembership === true) {
      this.props.history.push("/profile");
    } else if (this.state.settleSuccess.paySVC === true) {
      this.props.history.push("/svc");
    } else {
      this.props.history.push("/history");
    }
  };

  getHeadMessage = (message) => {
    try {
      message = message.split(",");
      return message[0];
    } catch (e) {
      return "Congratulations";
    }
  };

  getSubtitleMessage = (message) => {
    try {
      message = message.split(",");
      return message[1];
    } catch (e) {
      return "";
    }
  };

  render() {
    let {
      settleSuccess,
      paymentSuccess,
      infoCompany,
      successIcon,
    } = this.state;
    let colorText = this.props.color.primary || "#c00a27";
    let secondaryColor = this.props.color.secondary || "#c00a27";
    let paymentStatus =
      settleSuccess && settleSuccess.message === "payment failed!"
        ? false
        : true;
    let discount = 0;
    if (settleSuccess && settleSuccess.payments) {
      settleSuccess.payments.forEach((items) => {
        if (items.paymentType === "voucher" || items.paymentType === "point") {
          discount += items.paymentAmount;
        }
      });
    }

    let totalAmount =
      (settleSuccess && settleSuccess.totalNettAmount) ||
      paymentSuccess.totalPrice;
    return (
      <div>
        <ModalStatus paymentStatus={paymentStatus} />
        <div className="col-full" style={{ marginTop: 130, marginBottom: 50 }}>
          <div id="primary" className="content-area">
            <div
              className="stretch-full-width"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <main
                id="main"
                className="site-main"
                style={{ maxWidth: 500, minWidth: 330 }}
              >
                {settleSuccess && (
                  <div
                    style={{
                      width: "100%",
                      borderRadius: 5,
                    }}
                  >
                    <h2
                      className="text-center"
                      style={{
                        color: secondaryColor,
                        fontFamily: "Arial Black",
                      }}
                    >
                      {this.getHeadMessage(
                        settleSuccess.message ||
                          "Please proceed payment at the store"
                      )}
                    </h2>
                    <h4
                      className="text-center"
                      style={{
                        color: secondaryColor,
                        fontFamily: "Arial Black",
                      }}
                    >
                      {this.getSubtitleMessage(
                        settleSuccess.message ||
                          "Please proceed payment at the store"
                      )}
                    </h4>
                    {successIcon && successIcon !== "" ? (
                      <img
                        src={successIcon}
                        alt="success logo"
                        style={{
                          height: 200,
                          objectFit: "contain",
                          marginTop: 10,
                          margin: "0 auto",
                          display: "block",
                        }}
                      />
                    ) : (
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <i
                          className={`fa ${
                            paymentStatus
                              ? "fa-check-circle"
                              : "fa-times-circle"
                          } background-theme`}
                          aria-hidden="true"
                          style={{
                            marginTop: 10,
                            fontSize: 180,
                            color: colorText,
                          }}
                        />
                      </div>
                    )}
                    <div
                      style={{
                        marginTop: 30,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        verticalAlign: "top",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          marginTop: -15,
                        }}
                      >
                        <div
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 50,
                            border: `1px solid ${colorText}`,
                            justifyContent: "center",
                          }}
                        >
                          <i
                            className="fa fa-shopping-cart"
                            aria-hidden="true"
                            style={{
                              color: colorText,
                              fontSize: 18,
                              alignSelf: "center",
                              marginLeft: 4,
                            }}
                          />
                        </div>
                        <div style={{ marginLeft: 10 }}>
                          <div
                            style={{
                              color: colorText,
                              fontWeight: "bold",
                              textAlign: "left",
                              fontSize: 14,
                            }}
                          >
                            {infoCompany.companyName}
                          </div>
                          <div
                            style={{
                              color: colorText,
                              textAlign: "left",
                              marginTop: -8,
                              fontSize: 12,
                            }}
                          >
                            {settleSuccess.outletName ||
                              (settleSuccess.outlet &&
                                settleSuccess.outlet.name)}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            color: colorText,
                            fontSize: 14,
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          {settleSuccess.payAtPOS
                            ? "Amount to Pay"
                            : "You've Paid"}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            marginLeft: -20,
                            marginTop: 10,
                          }}
                        >
                          <div
                            style={{
                              color: "gray",
                              fontSize: 10,
                              fontWeight: "bold",
                              marginTop: -20,
                            }}
                          >
                            {this.props.companyInfo &&
                              this.props.companyInfo.currency.code}
                          </div>
                          <div>
                            <div style={{ fontSize: 20, fontWeight: "bold" }}>
                              {this.getCurrency(totalAmount - discount)}
                            </div>
                            {discount > 0 && (
                              <div
                                style={{
                                  textAlign: "right",
                                  marginRight: -10,
                                  textDecorationLine: "line-through",
                                }}
                              >
                                {this.getCurrency(totalAmount)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        backgroundColor: "gray",
                        height: 1,
                        width: "100%",
                        marginBottom: 10,
                        marginTop: 10,
                      }}
                    />
                    <div
                      style={{
                        paddingRight: 10,
                        paddingLeft: 10,
                        fontSize: 14,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>Date & Time</div>
                        <div>
                          {this.getDate(
                            settleSuccess.createdAt || settleSuccess.createdOn
                          )}
                        </div>
                      </div>
                      {settleSuccess.paymentType && (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <div>Paid By</div>
                          <div>{settleSuccess.paymentType || "-"}</div>
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        backgroundColor: "gray",
                        height: 1,
                        width: "100%",
                        marginBottom: 10,
                        marginTop: 10,
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                    >
                      <Button
                        onClick={() => this.goBack()}
                        style={{
                          marginBottom: 10,
                          width: 100,
                          backgroundColor: colorText,
                          border: "1px solid #FFF",
                          fontWeight: "bold",
                        }}
                      >
                        OK
                      </Button>
                    </div>
                  </div>
                )}
              </main>
              <span
                data-toggle="modal"
                data-target="#status-ordering-modal"
                id="open-modal-status"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    companyInfo: state.masterdata.companyInfo.data,
    deliveryProvider: state.order.selectedDeliveryProvider,
    color: state.theme.color,
    setting: state.order.setting,
    orderingMode: state.order.orderingMode,
  };
};

export default connect(mapStateToProps, {})(SettleSuccess);
