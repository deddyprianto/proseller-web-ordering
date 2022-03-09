const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export default date => {
  const dateTime = new Date(date);
  if (date) {
    const formatDate =
      dateTime.getDate() +
      ' ' +
      MONTH_NAMES[dateTime.getMonth()] +
      ' ' +
      dateTime.getFullYear() +
      ' ' +
      (dateTime.getHours() < 10
        ? '0' + dateTime.getHours()
        : dateTime.getHours()) +
      ':' +
      (dateTime.getMinutes() < 10
        ? '0' + dateTime.getMinutes()
        : dateTime.getMinutes()) +
      ':' +
      (dateTime.getSeconds() < 10
        ? '0' + dateTime.getSeconds()
        : dateTime.getSeconds());
    return formatDate;
  } else {
    return '-';
  }
};
