import React, { Component } from "react";
import { Button } from "reactstrap";
import _ from "lodash";
import moment from "moment";

import Iframe from "react-iframe";

import LoadingPayAtPOS from "../loading/LoadingPayAtPOS";
import KeranjangIcon from "../../assets/images/keranjang.png";
import AddPromo from "../basket/addPromo";
import { connect } from "react-redux";
import PaymentMethodBasket from "../basket/paymentMethodBasket";
import { OrderAction } from "../../redux/actions/OrderAction";
import Sound_Effect from "../../assets/sound/Sound_Effect.mp3";
import { isEmptyObject, isEmptyArray } from "../../helpers/CheckEmpty";
import Lottie from "lottie-react-web";
import emptyGif from "../../assets/gif/empty-and-lost.json";
import config from "../../config";

import { lsLoad } from "../../helpers/localStorage";

import styles from "./styles.module.css";

const Swal = require("sweetalert2");
const encryptor = require("simple-encryptor")(process.env.REACT_APP_KEY_DATA);
const companyInfo = encryptor.decrypt(
  JSON.parse(localStorage.getItem(`${config.prefix}_infoCompany`))
);
const account = encryptor.decrypt(lsLoad(`${config.prefix}_account`, true));

class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingShow: true,
      isLoading: false,
      isLoadingPOS: false,
      dataBasket: null,
      myVoucher: null,
      countryCode: "SG",
      totalPoint: 0,
      campaignPointActive: {},
      campaignPointAnnouncement: false,
      detailPoint: null,
      discountVoucher: 0,
      newTotalPrice: "0",
      selectedVoucher: null,
      statusSelectedVoucher: null,
      selectedPoint: null,
      statusSelectedPoint: null,
      discountPoint: 0,
      needPoint: 0,
      scanTable: null,
      selectedCard: null,
      totalPrice: 0,
      deliveryAddress: null,
      provaiderDelivery: null,
      viewCart: true,
      viewCartStatus: true,
      widthSelected: 0,
      settle: false,
      storeDetail: null,
      pointsToRebateRatio: "0:0",
      roundingOptions: "INTEGER",
      xstep: 1,
      orderingMode: "",
      btnBasketOrder: true,
      play: false,
      deliveryProvaider: [],
      dataCVV: "",
      cartDetails: {},
      dataSettle: {},
      failed: false,
      showPaymentPage: false,
      paymentUrl: "",
    };
    this.audio = new Audio(Sound_Effect);
  }

  componentDidMount = async () => {
    await this.getDataBasket();
  };

  componentWillUnmount = () => {
    try {
      clearInterval(this.loopCart);
    } catch (e) {}
  };

  getPendingOrder = async (cart) => {
    try {
      clearInterval(this.loopCart);
    } catch (e) {}

    this.loopCart = setInterval(async () => {
      await this.getCart(cart);
    }, 2000);
  };

  openTab(url) {
    // Create link in memory
    var a = window.document.createElement("a");
    a.target = "_blank";
    a.href = url;

    // Dispatch fake click
    var e = window.document.createEvent("MouseEvents");
    e.initMouseEvent(
      "click",
      true,
      true,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null
    );
    a.dispatchEvent(e);
  }

  getPendingPayment = async (payment) => {
    // this.openTab(payment.action.url);
    this.setState({
      isLoading: false,
      showPaymentPage: true,
      paymentUrl: payment.action.url,
    });

    // let hostedPage = window.open(payment.action.url, "_blank");
    // if (hostedPage == null || typeof hostedPage == "undefined") {
    //   Swal.fire({
    //     icon: "info",
    //     timer: 1500,
    //     showConfirmButton: false,
    //     title: "Please disable your pop-up blocker and try again.",
    //   });
    //   return;
    // } else {
    //   hostedPage.focus();
    // }

    for (let i = 0; i < 1000; i++) {
      const response = await this.props.dispatch(OrderAction.getCart());
      console.log(response);
      if (
        (response && response.resultCode === 400) ||
        (response.data && response.data.isPaymentComplete)
      ) {
        // hostedPage.close();
        let data = {
          message: "Congratulations, payment success",
          paymentType: payment.paymentType || "CASH",
          price: this.state.totalPrice,
          outletName: this.state.dataBasket.outlet.name,
          orderingMode: this.state.dataBasket.orderingMode,
          createdAt: new Date(),
        };

        localStorage.setItem(
          `${config.prefix}_settleSuccess`,
          JSON.stringify(encryptor.encrypt(data))
        );
        localStorage.removeItem(`${config.prefix}_selectedPoint`);
        localStorage.removeItem(`${config.prefix}_selectedVoucher`);
        localStorage.removeItem(`${config.prefix}_dataSettle`);
        this.togglePlay();
        await this.props.dispatch(OrderAction.setData({}, "DATA_BASKET"));
        this.props.history.push("/settleSuccess");
        this.setState({ isLoading: false, showPaymentPage: false });
        return;
      } else if (
        response.data.confirmationInfo == undefined ||
        response.data.action == undefined
      ) {
        // hostedPage.close();
        Swal.fire(
          "Payment Failed",
          response.message || "Please try again",
          "error"
        );
        this.setState({
          isLoading: false,
          failed: true,
          showPaymentPage: false,
        });
        return;
      }
    }
  };

  getCart = async (cart) => {
    const response = await this.props.dispatch(
      OrderAction.getCartPending(cart.id)
    );

    if (response.resultCode == 400 || response.data.isPaymentComplete == true) {
      clearInterval(this.loopCart);

      let data = {
        message: "Congratulations, payment success",
        paymentType: "CASH",
        price: this.state.totalPrice,
        outletName: this.state.dataBasket.outlet.name,
        orderingMode: this.state.dataBasket.orderingMode,
        createdAt: new Date(),
      };

      localStorage.setItem(
        `${config.prefix}_settleSuccess`,
        JSON.stringify(encryptor.encrypt(data))
      );
      localStorage.removeItem(`${config.prefix}_selectedPoint`);
      localStorage.removeItem(`${config.prefix}_selectedVoucher`);
      localStorage.removeItem(`${config.prefix}_dataSettle`);
      this.togglePlay();
      await this.props.dispatch(OrderAction.setData({}, "DATA_BASKET"));
      this.props.history.push("/settleSuccess");
      this.setState({ isLoading: false, isLoadingPOS: false });
    }
  };

  getDataBasket = async () => {
    let dataSettle = encryptor.decrypt(
      JSON.parse(localStorage.getItem(`${config.prefix}_dataSettle`))
    );
    let selectedVoucher = encryptor.decrypt(
      JSON.parse(localStorage.getItem(`${config.prefix}_selectedVoucher`))
    );
    let selectedPoint = encryptor.decrypt(
      JSON.parse(localStorage.getItem(`${config.prefix}_selectedPoint`))
    );
    let selectedCard = encryptor.decrypt(
      JSON.parse(localStorage.getItem(`${config.prefix}_selectedCard`))
    );
    let paymentCardAccountDefault = encryptor.decrypt(
      JSON.parse(
        localStorage.getItem(`${config.prefix}_paymentCardAccountDefault`)
      )
    );

    if (dataSettle === null) return;

    this.setState({ dataSettle });

    if (paymentCardAccountDefault) selectedCard = paymentCardAccountDefault;
    console.log(selectedVoucher);

    await this.getStatusVoucher(
      selectedVoucher,
      dataSettle.storeDetail,
      dataSettle.dataBasket
    );

    let money =
      (selectedPoint || 0) / dataSettle.pointsToRebateRatio.split(":")[0];
    if (dataSettle.detailPoint.roundingOptions !== "DECIMAL")
      money = Math.floor(money);
    else money = money.toFixed(2);

    let discount = parseFloat(money) + this.state.discountVoucher;
    let totalPrice =
      dataSettle.dataBasket.totalNettAmount - discount < 0
        ? 0
        : dataSettle.dataBasket.totalNettAmount - discount;
    this.setState({
      ...dataSettle,
      selectedVoucher,
      selectedPoint,
      selectedCard,
      totalPrice,
    });
  };

  getStatusVoucher = (selectedVoucher, storeDetail, dataBasket) => {
    if (selectedVoucher !== null) {
      let checkOutlet = false;
      if (
        selectedVoucher.selectedOutlets &&
        selectedVoucher.selectedOutlets.length > 0
      ) {
        selectedVoucher.selectedOutlets.forEach((element) => {
          if (element === storeDetail.sortKey) {
            checkOutlet = true;
          }
        });
      } else {
        checkOutlet = true;
      }

      let voucherType = selectedVoucher.voucherType;
      let voucherValue = selectedVoucher.voucherValue;
      let discount = 0;
      let checkProduct = undefined;
      if (dataBasket.details && dataBasket.details.length > 0) {
        checkProduct = _.filter(dataBasket.details, {
          productID: selectedVoucher.productID,
        })[0];
      }
      if (checkOutlet) {
        if (selectedVoucher.applyToSpecificProduct) {
          if (checkProduct) {
            let date = new Date();
            let tanggal = moment().format().split("T")[0];
            let region = moment().format().split("+")[1];
            let activeWeekDays = selectedVoucher.validity.activeWeekDays;
            let validHour = activeWeekDays[date.getDay()].validHour;
            let validHourFrom = validHour.from;
            let validHourTo = validHour.to;
            if (activeWeekDays[date.getDay()].active) {
              let statusValidHour = moment(moment().format()).isBetween(
                tanggal + "T" + validHourFrom + ":00" + "+" + region,
                tanggal + "T" + validHourTo + ":00" + "+" + region
              );
              if (statusValidHour) {
                if (voucherType === "discPercentage") {
                  discount =
                    Number(checkProduct.unitPrice) *
                    Number(checkProduct.quantity) *
                    (Number(voucherValue) / 100);
                } else {
                  discount = voucherValue;
                }

                if (selectedVoucher.capAmount != undefined) {
                  if (
                    discount > selectedVoucher.capAmount &&
                    selectedVoucher.capAmount > 0
                  ) {
                    discount = selectedVoucher.capAmount;
                  }
                }

                this.setState({
                  discountVoucher: discount,
                  statusSelectedVoucher: true,
                  selectedVoucher,
                });
              } else {
                this.setRemoveVoucher("Voucher not available this time!");
              }
            } else {
              this.setRemoveVoucher("Voucher not available today!");
            }
          } else {
            this.setRemoveVoucher("Voucher only available this product!");
          }
        } else {
          if (voucherType === "discPercentage") {
            discount =
              Number(dataBasket.totalNettAmount) * (Number(voucherValue) / 100);
          } else {
            discount = voucherValue;
          }

          if (selectedVoucher.capAmount != undefined) {
            if (
              discount > selectedVoucher.capAmount &&
              selectedVoucher.capAmount > 0
            ) {
              discount = selectedVoucher.capAmount;
            }
          }

          this.setState({
            discountVoucher: discount,
            statusSelectedVoucher: true,
            selectedVoucher,
          });
        }
      } else {
        this.setRemoveVoucher("Voucher be used this outlet!");
      }
    }
  };

  roleBtnClear = () => {
    let props = this.state;
    return (props.dataBasket.status === "SUBMITTED" &&
      props.orderingMode &&
      props.orderingMode === "TAKEAWAY") ||
      (props.dataBasket.orderingMode === "DINEIN" &&
        props.dataBasket.outlet.outletType === "QUICKSERVICE") ||
      (props.dataBasket.orderingMode === "DELIVERY" &&
        props.dataBasket.status !== "PENDING") ||
      props.dataBasket.status === "CONFIRMED" ||
      props.dataBasket.status === "PROCESSING" ||
      props.dataBasket.status === "READY_FOR_COLLECTION"
      ? true
      : false;
  };

  getCurrency = (price) => {
    let { countryCode } = this.props;
    price = parseFloat(price);
    if (price != undefined) {
      let currency = { code: "en-US", currency: "SGD" };
      if (countryCode === "SG") currency = { code: "en-US", currency: "SGD" };
      if (!price || price === "-") price = 0;
      let result = price.toLocaleString(currency.code, {
        style: "currency",
        currency: currency.currency,
      });
      return result;
    }
  };

  cancelSelectVoucher = async () => {
    this.setState({
      discountVoucher: 0,
      newTotalPrice: "0",
      isLoading: true,
      selectedVoucher: false,
    });
    localStorage.removeItem(`${config.prefix}_selectedVoucher`);
    await this.getDataBasket();
  };

  cancelSelectPoint = async () => {
    this.setState({
      discountPoint: 0,
      selectedPoint: 0,
      newTotalPrice: "0",
      isLoading: true,
    });
    localStorage.removeItem(`${config.prefix}_selectedPoint`);
    await this.getDataBasket();
  };

  handleRedeemVoucher = async () => {
    this.setState({ discountPoint: 0 });
    localStorage.removeItem(`${config.prefix}_selectedPoint`);
    this.props.history.push(`/myVoucher`);
  };

  handleRedeemPoint = async () => {
    localStorage.removeItem(`${config.prefix}_selectedVoucher`);
    let selectedPoint = this.state.selectedPoint || 0;
    let totalPoint = this.state.totalPoint;
    let pointsToRebateRatio = this.state.pointsToRebateRatio;
    let needPoint = this.calculateSelectedPoint(selectedPoint, "selectedPoint");

    if (selectedPoint <= 0) {
      selectedPoint = this.calculateSelectedPoint(
        selectedPoint,
        "selectedPoint"
      );
      if (selectedPoint > totalPoint) {
        selectedPoint = this.calculateSelectedPoint(totalPoint, "allIn");
        needPoint = selectedPoint;
      }
    } else if (selectedPoint > totalPoint) {
      selectedPoint = this.calculateSelectedPoint(totalPoint, "allIn");
      needPoint = selectedPoint;
    } else if (
      pointsToRebateRatio.split(":")[0] &&
      pointsToRebateRatio.split(":")[1] === "0"
    ) {
      selectedPoint = 0;
    }

    if (needPoint > totalPoint) needPoint = totalPoint;

    let textRasio = `Redeem ${
      pointsToRebateRatio.split(":")[0]
    } point to ${this.getCurrency(
      parseInt(pointsToRebateRatio.split(":")[1])
    )}`;
    this.setState({
      discountVoucher: 0,
      textRasio,
      selectedPoint,
      needPoint,
      selectedVoucher: null,
      statusSelectedVoucher: false,
    });
  };

  scrollPoint = (data) => {
    data = this.calculateSelectedPoint(data);
    this.setState({ selectedPoint: data });
  };

  calculateSelectedPoint = (selectedPoint, type = null) => {
    let { dataBasket, pointsToRebateRatio, detailPoint } = this.state;

    if (type === "selectedPoint") {
      selectedPoint =
        (dataBasket.totalNettAmount / pointsToRebateRatio.split(":")[1]) *
        pointsToRebateRatio.split(":")[0];
    }

    if (detailPoint.roundingOptions === "DECIMAL") {
      return parseFloat(selectedPoint.toFixed(2));
    } else {
      if (type === "allin") return Math.floor(selectedPoint);
      else return Math.ceil(selectedPoint);
    }
  };

  setPoint = (point, dataBasket = null, pointsToRebateRatio) => {
    if (!dataBasket) {
      dataBasket = this.state.dataBasket;
    }
    if (!pointsToRebateRatio) {
      pointsToRebateRatio = this.state.pointsToRebateRatio;
    }
    let totalPrice =
      (point / pointsToRebateRatio.split(":")[0]) *
      pointsToRebateRatio.split(":")[1];
    totalPrice =
      dataBasket.totalNettAmount - totalPrice < 0
        ? 0
        : dataBasket.totalNettAmount - totalPrice;
    localStorage.setItem(
      `${config.prefix}_selectedPoint`,
      JSON.stringify(encryptor.encrypt(point))
    );
    this.setState({
      selectedPoint: point,
      discountPoint: point,
      totalPrice,
      newTotalPrice: totalPrice,
    });
    return point;
  };

  setRemoveVoucher = (message) => {
    localStorage.removeItem(`${config.prefix}_selectedVoucher`);
    this.setState({ statusSelectedVoucher: false, selectedVoucher: null });
    Swal.fire("Oppss!", message, "error");
  };

  handleSettle = async (payAtPOS) => {
    let { selectedCard } = this.state;

    if (selectedCard) {
      let userInput = selectedCard.details.userInput;
      if (userInput.length > 0) {
        let needCVV = userInput.find((items) => {
          return items.name === "cardCVV" && items.required;
        });

        if (Object.keys(needCVV).length !== 0) {
          console.log("need cvv");
          return;
        }
      }
    }

    this.submitSettle(null, payAtPOS);
  };

  submitSettle = async (need = null, payAtPOS) => {
    let infoCompany = encryptor.decrypt(
      JSON.parse(localStorage.getItem(`${config.prefix}_infoCompany`))
    );
    Swal.fire({
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      onOpen: () => {
        Swal.showLoading();
      },
    });
    let {
      orderingMode,
      selectedCard,
      dataBasket,
      dataCVV,
      deliveryAddress,
      provaiderDelivery,
      selectedVoucher,
      selectedPoint,
      storeDetail,
      totalPrice,
      scanTable,
    } = this.state;

    let payload = {};

    if (totalPrice != 0) {
      let paymentPayload = {
        accountId: selectedCard.accountID,
      };

      if (!isEmptyArray(infoCompany.paymentTypes)) {
        const find = infoCompany.paymentTypes.find(
          (item) => item.paymentID == selectedCard.paymentID
        );
        if (find != undefined) {
          if (find.isAccountRequired == false) {
            paymentPayload.paymentID = selectedCard.paymentID;
            paymentPayload.accountData = account;
          }
        }
      }

      payload.paymentPayload = paymentPayload;
    }

    // if (selectedCard && !payAtPOS) {
    //   payload = {
    //     paymentType: "CREDITCARD",
    //     creditCardPayload: {
    //       accountId: selectedCard.accountID,
    //       companyID: this.props.account.companyId,
    //       referenceNo: uuid(),
    //       remark: '-',
    //     }
    //   };
    //   if (need === 'cardCVV') payload.creditCardPayload['cardCVV'] = Number(dataCVV)
    // }

    payload.orderingMode = orderingMode;
    payload.cartID = dataBasket.cartID;

    if (orderingMode === "DELIVERY") {
      payload.deliveryAddress = deliveryAddress;
      payload.deliveryProvider = provaiderDelivery.name;
      payload.deliveryProviderName = provaiderDelivery.name;
      payload.deliveryService = "-";
      payload.deliveryProviderId = provaiderDelivery.id;
      payload.deliveryFee = provaiderDelivery.deliveryFeeFloat;
    }

    if (selectedVoucher !== null && !payAtPOS) {
      payload.statusAdd = "addVoucher";
      payload.voucherId = selectedVoucher.voucherId || selectedVoucher.id;
      payload.voucherSerialNumber =
        selectedVoucher.voucherSerialNumber || selectedVoucher.serialNumber;
      payload.price = totalPrice;
    } else if (selectedPoint > 0 && !payAtPOS) {
      payload.statusAdd = "addPoint";
      payload.redeemValue = selectedPoint;
      payload.price = dataBasket.totalNettAmount;
    }

    if (payAtPOS) payload.payAtPOS = true;
    if (scanTable) payload.tableNo = scanTable.table || scanTable.tableNo;

    if (orderingMode === "DINEIN") {
      try {
        const tableNo = encryptor.decrypt(
          JSON.parse(localStorage.getItem(`${config.prefix}_scanTable`))
        );
        payload.tableNo = tableNo.table;
      } catch (e) {}
    }

    let response;
    if (
      orderingMode === "TAKEAWAY" ||
      orderingMode === "DELIVERY" ||
      storeDetail.outletType === "QUICKSERVICE"
    ) {
      response = await this.props.dispatch(OrderAction.submitTakeAway(payload));
    } else {
      response = await this.props.dispatch(OrderAction.submitSettle(payload));
    }
    // console.log(response)

    if (response && response.resultCode === 400) {
      Swal.fire(
        "Oppss!",
        response.message || response.data.message || "Payment Failed!",
        "error"
      );
    } else if (!payAtPOS) {
      // if need further actions
      if (response.data.action != undefined) {
        if (response.data.action.type === "url") {
          this.getPendingPayment(response.data);
        }
      } else {
        localStorage.setItem(
          `${config.prefix}_settleSuccess`,
          JSON.stringify(encryptor.encrypt(response.data))
        );
        localStorage.removeItem(`${config.prefix}_selectedPoint`);
        localStorage.removeItem(`${config.prefix}_selectedVoucher`);
        localStorage.removeItem(`${config.prefix}_dataSettle`);
        this.togglePlay();
        await this.props.dispatch(OrderAction.setData({}, "DATA_BASKET"));
        this.props.history.push("/settleSuccess");
        // this.setState({ isLoading: false });
      }
    } else {
      await this.setState({
        isLoading: false,
        isLoadingPOS: true,
        cartDetails: response.data,
      });
      this.getPendingOrder(response.data);
    }
  };

  togglePlay = () => {
    this.setState({ play: !this.state.play }, () => {
      this.state.play ? this.audio.play() : this.audio.pause();
    });
  };

  render() {
    let {
      dataBasket,
      totalPrice,
      selectedCard,
      isLoading,
      isLoadingPOS,
      cartDetails,
      storeDetail,
      dataSettle,
    } = this.state;
    let { basket } = this.props;
    let basketLength = 0;
    if (basket && basket.details) {
      basket.details.forEach((cart) => {
        basketLength += cart.quantity;
      });
    }

    if (!this.props.isLoggedIn || isEmptyObject(dataSettle)) {
      return (
        <div
          className="col-full"
          style={{ marginTop: 90, marginBottom: 50, padding: 0 }}
        >
          <div id="primary" className="content-area">
            <div
              className="stretch-full-width"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <main id="main" className="site-main" style={{ width: "100%" }}>
                <div>
                  <Lottie
                    options={{ animationData: emptyGif }}
                    style={{ height: 250 }}
                  />
                  {basketLength > 0 ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        marginLeft: 10,
                        marginRight: 10,
                      }}
                    >
                      <div style={{ textAlign: "center" }}>
                        Confirm your cart to proceed with payment
                      </div>
                      <Button
                        className="color"
                        style={{
                          color: "#FFF",
                          fontWeight: "bold",
                          borderRadius: 5,
                          height: 35,
                          marginTop: 10,
                          width: 100,
                        }}
                        onClick={() => this.props.history.push("/basket")}
                      >
                        Go to Cart
                      </Button>
                    </div>
                  ) : (
                    <div style={{ textAlign: "center" }}>
                      No Pending Payment
                    </div>
                  )}
                </div>
              </main>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div>
        {isLoadingPOS && <LoadingPayAtPOS cart={cartDetails} />}
        <a id="newTabLink" target="_blank" href="https://www.google.com/" />
        <div
          className="col-full"
          style={{ marginTop: 90, marginBottom: 50, padding: 0 }}
        >
          <div id="primary" className="content-area">
            <div
              className="stretch-full-width"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <main id="main" className="site-main" style={{ width: "100%" }}>
                {dataBasket && (
                  <div style={{ backgroundColor: "#FFF", width: "100%" }}>
                    <div>
                      <div
                        style={{
                          color: "#20a8d8",
                          fontSize: 16,
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        Confirm Payment
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          marginTop: 10,
                        }}
                      >
                        <div
                          style={{
                            color: "gray",
                            fontSize: 10,
                            fontWeight: "bold",
                            marginTop: -10,
                          }}
                        >
                          {this.getCurrency(totalPrice).split("SGD")[0]}
                        </div>
                        <div
                          style={{
                            color: "gray",
                            fontSize: 40,
                            fontWeight: "bold",
                          }}
                        >
                          {this.getCurrency(totalPrice).split("SGD")[1]}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        backgroundColor: "gray",
                        height: 1,
                        width: "100%",
                        marginBottom: 10,
                        marginTop: 20,
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
                      <div
                        style={{
                          marginLeft: 10,
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <div
                          style={{
                            color: "#20a8d8",
                            fontWeight: "bold",
                            textAlign: "left",
                            fontSize: 17,
                          }}
                        >
                          {dataBasket.outlet.name}
                        </div>
                        {/* <div onClick={() => this.props.history.push('/')} style={{ color: "#20a8d8", fontWeight: "bold", textAlign: "left", fontSize: 14 }}>Order Details</div> */}
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

                    <AddPromo
                      data={this.state}
                      roleBtnClear={!this.props.isLoggedIn}
                      cancelSelectVoucher={() => this.cancelSelectVoucher()}
                      cancelSelectPoint={() => this.cancelSelectPoint()}
                      handleRedeemVoucher={() => this.handleRedeemVoucher()}
                      handleRedeemPoint={() => this.handleRedeemPoint()}
                      getCurrency={(price) => this.getCurrency(price)}
                      scrollPoint={(data) => this.scrollPoint(data)}
                      setPoint={(point) => this.setPoint(point)}
                    />
                    {this.props.isLoggedIn && (
                      <PaymentMethodBasket
                        data={this.state}
                        roleBtnClear={!this.props.isLoggedIn}
                      />
                    )}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        marginTop: 50,
                      }}
                    >
                      <Button
                        disabled={!selectedCard && totalPrice > 0}
                        onClick={() => this.handleSettle()}
                        className="customer-group"
                        style={{
                          marginBottom: 10,
                          width: "100%",
                          color: "#FFF",
                          fontWeight: "bold",
                          marginLeft: 10,
                          marginRight: 10,
                          height: 40,
                        }}
                      >
                        {isEmptyObject(selectedCard)
                          ? `Pay ${this.getCurrency(totalPrice)}`
                          : `Pay ${this.getCurrency(
                              totalPrice
                            )} with ${selectedCard.details.cardIssuer.toUpperCase()}  ${selectedCard.details.maskedAccountNumber.substr(
                              selectedCard.details.maskedAccountNumber.toString()
                                .length - 4
                            )}`}
                      </Button>
                    </div>

                    {storeDetail.enablePayAtPOS == true && (
                      <div>
                        <p style={{ textAlign: "center" }}>OR</p>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            marginTop: 10,
                          }}
                        >
                          <Button
                            onClick={() => this.handleSettle(true)}
                            className="customer-group"
                            style={{
                              marginBottom: 10,
                              width: "100%",
                              backgroundColor: "#34495e",
                              color: "#FFF",
                              fontWeight: "bold",
                              marginLeft: 10,
                              marginRight: 10,
                              height: 40,
                            }}
                          >{`Pay at POS`}</Button>
                        </div>
                      </div>
                    )}
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
        {isLoading ? Swal.showLoading() : Swal.close()}
        {this.state.showPaymentPage && this.state.paymentUrl && (
          <div className={styles.modalContainer}>
            <Iframe
              loading="auto"
              url={this.state.paymentUrl}
              className={styles.paymentModal}
            />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    account: state.auth.account && state.auth.account.idToken.payload,
    isLoggedIn: state.auth.isLoggedIn,
    basket: state.order.basket,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
