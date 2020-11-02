import React, { Component } from "react";
import { Button } from "reactstrap";
import _ from "lodash";
import moment from "moment";
import { Col, Row } from "reactstrap";
import Shimmer from "react-shimmer-effect";
import Iframe from "react-iframe";
import LoadingPayAtPOS from "../loading/LoadingPayAtPOS";
import AddPromo from "../basket/addPromo";
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
      voucherDiscountList: []
    };
    this.audio = new Audio(Sound_Effect);
  }

  componentDidMount = async () => {
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
    this.setState({ loadingShow: false });
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

  getPendingOrder = async (cart) => {
    try {
      // clearInterval(this.loopCart);
    } catch (e) { }

    // this.loopCart = setInterval(async () => {
    await this.getCart(cart);
    // }, 2000);
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
          message: response.data.confirmationInfo.message || "Congratulations, payment success",
          paymentType: response.data.paymentType || payment.paymentType || "CREDIT CARD",
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
        await this.props.dispatch(PaymentAction.setData([], "SELECT_VOUCHER"))
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

  getCart = async (cart) => {
    const response = await this.props.dispatch(
      OrderAction.getCartPending(cart.id)
    );

    const deliveryFee = this.props.deliveryProvider
      ? this.props.deliveryProvider.deliveryFeeFloat
      : 0;
    if (response.resultCode === 400 || response.data.isPaymentComplete === true) {
      clearInterval(this.loopCart);

      let data = {
        message: "Congratulations, payment success",
        paymentType: "CASH",
        price: this.state.totalPrice + deliveryFee,
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
      await this.props.dispatch(PaymentAction.setData([], "SELECT_VOUCHER"))
      await this.props.dispatch(OrderAction.setData({}, "DATA_BASKET"));
      this.props.history.push("/settleSuccess");
      this.setState({ isLoading: false, isLoadingPOS: false });
    }
  };


  componentDidUpdate() {
    let paymentCardAccountDefault = encryptor.decrypt(JSON.parse(localStorage.getItem(`${config.prefix}_paymentCardAccountDefault`)));
    let selectedCard = encryptor.decrypt(JSON.parse(localStorage.getItem(`${config.prefix}_selectedCard`)));
    if (this.props.campaignPoint.detailPoint && !this.state.detailPoint) {
      this.setState(this.props.campaignPoint);
    } else if (this.props.myVoucher && !this.state.myVoucher) {
      this.setState({ myVoucher: this.props.myVoucher });
    } else if (this.props.paymentCard.length > 0 && this.state.paymentCard.length === 0) {
      if (paymentCardAccountDefault) selectedCard = paymentCardAccountDefault;
      if (selectedCard) {
        let check = false
        this.props.paymentCard.forEach(element => {
          if (element.id === selectedCard.id) check = true
        });
        if (!check) {
          selectedCard = null
          localStorage.removeItem(`${config.prefix}_selectedCard`)
          localStorage.removeItem(`${config.prefix}_paymentCardAccountDefault`)
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

    let paymentCardAccountDefault = encryptor.decrypt(JSON.parse(localStorage.getItem(`${config.prefix}_paymentCardAccountDefault`)));
    let selectedCard = encryptor.decrypt(JSON.parse(localStorage.getItem(`${config.prefix}_selectedCard`)));
    if (paymentCardAccountDefault) selectedCard = paymentCardAccountDefault;

    if (dataSettle === null || !dataSettle.dataBasket) return;

    this.setState({ dataSettle });

    if(selectedVoucher){
      await this.props.dispatch(PaymentAction.setData(selectedVoucher, "SELECT_VOUCHER"))
      this.setState({voucherDiscountList: [], discountVoucher: 0})
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

    let discountPoint = point / pointToRebate;
    if (dataSettle.detailPoint.roundingOptions !== "DECIMAL") discountPoint = Math.floor(discountPoint);
    else discountPoint = discountPoint.toFixed(2);

    let voucherDiscount = _.sumBy(this.state.voucherDiscountList, items => { return items.paymentType === "voucher" && items.paymentAmount});
    let discount = Number(discountPoint) + voucherDiscount;

    let totalPrice = dataSettle.dataBasket.totalNettAmount - discount < 0 ? 0 : dataSettle.dataBasket.totalNettAmount - discount;
    this.setState({
      ...dataSettle,
      selectedVoucher,
      selectedCard,
      selectedPoint,
      totalPrice,
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

      let voucherType = selectedVoucher.voucherType;
      let voucherValue = selectedVoucher.voucherValue;
      let discount = 0;
      let discountVoucher = this.state.discountVoucher
      let checkProduct = undefined;

      if (dataBasket.details && dataBasket.details.length > 0) {
        if(selectedVoucher.appliedTo === "PRODUCT"){
          for (let i = 0; i < dataBasket.details.length; i++) {
            let details = dataBasket.details[i];
            let check = selectedVoucher.appliedItems.find(items => { return items.value === details.product.id})
            if(check) checkProduct = details
          }
        } else if(selectedVoucher.appliedTo === "COLLECTION"){
          for (let index = 0; index < selectedVoucher.appliedItems.length; index++) {
            let appliedItems = selectedVoucher.appliedItems[index];
            let collection = await this.props.dispatch(ProductAction.getCollection(appliedItems.value.split("::")[1]))
            
            if(collection.products){
              for (let i = 0; i < dataBasket.details.length; i++) {
                let details = dataBasket.details[i];
                let check = collection.products.find(items => { return items.id === details.product.id })
                if(check) checkProduct = details
              }
            }
          }
        } else if(selectedVoucher.appliedTo === "CATEGORY"){
          for (let i = 0; i < dataBasket.details.length; i++) {
            let details = dataBasket.details[i];
            let check = selectedVoucher.appliedItems.find(items => { return items.value === details.categoryID.split("::")[1]})
            if(check) checkProduct = details
          }
        }
      } 

      let voucherDiscount = _.sumBy(this.state.voucherDiscountList, items => { return items.paymentType === "voucher" && items.paymentAmount});
      let voucherDiscountList = {
        paymentType: "voucher",
        voucherId: selectedVoucher.id,
        serialNumber: selectedVoucher.serialNumber,
        paymentAmount: 5,
        isVoucher: true
      }

      if (checkOutlet) {
        if (selectedVoucher.appliedItems) {
          if (checkProduct) {
            let date = new Date();
            let tanggal = moment().format().split("T")[0];
            let region = moment().format().split("+")[1];
            let activeWeekDays = selectedVoucher.validity.activeWeekDays;
            let validHour = activeWeekDays[date.getDay()].validHour;
            let validHourFrom = validHour.from;
            let validHourTo = validHour.to;
            if (activeWeekDays[date.getDay()].active) {
              let from = `${tanggal}T${validHourFrom}:00+${region}`
              let to = `${tanggal}T${validHourTo}:00+${region}`
              let statusValidHour = moment(moment().format()).isBetween(from,to);
              if (statusValidHour) {
                discount = voucherValue;
                if (voucherType === "discPercentage") {
                  discount =
                    Number(checkProduct.unitPrice) *
                    Number(checkProduct.quantity) *
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

                let voucherDiscount = _.sumBy(this.state.voucherDiscountList, items => { 
                  return items.paymentType === "voucher" && items.voucherId === selectedVoucher.id && items.paymentAmount
                });

                if(checkProduct.nettAmount - voucherDiscount > 0){
                  voucherDiscountList.paymentAmount = discount 
                  if(discount > (checkProduct.nettAmount - (voucherDiscount || 0)) ){
                    voucherDiscountList.paymentAmount = Number((checkProduct.nettAmount - (voucherDiscount || 0)).toFixed(2))
                  }
                  
                  this.state.voucherDiscountList.push(voucherDiscountList)
                  this.setState({
                    discountVoucher: discountVoucher + discount,
                    statusSelectedVoucher: true,
                    selectedVoucher,
                  });
                } else {
                  // this.handleCancelVoucher(selectedVoucher)
                  this.setRemoveVoucher("Sorry, the discount has exceeded the total price for a specific product!", selectedVoucher);
                }
              } else {
                this.setRemoveVoucher("Sorry, this voucher not available this time!", selectedVoucher);
              }
            } else {
              this.setRemoveVoucher("Sorry, this voucher not available today!", selectedVoucher);
            }
          } else {
            this.setRemoveVoucher(`Sorry, voucher ${selectedVoucher.name} is only available on specific product!`, selectedVoucher);
          }
        } else {
          if (voucherType === "discPercentage") {
            discount = Number(dataBasket.totalNettAmount) * (Number(voucherValue) / 100);
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

          if(dataBasket.totalNettAmount - voucherDiscount > 0){
            voucherDiscountList.paymentAmount = discount 
            if(discount > (dataBasket.totalNettAmount - (voucherDiscount || 0)) ){
              voucherDiscountList.paymentAmount = (dataBasket.totalNettAmount - (voucherDiscount || 0))
            }
            
            this.state.voucherDiscountList.push(voucherDiscountList)
            this.setState({
              discountVoucher: discountVoucher + discount,
              statusSelectedVoucher: true,
              selectedVoucher,
            });
          } else {
            this.handleCancelVoucher(selectedVoucher)
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
      props.orderingMode && (
        props.orderingMode === "TAKEAWAY" ||
        props.orderingMode === "STOREPICKUP" ||
        props.orderingMode === "STORECHECKOUT"
      )) ||
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
    this.setState({ discountPoint: 0, selectedPoint: 0});
    localStorage.removeItem(`${config.prefix}_selectedPoint`);
    await this.getDataBasket();
  };

  handleRedeemVoucher = async () => {
    // this.setState({ discountPoint: 0 });
    // localStorage.removeItem(`${config.prefix}_selectedPoint`);
    this.props.history.push(`/myVoucher`);
  };

  handleRedeemPoint = async () => {
    // localStorage.removeItem(`${config.prefix}_selectedVoucher`);
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

    let textRasio = `Redeem ${pointsToRebateRatio.split(":")[0]} point to ${this.getCurrency(
      parseInt(pointsToRebateRatio.split(":")[1])
    )}`;
    
    this.setState({
      textRasio,
      selectedPoint,
      needPoint,
    });
  };

  scrollPoint = (data) => {
    data = this.calculateSelectedPoint(data);
    this.setState({ selectedPoint: data });
  };

  calculateSelectedPoint = (selectedPoint, type = null) => {
    let { dataBasket, pointsToRebateRatio, detailPoint, discountVoucher } = this.state;
    let totalAmount = dataBasket.totalNettAmount - discountVoucher

    if (detailPoint.roundingOptions === "DECIMAL") {
      if (type === "selectedPoint") {
        selectedPoint = (totalAmount / pointsToRebateRatio.split(":")[1]) * pointsToRebateRatio.split(":")[0];
      }
      return parseFloat(selectedPoint.toFixed(2));
    } else {
      if (type === "selectedPoint") {
        selectedPoint = (Math.floor(totalAmount) / pointsToRebateRatio.split(":")[1]) * pointsToRebateRatio.split(":")[0];
      }
      if (type === "allin") return Math.floor(selectedPoint);
      else return Math.ceil(selectedPoint);
    }
  };

  setPoint = async (selectedPoint, dataBasket = null, pointsToRebateRatio) => {
    if (!dataBasket) dataBasket = this.state.dataBasket;
    if (!pointsToRebateRatio) pointsToRebateRatio = this.state.pointsToRebateRatio;

    localStorage.setItem( `${config.prefix}_selectedPoint`, JSON.stringify(encryptor.encrypt(selectedPoint)) );
    this.setState({ selectedPoint, discountPoint: selectedPoint});

    await this.getDataBasket();
    return selectedPoint;
  };

  setRemoveVoucher = (message, itemVoucher) => {
    this.handleCancelVoucher(itemVoucher)
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

  submitSettle = async (need = null, payAtPOS = false) => {
    Swal.fire({
      onOpen: () => {
        Swal.showLoading();
      },
    });

    let { orderingMode, dataBasket, deliveryAddress,
      selectedVoucher, selectedPoint, totalPrice, selectedCard,
      scanTable, voucherDiscountList, detailPoint, pointsToRebateRatio,
      orderActionDate, orderActionTime, storeDetail
    } = this.state;

    let payload = {
      cartID: dataBasket.cartID,
      totalNettAmount: dataBasket.totalNettAmount,
      amount: dataBasket.totalNettAmount,
      payments: [],
      validateOutletSetting: {
        enableDelivery: storeDetail.enableDelivery,
        enableDineIn: storeDetail.enableDineIn,
        enableStoreCheckOut: storeDetail.enableStoreCheckOut,
        enableStorePickUp: storeDetail.enableStorePickUp,
        enableTakeAway: storeDetail.enableTakeAway,
      },
      payAtPOS,
      orderingMode
    };

    if(scanTable) payload.tableNo = scanTable.table || scanTable.tableNo || "-"

    if (orderingMode === "DELIVERY") {
      payload.deliveryAddress = deliveryAddress;
      payload.deliveryProvider = this.props.deliveryProvider.name;
      payload.deliveryProviderName = this.props.deliveryProvider.name;
      payload.deliveryService = "-";
      payload.deliveryProviderId = this.props.deliveryProvider.id;
      payload.deliveryFee = this.props.deliveryProvider.deliveryFeeFloat;
    }

    if (selectedVoucher !== null) {
      payload.payments = payload.payments.concat(voucherDiscountList)
    } 

    if (selectedPoint > 0) {
      let paymentAmount = 0
      if (detailPoint.roundingOptions !== "INTEGER") {
        paymentAmount = (selectedPoint / pointsToRebateRatio.split(":")[0]) * pointsToRebateRatio.split(":")[1];
      } else {
        paymentAmount = (selectedPoint / pointsToRebateRatio.split(":")[0]) * pointsToRebateRatio.split(":")[1];
        paymentAmount = Math.floor(paymentAmount)
      }

      payload.payments.push({
        paymentType: "point",
        redeemValue: selectedPoint,
        paymentAmount: paymentAmount,
        isPoint: true
      })
    }

    if(selectedCard) {
      payload.payments.push({
        paymentType: selectedCard.paymentID,
        paymentID: selectedCard.paymentID,
        paymentName: selectedCard.paymentName,
        accountId: selectedCard.accountID,
        paymentAmount: totalPrice
      })
    }

    let response;
    if (
      orderingMode === "TAKEAWAY" ||
      orderingMode === "STOREPICKUP" ||
      orderingMode === "STORECHECKOUT" ||
      orderingMode === "DELIVERY" ||
      storeDetail.outletType === "QUICKSERVICE"
    ) {
      payload.orderActionDate = orderActionDate
      payload.orderActionTime = orderActionTime
      response = await this.props.dispatch(OrderAction.submitTakeAway(payload));
    } else {
      response = await this.props.dispatch(OrderAction.submitSettle(payload));
    }
    console.log(response)

    if (response && response.resultCode === 400) {
      Swal.fire(
        "Oppss!",
        response.message || (response.data && response.data.message) || "Payment Failed!",
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
    
    selectedVoucher = selectedVoucher.filter(voucher => {
      return voucher.serialNumber !== item.serialNumber
    })

    this.setState({selectedVoucher, discountVoucher: 0})
    localStorage.setItem(`${config.prefix}_selectedVoucher`, JSON.stringify(encryptor.encrypt(selectedVoucher)));
    await this.getDataBasket();
  }

  handleCancelCreditCard = async () => {
    localStorage.removeItem(`${config.prefix}_selectedCard`);
    await this.getDataBasket();
  }

  render() {
    let { dataBasket, totalPrice, selectedCard, isLoadingPOS, 
      cartDetails, storeDetail, dataSettle,
    } = this.state;
    let { basket } = this.props;
    let deliveryFee = this.props.deliveryProvider ? this.props.deliveryProvider.deliveryFeeFloat : 0;
    let currency = this.props.companyInfo && this.props.companyInfo.currency;
    let formattedPrice = (this.getCurrency(totalPrice + deliveryFee) || "").split((currency && currency.code) || " ")[1];
    let totalAmount = (this.getCurrency(dataBasket && dataBasket.totalNettAmount + deliveryFee) || "").split((currency && currency.code) || " ")[1]
    let basketLength = 0;
    if (basket && basket.details) {
      basket.details.forEach((cart) => {
        basketLength += cart.quantity;
      });
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
                  <img src={config.url_emptyImage} alt="is empty" style={{marginTop: 30}}/>
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
                {dataBasket && (
                  <div style={{ backgroundColor: "#FFF", width: "100%" }}>
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
                          marginLeft: -20
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
                          <div style={{ fontSize: 40, fontWeight: "bold", color: "black" }} >
                            {formattedPrice}
                          </div>
                          {
                            totalAmount !== formattedPrice &&
                            <div style={{textAlign: "right", marginRight: -10, textDecorationLine: "line-through"}}>
                              {(this.getCurrency(totalAmount) || "").split(this.props.companyInfo && this.props.companyInfo.currency.code)[1]}
                            </div>
                          }
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
                      <i className="fa fa-shopping-cart" aria-hidden="true" style={{
                        color: this.props.color.primary || "#c00a27", fontSize: 22, padding: 7,
                        borderRadius: 45, border: `1px solid ${this.props.color.primary || "#c00a27"}`
                      }}/>
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
                            lineHeight: "17px"
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
                      setPoint={(point) => this.setPoint(point)}
                      handleCancelVoucher={(item) => this.handleCancelVoucher(item)}
                      handleCancelPoint={() => this.cancelSelectPoint()}
                      disabledBtn={(totalPrice + deliveryFee) === 0}
                    />

                    {this.props.isLoggedIn && (
                      <PaymentMethodBasket
                        data={this.state}
                        roleBtnClear={!this.props.isLoggedIn}
                        disabledBtn={(totalPrice + deliveryFee) === 0}
                        handleCancelCreditCard={() => this.handleCancelCreditCard()}
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
                          ? `Pay ${this.getCurrency(totalPrice + deliveryFee)}`
                          : `Pay ${this.getCurrency(
                            totalPrice + deliveryFee
                          )} with ${selectedCard.details.cardIssuer.toUpperCase()}  ${selectedCard.details.maskedAccountNumber.substr(
                            selectedCard.details.maskedAccountNumber.toString()
                              .length - 4
                          )}`}
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
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
