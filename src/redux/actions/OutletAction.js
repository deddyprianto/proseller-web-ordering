import { CONSTANT } from '../../helpers';
import { MasterDataService } from '../../Services/MasterDataService';
import { isEmptyObject } from '../../helpers/CheckEmpty';
import config from '../../config';
import _ from 'lodash';
import moment from 'moment-timezone';
const geolib = require('geolib');

const orderingModesField = [
  { isEnabledFieldName: 'enableStorePickUp', name: 'STOREPICKUP' },
  { isEnabledFieldName: 'enableStoreCheckOut', name: 'STORECHECKOUT' },
  { isEnabledFieldName: 'enableDelivery', name: 'DELIVERY' },
  { isEnabledFieldName: 'enableTakeAway', name: 'TAKEAWAY' },
  { isEnabledFieldName: 'enableDineIn', name: 'DINEIN' },
];

function setData(data, constant) {
  return {
    type: constant,
    data: data,
  };
}

function getCoordinates() {
  return async () => {
    const position = await new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    if (position) {
      const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      localStorage.setItem(
        `${config.prefix}_locationCustomer`,
        JSON.stringify(location)
      );
    }
  };
}

function setDefaultOutlet(outlet) {
  return async (dispatch) => {
    const orderingModesFieldFiltered = orderingModesField.filter(
      (mode) => outlet[mode.isEnabledFieldName]
    );
    const orderingModesMapped = orderingModesFieldFiltered.map(
      (mode) => mode.name
    );
    dispatch({ type: 'SET_ORDERING_MODES', payload: orderingModesMapped });
    dispatch(setData(outlet, CONSTANT.DEFAULT_OUTLET));
  };
}

function getNearsesOutlet(position = null) {
  return async (dispatch, getState) => {
    const state = getState();

    // FIND ORDER SELECTION TYPE ( MANUAL / NEAREST / DEFAULT )
    let orderModeType = 'DEFAULT';
    try {
      if (state.order.setting.length > 0) {
        const find = state.order.setting.find(
          (item) => item.settingKey === 'OutletSelection'
        );
        if (find !== undefined) {
          orderModeType = find.settingValue;
        }
        console.log(orderModeType, 'orderModeType');
      }
    } catch (e) {
      console.log(e);
    }

    let data = {};
    if (orderModeType === 'NEAREST') {
      data = await MasterDataService.api(
        'POST',
        position,
        'outlets/nearestoutlet'
      );
      if (data.ResultCode === 400)
        data = await MasterDataService.api(
          'GET',
          null,
          'outlets/defaultoutlet'
        );
    } else {
      data = await MasterDataService.api('GET', null, 'outlets/defaultoutlet');
    }

    if (!isEmptyObject(data.data)) {
      if (data.data && data.data.id)
        data.data = config.getValidation(data.data);
      dispatch(setData(data.data, CONSTANT.DEFAULT_OUTLET));
      const orderingModesFieldFiltered = orderingModesField.filter(
        (mode) => data.data[mode.isEnabledFieldName]
      );
      const orderingModesMapped = orderingModesFieldFiltered.map(
        (mode) => mode.name
      );
      dispatch({ type: 'SET_ORDERING_MODES', payload: orderingModesMapped });
      return data.data;
    }
  };
}

function fetchDefaultOutlet(defaultOutlet = {}) {
  return async (dispatch) => {
    if (!isEmptyObject(defaultOutlet)) {
      if (defaultOutlet && defaultOutlet.id)
        defaultOutlet = config.getValidation(defaultOutlet);
      dispatch(setData(defaultOutlet, CONSTANT.DEFAULT_OUTLET));
      const orderingModesFieldFiltered = orderingModesField.filter(
        (mode) => defaultOutlet[mode.isEnabledFieldName]
      );
      const orderingModesMapped = orderingModesFieldFiltered.map(
        (mode) => mode.name
      );
      dispatch({ type: 'SET_ORDERING_MODES', payload: orderingModesMapped });
      return defaultOutlet;
    } else {
      try {
        let position = JSON.parse(
          localStorage.getItem(`${config.prefix}_locationCustomer`)
        );
        let location = {};

        if (!position) {
          dispatch(getCoordinates());
          return dispatch(getNearsesOutlet(location));
        } else {
          location = {
            latitude: position.latitude,
            longitude: position.longitude,
          };
        }
        return dispatch(getNearsesOutlet(location));
        // const position = await dispatch(getCoordinates());
        // if (position) {
        //   let location = {
        //     latitude: position.coords.latitude,
        //     longitude: position.coords.longitude,
        //   };
        //   localStorage.setItem(
        //     `${config.prefix}_locationCustomer`,
        //     JSON.stringify(location)
        //   );
        //   return dispatch(getNearsesOutlet(location));
        // }
        // return dispatch(getNearsesOutlet());
      } catch (error) {
        return dispatch(getNearsesOutlet());
      }
    }
  };
}

