import { isEmptyArray } from './CheckEmpty';

const getInitialProductValue = (productSelected, mode) => {
  let product = JSON.stringify(productSelected);
  product = JSON.parse(product);
  try {
    product.product.productModifiers.forEach((group, i) => {
      if (!isEmptyArray(group.modifier.details))
        group.modifier.details.forEach((detail, j) => {
          delete detail.quantity;

          if (group.modifier.min !== 0 && group.modifier.min !== undefined) {
            product.product.productModifiers[i].modifier.show = true;
          } else {
            product.product.productModifiers[i].modifier.show = false;
          }

          if (
            group.modifier.isYesNo === true &&
            detail.orderingStatus === 'AVAILABLE'
          ) {
            if (
              group.modifier.yesNoDefaultValue === true &&
              detail.yesNoValue === 'no'
            ) {
              product.product.productModifiers[i].modifier.details[
                j
              ].isSelected = true;
            }

            if (
              group.modifier.yesNoDefaultValue === false &&
              detail.yesNoValue === 'yes'
            ) {
              product.product.productModifiers[i].modifier.details[
                j
              ].isSelected = false;
            }
          }
          if (group.modifier.min === 1 && group.modifier.max === 1) {
            product.product.productModifiers[i].modifier.details[
              j
            ].isSelected = false;
          }
        });
    });
  } catch (e) {
    console.log(e);
  }

  product.quantity = 1;
  product.remark = '';
  product.mode = mode;
  return product;
};

const getFormattedPrice = (price, currency) => {
  if (!price || price === '-') price = 0;
  let result = price.toLocaleString(currency.locale, {
    style: 'currency',
    currency: currency.code,
  });
  return result;
};

export { getInitialProductValue, getFormattedPrice };
