const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
];

export default (date) => {
  const dateTime = new Date(date);
  if (date) {
    const formatDate =
      dateTime.getDate() +
      ' ' +
      MONTH_NAMES[dateTime.getMonth()] +
      ' ' +
      dateTime.getFullYear();
    return formatDate;
  } else {
    return '-';
  }
};
