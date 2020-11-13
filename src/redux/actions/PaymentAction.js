import { PaymentService } from "../../Services/PaymentService";

export const PaymentAction = {
  getPaymentCard,
  removePaymentCard,
  registerPaymentCard,
  checkPaymentCard,
  setDefaultPaymentCard,
  setData
};

function getPaymentCard() {
  return async (dispatch) => {
    let response = await PaymentService.api('GET', null, 'account', 'Bearer')
    if (response.ResultCode >= 400 || response.resultCode >= 400) console.log(response)
    else await dispatch(setData(response.data, 'GET_PAYMENT_CARD'));
    return response
  };
}

function removePaymentCard(id) {
  return async (dispatch) => {
    let response = await PaymentService.api('DELETE', null, 'account/delete/' + id, 'Bearer')
    if (response.ResultCode >= 400 || response.resultCode >= 400) console.log(response)
    return response
  };
}

function registerPaymentCard(payload) {
  return async (dispatch) => {
    let response = await PaymentService.api('POST', payload, 'account/register', 'Bearer')
    if (response.ResultCode >= 400 || response.resultCode >= 400) console.log(response)
    return response
  };
}

function checkPaymentCard(id) {
  return async (dispatch) => {
    let response = await PaymentService.api('GET', null, `account/check/${id}`, 'Bearer')
    if (response.ResultCode >= 400 || response.resultCode >= 400) console.log(response)
    return response
  };
}

function setDefaultPaymentCard(id) {
  return async (dispatch) => {
    let response = await PaymentService.api('GET', null, `account/setdefault/${id}`, 'Bearer')
    if (response.ResultCode >= 400 || response.resultCode >= 400) console.log(response)
    return response
  };
}

function setData(data, constant) {
  return {
    type: constant,
    data: data,
  };
}