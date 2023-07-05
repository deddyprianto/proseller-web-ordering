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
const commonAlert = ({ color, onConfirm, title, content }) => {
  Swal.fire({
    title: `<p>${title}</p>`,
    html: `<h5 style='color:#B7B7B7; font-size:14px'>${content}</h5>`,
    allowOutsideClick: false,
    confirmButtonText: 'OK',
    confirmButtonColor: color,
    width: '40em',
    customClass: {
      confirmButton: fontStyleCustom.buttonSweetAlert,
      title: fontStyleCustom.fontTitleSweetAlert,
      container: fontStyleCustom.containerSweetAlert,
    },
  }).then(() => onConfirm());
};

export default commonAlert;
