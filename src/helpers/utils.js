/**
 * ----------------------------------------------------------------------------------------------
 * Utils Collections
 * ----------------------------------------------------------------------------------------------
 */

/**
 * example:
 * isEmpty(object)
 */

export const isEmpty = (value) => {
  return (
    value == null || // Handles null and undefined
    ((value instanceof Map ||
      value instanceof Set ||
      typeof value === 'object') &&
      Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0) ||
    (Array.isArray(value) && value.length === 0)
  );
};

/**
 * example:
 * orderBy(data, ['name'], ['asc']);
 *
 * note:
 * did not support multiple order field yet
 */

export const orderBy = (data, props = [], orders = []) => {
  function compareProperties(a, b, prop, order) {
    // Get the values of the properties
    const aValue = a[prop];
    const bValue = b[prop];
    // Compare the values based on the specified order
    if (order === 'desc') {
      return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
    } else {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    }
  }

  return data.sort((a, b) => {
    // Compare each property in the specified order
    let result = compareProperties(a, b, props[0], orders[0]);
    if (result !== 0) return result;

    return 0;
  });
};

/**
 * example:
 * isEqual(object, object)
 */

export const isEqual = (value1, value2) => {
  return JSON.stringify(value1) === JSON.stringify(value2);
};

/**
 * example:
 * cloneDeep(object)
 */

export const cloneDeep = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * example:
 * isMatch(object, source)
 */

export const isMatch = (obj, source) => {
  return Object.keys(source).every((key) => {
    return obj.hasOwnProperty(key) && obj[key] === source[key];
  });
};

/**
 * example:
 * sumBy(arr, (val) => {return val.amount})
 */

export const sumBy = (arr, func) => {
  return arr.reduce((acc, item) => acc + func(item), 0);
};
