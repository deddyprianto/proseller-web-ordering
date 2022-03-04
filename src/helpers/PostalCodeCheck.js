/**
 * Check the postal code
 * @param {string} postalCode - sentence or word
 */
function validationPostalCode(postalCode) {
  if (postalCode && Number(postalCode)) {
    if (postalCode.toString().length < 6) return true;
    if (postalCode.toString().length > 6) return false;
  } else {
    if (postalCode.toString().length !== 6) return false;
  }
}

export default validationPostalCode;
