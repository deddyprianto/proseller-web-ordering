import { CRMService } from '../../Services/CRMService';
import { OrderingService } from '../../Services/OrderingService';

function setData(data, constant) {
  return {
    type: constant,
    payload: data.Data,
  };
}

function getTransaction(payload = {}) {
  return async () => {
    let response = await CRMService.api(
      'GET',
      payload,
      'customer/sales',
      'bearer'
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400) {
      throw response;
    } else {
      let dataTransaction = response.Data;
      let dataTransactionLength = response.DataLength;
      response.Data = { dataTransaction, dataTransactionLength };
    }
    return response;
  };
}

function getBasket() {
  return async () => {
    let response = await OrderingService.api(
      'GET',
      null,
      'cart/getcart',
      'Bearer'
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    return response;
  };
}

function getBasketPending(payload = {}) {
  return async (dispatch) => {
    let response = await OrderingService.api(
      'POST',
      payload,
      'cart/pending',
      'Bearer'
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    else {
      let dataPending = response.data;
      let dataPendingLength = (dataPending && dataPending.length) || 0;
      response.data = { dataPending, dataPendingLength };
      dispatch(setData({ Data: dataPendingLength }, 'PENDING_ORDERS'));
    }
    return response;
  };
}

function getTransactionById(transactionId) {
  return async () => {
    try {
      const res = await CRMService.api(
        'GET',
        null,
        `customer/sales/${transactionId}`,
        'bearer'
      );
      return res.data;
    } catch (err) {
      return err;
    }
  };
}

export const HistoryAction = {
  getTransaction,
  getBasket,
  getBasketPending,
  getTransactionById,
};
