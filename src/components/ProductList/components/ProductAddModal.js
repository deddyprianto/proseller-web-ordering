import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import config from 'config';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

import { OrderAction } from 'redux/actions/OrderAction';

import { isEmptyArray, isEmptyObject } from 'helpers/CheckEmpty';

const mapStateToProps = (state) => {
  return {
    basket: state.order.basket,
    color: state.theme.color,
    defaultOutlet: state.outlet.defaultOutlet,
    companyInfo: state.masterdata.companyInfo.data,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

const ProductAddModal = ({
  open,
  handleClose,
  product,
  width,
  selectedProduct,
  ...props
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const styles = {
    backgroundColor: {
      backgroundColor: props.color.background,
    },
    header: {
      display: 'flex',
      flexDirection: 600 > width ? 'column' : 'row',
    },
    imageSize: {
      height: 340,
      width: 340,
      minWidth: width > 600 && 340,
      borderRadius: 5,
    },
    productName: {
      width: '100%',
      fontSize: 26,
      color: props.color.primary,
      lineHeight: '30px',
      fontWeight: 600,
      paddingBottom: 10,
      paddingLeft: 600 > width ? 0 : 10,
      paddingTop: 600 > width && 10,
    },
    productDescription: {
      width: '100%',
      fontSize: 16,
      color: props.color.primary,
      lineHeight: '17px',
      paddingLeft: 600 > width ? 0 : 10,
    },
    buttonIcon: {
      height: 35,
      width: 35,
      backgroundColor: props.color.primary,
      borderRadius: 5,
      padding: 10,
      marginLeft: 10,
      marginRight: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    icon: {
      height: 25,
      width: 25,
      color: 'white',
    },
    fullWidth: { width: '100%' },
    footer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'start',
      backgroundColor: '#657482',
      alignItems: 'center',
      alignContents: 'center',
    },

    addText: {
      color: 'white',
      fontWeight: 600,
      fontSize: 14,
      textTransform: 'none',
    },
    addButton: {
      height: 35,
      width: '100%',
      backgroundColor: props.color.primary,
      borderRadius: 5,
      padding: 10,
      marginLeft: 10,
      marginRight: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: { marginTop: 30 },
    modifierHeader: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    modifierOption: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    optionTitle: {
      fontSize: 16,
      color: '#808080',
    },
    optionPrice: {
      paddingRight: 20,
      fontSize: 16,
      color: '#808080',
    },
    title: {
      padding: 10,
      fontWeight: 600,
      fontSize: 16,
      color: props.color.primary,
    },
    title2: {
      padding: 10,
      fontWeight: 600,
      fontSize: 13,
      color: '#808080',
    },
    qty: {
      fontSize: 26,
      color: props.color.primary,
      lineHeight: '30px',
      fontWeight: 600,
    },
    marginLeft: { marginLeft: 10 },
    divider: { marginLeft: 10, marginRight: 10 },
    radioSize: {
      '& .MuiSvgIcon-root': {
        fontSize: 24,
      },
    },
    buttonIconProductModifier: {
      height: 25,
      width: 25,
      backgroundColor: props.color.primary,
      borderRadius: 5,
      padding: 10,
      marginLeft: 10,
      marginRight: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconProductModifier: {
      height: 15,
      width: 15,
      color: 'white',
    },
    qtyProductModifier: {
      fontSize: 16,
      color: props.color.primary,
      lineHeight: '30px',
      fontWeight: 600,
    },
    displayFlex: { display: 'flex' },
    buttonCloseGadgetSize: {
      position: 'absolute',
      top: '10px',
      right: '2px',
    },
    imageAndButtonCloseGadgetSize: {
      position: 'relative',
      left: 0,
      top: 0,
    },
    rootSpecialInstruction: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 20,
    },
    specialInstructionTypography: {
      fontSize: 16,
      color: '#808080',
      fontWeight: 'bold',
    },
    optionalTypography: { fontSize: 10, color: '#777777', paddingLeft: 10 },
    specialInstructionInput: {
      minHeight: 100,
      minWidth: '100%',
      maxWidth: '100%',
      borderRadius: 5,
    },
  };

  const [variantName, setVariantName] = useState('');
  const [qty, setQty] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [productAdd, setProductAdd] = useState({});
  const [productUpdate, setProductUpdate] = useState({});
  const [selectedVariantOptions, setSelectedVariantOptions] = useState([]);
  const [variantImageURL, setVariantImageURL] = useState('');
  const [selectedProductModifiers, setSelectedProductModifiers] = useState([]);
  const [notes, setNotes] = useState('');

  const handleProductModifierSelected = () => {
    let defaultValue = [];
    selectedProduct.modifiers.forEach((item) => {
      item.modifier.details.forEach((detail) => {
        defaultValue.push({
          modifierId: item.modifierID,
          modifierProductId: detail.productID,
          name: detail.name,
          price: detail.price,
          qty: detail.quantity,
        });
      });
    });
    setSelectedProductModifiers(defaultValue);
    setQty(selectedProduct?.quantity);
    setNotes(selectedProduct?.remark);
  };

  const handleProductSelected = () => {
    setQty(selectedProduct?.quantity);
    setNotes(selectedProduct?.remark);
  };

  useEffect(() => {
    if (!isEmptyArray(selectedProduct?.product?.productModifiers)) {
      return handleProductModifierSelected();
    }
    if (!isEmptyObject(selectedProduct)) {
      return handleProductSelected();
    }
  }, []);

  const handleClear = () => {
    setQty(1);
    setTotalPrice(0);
    setSelectedVariantOptions([]);
    setSelectedProductModifiers([]);
  };

  const handleCurrency = (price) => {
    const result = price.toLocaleString(props.companyInfo.currency.locale, {
      style: 'currency',
      currency: props.companyInfo.currency.code,
    });

    return result;
  };

  const handlePrice = ({ qty, totalPrice }) => {
    setTotalPrice(qty * totalPrice);
  };

  const handleProductModifierFormated = (items) => {
    let totalPrice = 0;
    let productModifiers = [];
    if (!isEmptyArray(items)) {
      items.forEach((item) => {
        totalPrice = totalPrice + item.qty * item.price;
        productModifiers.push({
          modifierID: item.modifierId,
          modifier: {
            details: [
              {
                productID: item.modifierProductId,
                quantity: item.qty,
                price: item.price,
                name: item.name,
              },
            ],
          },
        });
      });

      const productModifierMerged = productModifiers.reduce((obj, a) => {
        if (obj[a.modifierID]) {
          obj[a.modifierID].modifier.details.push(...a.modifier.details);
        } else {
          obj[a.modifierID] = { ...a };
        }
        return obj;
      }, {});

      const result = Object.values(productModifierMerged);

      totalPrice = totalPrice + product.retailPrice;

      handlePrice({
        qty,
        totalPrice,
      });

      return result;
    }

    totalPrice = totalPrice + product.retailPrice;
    handlePrice({
      qty,
      totalPrice,
    });
    return productModifiers;
  };

  const handleProductVariantFormated = (items) => {
    let productVariant = {};
    const productVariantName = items.map((item) => {
      return item.value;
    });

    product?.variants?.forEach((variant) => {
      if (JSON.stringify(variant.attributes) === JSON.stringify(items)) {
        productVariant = variant;
      }
    });

    setVariantImageURL(productVariant?.defaultImageURL);
    setVariantName(productVariantName.join(' '));

    handlePrice({
      qty,
      totalPrice: productVariant?.retailPrice || 0,
    });

    return productVariant;
  };

  useEffect(() => {
    if (!isEmptyArray(product?.variants)) {
      const productVariants = !isEmptyArray(selectedVariantOptions)
        ? selectedVariantOptions
        : product?.variants[0]?.attributes;

      setSelectedVariantOptions(productVariants);
      const productVariantFormated =
        handleProductVariantFormated(productVariants);

      if (!isEmptyObject(selectedProduct)) {
        return setProductUpdate({
          id: selectedProduct.id,
          productID: `product::${productVariantFormated.id}`,
          retailPrice: productVariantFormated.retailPrice,
          remark: notes,
          quantity: qty,
          unitPrice: qty * productVariantFormated.retailPrice,
        });
      }
      return setProductAdd({
        productID: `product::${productVariantFormated.id}`,
        retailPrice: productVariantFormated.retailPrice,
        remark: notes,
        quantity: qty,
      });
    }

    if (!isEmptyArray(product?.productModifiers)) {
      const productModifierFormated = handleProductModifierFormated(
        selectedProductModifiers
      );

      const totalAmount = totalPrice / qty;

      if (!isEmptyObject(selectedProduct)) {
        return setProductUpdate({
          id: selectedProduct.id,
          productID: `product::${product.id}`,
          retailPrice: totalAmount,
          remark: notes,
          quantity: qty,
          unitPrice: qty * totalAmount,
          modifiers: productModifierFormated,
        });
      }
      return setProductAdd({
        productID: `product::${product.id}`,
        retailPrice: totalAmount,
        remark: notes,
        quantity: qty,
        modifiers: productModifierFormated,
      });
    }

    if (product) {
      handlePrice({
        qty,
        totalPrice: product?.retailPrice || 0,
      });
      if (!isEmptyObject(selectedProduct)) {
        return setProductUpdate({
          id: selectedProduct.id,
          productID: `product::${product.id}`,
          retailPrice: product.retailPrice,
          remark: notes,
          quantity: qty,
          unitPrice: qty * product.retailPrice,
        });
      }

      return setProductAdd({
        productID: `product::${product.id}`,
        retailPrice: product.retailPrice,
        remark: notes,
        quantity: qty,
      });
    }
  }, [
    selectedVariantOptions,
    qty,
    selectedProductModifiers,
    product,
    selectedProduct,
    notes,
  ]);

  const isCheckedCheckbox = (modifier) => {
    const isChecked = selectedProductModifiers.find(
      (selectedProductModifier) =>
        selectedProductModifier.modifierProductId === modifier.productID
    );

    return !!isChecked;
  };

  const handleAddAndReduceQtyProductModifier = ({ key, value }) => {
    let productModifiersQtyChanged = [];
    const qty = key === 'add' ? value.qty + 1 : value.qty - 1;

    selectedProductModifiers.forEach((selectedProductModifier) => {
      if (
        selectedProductModifier.modifierProductId === value.modifierProductId &&
        qty !== 0
      ) {
        productModifiersQtyChanged.push({ ...value, qty });
      } else if (
        selectedProductModifier.modifierProductId === value.modifierProductId &&
        qty === 0
      ) {
        productModifiersQtyChanged.push();
      } else {
        productModifiersQtyChanged.push(selectedProductModifier);
      }
    });

    setSelectedProductModifiers(productModifiersQtyChanged);
  };

  const handleDisabledAddProductButton = () => {
    if (!isEmptyArray(product?.productModifiers) && !isLoading) {
      let qtyModifierSelected = 0;
      const productModifiers = product.productModifiers.map(
        (productModifier) => {
          selectedProductModifiers.forEach((selectedProductModifier) => {
            if (
              productModifier.modifierID === selectedProductModifier.modifierId
            )
              qtyModifierSelected =
                qtyModifierSelected + selectedProductModifier.qty;
          });

          const result = qtyModifierSelected >= productModifier.modifier.min;
          qtyModifierSelected = 0;
          return result;
        }
      );

      const productModifierAllTrue = productModifiers.every((v) => v === true);
      return !productModifierAllTrue;
    }

    if (!isLoading) {
      return false;
    }

    return true;
  };

  const handleUpdate = ({ baskets, productUpdate }) => {
    const result = [...baskets];

    const basketIds = baskets.map((item) => {
      return item.id;
    });

    const basketIdIndex = basketIds.indexOf(productUpdate.id);

    if (basketIdIndex !== -1) {
      result[basketIdIndex] = { ...productUpdate };
    }

    return result;
  };

  const handleAddOrUpdateProduct = async () => {
    setIsLoading(true);
    if (!isEmptyObject(selectedProduct)) {
      const basketUpdated = handleUpdate({
        baskets: props.basket.details,
        productUpdate,
      });

      await props.dispatch(
        OrderAction.processUpdateCart(props.basket, basketUpdated, 'new')
      );
    } else {
      await props.dispatch(
        OrderAction.processAddCart(props.defaultOutlet, productAdd)
      );
    }

    setIsLoading(false);
    handleClose();
    handleClear();
  };

  const handleDisabledCheckbox = ({ modifier, max, productModifier }) => {
    let qtyTotal = 0;

    const modifierProducts = selectedProductModifiers.filter(
      (item) => item.modifierId === productModifier.modifierID
    );
    const modifierProductIds = modifierProducts.map(
      (item) => item.modifierProductId
    );

    modifierProducts.forEach((modifierProduct) => {
      qtyTotal = qtyTotal + modifierProduct.qty;
    });

    const isDisabled =
      qtyTotal >= max && modifierProductIds.indexOf(modifier.productID) === -1;

    return isDisabled;
  };

  const handleDisabledRemoveButtonProductModifier = ({ modifier, min }) => {
    if (min > 0) {
      let qtyTotal = 0;

      const modifierProducts = selectedProductModifiers.filter(
        (item) => item.modifierId === modifier.modifierId
      );

      modifierProducts.forEach((modifierProduct) => {
        qtyTotal = qtyTotal + modifierProduct.qty;
      });

      const isDisabled = qtyTotal <= min;

      return isDisabled;
    }
  };

  const handleDisabledAddButtonProductModifier = ({ modifier, max }) => {
    if (max > 0) {
      let qtyTotal = 0;

      const modifierProducts = selectedProductModifiers.filter(
        (item) => item.modifierId === modifier.modifierId
      );

      modifierProducts.forEach((modifierProduct) => {
        qtyTotal = qtyTotal + modifierProduct.qty;
      });

      const isDisabled = qtyTotal >= max;

      return isDisabled;
    }
  };

  const handleVariantOptionSelected = ({ name, value }) => {
    if (selectedVariantOptions) {
      const selectedVariantOptionsChanged = selectedVariantOptions.map(
        (selected) => {
          if (selected.name === name) {
            return { ...selected, value };
          }
          return selected;
        }
      );

      setSelectedVariantOptions(selectedVariantOptionsChanged);
    }
  };

  const handleModifierOptionSelected = ({
    modifierProductId,
    modifierId,
    qty,
    price,
    name,
  }) => {
    const items = selectedProductModifiers;
    const modifierProductIds = items.map((item) => {
      return item.modifierProductId;
    });

    const modifierProductIdIndex =
      modifierProductIds.indexOf(modifierProductId);

    if (modifierProductIdIndex !== -1) {
      items.splice(modifierProductIdIndex, 1);
      setSelectedProductModifiers([...items]);
    } else {
      setSelectedProductModifiers([
        ...items,
        {
          modifierId,
          modifierProductId,
          qty,
          price,
          name,
        },
      ]);
    }
  };

  const renderImageProduct = () => {
    if (variantImageURL) {
      return variantImageURL;
    }

    if (product?.defaultImageURL) {
      return product.defaultImageURL;
    }

    if (props?.color?.productPlaceholder) {
      return props.color.productPlaceholder;
    }
    return config.image_placeholder;
  };

  const renderVariantOptions = (variant) => {
    const variantOptions = variant?.options?.map((option, index) => {
      return (
        <div key={index}>
          <FormControlLabel
            style={styles.marginLeft}
            value={option}
            control={<Radio sx={styles.radioSize} />}
            label={<Typography style={styles.optionTitle}>{option}</Typography>}
            onClick={() => {
              handleVariantOptionSelected({
                name: variant.optionName,
                value: option,
              });
            }}
          />
          {variant.options.length - 1 !== index && (
            <Divider style={styles.divider} />
          )}
        </div>
      );
    });
    return variantOptions;
  };

  const renderVariants = (variants) => {
    if (!isEmptyArray(variants)) {
      const result = variants.map((variant, index) => {
        return (
          <Paper key={index} variant='outlined' style={styles.paper}>
            <Typography style={styles.title}>{variant.optionName}</Typography>

            <RadioGroup defaultValue={variant.options[0]}>
              {renderVariantOptions(variant)}
            </RadioGroup>
          </Paper>
        );
      });

      return result;
    }
  };

  const renderAddAndRemoveButtonProductModifierOptions = ({
    modifierProductId,
    max,
    min,
  }) => {
    const selectedProductModifier = selectedProductModifiers.find(
      (item) => item.modifierProductId === modifierProductId
    );

    if (selectedProductModifier && max > 1) {
      return (
        <div style={styles.displayFlex}>
          <IconButton
            style={styles.buttonIconProductModifier}
            disabled={
              handleDisabledRemoveButtonProductModifier({
                modifier: selectedProductModifier,
                min,
              }) || isLoading
            }
            onClick={() => {
              handleAddAndReduceQtyProductModifier({
                key: 'reduce',
                value: selectedProductModifier,
              });
            }}
          >
            <RemoveIcon style={styles.iconProductModifier} />
          </IconButton>
          <Typography style={styles.qtyProductModifier}>
            {selectedProductModifier.qty}
          </Typography>
          <IconButton
            style={styles.buttonIconProductModifier}
            disabled={
              handleDisabledAddButtonProductModifier({
                modifier: selectedProductModifier,
                max,
              }) || isLoading
            }
            onClick={() => {
              handleAddAndReduceQtyProductModifier({
                key: 'add',
                value: selectedProductModifier,
              });
            }}
          >
            <AddIcon style={styles.iconProductModifier} />
          </IconButton>
        </div>
      );
    }
  };

  const renderTermsAndConditionsProductModifiers = (productModifier) => {
    if (
      productModifier?.modifier?.min === 0 &&
      productModifier?.modifier?.max === 0
    ) {
      return <Typography style={styles.title2}>Optional</Typography>;
    }

    if (
      productModifier?.modifier?.min > 0 &&
      productModifier?.modifier?.max === 0
    ) {
      return (
        <Typography style={styles.title2}>
          Min {productModifier.modifier.min}
        </Typography>
      );
    }

    if (
      productModifier?.modifier?.min === 0 &&
      productModifier?.modifier?.max > 0
    ) {
      return (
        <Typography style={styles.title2}>
          Max {productModifier.modifier.max}
        </Typography>
      );
    }

    if (
      productModifier?.modifier?.min > 0 &&
      productModifier?.modifier?.max > 0
    ) {
      return (
        <Typography style={styles.title2}>
          Min {productModifier.modifier.min}, Max {productModifier.modifier.max}
        </Typography>
      );
    }
  };

  const renderProductModifierOptions = (productModifier) => {
    const productModifierOptions = productModifier.modifier?.details?.map(
      (modifier, index) => {
        return (
          <div key={index}>
            <div style={styles.modifierOption}>
              <FormControlLabel
                style={styles.marginLeft}
                value={modifier.productID}
                checked={isCheckedCheckbox(modifier)}
                control={
                  <Checkbox
                    sx={styles.radioSize}
                    name={modifier.productID}
                    onChange={() => {
                      handleModifierOptionSelected({
                        modifierProductId: modifier.productID,
                        modifierId: productModifier.modifierID,
                        qty: 1,
                        price: modifier.price,
                        name: modifier.name,
                      });
                    }}
                    disabled={handleDisabledCheckbox({
                      modifier,
                      max: productModifier.modifier.max,
                      productModifier,
                    })}
                  />
                }
                label={
                  <Typography style={styles.optionTitle}>
                    {modifier.name}
                  </Typography>
                }
              />
              <div style={styles.displayFlex}>
                {renderAddAndRemoveButtonProductModifierOptions({
                  modifierProductId: modifier.productID,
                  max: productModifier.modifier.max,
                  min: productModifier.modifier.min,
                })}
                <Typography style={styles.optionPrice}>
                  {handleCurrency(modifier.price)}
                </Typography>
              </div>
            </div>
            {productModifier.modifier.details.length - 1 !== index && (
              <Divider style={styles.divider} />
            )}
          </div>
        );
      }
    );

    return productModifierOptions;
  };

  const renderProductModifiers = (productModifiers) => {
    if (!isEmptyArray(productModifiers)) {
      const result = productModifiers.map((productModifier, index) => {
        return (
          <Paper key={index} variant='outlined' style={styles.paper}>
            <div style={styles.modifierHeader}>
              <Typography style={styles.title}>
                {productModifier.modifierName}
              </Typography>
              {renderTermsAndConditionsProductModifiers(productModifier)}
            </div>
            <FormGroup>
              {renderProductModifierOptions(productModifier)}
            </FormGroup>
          </Paper>
        );
      });

      return result;
    }
  };

  const renderCloseButton = () => {
    if (width > 600) {
      return (
        <IconButton
          style={styles.buttonIcon}
          onClick={() => {
            handleClear();
            handleClose();
          }}
        >
          <CloseIcon style={styles.icon} />
        </IconButton>
      );
    }
  };

  const renderCloseButtonGadgetSize = () => {
    if (width < 600) {
      return (
        <div style={styles.buttonCloseGadgetSize}>
          <IconButton
            style={styles.buttonIcon}
            onClick={() => {
              handleClear();
              handleClose();
            }}
          >
            <CloseIcon style={styles.icon} />
          </IconButton>
        </div>
      );
    }
  };

  const renderTotalPriceOrRemove = () => {
    if (qty === 0) {
      return (
        <Button
          style={styles.addButton}
          onClick={() => {
            handleAddOrUpdateProduct();
          }}
        >
          <Typography style={styles.addText}>Remove</Typography>
        </Button>
      );
    }

    return (
      <Button
        style={styles.addButton}
        disabled={handleDisabledAddProductButton()}
        onClick={() => {
          handleAddOrUpdateProduct();
        }}
      >
        <Typography style={styles.addText}>
          {isLoading ? 'Loading.....' : handleCurrency(totalPrice)}
        </Typography>
      </Button>
    );
  };

  const renderSpecialInstruction = () => {
    return (
      <div>
        <div style={styles.rootSpecialInstruction}>
          <Typography style={styles.specialInstructionTypography}>
            Special Instruction
          </Typography>
          <Typography style={styles.optionalTypography}>Optional</Typography>
        </div>
        <textarea
          style={styles.specialInstructionInput}
          value={notes}
          onChange={(event) => {
            setNotes(event.target.value);
          }}
        />
      </div>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        handleClear();
        handleClose();
      }}
      fullScreen={fullScreen}
      fullWidth
      maxWidth='md'
    >
      <div style={styles.backgroundColor}>
        <DialogContent>
          <div style={styles.header}>
            <div style={styles.imageAndButtonCloseGadgetSize}>
              <img
                style={styles.imageSize}
                src={renderImageProduct()}
                alt={product.name}
                title={product.name}
              />

              {renderCloseButtonGadgetSize()}
            </div>

            <div style={styles.fullWidth}>
              <Typography style={styles.productName}>
                {product.name} {variantName}
              </Typography>
              <Typography style={styles.productDescription}>
                {product.description}
              </Typography>
            </div>

            {renderCloseButton()}
          </div>

          <div>{renderVariants(product?.variantOptions)}</div>

          <div>{renderProductModifiers(product?.productModifiers)}</div>

          <div>{renderSpecialInstruction()}</div>
        </DialogContent>
        <DialogActions style={styles.footer}>
          <IconButton
            style={styles.buttonIcon}
            disabled={qty === 0 || isLoading}
            onClick={() => {
              setQty(qty - 1);
            }}
          >
            <RemoveIcon style={styles.icon} />
          </IconButton>
          <Typography style={styles.qty}>{qty}</Typography>
          <IconButton
            disabled={isLoading}
            style={styles.buttonIcon}
            onClick={() => {
              setQty(qty + 1);
            }}
          >
            <AddIcon style={styles.icon} />
          </IconButton>
          {renderTotalPriceOrRemove()}
        </DialogActions>
      </div>
    </Dialog>
  );
};

ProductAddModal.defaultProps = {
  open: false,
  companyInfo: {},
  handleClose: null,
  product: {},
  defaultOutlet: {},
  color: {},
  basket: {},
  dispatch: null,
  width: 600,
  selectedProduct: {},
};

ProductAddModal.propTypes = {
  basket: PropTypes.object,
  color: PropTypes.object,
  companyInfo: PropTypes.object,
  defaultOutlet: PropTypes.object,
  dispatch: PropTypes.func,
  handleClose: PropTypes.func,
  open: PropTypes.bool,
  product: PropTypes.object,
  selectedProduct: PropTypes.object,
  width: PropTypes.number,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductAddModal);
