import { CONSTANT } from '../../helpers';
import { OrderingService } from '../../Services/OrderingService';
import { isEmptyArray, isEmptyObject } from '../../helpers/CheckEmpty';
import config from '../../config';

import { lsLoad } from '../../helpers/localStorage';
import { CRMService } from '../../Services/CRMService';
import Swal from 'sweetalert2';

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
    try {
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
          navigationColor: navigation.settingValue || '#C00A27',
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
    } catch (error) {}
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

    if (!(response.ResultCode >= 400 || response.resultCode >= 400)) {
      return dispatch(setData(response.data, CONSTANT.DATA_BASKET));
    } else {
      Swal.fire(
        'Oppss!',
        response.data.message || 'Failed to update item',
        'error'
      );
    }
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
      // console.log(e);
    }

    if (!(response.ResultCode >= 400 || response.resultCode >= 400)) {
      return dispatch(setData(response.data, CONSTANT.DATA_BASKET));
    } else {
      Swal.fire(
        'Oppss!',
        response.data.message || 'Failed to add item',
        'error'
      );
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

    if (selectedItem.remark !== '' || selectedItem.remark !== undefined)
      product.remark = selectedItem.remark;

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
    try {
      await OrderingService.api(
        'POST',
        payload,
        'cart/updateCartInfo',
        'Bearer'
      );
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
      console.log(response);
    return response;
  };
}

function getTimeSlot(payload) {
  return async () => {
    let response = await OrderingService.api('POST', payload, 'timeslot');
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    return response;
  };
}

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

export const OrderAction = {
  addCart,
  buildCart,
  cartUpdate,
  changeOrderingMode,
  checkOfflineCart,
  deleteCart,
  getCalculateFee,
  getCart,
  getCartCompleted,
  getCartPending,
  getProvider,
  getSettingOrdering,
  getTimeSlot,
  moveCart,
  processAddCart,
  processRemoveCart,
  processUpdateCart,
  setData,
  shareURL,
  submitAndPay,
  submitBasket,
  submitMembership,
  submitOrdering,
  submitSettle,
  submitTakeAway,
  updateCart,
  updateCartInfo,
};
