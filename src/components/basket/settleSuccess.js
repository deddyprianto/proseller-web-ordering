import React, { Component } from "react";
import { Button } from "reactstrap";
import { connect } from "react-redux";
import CheckIcon from "../../assets/images/icon-check.png";
import KeranjangIcon from "../../assets/images/keranjang.png";
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
    };
  }

  componentDidMount = async () => {
    Swal.close();
    document.getElementById("open-modal-status").click();
    let infoCompany = encryptor.decrypt(
      JSON.parse(localStorage.getItem(`${config.prefix}_infoCompany`))
    );
    let settleSuccess = encryptor.decrypt(
      JSON.parse(localStorage.getItem(`${config.prefix}_settleSuccess`))
    );
    let dataBasket = encryptor.decrypt(
      JSON.parse(localStorage.getItem(`${config.prefix}_dataBasket`))
    );
    let orderingMode = localStorage.getItem(`${config.prefix}_ordering_mode`);
    this.setState({
      countryCode: infoCompany.countryCode,
      settleSuccess,
      orderingMode,
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
      if (price != undefined) {
        const { currency } = this.props.companyInfo;
        if (!price || price === "-") price = 0;
        let result = price.toLocaleString(currency.locale, {
          style: "currency",
          currency: currency.code,
        });
        return result;
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
    this.props.history.push("/history");
  };

  render() {
    let { settleSuccess, orderingMode, dataBasket } = this.state;
    const { currency } = this.props.companyInfo;
    return (
      <div>
        <ModalStatus
          paymentStatus={
            settleSuccess && settleSuccess.message === "payment failed!"
              ? false
              : true
          }
        />
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
                      backgroundColor: "#FFF",
                      width: "100%",
                      borderRadius: 5,
                      border: "1px solid #20a8d8",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <img
                        src={CheckIcon}
                        alt="check"
                        style={{ marginTop: -25 }}
                      />
                    </div>
                    <div>
                      <div
                        style={{
                          color: "#20a8d8",
                          fontSize: 16,
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        You've Paid
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          marginLeft: -10,
                        }}
                      >
                        <div
                          style={{
                            color: "gray",
                            fontSize: 10,
                            fontWeight: "bold",
                            marginRight: 5,
                          }}
                        >
                          {
                            this.getCurrency(settleSuccess.price).split(
                              currency.code
                            )[0]
                          }
                        </div>
                        <div
                          style={{
                            color: "gray",
                            fontSize: 35,
                            fontWeight: "bold",
                          }}
                        >
                          {
                            this.getCurrency(settleSuccess.price).split(
                              currency.code
                            )[1]
                          }
                        </div>
                      </div>
                      {settleSuccess.message !== undefined && (
                        <div
                          style={{
                            color: "#20a8d8",
                            fontSize: 12,
                            fontWeight: "bold",
                            textAlign: "center",
                            marginTop: -5,
                            marginBottom: 5,
                          }}
                        >
                          {settleSuccess.message}
                        </div>
                      )}
                    </div>

                    <div
                      style={{
                        backgroundColor: "gray",
                        height: 1,
                        width: "100%",
                        marginBottom: 10,
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        paddingLeft: 10,
                      }}
                    >
                      <img
                        src={KeranjangIcon}
                        alt="check"
                        height="40px"
                        width="40px"
                        style={{
                          border: "1px solid #20a8d8",
                          borderRadius: 45,
                          height: 45,
                          width: 45,
                          padding: 5,
                        }}
                      />
                      <div style={{ marginLeft: 10 }}>
                        <div
                          style={{
                            color: "#20a8d8",
                            fontWeight: "bold",
                            textAlign: "left",
                          }}
                        >
                          {settleSuccess.outletName}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            marginTop: -8,
                          }}
                        >
                          <div style={{ color: "gray", fontSize: 10 }}>
                            Ordering Mode
                          </div>
                          <div
                            style={{
                              color: "#20a8d8",
                              fontSize: 10,
                              marginLeft: 3,
                              fontWeight: "bold",
                            }}
                          >
                            {orderingMode}
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
                        <div>{this.getDate(settleSuccess.createdAt)}</div>
                      </div>
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
                          backgroundColor: "#20a8d8",
                          border: "1px solid #FFF",
                          color: "#FFF",
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
  };
};

export default connect(mapStateToProps, {})(SettleSuccess);
