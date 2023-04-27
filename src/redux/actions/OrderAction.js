/* eslint-disable no-unused-vars */
import { CONSTANT } from '../../helpers';
import { OrderingService } from '../../Services/OrderingService';
import { isEmptyArray, isEmptyObject } from '../../helpers/CheckEmpty';
import config from '../../config';
import axios from 'axios';
import { lsLoad } from '../../helpers/localStorage';
import { CRMService } from '../../Services/CRMService';

const encryptor = require('simple-encryptor')(process.env.REACT_APP_KEY_DATA);
const account = encryptor.decrypt(lsLoad(`${config.prefix}_account`, true));

function setData(data, constant) {
  return {
    type: constant,
    data: data,
  };
}

function buildCart(payload = {}) {
  return async (dispatch) => {
    try {
      payload.orderingMode =
        localStorage.getItem(`${config.prefix}_ordering_mode`) ||
        (window.location.hostname.includes('emenu') ? 'DINEIN' : 'DELIVERY');
    } catch (error) {
      console.log(error);
    }
    const response = await OrderingService.api(
      'POST',
      payload,
      'cart/build',
      'Bearer'
    );

    if (response.ResultCode >= 400 || response.resultCode >= 400) {
      console.log('Status is ' + response.ResultCode || response.resultCode);
      localStorage.removeItem(`${config.prefix}_offlineCart`);
      return dispatch(setData({}, CONSTANT.DATA_BASKET));
    }
    // else if(response)
    else {
      let { data } = response;
      let basketData = { ...data };

      if (data.message) {
        data = null;
        basketData = {};
      }

      // console.log('Status is not 400');

      localStorage.setItem(
        `${config.prefix}_offlineCart`,
        JSON.stringify(data)
      );
      return dispatch(setData(basketData, CONSTANT.DATA_BASKET));
    }
  };
}

function shareURL(tableNo, outletID, orderMode) {
  return async () => {
    const payload = {
      tableNo: tableNo,
      outletID: outletID,
      customerID: account.accessToken.payload.signAs,
      orderMode: orderMode,
    };

    const response = await OrderingService.api(
      'POST',
      payload,
      'cart/generateshareurl/',
      'Bearer'
    );

    if (response.data !== undefined) return response;
    else return false;
  };
}

function getSettingOrdering() {
  return async (dispatch) => {
    let appType = config.prefix === 'emenu' ? 'eMenu' : 'webOrdering';
    let response = await OrderingService.api(
      'GET',
      null,
      `orderingsetting/${appType}`
    );
    let data = await response.data;
    const settingObj = data.settings.reduce((acc, setting) => {
      return {
        ...acc,
        [setting.settingKey]: setting.settingValue,
      };
    }, {});
    dispatch({
      type: 'SET_ORDERING_SETTINGS',
      data: settingObj,
    });
    if (data) {
      data = config.getSettingOrdering(data);

      let primaryColor =
        data &&
        data.settings.find((items) => {
          return items.settingKey === 'PrimaryColor';
        });
      let secondaryColor =
        data &&
        data.settings.find((items) => {
          return items.settingKey === 'SecondaryColor';
        });
      let font =
        data &&
        data.settings.find((items) => {
          return items.settingKey === 'FontColor';
        });
      let background =
        data &&
        data.settings.find((items) => {
          return items.settingKey === 'BackgroundColor';
        });
      let navigation =
        data &&
        data.settings.find((items) => {
          return items.settingKey === 'NavigationColor';
        });
      let textButtonColor =
        data &&
        data.settings.find((items) => {
          return items.settingKey === 'TextButtonColor';
        });
      let textWarningColor =
        data &&
        data.settings.find((items) => {
          return items.settingKey === 'TextWarningColor';
        });
      let navigationFontColor =
        data &&
        data.settings.find((items) => {
          return items.settingKey === 'NavigationFontColor';
        });
      let navigationIconSelectedColor =
        data &&
        data.settings.find((items) => {
          return items.settingKey === 'NavigationIconSelectedColor';
        });
      let outletSelection =
        data &&
        data.settings.find((items) => {
          return items.settingKey === 'OutletSelection';
        });
      let ProductPlaceholder =
        data &&
        data.settings.find((items) => {
          return items.settingKey === 'ProductPlaceholder';
        });

      if (outletSelection === undefined) {
        outletSelection = 'DEFAULT';
      } else {
        outletSelection = outletSelection.settingValue;
      }

      if (ProductPlaceholder === undefined) {
        ProductPlaceholder = null;
      } else {
        ProductPlaceholder = ProductPlaceholder.settingValue;
      }

      let payload = {
        primary: primaryColor.settingValue || '#C00A27',
        secondary: secondaryColor.settingValue || '#C00A27',
        font: font.settingValue || '#808080',
        background: background.settingValue || '#FFFFFF',
        textButtonColor: textButtonColor.settingValue || '#FFFFFF',
        textWarningColor: textWarningColor.settingValue || 'red',
        productPlaceholder: ProductPlaceholder || null,
        navigationColor: navigation.settingValue || '#D0D0D0',
        navigationFontColor: navigationFontColor.settingValue || '#FFFF',
        navigationIconSelectedColor:
          navigationIconSelectedColor.settingValue || '#393939',
      };
      dispatch({ type: 'SET_THEME', payload });
      dispatch({
        type: 'DATA_SETTING_ORDERING',
        payload: data && data.settings,
      });
      dispatch(setData(outletSelection, 'OUTLET_SELECTION'));
    }
    return data;
  };
}

