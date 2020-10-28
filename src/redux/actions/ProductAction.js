import { CONSTANT } from "../../helpers";
import { ProductService } from "../../Services/ProductService";
import { isEmptyArray } from '../../helpers/CheckEmpty';

export const ProductAction = {
  fetchCategoryProduct,
  fetchProduct,
};

function fetchCategoryProduct(outlet) {
  try {
    if(outlet.id){
      const PRESET_TYPE = 'CRM';
      const OUTLET_ID = outlet.id;
  
      return async dispatch => {
        const data = await ProductService.api('POST', { take: 100, skip: 0 }, `productpreset/loadcategory/${PRESET_TYPE}/${OUTLET_ID}`);
        if (!isEmptyArray(data.data)) {
          dispatch(setData(data.data, CONSTANT.LIST_CATEGORY));
          return data.data;
        } else {
          return [];
        }
      }
    }
  } catch (error) { }
}


function fetchProduct(category, outlet, skip, take) {
  const PRESET_TYPE = 'CRM';
  const OUTLET_ID = outlet.id;
  const categoryID = category.id;
  const payload = {
    skip,
    take
  }

  return async dispatch => {
    const data = await ProductService.api('POST', payload, `productpreset/loaditems/${PRESET_TYPE}/${OUTLET_ID}/${categoryID}`);
    return data;
  }

}

function setData(data, constant) {
  return {
    type: constant,
    data: data,
  };
}
