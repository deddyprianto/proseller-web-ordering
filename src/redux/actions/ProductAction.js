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
};

function fetchCategoryProduct(outlet) {
  try {
    if (outlet.id) {
      const OUTLET_ID = outlet.id;

      return async (dispatch) => {
        const data = await ProductService.api(
          "POST",
          { take: 500, skip: 0 },
          `productpreset/loadcategory/${PRESET_TYPE}/${OUTLET_ID}`
        );
        if (!isEmptyArray(data.data)) {
          dispatch(setData(data.data, CONSTANT.LIST_CATEGORY));
          return data.data;
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

function fetchCategoryList() {
  return async (dispatch) => {
    const data = await ProductService.api(
      "POST",
      { take: 500, skip: 0 },
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
    } else {
      dispatch(
        fetchProductError(data || { message: "Failed to fetch product" })
      );
      return [];
    }
  };
}

function fetchProductList(filter, sort) {
  return async (dispatch) => {
    const payload = { ...filter, ...sort };
    dispatch(fetchProductStarted());
    const response = await ProductService.api("POST", payload, `product/load`);
    if (response.statusCode >= 400 || response.StatusCode >= 400)
      dispatch(
        fetchProductError({
          message: response.message || "Failed to load product",
        })
      );
    else {
      dispatch(fetchProductSuccess(response.data));
    }
  };
}

const fetchProductStarted = () => ({ type: "GET_PRODUCT_LIST_STARTED" });
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
