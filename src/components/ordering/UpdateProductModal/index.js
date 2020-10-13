import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import cx from "classnames";

import styles from "./styles.module.css";

const UpdateProductModal = ({
  color,
  product,
  productInCart,
  onClose,
  setAddNew,
  setSelectedItem,
  companyInfo,
  getCurrency
}) => {
  const handleAdd = () => {
    setAddNew(true);
    setSelectedItem(product, "Add");
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
              const modifierOfProduct = flatModifier.find((item) => {
                return (
                  item.id === modifierItem.id &&
                  item.groupModifierID === modifierGroup.modifierID
                );
              });
              return {
                ...modifierItem,
                isSelected: modifierOfProduct ? true : false,
                quantity: modifierOfProduct ? modifierOfProduct.quantity : 0,
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
        // modifiers,
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
              const modifiersList = item.modifiers.map((modifierGroup) => {
                return {
                  ...modifierGroup,
                  modifiersList: modifierGroup.modifier.details.map(
                    (modifierItem) => {
                      return {
                        ...modifierItem,
                        groupModifierID: modifierGroup.modifierID,
                      };
                    }
                  ),
                };
              });
              return (
                <div className={styles.product} style={{ borderRadius: 5, marginBottom: 5 }}>
                  <div className={styles.productName}>
                    <span>
                      <strong>{item.quantity}x </strong>
                    </span>
                    {item.product.name}
                  </div>
                  {modifiersList.length > 0 &&
                    modifiersList.map((modifierGroup) => {
                      return (
                        <div className={styles.addOns}>
                          <div>
                            <strong>
                              {modifierGroup.modifierName || ""}{" "}
                              {modifierGroup.modifierName && ":"}{" "}
                            </strong>
                          </div>
                          <div className={styles.items}>
                            {modifierGroup.modifiersList.map((modifierItem) => {
                              return (
                                <div key={modifierItem.id} style={{ marginTop: -10, }}>
                                  <span>{modifierItem.quantity}x </span>
                                  {modifierItem.name}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  <div className={styles.price} style={{ marginTop: -5 }}>
                    <b class="price-product color">
                      {getCurrency(item.grossAmount.toFixed(2))}
                    </b>
                  </div>
                  <button
                    className={styles.editButton}
                    style={{ color: color }}
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
  color: PropTypes.string,
  companyInfo: PropTypes.object,
  product: PropTypes.object,
  productInCart: PropTypes.array,
  onClose: PropTypes.func,
  setAddNew: PropTypes.func,
  setSelectedItem: PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    companyInfo: state.masterdata.companyInfo.data,
  };
};

export default connect(mapStateToProps, {})(UpdateProductModal);
