import React, { Component } from "react";
import { Button } from "reactstrap";
import _ from "lodash";
import moment from "moment";
import { Col, Row } from "reactstrap";
import Shimmer from "react-shimmer-effect";
import Iframe from "react-iframe";
import LoadingPayAtPOS from "../loading/LoadingPayAtPOS";
import AddPromo from "../basket/addPromo";
import SelectSVC from "../svc/SelectSVC";
import { connect } from "react-redux";
import PaymentMethodBasket from "../basket/paymentMethodBasket";
import { OrderAction } from "../../redux/actions/OrderAction";
import Sound_Effect from "../../assets/sound/Sound_Effect.mp3";
import { isEmptyObject } from "../../helpers/CheckEmpty";
import config from "../../config";
import { CustomerAction } from "../../redux/actions/CustomerAction";
import { CampaignAction } from "../../redux/actions/CampaignAction";
import { PaymentAction } from "../../redux/actions/PaymentAction";
import { ProductAction } from "../../redux/actions/ProductAction";
import styles from "./styles.module.css";
import { uuid } from "uuidv4";
import { SVCAction } from "../../redux/actions/SVCAction";
const Swal = require("sweetalert2");
const encryptor = require("simple-encryptor")(process.env.REACT_APP_KEY_DATA);
const companyInfo = encryptor.decrypt(
  JSON.parse(localStorage.getItem(`${config.prefix}_infoCompany`))
);

