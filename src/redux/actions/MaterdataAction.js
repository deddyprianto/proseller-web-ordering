import { MasterDataService } from "../../Services/MasterDataService";
import { ProductService } from "../../Services/ProductService";
import { AuthActions } from "./AuthAction";
import _ from 'lodash';
import { CONSTANT } from "../../helpers";

export const MasterdataAction = {
  getAddressLocation,
  getInfoCompany,
  getOutletByID,
  getProductByOutletID,
};

function getAddressLocation(countryCode = null, provinceCode = null, cityCode = null) {
  return async (dispatch) => {
    let url = `addresslocation/`;
    let prefix = ""
    if (countryCode) prefix = `${prefix}${countryCode}/`
    if (provinceCode) prefix = `${prefix}${provinceCode}/`
    if (cityCode) prefix = `${prefix}${cityCode}/`

    url = url + prefix
    // console.log(url)
    let response = await MasterDataService.api('GET', null, url, 'Bearer')
    if (response.ResultCode === 400) await dispatch(AuthActions.refreshToken())
    return response
  };
}

function getInfoCompany() {
  return async (dispatch) => {
    let response = await MasterDataService.api('GET', null, 'info/company')
    response = response.data
    return response
  };
}

function getOutletByID(id, isProduct = true) {
  return async (dispatch) => {
    let response = await MasterDataService.api('GET', null, `outlets/get/${id}`, 'Bearer')
    if (response.resultCode === 400) await dispatch(AuthActions.refreshToken())
    else if (isProduct) dispatch(getProductByOutletID(id))
    return response.data
  };
}

function getProductByOutletID(id) {
  return async (dispatch) => {
    let response = await ProductService.api('POST', null, `productpreset/load/CRM/${id}`, 'Bearer')
    if (response.resultCode === 400) await dispatch(AuthActions.refreshToken())
    dispatch(setData(response.data, CONSTANT.DATA_PRODUCT));
    return response.data
  };
}

function setData(data, constant) {
  return {
    type: constant,
    data: data,
  };
}