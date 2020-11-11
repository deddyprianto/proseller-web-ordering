import { MasterDataService } from "../../Services/MasterDataService";
import { ProductService } from "../../Services/ProductService";
import { CONSTANT } from "../../helpers";
import config from "../../config";

const PRESET_TYPE = config.prefix === "emenu" ? "eMenu" : "webOrdering";

export const MasterdataAction = {
  getAddressLocation,
  getInfoCompany,
  getOutletByID,
  getProductByOutletID,
};

function getAddressLocation(
  countryCode = null,
  provinceCode = null,
  cityCode = null
) {
  return async (dispatch) => {
    let url = `addresslocation/`;
    let prefix = "";
    if (countryCode) prefix = `${prefix}${countryCode}/`;
    if (provinceCode) prefix = `${prefix}${provinceCode}/`;
    if (cityCode) prefix = `${prefix}${cityCode}/`;

    url = url + prefix;
    // console.log(url)
    let response = await MasterDataService.api("GET", null, url, "Bearer");
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    return response;
  };
}

function getInfoCompany() {
  return async (dispatch) => {
    dispatch({ type: "GET_COMPANY_INFO" });
    let response = await MasterDataService.api("GET", null, "info/company");
    if (response.ResultCode === 400) {
      dispatch({ type: "GET_COMPANY_INFO_FAILED" });
    } else {
      if (response.data && response.data.countryCode === "ID") {
        response.data.currency = {
          symbol: "Rp.",
          code: "IDR",
          locale: "id-ID",
        };
      }
      if (response.data && response.data.countryCode === "SG") {
        response.data.currency = { symbol: "$", code: "SGD", locale: "en-US" };
      }
      dispatch({ type: "GET_COMPANY_INFO_SUCCESS", payload: response.data });
    }
    response = response.data;
    return response;
  };
}

function getOutletByID(id, isProduct = true) {
  return async (dispatch) => {
    if(id !== undefined){
      let response = await MasterDataService.api( "GET", null, `outlets/get/${id}`, "Bearer" );
      if (response.ResultCode >= 400 || response.resultCode >= 400) console.log(response);
      else if (isProduct) dispatch(getProductByOutletID(id));
  
      if (response.data && response.data.id) response.data = config.getValidation(response.data)
      dispatch(setData(response.data, CONSTANT.DEFAULT_OUTLET));
      return response.data;
    }
  };
}

function getProductByOutletID(id) {
  return async (dispatch) => {
    if(id !== undefined) {
      let response = await ProductService.api( "POST", null, `productpreset/load/${PRESET_TYPE}/${id}`, "Bearer" );
      if (response.ResultCode >= 400 || response.resultCode >= 400) console.log(response);
      dispatch(setData(response.data, CONSTANT.DATA_PRODUCT));
      return response.data;
    }
  };
}

function setData(data, constant) {
  return {
    type: constant,
    data: data,
  };
}
