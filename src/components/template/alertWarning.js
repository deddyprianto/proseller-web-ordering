import Swal from 'sweetalert2';

import fontStyleCustom from 'pages/GuestCheckout/style/styles.module.css';

/**
 * Display a common alert using SweetAlert library.
 *
 * @param {Object} options - The options for the common alert.
 * @param {string} options.color - The color of the confirm button.
 * @param {Function} options.onConfirm - The callback function to execute when the confirm button is clicked.
 * @param {string} options.title - The title of the alert.
 * @param {string} options.content - The content of the alert.
 */
const alertWarning = ({ color, title, content }) => {
  Swal.fire({
    title: title,
    html: content,
    confirmButtonText: 'OK',
    confirmButtonColor: color,
    customClass: {
      confirmButton: fontStyleCustom.buttonSweetAlert,
      title: fontStyleCustom.fontTitleSweetAlert,
      popup: fontStyleCustom.popupSWAL,
      confirmButtonText: fontStyleCustom.confirmButtonText,
    },
  });
};

export default alertWarning;
