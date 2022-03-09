import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';
import Shimmer from 'react-shimmer-effect';
import { OrderAction } from '../../redux/actions/OrderAction';
import { OutletAction } from '../../redux/actions/OutletAction';
// import { CustomerAction } from "../../redux/actions/CustomerAction";
// import { CampaignAction } from "../../redux/actions/CampaignAction";
import moment from 'moment';
import _ from 'lodash';
import Sound_Effect from '../../assets/sound/Sound_Effect.mp3';
import {
  isEmptyArray,
  isEmptyObject,
  isEmptyData,
} from '../../helpers/CheckEmpty';
import { StraightDistance } from '../../helpers/CalculateDistance';
import loadable from '@loadable/component';
import config from '../../config';

const ViewCartBasket = loadable(() => import('./viewCartBasket'));
const ViewProsessBasket = loadable(() => import('./viewProssessBasket'));

const Swal = require('sweetalert2');
const base64 = require('base-64');
const encryptor = require('simple-encryptor')(process.env.REACT_APP_KEY_DATA);

class Basket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingShow: true,
      isLoading: false,
      dataBasket: null,
      myVoucher: null,
      countryCode: 'SG',
      totalPoint: 0,
      campaignPointActive: {},
      campaignPointAnnouncement: false,
      detailPoint: null,
      discountVoucher: 0,
      newTotalPrice: '0',
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
      pointsToRebateRatio: '0:0',
      roundingOptions: 'INTEGER',
      xstep: 1,
      orderingMode: this.props.orderingMode,
      btnBasketOrder: true,
      play: false,
      deliveryProvaider: [],
      dataCVV: '',
      isEmenu: window.location.hostname.includes('emenu'),
      orderActionDate: this.props.orderActionDate,
      orderActionTime: this.props.orderActionTime,
      orderActionTimeSlot: this.props.orderActionTimeSlot,
      checkOperationalHours: {},
      orderingTime: [],

      orderingSetting: [],
      orderingTimeMinutes: {},
      orderingTimeHours: [],
      orderingTimeSlot: [],
      maxLoopingGetTimeSlot: 7,
      maxLoopingSetTimeSlot: 7,
      nextDayIsAvailable: null,
      isEditDate: false,
      timeSlot: [],
      latitude: 0,
      longitude: 0,
      timeslotData: [],
      selectedDeliveryProvider: {},
    };
    this.audio = new Audio(Sound_Effect);
  }

  viewShimmer = (isHeight = 100) => {
    return (
      <Shimmer>
        <div
          style={{
            width: '100%',
            height: isHeight,
            alignSelf: 'center',
            borderRadius: '8px',
            marginBottom: 10,
          }}
        />
      </Shimmer>
    );
  };

  componentDidMount = async () => {
    await this.checkOfflineCart();
    this.audio.addEventListener('ended', () => this.setState({ play: false }));

    let param = this.getUrlParameters();
    if (param && param['input']) {
      param = this.getUrlParameters(base64.decode(decodeURI(param['input'])));
      localStorage.setItem(
        `${config.prefix}_scanTable`,
        JSON.stringify(encryptor.encrypt(param))
      );
    }

    setInterval(() => {
      try {
        let widthSelected = document.getElementById('cardItem').clientWidth;
        if (widthSelected !== this.state.widthSelected) {
          this.setState({ widthSelected });
        }
      } catch (error) {}
    }, 0);
    await this.getDataBasket();
  };

  checkOrderingAvailibility = async (orderMode) => {
    try {
      let { dataBasket, orderingMode, storeDetail } = this.state;

      if (orderMode) orderingMode = orderMode;

      if (dataBasket && dataBasket.details) {
        for (let i = 0; i < dataBasket.details.length; i++) {
          let detail = dataBasket.details[i];
          let isAvailable = true;
          let text = config.checkNickName(orderingMode, storeDetail);
          if (
            orderingMode === 'DINEIN' &&
            detail.product &&
            detail.product.orderingAvaibility &&
            detail.product.orderingAvaibility.dineIn === false
          ) {
            isAvailable = false;
          }
          if (
            orderingMode === 'TAKEAWAY' &&
            detail.product &&
            detail.product.orderingAvaibility &&
            detail.product.orderingAvaibility.takeAway === false
          ) {
            isAvailable = false;
          }
          if (
            orderingMode === 'DELIVERY' &&
            detail.product &&
            detail.product.orderingAvaibility &&
            detail.product.orderingAvaibility.delivery === false
          ) {
            isAvailable = false;
          }
          if (
            orderingMode === 'STORECHECKOUT' &&
            detail.product &&
            detail.product.orderingAvaibility &&
            detail.product.orderingAvaibility.storeCheckOut === false
          ) {
            isAvailable = false;
          }
          if (
            orderingMode === 'STOREPICKUP' &&
            detail.product &&
            detail.product.orderingAvaibility &&
            detail.product.orderingAvaibility.storePickUp === false
          ) {
            isAvailable = false;
          }

          if (!isAvailable) {
            dataBasket.details[i].orderingStatus = 'UNAVAILABLE';
            dataBasket.details[i].orderModeName = text;
          }
        }
      }
      await this.setState({ dataBasket });
    } catch (e) {}
  };

  getGeolocation = async (storeDetail) => {
    let from = storeDetail.address || '-';
    from += '&sensor=false&key=AIzaSyC9KLjlHDwdfmp7AbzuW7B3PRe331RJIu4';
    let url = `https://maps.google.com/maps/api/geocode/json?address=${from}`;
    url = encodeURI(url);

    let response = await fetch(url);
    response = await response.json();

    try {
      await this.setState({
        latitude: response.results[0].geometry.location.lat,
        longitude: response.results[0].geometry.location.lng,
      });
    } catch (e) {}
  };

  getUrlParameters = (pageParamString = null) => {
    if (!pageParamString) pageParamString = window.location.href.split('?')[1];
    if (pageParamString) {
      var paramsArray = pageParamString.split('&');
      var paramsHash = {};

      for (var i = 0; i < paramsArray.length; i++) {
        var singleParam = paramsArray[i].split('=');
        paramsHash[singleParam[0]] = singleParam[1];
      }
      return paramsHash;
    }
  };

  checkOfflineCart = async () => {
    let { account } = this.props;
    try {
      let offlineCart = localStorage.getItem(`${config.prefix}_offlineCart`);
      offlineCart = JSON.parse(offlineCart);

      if (isEmptyObject(offlineCart)) return;
      await this.props.dispatch(OrderAction.deleteCart(true));
      if (account) {
        for (let i = 0; i < offlineCart.details.length; i++) {
          let product = {
            productID: offlineCart.details[i].productID,
            unitPrice: offlineCart.details[i].unitPrice,
            quantity: offlineCart.details[i].quantity,
          };

          if (
            offlineCart.details[i].remark !== undefined &&
            offlineCart.details[i].remark !== '-'
          ) {
            product.remark = offlineCart.details[i].remark;
          }

          if (!isEmptyArray(offlineCart.details[i].modifiers)) {
            product.modifiers = offlineCart.details[i].modifiers;
          }

          let payload = {
            outletID: offlineCart.outletID,
            details: [],
          };
          payload.details.push(product);
          await this.props.dispatch(OrderAction.addCart(payload));
        }
        localStorage.removeItem(`${config.prefix}_offlineCart`);
      }
    } catch (e) {}
  };

  loadLocalStorage = async () => {
    let locationCustomer = JSON.parse(
      localStorage.getItem(`${config.prefix}_locationCustomer`)
    );
    let selectedVoucher = encryptor.decrypt(
      JSON.parse(localStorage.getItem(`${config.prefix}_selectedVoucher`))
    );
    let selectedPoint = encryptor.decrypt(
      JSON.parse(localStorage.getItem(`${config.prefix}_selectedPoint`))
    );
    let scanTable = encryptor.decrypt(
      JSON.parse(localStorage.getItem(`${config.prefix}_scanTable`))
    );
    let infoCompany = encryptor.decrypt(
      JSON.parse(localStorage.getItem(`${config.prefix}_infoCompany`))
    );
    let selectedCard = encryptor.decrypt(
      JSON.parse(localStorage.getItem(`${config.prefix}_selectedCard`))
    );
    let dataBasket = encryptor.decrypt(
      JSON.parse(localStorage.getItem(`${config.prefix}_dataBasket`))
    );

    // if infoCompany is empty
    if (!infoCompany) {
      let time = setInterval(async () => {
        infoCompany = await encryptor.decrypt(
          JSON.parse(localStorage.getItem(`${config.prefix}_infoCompany`))
        );
        if (infoCompany) clearInterval(time);
      }, 0);
    } else {
      this.setState({ countryCode: infoCompany.countryCode });
    }

    // if databasket is empty
    if (!dataBasket) dataBasket = await this.getDataBasket_();
    // dataBasket = await this.getDataBasket_();

    return {
      locationCustomer,
      selectedVoucher,
      selectedPoint,
      scanTable,
      infoCompany,
      selectedCard,
      dataBasket,
    };
  };

  getDataBasket = async (isChangeMode = false, orderingMode = null) => {
    let { isLoggedIn } = this.props;
    await this.setState({ loadingShow: true });
    let {
      // selectedVoucher,
      selectedPoint,
      scanTable,
      infoCompany,
      selectedCard,
      dataBasket,
    } = await this.loadLocalStorage();
    let deliveryAddress = this.props.deliveryAddress;

    if (isLoggedIn) {
    } else if (!isLoggedIn && dataBasket) {
      dataBasket.orderingMode = orderingMode;
      let response = await this.props.dispatch(
        OrderAction.buildCart(dataBasket)
      );
      if (!response.message) dataBasket = response.data;
    }

    if (dataBasket && dataBasket.outlet !== undefined) {
      if (!orderingMode) orderingMode = this.state.orderingMode;
      dataBasket.orderingMode = orderingMode;
      const isOutletChanged = await localStorage.getItem(
        `${config.prefix}_isOutletChanged`
      );
      // move cart based on delivery address if ordering setting is nearest outlet
      if (this.props.outletSelection === 'NEAREST') {
        if (
          deliveryAddress &&
          orderingMode === 'DELIVERY' &&
          isOutletChanged !== 'true' &&
          this.props.outlets &&
          this.props.outlets.length > 1 &&
          dataBasket.provider &&
          dataBasket.provider.calculationMode !== 'FIX'
        ) {
          let payloadMoveCart = {
            orderBy: 'provider',
            cart: dataBasket,
            deliveryAddress,
          };
          const result = await this.props.dispatch(
            OrderAction.moveCart(payloadMoveCart)
          );
          if (!result.message) {
            dataBasket = result;
          } else {
            Swal.fire(
              'Oppss!',
              'Cannot find an outlet with available product(s) and delivery provider',
              'error'
            );
          }
        }
      }

      // set delivery provider
      if (
        orderingMode === 'DELIVERY' ||
        dataBasket.orderingMode === 'DELIVERY'
      ) {
        await this.setDeliveryProvider(
          deliveryAddress,
          orderingMode,
          dataBasket
        );
        dataBasket = await this.getDataBasket_();
        await localStorage.setItem(
          `${config.prefix}_dataBasket`,
          JSON.stringify(encryptor.encrypt(dataBasket))
        );
      }

      // set default outlet
      let storeDetail = await this.setDefaultOutlet(dataBasket);

      if (dataBasket.orderingMode) {
        dataBasket.orderingMode = orderingMode;
      }

      /* Flush selected delivery provider */
      if (orderingMode !== 'DELIVERY') {
        await this.setState({ selectedDeliveryProvider: {} });
      }

      if (isChangeMode) {
        const { selectedDeliveryProvider } = this.state;
        const provider = selectedDeliveryProvider;

        let surcharge = await this.props.dispatch(
          OrderAction.changeOrderingMode({ orderingMode, provider })
        );
        if (surcharge.resultCode === 200) {
          dataBasket = await this.getDataBasket_();
          await localStorage.setItem(
            `${config.prefix}_dataBasket`,
            JSON.stringify(encryptor.encrypt(dataBasket))
          );
        }
      }

      let checkOperationalHours = this.checkOperationalHours(storeDetail);

      await this.setState({
        dataBasket,
        storeDetail,
        scanTable,
        // totalPrice,
        checkOperationalHours,
        btnBasketOrder: checkOperationalHours.status,
        countryCode: infoCompany.countryCode,
      });

      this.getGeolocation(storeDetail);

      // check validate pick date time
      if (orderingMode !== 'DINEIN') {
        let check =
          this.state.orderActionDate === moment().format('YYYY-MM-DD');
        await this.checkPickUpDateTime(
          checkOperationalHours,
          this.state.orderActionDate,
          check
        );
      }
      // await this.submitOtomatis(dataBasket, scanTable);
      if (!checkOperationalHours.status) {
        let message = "Sorry, we're closed today!";
        Swal.fire('Oppss!', message, 'error');
      }
    } else {
      this.setState({
        dataBasket: null,
        storeDetail: null,
        scanTable: null,
        totalPrice: 0,
      });
    }

    await this.setState({ loadingShow: false });
    this.setState({
      // isLoading: false,
      selectedPoint,
      discountPoint: selectedPoint || 0,
      orderingMode,
      selectedCard,
      deliveryAddress,
    });
    await this.checkOrderingAvailibility();
  };

  getDataBasketPending = async (dataBasket) => {
    let response = await this.props.dispatch(
      OrderAction.getCartPending(dataBasket.id)
    );
    if (response.resultCode === 200) {
      localStorage.setItem(
        `${config.prefix}_dataBasket`,
        JSON.stringify(encryptor.encrypt(response.data))
      );
      this.setState({ dataBasket: response.data });
      return response.data;
    }
    return dataBasket;
  };

  setDefaultOutlet = async (dataBasket) => {
    let storeDetail = await this.props.dispatch(
      OutletAction.fetchSingleOutlet(dataBasket.outlet)
    );
    if (storeDetail && storeDetail.id) {
      storeDetail = config.getValidation(storeDetail);
    }
    return storeDetail;
  };

  setDeliveryProvider = async (deliveryAddress, orderingMode, dataBasket) => {
    let provaiderDelivery = null;
    let deliveryProvaider = [];

    if (
      deliveryAddress &&
      orderingMode !== 'DINEIN' &&
      orderingMode !== 'TAKEAWAY'
    ) {
      let payload = {
        outletId: dataBasket.outlet.id,
        cartID: dataBasket.cartID,
        deliveryAddress: deliveryAddress,
      };

      const isOutletChanged = await localStorage.getItem(
        `${config.prefix}_isOutletChanged`
      );
      const newOutletID = await localStorage.getItem(
        `${config.prefix}_outletChangedFromHeader`
      );
      if (isOutletChanged === 'true') {
        if (newOutletID !== undefined && newOutletID !== null)
          payload.outletId = newOutletID;
      }

      let response = await this.props.dispatch(
        OrderAction.getCalculateFee(payload)
      );

      deliveryProvaider = response.dataProvider;
      deliveryProvaider &&
        deliveryProvaider.forEach(async (provider) => {
          provider.deliveryFeeFloat = provider.deliveryFee;
          provider.deliveryFee = this.getCurrency(provider.deliveryFee);
        });

      if (deliveryProvaider && deliveryProvaider.length > 0) {
        provaiderDelivery = deliveryProvaider[0];
      }

      if (dataBasket.deliveryProviderId) {
        provaiderDelivery = deliveryProvaider.find((items) => {
          return items.id === dataBasket.deliveryProviderId;
        });
      }
      await this.handleSetProvaider(provaiderDelivery);
      await this.setState({ deliveryProvaider });
    }

    await this.props.dispatch({
      type: 'SET_DELIVERY_PROVIDERS',
      payload: deliveryProvaider,
    });

    return { deliveryProvaider, provaiderDelivery };
  };

  getDatesBetweenDates = (startDate, endDate, days = 0) => {
    let dates = [];
    const theDate = new Date(startDate);
    theDate.setDate(theDate.getDate() + 1);
    if (days === 0) {
      while (theDate < endDate) {
        dates = [...dates, new Date(theDate)];
        theDate.setDate(theDate.getDate() + 1);
      }
    } else {
      for (let i = 0; i < days; i++) {
        dates = [...dates, new Date(theDate)];
        theDate.setDate(theDate.getDate() + 1);
      }
    }
    return dates;
  };

  checkPickUpDateTime = async (
    checkOperationalHours,
    date,
    check,
    changeOrderingMode
  ) => {
    let {
      storeDetail,
      maxLoopingGetTimeSlot,
      maxLoopingSetTimeSlot,
      isEditDate,
      orderingMode,
      timeSlot,
    } = this.state;
    if (!storeDetail) return;

    let orderingModeField =
      orderingMode === 'DINEIN'
        ? 'dineIn'
        : orderingMode === 'DELIVERY'
        ? 'delivery'
        : 'takeAway';
    let { maxDays } = storeDetail.orderValidation[orderingModeField];
    if (!maxDays) maxDays = 90;

    let dateTime = new Date();
    let payload = {
      outletID: storeDetail.sortKey,
      clientTimezone: Math.abs(dateTime.getTimezoneOffset()),
      date: moment(dateTime).format('YYYY-MM-DD'),
      maxDays,
      orderingMode,
    };

    if (timeSlot.length === 0 || changeOrderingMode) {
      timeSlot = await this.props.dispatch(OrderAction.getTimeSlot(payload));

      if (timeSlot.resultCode === 200) {
        this.setState({ timeslotData: timeSlot.data });
        if (timeSlot.data.length === 0) return;
        timeSlot = timeSlot.data.filter((items) => {
          return items.timeSlot.filter((item) => {
            return item.isAvailable;
          });
        });
        let prevDates = new Date();
        prevDates.setDate(prevDates.getDate() - 1);
        const newTimeslot = timeSlot.map((slot) => {
          if (!prevDates) {
            prevDates = new Date(slot.date);
            return slot;
          }
          const dateBetween = this.getDatesBetweenDates(
            prevDates,
            new Date(slot.date)
          ).map((date) => ({
            date: moment(date).format('YYYY-MM-DD'),
            timeSlot: [],
          }));
          prevDates = new Date(slot.date);
          return [...dateBetween, slot];
        });
        const firstAvailableDate = newTimeslot
          .flat(2)
          .find((slot) => slot.timeSlot.length > 0);
        // console.log("newTimeslot :", newTimeslot.flat(2));
        if (firstAvailableDate)
          this.setState({ nextDayIsAvailable: firstAvailableDate.date });
        this.setState({ timeSlot: newTimeslot.flat(2) });
        timeSlot = newTimeslot.flat(2);
        if (
          !newTimeslot.flat(2).find((dateSlot) => {
            const dateTimeSlot = dateSlot.timeSlot.find(
              (slot) =>
                slot.time === this.state.orderActionTimeSlot && slot.isAvailable
            );
            if (dateSlot.date === this.state.orderActionDate && dateTimeSlot) {
              return true;
            }
            return false;
          })
        ) {
          this.setState({
            orderActionDate: moment().format('YYYY-MM-DD'),
            orderActionTime: moment().add(1, 'h').format('HH') + ':00',
            orderActionTimeSlot: null,
          });
          this.props.dispatch({ type: 'DELETE_ORDER_ACTION_TIME_SLOT' });
        }
      } else {
        this.setState({ timeslotData: timeSlot.data });
        maxLoopingSetTimeSlot = 0;
        timeSlot = [];
      }
    }
    if (date) {
      timeSlot = timeSlot.find((items) => {
        return items.date === date;
      });
    } else {
      timeSlot = timeSlot[0];
    }

    if (timeSlot) {
      date = timeSlot.date;
      timeSlot = timeSlot.timeSlot.filter((items) => {
        return items.isAvailable;
      });
    }

    if (timeSlot && timeSlot.length > 0) {
      this.setState({
        orderingTimeSlot: timeSlot,
        // orderActionTime: `${timeSlot[0].time.split(" - ")[0]}`,
        // orderActionTimeSlot: timeSlot[0].time,
        // orderActionDate: date,
        isEditDate: true,
      });
    } else {
      if (isEditDate) {
        console.log('isEditDate is true');
        for (let index = 0; index <= maxLoopingGetTimeSlot; index++) {
          let { dateDay, status } = this.getTimeSlotAvailable(date);
          if (status) break;
          date = dateDay;
        }
        console.log('Set orderActionTimeSlot to null...');
        this.setState({
          orderActionTimeSlot: null,
          orderingTimeSlot: [],
          orderActionTime: moment().add(1, 'h').format('HH') + ':00',
        });
      } else {
        if (maxLoopingSetTimeSlot > 0) {
          this.setState({ maxLoopingSetTimeSlot: maxLoopingSetTimeSlot - 1 });
          // date = moment(date).add(1, "d").format("YYYY-MM-DD");
          // this.checkPickUpDateTime(checkOperationalHours, date, check);
        } else {
          console.log('Set orderACtionTime...');
          this.setState({
            orderActionTimeSlot: null,
            orderingTimeSlot: [],
            orderActionTime: moment().add(1, 'h').format('HH') + ':00',
          });
        }
      }
    }
  };

  getTimeSlotAvailable = (dateDay) => {
    try {
      dateDay = moment(dateDay).add(1, 'd').format('YYYY-MM-DD');
      let timeSlot = this.state.timeSlot.find((items) => {
        return items.date === dateDay;
      });
      if (timeSlot) {
        timeSlot = timeSlot.timeSlot.filter((items) => {
          return items.isAvailable;
        });
      }
      if (timeSlot && timeSlot.length > 0) {
        this.setState({ nextDayIsAvailable: dateDay });
        return { dateDay, status: true };
      }
      return { dateDay, status: false };
    } catch (error) {}
  };

  componentDidUpdate() {
    if (
      this.props.orderingSetting &&
      this.props.orderingSetting.length > 0 &&
      this.state.orderingSetting.length === 0
    )
      this.setState({ orderingSetting: this.props.orderingSetting });

    if (
      this.props.campaignPoint &&
      this.props.campaignPoint.detailPoint &&
      !this.state.detailPoint
    )
      this.setState(this.props.campaignPoint);

    if (this.props.myVoucher && !this.state.myVoucher)
      this.setState({ myVoucher: this.props.myVoucher });
  }

  getDataBasket_ = async () => {
    let response = await this.props.dispatch(OrderAction.getCart());
    if (
      response &&
      response.data &&
      Object.keys(response.data).length > 0 &&
      !response.data.message &&
      response.data.status !== 'failed'
    ) {
      localStorage.setItem(
        `${config.prefix}_dataBasket`,
        JSON.stringify(encryptor.encrypt(response.data))
      );
      this.setState({ dataBasket: response.data });
      return response.data;
    }
  };

  checkOperationalHours = (storeDetail) => {
    if (!storeDetail.operationalHours) return { status: true };
    let operationalHours = storeDetail.operationalHours.filter(function (a) {
      return a.nameOfDay === moment().format('dddd');
    })[0];
    if (!operationalHours) return { status: false };

    let status = moment(moment().format('HH:mm'), 'HH:mm');
    let beforeTime = moment(operationalHours.open, 'HH:mm');
    let afterTime = moment(operationalHours.close, 'HH:mm');
    status = status.isBetween(beforeTime, afterTime);

    if (status) {
      let lastOrderOn = storeDetail.lastOrderOn ? storeDetail.lastOrderOn : 0;
      status = moment(moment().format('HH:mm'), 'HH:mm');
      beforeTime = moment(operationalHours.open, 'HH:mm');
      afterTime = moment(operationalHours.close, 'HH:mm').subtract(
        lastOrderOn,
        'minutes'
      );

      status = status.isBetween(beforeTime, afterTime);
    } else {
      status = true;
    }

    return { status: status, afterTime, beforeTime };
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
            let tanggal = moment().format().split('T')[0];
            let region = moment().format().split('+')[1];
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
                if (voucherType === 'discPercentage') {
                  discount =
                    Number(checkProduct.unitPrice) *
                    Number(checkProduct.quantity) *
                    (Number(voucherValue) / 100);
                } else {
                  discount = voucherValue;
                }
                this.setState({
                  discountVoucher: discount,
                  statusSelectedVoucher: true,
                  selectedVoucher,
                });
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
          if (voucherType === 'discPercentage') {
            discount =
              Number(dataBasket.totalNettAmount) * (Number(voucherValue) / 100);
          } else {
            discount = voucherValue;
          }
          this.setState({
            discountVoucher: discount,
            statusSelectedVoucher: true,
            selectedVoucher,
          });
        }
      } else {
        this.setRemoveVoucher('Voucher be used this outlet!');
      }
    }
  };

  setRemoveVoucher = (message) => {
    localStorage.removeItem(`${config.prefix}_selectedVoucher`);
    this.setState({ statusSelectedVoucher: false, selectedVoucher: null });
    Swal.fire('Oppss!', message, 'error');
  };

  getCurrency = (price) => {
    if (this.props.companyInfo) {
      if (price !== undefined) {
        const { currency } = this.props.companyInfo;
        if (!price || price === '-') price = 0;
        let result = price.toLocaleString(currency.locale, {
          style: 'currency',
          currency: currency.code,
        });
        return result;
      }
    }
    return price;
  };

  cancelSelectVoucher = async () => {
    this.setState({
      discountVoucher: 0,
      newTotalPrice: '0',
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
      newTotalPrice: '0',
      isLoading: true,
    });
    localStorage.removeItem(`${config.prefix}_selectedPoint`);
    await this.getDataBasket();
  };

  handleRedeemVoucher = async () => {
    this.setState({ discountPoint: 0 });
    localStorage.removeItem(`${config.prefix}_selectedPoint`);
    this.props.history.push('/myVoucher');
  };

  handleRedeemPoint = async () => {
    localStorage.removeItem(`${config.prefix}_selectedVoucher`);
    let selectedPoint = this.state.selectedPoint;
    let totalPoint = this.state.totalPoint;
    let pointsToRebateRatio = this.state.pointsToRebateRatio;
    let needPoint = this.calculateSelectedPoint(selectedPoint, 'selectedPoint');

    if (selectedPoint <= 0) {
      selectedPoint = this.calculateSelectedPoint(
        selectedPoint,
        'selectedPoint'
      );
    } else if (selectedPoint > totalPoint) {
      selectedPoint = this.calculateSelectedPoint(totalPoint, 'allIn');
    } else if (
      pointsToRebateRatio.split(':')[0] &&
      pointsToRebateRatio.split(':')[1] === '0'
    ) {
      selectedPoint = 0;
    }

    let textRasio = `Redeem ${
      pointsToRebateRatio.split(':')[0]
    } point to ${this.getCurrency(
      parseInt(pointsToRebateRatio.split(':')[1])
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

    if (type === 'selectedPoint') {
      selectedPoint =
        (dataBasket.totalNettAmount / pointsToRebateRatio.split(':')[1]) *
        pointsToRebateRatio.split(':')[0];
    }

    if (detailPoint.roundingOptions === 'DECIMAL') {
      return parseFloat(selectedPoint.toFixed(2));
    } else {
      if (type === 'allin') return Math.floor(selectedPoint);
      else return Math.ceil(selectedPoint);
    }
  };

  setOrderingMode = async (orderingMode) => {
    const oldOrderingMode = this.state.orderingMode;
    await this.setState({ loadingShow: true });
    if (oldOrderingMode !== orderingMode) {
      await this.setState({ orderActionTimeSlot: null });
    }

    await this.props.dispatch({
      type: 'SET_ORDERING_MODE',
      payload: orderingMode,
    });

    if (
      orderingMode !== '' &&
      orderingMode !== undefined &&
      orderingMode !== null
    ) {
      const payload = {
        orderingMode: orderingMode,
      };
      await this.props.dispatch(OrderAction.updateCartInfo(payload));
    }

    await this.setState({
      orderingMode,
      isLoading: true,
      provaiderDelivery: null,
    });
    await this.getDataBasket(true, orderingMode);

    let orderActionDate = moment().format('YYYY-MM-DD');
    await this.setState({
      isLoading: false,
      orderActionDate,
      isEditDate: false,
    });
    await this.checkPickUpDateTime(
      this.state.checkOperationalHours,
      orderActionDate,
      true,
      true
    );
    await this.checkOrderingAvailibility(orderingMode);
  };

  setPoint = (point, dataBasket = null, pointsToRebateRatio) => {
    if (!dataBasket) dataBasket = this.state.dataBasket;
    if (!pointsToRebateRatio)
      pointsToRebateRatio = this.state.pointsToRebateRatio;
    let totalPrice =
      (point / pointsToRebateRatio.split(':')[0]) *
      pointsToRebateRatio.split(':')[1];
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

  handleClear = async (dataBasket = null) => {
    Swal.fire({
      title: 'Want to clear data?',
      text: 'You will clear data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then(async (result) => {
      if (result.value) {
        Swal.fire({
          onOpen: () => {
            Swal.showLoading();
          },
        });
        if (dataBasket) {
          let selected = _.filter(dataBasket.details, (items) => {
            return items.selected;
          });
          if (dataBasket.details.length === selected.length) {
            await localStorage.removeItem(`${config.prefix}_isOutletChanged`);
            await localStorage.removeItem(
              `${config.prefix}_outletChangedFromHeader`
            );
            await this.props.dispatch(OrderAction.deleteCart());
          } else {
            let payload = [];
            for (let index = 0; index < selected.length; index++) {
              let items = selected[index];
              if (items.selected !== false) {
                items.quantity = 0;
              }
              payload.push(items);
            }
            await this.props.dispatch(
              OrderAction.processUpdateCart(dataBasket, payload)
            );
            localStorage.removeItem(`${config.prefix}_dataBasket`);
            // window.location.reload();
          }
        } else {
          await localStorage.removeItem(`${config.prefix}_isOutletChanged`);
          await this.props.dispatch(OrderAction.deleteCart());
        }
        Swal.close();
        await this.getDataBasket();
      }
    });
  };

  handleOpenLogin() {
    let { isLoggedIn } = this.props;
    if (!isLoggedIn) {
      document.getElementById('login-register-btn').click();
      return false;
    }
    return true;
  }

  handleSettle = async () => {
    let { selectedCard, dataBasket } = this.state;
    const { defaultOutlet } = this.props;
    const orderPreparationTime =
      defaultOutlet.timeSlots &&
      defaultOutlet.timeSlots[0] &&
      defaultOutlet.timeSlots[0].defaultPreparationTime
        ? defaultOutlet.timeSlots[0].defaultPreparationTime
        : 0;
    if (!this.handleOpenLogin()) return;

    // check if there are unavailable product on the cart
    if (dataBasket) {
      const find = dataBasket.details.find(
        (item) => item.orderingStatus === 'UNAVAILABLE'
      );

      if (find) {
        Swal.fire({
          title: 'Sorry',
          text: 'There are items that are not available to order on your cart.',
          icon: 'warning',
        });
        return false;
      }
    }

    if (selectedCard) {
      let userInput = selectedCard.details.userInput;
      if (userInput.length > 0) {
        let needCVV = userInput.find((items) => {
          return items.name === 'cardCVV' && items.required;
        });

        if (Object.keys(needCVV).length !== 0) {
          console.log('need cvv');
          return;
        }
      }
    }

    let {
      storeDetail,
      orderingMode,
      timeSlot,
      orderActionDate,
      orderActionTime,
    } = this.state;
    if (!storeDetail) return;

    /*
      Validate delivery provider mode & maximum distance
    */
    if (orderingMode === 'DELIVERY') {
      if (this.state.provaiderDelivery) {
        if (this.state.provaiderDelivery.calculationMode === 'DISTANCE') {
          if (
            isEmptyObject(this.props.deliveryAddress.coordinate) ||
            isEmptyData(this.props.deliveryAddress.coordinate.latitude)
          ) {
            Swal.fire({
              title: 'Delivery Address Coordinate',
              text: 'Please pick the coordinate of your delivery address.',
              icon: 'warning',
              confirmButtonText: `Got it`,
            }).then(() => {
              this.props.history.push('/delivery-address');
            });
            return false;
          }

          // calculate distance to outlet
          const coordinate = {
            latitude: this.state.latitude,
            longitude: this.state.longitude,
          };
          const distance = await StraightDistance(
            storeDetail,
            this.props.deliveryAddress.coordinate,
            coordinate
          );
          console.log(distance, 'distance');
          if (distance > Number(this.state.provaiderDelivery.maximumCoverage)) {
            Swal.fire({
              title: `Maximum delivery coverage is ${this.state.provaiderDelivery.maximumCoverage} km`,
              text: 'Your delivery address exceeds our maximum shipping limits.',
              icon: 'warning',
              confirmButtonText: `Got it`,
            });
            return false;
          }
        }
      }
    }

    let orderingModeField =
      orderingMode === 'DINEIN'
        ? 'dineIn'
        : orderingMode === 'DELIVERY'
        ? 'delivery'
        : 'takeAway';
    let { maxDays } = storeDetail.orderValidation[orderingModeField];
    if (!maxDays) maxDays = 90;

    let dateTime = new Date();
    let payload = {
      outletID: storeDetail.sortKey,
      clientTimezone: Math.abs(dateTime.getTimezoneOffset()),
      date: moment(dateTime).format('YYYY-MM-DD'),
      maxDays,
      orderingMode,
    };
    const nowDateObj = new Date(
      `${moment(dateTime).format('YYYY-MM-DD')} 00:00`
    );
    const orderActionDateObj = new Date(`${orderActionDate} 00:00`);

    timeSlot = await this.props.dispatch(OrderAction.getTimeSlot(payload));
    if (timeSlot.resultCode === 200) {
      timeSlot = timeSlot.data.filter((items) => {
        return items.timeSlot.filter((item) => {
          return item.isAvailable;
        });
      });
      const selectedTimeSlot = timeSlot.find(
        (slot) => slot.date === orderActionDate
      );
      if (selectedTimeSlot) {
        const minutesNow = new Date().getHours() * 60 + new Date().getMinutes();
        const minutesTimeSlot =
          new Date(`1970-01-01 ${orderActionTime}`).getHours() * 60 +
          new Date(`1970-01-01 ${orderActionTime}`).getMinutes();
        const difference = minutesTimeSlot - minutesNow;
        if (
          nowDateObj.getTime() === orderActionDateObj.getTime() &&
          difference < orderPreparationTime
        ) {
          Swal.fire('Oppss!', 'Time Slot is not available', 'error');
          return;
        }
      } else {
        Swal.fire('Oppss!', 'Time Slot date is not available', 'error');
        return;
      }
    }

    this.submitSettle();
  };

  submitSettle = async (need = null) => {
    localStorage.setItem(
      `${config.prefix}_dataSettle`,
      JSON.stringify(encryptor.encrypt(this.state))
    );
    this.props.history.push('/payment');
  };

  handleSubmit = async () => {
    let { orderingMode, storeDetail, scanTable, dataBasket, orderingSetting } =
      this.state;
    let { isLoggedIn } = this.props;
    if (!isLoggedIn) {
      document.getElementById('login-register-btn').click();
      return;
    }

    if (this.checkScan()) return this.props.history.push('/scanTable');
    else if (orderingMode === 'TAKEAWAY') {
      this.setState({ isLoading: true });
      let isNeedConfirmation = false;
      let enableAutoConfirmation = orderingSetting.find((items) => {
        return items.settingKey === 'EnableAutoConfirmation';
      });
      if (enableAutoConfirmation) {
        isNeedConfirmation = enableAutoConfirmation.settingValue || false;
      }

      let payload = {
        tableNo: scanTable.tableNo || scanTable.table,
        orderingMode: orderingMode,
        partitionKey: this.props.basket.partitionKey,
        sortKey: this.props.basket.sortKey,
        isNeedConfirmation,
      };

      let response;
      if (storeDetail.outletType === 'QUICKSERVICE') {
        response = await this.props.dispatch(
          OrderAction.submitTakeAway(payload)
        );
      } else {
        response = await this.props.dispatch(
          OrderAction.submitOrdering(payload)
        );
      }

      if (response && response.resultCode === 400) {
        Swal.fire(
          'Oppss!',
          response.message || response.data.message || 'Submit error!',
          'error'
        );
        this.setState({ isLoading: false });
      }

      this.waitingConfirm = setInterval(() => {
        if (dataBasket.status === 'CONFIRMED') {
          setTimeout(async () => {
            this.togglePlay();
            this.setState({ isLoading: false });
          }, 3000);
          clearInterval(this.waitingConfirm);
        }
      }, 1000);
    } else if (orderingMode === 'DINEIN') {
      scanTable.scan = true;
      this.submitOtomatis(dataBasket, scanTable);
    }
  };

  submitOtomatis = async (dataBasket, scanTable = null) => {
    let { orderingMode, storeDetail, orderingSetting } = this.state;
    if (!scanTable) scanTable = this.state.scanTable;
    if (
      dataBasket &&
      dataBasket.status === 'PENDING' &&
      scanTable &&
      scanTable.scan &&
      storeDetail &&
      storeDetail.outletType !== 'QUICKSERVICE'
    ) {
      let isNeedConfirmation = false;
      let enableAutoConfirmation = orderingSetting.find((items) => {
        return items.settingKey === 'EnableAutoConfirmation';
      });
      if (enableAutoConfirmation) {
        isNeedConfirmation = enableAutoConfirmation.settingValue || false;
      }

      let payload = {
        tableNo: scanTable.tableNo || scanTable.table,
        orderingMode: orderingMode,
        isNeedConfirmation,
      };

      if (!payload.tableNo) return this.props.history.push('/scanTable');

      let response = await this.props.dispatch(
        OrderAction.submitBasket(payload)
      );

      if (response && response.resultCode === 200) {
        dataBasket = response.data;
        this.setState({ dataBasket });
        localStorage.removeItem(`${config.prefix}_dataBasket`);
        response = await this.props.dispatch(
          OrderAction.setData({}, 'DATA_BASKET')
        );
        this.setState({ isLoading: false });
        localStorage.setItem(
          `${config.prefix}_dataSettle`,
          JSON.stringify(encryptor.encrypt(this.state))
        );

        if (dataBasket.status === 'SUBMITTED') {
          this.props.history.push('/history');
        } else if (
          dataBasket.outlet.outletType === 'RESTO' &&
          dataBasket.orderingMode === 'DINEIN'
        ) {
          Swal.fire(
            'Order Submitted',
            'Your order has been submitted',
            'success'
          ).then((result) => {
            if (result.isConfirmed || result.isDismissed) {
              this.props.history.push('/history');
            }
          });
        } else {
          this.props.history.push('/payment');
        }
      } else {
        Swal.fire(
          'Oppss!',
          response.message || response.data.message || 'Submit error!',
          'error'
        );
        localStorage.removeItem(`${config.prefix}_scanTable`);
        this.setState({ scanTable: null });
        this.props.history.push('/scanTable');
      }

      this.setState({ isLoading: false });
    } else if (
      scanTable &&
      scanTable.scan &&
      storeDetail.outletType === 'QUICKSERVICE'
    ) {
      this.setState({ settle: true });
    }
  };

  checkScan = () => {
    let { orderingMode, storeDetail, scanTable } = this.state;
    if (
      orderingMode === 'DINEIN' &&
      storeDetail.outletType === 'RESTO' &&
      (!scanTable || (scanTable && !scanTable.tableNo && !scanTable.table))
    ) {
      return true;
    } else if (
      orderingMode === 'DINEIN' &&
      storeDetail.outletType === 'QUICKSERVICE' &&
      storeDetail.enableTableScan !== false &&
      storeDetail.enableDineIn !== false &&
      (!scanTable || (scanTable && !scanTable.tableNo && !scanTable.table))
    ) {
      return true;
    }
    return false;
  };

  togglePlay = () => {
    this.setState({ play: !this.state.play }, () => {
      this.state.play ? this.audio.play() : this.audio.pause();
    });
  };

  handleSetProvaider = async (data) => {
    let { orderingMode, provaiderDelivery } = this.state;
    this.setState({ provaiderDelivery: data });

    await this.props.dispatch({
      type: 'SET_SELECTED_DELIVERY_PROVIDERS',
      payload: data,
    });

    this.state.deliveryProvaider.forEach((provider) => {
      if (provider.id === data.id) provider.default = true;
      else delete provider.default;
    });

    if (!provaiderDelivery) {
      let provider = { ...data, deliveryFee: data.deliveryFeeFloat };

      let dataBasket = await this.props.dispatch(
        OrderAction.changeOrderingMode({ orderingMode, provider })
      );
      if (dataBasket.resultCode === 200) {
        await this.setState({ selectedDeliveryProvider: provider });
        console.log('Calling getDateBasket from handleSetProvaider');
        // await this.getDataBasket();
      }
    }
  };

  setViewCart = async (status = null) => {
    this.setState({ viewCart: status, viewCartStatus: false });
  };

  handleCompletedOrdering = (status) => {
    Swal.fire({
      title: 'Received your order?',
      text: 'You hereby receive your order.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then(async (result) => {
      if (result.value) {
        try {
          this.setState({ isLoading: true });
          await this.props.dispatch(
            OrderAction.cartUpdate({ id: this.state.dataBasket.cartID, status })
          );
        } catch (error) {
          // console.log(error);
        }
      }
    });
  };

  handleSetState = async (field, value) => {
    this.setState({ [field]: value });
    if (field === 'dataBasket') {
      localStorage.setItem(
        `${config.prefix}_dataBasket`,
        JSON.stringify(encryptor.encrypt(value))
      );
      // window.location.reload();
    } else if (field === 'orderActionDate') {
      let check = value === moment().format('YYYY-MM-DD');
      this.props.dispatch({ type: 'SET_ORDER_ACTION_DATE', payload: value });
      if (
        this.state.timeSlot.length > 0 &&
        (this.state.timeSlot[this.state.timeSlot.length - 1].date === value ||
          this.state.timeSlot[this.state.timeSlot.length - 2].date === value ||
          this.state.timeSlot[this.state.timeSlot.length - 3].date === value ||
          this.state.timeSlot[this.state.timeSlot.length - 4].date === value)
      ) {
        const dates = this.getDatesBetweenDates(
          new Date(this.state.timeSlot[this.state.timeSlot.length - 1].date),
          new Date(this.state.timeSlot[this.state.timeSlot.length - 1].date),
          5
        ).map((date) => ({
          date: moment(date).format('YYYY-MM-DD'),
          timeSlot: [],
        }));
        this.setState((prevState) => ({
          timeSlot: [...prevState.timeSlot, ...dates],
        }));
      }
      await this.checkPickUpDateTime(
        this.state.checkOperationalHours,
        value,
        check
      );
    } else if (field === 'orderActionTimeHours') {
      let orderingTimeHours = this.state.orderingTimeHours;
      orderingTimeHours.forEach((item, index) => {
        if (Number(item) === Number(value)) {
          let orderActionTimeSlot = `${item}:00 - ${
            orderingTimeHours[index + 1] || item + 1
          }:00`;
          this.setState({ orderActionTimeSlot });
          return;
        }
      });
    } else if (field === 'orderActionTime') {
      this.props.dispatch({ type: 'SET_ORDER_ACTION_TIME', payload: value });
    } else if (field === 'orderActionTimeSlot') {
      this.props.dispatch({
        type: 'SET_ORDER_ACTION_TIME_SLOT',
        payload: value,
      });
    }
  };

  updateCartInfo = async (remark) => {
    const payload = {
      remark,
    };
    await this.props.dispatch(OrderAction.updateCartInfo(payload));
    await this.getDataBasket();
  };

  render() {
    let { loadingShow, dataBasket, countryCode, viewCart, storeDetail } =
      this.state;
    let { isLoggedIn, product } = this.props;
    if (product && storeDetail && !storeDetail.product) {
      storeDetail.product = product;
      this.setState({ storeDetail });
    }
    return (
      <div
        className='col-full'
        style={{ marginTop: config.prefix === 'emenu' ? 60 : 100 }}
        id='cardItem'
      >
        <div id='close-modal' />
        <div id='primary' className='content-area'>
          <div className='stretch-full-width'>
            <main
              id='main'
              className='site-main'
              style={{ textAlign: 'center' }}
            >
              {loadingShow && (
                <Row>
                  <Col sm={6}>{this.viewShimmer()}</Col>
                  <Col sm={6}>{this.viewShimmer()}</Col>
                </Row>
              )}

              {!loadingShow && !dataBasket && !this.props.basket.details && (
                <div>
                  <img
                    src={config.url_emptyImage}
                    alt='is empty'
                    style={{ marginTop: 30 }}
                  />
                  <div>Data is empty</div>
                </div>
              )}

              {!loadingShow &&
                (!isEmptyObject(dataBasket) || this.props.basket.details) && (
                  <div style={{ marginBottom: 250 }}>
                    {viewCart && (
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
                        handleClear={(dataBasket) =>
                          this.handleClear(dataBasket)
                        }
                        handleRemoveItem={(dataBasket, key) =>
                          this.handleRemoveItem(dataBasket, key)
                        }
                        scrollPoint={(data) => this.scrollPoint(data)}
                        setPoint={(point) => this.setPoint(point)}
                        handleSettle={() => this.handleSettle()}
                        handleSubmit={() => this.handleSubmit()}
                        setOrderingMode={(mode) => this.setOrderingMode(mode)}
                        handleSetProvaider={(item) =>
                          this.handleSetProvaider(item)
                        }
                        setViewCart={(status) => this.setViewCart(status)}
                        handleSetState={(field, value) => {
                          this.handleSetState(field, value);
                        }}
                        handleOpenLogin={() => this.handleOpenLogin()}
                        updateCartInfo={this.updateCartInfo}
                        timeslotData={this.state.timeslotData}
                      />
                    )}
                    {!viewCart && (
                      <ViewProsessBasket
                        data={this.state}
                        dataBasket={dataBasket}
                        countryCode={countryCode}
                        isLoggedIn={isLoggedIn}
                        getCurrency={(price) => this.getCurrency(price)}
                        setViewCart={(status) => this.setViewCart(status)}
                        handleCompletedOrdering={(status) =>
                          this.handleCompletedOrdering(status)
                        }
                      />
                    )}
                  </div>
                )}
            </main>
          </div>
        </div>
        <span
          data-toggle='modal'
          data-target='#detail-product-modal'
          id='open-modal-product'
          style={{ color: 'white' }}
        ></span>
        {/* {isLoading ? Swal.showLoading() : Swal.close()} */}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    account: state.auth.account && state.auth.account.idToken.payload,
    outletSelection: state.order.outletSelection,
    isLoggedIn: state.auth.isLoggedIn,
    product: state.masterdata.product,
    defaultOutlet: state.outlet.defaultOutlet,
    outlets: state.outlet.outlets,
    campaignPoint: state.campaign.data,
    myVoucher: state.customer.myVoucher,
    companyInfo: state.masterdata.companyInfo.data,
    basket: state.order.basket,
    deliveryAddress: state.order.deliveryAddress,
    orderingSetting: state.order.setting,
    orderingMode: state.order.orderingMode,
    orderActionDate: state.order.orderActionDate,
    orderActionTime: state.order.orderActionTime,
    orderActionTimeSlot: state.order.orderActionTimeSlot,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Basket);
