import React, { Component } from 'react';
import { connect } from "react-redux";
import { Col, Row } from 'reactstrap';
import Shimmer from "react-shimmer-effect";
import { OrderAction } from '../../redux/actions/OrderAction';
import { MasterdataAction } from '../../redux/actions/MaterdataAction';
import { CustomerAction } from '../../redux/actions/CustomerAction';
import { CampaignAction } from '../../redux/actions/CampaignAction';
import Lottie from 'lottie-react-web';
import emptyGif from '../../assets/gif/empty-and-lost.json';
import moment from 'moment';
import _ from 'lodash';
import Sound_Effect from "../../assets/sound/Sound_Effect.mp3";
import { isEmptyArray, isEmptyObject } from "../../helpers/CheckEmpty";
import loadable from '@loadable/component';
import config from '../../config';


const ViewCartBasket = loadable(() => import('./viewCartBasket'))
const ViewProsessBasket = loadable(() => import('./viewProssessBasket'))

const Swal = require('sweetalert2')
const base64 = require('base-64');
const encryptor = require('simple-encryptor')(process.env.REACT_APP_KEY_DATA);

class Basket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingShow: true,
      isLoading: true,
      dataBasket: null,
      myVoucher: null,
      countryCode: 'SG',
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
      orderingMode: window.location.pathname.includes('emenu') ? "DINEIN" : "DELIVERY",
      btnBasketOrder: true,
      play: false,
      deliveryProvaider: [],
      dataCVV: "",
      isEmenu: window.location.pathname.includes('emenu')
    };
    this.audio = new Audio(Sound_Effect)
  }

  viewShimmer = (isHeight = 100) => {
    return (
      <Shimmer>
        <div style={{
          width: "100%", height: isHeight, alignSelf: "center",
          borderRadius: "8px", marginBottom: 10
        }} />
      </Shimmer>
    )
  }

  componentDidMount = async () => {
    await this.checkOfflineCart();
    this.audio.addEventListener('ended', () => this.setState({ play: false }));

    let param = this.getUrlParameters()
    if (param && param['input']) {
      param = this.getUrlParameters(base64.decode(decodeURI(param['input'])))
      localStorage.setItem(`${config.prefix}_scanTable`, JSON.stringify(encryptor.encrypt(param)));
    } else {
      localStorage.removeItem(`${config.prefix}_scanTable`)
    }

    setInterval(() => {
      try {
        let widthSelected = document.getElementById("cardItem").clientWidth;
        if (widthSelected !== this.state.widthSelected) {
          this.setState({ widthSelected })
        }
      } catch (error) { }
    }, 0)
    this.getDataBasket()
  }

  getUrlParameters = (pageParamString = null) => {
    if (!pageParamString) pageParamString = window.location.href.split("?")[1];
    if (pageParamString) {
      var paramsArray = pageParamString.split('&');
      var paramsHash = {};

      for (var i = 0; i < paramsArray.length; i++) {
        var singleParam = paramsArray[i].split('=');
        paramsHash[singleParam[0]] = singleParam[1];
      }
      return paramsHash;
    }
  }

  checkOfflineCart = async () => {
    let { account } = this.props
    try {
      let offlineCart = localStorage.getItem(`${config.prefix}_offlineCart`);
      offlineCart = JSON.parse(offlineCart);

      if (isEmptyObject(offlineCart)) return;
      await this.props.dispatch(OrderAction.deleteCart(true));
      if (account != undefined && account != null) {
        for (let i = 0; i < offlineCart.details.length; i++) {
          let product = {
            productID: offlineCart.details[i].productID,
            unitPrice: offlineCart.details[i].retailPrice,
            quantity: offlineCart.details[i].quantity
          };

          if (offlineCart.details[i].remark != undefined && offlineCart.details[i].remark != "-") {
            product.remark = offlineCart.details[i].remark;
          }

          if (!isEmptyArray(offlineCart.details[i].modifiers)) {
            product.modifiers = offlineCart.details[i].modifiers;
          }

          let payload = {
            outletID: offlineCart.outletID,
            details: []
          };
          payload.details.push(product);
          await this.props.dispatch(OrderAction.addCart(payload));
        }
        localStorage.removeItem(`${config.prefix}_offlineCart`);
      }
    } catch (e) { }
  }

  getDataBasket = async (isChangeMode = false, orderingMode = null) => {
    let { isLoggedIn } = this.props
    let { isEmenu } = this.state
    let selectedVoucher = encryptor.decrypt(JSON.parse(localStorage.getItem(`${config.prefix}_selectedVoucher`)));
    let selectedPoint = encryptor.decrypt(JSON.parse(localStorage.getItem(`${config.prefix}_selectedPoint`)));
    let scanTable = encryptor.decrypt(JSON.parse(localStorage.getItem(`${config.prefix}_scanTable`)));
    let infoCompany = encryptor.decrypt(JSON.parse(localStorage.getItem(`${config.prefix}_infoCompany`)));
    let selectedCard = encryptor.decrypt(JSON.parse(localStorage.getItem(`${config.prefix}_selectedCard`)));
    let deliveryAddress = encryptor.decrypt(JSON.parse(localStorage.getItem(`${config.prefix}_deliveryAddress`)));
    let dataBasket = encryptor.decrypt(JSON.parse(localStorage.getItem(`${config.prefix}_dataBasket`)));

    if (!orderingMode) orderingMode = localStorage.getItem(`${config.prefix}_ordering_mode`) || (isEmenu ? 'DINEIN' : 'DELIVERY');

    // console.log('scanTable', scanTable)
    if (!infoCompany) {
      let time = setInterval(async () => {
        infoCompany = await encryptor.decrypt(JSON.parse(localStorage.getItem(`${config.prefix}_infoCompany`)));
        if (infoCompany) clearInterval(time)
      }, 0);
    } else {
      this.setState({ countryCode: infoCompany.countryCode })
    }

    if (isLoggedIn) {
      let response = this.props.dispatch(CustomerAction.getVoucher());
      // if (response.ResultCode === 200) this.setState({ myVoucher: response.Data })

      response = this.props.dispatch(CampaignAction.getCampaignPoints({ history: "false" }, infoCompany && infoCompany.companyId));
      // if (response.ResultCode === 200) this.setState(response.Data)
    } else if (!isLoggedIn && dataBasket) {
      dataBasket.orderingMode = orderingMode
      let response = await this.props.dispatch(OrderAction.buildCart(dataBasket));
      if (!response.message) dataBasket = response.data
    }

    if (!dataBasket) dataBasket = await this.getDataBasket_()

    if (dataBasket) {
      this.checkViewCart(dataBasket)

      if (dataBasket.confirmationInfo && dataBasket.confirmationInfo.voucher) {
        selectedVoucher = dataBasket.confirmationInfo.voucher
        localStorage.setItem(`${config.prefix}_selectedVoucher`, JSON.stringify(encryptor.encrypt(selectedVoucher)));
      } else if (dataBasket.confirmationInfo && dataBasket.confirmationInfo.redeemPoint > 0) {
        selectedPoint = this.setPoint(dataBasket.confirmationInfo.redeemPoint, dataBasket)
      }

      let storeDetail = null;
      if (!isEmptyObject(this.props.defaultOutlet)) storeDetail = this.props.defaultOutlet
      else storeDetail = await this.props.dispatch(MasterdataAction.getOutletByID(dataBasket.outlet.id))
      // console.log('storeDetail', storeDetail)

      await this.getStatusVoucher(selectedVoucher, storeDetail, dataBasket)
      let deliveryProvaider = await this.props.dispatch(OrderAction.getProvider());
      let discount = (selectedPoint || 0) + this.state.discountVoucher
      let totalPrice = (dataBasket.totalNettAmount - discount) < 0 ? 0 : (dataBasket.totalNettAmount - discount)

      if (dataBasket.orderingMode) {
        if (dataBasket.orderingMode === "DELIVERY" && isEmenu) dataBasket.orderingMode = "DINEIN"
        if (dataBasket.orderingMode === "DINEIN" && !isEmenu) dataBasket.orderingMode = "DELIVERY"

        orderingMode = !isChangeMode && dataBasket.orderingMode || orderingMode
        scanTable = {
          ...scanTable,
          tableType: !isChangeMode && dataBasket.orderingMode || orderingMode,
          tableNo: dataBasket.tableNo,
          outlet: dataBasket.outletID
        };
      }

      if (isChangeMode || dataBasket.totalSurchargeAmount === 0) {
        let surcharge = await this.props.dispatch(OrderAction.changeOrderingMode({ orderingMode }))
        if (surcharge.resultCode === 200) {
          dataBasket = surcharge.data
          localStorage.setItem(`${config.prefix}_dataBasket`, JSON.stringify(encryptor.encrypt(dataBasket)));
        }
      }

      // console.log('dataBasket', dataBasket)

      if (dataBasket.deliveryProviderId) {
        let provaiderDelivery = deliveryProvaider.find(items => { return items.id === dataBasket.deliveryProviderId })
        this.setState({ provaiderDelivery })
      }

      this.setState({
        dataBasket, storeDetail, scanTable, totalPrice,
        btnBasketOrder: !this.checkOperationalHours(storeDetail).status,
        countryCode: infoCompany.countryCode
      })

      if (deliveryProvaider && deliveryProvaider.length > 0 && deliveryAddress) {
        deliveryProvaider.forEach(async (provider) => {
          let payload = {
            outletId: dataBasket.outlet.id,
            cartID: dataBasket.cartID,
            provider: provider.id,
            service: provider.name,
            deliveryAddress: deliveryAddress,
          };
          let response = await this.props.dispatch(OrderAction.getCalculateFee(payload));
          provider.deliveryFee = this.getCurrency(response.deliveryFee)
          provider.deliveryFeeFloat = response.deliveryFee
        });
        this.setState({ deliveryProvaider })
      }

      this.submitOtomatis(dataBasket);

      this.timeGetBasket = setInterval(async () => {
        if (dataBasket.id) await this.getDataBasketPending(dataBasket.id, dataBasket.status)
      }, 5000);
    } else {
      this.setState({ dataBasket: null, storeDetail: null, scanTable: null, totalPrice: 0 })
    }

    this.setState({
      loadingShow: false, isLoading: false, selectedPoint,
      discountPoint: selectedPoint || 0, orderingMode, selectedCard,
      deliveryAddress
    })
  }

  componentDidUpdate() {
    if (this.props.campaignPoint.detailPoint && !this.state.detailPoint) this.setState(this.props.campaignPoint)
    if (this.props.myVoucher && !this.state.myVoucher) this.setState({ myVoucher: this.props.myVoucher })
  }

  checkViewCart = (dataBasket) => {
    let { viewCartStatus } = this.state
    if (
      viewCartStatus &&
      (
        dataBasket.status === "PROCESSING" ||
        dataBasket.status === "READY_FOR_COLLECTION" ||
        dataBasket.status === "READY_FOR_DELIVERY" ||
        dataBasket.status === "ON_THE_WAY"
      )
    ) {
      this.setState({ viewCart: false })
    }
  }

  componentWillUnmount = () => {
    clearInterval(this.timeGetBasket)
  }

  getDataBasket_ = async () => {
    let response = await this.props.dispatch(OrderAction.getCart());
    if (
      response && response.data &&
      Object.keys(response.data).length > 0 &&
      !response.data.message &&
      response.data.status !== "failed"
    ) {
      localStorage.setItem(`${config.prefix}_dataBasket`, JSON.stringify(encryptor.encrypt(response.data)));
      this.setState({ dataBasket: response.data })
      return response.data
    }
  }

  getDataBasketPending = async (id, status) => {
    let response = await this.props.dispatch(OrderAction.getCartPending(id));
    if (response.resultCode === 200) {
      localStorage.setItem(`${config.prefix}g_dataBasket`, JSON.stringify(encryptor.encrypt(response.data)));
      this.checkViewCart(response.data)
      this.setState({ dataBasket: response.data })
    } else {
      response = await this.props.dispatch(OrderAction.getCartCompleted(id));
      if (response.data && response.data.status && response.data.status === "COMPLETED") {
        this.togglePlay()
        this.setState({ isLoading: false })
        Swal.fire('Congratulations!', 'Your order has been completed.', 'success')
        clearInterval(this.timeGetBasket)
        setTimeout(() => {
          this.props.history.push('/history')
          localStorage.removeItem(`${config.prefix}_dataBasket`)
          window.location.reload()
        }, 2000);
      } else if (response.data && response.data.status && response.data.status === "CANCELLED") {
        this.togglePlay()
        this.setState({ isLoading: false })
        Swal.fire('Oppss!', `Your order has been ${response.data.status}.`, 'error')
        clearInterval(this.timeGetBasket)
        setTimeout(() => {
          this.props.history.push('/history')
          localStorage.removeItem(`${config.prefix}_dataBasket`)
          window.location.reload()
        }, 2000);
      } else {
        response = await this.props.dispatch(OrderAction.getCart(false));
        if (
          response && response.data &&
          Object.keys(response.data).length > 0 &&
          !response.data.message &&
          response.data.status !== "failed" &&
          status !== response.data.status
        ) {
          localStorage.setItem(`${config.prefix}_dataBasket`, JSON.stringify(encryptor.encrypt(response.data)));
          // console.log(response.data)
          this.setState({ dataBasket: response.data })
        }
      }
    }
  }

  checkOperationalHours = storeDetail => {
    let operationalHours = storeDetail.operationalHours.filter(function (a) {
      return a.nameOfDay === moment().format('dddd');
    })[0];

    let status = moment(moment().format('HH:mm'), 'HH:mm')
    let beforeTime = moment(operationalHours.open, 'HH:mm')
    let afterTime = moment(operationalHours.close, 'HH:mm');
    status = status.isBetween(beforeTime, afterTime);

    if (status) {
      let lastOrderOn = storeDetail.lastOrderOn ? storeDetail.lastOrderOn : 0;
      status = moment(moment().format('HH:mm'), 'HH:mm')
      beforeTime = moment(operationalHours.close, 'HH:mm')
      afterTime = moment(operationalHours.close, 'HH:mm').subtract(lastOrderOn, 'minutes');

      status = status.isBetween(beforeTime, afterTime);
    } else {
      status = true
    }

    return { status: status, afterTime, beforeTime };
  }

  getStatusVoucher = (selectedVoucher, storeDetail, dataBasket) => {
    if (selectedVoucher !== null) {
      let checkOutlet = false;
      if (selectedVoucher.selectedOutlets && selectedVoucher.selectedOutlets.length > 0) {
        selectedVoucher.selectedOutlets.forEach(element => {
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
        checkProduct = _.filter(dataBasket.details, { "productID": selectedVoucher.productID })[0]
      }
      if (checkOutlet) {
        if (selectedVoucher.applyToSpecificProduct) {
          if (checkProduct) {
            let date = new Date()
            let tanggal = moment().format().split('T')[0];
            let region = moment().format().split('+')[1];
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
                  discount = (Number(checkProduct.unitPrice) * Number(checkProduct.quantity)) * (Number(voucherValue) / 100);
                } else {
                  discount = voucherValue;
                }
                this.setState({ discountVoucher: discount, statusSelectedVoucher: true, selectedVoucher });
              } else {
                this.setRemoveVoucher('Voucher not available this time!');
              }
            } else {
              this.setRemoveVoucher('Voucher not available today!');
            }
          } else {
            this.setRemoveVoucher('Voucher only available this product!');
          }
        } else {
          if (voucherType === "discPercentage") {
            discount = Number(dataBasket.totalNettAmount) * (Number(voucherValue) / 100);
          } else {
            discount = voucherValue;
          }
          this.setState({ discountVoucher: discount, statusSelectedVoucher: true, selectedVoucher });
        }
      } else {
        this.setRemoveVoucher('Voucher be used this outlet!');
      }
    }
  }

  setRemoveVoucher = (message) => {
    localStorage.removeItem(`${config.prefix}_selectedVoucher`)
    this.setState({ statusSelectedVoucher: false, selectedVoucher: null })
    Swal.fire('Oppss!', message, 'error')
  }

  getCurrency = (price) => {
    let { countryCode } = this.props
    if (price != undefined) {
      let currency = { code: 'en-US', currency: 'SGD' };
      if (countryCode === "SG") currency = { code: 'en-US', currency: 'SGD' };
      if (!price || price === "-") price = 0;
      let result = price.toLocaleString(currency.code, { style: 'currency', currency: currency.currency });
      return result
    }
  };

  cancelSelectVoucher = async () => {
    this.setState({ discountVoucher: 0, newTotalPrice: "0", isLoading: true, selectedVoucher: false })
    localStorage.removeItem(`${config.prefix}_selectedVoucher`)
    await this.getDataBasket();
  }

  cancelSelectPoint = async () => {
    this.setState({ discountPoint: 0, selectedPoint: 0, newTotalPrice: "0", isLoading: true })
    localStorage.removeItem(`${config.prefix}_selectedPoint`)
    await this.getDataBasket();
  }

  handleRedeemVoucher = async () => {
    this.setState({ discountPoint: 0 })
    localStorage.removeItem(`${config.prefix}_selectedPoint`)
    this.props.history.push('/myVoucher')
  }

  handleRedeemPoint = async () => {
    localStorage.removeItem(`${config.prefix}_selectedVoucher`)
    let selectedPoint = this.state.selectedPoint;
    let totalPoint = this.state.totalPoint;
    let pointsToRebateRatio = this.state.pointsToRebateRatio;
    let needPoint = this.calculateSelectedPoint(selectedPoint, "selectedPoint")

    if (selectedPoint <= 0) {
      selectedPoint = this.calculateSelectedPoint(selectedPoint, "selectedPoint");
    } else if (selectedPoint > totalPoint) {
      selectedPoint = this.calculateSelectedPoint(totalPoint, "allIn");
    } else if (pointsToRebateRatio.split(":")[0] && pointsToRebateRatio.split(":")[1] === "0") {
      selectedPoint = 0
    }

    let textRasio = `Redeem ${pointsToRebateRatio.split(":")[0]} point to ${this.getCurrency(parseInt(pointsToRebateRatio.split(":")[1]))}`
    this.setState({
      discountVoucher: 0, textRasio, selectedPoint, needPoint,
      selectedVoucher: null, statusSelectedVoucher: false
    })
  }

  scrollPoint = (data) => {
    data = this.calculateSelectedPoint(data)
    this.setState({ selectedPoint: data })
  }

  calculateSelectedPoint = (selectedPoint, type = null) => {
    let { dataBasket, pointsToRebateRatio, detailPoint } = this.state

    if (type === "selectedPoint") {
      selectedPoint = (dataBasket.totalNettAmount / pointsToRebateRatio.split(":")[1]) * pointsToRebateRatio.split(":")[0]
    }

    if (detailPoint.roundingOptions === "DECIMAL") {
      return parseFloat(selectedPoint.toFixed(2));
    } else {
      if (type === "allin") return Math.floor(selectedPoint);
      else return Math.ceil(selectedPoint);
    }
  }

  setOrderingMode = async (orderingMode) => {
    localStorage.setItem(`${config.prefix}_ordering_mode`, orderingMode);
    this.setState({ orderingMode, isLoading: true })
    await this.getDataBasket(true, orderingMode)
    this.setState({ isLoading: false })
  }

  setPoint = (point, dataBasket = null, pointsToRebateRatio) => {
    if (!dataBasket) {
      dataBasket = this.state.dataBasket
    }
    if (!pointsToRebateRatio) {
      pointsToRebateRatio = this.state.pointsToRebateRatio
    }
    let totalPrice = (point / pointsToRebateRatio.split(":")[0]) * pointsToRebateRatio.split(":")[1]
    totalPrice = dataBasket.totalNettAmount - totalPrice < 0 ? 0 : dataBasket.totalNettAmount - totalPrice;
    localStorage.setItem(`${config.prefix}_selectedPoint`, JSON.stringify(encryptor.encrypt(point)));
    this.setState({ selectedPoint: point, discountPoint: point, totalPrice, newTotalPrice: totalPrice })
    return point
  }

  handleClear = async (dataBasket = null) => {
    Swal.fire({
      title: 'Want to clear data?',
      text: 'You will clear data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then(async (result) => {
      if (result.value) {
        Swal.fire({ onOpen: () => { Swal.showLoading() } })
        if (dataBasket) {
          let selected = _.filter(dataBasket.details, items => { return items.selected !== false })
          if (dataBasket.details.length === selected.length) await this.props.dispatch(OrderAction.deleteCart());
          else {
            for (let index = 0; index < selected.length; index++) {
              let items = selected[index];
              if (items.selected !== false) {
                items.quantity = 0
                await this.props.dispatch(OrderAction.processUpdateCart(dataBasket, items));
              }
            }
            localStorage.removeItem(`${config.prefix}_dataBasket`)
            window.location.reload();
          }
        } else {
          await this.props.dispatch(OrderAction.deleteCart());
        }
        await this.getDataBasket()
      }
    })
  }

  handleSettle = async () => {
    let { selectedCard } = this.state
    let { isLoggedIn } = this.props
    if (!isLoggedIn) {
      document.getElementById('login-register-btn').click()
      return
    }

    if (selectedCard) {
      let userInput = selectedCard.details.userInput
      if (userInput.length > 0) {
        let needCVV = userInput.find(items => { return items.name === "cardCVV" && items.required })

        if (Object.keys(needCVV).length !== 0) {
          console.log('need cvv')
          return
        }
      }
    }

    this.submitSettle()
  }

  submitSettle = async (need = null) => {
    localStorage.setItem(`${config.prefix}_dataSettle`, JSON.stringify(encryptor.encrypt(this.state)));
    this.props.history.push('/payment')
  }

  handleSubmit = async () => {
    let { orderingMode, storeDetail, scanTable, dataBasket } = this.state
    let { isLoggedIn } = this.props
    if (!isLoggedIn) {
      document.getElementById('login-register-btn').click()
      return
    }

    if (this.checkScan()) this.props.history.push('/scanTable')
    else if (orderingMode === "TAKEAWAY") {
      this.setState({ isLoading: true })

      let payload = {
        tableNo: scanTable.tableNo || scanTable.table,
        orderingMode: orderingMode
      }

      let response
      if (storeDetail.outletType === "QUICKSERVICE") {
        response = await this.props.dispatch(OrderAction.submitTakeAway(payload));
      } else {
        response = await this.props.dispatch(OrderAction.submitOrdering(payload));
      }

      if (response && response.resultCode === 400) {
        Swal.fire('Oppss!', response.message || response.data.message || 'Submit error!', 'error')
        this.setState({ isLoading: false })
      }

      this.waitingConfirm = setInterval(() => {
        if (dataBasket.status === "CONFIRMED") {
          setTimeout(async () => {
            this.togglePlay()
            this.setState({ isLoading: false })
          }, 3000);
          clearInterval(this.waitingConfirm);
        }
      }, 1000);
    } else if (orderingMode === "DINEIN") {
      scanTable.scan = true
      this.submitOtomatis(dataBasket, scanTable)
    }
  }

  submitOtomatis = async (dataBasket, scanTable = null) => {
    let { orderingMode, storeDetail } = this.state
    if (!scanTable) scanTable = this.state.scanTable
    if (
      dataBasket && dataBasket.status === "PENDING" &&
      scanTable && scanTable.scan && storeDetail &&
      storeDetail.outletType !== "QUICKSERVICE"
    ) {
      this.setState({ isLoading: true })

      let payload = {
        tableNo: scanTable.tableNo || scanTable.table,
        orderingMode: orderingMode
      }

      let response = await this.props.dispatch(OrderAction.submitBasket(payload));
      if (response && response.resultCode === 200) {
        this.setState({ dataBasket: response.data })
        localStorage.removeItem(`${config.prefix}_dataBasket`)
        response = await this.props.dispatch(OrderAction.setData({}, 'DATA_BASKET'));
        this.setState({ isLoading: false })
        localStorage.setItem(`${config.prefix}_dataSettle`, JSON.stringify(encryptor.encrypt(this.state)));
        this.props.history.push('/payment')
      } else {
        Swal.fire('Oppss!', response.message || response.data.message || 'Submit error!', 'error')
        this.props.history.push('/scanTable')
      }

      this.setState({ isLoading: false })
    } else if (scanTable && scanTable.scan && storeDetail.outletType === "QUICKSERVICE") {
      this.setState({ settle: true })
    }
  }

  checkScan = () => {
    let { orderingMode, storeDetail, scanTable, dataBasket } = this.state
    if (orderingMode === "DINEIN" && storeDetail.outletType === "RESTO" && !scanTable) {
      return true
    } else if (
      orderingMode === "DINEIN" &&
      storeDetail.outletType === "QUICKSERVICE" &&
      storeDetail.enableTableScan !== false &&
      storeDetail.enableDineIn !== false && !scanTable
    ) {
      return true
    }
    return false
  }

  togglePlay = () => {
    this.setState({ play: !this.state.play }, () => {
      this.state.play ? this.audio.play() : this.audio.pause();
    });
  }

  handleSetProvaider = async (data) => {
    this.setState({ provaiderDelivery: data })
    this.state.deliveryProvaider.forEach(provider => {
      if (provider.id === data.id) provider.default = true
      else delete provider.default
    });
  }

  setViewCart = async (status = null) => {
    this.setState({ viewCart: status, viewCartStatus: false })
  }

  handleCompletedOrdering = (status) => {
    Swal.fire({
      title: "Received your order?",
      text: "You hereby receive your order.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: "Yes"
    }).then(async (result) => {
      if (result.value) {
        try {
          this.setState({ isLoading: true })
          await this.props.dispatch(OrderAction.cartUpdate({ id: this.state.dataBasket.cartID, status }));
        } catch (error) {
          console.log(error)
        }
      }
    })
  }

  handleSetState = async (field, value) => {
    this.setState({ [field]: value })
    if (field === 'dataBasket') {
      // this.setState({ isLoading: true })
      localStorage.setItem(`${config.prefix}_dataBasket`, JSON.stringify(encryptor.encrypt(value)));
      // await this.getDataBasket();
      window.location.reload();
    }
  }

  render() {
    let { loadingShow, dataBasket, countryCode, isLoading, viewCart, storeDetail } = this.state
    let { isLoggedIn, product } = this.props
    if (product && storeDetail && !storeDetail.product) {
      storeDetail.product = product
      this.setState({ storeDetail })
    }
    return (
      <div className="col-full" style={{ marginTop: 80 }} id="cardItem">
        <div id="close-modal" />
        <div id="primary" className="content-area">
          <div className="stretch-full-width">
            <main id="main" className="site-main" style={{ textAlign: "center" }}>
              {
                loadingShow &&
                <Row>
                  <Col sm={6}>{this.viewShimmer()}</Col>
                  <Col sm={6}>{this.viewShimmer()}</Col>
                </Row>
              }
              {
                !loadingShow && !dataBasket &&
                <div>
                  <Lottie options={{ animationData: emptyGif }} style={{ height: 250 }} />
                  <div>Data is empty</div>
                </div>
              }
              {
                !loadingShow && dataBasket &&
                <div style={{ marginBottom: 250 }}>
                  {
                    viewCart &&
                    <ViewCartBasket
                      data={this.state}
                      dataBasket={dataBasket}
                      countryCode={countryCode}
                      isLoggedIn={isLoggedIn}
                      cancelSelectVoucher={() => this.cancelSelectVoucher()}
                      cancelSelectPoint={() => this.cancelSelectPoint()}
                      handleRedeemVoucher={() => this.handleRedeemVoucher()}
                      handleRedeemPoint={() => this.handleRedeemPoint()}
                      getCurrency={(price) => this.getCurrency(price)}
                      handleClear={(dataBasket) => this.handleClear(dataBasket)}
                      scrollPoint={(data) => this.scrollPoint(data)}
                      setPoint={(point) => this.setPoint(point)}
                      handleSettle={() => this.handleSettle()}
                      handleSubmit={() => this.handleSubmit()}
                      setOrderingMode={(mode) => this.setOrderingMode(mode)}
                      handleSetProvaider={(item) => this.handleSetProvaider(item)}
                      setViewCart={(status) => this.setViewCart(status)}
                      handleSetState={(field, value) => this.handleSetState(field, value)}
                    />
                  }
                  {
                    !viewCart &&
                    <ViewProsessBasket
                      data={this.state}
                      dataBasket={dataBasket}
                      countryCode={countryCode}
                      isLoggedIn={isLoggedIn}
                      getCurrency={(price) => this.getCurrency(price)}
                      setViewCart={(status) => this.setViewCart(status)}
                      handleCompletedOrdering={(status) => this.handleCompletedOrdering(status)}
                    />
                  }
                </div>
              }
            </main>
          </div>
        </div>
        <span data-toggle="modal" data-target="#detail-product-modal" id="open-modal-product" style={{ color: 'white' }}></span>
        {isLoading ? Swal.showLoading() : Swal.close()}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    account: state.auth.account && state.auth.account.idToken.payload,
    isLoggedIn: state.auth.isLoggedIn,
    product: state.masterdata.product,
    defaultOutlet: state.outlet.defaultOutlet,
    campaignPoint: state.campaign.data,
    myVoucher: state.customer.myVoucher
  };
};

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Basket);