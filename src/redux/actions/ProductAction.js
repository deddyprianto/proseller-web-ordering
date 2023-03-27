import { CONSTANT } from '../../helpers';
import { ProductService } from '../../Services/ProductService';
import { isEmptyArray } from '../../helpers/CheckEmpty';
import config from '../../config';


const PRESET_TYPE = 'webOrdering';

const clearCategoryProducts = () => ({ type: 'CLEAR_CATEGORY_PRODUCTS' });
const fetchProductStarted = () => ({ type: 'GET_PRODUCT_LIST_STARTED' });
const fetchProductCategoryStarted = () => ({
  type: 'GET_PRODUCT_CATEGORY_STARTED',
});
const fetchProductCategorySuccess = (data) => ({
  type: 'GET_PRODUCT_CATEGORY_SUCCESS',
  data,
});
const fetchProductSuccess = (data) => ({
  type: 'GET_PRODUCT_LIST_SUCCESS',
  data,
});
const fetchProductError = (error) => ({
  type: 'GET_PRODUCT_LIST_ERROR',
  error,
});

function isParentCategory(parentCategoryID) {
  return async () => {
    let payload = { take: 1, skip: 0 };
    payload.parentCategoryID = parentCategoryID;

    const data = await ProductService.api('POST', payload, 'category/load');
    if (isEmptyArray(data.data)) {
      return false;
    } else {
      return true;
    }
  };
}

function getCollection(id) {
  return async () => {
    try {
      let response = await ProductService.api(
        'GET',
        null,
        `collection/get/${id}`,
        'Bearer'
      );
      if (response.resultCode !== 200) return {};
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };
}

function setData(data, constant) {
  return {
    type: constant,
    data: data,
  };
}

function fetchCategoryProduct({ outlet, payload, orderingMode, presetType }) {
  try {
    if (outlet.id) {
      const OUTLET_ID = outlet.id;
      if (!payload) {
        payload = { take: 500, skip: 0 };
      }
      let preset = PRESET_TYPE;
      if (presetType) preset = presetType;
      return async (dispatch) => {
        const data = await ProductService.api(
          'POST',
          payload,
          `productpreset/loadcategory/${preset}/${OUTLET_ID}${
            orderingMode ? '/' + orderingMode : ''
          }`
        );
        if (!isEmptyArray(data.data)) {
          if (presetType === 'appointment') {
            dispatch({
              type: CONSTANT.LIST_CATEGORY_APPOINTMENT,
              data: data.data,
            });
          } else {
            dispatch(setData(data.data, CONSTANT.LIST_CATEGORY));
          }
          return data;
        } else {
          return [];
        }
      };
    }
  } catch (error) {
    console.log(error);
  }
}

function fetchProductList(filter, sort) {
  return async (dispatch) => {
    const payload = { ...filter, ...sort };
    dispatch(fetchProductCategoryStarted());
    dispatch(clearCategoryProducts());
    const response = await ProductService.api('POST', payload, 'product/load');
    if (response.statusCode >= 400 || response.StatusCode >= 400)
      dispatch(
        fetchProductError({
          message: response.message || 'Failed to load product',
        })
      );
    else {
      dispatch(fetchProductCategorySuccess(response.data));
    }
  };
}

function setProductList(data) {
  return async (dispatch) => {
    dispatch(fetchProductCategorySuccess(data));
  };
}

function fetchCategoryList(payload, parentCategoryID = null) {
  return async (dispatch) => {
    if (!payload) {
      payload = { take: 500, skip: 0 };
    }

    if (parentCategoryID !== undefined) {
      payload.parentCategoryID = parentCategoryID;
    }

    const data = await ProductService.api('POST', payload, 'category/load');
    if (!isEmptyArray(data.data)) {
      dispatch(setData(data.data, 'SET_CATEGORY_LIST'));
      return data.data;
    } else {
      return [];
    }
  };
}

function setSelectedCategory(category) {
  return (dispatch) => {
    dispatch(setData(category, 'SET_SELECTED_CATEGORY'));
  };
}

function fetchProduct(category, outlet, skip, take, orderingMode) {
  const OUTLET_ID = outlet.id;
  const categoryID = category.id;
  let presetType = PRESET_TYPE;
  if (category.presetType) presetType = category.presetType;
  const payload = {
    skip,
    take,
  };
  return async (dispatch) => {
    dispatch(fetchProductStarted());
    const data = await ProductService.api(
      'POST',
      payload,
      `productpreset/loaditems/${presetType}/${OUTLET_ID}/${categoryID}${
        orderingMode ? '/' + orderingMode : ''
      }`
    );
    if (!isEmptyArray(data.data)) {
      dispatch(fetchProductSuccess(data.data));
      return data;
    } else if (data.resultCode !== 200) {
      dispatch(
        fetchProductError(data || { message: 'Failed to fetch product' })
      );
      return [];
    } else {
      return data;
    }
  };
}
function fetchProductAppointment({
  category,
  outlet,
  skip,
  take,
  presetTypeName,
}) {
  console.log({ category });
  const OUTLET_ID = outlet.id;
  const categoryID = category?.id;
  const payload = {
    skip,
    take,
  };
  return async (dispatch) => {
    dispatch(fetchProductStarted());
    const response = await ProductService.api(
      'POST',
      payload,
      `productpreset/loaditems/${presetTypeName}/${OUTLET_ID}/${categoryID}`
    );
    if (response.ResultCode >= 400) {
      dispatch(
        fetchProductError(response || { message: 'Failed to fetch product' })
      );
      return [];
    } else {
      dispatch({
        type: CONSTANT.LIST_SERVICE_APPOINTMENT,
        data: response.data,
      });
      return response;
    }
  };
}

export const ProductAction = {
  setData,
  fetchCategoryProduct,
  fetchProduct,
  fetchProductAppointment,
  fetchCategoryList,
  getCollection,
  setSelectedCategory,
  fetchProductList,
  setProductList,
  isParentCategory,
};
