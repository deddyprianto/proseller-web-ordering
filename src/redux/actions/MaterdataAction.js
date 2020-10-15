import { MasterDataService } from "../../Services/MasterDataService";
import { ProductService } from "../../Services/ProductService";
import { AuthActions } from "./AuthAction";
import { CONSTANT } from "../../helpers";

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
      await dispatch(AuthActions.refreshToken());
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
      // if (
      //   response.data &&
      //   response.data.companyId ===
      //     "company::e902cee7-6650-447e-989a-9209944192fc"
      // ) {
      //   console.log("this is auntieanne");
      //   dispatch({ type: "SET_THEME", data: "#003da5" });
      // }
    }
    response = response.data;
    return response;
  };
}

function getOutletByID(id, isProduct = true) {
  return async (dispatch) => {
    let response = await MasterDataService.api(
      "GET",
      null,
      `outlets/get/${id}`,
      "Bearer"
    );
    let product = []
    if (response.ResultCode >= 400 || response.resultCode >= 400) await dispatch(AuthActions.refreshToken());
    else if (isProduct) product = dispatch(getProductByOutletID(id));
    dispatch(setData(response.data, CONSTANT.DEFAULT_OUTLET));
    // console.log(product)
    return response.data;
  };
}

function getProductByOutletID(id) {
  return async (dispatch) => {
    let response = await ProductService.api(
      "POST",
      null,
      `productpreset/load/CRM/${id}`,
      "Bearer"
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      await dispatch(AuthActions.refreshToken());
    dispatch(setData(response.data, CONSTANT.DATA_PRODUCT));
    return response.data;
  };
}

function setData(data, constant) {
  return {
    type: constant,
    data: data,
  };
}
