import { CONSTANT } from "../../helpers";
import { OrderingService } from "../../Services/OrderingService";
import {
  isEmptyData,
  isEmptyArray,
  isEmptyObject,
} from "../../helpers/CheckEmpty";
import _ from "lodash";
import config from "../../config";

import { lsLoad } from "../../helpers/localStorage";
import { CRMService } from "../../Services/CRMService";

const encryptor = require("simple-encryptor")(process.env.REACT_APP_KEY_DATA);
const account = encryptor.decrypt(lsLoad(`${config.prefix}_account`, true));

export const OrderAction = {
  addCart,
  getCart,
  updateCart,
  processAddCart,
  processUpdateCart,
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
  changeOrderingMode,
  buildCart,
  getSettingOrdering,
  moveCart,
  getTimeSlot,
  submitMembership,
};

function shareURL(tableNo, outletID, orderMode) {
  return async (dispatch) => {
    const payload = {
      tableNo: tableNo,
      outletID: outletID,
      customerID: account.accessToken.payload.signAs,
      orderMode: orderMode,
    };

    const response = await OrderingService.api(
      "POST",
      payload,
      `cart/generateshareurl/`,
      "Bearer"
    );

    if (response.data !== undefined) return response;
    else return false;
  };
}

function getSettingOrdering() {
  return async (dispatch) => {
    let appType = config.prefix === "emenu" ? "eMenu" : "webOrdering";
    let response = await OrderingService.api(
      "GET",
      null,
      `orderingsetting/${appType}`
    );
    let data = await response.data;
    if (data) {
      data = config.getSettingOrdering(data);

      let primaryColor =
        data &&
        data.settings.find((items) => {
          return items.settingKey === "PrimaryColor";
        });
      let secondaryColor =
        data &&
        data.settings.find((items) => {
          return items.settingKey === "SecondaryColor";
        });
      let font =
        data &&
        data.settings.find((items) => {
          return items.settingKey === "FontColor";
        });
      let background =
        data &&
        data.settings.find((items) => {
          return items.settingKey === "BackgroundColor";
        });
      let navigation =
        data &&
        data.settings.find((items) => {
          return items.settingKey === "NavigationColor";
        });
      let textButtonColor =
        data &&
        data.settings.find((items) => {
          return items.settingKey === "TextButtonColor";
        });
      let textWarningColor =
        data &&
        data.settings.find((items) => {
          return items.settingKey === "TextWarningColor";
        });
      let payload = {
        primary: primaryColor.settingValue || "#C00A27",
        secondary: secondaryColor.settingValue || "#C00A27",
        font: font.settingValue || "#808080",
        background: background.settingValue || "#FFFFFF",
        navigation: navigation.settingValue || "#C00A27",
        textButtonColor: textButtonColor.settingValue || "#FFFFFF",
        textWarningColor: textWarningColor.settingValue || "red",
      };
      dispatch({ type: "SET_THEME", payload });
      dispatch({
        type: "DATA_SETTING_ORDERING",
        payload: data && data.settings,
      });
    }
  };
}

function processAddCart(defaultOutlet, selectedItem) {
  return async (dispatch) => {
    if (isEmptyData(selectedItem.product.retailPrice)) {
      selectedItem.product.retailPrice = 0;
    }

    // ORIGINAL PRODUCT
    let product = {
      productID: selectedItem.productID,
      unitPrice: selectedItem.product.retailPrice,
      quantity: selectedItem.quantity,
    };

    if (selectedItem.remark !== "" || selectedItem.remark !== undefined)
      product.remark = selectedItem.remark;

    // IF MODIFIER EXIST
    if (!isEmptyArray(selectedItem.product.productModifiers)) {
      const productModifierClone = JSON.stringify(
        selectedItem.product.productModifiers
      );
      let productModifiers = JSON.parse(productModifierClone);

      productModifiers = productModifiers.filter(
        (item) => item.postToServer === true
      );
      product.modifiers = productModifiers;

      let tempDetails = [];
      for (let i = 0; i < product.modifiers.length; i++) {
        tempDetails = [];
        let data = product.modifiers[i];
        for (let j = 0; j < data.modifier.details.length; j++) {
          if (
            data.modifier.details[j].quantity !== undefined &&
            data.modifier.details[j].quantity > 0
          ) {
            // check if price is undefined
            if (data.modifier.details[j].price === undefined) {
              data.modifier.details[j].price = 0;
            }

            tempDetails.push(data.modifier.details[j]);
          }
        }
        // replace details
        product.modifiers[i].modifier.details = tempDetails;
      }

      // check if item modifier was deleted, if yes, then remove array modifier
      product.modifiers = await _.remove(product.modifiers, (group) => {
        return group.modifier.details.length > 0;
      });

      //  calculate total modifier
      let totalModifier = 0;
      await product.modifiers.forEach((group) => {
        if (group.postToServer === true) {
          group.modifier.details.forEach((detail) => {
            if (detail.quantity !== undefined && detail.quantity > 0) {
              totalModifier += parseFloat(detail.quantity * detail.price);
            }
          });
        }
      });

      //  add total item modifier to subtotal product
      product.unitPrice += totalModifier;
    }

    let payload = {
      outletID: `outlet::${defaultOutlet.id}`,
      details: [],
    };

    payload.details.push(product);

    if (account) dispatch(addCart(payload));
    else dispatch(processOfflineCart(payload, "Add"));
  };
}

