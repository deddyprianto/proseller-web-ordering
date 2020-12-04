import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import cx from "classnames";
import styles from "./styles.module.css";

const UpdateProductModal = ({
  color,
  product,
  productInCart,
  onClose,
  setAddNew,
  setSelectedItem,
  colorTheme, 
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
  }, []);

  const handleEdit = (item) => {
    const { quantity, id, modifiers, remark } = item;

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
        remark,
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
      <div className={styles.modal} style={{ backgroundColor: colorTheme.background }}>
        <div className={styles.header}>
          <div>This item in cart</div>
          <button
            onClick={onClose}
            className={cx(styles.closeButton, "close close-modal")}
          >
            <i className="fa fa-times"></i>
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
                <div className={styles.product} style={{ borderRadius: 5, marginBottom: 5 }} onClick={() => handleEdit(item)}>
                  <Typography style={{ lineHeight: "15px", textAlign: "left" }}>
                    <span
                      className="customer-group-name"
                      style={{ marginRight: 5, fontSize: 12, fontWeight: "bold" }}
                    >
                      {`${item.quantity}x`}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: "bold" }} >
                      {`${item.product.name} (${getCurrency(Number(item.product.retailPrice))})`}
                    </span>
                  </Typography>
                  
                  {modifiersList.length > 0 &&
                    modifiersList.map((modifierGroup) => {
                      return (
                        <div className={styles.addOns}>
                          <div style={{ fontSize: 10, fontStyle: "italic", marginBottom: -5, marginTop: -5 }}>
                            Add On:
                          </div>
                          <div className={styles.items}>
                            {modifierGroup.modifiersList.map((modifierItem) => {
                              return (
                                <Typography
                                  key={modifierItem.id}
                                  style={{
                                    lineHeight: "15px", textAlign: "left", paddingTop: -10,
                                  }}
                                >
                                  <span
                                    className="color-active"
                                    style={{ marginRight: 3, fontStyle: "italic", fontSize: 10, }}
                                  >
                                    {`${modifierItem.quantity}x`}
                                  </span>
                                  <span style={{ fontSize: 10, fontStyle: "italic", }} >
                                    {`${modifierItem.name} (${getCurrency(Number(modifierItem.price))})`}
                                  </span>
                                </Typography>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}

                  {item.remark && item.remark !== "-" && (
                    <div className="font-color-theme" style={{ 
                      display: "flex", marginLeft: -5, marginTop: -5, marginBottom: -10 
                    }}>
                      <div
                        style={{
                          fontStyle: "italic", fontSize: 10, textAlign: "justify",
                          marginLeft: 5,
                        }}
                      >{`Note:`}</div>
                      <div
                        style={{
                          fontStyle: "italic", fontSize: 10, textAlign: "justify",
                          marginLeft: 5,
                        }}
                      >
                        {item.remark}
                      </div>
                    </div>
                  )}

                  <div 
                    className="customer-group-name" 
                    style={{
                      textAlign: "left", fontSize: 12, fontWeight: "bold",
                      marginTop: -5
                    }}
                  >
                    {getCurrency(Number(item.grossAmount.toFixed(2)))}
                  </div>
                  
                  <button
                    className={styles.editButton}
                    style={{ color: color, fontSize: 12 }}
                  >
                    <i className="fa fa-pencil-square-o" aria-hidden="true" /> Edit
                  </button>

                  <div style={{height: 1, backgroundColor: "#DCDCDC", marginTop: 4}}/>
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.footer}>
          <button onClick={handleAdd} style={{height: 50, width: "100%"}}>
            <i className="fa fa-plus" aria-hidden="true" /> Make Another
          </button>
          <button 
            className="border-theme background-theme"
            onClick={onClose} 
            style={{
              height: 50, width: 80, color: colorTheme.primary,
              border: `1px solid ${colorTheme.primary}`, marginLeft: 5
            }}
          >
            Close
          </button>
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
    colorTheme: state.theme.color,
  };
};

export default connect(mapStateToProps, {})(UpdateProductModal);
