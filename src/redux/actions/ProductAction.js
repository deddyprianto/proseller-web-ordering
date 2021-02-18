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
    const data = await ProductService.api(
      "POST",
      payload,
      `productpreset/loaditems/${PRESET_TYPE}/${OUTLET_ID}/${categoryID}`
    );
    return data;
  };
}

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
