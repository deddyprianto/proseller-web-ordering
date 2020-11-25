import { CRMService } from "../../Services/CRMService";
import config from "../../config";
const encryptor = require("simple-encryptor")(process.env.REACT_APP_KEY_DATA);
const customerInfo = encryptor.decrypt(
  JSON.parse(localStorage.getItem(`${config.prefix}_account`))
);

export const SVCAction = {
  loadSVC,
  summarySVC,
  historySVC
};

function loadSVC() {
  return async (dispatch) => {
    let response = await CRMService.api('GET', null, 'storevaluecard/load', 'bearer')
    if (response.ResultCode >= 400 || response.resultCode >= 400) console.log(response)
    return response
  };
}

function historySVC(dataLength) {
  return async (dispatch) => {
    const payload = {
      skip: dataLength,
      take: 10,
      isDetail: true
    }
    let response = await CRMService.api('POST', payload, 'storevaluecard/history', 'bearer')
    if (response.ResultCode >= 400 || response.resultCode >= 400) console.log(response)
    console.log(response)
    return response
  };
}

function summarySVC() {
  return async (dispatch) => {
    const payload = {
      customerId: `customer::${customerInfo.idToken.payload.id}`
    }
    let response = await CRMService.api('POST', payload, 'storevaluecard/summary', 'bearer')
    if (response.ResultCode >= 400 || response.resultCode >= 400) console.log(response)
    console.log(response)
    return response
  };
}