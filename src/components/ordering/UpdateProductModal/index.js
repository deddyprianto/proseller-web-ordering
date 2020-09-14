import React from "react";
import PropTypes from "prop-types";

import cx from "classnames";

import styles from "./styles.module.css";

const UpdateProductModal = ({ product, productInCart, onClose }) => {
  const handleAdd = () => {
    document.getElementById("open-modal-product").click();
  };

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div>This item in cart</div>
          <button
            onClick={onClose}
            className={cx(styles.closeButton, "close close-modal")}
          >
            <i class="fa fa-times"></i>
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.productList}>
            {productInCart.map((item) => (
              <div className={styles.product}>
                <div className={styles.productName}>
                  <span>
                    <strong>{item.quantity}x </strong>
                  </span>
                  {item.product.name}
                </div>
                <div className={styles.price}>
                  <b class="price-product color">SGD&nbsp;{item.nettAmount}</b>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.footer}>
          <button onClick={handleAdd}>Make Another</button>
        </div>
      </div>
    </div>
  );
};

UpdateProductModal.propTypes = {
  product: PropTypes.object,
  productInCart: PropTypes.array,
  onClose: PropTypes.func,
};

export default UpdateProductModal;
