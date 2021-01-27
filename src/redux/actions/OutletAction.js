import { CONSTANT } from "../../helpers";
import { MasterDataService } from "../../Services/MasterDataService";
import { isEmptyObject } from "../../helpers/CheckEmpty";
import config from "../../config";
import _ from "lodash";
const geolib = require('geolib')

export const OutletAction = {
  fetchDefaultOutlet,
  fetchAllOutlet,
  fetchSingleOutlet,
  getCoordinates,
  setData,
  getBackupOutlet
};

function fetchDefaultOutlet(defaultOutlet = {}) {
  return async (dispatch) => {
    if (!isEmptyObject(defaultOutlet)) {
      if (defaultOutlet && defaultOutlet.id) defaultOutlet = config.getValidation(defaultOutlet)
      dispatch(setData(defaultOutlet, CONSTANT.DEFAULT_OUTLET));
      return defaultOutlet;
    } else {
      try {
        const position = await dispatch(getCoordinates()); 
        if(position) {
          let location = { latitude: position.coords.latitude, longitude: position.coords.longitude }
          localStorage.setItem(`${config.prefix}_locationCustomer`, JSON.stringify(location));
          return dispatch(getNearsesOutlet(location))
        }
      } catch (error) {
        return dispatch(getNearsesOutlet())
      }
    }
  };
}

function getCoordinates() {
  return async (dispatch) => {
    return new Promise(function(resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }
}

function getNearsesOutlet(position = null) {
  return async (dispatch, getState) => {
    const state = getState();
    
    // FIND ORDER SELECTION TYPE ( MANUAL / NEAREST / DEFAULT )
    let orderModeType = "DEFAULT"
    try{
      if (state.order.setting.length > 0) {
        const find = state.order.setting.find(
          (item) => item.settingKey === "OutletSelection"
        );
        if (find !== undefined) {
          orderModeType = find.settingValue;
        }
        console.log(orderModeType, 'orderModeType')
      }
    }catch(e){}

    let data = {}
    if (orderModeType === 'NEAREST') {
      data = await MasterDataService.api( "POST", position, "outlets/nearestoutlet" );
      if(data.ResultCode === 400) data = await MasterDataService.api( "GET", null, "outlets/defaultoutlet" );
    } else {
      data = await MasterDataService.api( "GET", null, "outlets/defaultoutlet" );
    }

    if (!isEmptyObject(data.data)) {
      if (data.data && data.data.id) data.data = config.getValidation(data.data)
      dispatch(setData(data.data, CONSTANT.DEFAULT_OUTLET));
      return data.data
    }
  }
}

function getBackupOutlet() {
  return async (dispatch) => {
    const data = await MasterDataService.api( "GET", null, `outlets/defaultoutlet` );
    return data;
  };
}

function fetchSingleOutlet(outlet) {
  const OUTLET_ID = outlet.id;
  return async (dispatch) => {
    const data = await MasterDataService.api( "GET", null, `outlets/get/${OUTLET_ID}` );
    if (!isEmptyObject(data.data)) {
      if (data.data && data.data.id) data.data = config.getValidation(data.data)
      dispatch(setData(data.data, CONSTANT.DEFAULT_OUTLET));
      return data.data;
    }
  };
}

function fetchAllOutlet(getDefaultOutlet, locationCustomer) {
  return async (dispatch) => {
    if(!locationCustomer) locationCustomer = JSON.parse(localStorage.getItem(`${config.prefix}_locationCustomer`))

    const data = await MasterDataService.api("POST", null, "outlets/load");
    if (!isEmptyObject(data.data)) {
      let outletData = []
      data.data.forEach(element => {
        if (element && element.id) element = config.getValidation(element)
        if(locationCustomer && element.latitude && element.longitude && getDefaultOutlet){
          let getDistance = (geolib.getDistance(locationCustomer, element) / 1000).toFixed(2)
          element.distance = Number(getDistance)
        }
        element.outletStatus = config.getOutletStatus(element)
        outletData.push(element)
      });

      outletData = _.orderBy(outletData, ['distance'], ['asc'])
      dispatch(setData(outletData, CONSTANT.LIST_OUTLET));
      return outletData;
    }
  };
}

function setData(data, constant) {
  return {
    type: constant,
    data: data,
  };
}
