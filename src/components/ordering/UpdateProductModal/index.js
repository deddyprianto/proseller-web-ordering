import React, { useEffect } from "react";
import PropTypes from "prop-types";

import cx from "classnames";

import styles from "./styles.module.css";

const UpdateProductModal = ({
  product,
  productInCart,
  onClose,
  setAddNew,
  setSelectedItem,
}) => {
  const handleAdd = () => {
    const newProductModifiers = product.product.productModifiers.map(
      (modifierGroup) => {
        return {
          ...modifierGroup,
          modifier: {
            ...modifierGroup.modifier,
            details: modifierGroup.modifier.details.map((modifierItem) => {
              return {
                ...modifierItem,
                quantity: 0,
              };
            }),
          },
        };
      }
    );
    setAddNew(true);
    setSelectedItem(
      {
        ...product,
        product: { ...product.product, productModifiers: newProductModifiers },
      },
      "Add"
    );
    document.getElementById("open-modal-product").click();
  };

  useEffect(() => {
    document.body.style.overflowY = "hidden";
    return () => {
      document.body.style.overflowY = "scroll";
    };
  });

  const handleEdit = (item) => {
    const { quantity, id, modifiers } = item;

    const modifiersList = modifiers.map((modifierGroup) =>
      modifierGroup.modifier.details.map((modifierItem) => {
        return { ...modifierItem, groupModifierID: modifierGroup.modifierID };
      })
    );

    const flatModifier = modifiersList.flat();

    const newProductModifiers = product.product.productModifiers.map(
      (modifierGroup) => {
        return {
          ...modifierGroup,
          modifier: {
            ...modifierGroup.modifier,
            details: modifierGroup.modifier.details.map((modifierItem) => {
              const quantity = flatModifier.find((item) => {
                return (
                  item.id === modifierItem.id &&
                  item.groupModifierID === modifierGroup.modifierID
                );
              });
              return {
                ...modifierItem,
                quantity: quantity ? quantity.quantity : 0,
              };
            }),
          },
        };
      }
    );
    setAddNew(false);
    setSelectedItem(
      {
        ...product,
        quantity,
        id,
        modifiers,
        product: { ...product.product, productModifiers: newProductModifiers },
      },
      "Update"
    );
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
            {productInCart.map((item) => {
              return (
                <div className={styles.product}>
                  <div className={styles.productName}>
                    <span>
                      <strong>{item.quantity}x </strong>
                    </span>
                    {item.product.name}
                  </div>
                  <div className={styles.price}>
                    <b class="price-product color">
                      SGD&nbsp;{item.grossAmount}
                    </b>
                  </div>
                  <button
                    className={styles.editButton}
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                </div>
              );
            })}
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
  setAddNew: PropTypes.func,
  setSelectedItem: PropTypes.func,
};

export default UpdateProductModal;
