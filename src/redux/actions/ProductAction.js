import { CONSTANT } from "../../helpers";
import { ProductService } from "../../Services/ProductService";
import { isEmptyArray } from "../../helpers/CheckEmpty";
import config from "../../config";

const PRESET_TYPE = config.prefix === "emenu" ? "eMenu" : "webOrdering";

export const ProductAction = {
  fetchCategoryProduct,
  fetchProduct,
  fetchCategoryList,
  getCollection,
  setSelectedCategory,
  fetchProductList,
  setProductList,
  isParentCategory
};

function fetchCategoryProduct(outlet, payload) {
  try {
    if (outlet.id) {
      const OUTLET_ID = outlet.id;

      if (!payload) {
        payload = { take: 500, skip: 0 }
      }

      return async (dispatch) => {
        const data = await ProductService.api(
          "POST",
          payload,
          `productpreset/loadcategory/${PRESET_TYPE}/${OUTLET_ID}`
        );
        if (!isEmptyArray(data.data)) {
          dispatch(setData(data.data, CONSTANT.LIST_CATEGORY));
          return data;
        } else {
          return [];
        }
      };
    }
  } catch (error) {}
}

function setSelectedCategory(category) {
  return (dispatch) => {
    dispatch(setData(category, "SET_SELECTED_CATEGORY"));
  };
}

function isParentCategory(parentCategoryID) {
  return async (dispatch) => {
    let payload = { take: 1, skip: 0 }
    payload.parentCategoryID = parentCategoryID;

    const data = await ProductService.api(
      "POST",
      payload,
      `category/load`
    );
    if (isEmptyArray(data.data)) {
      return false
    } else {
      return true
    }
  };
}

function fetchCategoryList(payload, parentCategoryID = null) {
  return async (dispatch) => {
    if (!payload) {
      payload = { take: 500, skip: 0 }
    }

    if (parentCategoryID !== undefined) {
      payload.parentCategoryID = parentCategoryID;
    }
  
    const data = await ProductService.api(
      "POST",
      payload,
      `category/load`
    );
    if (!isEmptyArray(data.data)) {
      dispatch(setData(data.data, "SET_CATEGORY_LIST"));
      return data.data;
    } else {
      return [];
    }
  };
}

function fetchProduct(category, outlet, skip, take) {
  const OUTLET_ID = outlet.id;
  const categoryID = category.id;
  const payload = {
    skip,
    take,
  };
  return async (dispatch) => {
    dispatch(fetchProductStarted());
    const data = await ProductService.api(
      "POST",
      payload,
      `productpreset/loaditems/${PRESET_TYPE}/${OUTLET_ID}/${categoryID}`
    );
    if (!isEmptyArray(data.data)) {
      dispatch(fetchProductSuccess(data.data));
      return data;
    } else if (data.resultCode !== 200) {
      dispatch(
        fetchProductError(data || { message: "Failed to fetch product" })
      );
      return [];
    } else {
      return data;
    }
  };
}

function fetchProductList(filter, sort) {
  return async (dispatch) => {
    const payload = { ...filter, ...sort };
    dispatch(fetchProductCategoryStarted());
    dispatch(clearCategoryProducts());
    const response = await ProductService.api("POST", payload, `product/load`);
    // console.log(response, 'responseresponseresponse')
    if (response.statusCode >= 400 || response.StatusCode >= 400)
      dispatch(
        fetchProductError({
          message: response.message || "Failed to load product",
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

const clearCategoryProducts = () => ({ type: "CLEAR_CATEGORY_PRODUCTS" });
const fetchProductStarted = () => ({ type: "GET_PRODUCT_LIST_STARTED" });
const fetchProductCategoryStarted = () => ({ type: "GET_PRODUCT_CATEGORY_STARTED" });
const fetchProductCategorySuccess = (data) => ({
  type: "GET_PRODUCT_CATEGORY_SUCCESS",
  data,
});
const fetchProductSuccess = (data) => ({
  type: "GET_PRODUCT_LIST_SUCCESS",
  data,
});
const fetchProductError = (error) => ({
  type: "GET_PRODUCT_LIST_ERROR",
  error,
});

function getCollection(id) {
  return async (dispatch) => {
    try {
      let response = await ProductService.api(
        "GET",
        null,
        `collection/get/${id}`,
        "Bearer"
      );
      if (response.resultCode !== 200) return {};
      return response.data;
    } catch (error) {}
  };
}

function setData(data, constant) {
  return {
    type: constant,
    data: data,
  };
}