function getCart(isSetData = true) {
  return async (dispatch) => {
    // IF CUSTOMER NOT LOGIN
    if (!account) {
      let offlineCart = localStorage.getItem(`${config.prefix}_offlineCart`);
      offlineCart = JSON.parse(offlineCart);
      if (!isEmptyObject(offlineCart)) {
        if (isSetData)
          return dispatch(setData(offlineCart, CONSTANT.DATA_BASKET));
        return offlineCart;
      }
      return;
    }

    const response = await OrderingService.api(
      'GET',
      null,
      'cart/getcart',
      'Bearer'
    );

    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    else if (response.data && response.data.message !== 'No details data') {
      if (response.data.status === 'PENDING_PAYMENT') {
        await OrderingService.api('DELETE', null, 'cart/delete', 'Bearer');
        return {};
      }

      if (isSetData) {
        return dispatch(setData(response.data, CONSTANT.DATA_BASKET));
      }

      return response.data;
    } else if (response.ResultCode === 404) {
      if (isSetData) return dispatch(setData({}, CONSTANT.DATA_BASKET));
      return {};
    } else if (response.data === null) {
      if (isSetData) return dispatch(setData({}, CONSTANT.DATA_BASKET));
    }

    return response;
  };
}
const getCartGuestMode = (idGuestCheckout) => {
  return async (dispatch) => {
    const response = await OrderingService.api(
      'GET',
      null,
      `guest/cart/${idGuestCheckout}`
    );
    if (response.resultCode >= 400) {
      return response;
    } else {
      localStorage.setItem(
        'BASKET_GUESTCHECKOUT',
        JSON.stringify(response.data)
      );
      dispatch({ type: CONSTANT.GUEST_MODE_BASKET, payload: response.data });
      return response.data;
    }
  };
};

