import React from "react";
import PropTypes from "prop-types";

import cx from "classnames";

import styles from "./styles.module.css";

const UpdateProductModal = ({
  productInCart,
  onClose,
  setAddNew,
  setSelectedItem,
}) => {
  const handleAdd = () => {
    setAddNew(true);
    document.getElementById("open-modal-product").click();
  };

  const handleEdit = (item) => {
    setAddNew(false);
    setSelectedItem(item);
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
                <button
                  className={styles.editButton}
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>
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
  productInCart: PropTypes.array,
  onClose: PropTypes.func,
  setAddNew: PropTypes.func,
  setSelectedItem: PropTypes.func,
};

export default UpdateProductModal;
