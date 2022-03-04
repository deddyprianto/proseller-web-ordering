module.exports = {
  isEmptyObject: (obj) => {
    for (var key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) return false;
    }
    return true;
  },
  isEmptyArray: (arr) => {
    let data = Array.isArray(arr) && arr.length;
    if (data > 0) {
      return false;
    }
    return true;
  },
  isEmptyData: (data) => {
    if (data !== undefined && data !== '' && data !== null) {
      return false;
    }
    return true;
  },
};
