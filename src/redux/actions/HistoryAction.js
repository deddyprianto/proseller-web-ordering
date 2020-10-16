import { CRMService } from "../../Services/CRMService";
import { AuthActions } from "./AuthAction";
import { OrderingService } from "../../Services/OrderingService";

export const HistoryAction = {
  getTransaction,
  getBasket,
  getBasketPending
};

function getTransaction(payload = {}) {
  return async (dispatch) => {
    payload.page = 1

    let response = await CRMService.api('GET', payload, 'customer/sales', 'bearer')
    if (response.ResultCode >= 400 || response.resultCode >= 400) console.log(response)
    else {
      let dataTransaction = response.Data
      let dataTransactionLength = response.DataLength
      response.Data = { dataTransaction, dataTransactionLength }
    }
    return response
  };
}

function getBasket() {
  return async (dispatch) => {
    let response = await OrderingService.api('GET', null, 'cart/getcart', 'Bearer')
    if (response.ResultCode >= 400 || response.resultCode >= 400) console.log(response)
    return response
  };
}

function getBasketPending() {
  return async (dispatch) => {
    let response = await OrderingService.api('POST', null, 'cart/pending', 'Bearer')
    if (response.ResultCode >= 400 || response.resultCode >= 400) console.log(response)
    else {
      let dataPending = response.data
      let dataPendingLength = dataPending && dataPending.length || 0
      response.data = { dataPending, dataPendingLength }
    }
    return response
  };
}