function processOfflineCart(payload, mode) {
  return async (dispatch) => {
    try {
      let offlineCart = localStorage.getItem(`${config.prefix}_offlineCart`);
      offlineCart = JSON.parse(offlineCart);
      if (isEmptyObject(offlineCart) || isEmptyArray(offlineCart.details)) {
        return await dispatch(buildCart(payload));
      } else {
        if (mode === 'Add') {
          if (offlineCart.outletID === payload.outletID) {
            offlineCart.details.push(payload.details[0]);
            return await dispatch(buildCart(offlineCart));
          } else {
            localStorage.removeItem(`${config.prefix}_offlineCart`);
            return await dispatch(buildCart(payload));
          }
        } else {
          for (let i = 0; i < offlineCart.details.length; i++) {
            for (let j = 0; j < payload.length; j++) {
              if (offlineCart.details[i].id === payload[j].id) {
                offlineCart.details[i] = payload[j];
              }
            }
          }
          offlineCart.details = offlineCart.details.filter((item) => {
            return item.quantity !== 0;
          });
          return await dispatch(buildCart(offlineCart));
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
}

function updateCart(payload) {
  return async (dispatch) => {
    const response = await OrderingService.api(
      'POST',
      payload,
      'cart/updateitem',
      'Bearer'
    );

    dispatch(setData(response.data, CONSTANT.DATA_BASKET));
    return response;
  };
}

function processUpdateCart(product) {
  return async (dispatch) => {
    let payload = [];
    payload.push(product);

    if (account) {
      await dispatch(updateCart(payload));
    } else {
      await dispatch(processOfflineCart(payload, 'Update'));
    }
  };
}

function processRemoveCart(product) {
  return async (dispatch) => {
    let payload = [];
    payload.push({ ...product, quantity: 0 });

    if (account) {
      await dispatch(updateCart(payload));
    } else {
      await dispatch(processOfflineCart(payload, 'Update'));
    }
  };
}

function processRemoveCartGuestCheckoutMode(guestID, itemDetails) {
  return async () => {
    let payload = [];
    payload.push({
      id: itemDetails.id,
      productID: itemDetails.productID,
      unitPrice: itemDetails.unitPrice,
      quantity: 0,
    });
    const response = await OrderingService.api(
      'PUT',
      payload,
      `guest/cart/update-item/${guestID}`
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400) {
      return response;
    } else {
      return response;
    }
  };
}

function moveCart(payload) {
  return async (dispatch) => {
    try {
      const response = await OrderingService.api(
        'POST',
        payload,
        'cart/moveItem',
        'Bearer'
      );
      if (response.ResultCode >= 400 || response.resultCode >= 400) {
        return response;
      } else {
        dispatch(setData(response.data, CONSTANT.DATA_BASKET));
        return response.data;
      }
    } catch (error) {
      return payload.cart;
    }
  };
}

function changeOrderingMode(payload) {
  return async (dispatch) => {
    if (account && payload.orderingMode) {
      let response = await OrderingService.api(
        'POST',
        payload,
        'cart/changeOrderingMode',
        'Bearer'
      );
      if (response.ResultCode >= 400 || response.resultCode >= 400) {
        console.log(response);
      }

      const result = await dispatch(getCart());
      return result;
    } else {
      return { resultCode: 400 };
    }
  };
}

function changeOrderingModeForGuestCheckout(payload) {
  return async (dispatch) => {
    if (payload.orderingMode) {
      let response = await OrderingService.api(
        'POST',
        payload,
        'cart/changeOrderingMode',
        'Bearer'
      );
      if (response.ResultCode >= 400 || response.resultCode >= 400) {
        return response;
      }
      const result = await dispatch(getCartGuestMode(payload.guestID));
      return result;
    } else {
      return { resultCode: 400 };
    }
  };
}

function addCart(payload) {
  return async (dispatch) => {
    const response = await OrderingService.api(
      'POST',
      payload,
      'cart/additem',
      'Bearer'
    );

    // IF First time add cart, then call change Ordering mode
    try {
      const orderingMode = localStorage.getItem(
        `${config.prefix}_ordering_mode`
      );
      if (response.data) {
        if (response.data.details.length === 1) {
          const payload = {
            orderingMode: orderingMode,
          };
          dispatch(changeOrderingMode(payload));
        }
      }
    } catch (e) {
      console.log(e);
    }
    if (!(response.ResultCode >= 400 || response.resultCode >= 400)) {
      return dispatch(setData(response.data, CONSTANT.DATA_BASKET));
    }
  };
}

function processAddCart(defaultOutlet, selectedItem) {
  return async (dispatch) => {
    let payload = {
      outletID: `outlet::${defaultOutlet.id}`,
      details: [],
    };
    let product = {
      productID: selectedItem.productID,
      unitPrice: selectedItem?.product?.retailPrice || selectedItem.retailPrice,
      quantity: selectedItem.quantity,
    };

    if (selectedItem.remark !== '' || selectedItem.remark !== undefined) {
      product.remark = selectedItem.remark;
    }

    if (!isEmptyArray(selectedItem?.modifiers)) {
      product.modifiers = selectedItem.modifiers;
    }

    payload.details.push(product);

    if (account) {
      await dispatch(addCart(payload));
    } else {
      await dispatch(processOfflineCart(payload, 'Add'));
    }
  };
}

function updateCartInfo(payload) {
  return async (dispatch) => {
    await OrderingService.api('POST', payload, 'cart/updateCartInfo', 'Bearer');
    try {
      console.log('in');
    } catch (e) {
      console.log(e);
    }
    return dispatch(getCart());
  };
}

function deleteCart(isDeleteServer = false) {
  return async (dispatch) => {
    localStorage.removeItem(`${config.prefix}_selectedVoucher`);
    localStorage.removeItem(`${config.prefix}_selectedPoint`);
    // localStorage.removeItem(`${config.prefix}_scanTable`);
    localStorage.removeItem(`${config.prefix}_dataBasket`);

    // IF CUSTOMER NOT LOGIN
    if (!account && !isDeleteServer) {
      let offlineCart = localStorage.getItem(`${config.prefix}_offlineCart`);
      offlineCart = JSON.parse(offlineCart);
      if (!isEmptyObject(offlineCart)) {
        localStorage.removeItem(`${config.prefix}_offlineCart`);
        return dispatch(setData({}, CONSTANT.DATA_BASKET));
      }
    } else if (account) {
      const response = await OrderingService.api(
        'DELETE',
        null,
        'cart/delete',
        'Bearer'
      );
      if (response.ResultCode >= 400 || response.resultCode >= 400)
        console.log(response);
      else return dispatch(setData({}, CONSTANT.DATA_BASKET));
    }
    dispatch(setData({}, CONSTANT.DATA_BASKET));
  };
}

function submitBasket(payload) {
  return async () => {
    let response = await OrderingService.api(
      'POST',
      payload,
      'cart/submit',
      'Bearer'
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    return response;
  };
}

function submitOrdering(payload) {
  return async () => {
    let response = await OrderingService.api(
      'POST',
      payload,
      'cart/settle',
      'Bearer'
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    return response;
  };
}

function submitTakeAway(payload) {
  return async () => {
    let response = await OrderingService.api(
      'POST',
      payload,
      'cart/submitAndPay',
      'Bearer'
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    return response;
  };
}

function submitSettle(payload) {
  return async () => {
    let response = await OrderingService.api(
      'POST',
      payload,
      'cart/customer/settle',
      'Bearer'
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    return response;
  };
}

function submitMembership(payload) {
  return async () => {
    let response = await CRMService.api(
      'POST',
      payload,
      'sales/customer/submit',
      'bearer'
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    return response;
  };
}

function getProvider(
  payload = {
    take: '10',
    skip: 0,
    sortBy: 'name',
    sortDirection: 'ASC',
  }
) {
  return async (dispatch) => {
    let response = await OrderingService.api(
      'POST',
      payload,
      'delivery/providers',
      'Bearer'
    );
    dispatch({ type: 'SET_DELIVERY_PROVIDERS', payload: response.data });
    return response.data;
  };
}

function getCalculateFee(payload) {
  return async () => {
    let response = await OrderingService.api(
      'POST',
      payload,
      'delivery/calculateFee',
      'Bearer'
    );
    try {
      if (response.data.dataProfider !== undefined) {
        response.data.dataProvider = response.data.dataProfider;
      }
    } catch (e) {
      console.log(e);
    }
    return response.data;
  };
}

function getCartPending(id) {
  return async () => {
    let response = await OrderingService.api(
      'GET',
      null,
      `cart/pending/${id}`,
      'Bearer'
    );
    return response;
  };
}

function getCartCompleted(id) {
  return async () => {
    let response = await OrderingService.api(
      'GET',
      null,
      `outlet/cart/getcompleted/${id}`,
      'Bearer'
    );
    return response;
  };
}

function cartUpdate(payload) {
  return async () => {
    let response = await OrderingService.api(
      'POST',
      payload,
      'outlet/cart/update',
      'Bearer'
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      return response;
  };
}

function getTimeSlot(payload) {
  return async () => {
    let response = await OrderingService.api('POST', payload, 'timeslot');
    if (response.ResultCode >= 400 || response.resultCode >= 400) {
      console.log(response);
    } else {
      return response;
    }
  };
}

function getTrackOrder(refNo) {
  return async (dispatch) => {
    let response = await OrderingService.api(
      'GET',
      null,
      `order/track/${refNo}`
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400) {
      console.log(response);
      return response;
    } else {
      dispatch({ type: CONSTANT.TRACKORDER, payload: response });
      return response;
    }
  };
}

const paymentGuestMode = (submitCart) => {
  return async (dispatch) => {
    let response = await OrderingService.api(
      'POST',
      submitCart,
      'guest/cart/request-payment'
    );
    if (response.resultCode >= 400 || response.resultCode >= 400) {
      return response;
    } else {
      dispatch({ type: CONSTANT.URL_PAYMENT, payload: response.data });
      return response;
    }
  };
};

function submitAndPay(payload) {
  return async () => {
    let response = await OrderingService.api(
      'POST',
      payload,
      'cart/submitAndPay',
      'Bearer'
    );

    if (response.ResultCode >= 400 || response.resultCode >= 400) {
      console.log(response);
    }

    return response;
  };
}

function paymentTopUPSVC(payload) {
  return async () => {
    let response = await CRMService.api(
      'POST',
      payload,
      'sales/customer/submit',
      'bearer'
    );

    if (response.ResultCode >= 400 || response.resultCode >= 400) {
      console.log(response);
    }

    return response;
  };
}

function checkOfflineCart() {
  return async (dispatch) => {
    try {
      const account = encryptor.decrypt(
        lsLoad(`${config.prefix}_account`, true)
      );
      const getOfflineCart = localStorage.getItem(
        `${config.prefix}_offlineCart`
      );

      const offlineCart = JSON.parse(getOfflineCart);

      if (account && !isEmptyObject(offlineCart)) {
        let payload = {
          outletID: offlineCart.outletID,
          details: [],
        };
        offlineCart.details.forEach(async (item) => {
          let product = {
            productID: item.productID,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
          };

          if (!isEmptyArray(item.modifiers)) {
            product.modifiers = item.modifiers;
          }

          payload.details.push(product);
        });

        await dispatch(addCart(payload));

        await dispatch(getCart());

        localStorage.removeItem(`${config.prefix}_offlineCart`);
      }
    } catch (e) {
      // console.log(e);
    }
  };
}

const addOfflineCartToGuestModeCart = (guestID) => {
  return async (dispatch) => {
    const isOfflineCart = JSON.parse(
      localStorage.getItem(`${config.prefix}_offlineCart`)
    );
    for (let i = 0; i < isOfflineCart.details.length; i++) {
      const response = await OrderingService.api(
        'POST',
        {
          guestID: `guest::${guestID}`,
          outletID: isOfflineCart.outletID,
          details: [
            {
              productID: isOfflineCart.details[i]?.productID,
              unitPrice: isOfflineCart.details[i]?.grossAmount,
              quantity: isOfflineCart.details[i]?.quantity,
              remark: isOfflineCart.details[i]?.remark,
              modifiers: isOfflineCart.details[i]?.modifiers,
            },
          ],
        },
        'guest/cart/add-item'
      );
      if (response.status === 'SUCCESS') {
        localStorage.removeItem('webordering_offlineCart');
        dispatch(setData({}, CONSTANT.DATA_BASKET));
        dispatch({ type: CONSTANT.GUESTMODE, payload: response.data });
        dispatch({
          type: CONSTANT.OUTLET_RESPONSE,
          payload: response.data.outlet,
        });
      }
    }
  };
};

const addCartToGuestMode = (guestID, defaultOutlet, selectedItem) => {
  return async (dispatch) => {
    let payload = {
      guestID: `guest::${guestID}`,
      outletID: defaultOutlet.sortKey,
      details: [],
    };
    let product = {
      productID: selectedItem.productID,
      unitPrice: selectedItem?.product?.retailPrice || selectedItem.retailPrice,
      quantity: selectedItem.quantity,
      modifiers: selectedItem.modifiers,
    };

    if (selectedItem.remark !== '' || selectedItem.remark !== undefined) {
      product.remark = selectedItem.remark;
    }
    payload.details.push(product);
    let response = await OrderingService.api(
      'POST',
      payload,
      'guest/cart/add-item'
    );
    if (response.status === 'SUCCESS') {
      dispatch({ type: CONSTANT.GUESTMODE, payload: response.data });
      dispatch({
        type: CONSTANT.OUTLET_RESPONSE,
        payload: response.data.outlet,
      });
    }
    return response;
  };
};
const searchProdAppointment = (payload) => {
  let url = config.getUrlProduct();
  return async (dispatch) => {
    const response = await axios.post(`${url}product/load`, payload, {
      headers: {
        Authorization: `Bearer ${account.accessToken.jwtToken}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.data.status === 'SUCCESS') {
      dispatch({
        type: CONSTANT.SEARCHBAR,
        payload: response.data.data,
      });
    } else {
      throw response.data;
    }
  };
};
const getCartAppointment = () => {
  let url = config.getUrlAppointment();
  return async (dispatch) => {
    const response = await axios.get(`${url}cart`, {
      headers: {
        Authorization: `Bearer ${account.accessToken.jwtToken}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.data) {
      dispatch({
        type: CONSTANT.CART_APPOINTMENT,
        payload: response.data.data,
      });
    }
    return response.data;
  };
};
const deleteCartAppointment = () => {
  let url = config.getUrlAppointment();
  return async (dispatch) => {
    const response = await axios.delete(`${url}cart`, {
      headers: {
        Authorization: `Bearer ${account.accessToken.jwtToken}`,
        'Content-Type': 'application/json',
      },
    });
    return response;
  };
};
const deleteItemAppointment = (addService, productId) => {
  let url = config.getUrlAppointment();
  return async (dispatch) => {
    const response = await axios.put(`${url}cart/${productId}`, addService, {
      headers: {
        Authorization: `Bearer ${account.accessToken.jwtToken}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.data.message) {
      dispatch({
        type: CONSTANT.RESPONSEADDCART_APPOINTMENT,
        payload: response.data.data,
      });
    }
    return response;
  };
};

const getTimeSlotAppointment = (outletId) => {
  let url = config.getUrlAppointment();
  return async (dispatch) => {
    try {
      const response = await axios.get(`${url}timeslot/${outletId}`, {
        headers: {
          Authorization: `Bearer ${account.accessToken.jwtToken}`,
          'Content-Type': 'application/json',
        },
      });
      dispatch({
        type: CONSTANT.TIME_SLOT_APPOINTMENT,
        payload: response.data.data,
      });
      return response.data;
    } catch (error) {
      dispatch({
        type: CONSTANT.RESPONSE_TIMESLOT_ERROR_APPOINTMENT,
        payload: error.response.data.message,
      });
    }
  };
};
const getBooikingHistory = (categoryBooking) => {
  let url = config.getUrlAppointment();
  return async (dispatch) => {
    try {
      const response = await axios.get(
        `${url}customer/appointment?status=${categoryBooking}&skip=0&take=10`,
        {
          headers: {
            Authorization: `Bearer ${account.accessToken.jwtToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      dispatch({
        type: CONSTANT.BOOKING_HISTORY,
        payload: response.data.data,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
};

const loadStaffByTimeSlot = (date, timeslot) => {
  let url = config.getUrlDomain();
  return async (dispatch) => {
    const response = await axios.get(
      `${url}staff/api/staff/load?date=${date}&timeslot=${timeslot}`,
      {
        headers: {
          Authorization: `Bearer ${account.accessToken.jwtToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    if (response.data.status === 'SUCCESS') {
      dispatch({
        type: CONSTANT.STAFF_SERVICES,
        payload: response.data.data,
      });
    }
    return response.data.data;
  };
};

const addCartAppointment = (addService) => {
  let url = config.getUrlAppointment();
  return async (dispatch) => {
    const response = await axios.post(`${url}cart`, addService, {
      headers: {
        Authorization: `Bearer ${account.accessToken.jwtToken}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 201) {
      dispatch({
        type: CONSTANT.RESPONSEADDCART_APPOINTMENT,
        payload: response.data.data,
      });
    }
    return response;
  };
};
const submitCartAppointment = (payload) => {
  let url = config.getUrlAppointment();
  return async (dispatch) => {
    const response = await axios.post(`${url}cart/submit`, payload, {
      headers: {
        Authorization: `Bearer ${account.accessToken.jwtToken}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 201) {
      dispatch({
        type: CONSTANT.RESPONSE_SUBMIT_APPOINTMENT,
        payload: response.data.data,
      });
    }
    return response.data;
  };
};
const updateCartAppointment = (addService, productId) => {
  let url = config.getUrlAppointment();
  return async (dispatch) => {
    const response = await axios.put(`${url}cart/${productId}`, addService, {
      headers: {
        Authorization: `Bearer ${account.accessToken.jwtToken}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.data.message) {
      dispatch({
        type: CONSTANT.RESPONSEADDCART_APPOINTMENT,
        payload: response.data.data,
      });
    }
    return response;
  };
};

const processUpdateCartGuestMode = (guestID, productUpdate) => {
  return async (dispatch) => {
    const idGuest = `guest::${guestID}`;
    let payload = [
      {
        id: productUpdate.id,
        productID: productUpdate.productID,
        unitPrice: productUpdate.unitPrice,
        quantity: productUpdate.quantity,
        modifiers: productUpdate.modifiers || [],
        remark: productUpdate.remark || '',
      },
    ];

    const response = await OrderingService.api(
      'PUT',
      payload,
      `guest/cart/update-item/${idGuest}`
    );
    if (response.status === 'SUCCESS') {
      dispatch({
        type: CONSTANT.SAVE_EDIT_RESPONSE_GUESTCHECKOUT,
        payload: response.data,
      });
    }
  };
};

const clearResponse = () => {
  return async (dispatch) => {
    dispatch({ type: CONSTANT.GUESTMODE, payload: null });
  };
};

const saveDateGuest = (payload) => {
  return async (dispatch) => {
    dispatch({ type: CONSTANT.SAVE_DATE, payload: payload });
  };
};
const saveTimeGuest = (payload) => {
  return async (dispatch) => {
    dispatch({ type: CONSTANT.SAVE_TIMESLOT, payload: payload });
  };
};
const saveTimeSlotGuest = (payload) => {
  return async (dispatch) => {
    dispatch({ type: CONSTANT.SAVE_TIME, payload: payload });
  };
};

const deleteCartGuestMode = (idGuestCheckout) => {
  return async (dispatch) => {
    const response = await OrderingService.api(
      'DELETE',
      null,
      `guest/cart/delete/${idGuestCheckout}`
    );
    if (response) {
      dispatch({
        type: CONSTANT.GUEST_MODE_BASKET,
        payload: { message: 'Cart it empty.' },
      });
      dispatch({ type: CONSTANT.GUESTMODE, payload: null });
      dispatch({
        type: CONSTANT.SAVE_ADDRESS_GUESTMODE,
        payload: { deliveryAddress: null },
      });
    }
  };
};

const addCartFromGuestCOtoCartLogin = (basketGuestCo) => {
  return async (dispatch) => {
    let res;
    for (let i = 0; i < basketGuestCo.details.length; i++) {
      let payload = {
        outletID: basketGuestCo.outletID,
        details: [
          {
            productID: basketGuestCo.details[i]?.productID,
            unitPrice: basketGuestCo.details[i]?.grossAmount,
            quantity: basketGuestCo.details[i]?.quantity,
            remark: basketGuestCo.details[i]?.remark,
            modifiers: basketGuestCo.details[i]?.modifiers,
          },
        ],
      };
      if (account) {
        const response = await dispatch(addCart(payload));
        res = response;
      }
    }
    return res;
  };
};
export const OrderAction = {
  addCart,
  getCart,
  checkOfflineCart,
  updateCart,
  processAddCart,
  processUpdateCart,
  processRemoveCart,
  deleteCart,
  submitBasket,
  submitOrdering,
  submitTakeAway,
  getProvider,
  getCalculateFee,
  submitSettle,
  getCartPending,
  getCartCompleted,
  cartUpdate,
  shareURL,
  setData,
  submitAndPay,
  changeOrderingMode,
  buildCart,
  getSettingOrdering,
  moveCart,
  getTimeSlot,
  submitMembership,
  paymentTopUPSVC,
  updateCartInfo,
  getTrackOrder,
  addCartToGuestMode,
  getCartGuestMode,
  paymentGuestMode,
  changeOrderingModeForGuestCheckout,
  processRemoveCartGuestCheckoutMode,
  saveDateGuest,
  saveTimeGuest,
  saveTimeSlotGuest,
  clearResponse,
  addOfflineCartToGuestModeCart,
  deleteCartGuestMode,
  processUpdateCartGuestMode,
  addCartFromGuestCOtoCartLogin,
  addCartAppointment,
  getCartAppointment,
  deleteCartAppointment,
  updateCartAppointment,
  searchProdAppointment,
  deleteItemAppointment,
  getTimeSlotAppointment,
  loadStaffByTimeSlot,
  submitCartAppointment,
  getBooikingHistory,
};
