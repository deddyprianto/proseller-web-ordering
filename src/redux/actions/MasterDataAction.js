import { MasterDataService } from '../../Services/MasterDataService';
import { ProductService } from '../../Services/ProductService';
import { CONSTANT } from '../../helpers';
import config from '../../config';

const PRESET_TYPE = config.prefix === 'emenu' ? 'eMenu' : 'webOrdering';

function setData(data, constant) {
  return {
    type: constant,
    data: data,
  };
}

function getProductByOutletID(id) {
  return async (dispatch) => {
    if (id !== undefined) {
      let response = await ProductService.api(
        'POST',
        null,
        `productpreset/load/${PRESET_TYPE}/${id}`,
        'Bearer'
      );
      if (response.ResultCode >= 400 || response.resultCode >= 400)
        console.log(response);
      dispatch(setData(response.data, CONSTANT.DATA_PRODUCT));
      return response.data;
    }
  };
}

function getAddressLocation(
  countryCode = null,
  provinceCode = null,
  cityCode = null
) {
  return async () => {
    let url = 'addresslocation/';
    let prefix = '';
    if (countryCode) prefix = `${prefix}${countryCode}/`;
    if (provinceCode) prefix = `${prefix}${provinceCode}/`;
    if (cityCode) prefix = `${prefix}${cityCode}/`;

    url = url + prefix;
    // console.log(url)
    let response = await MasterDataService.api('GET', null, url, 'Bearer');
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    return response;
  };
}

function getInfoCompany() {
  return async (dispatch) => {
    dispatch({ type: 'GET_COMPANY_INFO' });
    let response = await MasterDataService.api('GET', null, 'info/company');
    if (response.ResultCode === 400) {
      dispatch({ type: 'GET_COMPANY_INFO_FAILED' });
    } else {
      if (response.data && response.data.countryCode === 'ID') {
        response.data.currency = {
          symbol: 'Rp.',
          code: 'IDR',
          locale: 'id-ID',
        };
      }
      if (response.data && response.data.countryCode === 'SG') {
        response.data.currency = { symbol: '$', code: 'SGD', locale: 'en-US' };
      }
      dispatch({ type: 'GET_COMPANY_INFO_SUCCESS', payload: response.data });
    }
    response = response.data;
    return response;
  };
}

function getOutletByID(id, isProduct = true) {
  return async (dispatch) => {
    if (id !== undefined) {
      const isOutletChanged = await localStorage.getItem(
        `${config.prefix}_isOutletChanged`
      );
      const newOutletID = await localStorage.getItem(
        `${config.prefix}_outletChangedFromHeader`
      );
      if (isOutletChanged === 'true') {
        if (newOutletID !== undefined && newOutletID !== null) id = newOutletID;
      }

      let response = await MasterDataService.api(
        'GET',
        null,
        `outlets/get/${id}`,
        'Bearer'
      );
      if (response.ResultCode >= 400 || response.resultCode >= 400)
        console.log(response);
      else if (isProduct) dispatch(getProductByOutletID(id));

      if (response.data && response.data.id)
        response.data = config.getValidation(response.data);
      dispatch(setData(response.data, CONSTANT.DEFAULT_OUTLET));
      return response.data;
    }
  };
}

function setDefaultOutlet(outlet) {
  return async (dispatch) => {
    dispatch(setData(outlet, CONSTANT.DEFAULT_OUTLET));
  };
}

function getDomainName() {
  return async (dispatch) => {
    const domainName =
      window.location.hostname !== "localhost"
        ? window.location.hostname
        : "ordering-pink-city.proseller-demo.com";
    try {
      fetch(process.env.REACT_APP_DOMAIN_MAPPING_URL, {
        method: 'POST',
        body: JSON.stringify({
          domainName,
        }),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.data && data.data.sortKey) {
            dispatch({ type: 'SET_DOMAIN_NAME', payload: data.data.sortKey });
          } else {
            dispatch({ type: 'SET_DOMAIN_NAME', payload: 'NOT_FOUND' });
          }
        })
        .catch(function (e) {
          console.log(e);
          dispatch({ type: 'SET_DOMAIN_NAME', payload: 'NOT_FOUND' });
          return { ResultCode: 400, message: 'fetch api error' };
        });
    } catch (error) {
      throw new Error(error);
    }
  };
}

export const MasterDataAction = {
  getAddressLocation,
  getInfoCompany,
  getOutletByID,
  getProductByOutletID,
  setDefaultOutlet,
  getDomainName,
};
