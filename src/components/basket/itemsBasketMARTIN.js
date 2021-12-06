import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import ModalProduct from "../ordering/ModalProduct";
import {
  isEmptyObject,
  isEmptyArray,
  isEmptyData,
} from "../../helpers/CheckEmpty";

import { makeStyles } from "@material-ui/styles";

import CardItemBasket from "./cardItemBasket";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

import StickyNoteIcon from "@mui/icons-material/StickyNote2";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";

import AddNotes from "./AddNotes";

const mapStateToProps = (state) => {
  return {
    color: state.theme.color,
    basket: state.order.basket,
    categories: state.product.categories,
    defaultOutlet: state.outlet.defaultOutlet,
    isLoggedIn: state.auth.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

const ItemsBasket = ({
  data,
  dataBasket,
  countryCode,
  getCurrency,
  handleSetState,
  handleClear,
  roleBtnClear,
  updateCartInfo,
  ...props
}) => {
  const useStyles = makeStyles(() => ({
    root: { marginBottom: 20, marginTop: 5 },
    basketHeader: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: 14,
      alignItems: "center",
    },
    outletName: {
      fontWeight: "bold",
      color: props.color.primary || "#c00a27",
      textAlign: "left",
      lineHeight: "17px",
    },
    button: {
      color: props.color.primary,
      border: `1px solid ${props.color.primary}`,
      borderRadius: 5,
      width: 130,
      height: 30,
      textTransform: "none",
    },
    buttonNotes: {
      color: props.color.primary,
      border: `1px solid ${props.color.primary}`,
      borderRadius: 5,
      width: 100,
      height: 30,
      textTransform: "none",
    },
    buttonDelete: {
      color: props.color.primary,
      "&:hover": {
        color: props.color.primary,
      },
    },
    typography: {
      color: props.color.primary,
      fontSize: 14,
      fontWeight: "bold",
    },
    icon: {
      height: 15,
      width: 15,
      color: props.color.primary,
    },
    primaryColor: {
      color: props.color.primary,
    },
    divider: {
      marginTop: 10,
      marginBottom: 10,
    },
    divider4: {
      height: 4,
      marginTop: 10,
      marginBottom: 10,
    },
    leftNotes: {
      display: "flex",
      justifyContent: "flex-start",
      fontSize: 14,
      marginTop: 5,
    },
    rightNotes: {
      display: "flex",
      justifyContent: "flex-end",
      fontSize: 14,
      marginTop: 5,
    },
    remark: {
      fontSize: 14,
      lineHeight: 1,
      textAlign: "left",
      fontStyle: "italic",
    },
    basket: {
      display: "flex",
      alignItems: "center",
    },
  }));

  const classes = useStyles();
  const [selectedItem, setSelectedItem] = useState({});

  const [newDataBasket, setNewDataBasket] = useState(dataBasket || null);
  const [isEnableNotes, setIsEnableNotes] = useState(false);

  useEffect(() => {
    if (isEmptyObject(props.basket)) {
      setNewDataBasket(data.dataBasket);
    }

    if (
      props.defaultOutlet.enableOrderSpecialInstructions === true &&
      props.isLoggedIn
    ) {
      setIsEnableNotes(true);
    }
  });

  const selectProduct = async (productSelect, mode) => {
    const quantityItem = productSelect.quantity;
    const originalQuantity = productSelect.originalQuantity;
    const promoQuantity = productSelect.promoQuantity;
    let productSelected = productSelect;
    let dataBasket = data.dataBasket;
    let storeDetail = data.storeDetail;
    const productBackup = props.categories;

    storeDetail.product = productBackup;

    if (!!storeDetail.product) {
      storeDetail.product.forEach((group) => {
        if (!!group.items) {
          group.items.forEach((product) => {
            if (product.productID === productSelected.productID) {
              product.id = productSelected.id;
              productSelected = product;
              productSelected.quantity = quantityItem;
            }
          });
        }
      });
    }

    if (!isEmptyData(productSelected.product.productModifiers)) {
      productSelected.product.productModifiers.forEach((group, i) => {
        if (!isEmptyArray(group.modifier.details))
          group.modifier.details.forEach((detail, j) => {
            delete detail.quantity;

            if (group.modifier.min !== 0 && group.modifier.min !== undefined) {
              productSelected.product.productModifiers[i].modifier.show = true;
            } else {
              productSelected.product.productModifiers[i].modifier.show = false;
            }

            if (
              group.modifier.isYesNo === true &&
              detail.orderingStatus === "AVAILABLE"
            ) {
              if (
                group.modifier.yesNoDefaultValue === true &&
                detail.yesNoValue === "no"
              ) {
                productSelected.product.productModifiers[i].modifier.details[
                  j
                ].isSelected = true;
              }

              if (
                group.modifier.yesNoDefaultValue === false &&
                detail.yesNoValue === "yes"
              ) {
                productSelected.product.productModifiers[i].modifier.details[
                  j
                ].isSelected = false;
              }
            }
          });
      });
    }

    if (isEmptyObject(dataBasket)) {
      productSelected.quantity = 1;
      productSelected.remark = "";
    } else {
      if (!isEmptyArray(dataBasket.details)) {
        const find = await dataBasket.details.find(
          (data) => data.id === productSelected.id
        );
        if (find !== undefined) {
          setSelectedItem({});
          if (mode === "Update") {
            productSelected.remark = find.remark;
            // fill the modifier
            if (!isEmptyArray(find.modifiers)) {
              productSelected.product.productModifiers &&
                productSelected.product.productModifiers.forEach((group, i) => {
                  group.modifier.details.forEach((detail, j) => {
                    find.modifiers.forEach((data) => {
                      data.modifier.details.forEach((item) => {
                        // make mark that item is in basket
                        if (data.modifierID === group.modifierID) {
                          productSelected.product.productModifiers[
                            i
                          ].postToServer = true;
                          // set quantity basket to product that openend
                          if (item.id === detail.id) {
                            // check for radio button
                            if (group.modifier.max === 1) {
                              productSelected.product.productModifiers[
                                i
                              ].modifier.show = data.modifier.show;
                            }
                            productSelected.product.productModifiers[
                              i
                            ].modifier.details[j].quantity = item.quantity;
                            // for is selected
                            productSelected.product.productModifiers[
                              i
                            ].modifier.details[j].isSelected = item.isSelected;
                          }
                        }
                      });
                    });
                  });
                });
            }
          }
        } else {
          productSelected.quantity = quantityItem;
          productSelected.remark = "";
        }
      } else {
        productSelected.quantity = 1;
        productSelected.remark = "";
      }
    }
    productSelected.mode = mode;
    productSelected = {
      ...productSelected,
      ...(originalQuantity && {
        originalQuantity,
      }),
      ...(promoQuantity && {
        promoQuantity,
      }),
    };
    setSelectedItem(productSelected);
  };

  const openModal = (item) => {
    if (data.storeDetail && data.storeDetail.product) {
      selectProduct(item, "Update");
      document.getElementById("detail-product-btn").click();
    } else {
      selectProduct(item, "Update");
      document.getElementById("detail-product-btn").click();
    }
  };

  const handleRemoveItem = async (key, items) => {
    console.log(newDataBasket);
    items.selected = true;
    newDataBasket.details[key] = items;

    setNewDataBasket(dataBasket);
    handleClear(newDataBasket);
  };

  const renderBasketHeader = () => {
    return (
      <div className={classes.basketHeader}>
        <div className={classes.outletName}>{data.dataBasket.outlet.name}</div>
        <Link to="/">
          <Button
            className={classes.button}
            startIcon={<AddIcon className={classes.icon} />}
            variant="outlined"
          >
            <Typography className={classes.typography}>Add Items</Typography>
          </Button>
        </Link>
      </div>
    );
  };
  const renderButtonNotes = () => {
    if (!!dataBasket.remark) {
      return (
        <div>
          <div className={classes.leftNotes}>
            <div>
              <Typography className={classes.remark}>
                "{dataBasket.remark}"
              </Typography>

              <Button
                className={classes.button}
                data-toggle="modal"
                data-target="#add-notes-modal"
                startIcon={<StickyNoteIcon className={classes.icon} />}
                variant="outlined"
              >
                <Typography className={classes.typography}>
                  Edit Notes
                </Typography>
              </Button>
            </div>
          </div>

          <Divider className={classes.divider} />
        </div>
      );
    }

    return (
      <div>
        <div className={classes.rightNotes}>
          <Button
            className={classes.buttonNotes}
            startIcon={<StickyNoteIcon className={classes.icon} />}
            variant="outlined"
            data-toggle="modal"
            data-target="#add-notes-modal"
          >
            <Typography className={classes.typography}>Notes</Typography>
          </Button>
        </div>
        <Divider className={classes.divider} />
      </div>
    );
  };

  const renderBasketItems = () => {
    return dataBasket.details.map((item, key) => (
      <div key={key}>
        <div className={classes.basket}>
          <CardItemBasket
            key={key}
            color={props.color}
            data={item}
            roleBtnClear={roleBtnClear}
            dataasket={dataBasket}
            getCurrency={(price) => getCurrency(price)}
            openModal={(item) => openModal(item)}
          />
          {dataBasket.status === "PENDING" && (
            <IconButton
              className={classes.buttonDelete}
              onClick={() => handleRemoveItem(key, item)}
            >
              <DeleteIcon fontSize="large" />
            </IconButton>
          )}
        </div>
        <Divider className={classes.divider} />
      </div>
    ));
  };

  return (
    <div className={classes.root}>
      <ModalProduct
        selectedItem={selectedItem}
        data={data}
        handleSetState={(field, value) => handleSetState(field, value)}
      />
      <AddNotes dataBasket={dataBasket} updateCartInfo={updateCartInfo} />
      {dataBasket && dataBasket.details && dataBasket.details.length > 0 && (
        <div>
          {renderBasketHeader()}

          <Divider className={classes.divider4} />

          {!isEmptyObject(dataBasket) &&
            dataBasket.status === "PENDING" &&
            isEnableNotes &&
            renderButtonNotes()}

          {renderBasketItems()}

          <span
            data-toggle="modal"
            data-target="#detail-product-modal"
            id="detail-product-btn"
          />
        </div>
      )}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ItemsBasket);
