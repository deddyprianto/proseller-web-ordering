import { isEmptyArray } from './CheckEmpty';

export function dateExistsInComparisons(dateToCheck, dateComparisons) {
  const formattedDateToCheck = dateToCheck.split(' ').join('-');
  if (isEmptyArray(dateComparisons)) {
    return false;
  } else {
    return !dateComparisons.some((item) => item.date === formattedDateToCheck);
  }
}