class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingShow: false,
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
      paymentCard: [],
      voucherDiscountList: [],
      amountSVC: 0,
      svc: [],
      percentageUseSVC: 0,
    };
    this.audio = new Audio(Sound_Effect);
  }

  componentDidMount = async () => {
    await this.props.dispatch(SVCAction.summarySVC());
    await this.getDataBasket();
    this.setState({ loadingShow: true });
    if (this.props.isLoggedIn) {
      let response = this.props.dispatch(CustomerAction.getVoucher());
      if (response.ResultCode === 200)
        this.setState({ myVoucher: response.Data });

      response = await this.props.dispatch(
        CampaignAction.getCampaignPoints(
          { history: "false" },
          companyInfo && companyInfo.companyId
        )
      );
      if (response.ResultCode === 200) this.setState(response.Data);
    }
    const svc = await this.props.dispatch(SVCAction.loadSVC());
    if (svc && svc.resultCode === 200) await this.setState({ svc: svc.data });
    this.setState({ loadingShow: false });
  };

  setAmountSVC = async (amountSVC) => {
    let percentageUseSVC = 0;
    percentageUseSVC = (amountSVC / this.props.balanceSVC) * 100;
    await this.setState({ amountSVC, percentageUseSVC });
  };

  cancelAmountSVC = async () => {
    await this.cancelSelectPoint();
    await this.setState({ amountSVC: 0, percentageUseSVC: 0 });
    await this.getDataBasket();
  };

  viewShimmer = (isHeight = 100) => {
    return (
      <Shimmer>
        <div
          style={{
            width: "100%",
            height: isHeight,
            alignSelf: "center",
            borderRadius: "8px",
            marginBottom: 10,
          }}
        />
      </Shimmer>
    );
  };

  getPendingPayment = async (payment) => {
    this.setState({
      isLoading: false,
      showPaymentPage: true,
      paymentUrl: payment.action.url,
    });

    for (let i = 0; i < 1000; i++) {
      const response = await this.props.dispatch(OrderAction.getCart());
      // console.log(response);
      if (
        (response && response.resultCode === 400) ||
        (response.data && response.data.isPaymentComplete)
      ) {
        // hostedPage.close();
        console.log("payment success");
        let data = {
          message:
            response.data.confirmationInfo.message ||
            "Congratulations, payment success",
          paymentType:
            response.data.paymentType || payment.paymentType || "CREDIT CARD",
          totalNettAmount: response.data.totalNettAmount,
          outletName: this.state.dataBasket.outlet.name,
          orderingMode: this.state.dataBasket.orderingMode,
          createdAt: new Date(),
          payments: response.data.payments,
        };

        localStorage.setItem(
          `${config.prefix}_settleSuccess`,
          JSON.stringify(encryptor.encrypt(data))
        );
        localStorage.removeItem(`${config.prefix}_selectedPoint`);
        localStorage.removeItem(`${config.prefix}_selectedVoucher`);
        localStorage.removeItem(`${config.prefix}_dataSettle`);
        this.togglePlay();
        await this.props.dispatch(PaymentAction.setData([], "SELECT_VOUCHER"));
        await this.props.dispatch(OrderAction.setData({}, "DATA_BASKET"));
        this.props.history.push("/settleSuccess");
        this.setState({ isLoading: false, showPaymentPage: false });
        return;
      } else if (
        response.data.confirmationInfo === undefined ||
        response.data.action === undefined
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

  componentDidUpdate() {
    let { totalPrice } = this.state;
    let paymentCardAccountDefault = encryptor.decrypt(
      JSON.parse(
        localStorage.getItem(`${config.prefix}_paymentCardAccountDefault`)
      )
    );
    let selectedCard = encryptor.decrypt(
      JSON.parse(localStorage.getItem(`${config.prefix}_selectedCard`))
    );
    if (this.props.campaignPoint.detailPoint && !this.state.detailPoint) {
      this.setState(this.props.campaignPoint);
    } else if (this.props.myVoucher && !this.state.myVoucher) {
      this.setState({ myVoucher: this.props.myVoucher });
    } else if (
      this.props.paymentCard.length > 0 &&
      this.state.paymentCard.length === 0 &&
      totalPrice > 0
    ) {
      if (paymentCardAccountDefault) selectedCard = paymentCardAccountDefault;
      if (selectedCard) {
        let check = false;
        this.props.paymentCard.forEach((element) => {
          if (element.id === selectedCard.id) check = true;
        });
        if (!check) {
          selectedCard = null;
          localStorage.removeItem(`${config.prefix}_selectedCard`);
          localStorage.removeItem(`${config.prefix}_paymentCardAccountDefault`);
        }
        this.setState({ paymentCard: this.props.paymentCard, selectedCard });
      }
    }
  }

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

    let paymentCardAccountDefault = encryptor.decrypt(
      JSON.parse(
        localStorage.getItem(`${config.prefix}_paymentCardAccountDefault`)
      )
    );
    let selectedCard = encryptor.decrypt(
      JSON.parse(localStorage.getItem(`${config.prefix}_selectedCard`))
    );
    if (paymentCardAccountDefault) selectedCard = paymentCardAccountDefault;

    if (!selectedCard) {
      let paymentCardAccount = await this.props.dispatch(
        PaymentAction.getPaymentCard()
      );

      let paymentTypes = this.props.companyInfo.paymentTypes;
      if (paymentTypes && paymentCardAccount.resultCode === 200) {
        paymentTypes.forEach((elements) => {
          elements.data = _.filter(paymentCardAccount.data, {
            paymentID: elements.paymentID,
          });
          elements.data.forEach((element) => {
            element.minimumPayment = elements.minimumPayment;
            if (element.isDefault) {
              element.default = true;
              localStorage.setItem(
                `${config.prefix}_paymentCardAccountDefault`,
                JSON.stringify(encryptor.encrypt(element))
              );
              selectedCard = element;
            }
          });
        });
      }
    }

    if (dataSettle === null || !dataSettle.dataBasket) return;

    this.setState({ dataSettle });

    if (selectedVoucher) {
      await this.props.dispatch(
        PaymentAction.setData(selectedVoucher, "SELECT_VOUCHER")
      );
      this.setState({ voucherDiscountList: [], discountVoucher: 0 });
      for (let index = 0; index < selectedVoucher.length; index++) {
        let element = selectedVoucher[index];
        await this.getStatusVoucher(
          element,
          dataSettle.storeDetail,
          dataSettle.dataBasket
        );
      }
    }

    const point = selectedPoint || 0;
    const pointToRebate =
      parseInt(dataSettle.pointsToRebateRatio.split(":")[0]) > 0
        ? parseInt(dataSettle.pointsToRebateRatio.split(":")[0])
        : 1;

    let totalPrice = dataSettle.dataBasket.totalNettAmount;
    let voucherDiscount = _.sumBy(this.state.voucherDiscountList, (items) => {
      return items.paymentType === "voucher" && items.paymentAmount;
    });
    let discountPoint = Number(this.state.discountPoint);
    if (discountPoint === 0) {
      discountPoint = point / pointToRebate;
      if (
        discountPoint > 0 &&
        discountPoint + (voucherDiscount || 0) > totalPrice
      ) {
        discountPoint = totalPrice - (voucherDiscount || 0);
      }
      discountPoint = Number(discountPoint.toFixed(2));
    }

    let discount = discountPoint + voucherDiscount;

    totalPrice = totalPrice - discount < 0 ? 0 : totalPrice - discount;

    if (this.state.amountSVC > 0) {
      totalPrice -= Number(this.state.amountSVC);
    }

    if (totalPrice === 0) selectedCard = null;

    this.setState({
      ...dataSettle,
      selectedVoucher,
      selectedCard,
      selectedPoint,
      totalPrice,
      discountPoint,
      isLoading: false,
    });
  };

  getStatusVoucher = async (selectedVoucher, storeDetail, dataBasket) => {
    if (selectedVoucher !== null) {
      let checkOutlet = false;
      if (
        selectedVoucher.selectedOutlets &&
        selectedVoucher.selectedOutlets.length > 0
      ) {
        selectedVoucher.selectedOutlets.forEach((element) => {
          if (element === storeDetail.sortKey) checkOutlet = true;
        });
      } else checkOutlet = true;

      if (selectedVoucher.minPurchaseAmount && selectedVoucher.minPurchaseAmount > 0) {
        if (dataBasket.totalNettAmount < selectedVoucher.minPurchaseAmount) {
          this.setRemoveVoucher(`The minimum purchase amount to use this voucher is ${this.getCurrency(selectedVoucher.minPurchaseAmount)}`, selectedVoucher);
          return
        }
      }

      let voucherType = selectedVoucher.voucherType;
      let voucherValue = selectedVoucher.voucherValue;
      let discount = 0;
      let discountVoucher = this.state.discountVoucher;
      let checkProduct = undefined;

      if (dataBasket.details && dataBasket.details.length > 0) {
        dataBasket.details.sort((a, b) => {
          return b.nettAmount - a.nettAmount;
        });
        if (selectedVoucher.appliedTo === "PRODUCT") {
          let check = null;
          for (let i = 0; i < dataBasket.details.length; i++) {
            let details = dataBasket.details[i];
            check = selectedVoucher.appliedItems.find((items) => {
              return items.value === details.product.id;
            });
            if (check) checkProduct = details;
          }
          // todo check modifier
        } else if (selectedVoucher.appliedTo === "COLLECTION") {
          for (
            let index = 0;
            index < selectedVoucher.appliedItems.length;
            index++
          ) {
            let appliedItems = selectedVoucher.appliedItems[index];
            let collection = await this.props.dispatch(
              ProductAction.getCollection(appliedItems.value.split("::")[1])
            );

            if (collection.products) {
              for (let i = 0; i < dataBasket.details.length; i++) {
                let details = dataBasket.details[i];
                let check = collection.products.find((items) => {
                  return items.id === details.product.id;
                });
                if (check) checkProduct = details;
              }
            }
          }
        } else if (selectedVoucher.appliedTo === "CATEGORY") {
          for (let i = 0; i < dataBasket.details.length; i++) {
            let details = dataBasket.details[i];
            let check = selectedVoucher.appliedItems.find(items => { return items.value === details.product.categoryID})
            if(check) checkProduct = details
          }
        }
      }

      let voucherDiscount = _.sumBy(this.state.voucherDiscountList, (items) => {
        return items.paymentType === "voucher" && items.paymentAmount;
      });
      let voucherDiscountList = {
        paymentType: "voucher",
        voucherId: selectedVoucher.id,
        serialNumber: selectedVoucher.serialNumber,
        paymentAmount: 5,
        isVoucher: true,
      };

      if (checkOutlet || storeDetail.paidMembership || storeDetail.paySVC) {
        if (
          selectedVoucher.appliedTo !== "ALL" &&
          selectedVoucher.appliedItems &&
          selectedVoucher.appliedItems.length > 0
        ) {
          if (checkProduct) {
            let date = new Date();
            let tanggal = moment().format().split("T")[0];
            let region = moment().format().split("+")[1];
            let activeWeekDays = selectedVoucher.validity.activeWeekDays;
            let validHour = activeWeekDays[date.getDay()].validHour;
            let validHourFrom = validHour.from;
            let validHourTo = validHour.to;
            if (activeWeekDays[date.getDay()].active) {
              let from = `${tanggal}T${validHourFrom}:00+${region}`;
              let to = `${tanggal}T${validHourTo}:00+${region}`;
              let statusValidHour = moment(moment().format()).isBetween(
                from,
                to
              );
              if (statusValidHour) {
                discount = voucherValue;
                if (voucherType === "discPercentage") {
                  discount =
                    Number(checkProduct.unitPrice) *
                    (Number(voucherValue) / 100);
                }

                if (selectedVoucher.capAmount !== undefined) {
                  if (
                    discount > selectedVoucher.capAmount &&
                    selectedVoucher.capAmount > 0
                  ) {
                    discount = selectedVoucher.capAmount;
                  }
                }

                let voucherDiscount = _.sumBy(
                  this.state.voucherDiscountList,
                  (items) => {
                    return (
                      items.paymentType === "voucher" &&
                      items.voucherId === selectedVoucher.id &&
                      items.paymentAmount
                    );
                  }
                );

                if (
                  checkProduct.nettAmount - voucherDiscount > 0 &&
                  this.state.voucherDiscountList.length < checkProduct.quantity
                ) {
                  voucherDiscountList.paymentAmount = discount;
                  if (
                    discount >
                    checkProduct.nettAmount - (voucherDiscount || 0)
                  ) {
                    voucherDiscountList.paymentAmount = Number(
                      (
                        checkProduct.nettAmount - (voucherDiscount || 0)
                      ).toFixed(2)
                    );
                  }

                  this.state.voucherDiscountList.push(voucherDiscountList);
                  this.setState({
                    discountVoucher: discountVoucher + discount,
                    statusSelectedVoucher: true,
                    selectedVoucher,
                  });
                } else {
                  this.setRemoveVoucher(
                    "Sorry, the discount has exceeded the total price for a specific product!",
                    selectedVoucher
                  );
                }
              } else {
                this.setRemoveVoucher(
                  "Sorry, this voucher not available this time!",
                  selectedVoucher
                );
              }
            } else {
              this.setRemoveVoucher(
                "Sorry, this voucher not available today!",
                selectedVoucher
              );
            }
          } else {
            this.setRemoveVoucher(
              `Sorry, voucher ${selectedVoucher.name} is only available on specific product!`,
              selectedVoucher
            );
          }
        } else {
          let totalAmount = dataBasket.totalNettAmount;

          if (voucherType === "discPercentage") {
            // discount = Number(totalAmount - voucherDiscount) * (Number(voucherValue) / 100);
            discount = Number(totalAmount) * (Number(voucherValue) / 100);
          } else {
            discount = voucherValue;
          }

          if (selectedVoucher.capAmount !== undefined) {
            if (
              discount > selectedVoucher.capAmount &&
              selectedVoucher.capAmount > 0
            ) {
              discount = selectedVoucher.capAmount;
            }
          }

          if (totalAmount - voucherDiscount > 0) {
            voucherDiscountList.paymentAmount = discount;
            if (discount > totalAmount - (voucherDiscount || 0)) {
              voucherDiscountList.paymentAmount =
                totalAmount - (voucherDiscount || 0);
            }

            this.state.voucherDiscountList.push(voucherDiscountList);
            this.setState({
              discountVoucher: discountVoucher + discount,
              statusSelectedVoucher: true,
              selectedVoucher,
            });
          } else {
            this.setRemoveVoucher(
              "The voucher has met the net amount!",
              selectedVoucher
            );
          }
        }
      } else {
        this.setRemoveVoucher("Voucher be used this outlet!", selectedVoucher);
      }
    }
  };

  roleBtnClear = () => {
    let props = this.state;
    return (props.dataBasket.status === "SUBMITTED" &&
      props.orderingMode &&
      (props.orderingMode === "TAKEAWAY" ||
        props.orderingMode === "STOREPICKUP" ||
        props.orderingMode === "STORECHECKOUT")) ||
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
    price = parseFloat(price);
    if (this.props.companyInfo) {
      const { currency } = this.props.companyInfo;

      if (!price || price === "-") price = 0;
      let result = price.toLocaleString(currency.locale, {
        style: "currency",
        currency: currency.code,
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
    await this.setState({ discountPoint: 0, selectedPoint: 0 });
    await localStorage.removeItem(`${config.prefix}_selectedPoint`);
    await this.getDataBasket();
  };

  handleRedeemVoucher = async () => {
    // this.setState({ discountPoint: 0 });
    // localStorage.removeItem(`${config.prefix}_selectedPoint`);
    this.props.history.push(`/myVoucher`);
  };

  handleRedeemPoint = async () => {
    let {pendingPoints, pointsToRebateRatio, amountSVC, dataSettle, percentageUseSVC} = this.state
    let totalPoint = this.props.campaignPoint.totalPoint

    let selectedPoint = this.state.selectedPoint || 0;
    totalPoint = totalPoint - pendingPoints;

    if (dataSettle.paySVC || amountSVC === 0) {
      totalPoint = totalPoint - this.props.campaignPoint.lockPoints
    }

    if (percentageUseSVC > 0) {
      let minusPoint = 0;
      minusPoint = (amountSVC/this.props.defaultBalance) * this.props.campaignPoint.defaultPoints 
      let diff = this.props.campaignPoint.lockPoints - minusPoint
      diff = diff < 0 ? 0 : diff
      totalPoint = totalPoint - diff
    }

    if (totalPoint < 0) totalPoint = 0

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

    this.setState({ textRasio, selectedPoint, needPoint });
  };

  scrollPoint = (data) => {
    data = this.calculateSelectedPoint(data);
    this.setState({ selectedPoint: data });
  };

  calculateSelectedPoint = (selectedPoint, type = null) => {
    let {
      pointsToRebateRatio,
      detailPoint,
      totalPrice,
      discountPoint,
    } = this.state;
    totalPrice = totalPrice + discountPoint;

    if (type === "selectedPoint") {
      selectedPoint =
        (totalPrice / pointsToRebateRatio.split(":")[1]) *
        pointsToRebateRatio.split(":")[0];
    }
    selectedPoint = parseFloat(selectedPoint.toFixed(2));
    if (detailPoint.roundingOptions !== "DECIMAL") {
      selectedPoint = Math.floor(selectedPoint);
    }
    return selectedPoint;
  };

  setPoint = async (selectedPoint, discountPoint) => {
    await localStorage.setItem(
      `${config.prefix}_selectedPoint`,
      JSON.stringify(encryptor.encrypt(selectedPoint))
    );
    await this.setState({ selectedPoint, discountPoint });

    await this.getDataBasket();
    return selectedPoint;
  };

  setRemoveVoucher = (message, itemVoucher) => {
    this.handleCancelVoucher(itemVoucher);
    Swal.fire("Oppss!", message, "error");
  };

  handleSettle = async (payAtPOS) => {
    let { selectedCard, dataSettle } = this.state;

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

    if (dataSettle.paidMembership) {
      this.payMembership();
    } else if (dataSettle.paySVC) {
      this.paySVC();
    } else {
      this.submitSettle(null, payAtPOS);
    }
  };

  paySVC = async (need = null, payAtPOS = false) => {
    Swal.fire({
      onOpen: () => {
        Swal.showLoading();
      },
    });

    const customerInfo = encryptor.decrypt(
      JSON.parse(localStorage.getItem(`${config.prefix}_account`))
    );

    let {
      dataSettle,
      totalPrice,
      selectedCard,
      selectedVoucher,
      selectedPoint,
      voucherDiscountList,
      discountPoint,
    } = this.state;

    let payload = {
      payments: [],
      outletId: dataSettle.outletDetail.id,
      price: dataSettle.dataBasket.totalNettAmount,
      referenceNo: uuid(),
      dataPay: {
        storeValueCard: {
          value:
            dataSettle.storeValueCard.value *
            dataSettle.detailPurchase.details[0].quantity,
          expiryOn: dataSettle.storeValueCardexpiryOn,
          expiryOnUnit: dataSettle.storeValueCard.expiryOnUnit,
          retailPrice: dataSettle.storeValueCard.retailPrice,
          amountAfterDisc: dataSettle.detailPurchase.details[0].amountAfterDisc,
          amountAfterTax: dataSettle.detailPurchase.details[0].amountAfterTax,
          billDiscAmount: dataSettle.detailPurchase.details[0].billDiscAmount,
          discountableAmount:
            dataSettle.detailPurchase.details[0].discountableAmount,
          lineDiscAmount: dataSettle.detailPurchase.details[0].lineDiscAmount,
          lineDiscPercentage:
            dataSettle.detailPurchase.details[0].lineDiscPercentage,
          taxPercentage: dataSettle.detailPurchase.details[0].taxPercentage,
          taxableAmount: dataSettle.detailPurchase.details[0].taxableAmount,
          totalDiscAmount: dataSettle.detailPurchase.details[0].totalDiscAmount,
          quantity: dataSettle.detailPurchase.details[0].quantity,
          totalNettAmount: dataSettle.dataBasket.totalNettAmount,
          pointReward:
            dataSettle.storeValueCard.pointReward *
            dataSettle.detailPurchase.details[0].quantity,
        },
        id: dataSettle.storeValueCard.id,
      },
      customerId: `customer::${customerInfo.idToken.payload.id}`,
    };

    if (selectedVoucher !== null) {
      payload.payments = payload.payments.concat(voucherDiscountList);
    }

    if (selectedPoint > 0) {
      payload.payments.push({
        paymentType: "point",
        redeemValue: selectedPoint,
        paymentAmount: discountPoint,
        isPoint: true,
      });
    }

    if (selectedCard) {
      payload.payments.push({
        paymentType: selectedCard.paymentID,
        paymentID: selectedCard.paymentID,
        paymentName: selectedCard.paymentName,
        accountId: selectedCard.accountID,
        paymentAmount: totalPrice,
      });
    }

    // console.log(payload)
    // return;

    let response;
    response = await this.props.dispatch(OrderAction.submitMembership(payload));
    console.log(response);

    if (response && response.ResultCode === 400) {
      Swal.fire(
        "Oppss!",
        response.message ||
          (response.data && response.data.message) ||
          "Payment Failed!",
        "error"
      );
    } else {
      // if need further actions
      if (response.Data.action !== undefined) {
        if (response.Data.action.type === "url") {
          this.getPendingPayment(response.data);
        }
      } else {
        response.Data.outlet = {
          name: dataSettle.outlet.name,
        };
        response.Data.paySVC = true;
        localStorage.setItem(
          `${config.prefix}_settleSuccess`,
          JSON.stringify(encryptor.encrypt(response.Data))
        );
        localStorage.setItem(
          `${config.prefix}_paymentSuccess`,
          JSON.stringify(encryptor.encrypt(this.state))
        );
        localStorage.removeItem(`${config.prefix}_dataSettle`);
        this.togglePlay();
        localStorage.removeItem(`${config.prefix}_selectedPoint`);
        localStorage.removeItem(`${config.prefix}_selectedVoucher`);
        localStorage.removeItem(`${config.prefix}_dataSettle`);

        await this.props.dispatch(PaymentAction.setData([], "SELECT_VOUCHER"));
        this.props.history.push("/settleSuccess");
      }
    }
  };

  payMembership = async (need = null, payAtPOS = false) => {
    Swal.fire({
      onOpen: () => {
        Swal.showLoading();
      },
    });

    const customerInfo = encryptor.decrypt(
      JSON.parse(localStorage.getItem(`${config.prefix}_account`))
    );

    let {
      dataSettle,
      totalPrice,
      selectedCard,
      selectedVoucher,
      selectedPoint,
      voucherDiscountList,
      discountPoint,
    } = this.state;

    delete dataSettle.plan.isSelected;

    let payload = {
      payments: [],
      outletId: dataSettle.outletDetail.id,
      price: dataSettle.dataBasket.totalNettAmount,
      referenceNo: uuid(),
      dataPay: {
        paidMembershipPlan: dataSettle.plan,
        id: dataSettle.membership.id,
      },
      customerId: `customer::${customerInfo.idToken.payload.id}`,
    };

    // ADD TAX
    try {
      payload.dataPay.paidMembershipPlan.amountAfterDisc =
        dataSettle.detailPurchase.details[0].amountAfterDisc;
      payload.dataPay.paidMembershipPlan.amountAfterTax =
        dataSettle.detailPurchase.details[0].amountAfterTax;
      payload.dataPay.paidMembershipPlan.billDiscAmount =
        dataSettle.detailPurchase.details[0].billDiscAmount;
      payload.dataPay.paidMembershipPlan.discountableAmount =
        dataSettle.detailPurchase.details[0].discountableAmount;
      payload.dataPay.paidMembershipPlan.lineDiscAmount =
        dataSettle.detailPurchase.details[0].lineDiscAmount;
      payload.dataPay.paidMembershipPlan.lineDiscPercentage =
        dataSettle.detailPurchase.details[0].lineDiscPercentage;
      payload.dataPay.paidMembershipPlan.taxPercentage =
        dataSettle.detailPurchase.details[0].taxPercentage;
      payload.dataPay.paidMembershipPlan.taxableAmount =
        dataSettle.detailPurchase.details[0].taxableAmount;
      payload.dataPay.paidMembershipPlan.totalDiscAmount =
        dataSettle.detailPurchase.details[0].totalDiscAmount;
      payload.dataPay.paidMembershipPlan.totalNettAmount =
        dataSettle.dataBasket.totalNettAmount;
    } catch (e) {}

    if (selectedVoucher !== null) {
      payload.payments = payload.payments.concat(voucherDiscountList);
    }

    if (selectedPoint > 0) {
      payload.payments.push({
        paymentType: "point",
        redeemValue: selectedPoint,
        paymentAmount: discountPoint,
        isPoint: true,
      });
    }

    if (selectedCard) {
      payload.payments.push({
        paymentType: selectedCard.paymentID,
        paymentID: selectedCard.paymentID,
        paymentName: selectedCard.paymentName,
        accountId: selectedCard.accountID,
        paymentAmount: totalPrice,
      });
    }

    // console.log(payload)
    // return;

    let response;
    response = await this.props.dispatch(OrderAction.submitMembership(payload));
    console.log(response);

    if (response && response.ResultCode === 400) {
      Swal.fire(
        "Oppss!",
        response.message ||
          (response.data && response.data.message) ||
          "Payment Failed!",
        "error"
      );
    } else {
      // if need further actions
      if (response.Data.action !== undefined) {
        if (response.Data.action.type === "url") {
          this.getPendingPayment(response.data);
        }
      } else {
        response.Data.outlet = {
          name: dataSettle.outlet.name,
        };
        response.Data.paidMembership = true;
        localStorage.setItem(
          `${config.prefix}_settleSuccess`,
          JSON.stringify(encryptor.encrypt(response.Data))
        );
        localStorage.setItem(
          `${config.prefix}_paymentSuccess`,
          JSON.stringify(encryptor.encrypt(this.state))
        );
        localStorage.removeItem(`${config.prefix}_dataSettle`);
        this.togglePlay();
        localStorage.removeItem(`${config.prefix}_selectedPoint`);
        localStorage.removeItem(`${config.prefix}_selectedVoucher`);
        localStorage.removeItem(`${config.prefix}_dataSettle`);

        await this.props.dispatch(PaymentAction.setData([], "SELECT_VOUCHER"));
        this.props.history.push("/settleSuccess");
      }
    }
  };

  submitSettle = async (need = null, payAtPOS = false) => {
    Swal.fire({
      onOpen: () => {
        Swal.showLoading();
      },
    });

    let isNeedConfirmation = false;
    let enableAutoConfirmation = this.props.setting.find((items) => {
      return items.settingKey === "EnableAutoConfirmation";
    });
    if (enableAutoConfirmation) {
      isNeedConfirmation = enableAutoConfirmation.settingValue || false;
    }

    let {
      orderingMode,
      dataBasket,
      deliveryAddress,
      selectedVoucher,
      selectedPoint,
      totalPrice,
      selectedCard,
      scanTable,
      voucherDiscountList,
      orderActionDate,
      orderActionTime,
      storeDetail,
      discountPoint,
      orderActionTimeSlot,
    } = this.state;

    let payload = {
      cartID: dataBasket.cartID,
      totalNettAmount: dataBasket.totalNettAmount,
      amount: dataBasket.totalNettAmount,
      payments: [],
      isNeedConfirmation,
      payAtPOS,
      orderingMode,
    };

    if (scanTable)
      payload.tableNo = scanTable.table || scanTable.tableNo || "-";

    if (orderingMode === "DELIVERY") {
      payload.deliveryAddress = deliveryAddress;
      payload.deliveryProvider = this.props.deliveryProvider.name;
      payload.deliveryProviderName = this.props.deliveryProvider.name;
      payload.deliveryService = "-";
      payload.deliveryProviderId = this.props.deliveryProvider.id;
      payload.deliveryFee = this.props.deliveryProvider.deliveryFeeFloat;
    }

    if (selectedVoucher !== null) {
      payload.payments = payload.payments.concat(voucherDiscountList);
    }

    if (selectedPoint > 0) {
      payload.payments.push({
        paymentType: "point",
        redeemValue: selectedPoint,
        paymentAmount: discountPoint,
        isPoint: true,
      });
    }

    if (selectedCard) {
      payload.payments.push({
        paymentType: selectedCard.paymentID,
        paymentID: selectedCard.paymentID,
        paymentName: selectedCard.paymentName,
        accountId: selectedCard.accountID,
        paymentAmount: totalPrice,
      });
    }

    if (this.state.amountSVC > 0) {
      payload.payments.push({
        paymentType: "Store Value Card",
        paymentName: "Store Value Card",
        paymentAmount: Number(this.state.amountSVC),
        isSVC: true,
      });
    }

    // console.log(payload)
    // return

    let response;
    if (
      orderingMode === "TAKEAWAY" ||
      orderingMode === "STOREPICKUP" ||
      orderingMode === "STORECHECKOUT" ||
      orderingMode === "DELIVERY" ||
      storeDetail.outletType === "QUICKSERVICE"
    ) {
      payload.orderActionDate = orderActionDate;
      payload.orderActionTime = orderActionTime;
      payload.orderActionTimeSlot = orderActionTimeSlot;
      response = await this.props.dispatch(OrderAction.submitTakeAway(payload));
    } else {
      response = await this.props.dispatch(OrderAction.submitSettle(payload));
    }
    console.log(response);

    if (response && response.resultCode === 400) {
      Swal.fire(
        "Oppss!",
        response.message ||
          (response.data && response.data.message) ||
          "Payment Failed!",
        "error"
      );
    } else {
      // if need further actions
      if (response.data.action !== undefined) {
        if (response.data.action.type === "url") {
          this.getPendingPayment(response.data);
        }
      } else {
        localStorage.setItem(
          `${config.prefix}_settleSuccess`,
          JSON.stringify(encryptor.encrypt(response.data))
        );
        localStorage.setItem(
          `${config.prefix}_paymentSuccess`,
          JSON.stringify(encryptor.encrypt(this.state))
        );
        localStorage.removeItem(`${config.prefix}_isOutletChanged`);
        localStorage.removeItem(`${config.prefix}_selectedPoint`);
        localStorage.removeItem(`${config.prefix}_selectedVoucher`);
        localStorage.removeItem(`${config.prefix}_dataSettle`);
        this.togglePlay();
        await this.props.dispatch(OrderAction.setData({}, "DATA_BASKET"));
        await this.props.dispatch(PaymentAction.setData([], "SELECT_VOUCHER"));
        this.props.history.push("/settleSuccess");
      }
    }
  };

  togglePlay = () => {
    this.setState({ play: !this.state.play }, () => {
      this.state.play ? this.audio.play() : this.audio.pause();
    });
  };

  handleCancelVoucher = async (item) => {
    let selectedVoucher = encryptor.decrypt(
      JSON.parse(localStorage.getItem(`${config.prefix}_selectedVoucher`))
    );

    selectedVoucher = selectedVoucher.filter((voucher) => {
      return voucher.serialNumber !== item.serialNumber;
    });

    this.setState({ selectedVoucher, discountVoucher: 0 });
    localStorage.setItem(
      `${config.prefix}_selectedVoucher`,
      JSON.stringify(encryptor.encrypt(selectedVoucher))
    );
    await this.getDataBasket();
  };

  handleCancelCreditCard = async () => {
    localStorage.removeItem(`${config.prefix}_selectedCard`);
    await this.getDataBasket();
  };

  render() {
    let {
      dataBasket,
      totalPrice,
      selectedCard,
      isLoadingPOS,
      cartDetails,
      storeDetail,
      dataSettle,
      orderingMode,
      svc,
    } = this.state;
    let { basket } = this.props;

    let deliveryFee = 0;
    if (orderingMode === "DINEIN" && orderingMode === "TAKEAWAY")
      deliveryFee = 0;

    let currency = this.props.companyInfo && this.props.companyInfo.currency;
    let formattedPrice = (this.getCurrency(totalPrice) || "").split(
      (currency && currency.code) || " "
    )[1];
    let totalAmount = (
      this.getCurrency(
        dataBasket && dataBasket.totalNettAmount + deliveryFee
      ) || ""
    ).split((currency && currency.code) || " ")[1];
    let basketLength = 0;
    if (basket && basket.details) {
      basket.details.forEach((cart) => {
        basketLength += cart.quantity;
      });
    }

    let nameCreditCard = `Pay ${this.getCurrency(totalPrice)}`;
    if (selectedCard) {
      let lengthNumber = selectedCard.details.maskedAccountNumber.toString()
        .length;
      nameCreditCard = "Pay " + this.getCurrency(totalPrice) + " with ";
      nameCreditCard += selectedCard.details.cardIssuer.toUpperCase() + " ";
      nameCreditCard +=
        selectedCard.details.maskedAccountNumber.substr(lengthNumber - 4) + " ";
    }

    if (this.state.loadingShow) {
      return (
        <div
          className="col-full"
          style={{
            marginTop: config.prefix === "emenu" ? 30 : 50,
            marginBottom: 50,
          }}
        >
          <div id="primary" className="content-area">
            <div className="stretch-full-width">
              <main
                id="main"
                className="site-main"
                style={{ textAlign: "center" }}
              ></main>
              <Row>
                <Col sm={6}>{this.viewShimmer()}</Col>
              </Row>
            </div>
          </div>
        </div>
      );
    }

    if (!this.props.isLoggedIn || isEmptyObject(dataSettle)) {
      return (
        <div
          className="col-full"
          style={{
            marginTop: config.prefix === "emenu" ? 70 : 90,
            marginBottom: 50,
            padding: 0,
          }}
        >
          <div id="primary" className="content-area">
            <div
              className="stretch-full-width"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <main id="main" className="site-main" style={{ width: "100%" }}>
                <div>
                  <img
                    src={config.url_emptyImage}
                    alt="is empty"
                    style={{ marginTop: 30 }}
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
        <div
          className="col-full"
          style={{
            marginTop: config.prefix === "emenu" ? 120 : 140,
            marginBottom: 50,
            padding: 0,
          }}
        >
          <div id="primary" className="content-area">
            <div
              className="stretch-full-width"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div
                style={{
                  flexDirection: "row",
                  position: "fixed",
                  zIndex: 10,
                  width: "100%",
                  marginTop: -60,
                  boxShadow: "1px 2px 5px rgba(128, 128, 128, 0.5)",
                  display: "flex",
                  height: 40,
                }}
                className="background-theme"
              >
                <div
                  style={{ marginLeft: 10, fontSize: 16 }}
                  onClick={() => this.props.history.goBack()}
                >
                  <i className="fa fa-chevron-left"></i> Back
                </div>
              </div>
              <main id="main" className="site-main" style={{ width: "100%" }}>
                {dataBasket && (
                  <div style={{ width: "100%" }}>
                    <div>
                      <div
                        style={{
                          color: this.props.color.primary || "#c00a27",
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
                          marginTop: 15,
                          marginLeft: -20,
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
                          {currency && currency.code}
                        </div>
                        <div>
                          <div style={{ fontSize: 40, fontWeight: "bold" }}>
                            {formattedPrice}
                          </div>
                          {totalAmount !== formattedPrice && (
                            <div
                              style={{
                                textAlign: "right",
                                marginRight: -10,
                                textDecorationLine: "line-through",
                              }}
                            >
                              {
                                (this.getCurrency(totalAmount) || "").split(
                                  this.props.companyInfo &&
                                    this.props.companyInfo.currency.code
                                )[1]
                              }
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        backgroundColor: "#DCDCDC",
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
                      <i
                        className="fa fa-shopping-cart"
                        aria-hidden="true"
                        style={{
                          color: this.props.color.primary || "#c00a27",
                          fontSize: 22,
                          padding: 7,
                          borderRadius: 45,
                          border: `1px solid ${
                            this.props.color.primary || "#c00a27"
                          }`,
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
                            color: this.props.color.primary || "#c00a27",
                            fontWeight: "bold",
                            textAlign: "left",
                            fontSize: 14,
                            lineHeight: "17px",
                          }}
                        >
                          {dataBasket.outlet.name}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        backgroundColor: "#DCDCDC",
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
                      setPoint={(point, discountPoint) =>
                        this.setPoint(point, discountPoint)
                      }
                      handleCancelVoucher={(item) =>
                        this.handleCancelVoucher(item)
                      }
                      handleCancelPoint={() => this.cancelSelectPoint()}
                      disabledBtn={totalPrice === 0}
                    />

                    {svc &&
                      svc.length > 0 &&
                      dataSettle.paySVC === undefined && (
                        <SelectSVC
                          data={this.state}
                          cancelSelectPoint={() => this.cancelSelectPoint()}
                          setAmountSVC={this.setAmountSVC}
                          cancelAmountSVC={this.cancelAmountSVC}
                          getDataBasket={this.getDataBasket}
                          getCurrency={(price) => this.getCurrency(price)}
                          disabledBtn={totalPrice === 0}
                        />
                      )}

                    {this.props.isLoggedIn && (
                      <PaymentMethodBasket
                        data={this.state}
                        roleBtnClear={!this.props.isLoggedIn}
                        disabledBtn={totalPrice === 0}
                        handleCancelCreditCard={() =>
                          this.handleCancelCreditCard()
                        }
                        getCurrency={(price) => this.getCurrency(price)}
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
                        disabled={
                          (!selectedCard && totalPrice > 0) ||
                          (selectedCard &&
                            selectedCard.minimumPayment &&
                            totalPrice < selectedCard.minimumPayment)
                        }
                        onClick={() => this.handleSettle()}
                        className="customer-group button"
                        style={{
                          marginBottom: 10,
                          width: "100%",
                          fontWeight: "bold",
                          marginLeft: 10,
                          marginRight: 10,
                          height: 40,
                        }}
                      >
                        {nameCreditCard}
                      </Button>
                    </div>

                    {storeDetail.enablePayAtPOS === true && (
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
                            className="customer-group button"
                            style={{
                              marginBottom: 10,
                              width: "100%",
                              backgroundColor: "#34495e",
                              fontWeight: "bold",
                              marginLeft: 10,
                              marginRight: 10,
                              height: 40,
                            }}
                          >{`Pay at Store`}</Button>
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
        {/* {isLoading ? Swal.showLoading() : Swal.close()} */}
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
    campaignPoint: state.campaign.data,
    myVoucher: state.customer.myVoucher,
    companyInfo: state.masterdata.companyInfo.data,
    deliveryProvider: state.order.selectedDeliveryProvider,
    paymentCard: state.payment.paymentCard,
    color: state.theme.color,
    setting: state.order.setting,
    balanceSVC: state.svc.summary,
    defaultBalance: state.svc.defaultBalance,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
