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

async function getProductPreset(categories, outlet, dispatch) {
  let products = [];
  for (let i = 0; i < categories.length; i++) {
    let data = await fetchProduct(categories[i], outlet, 0, 5)
    let items = {
      category: categories[i],
      items: data.data
    };

    products.push(items);
    returnData(products);

    dispatch(setData(products, CONSTANT.LIST_PRODUCT));
    if (data.dataLength > 0) {
      for (let j = 5; j <= data.dataLength; j += 5) {
        let product = await fetchProduct(categories[i], outlet, j, 5)
        products[i].items = [...products[i].items, ...product.data];

        returnData(products);
        dispatch(setData(products, CONSTANT.LIST_PRODUCT));
      }
    }
  }
}

function returnData(data) {
  return data;
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
