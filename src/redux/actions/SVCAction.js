import { CRMService } from '../../Services/CRMService';
import config from '../../config';
const encryptor = require('simple-encryptor')(process.env.REACT_APP_KEY_DATA);
const customerInfo = encryptor.decrypt(
  JSON.parse(localStorage.getItem(`${config.prefix}_account`))
);

function loadSVC() {
  return async () => {
    let response = await CRMService.api(
      'GET',
      null,
      'storevaluecard/load',
      'bearer'
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    return response;
  };
}

function historySVC(history = []) {
  return async (dispatch) => {
    const payload = {
      skip: history.length || 0,
      take: 10,
      isDetail: true,
    };
    let response = await CRMService.api(
      'POST',
      payload,
      'storevaluecard/history',
      'bearer'
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    else {
      if (history.length === 0) {
        dispatch({
          type: 'GET_HISTORY_EXPIRATION_SUCCESS',
          payload: response || {},
        });
      } else {
        let dataHistory = history;
        dataHistory = [...dataHistory, ...response.data];
        response.data = dataHistory;
        dispatch({
          type: 'GET_HISTORY_EXPIRATION_SUCCESS',
          payload: response || {},
        });
      }
    }
    return response;
  };
}

function historyCustomerActivity(history = []) {
  return async (dispatch) => {
    const payload = {
      skip: history.length || 0,
      take: 5,
      parameters: [
        {
          id: 'search',
          value: '_SVC',
        },
      ],
    };

    const customerId = `${customerInfo.idToken.payload.id}`;

    let response = await CRMService.api(
      'POST',
      payload,
      `customer/activity/${customerId}`,
      'bearer'
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    else {
      if (history.length === 0) {
        dispatch({
          type: 'GET_HISTORY_SUCCESS',
          payload: response || {},
        });
      } else {
        let dataHistory = history;
        dataHistory = [...dataHistory, ...response.data];
        response.data = dataHistory;
        dispatch({
          type: 'GET_HISTORY_SUCCESS',
          payload: response || {},
        });
      }
    }
    return response;
  };
}

function summarySVC() {
  return async (dispatch) => {
    const payload = {
      customerId: `customer::${customerInfo?.idToken?.payload?.id}`,
    };
    let response = await CRMService.api(
      'POST',
      payload,
      'storevaluecard/summary',
      'bearer'
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    else {
      dispatch({
        type: 'GET_SUMMARY_SUCCESS',
        payload: response.data,
      });
    }
    return response;
  };
}

function transferSVC(payload) {
  return async (dispatch) => {
    let response = await CRMService.api(
      'POST',
      payload,
      'storevaluecard/transfer',
      'bearer'
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400) {
      dispatch({
        type: 'TRANSFER_SVC_FAILED',
        payload: response.message,
      });
    } else {
      dispatch(summarySVC());
      dispatch(historyCustomerActivity());
      dispatch(historySVC());
      dispatch({ type: 'TRANSFER_SVC_SUCCESS' });
    }
  };
}

export const SVCAction = {
  loadSVC,
  summarySVC,
  historySVC,
  transferSVC,
  historyCustomerActivity,
};
