export function dateExistsInComparisons(dateToCheck, dateComparisons) {
  const formattedDateToCheck = dateToCheck.split(' ').join('-');
  return !dateComparisons.some((item) => item.date === formattedDateToCheck);
}
