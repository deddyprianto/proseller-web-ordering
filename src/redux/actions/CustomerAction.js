import { CONSTANT } from "../../helpers";
import { CRMService } from "../../Services/CRMService";
import { AuthActions } from "./AuthAction";
import _ from 'lodash';

export const CustomerAction = {
  getCustomerProfile,
  getDeliferyAddress,
  updateCustomerProfile,
  mandatoryField,
  getVoucher,
  checkStatusPayment,
  updatePassword
};

function getCustomerProfile() {
  return async (dispatch) => {
    let response = await CRMService.api('GET', null, 'customer/getProfile', 'bearer')
    if (response.ResultCode >= 400 || response.resultCode >= 400) await dispatch(AuthActions.refreshToken())
    dispatch(setData(response, CONSTANT.KEY_GET_CUSTOMER_PROFILE))
    return response
  };
}

function checkStatusPayment(referenceNo) {
  return async (dispatch) => {
    let response = await CRMService.api('GET', null, `sales/status?referenceNo=${referenceNo}`, 'bearer')
    if (response.ResultCode == 200) return response;
    else return {};
  };
}

function getDeliferyAddress() {
  return async (dispatch) => {
    let response = await CRMService.api('GET', null, 'customer/getProfile', 'bearer')
    if (response.ResultCode >= 400 || response.resultCode >= 400) await dispatch(AuthActions.refreshToken())
    else {
      let deliveryAddress = response.Data[0]
      if (deliveryAddress && deliveryAddress.deliveryAddress && deliveryAddress.deliveryAddress.length > 0) {
        deliveryAddress = deliveryAddress.deliveryAddress
      } else if (deliveryAddress.address) {
        deliveryAddress = [{
          addressName: "My Default Address",
          address: deliveryAddress.address,
          postalCode: "",
          city: "",
        }]
      } else deliveryAddress = null
      response.Data = deliveryAddress
    }
    dispatch(setData(response, CONSTANT.KEY_GET_CUSTOMER_PROFILE))
    return response
  };
}

function updateCustomerProfile(payload = null) {
  return async (dispatch) => {
    let response = await CRMService.api('PUT', payload, 'customer/updateProfile', 'bearer')
    if (response.ResultCode >= 400 || response.resultCode >= 400) await dispatch(AuthActions.refreshToken())
    dispatch(setData(response, CONSTANT.KEY_UPDATE_CUSTOMER_PROFILE))
    return response
  };
}

function updatePassword(payload = null) {
  return async (dispatch) => {
    let response = await CRMService.api('POST', payload, 'profile/changePassword', 'Bearer')
    if (response.ResultCode >= 400 || response.resultCode >= 400) await dispatch(AuthActions.refreshToken())
    return response
  };
}

function mandatoryField(payload = null) {
  return async (dispatch) => {
    let response = await CRMService.api('GET', payload, 'mandatoryfield/customer', 'bearer')
    if (response.ResultCode >= 400 || response.resultCode >= 400) await dispatch(AuthActions.refreshToken())
    dispatch(setData(response, CONSTANT.KEY_MANDATORY_FIELD_CUSTOMER))
    return response
  };
}

function getVoucher() {
  return async (dispatch) => {
    let response = await CRMService.api('GET', null, 'customer/vouchers', 'bearer')
    if (response.ResultCode >= 400 || response.resultCode >= 400) await dispatch(AuthActions.refreshToken())
    else {
      let myVoucher = [];
      _.forEach(
        _.groupBy(response.Data, 'id'),
        function (value, key) {
          value[0].totalRedeem = value.length;
          myVoucher.push(value[0]);
        },
      );
      response.Data = myVoucher
      dispatch(setData(response, CONSTANT.GET_VOUCHER))
    }
    return response
  };
}

function setData(data, constant) {
  return {
    type: constant,
    data: data.Data,
  };
}