function getBackupOutlet() {
  return async () => {
    const data = await MasterDataService.api(
      'GET',
      null,
      'outlets/defaultoutlet'
    );
    return data;
  };
}

function fetchSingleOutlet(outlet) {
  const OUTLET_ID = outlet.id;
  return async (dispatch) => {
    const data = await MasterDataService.api(
      'GET',
      null,
      `outlets/get/${OUTLET_ID}`
    );
    if (!isEmptyObject(data.data)) {
      if (data.data && data.data.id)
        data.data = config.getValidation(data.data);
      dispatch(setData(data.data, CONSTANT.DEFAULT_OUTLET));
      const orderingModesFieldFiltered = orderingModesField.filter(
        (mode) => data.data[mode.isEnabledFieldName]
      );
      const orderingModesMapped = orderingModesFieldFiltered.map(
        (mode) => mode.name
      );
      dispatch({ type: 'SET_ORDERING_MODES', payload: orderingModesMapped });
      return data.data;
    }
  };
}

function fetchAllOutlet(getDefaultOutlet, locationCustomer) {
  return async (dispatch) => {
    if (!locationCustomer)
      locationCustomer = JSON.parse(
        localStorage.getItem(`${config.prefix}_locationCustomer`)
      );

    const res = await MasterDataService.api('POST', null, 'outlets/load');
    if (!isEmptyObject(res.data)) {
      const unsortedOutlets = res.data.map((outlet) => {
        const outletStatus = getOutletStatus(outlet);
        const { orderValidation } = config.getValidation(outlet);

        if (
          !locationCustomer ||
          !outlet.latitude ||
          !outlet.longitude ||
          !getDefaultOutlet
        ) {
          return { ...outlet, orderValidation, outletStatus };
        }

        const distance = Number(
          (geolib.getDistance(locationCustomer, outlet) / 1000).toFixed(2)
        );

        return { ...outlet, orderValidation, outletStatus, distance };
      });

      const outlets = _.orderBy(unsortedOutlets, ['distance'], ['asc']);
      dispatch(setData(outlets, CONSTANT.LIST_OUTLET));
      return outlets;
    }
  };
}

function getOutletById(id) {
  return async () => {
    const data = await MasterDataService.api('GET', null, `outlets/get/${id}`);

    if (data?.resultCode === 200) {
      return data?.data;
    } else {
      return null;
    }
  };
}

function getOperationalHours(outlet) {
  try {
    /**
     * @type number
     * @description Outlet's UTC offset.
     * TODO: Read from Outlet Timezone setting;
     */
    const OUTLET_TIMEZONE = 'Asia/Singapore';

    const { operationalHours } = outlet;

    /**
     * @type moment
     * @description Current client's date and time converted to outlet's timezone.
     */
    const now = moment().tz(OUTLET_TIMEZONE);

    const todaysDate = now.format('YYYY-MM-DD');
    const todaysDayOfWeek = now.day();

    /**
     * @type object
     * @description Today's operational hours. If `null` or `undefined`, it means the outlet currently closed.
     */
    const todaysOperationalHours = operationalHours.find((item) => {
      const { active, day } = item;
      const dayOfWeek = parseInt(day);
      return active && dayOfWeek === todaysDayOfWeek;
    });

    if (!todaysOperationalHours) {
      return { isOpen: false };
    }

    const { open, close } = todaysOperationalHours;

    const openAt = moment.tz(`${todaysDate} ${open}`, OUTLET_TIMEZONE);

    const closedAt = moment.tz(`${todaysDate} ${close}`, OUTLET_TIMEZONE);

    const isOpen = now.isBetween(openAt, closedAt);

    return { openAt, closedAt, isOpen };
  } catch (e) {
    console.log('error:getOperationalHours');
    console.log('params:outlet', outlet);
    console.log(e);
    return { isOpen: false };
  }
}

function getOutletStatus(outlet) {
  try {
    if (outlet.openAllDays) {
      return true;
    }

    if (
      outlet &&
      outlet.operationalHours &&
      outlet.operationalHours.length > 0
    ) {
      const { isOpen, openAt, closedAt } = getOperationalHours(outlet);
      return isOpen;
    }

    return false;
  } catch (e) {
    console.log('error:getOutletStatus');
    console.log('params:outlet', outlet);
    console.log(e);
    return false;
  }
}

export const OutletAction = {
  getOutletById,
  fetchDefaultOutlet,
  fetchAllOutlet,
  fetchSingleOutlet,
  getCoordinates,
  setData,
  getBackupOutlet,
  setDefaultOutlet,
};
