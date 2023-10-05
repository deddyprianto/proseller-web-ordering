export function downloadImage(imageUrl, fileName) {
  // Fetch the image as a Blob
  fetch(imageUrl)
    .then((response) => response.blob())
    .then((blob) => {
      // Create an object URL from the Blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element
      const anchor = document.createElement('a');
      anchor.style.display = 'none';
      anchor.href = url;
      anchor.download = fileName;

      // Add the anchor to the document body
      document.body.appendChild(anchor);

      // Trigger a click event on the anchor to initiate the download
      anchor.click();

      // Remove the anchor and revoke the object URL
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(url);
    });
}

export const getCurrencyHelper = (price, companyInfo) => {
  if (companyInfo) {
    if (price !== undefined) {
      const { currency } = companyInfo;
      if (!price || price === '-') price = 0;
      let result = price.toLocaleString(currency.locale, {
        style: 'currency',
        currency: currency.code,
      });
      return result;
    }
  }
  return price;
};

export function changeFormatDate(inputDate) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const parts = inputDate.split('-');
  const year = parts[0];
  const month = months[parseInt(parts[1]) - 1];
  const day = parts[2];

  return `${month} ${day}, ${year}`;
}

export function formatDateWithTime(inputDate) {
  const date = new Date(inputDate);

  // Format the date part
  const options = { year: 'numeric', month: 'short', day: '2-digit' };
  const formattedDate = date.toLocaleDateString('en-US', options);

  // Format the time part
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;

  return `${formattedDate} - ${formattedTime}`;
}
