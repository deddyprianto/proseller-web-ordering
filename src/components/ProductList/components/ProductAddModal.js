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
import { CONSTANT } from 'helpers';

const mapStateToProps = (state) => {
  return {
    basket: state.order.basket,
    color: state.theme.color,
    defaultOutlet: state.outlet.defaultOutlet,
    companyInfo: state.masterdata.companyInfo.data,
    deliveryProviderSelected: state.order.selectedDeliveryProvider,
    deliveryAddress: state.order.deliveryAddress,
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
  basket,
  ...props
}) => {
  const gadgetScreen = width < 600;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const styles = {
    backgroundColor: {
      backgroundColor: props.color.background,
    },
    header: {
      display: 'flex',
      flexDirection: gadgetScreen ? 'column' : 'row',
    },
    imageSize: {
      height: gadgetScreen ? gadgetScreen : 340,
      width: gadgetScreen ? gadgetScreen : 340,
      minWidth: !gadgetScreen && 340,
      borderRadius: 5,
    },
    productName: {
      width: '100%',
      fontWeight: 700,
      fontSize: '14px',
      lineHeight: '18px',
      color: '#000000',
    },
    productPrice: {
      fontWeight: 700,
      fontSize: '14px',
      lineHeight: '18px',
      color: '#4386A1',
    },
    productDescription: {
      fontWeight: '500',
      fontSize: '12px',
      lineHeight: '15px',
      color: '#000000',
    },
    stock: {
      color: 'red',
      fontSize: 12,
      fontStyle: 'italic',
      marginTop: 10,
      textAlign: 'right',
    },
    buttonIcon: {
      height: 18,
      width: 18,
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
      height: 18,
      width: 18,
      color: 'white',
    },
    fullWidth: { width: '100%' },
    addText: {
      fontWeight: 500,
      fontSize: '12px',
      lineHeight: '15px',
      color: '#FFFFFF',
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
    paper: {
      marginTop: 30,
      backgroundColor: props.color.background,
      border: 'none',
    },
    modifierHeader: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    modifierOption: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    optionTitle: {
      fontWeight: 500,
      fontSize: '12px',
      lineHeight: '15px',
      color: '#000000',
    },
    optionPrice: {
      paddingRight: 20,
      fontSize: 16,
      color: props.color.font,
    },
    optionPriceGadgetScreen: {
      fontWeight: 500,
      fontSize: '10px',
      lineHeight: '13px',
      color: '#8A8D8E',
    },
    title: {
      fontWeight: 700,
      fontSize: '14px',
      lineHeight: '18px',
      color: '#000000',
      marginRight: 15,
    },
    title2: {
      fontWeight: 400,
      fontSize: '10px',
      lineHeight: '15px',
      display: 'flex',
      alignItems: 'center',
      color: '#B7B7B7',
    },
    qty: {
      fontSize: 18,
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
    radioSizeModifier: {
      '& .MuiSvgIcon-root': {
        fontSize: 24,
        color: '#667080',
        borderRadius: '3px',
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
    rootMofidierOptions: {
      display: 'flex',
      marginRight: 10,
      alignItems: 'center',
    },

    displayFlex: { display: 'flex' },
    buttonCloseGadgetSize: {
      position: 'absolute',
      top: 8,
      right: 8,
    },
    buttonIconClose: {
      height: 33,
      width: 33,
      backgroundColor: props.color.primary,
      borderRadius: 5,
      padding: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconClose: {
      height: 25,
      width: 25,
      color: 'white',
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
      marginBottom: 15,
    },
    specialInstructionTypography: {
      fontSize: 16,
      color: props.color.font,
      fontWeight: 'bold',
    },
    optionalTypography: { fontSize: 10, color: '#777777', paddingLeft: 10 },
    specialInstructionInput: {
      minHeight: 100,
      minWidth: '100%',
      maxWidth: '100%',
      border: '1px solid #D0D0D0',
      borderRadius: '4px',
    },

    footer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'start',
      backgroundColor: '#D0D0D0',
      alignItems: 'center',
      alignContents: 'center',
      padding: 10,
    },
    modifierOptionsPrice: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'end',
      alignItems: 'end',
    },
    itemQty: {
      fontWeight: 500,
      fontSize: '12px',
      lineHeight: '15px',
      color: '#000000',
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

  const [increaseQtyButtonDisabled, setIncreaseQtyButtonDisabled] =
    useState(true);
  const [decreaseQtyButtonDisabled, setDecreaseQtyButtonDisabled] =
    useState(true);

  const [stock, setStock] = useState({ manage: false, current: 0 });

  const handlePrice = ({ qty, totalPrice }) => {
    setTotalPrice(qty * totalPrice);
  };

  const handleProductSelected = () => {
    if (!isEmptyObject(selectedProduct)) {
      setQty(selectedProduct?.quantity);
      setNotes(selectedProduct?.remark);
    }
  };

  const handleProductVariantSelected = () => {
    if (
      !isEmptyArray(selectedProduct?.product?.variants) &&
      isEmptyArray(selectedVariantOptions)
    ) {
      let selected = {};

      selectedProduct.product?.variants.forEach((item) => {
        if (item.id === selectedProduct.product?.id) {
          selected = item;
        }
      });
      setQty(selectedProduct?.quantity);
      setNotes(selectedProduct?.remark);
      setSelectedVariantOptions(selected?.attributes);
    } else if (!isEmptyArray(product?.variants)) {
      const result = isEmptyArray(selectedVariantOptions)
        ? product?.variants[0]?.attributes || []
        : selectedVariantOptions;
      setSelectedVariantOptions(result);
    }
  };

  const handleProductModifierSelected = () => {
    if (!isEmptyArray(selectedProduct?.product?.productModifiers)) {
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
      setQty(selectedProduct?.quantity);
      setNotes(selectedProduct?.remark);
      setSelectedProductModifiers(defaultValue);
    }
  };

  useEffect(() => {
    handleProductModifierSelected();
    handleProductVariantSelected();
    handleProductSelected();
  }, []);

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
      const productVariantFormated = handleProductVariantFormated(
        selectedVariantOptions
      );

      if (!isEmptyObject(selectedProduct)) {
        const productVariant = {
          id: selectedProduct.id,
          productID: `product::${productVariantFormated.id}`,
          retailPrice: productVariantFormated.retailPrice,
          remark: notes,
          quantity: qty,
          unitPrice: productVariantFormated.retailPrice,
          ...(product.manageStock && {
            currentStock: productVariantFormated.currentStock || 0,
          }),
        };

        return setProductUpdate(productVariant);
      }
      return setProductAdd({
        productID: `product::${productVariantFormated.id}`,
        retailPrice: productVariantFormated.retailPrice,
        remark: notes,
        quantity: qty,
        ...(product.manageStock && {
          currentStock: productVariantFormated.currentStock || 0,
        }),
      });
    }

    if (!isEmptyArray(product?.productModifiers)) {
      const productModifierFormated = handleProductModifierFormated(
        selectedProductModifiers
      );

      const price = totalPrice / qty;

      if (!isEmptyObject(selectedProduct)) {
        return setProductUpdate({
          id: selectedProduct.id,
          productID: `product::${product.id}`,
          retailPrice: price,
          remark: notes,
          quantity: qty,
          unitPrice: price,
          modifiers: productModifierFormated,
        });
      }
      return setProductAdd({
        productID: `product::${product.id}`,
        retailPrice: price,
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
          unitPrice: product.retailPrice,
          ...(product.manageStock && {
            currentStock: product.currentStock || 0,
          }),
        });
      }

      return setProductAdd({
        productID: `product::${product.id}`,
        retailPrice: product.retailPrice,
        remark: notes,
        quantity: qty,
        ...(product.manageStock && {
          currentStock: product.currentStock || 0,
        }),
      });
    }
  }, [
    qty,
    notes,
    product,
    totalPrice,
    selectedProduct,
    selectedVariantOptions,
    selectedProductModifiers,
  ]);

  useEffect(() => {
    if (product?.manageStock) {
      const productData = !isEmptyObject(selectedProduct)
        ? productUpdate
        : productAdd;

      const currentItemQuantityInCart = basket?.details
        ? basket.details.reduce((acc, item) => {
            if (item.productID === productData.productID) {
              return acc + item.quantity;
            }
            return acc;
          }, 0)
        : 0;
      const currentStock = Math.max(
        productData.currentStock - currentItemQuantityInCart,
        0
      );

      setStock({ manage: true, current: currentStock });
    } else {
      setStock({ manage: false });
    }
  }, [basket, product, selectedProduct, productUpdate, productAdd]);

  useEffect(() => {
    if (stock.manage) {
      if (qty >= stock.current) {
        setIncreaseQtyButtonDisabled(true);
      } else {
        setIncreaseQtyButtonDisabled(false);
      }
      if (stock.current === 0) {
        setDecreaseQtyButtonDisabled(true);
      } else {
        setDecreaseQtyButtonDisabled(false);
      }
    }
  }, [stock, qty]);

  useEffect(() => {
    if (isLoading) {
      setIncreaseQtyButtonDisabled(true);
      setDecreaseQtyButtonDisabled(true);
    } else {
      setIncreaseQtyButtonDisabled(false);
      setDecreaseQtyButtonDisabled(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if (selectedProduct?.quantity) {
      setQty(selectedProduct?.quantity);
    } else {
      setQty(1);
    }
  }, [selectedVariantOptions]);

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

          const result = qtyModifierSelected >= productModifier.modifier?.min;
          qtyModifierSelected = 0;
          return result;
        }
      );

      const productModifierAllTrue = productModifiers.every((v) => v === true);
      return !productModifierAllTrue;
    }

    if (stock.manage && stock.current < qty) {
      return true;
    }

    if (!isLoading) {
      return false;
    }

    return true;
  };

  const handleAddOrUpdateProduct = async () => {
    setIsLoading(true);
    if (!isEmptyObject(selectedProduct)) {
      await props.dispatch(OrderAction.processUpdateCart(productUpdate));
      if (props.deliveryProviderSelected) {
        const payloadCalculateFee = {
          outletId: basket.outlet.id,
          cartID: basket.cartID,
          deliveryAddress: props.deliveryAddress,
        };

        const responseCalculateFee = await props.dispatch(
          OrderAction.getCalculateFee(payloadCalculateFee)
        );

        if (!isEmptyArray(responseCalculateFee.dataProvider)) {
          const [filteredData] = responseCalculateFee.dataProvider.filter(
            (item) => (item.id = props.deliveryProviderSelected.id)
          );
          const payloadOrderingModeChange = {
            orderingMode: CONSTANT.ORDERING_MODE_DELIVERY,
            provider: filteredData,
          };

          await props.dispatch(
            OrderAction.changeOrderingMode(payloadOrderingModeChange)
          );

          await props.dispatch(
            OrderAction.setData(filteredData, 'SET_SELECTED_DELIVERY_PROVIDERS')
          );
        }
      }
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

    if (max === 0) {
      return false;
    }

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

    const modifierProductIds = selectedProductModifiers.map((item) => {
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
            // style={styles.marginLeft}
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
          {variant.options.length - 1 !== index && <Divider />}
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
            <Divider style={{ marginTop: 10 }} />
            <RadioGroup defaultValue={selectedVariantOptions[index]?.value}>
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

    const qty = selectedProductModifier?.qty || 0;

    if (qty > 0) {
      return (
        <div style={styles.rootMofidierOptions}>
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

  const renderAddAndRemoveButtonAndPrice = ({ modifier, productModifier }) => {
    const renderButtonAndPrice = (
      <>
        {/* <Typography style={styles.optionPriceGadgetScreen}>
          {handleCurrency(modifier.price)}
        </Typography> */}
        {renderAddAndRemoveButtonProductModifierOptions({
          modifierProductId: modifier.productID,
          max: productModifier.modifier.max,
          min: productModifier.modifier.min,
        })}
      </>
    );

    if (gadgetScreen) {
      return (
        <div style={styles.modifierOptionsPrice}>{renderButtonAndPrice}</div>
      );
    }
    return <div style={styles.displayFlex}>{renderButtonAndPrice}</div>;
  };

  const renderProductModifierOptions = (productModifier) => {
    const productModifierOptions = productModifier.modifier?.details?.map(
      (modifier, index) => {
        return (
          <div key={index}>
            <div style={styles.modifierOption}>
              <FormControlLabel
                // style={styles.marginLeft}
                value={modifier.productID}
                checked={isCheckedCheckbox(modifier)}
                control={
                  <Checkbox
                    sx={styles.radioSizeModifier}
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
                  <>
                    <Typography style={styles.optionTitle}>
                      {modifier.name}
                    </Typography>
                    <Typography style={styles.optionPriceGadgetScreen}>
                      {handleCurrency(modifier.price)}
                    </Typography>
                  </>
                }
              />
              {renderAddAndRemoveButtonAndPrice({ modifier, productModifier })}
            </div>
            {productModifier.modifier.details.length - 1 !== index && (
              <Divider />
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
    if (!gadgetScreen) {
      return (
        <IconButton
          style={styles.buttonIcon}
          disabled={isLoading}
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
    if (gadgetScreen) {
      return (
        <div style={styles.buttonCloseGadgetSize}>
          <IconButton
            style={styles.buttonIconClose}
            disabled={isLoading}
            onClick={() => {
              handleClear();
              handleClose();
            }}
          >
            <CloseIcon style={styles.iconClose} />
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
          {isLoading ? 'Loading.....' : 'Add to Cart'}
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
      <DialogContent style={styles.backgroundColor}>
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
            <div
              style={{
                display: 'flex',
                marginTop: 15,
                marginBottom: 15,
              }}
            >
              <Typography style={styles.productName}>
                {product.name} {variantName}{' '}
              </Typography>
              <Typography style={styles.productPrice}>
                {' '}
                {handleCurrency(totalPrice)}
              </Typography>
            </div>

            <Typography style={styles.productDescription}>
              {product.description}
            </Typography>
          </div>

          {renderCloseButton()}
        </div>

        <div>{renderVariants(product?.variantOptions)}</div>

        <div>{renderProductModifiers(product?.productModifiers)}</div>

        <div>
          <Typography style={styles.stock}>
            {stock.manage
              ? stock.current < qty
                ? stock.current === 0
                  ? 'Out of stock'
                  : `Only ${stock.current} item(s) left`
                : ''
              : ''}
          </Typography>
        </div>

        <div>{renderSpecialInstruction()}</div>
      </DialogContent>
      <DialogActions style={styles.footer}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            marginBottom: 10,
          }}
        >
          <Typography style={styles.itemQty}>Item Quantity</Typography>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              style={styles.buttonIcon}
              disabled={qty === 0 || decreaseQtyButtonDisabled}
              onClick={() => {
                setQty(qty - 1);
              }}
            >
              <RemoveIcon style={styles.icon} />
            </IconButton>
            <Typography style={styles.qty}>{qty}</Typography>
            <IconButton
              disabled={increaseQtyButtonDisabled}
              style={styles.buttonIcon}
              onClick={() => {
                setQty(qty + 1);
              }}
            >
              <AddIcon style={styles.icon} />
            </IconButton>
          </div>
        </div>
        {renderTotalPriceOrRemove()}
      </DialogActions>
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