function processUpdateCart(basket, products) {
  return async (dispatch) => {
    let payload = [];
    for (let index = 0; index < products.length; index++) {
      let product = products[index];
      let find = await basket.details.find((data) => data.id === product.id);
      let dataproduct = {
        id: find.id,
        productID: product.productID,
        unitPrice: product.product.retailPrice,
        quantity: product.quantity,
      };

      if (product.remark !== "" && product.remark !== undefined)
        dataproduct.remark = product.remark;

      if (!isEmptyArray(product.product.productModifiers)) {
        console.log(product.product.productModifiers);
        let totalModifier = 0;
        let productModifiers = [...product.product.productModifiers];
        dataproduct.modifiers = productModifiers;

        let tempDetails = [];
        for (let i = 0; i < dataproduct.modifiers.length; i++) {
          tempDetails = [];
          let data = dataproduct.modifiers[i];

          for (let j = 0; j < data.modifier.details.length; j++) {
            if (
              data.modifier.details[j].quantity !== undefined &&
              data.modifier.details[j].quantity > 0
            ) {
              // check if price is undefined
              if (data.modifier.details[j].price === undefined) {
                data.modifier.details[j].price = 0;
              }
              tempDetails.push(data.modifier.details[j]);
            }
          }

          // if not null, then replace details
          dataproduct.modifiers[i].modifier.details = tempDetails;
        }

        //  calculate total modifier
        await dataproduct.modifiers.forEach((group) => {
          group.modifier.details.forEach((detail) => {
            if (detail.quantity !== undefined && detail.quantity > 0) {
              totalModifier += parseFloat(detail.quantity * detail.price);
            }
          });
        });

        // check if item modifier was deleted, if yes, then remove array modifier
        dataproduct.modifiers = await _.remove(
          dataproduct.modifiers,
          (group) => {
            return group.modifier.details.length > 0;
          }
        );

        //  add total item modifier to subtotal product
        dataproduct.unitPrice += totalModifier;
      }
      console.log(dataproduct);

      payload.push(dataproduct);
    }

    console.log(payload);
    let basketUpdate = {};
    if (account) basketUpdate = await dispatch(updateCart(payload));
    else basketUpdate = await dispatch(processOfflineCart(payload, "Update"));
    return basketUpdate;
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
        if (mode === "Add") {
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
    } catch (e) {}
  };
}

function moveCart(payload) {
  return async (dispatch) => {
    try {
      const response = await OrderingService.api(
        "POST",
        payload,
        `cart/moveItem`,
        "Bearer"
      );
      if (response.ResultCode >= 400 || response.resultCode >= 400) {
        console.log(response);
        return payload.cart;
      } else {
        dispatch(setData(response.data, CONSTANT.DATA_BASKET));
        return response.data;
      }
    } catch (error) {
      return payload.cart;
    }
  };
}

function addCart(payload) {
  return async (dispatch) => {
    const response = await OrderingService.api(
      "POST",
      payload,
      `cart/additem`,
      "Bearer"
    );

    try {
      document.getElementById("close-modal").click();
    } catch (e) {}

    // console.log(response)
    if (!(response.ResultCode >= 400 || response.resultCode >= 400)) {
      return dispatch(setData(response.data, CONSTANT.DATA_BASKET));
    }
  };
}

function buildCart(payload = {}) {
  return async (dispatch) => {
    try {
      payload.orderingMode =
        localStorage.getItem(`${config.prefix}_ordering_mode`) ||
        (window.location.pathname.includes("emenu") ? "DINEIN" : "DELIVERY");
    } catch (error) {}
    const response = await OrderingService.api(
      "POST",
      payload,
      `cart/build`,
      "Bearer"
    );

    try {
      document.getElementById("close-modal").click();
    } catch (e) {}

    // console.log(response);
    if (response.ResultCode >= 400 || response.resultCode >= 400) {
      console.log("Status is " + response.ResultCode || response.resultCode);
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
      console.log("Status is not 400");
      localStorage.setItem(
        `${config.prefix}_offlineCart`,
        JSON.stringify(data)
      );
      return dispatch(setData(basketData, CONSTANT.DATA_BASKET));
    }
  };
}

