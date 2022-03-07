import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';
import Shimmer from 'react-shimmer-effect';
import config from '../../config';
import { OrderAction } from '../../redux/actions/OrderAction';
import { MasterdataAction } from '../../redux/actions/MasterDataAction';
import ViewCartBasket from './viewCartBasket';
import ViewProsessBasket from './viewProssessBasket';
import moment from 'moment';
import _ from 'lodash';
import Sound_Effect from '../../assets/sound/Sound_Effect.mp3';
import { isEmptyArray, isEmptyObject } from '../../helpers/CheckEmpty';
import ModalInfoTransfer from '../payment/ModalInfoTransfer';
const Swal = require('sweetalert2');
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
      orderingMode: 'DELIVERY',
      btnBasketOrder: true,
      play: false,
      deliveryProvaider: [],
      dataCVV: '',
      orderActionDate: moment().format('YYYY-MM-DD'),
      orderActionTime: moment().format('HH') + ':00',
      checkOperationalHours: {},
      orderingTime: [],
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
    } else {
      // localStorage.removeItem(`${config.prefix}_scanTable`);
    }

    setInterval(() => {
      try {
        let widthSelected = document.getElementById('cardItem').clientWidth;
        if (widthSelected !== this.state.widthSelected) {
          this.setState({ widthSelected });
        }
      } catch (error) {}
    }, 0);
    this.getDataBasket();
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
            unitPrice: offlineCart.details[i].retailPrice,
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

  getDataBasket = async () => {
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
    let deliveryAddress = encryptor.decrypt(
      JSON.parse(localStorage.getItem(`${config.prefix}_deliveryAddress`))
    );
    let dataBasket = encryptor.decrypt(
      JSON.parse(localStorage.getItem(`${config.prefix}_dataBasket`))
    );

    await this.checkViewCart(dataBasket);

    if (!infoCompany) {
      let time = setInterval(() => {
        infoCompany = encryptor.decrypt(
          JSON.parse(localStorage.getItem(`${config.prefix}_infoCompany`))
        );
        if (infoCompany) clearInterval(time);
      }, 0);
    } else {
      this.setState({ countryCode: infoCompany.countryCode });
    }

    if (dataBasket.confirmationInfo && dataBasket.confirmationInfo.voucher) {
      selectedVoucher = dataBasket.confirmationInfo.voucher;
      localStorage.setItem(
        `${config.prefix}_selectedVoucher`,
        JSON.stringify(encryptor.encrypt(selectedVoucher))
      );
    } else if (
      dataBasket.confirmationInfo &&
      dataBasket.confirmationInfo.redeemPoint > 0
    ) {
      selectedPoint = this.setPoint(
        dataBasket.confirmationInfo.redeemPoint,
        dataBasket,
        dataBasket.confirmationInfo.pointsToRebateRatio
      );
    }

    let storeDetail = null;
    if (
      !isEmptyObject(this.props.defaultOutlet) &&
      this.props.defaultOutlet.product
    ) {
      storeDetail = this.props.defaultOutlet;
    } else {
      storeDetail = await this.props.dispatch(
        MasterdataAction.getOutletByID(dataBasket.outlet.id)
      );
    }

    await this.getStatusVoucher(selectedVoucher, storeDetail, dataBasket);
    let discount = (selectedPoint || 0) + this.state.discountVoucher;
    let totalPrice =
      dataBasket.totalNettAmount - discount < 0
        ? 0
        : dataBasket.totalNettAmount - discount;

    let orderingMode = dataBasket.orderingMode;
    scanTable = {
      ...scanTable,
      tableType: dataBasket.orderingMode,
      tableNo: dataBasket.tableNo,
      outlet: dataBasket.outletID,
    };

    let deliveryProvaider = await this.props.dispatch(
      OrderAction.getProvider()
    );
    let provaiderDelivery = {};
    if (dataBasket.deliveryProviderId) {
      provaiderDelivery = deliveryProvaider.find((items) => {
        return items.id === dataBasket.deliveryProviderId;
      });
      this.setState({ provaiderDelivery });
    }

    if (dataBasket.orderActionDate)
      this.setState({ orderActionDate: dataBasket.orderActionDate });
    if (dataBasket.orderActionTime)
      this.setState({ orderActionTime: dataBasket.orderActionTime });

    let checkOperationalHours = this.checkOperationalHours(storeDetail);
    this.setState({
      dataBasket,
      storeDetail,
      scanTable,
      totalPrice,
      checkOperationalHours,
      btnBasketOrder: checkOperationalHours.status,
      countryCode: infoCompany.countryCode,
    });

    // if (dataBasket.id) dataBasket = await this.getDataBasketPending(dataBasket.id, dataBasket.status);
    if (deliveryProvaider && deliveryProvaider.length > 0 && deliveryAddress) {
      let payload = {
        outletId: dataBasket.outlet.id,
        cartID: dataBasket.cartID,
        deliveryAddress: deliveryAddress,
      };

      let response = await this.props.dispatch(
        OrderAction.getCalculateFee(payload)
      );
      if (!response.dataProvider) return;

      deliveryProvaider = response.dataProvider;
      deliveryProvaider.forEach(async (provider) => {
        provider.deliveryFeeFloat = provider.deliveryFee;
        provider.deliveryFee = this.getCurrency(provider.deliveryFee);
      });

      await this.props.dispatch({
        type: 'SET_DELIVERY_PROVIDERS',
        payload: deliveryProvaider,
      });

      provaiderDelivery = deliveryProvaider.find((items) => {
        return items.id === provaiderDelivery.id;
      });
      this.setState({ deliveryProvaider, provaiderDelivery });
    }

    this.setState({
      loadingShow: false,
      selectedPoint,
      discountPoint: selectedPoint || 0,
      orderingMode,
      selectedCard,
      deliveryAddress,
    });
  };

  checkViewCart = (dataBasket) => {
    let { viewCartStatus } = this.state;
    if (
      viewCartStatus &&
      (dataBasket.status === 'PROCESSING' ||
        dataBasket.status === 'READY_FOR_COLLECTION' ||
        dataBasket.status === 'READY_FOR_DELIVERY' ||
        dataBasket.status === 'ON_THE_WAY')
    ) {
      this.setState({ viewCart: false });
    }
  };

  getDataBasketPending = async (id, status) => {
    let response = await this.props.dispatch(OrderAction.getCartPending(id));
    if (response.resultCode === 200) {
      localStorage.setItem(
        `${config.prefix}_dataBasket`,
        JSON.stringify(encryptor.encrypt(response.data))
      );
      this.checkViewCart(response.data);
      this.setState({ dataBasket: response.data });
      return response.data;
    } else {
      response = await this.props.dispatch(OrderAction.getCartCompleted(id));
      if (
        response.data &&
        response.data.status &&
        response.data.status === 'COMPLETED'
      ) {
        Swal.fire(
          'Congratulations!',
          'Your order has been completed.',
          'success'
        );
      } else if (
        response.data &&
        response.data.status &&
        response.data.status === 'CANCELLED'
      ) {
        Swal.fire(
          'Oppss!',
          `Your order has been ${response.data.status}.`,
          'error'
        );
      } else {
        Swal.fire(
          'Oppss!',
          `Your order has been ${response.data.status || 'REFUND'}.`,
          'error'
        );
      }
      setTimeout(() => {
        this.props.history.push('/history');
        localStorage.removeItem(`${config.prefix}_dataBasket`);
      }, 3000);
      return response.data;
    }
  };

  checkOperationalHours = (storeDetail) => {
    let operationalHours = {};
    if (storeDetail.operationalHours !== undefined) {
      operationalHours = storeDetail.operationalHours.filter(function (a) {
        return a.nameOfDay === moment().format('dddd');
      })[0];
    }

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

    point =
      (point * pointsToRebateRatio.split(':')[1]) /
      pointsToRebateRatio.split(':')[0];

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
  };

  cancelSelectVoucher = async () => {};

  cancelSelectPoint = async () => {};

  handleRedeemVoucher = async () => {};

  handleRedeemPoint = async () => {};

  scrollPoint = (data) => {};

  setOrderingMode = async (orderingMode) => {};

  handleClear = async (dataBasket = null) => {};

  handleSettle = async () => {};

  handleSubmit = async () => {};

  handleSetProvaider = async (data) => {
    this.setState({ provaiderDelivery: data });
    this.state.deliveryProvaider.forEach((provider) => {
      if (provider.id === data.id) provider.default = true;
      else delete provider.default;
    });
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
          let response = await this.props.dispatch(
            OrderAction.cartUpdate({ id: this.state.dataBasket.cartID, status })
          );
          if (response.resultCode === 200) {
            Swal.fire(
              'Congratulations!',
              'Your order has been completed.',
              'success'
            );
          } else {
            Swal.fire(
              'Oppss!',
              response.data.message ||
                response.message ||
                'Your order has been filed',
              'error'
            );
          }
          setTimeout(() => {
            this.props.history.push('/history');
          }, 2000);
        } catch (error) {
          console.log(error);
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
      window.location.reload();
    }
  };

  isManualTransfer = (dataBasket) => {
    try {
      const data = dataBasket.payments.find(
        (x) => x.paymentID === 'MANUAL_TRANSFER'
      );
      if (data) return true;
      return false;
    } catch (e) {
      return false;
    }
  };

  render() {
    let { loadingShow, dataBasket, countryCode, viewCart, storeDetail } =
      this.state;
    let { isLoggedIn, product, setting } = this.props;
    if (product && storeDetail && !storeDetail.product) {
      storeDetail.product = product;
      this.setState({ storeDetail });
    }

    let selectedCard = {};
    let paymentAmount = 0;
    try {
      let desc = dataBasket.payments.find(
        (x) => x.paymentID === 'MANUAL_TRANSFER'
      );
      const paymentAmountFromCart = dataBasket.payments.find(
        (x) => x.description
      ).paymentAmount;
      if (desc) {
        paymentAmount = paymentAmountFromCart;
        selectedCard = desc;
      }
    } catch (e) {}

    return (
      <div
        className='col-full'
        style={{ marginTop: config.prefix === 'emenu' ? 120 : 140 }}
        id='cardItem'
      >
        <div id='close-modal' />
        <ModalInfoTransfer
          isPendingCart={true}
          totalAmount={paymentAmount}
          selectedCard={selectedCard}
          handleSettle={this.handleSettle}
        />
        <div id='primary' className='content-area'>
          <div className='stretch-full-width'>
            <div
              style={{
                flexDirection: 'row',
                position: 'fixed',
                zIndex: 10,
                width: '100%',
                marginTop: -60,
                boxShadow: '1px 2px 5px rgba(128, 128, 128, 0.5)',
                display: 'flex',
                height: 40,
              }}
              className='background-theme'
            >
              <div
                style={{ marginLeft: 10, fontSize: 16 }}
                onClick={() => this.props.history.goBack()}
              >
                <i className='fa fa-chevron-left'></i> Back
              </div>
            </div>
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
              {!loadingShow && !dataBasket && (
                <div>
                  <img
                    src={config.url_emptyImage}
                    alt='is empty'
                    style={{ marginTop: 30 }}
                  />
                  <div>Data is empty</div>
                </div>
              )}
              {!loadingShow && dataBasket && (
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
                      handleClear={(dataBasket) => this.handleClear(dataBasket)}
                      scrollPoint={(data) => this.scrollPoint(data)}
                      setPoint={(point) => this.setPoint(point)}
                      handleSettle={() => this.handleSettle()}
                      handleSubmit={() => this.handleSubmit()}
                      setOrderingMode={(mode) => this.setOrderingMode(mode)}
                      handleSetProvaider={(item) =>
                        this.handleSetProvaider(item)
                      }
                      setViewCart={(status) => this.setViewCart(status)}
                      handleSetState={(field, value) =>
                        this.handleSetState(field, value)
                      }
                    />
                  )}
                  {!viewCart && (
                    <ViewProsessBasket
                      data={this.state}
                      setting={this.props.setting || []}
                      dataBasket={dataBasket}
                      countryCode={countryCode}
                      isLoggedIn={isLoggedIn}
                      setting={setting}
                      getCurrency={(price) => this.getCurrency(price)}
                      setViewCart={(status) => this.setViewCart(status)}
                      handleCompletedOrdering={(status) =>
                        this.handleCompletedOrdering(status)
                      }
                    />
                  )}
                  <br />
                  {this.isManualTransfer(dataBasket) !== false ? (
                    <>
                      <div style={{ marginTop: -15 }}>
                        <a
                          data-toggle='collapse'
                          href='#collapseExample'
                          role='button'
                          aria-expanded='false'
                          aria-controls='collapseExample'
                        >
                          <div
                            data-toggle='modal'
                            data-target='#modal-info-transfer'
                            style={{ fontSize: 13 }}
                            className='customer-group-name'
                          >
                            <b>
                              <i>How to transfer ?</i>
                            </b>
                          </div>
                        </a>
                      </div>
                    </>
                  ) : null}
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
    companyInfo: state.masterdata.companyInfo.data,
    setting: state.order.setting,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Basket);
