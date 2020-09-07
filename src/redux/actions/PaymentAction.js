import { PaymentService } from "../../Services/PaymentService";
import { AuthActions } from "./AuthAction";

export const PaymentAction = {
  getPaymentCard,
  removePaymentCard,
  registerPaymentCard,
  checkPaymentCard,
};

function getPaymentCard() {
  return async (dispatch) => {
    let response = await PaymentService.api('GET', null, 'account', 'Bearer')
    if (response.resultCode === 400) await dispatch(AuthActions.refreshToken())
    return response
  };
}

function removePaymentCard(id) {
  return async (dispatch) => {
    let response = await PaymentService.api('DELETE', null, 'account/delete/' + id, 'Bearer')
    if (response.resultCode === 400) await dispatch(AuthActions.refreshToken())
    return response
  };
}

function registerPaymentCard(payload) {
  return async (dispatch) => {
    let response = await PaymentService.api('POST', payload, 'account/register', 'Bearer')
    if (response.resultCode === 400) await dispatch(AuthActions.refreshToken())
    return response
  };
}

function checkPaymentCard(id) {
  return async (dispatch) => {
    let response = await PaymentService.api('GET', null, 'account/check/' + id, 'Bearer')
    if (response.resultCode === 400) await dispatch(AuthActions.refreshToken())
    return response
  };
}