function updateCart(payload) {
  return async (dispatch) => {
    await OrderingService.api("POST", payload, `cart/updateitem`, "Bearer");
    try {
      document.getElementById("close-modal").click();
    } catch (e) {}
    return dispatch(getCart());
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
      "GET",
      null,
      `cart/getcart`,
      "Bearer"
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    else if (response.data && response.data.message !== "No details data") {
      if (isSetData)
        return dispatch(setData(response.data, CONSTANT.DATA_BASKET));
      return response.data;
    } else if (response.ResultCode === 404) {
      if (isSetData) return dispatch(setData({}, CONSTANT.DATA_BASKET));
      return {};
    } else if (response.data === null) {
      if (isSetData) return dispatch(setData({}, CONSTANT.DATA_BASKET));
    }
  };
}

function deleteCart(isDeleteServer = false) {
  return async (dispatch) => {
    localStorage.removeItem(`${config.prefix}_selectedVoucher`);
    localStorage.removeItem(`${config.prefix}_selectedPoint`);
    localStorage.removeItem(`${config.prefix}_scanTable`);
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
        "DELETE",
        null,
        `cart/delete`,
        "Bearer"
      );
      if (response.ResultCode >= 400 || response.resultCode >= 400)
        console.log(response);
      else return dispatch(setData({}, CONSTANT.DATA_BASKET));
    }
    dispatch(setData({}, CONSTANT.DATA_BASKET));
  };
}

function submitBasket(payload) {
  return async (dispatch) => {
    let response = await OrderingService.api(
      "POST",
      payload,
      `cart/submit`,
      "Bearer"
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    return response;
  };
}

function submitOrdering(payload) {
  return async (dispatch) => {
    let response = await OrderingService.api(
      "POST",
      payload,
      `cart/settle`,
      "Bearer"
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    return response;
  };
}

function submitTakeAway(payload) {
  return async (dispatch) => {
    let response = await OrderingService.api(
      "POST",
      payload,
      `cart/submitAndPay`,
      "Bearer"
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    return response;
  };
}

function submitSettle(payload) {
  return async (dispatch) => {
    let response = await OrderingService.api(
      "POST",
      payload,
      `cart/customer/settle`,
      "Bearer"
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    return response;
  };
}

function submitMembership(payload) {
  return async (dispatch) => {
    let response = await CRMService.api(
      "POST",
      payload,
      `sales/customer/submit`,
      "bearer"
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    return response;
  };
}

function getProvider(
  payload = {
    take: "10",
    skip: 0,
    sortBy: "name",
    sortDirection: "ASC",
  }
) {
  return async (dispatch) => {
    let response = await OrderingService.api(
      "POST",
      payload,
      `delivery/providers`,
      "Bearer"
    );
    dispatch({ type: "SET_DELIVERY_PROVIDERS", payload: response.data });
    return response.data;
  };
}

function getCalculateFee(payload) {
  return async (dispatch) => {
    let response = await OrderingService.api(
      "POST",
      payload,
      `delivery/calculateFee`,
      "Bearer"
    );
    try {
      if (response.data.dataProfider !== undefined) {
        response.data.dataProvider = response.data.dataProfider;
      }
    } catch (e) {}
    return response.data;
  };
}

function getCartPending(id) {
  return async (dispatch) => {
    let response = await OrderingService.api(
      "GET",
      null,
      `cart/pending/${id}`,
      "Bearer"
    );
    return response;
  };
}

function getCartCompleted(id) {
  return async (dispatch) => {
    let response = await OrderingService.api(
      "GET",
      null,
      `outlet/cart/getcompleted/${id}`,
      "Bearer"
    );
    return response;
  };
}

function cartUpdate(payload) {
  return async (dispatch) => {
    let response = await OrderingService.api(
      "POST",
      payload,
      `outlet/cart/update`,
      "Bearer"
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    return response;
  };
}

function changeOrderingMode(payload) {
  return async (dispatch) => {
    if (account && payload.orderingMode) {
      let response = await OrderingService.api(
        "POST",
        payload,
        `cart/changeOrderingMode`,
        "Bearer"
      );
      if (response.ResultCode >= 400 || response.resultCode >= 400)
        console.log(response);
      return response;
    } else {
      return { resultCode: 400 };
    }
  };
}

function getTimeSlot(payload) {
  return async (dispatch) => {
    let response = await OrderingService.api("POST", payload, `timeslot`);
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    return response;
  };
}

function setData(data, constant) {
  return {
    type: constant,
    data: data,
  };
}
