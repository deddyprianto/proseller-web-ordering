import _ from 'lodash';

/**
 * Check the postal code ThousandSeparator
 * @param {int} number - sentence or word
 */
function ThousandSeparator(number) {
  if (_.isNumber(number)) {
    const replaceNumber = number
      ?.toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${replaceNumber}`;
  }
  return number;
}

export default ThousandSeparator;
