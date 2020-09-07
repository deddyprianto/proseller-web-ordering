import { CONSTANT } from "../../helpers";
import { MasterDataService } from "../../Services/MasterDataService";
import { isEmptyObject } from '../../helpers/CheckEmpty';
import { ProductAction } from './ProductAction';


export const OutletAction = {
  fetchDefaultOutlet,
  fetchAllOutlet,
  fetchSingleOutlet
};

function fetchDefaultOutlet(defaultOutlet = {}) {
  return async dispatch => {
    if (!isEmptyObject(defaultOutlet)) {
      dispatch(setData(defaultOutlet, CONSTANT.DEFAULT_OUTLET))
      return defaultOutlet;
    } else {
      const data = await MasterDataService.api('GET', null, 'outlets/defaultoutlet');
      if (!isEmptyObject(data.data)) {
        dispatch(setData(data.data, CONSTANT.DEFAULT_OUTLET))
        return data.data;
      }
    }
  }
}

function fetchSingleOutlet(outlet) {
  const OUTLET_ID = outlet.id;
  return async dispatch => {
    const data = await MasterDataService.api('GET', null, `outlets/get/${OUTLET_ID}`);
    if (!isEmptyObject(data.data)) {
      dispatch(setData(data.data, CONSTANT.DEFAULT_OUTLET))
      return data.data;
    }
  }
}

function fetchAllOutlet() {
  return async dispatch => {
    const data = await MasterDataService.api('POST', null, 'outlets/load');
    if (!isEmptyObject(data.data)) {
      dispatch(setData(data.data, CONSTANT.LIST_OUTLET))
      return data.data;
    }
  }
}

function setData(data, constant) {
  return {
    type: constant,
    data: data,
  };
}
