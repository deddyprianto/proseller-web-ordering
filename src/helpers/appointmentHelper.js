/**
 * example:
 * const totalDuration = 1000 (in seconds)
 * convertTimeToStr(totalDuration)
 */

export const convertTimeToStr = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    if (minutes > 0) {
      return hours === 1
        ? `${hours} hour ${minutes} minutes`
        : `${hours} hours ${minutes} minutes`;
    } else {
      return hours === 1 ? `${hours} hour` : `${hours} hours`;
    }
  } else if (minutes > 0) {
    return minutes === 1 ? `${minutes} minute` : `${minutes} minutes`;
  } else {
    return '0 minutes';
  }
};



/**
 * example:
 * convertFormatDate(date)
 */

export const convertFormatDate = (dateStr) => {
  const date = new window.Date(dateStr);
  const months = [
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
    'December',
  ];
  const monthName = months[date.getMonth()];
  const dayOfMonth = date.getDate();
  let daySuffix;
  if (dayOfMonth % 10 === 1 && dayOfMonth !== 11) {
    daySuffix = 'st';
  } else if (dayOfMonth % 10 === 2 && dayOfMonth !== 12) {
    daySuffix = 'nd';
  } else if (dayOfMonth % 10 === 3 && dayOfMonth !== 13) {
    daySuffix = 'rd';
  } else {
    daySuffix = 'th';
  }

  const formattedDate = `${monthName}, ${dayOfMonth}${daySuffix} ${date.getFullYear()}`;

  return formattedDate;
};

export const phonePrefixFormatter = (code) => {
  let phonePrefix;
  switch (code) {
    case 'SG':
      phonePrefix = '65';
      break;
    case 'ID':
      phonePrefix = '62';
      break;
    case 'MY':
      phonePrefix = '60';
      break;
    default:
      phonePrefix = '65';
      break;
  }
  return phonePrefix;
};
