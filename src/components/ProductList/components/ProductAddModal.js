import React, { Fragment, useEffect, useState, useRef } from 'react';
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
import { useHistory, useLocation } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import fontStyleCustom from 'pages/GuestCheckout/style/styles.module.css';
import { isEmpty } from 'helpers/utils';
import commonAlert from 'components/template/commonAlert';

import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';
import 'swiper/swiper.scss';
import './style/swiperstyle.css';
import { Pagination, Navigation } from 'swiper';

import { OrderAction } from 'redux/actions/OrderAction';
import Swal from 'sweetalert2';
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
    basketGuestCO: state.guestCheckoutCart.data,
    refreshData: state.guestCheckoutCart.refreshData,
    basketUpdate: state.order.basketUpdate,
    isCartDeleted: state.guestCheckoutCart.isCartDeleted,
    saveSelectProductModifier: state.order.saveSelectProductModifier,
    buildCartErrorData: state.order.buildCartErrorData,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

const SwiperSlideImageCustom = ({ images }) => {
  return (
    <Swiper
        pagination={{
          type: 'fraction',
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
      >
        {images?.map((item) => (
          <SwiperSlide key={item}>
            <img src={item} alt='images' />
          </SwiperSlide>
        ))}
      </Swiper>
     
  );
};

const ProductAddModal = ({
  open,
  handleClose,
  product,
  width,
  selectedProduct,
  basket,
  productDetail,
  ...props
}) => {
  const [selectedProductModifiers, setSelectedProductModifiers] = useState([]);
  const history = useHistory();
  const location = useLocation();
  const gadgetScreen = width < 600;
  const theme = useTheme();
  const [mode, setMode] = useState();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [idGuestCheckout, setIdGuestCheckout] = useState();
  const productDescriptionRef = useRef(null);

  useEffect(() => {
    const handleImgClick = (event) => {
      let targetElement = event.target;
      while (targetElement && targetElement.tagName !== 'IMG') {
        targetElement = targetElement.parentElement;
      }
      if (targetElement && targetElement.tagName === 'IMG') {
        const imgElement = document.createElement('img');
        imgElement.src = targetElement.src;

        Swal.fire({
          title: 'Image Preview',
          html: imgElement,
          allowOutsideClick: false,
          confirmButtonText: 'OK',
          confirmButtonColor: props.color.primary,
          width: '40em',
          customClass: {
            confirmButton: fontStyleCustom.buttonSweetAlert,
            title: fontStyleCustom.fontTitleSweetAlert,
            container: fontStyleCustom.containerSweetAlert,
          },
        });
      }
    };

    if (productDescriptionRef.current) {
      const imgElements =
        productDescriptionRef.current.getElementsByTagName('img');
      for (let i = 0; i < imgElements.length; i++) {
        imgElements[i].addEventListener('click', handleImgClick);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productDescriptionRef.current]);

  /**
   * Side effect when `buildCartErrorData` updated
   * @description Displays a cart error alert when `buildCartErrorData` is not empty.
   */
  useEffect(() => {
    let isMounted = true;

    if (isMounted && !isEmpty(props.buildCartErrorData)) {
      commonAlert({
        color: props.color.primary,
        title: props.buildCartErrorData.title || 'Error!',
        content: props.buildCartErrorData.message,
        onConfirm: () => {
          props.dispatch({
            type: CONSTANT.BUILD_CART_ERROR_DATA,
            payload: null,
          });
        },
      });
    }

    return () => {
      isMounted = false;
    };
  }, [props, props.buildCartErrorData, props.color.primary, props.dispatch]);

  useEffect(() => {
    const isGuestCheckout = localStorage.getItem('settingGuestMode');
    const idGuestCheckout = localStorage.getItem('idGuestCheckout');
    setIdGuestCheckout(idGuestCheckout);
    setMode(isGuestCheckout);
  }, []);

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
      color: props.color.font,
    },
    productPrice: {
      fontWeight: 700,
      fontSize: '14px',
      lineHeight: '18px',
      color: props.color.primary,
    },
    productDescription: {
      fontWeight: '500',
      fontSize: '12px',
      lineHeight: '15px',
      color: props.color.font,
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
    fullWidth: { width: '100%', padding: gadgetScreen ? '0px' : '0px 20px' },
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
      top: 10,
      right: 10,
      zIndex:9999
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
      display: 'flex',
      justifyContent: 'center',
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

  const [variantName, setVariantName] = useState();
  const [qty, setQty] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [productAdd, setProductAdd] = useState({});
  const [productUpdate, setProductUpdate] = useState({});
  const [selectedVariantOptions, setSelectedVariantOptions] = useState([]);
  const [variantImageURL, setVariantImageURL] = useState('');
  const [notes, setNotes] = useState('');
  const [isHandleSpesialStriction, setIsHandleSpesialStriction] =
    useState(true);
  const [increaseQtyButtonDisabled, setIncreaseQtyButtonDisabled] =
    useState(true);
  const [decreaseQtyButtonDisabled, setDecreaseQtyButtonDisabled] =
    useState(true);

  const [stock, setStock] = useState({ manage: false, current: 0 });

  useEffect(() => {
    const productModifierTemp =
      product?.productModifiers || productDetail?.productModifiers;

    if (productModifierTemp) {
      let arrFinalData = [];
      productModifierTemp?.forEach((item) => {
        const modifier = item.modifier || item;
        if (
          modifier?.max === 1 &&
          modifier?.min === 1 &&
          modifier?.details?.length === 1
        ) {
          const data = modifier?.details[0];
          const objData = {
            modifierProductId: data.productID,
            modifierId: modifier.modifierID || modifier.id,
            qty: 1,
            price: data.price,
            name: data.name,
          };
          arrFinalData.push(objData);
        }
      });
      setSelectedProductModifiers(arrFinalData);
    }
  }, [product, productDetail]);
  const handlePrice = ({ qty, totalPrice }) => {
    setTotalPrice(qty * totalPrice);
  };

  const parser = new DOMParser();
  const doc = parser.parseFromString(
    product?.description || productDetail?.description,
    'text/html'
  );
  const hasHTMLContent = Array.from(doc.body.childNodes).some(
    (node) => node.nodeType === Node.ELEMENT_NODE
  );

  const handleProductSelected = () => {
    if (!isEmptyObject(selectedProduct)) {
      setQty(selectedProduct?.quantity);
      setNotes(selectedProduct?.remark);
    }
  };

  const handleProductVariantSelected = () => {
    if (
      selectedProduct?.product?.id?.includes('_') &&
      isEmptyArray(selectedVariantOptions)
    ) {
      let selected = {};

      productDetail?.variants?.forEach((item) => {
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
    if (!isEmptyArray(selectedProduct?.modifiers)) {
      let defaultValue = [];
      selectedProduct.modifiers?.forEach((item) => {
        item.modifier?.details?.forEach((detail) => {
          defaultValue.push({
            modifierId: item.modifierID,
            modifierProductId: detail.productID,
            name: detail.name,
            price: detail.price,
            qty: detail.quantity,
            specialRestriction: detail.specialRestriction,
            min: detail?.min,
            max: detail?.max,
            orderingStatus: detail.orderingStatus,
          });
        });
      });
      setQty(selectedProduct?.quantity);
      setNotes(selectedProduct?.remark);
      setSelectedProductModifiers(defaultValue);
      props.dispatch({
        type: CONSTANT.SAVE_SELECTED_PRODUCT_MODIFIER,
        payload: defaultValue,
      });
    }
  };

  useEffect(() => {
    handleProductModifierSelected();
    handleProductVariantSelected();
    handleProductSelected();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                max: item?.max,
                min: item?.min,
                specialRestriction: item?.specialRestriction,
              },
            ],
          },
        });
      });

      const productModifierMerged = productModifiers.reduce((obj, a) => {
        if (obj[a.modifierID]) {
          obj[a.modifierID].modifier?.details?.push(...a.modifier?.details);
        } else {
          obj[a.modifierID] = { ...a };
        }
        return obj;
      }, {});

      const result = Object.values(productModifierMerged);

      totalPrice = totalPrice + (product.retailPrice || 0);

      handlePrice({
        qty,
        totalPrice,
      });

      return result;
    }

    totalPrice = totalPrice + (product.retailPrice || 0);
    handlePrice({
      qty,
      totalPrice,
    });
    return productModifiers;
  };

  const handleProductVariantFormated = (items) => {
    let productVariant = {};
    const productVariantName = items?.map((item) => {
      return item.value;
    });

    productDetail?.variants?.forEach((variant) => {
      if (JSON.stringify(variant.attributes) === JSON.stringify(items)) {
        productVariant = variant;
      }
    });

    setVariantImageURL(productVariant?.defaultImageURL);
    setVariantName(productVariantName?.join(' '));

    handlePrice({
      qty,
      totalPrice: productVariant?.retailPrice || 0,
    });

    return productVariant;
  };

  useEffect(() => {
    if (!isEmptyArray(productDetail?.variants)) {
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
          ...(productDetail.manageStock && {
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
        ...(productDetail.manageStock && {
          currentStock: productVariantFormated.currentStock || 0,
        }),
      });
    }

    if (!isEmptyArray(productDetail?.productModifiers)) {
      const filterSelectedProductModifiers = selectedProductModifiers.filter(
        (item) => item.orderingStatus !== 'UNAVAILABLE'
      );
      const isSelectedProductExist = !isEmptyObject(selectedProduct)
        ? filterSelectedProductModifiers
        : [
            ...filterSelectedProductModifiers,
            ...props.saveSelectProductModifier,
          ];

      const productModifierFormated = handleProductModifierFormated(
        isSelectedProductExist
      );

      const price = totalPrice / qty || 0;

      if (!isEmptyObject(selectedProduct)) {
        return setProductUpdate({
          id: selectedProduct.id,
          productID: `product::${productDetail.id}`,
          retailPrice: price,
          remark: notes,
          quantity: qty,
          unitPrice: price,
          modifiers: productModifierFormated,
        });
      }
      return setProductAdd({
        productID: `product::${productDetail.id}`,
        retailPrice: price,
        remark: notes,
        quantity: qty,
        modifiers: productModifierFormated,
      });
    }

    if (productDetail) {
      handlePrice({
        qty,
        totalPrice: productDetail?.retailPrice || 0,
      });
      if (!isEmptyObject(selectedProduct)) {
        return setProductUpdate({
          id: selectedProduct.id,
          productID: `product::${productDetail.id}`,
          retailPrice: productDetail.retailPrice || 0,
          remark: notes,
          quantity: qty,
          unitPrice: productDetail.retailPrice || 0,
          ...(productDetail.manageStock && {
            currentStock: productDetail.currentStock || 0,
          }),
        });
      }

      return setProductAdd({
        productID: `product::${productDetail.id}`,
        retailPrice: productDetail.retailPrice || 0,
        remark: notes,
        quantity: qty,
        ...(productDetail.manageStock && {
          currentStock: productDetail.currentStock || 0,
        }),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    qty,
    notes,
    product,
    totalPrice,
    selectedProduct,
    selectedVariantOptions,
    selectedProductModifiers,
    isHandleSpesialStriction,
    props.saveSelectProductModifier,
    productDetail,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVariantOptions]);

  const handleClear = () => {
    setQty(1);
    setTotalPrice(0);
    setSelectedVariantOptions([]);
    setSelectedProductModifiers([]);
  };

  const handleCurrency = (value) => {
    const price = value || 0;
    const result = price.toLocaleString(props.companyInfo.currency.locale, {
      style: 'currency',
      currency: props.companyInfo.currency.code,
    });

    return result;
  };

  const isCheckedCheckbox = ({ modifier, productModifierId }) => {
    const filterSelectedProductModifiers = selectedProductModifiers.filter(
      (item) => item.orderingStatus !== 'UNAVAILABLE'
    );
    const isChecked = filterSelectedProductModifiers.find(
      (selectedProductModifier) =>
        selectedProductModifier.modifierId === productModifierId &&
        selectedProductModifier.modifierProductId === modifier.productID
    );

    return !!isChecked;
  };

  const isCheckedCheckboxForSpecialRestriction = ({
    modifier,
    productModifierId,
  }) => {
    const isChecked = props.saveSelectProductModifier.find(
      (selectedProductModifier) =>
        selectedProductModifier.modifierId === productModifierId &&
        selectedProductModifier.modifierProductId === modifier.productID
    );

    return !!isChecked;
  };

  const handleAddAndReduceQtyProductModifier = ({
    key,
    value,
    isSpecialRestriction,
  }) => {
    if (isSpecialRestriction) {
      let productModifiersQtyChanged = [];
      const qty = key === 'add' ? value.qty + 1 : value.qty - 1;

      props.saveSelectProductModifier.forEach((selectedProductModifier) => {
        if (
          selectedProductModifier.modifierProductId ===
            value.modifierProductId &&
          qty !== 0
        ) {
          productModifiersQtyChanged.push({ ...value, qty });
        } else if (
          selectedProductModifier.modifierProductId ===
            value.modifierProductId &&
          qty === 0
        ) {
          productModifiersQtyChanged.push();
        } else {
          productModifiersQtyChanged.push(selectedProductModifier);
        }
      });

      props.dispatch({
        type: CONSTANT.SAVE_SELECTED_PRODUCT_MODIFIER,
        payload: productModifiersQtyChanged,
      });
      if (!isEmptyObject(selectedProduct)) {
        setSelectedProductModifiers(productModifiersQtyChanged);
      }
    } else {
      let productModifiersQtyChanged = [];
      const qty = key === 'add' ? value.qty + 1 : value.qty - 1;

      selectedProductModifiers.forEach((selectedProductModifier) => {
        if (
          selectedProductModifier.modifierProductId ===
            value.modifierProductId &&
          qty !== 0
        ) {
          productModifiersQtyChanged.push({ ...value, qty });
        } else if (
          selectedProductModifier.modifierProductId ===
            value.modifierProductId &&
          qty === 0
        ) {
          productModifiersQtyChanged.push();
        } else {
          productModifiersQtyChanged.push(selectedProductModifier);
        }
      });

      setSelectedProductModifiers(productModifiersQtyChanged);
    }
  };

  const handleDisabledAddProductButton = () => {
    const productModifierTemp =
      product?.productModifiers || productDetail?.productModifiers;

    if (!isEmptyArray(productModifierTemp) && !isLoading) {
      let qtyModifierSelected = 0;
      const productModifiers = productModifierTemp?.map((productModifier) => {
        selectedProductModifiers.forEach((selectedProductModifier) => {
          const productModifierId =
            productModifier.modifierID || productModifier.id;

          if (productModifierId === selectedProductModifier.modifierId)
            qtyModifierSelected =
              qtyModifierSelected + selectedProductModifier.qty;
        });

        const isMinZero =
          productModifier.modifier?.min || productModifier.min || 0;
        const result = qtyModifierSelected >= isMinZero;
        qtyModifierSelected = 0;
        return result;
      });
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

      props.dispatch({
        type: CONSTANT.DATA_BASKET_UPDATE,
        data: !props.basketUpdate,
      });

      if (!isEmptyObject(props.deliveryProviderSelected)) {
        const payloadCalculateFee = {
          outletId: basket.outlet.id,
          cartID: basket.cartID,
          deliveryAddress: props.deliveryAddress || props.defaultOutlet,
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
      props.dispatch({
        type: CONSTANT.SAVE_SELECTED_PRODUCT_MODIFIER,
        payload: [],
      });
    }

    setIsLoading(false);
    handleClose();
    handleClear();
  };

  const removeProductGuestMode = async () => {
    setIsLoading(true);
    const response = await props.dispatch(
      OrderAction.processRemoveCartGuestCheckoutMode(
        idGuestCheckout,
        selectedProduct
      )
    );
    if (response?.resultCode === 200) {
      props.dispatch({
        type: CONSTANT.IS_CART_DELETED,
        payload: !props.isCartDeleted,
      });
      handleClose();
      handleClear();
      setIsLoading(false);

      if (props.basketGuestCO?.details?.length === 1) {
        props.dispatch({
          type: CONSTANT.SET_ORDERING_MODE_GUEST_CHECKOUT,
          payload: '',
        });
        location.pathname !== '/' && history.push('/');
      }
    } else {
      alert('Failed');
    }
    setIsLoading(false);
  };

  const handleAddOrUpdateProductModeGuest = async () => {
    setIsLoading(true);
    if (!isEmptyObject(selectedProduct)) {
      await props.dispatch(
        OrderAction.processUpdateCartGuestMode(idGuestCheckout, productUpdate)
      );
    } else {
      await props.dispatch(
        OrderAction.addCartToGuestMode(
          idGuestCheckout,
          props.defaultOutlet,
          productAdd
        )
      );
    }
    setIsLoading(false);
    props.dispatch({
      type: CONSTANT.SAVE_SELECTED_PRODUCT_MODIFIER,
      payload: [],
    });
    handleClose();
    handleClear();
  };
  const handleDisabledCheckbox = ({ modifier, max, productModifier }) => {
    const productModifierId = productModifier.modifierID || productModifier.id;
    let qtyTotal = 0;
    const filterSelectedProductModifiers = selectedProductModifiers.filter(
      (item) => item.orderingStatus !== 'UNAVAILABLE'
    );
    const modifierProducts = filterSelectedProductModifiers.filter(
      (item) => item.modifierId === productModifierId
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

  const handleDisabledRemoveButtonProductModifier = ({
    modifier,
    min,
    isSpecialRestriction,
  }) => {
    if (isSpecialRestriction) {
      if (min > 0) {
        let qtyTotal = 0;

        const modifierProducts = props.saveSelectProductModifier.filter(
          (item) => item.modifierId === modifier.modifierId
        );

        modifierProducts.forEach((modifierProduct) => {
          qtyTotal = qtyTotal + modifierProduct.qty;
        });

        const isDisabled = qtyTotal <= min;

        return isDisabled;
      }
    }
  };

  const handleDisabledAddButtonProductModifier = ({
    modifier,
    max,
    isSpecialRestriction,
  }) => {
    if (isSpecialRestriction) {
      if (max > 0) {
        let qtyTotal = 0;

        const modifierProducts = props.saveSelectProductModifier.filter(
          (item) => item.modifierId === modifier.modifierId
        );

        modifierProducts.forEach((modifierProduct) => {
          qtyTotal = qtyTotal + modifierProduct.qty;
        });

        const isDisabled = qtyTotal >= max;

        return isDisabled;
      }
    } else {
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
    const mergeID = `${modifierId}${modifierProductId}`;
    const items = selectedProductModifiers;

    const modifierProductIds = selectedProductModifiers.map((item) => {
      return `${item.modifierId}${item.modifierProductId}`;
    });

    const modifierProductIdIndex = modifierProductIds.indexOf(mergeID);
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

  const handleModifierOptionSelectedSpecialRestriction = ({
    modifierProductId,
    modifierId,
    qty,
    price,
    name,
    min,
    max,
    specialRestriction,
  }) => {
    const mergeID = `${modifierId}${modifierProductId}`;
    let items = selectedProductModifiers;
    const objData = {
      modifierId,
      modifierProductId,
      qty,
      price,
      name,
      min,
      max,
      specialRestriction,
    };
    const modifierProductIds = selectedProductModifiers.map((item) => {
      return `${item.modifierId}${item.modifierProductId}`;
    });

    const modifierProductIdIndex = modifierProductIds.indexOf(mergeID);

    if (modifierProductIdIndex !== -1) {
      items.splice(modifierProductIdIndex, 1);
      setSelectedProductModifiers([...items]);
    } else {
      if (!isEmptyObject(selectedProduct)) {
        items = items.map((itemData) => {
          if (itemData.specialRestriction) {
            itemData = objData;
          }
          return itemData;
        });
        setSelectedProductModifiers(items);
        props.dispatch({
          type: CONSTANT.SAVE_SELECTED_PRODUCT_MODIFIER,
          payload: items,
        });
      } else {
        props.dispatch({
          type: CONSTANT.SAVE_SELECTED_PRODUCT_MODIFIER,
          payload: [objData],
        });
      }
    }
  };

  const renderImageProduct = () => {
    const defaultImageURLTemp =
      product?.defaultImageURL || productDetail?.defaultImageURL;

    if (variantImageURL) {
      return variantImageURL;
    }

    if (defaultImageURLTemp) {
      return defaultImageURLTemp;
    }

    if (props?.color?.productPlaceholder) {
      return props.color.productPlaceholder;
    }
    return config.image_placeholder;
  };

  const renderVariantOptions = (variant) => {
    const variantOptions = variant?.options?.map((option, index) => {
      return (
        <Fragment key={index}>
          <FormControlLabel
            value={option}
            control={<Radio id='item-variant-option' sx={styles.radioSize} />}
            label={<Typography style={styles.optionTitle}>{option}</Typography>}
            onClick={() => {
              handleVariantOptionSelected({
                name: variant.optionName,
                value: option,
              });
            }}
          />
          {variant.options.length - 1 !== index && <Divider />}
        </Fragment>
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
            <RadioGroup
              // defaultValue={
              //   selectedVariantOptions?.length
              //     ? selectedVariantOptions[index]?.value
              //     : ''
              // }
              value={
                selectedVariantOptions?.length
                  ? selectedVariantOptions[index]?.value
                  : ''
              }
            >
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
    productModifierId,
  }) => {
    const selectedProductModifier = selectedProductModifiers.find(
      (item) =>
        item.modifierId === productModifierId &&
        item.modifierProductId === modifierProductId
    );

    const qty = selectedProductModifier?.qty || 0;

    if (qty > 0) {
      return (
        <div style={styles.rootMofidierOptions}>
          <IconButton
            id='modifier-minus-button'
            style={styles.buttonIconProductModifier}
            disabled={
              handleDisabledRemoveButtonProductModifier({
                modifier: selectedProductModifier,
                min: selectedProductModifier?.min
                  ? selectedProductModifier.min
                  : min,
                isSpecialRestriction: false,
              }) || isLoading
            }
            onClick={() => {
              handleAddAndReduceQtyProductModifier({
                key: 'reduce',
                value: selectedProductModifier,
                isSpecialRestriction: false,
              });
            }}
          >
            <RemoveIcon style={styles.iconProductModifier} />
          </IconButton>
          <Typography style={styles.qtyProductModifier}>
            {selectedProductModifier.qty}
          </Typography>
          <IconButton
            id='modifier-plus-button'
            style={styles.buttonIconProductModifier}
            disabled={
              handleDisabledAddButtonProductModifier({
                modifier: selectedProductModifier,
                max: selectedProductModifier?.max
                  ? selectedProductModifier.max
                  : max,
                isSpecialRestriction: false,
              }) || isLoading
            }
            onClick={() => {
              handleAddAndReduceQtyProductModifier({
                key: 'add',
                value: selectedProductModifier,
                isSpecialRestriction: false,
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
    const isMinZero = productModifier?.min === 0 || !productModifier?.min;
    const isMaxZero = productModifier?.max === 0 || !productModifier?.max;
    const isMinMoreThenZero = productModifier?.min > 0;
    const isMaxLessThenZero = productModifier?.max > 0;

    if (isMinZero && isMaxZero) {
      return <Typography style={styles.title2}>Optional</Typography>;
    }

    if (isMinMoreThenZero && isMaxZero) {
      return (
        <Typography style={styles.title2}>Min {productModifier.min}</Typography>
      );
    }

    if (isMinZero && isMaxLessThenZero) {
      return (
        <Typography style={styles.title2}>Max {productModifier.max}</Typography>
      );
    }

    if (isMinMoreThenZero && isMaxLessThenZero) {
      return (
        <Typography style={styles.title2}>
          Min {productModifier.min}, Max {productModifier.max}
        </Typography>
      );
    }
  };

  const renderAddAndRemoveButtonAndPrice = ({ modifier, productModifier }) => {
    const productModifierTemp = productModifier?.modifier || productModifier;
    const renderButtonAndPrice = (
      <>
        {renderAddAndRemoveButtonProductModifierOptions({
          modifierProductId: modifier.productID,
          max: productModifierTemp.max,
          min: productModifierTemp.min,
          productModifierId: productModifierTemp.id,
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

  const renderAddAndRemoveButtonProductModifierOptionsSpecialRes = ({
    modifierProductId,
    productModifierId,
  }) => {
    const selectedSpecialRestriction = props.saveSelectProductModifier.find(
      (item) =>
        item.modifierId === productModifierId &&
        item.modifierProductId === modifierProductId
    );

    const qty = selectedSpecialRestriction?.qty || 0;
    if (qty > 0) {
      return (
        <div style={styles.rootMofidierOptions}>
          <IconButton
            style={styles.buttonIconProductModifier}
            disabled={
              handleDisabledRemoveButtonProductModifier({
                modifier: selectedSpecialRestriction,
                min: selectedSpecialRestriction.min,
                isSpecialRestriction: true,
              }) || isLoading
            }
            onClick={() => {
              handleAddAndReduceQtyProductModifier({
                key: 'reduce',
                value: selectedSpecialRestriction,
                isSpecialRestriction: true,
              });
            }}
          >
            <RemoveIcon style={styles.iconProductModifier} />
          </IconButton>
          <Typography style={styles.qtyProductModifier}>
            {selectedSpecialRestriction.qty}
          </Typography>
          <IconButton
            style={styles.buttonIconProductModifier}
            disabled={
              handleDisabledAddButtonProductModifier({
                modifier: selectedSpecialRestriction,
                max: selectedSpecialRestriction.max,
                isSpecialRestriction: true,
              }) || isLoading
            }
            onClick={() => {
              handleAddAndReduceQtyProductModifier({
                key: 'add',
                value: selectedSpecialRestriction,
                isSpecialRestriction: true,
              });
            }}
          >
            <AddIcon style={styles.iconProductModifier} />
          </IconButton>
        </div>
      );
    }
  };

  const renderAddAndRemoveButtonAndPriceSpecialRestriction = ({
    modifier,
    productModifier,
  }) => {
    const productModifierId = productModifier.modifierID || productModifier.id;
    if (gadgetScreen) {
      return (
        <div style={styles.modifierOptionsPrice}>
          {renderAddAndRemoveButtonProductModifierOptionsSpecialRes({
            modifierProductId: modifier.productID,
            productModifierId,
          })}
        </div>
      );
    }
    return (
      <div style={styles.displayFlex}>
        {renderAddAndRemoveButtonProductModifierOptionsSpecialRes({
          modifierProductId: modifier.productID,
          productModifierId,
        })}
      </div>
    );
  };

  const renderSpecialRestrictionProductModifier = (productModifier) => {
    const productModifierDetails =
      productModifier.modifier?.details || productModifier.details;

    const productModifierOptions = productModifierDetails?.map(
      (modifier, index) => {
        const passData = {
          modifierProductId: modifier.productID,
          modifierId: productModifier.modifierID || productModifier.id,
          qty: modifier.min ? modifier.min : 1,
          price: modifier.price,
          name: modifier.name,
          max: modifier.max,
          min: modifier.min,
          specialRestriction:
            productModifier.modifier?.specialRestriction ||
            productModifier.specialRestriction,
        };
        return (
          <div
            key={modifier.name}
            style={{
              position: modifier.orderingStatus === 'UNAVAILABLE' && 'relative',
            }}
          >
            <div style={styles.modifierOption}>
              <FormControlLabel
                checked={isCheckedCheckboxForSpecialRestriction({
                  modifier,
                  productModifierId:
                    productModifier.modifierID || productModifier.id,
                })}
                sx={{
                  opacity: modifier?.orderingStatus === 'UNAVAILABLE' && 0.5,
                  pointerEvents:
                    modifier?.orderingStatus === 'UNAVAILABLE' && 'none',
                }}
                value={modifier.productID}
                control={
                  <Radio
                    id='item-variant-option'
                    sx={styles.radioSizeModifier}
                    name={modifier.productID}
                    onChange={() => {
                      if (!isEmptyObject(selectedProduct)) {
                        setIsHandleSpesialStriction(!isHandleSpesialStriction);
                      }
                      handleModifierOptionSelectedSpecialRestriction(passData);
                    }}
                    disabled={handleDisabledCheckbox({
                      modifier,
                      max: productModifier.modifier?.max || productModifier.max,
                      productModifier,
                    })}
                  />
                }
                label={
                  <>
                    <div>
                      <Typography
                        style={styles.optionTitle}
                        className={fontStyleCustom.myFont}
                      >
                        {modifier.name}
                      </Typography>
                      <Typography style={styles.optionPriceGadgetScreen}>
                        {`(Min. ${modifier.min},`} {`Max ${modifier.max})`}
                      </Typography>
                      <Typography style={styles.optionPriceGadgetScreen}>
                        {handleCurrency(modifier.price)}
                      </Typography>
                    </div>
                    {modifier.orderingStatus === 'UNAVAILABLE' && (
                      <div
                        style={{
                          position: 'absolute',
                          right: 0,
                          bottom: '30%',
                          color: 'red',
                          fontSize: '14px',
                          fontWeight: 700,
                        }}
                        className={fontStyleCustom.myFont}
                      >
                        Out of Stock
                      </div>
                    )}
                  </>
                }
              />
              {renderAddAndRemoveButtonAndPriceSpecialRestriction({
                modifier,
                productModifier,
              })}
            </div>
            {productModifierDetails?.length - 1 !== index && (
              <Divider sx={{ margin: '5px 0px' }} />
            )}
          </div>
        );
      }
    );

    return productModifierOptions;
  };

  const renderProductModifierOptions = (productModifier) => {
    const productModifierDetails =
      productModifier?.modifier?.details || productModifier?.details;
    const productModifierOptions = productModifierDetails?.map(
      (modifier, index) => {
        return (
          <div
            key={modifier.name}
            style={{
              position: modifier.orderingStatus === 'UNAVAILABLE' && 'relative',
            }}
          >
            <div style={styles.modifierOption}>
              <FormControlLabel
                value={modifier.productID}
                checked={isCheckedCheckbox({
                  modifier,
                  productModifierId:
                    productModifier.modifierID || productModifier.id,
                })}
                sx={{
                  opacity: modifier.orderingStatus === 'UNAVAILABLE' && 0.5,
                  pointerEvents:
                    modifier.orderingStatus === 'UNAVAILABLE' && 'none',
                }}
                control={
                  <Checkbox
                    id='item-modifier-option'
                    sx={styles.radioSizeModifier}
                    name={modifier.productID}
                    onChange={() => {
                      handleModifierOptionSelected({
                        modifierProductId: modifier.productID,
                        modifierId:
                          productModifier.modifierID || productModifier.id,
                        qty: 1,
                        price: modifier.price,
                        name: modifier.name,
                      });
                    }}
                    disabled={handleDisabledCheckbox({
                      modifier,
                      max: productModifier.modifier?.max || productModifier.max,
                      productModifier,
                    })}
                  />
                }
                label={
                  <>
                    <div>
                      <Typography style={styles.optionTitle}>
                        {modifier.name}
                      </Typography>
                      <Typography style={styles.optionPriceGadgetScreen}>
                        {handleCurrency(modifier.price)}
                      </Typography>
                    </div>
                    {modifier.orderingStatus === 'UNAVAILABLE' && (
                      <div
                        style={{
                          position: 'absolute',
                          right: 0,
                          bottom: '30%',
                          color: 'red',
                          fontSize: '14px',
                          fontWeight: 700,
                        }}
                        className={fontStyleCustom.myFont}
                      >
                        Out of Stock
                      </div>
                    )}
                  </>
                }
              />
              {modifier.orderingStatus === 'AVAILABLE' &&
                renderAddAndRemoveButtonAndPrice({ modifier, productModifier })}
            </div>
            {productModifierDetails?.length - 1 !== index && <Divider />}
          </div>
        );
      }
    );

    return productModifierOptions;
  };

  const checkIfIsModifierItemSpecialRestriction = (itemModifier) => {
    const itemModifierTemp = itemModifier?.modifier || itemModifier;
    if (itemModifierTemp?.specialRestriction) {
      return (
        <RadioGroup>
          {renderSpecialRestrictionProductModifier(itemModifier)}
        </RadioGroup>
      );
    } else {
      return (
        <FormGroup>{renderProductModifierOptions(itemModifier)}</FormGroup>
      );
    }
  };

  const renderHeaderModifier = (product) => {
    const productTemp = product?.modifier || product;
    if (productTemp.specialRestriction) {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography
            style={{
              fontWeight: 700,
              fontSize: '14px',
              lineHeight: '18px',
              color: '#000000',
              marginRight: 5,
            }}
          >
            {productTemp.name}
          </Typography>
          <div
            style={{
              fontSize: '14px',
            }}
          >
            (Select one option)
          </div>
        </div>
      );
    } else {
      return (
        <React.Fragment>
          <Typography style={styles.title}>{productTemp.name}</Typography>
          {renderTermsAndConditionsProductModifiers(productTemp)}
        </React.Fragment>
      );
    }
  };

  const renderProductModifiers = (productModifiers) => {
    if (!isEmptyArray(productModifiers)) {
      const result = productModifiers.map((productModifier, index) => {
        return (
          <Paper key={index} variant='outlined' style={styles.paper}>
            <div style={styles.modifierHeader}>
              {renderHeaderModifier(productModifier)}
            </div>
            {checkIfIsModifierItemSpecialRestriction(productModifier)}
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
            props.dispatch({
              type: CONSTANT.SAVE_SELECTED_PRODUCT_MODIFIER,
              payload: [],
            });
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
            id='exit-button'
            style={styles.buttonIconClose}
            disabled={isLoading}
            onClick={() => {
              props.dispatch({
                type: CONSTANT.SAVE_SELECTED_PRODUCT_MODIFIER,
                payload: [],
              });
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
            if (mode === 'GuestMode') {
              removeProductGuestMode();
            } else {
              handleAddOrUpdateProduct();
            }
          }}
        >
          <Typography style={styles.addText}>Remove</Typography>
        </Button>
      );
    }

    return (
      <Button
        id={`${
          !isEmptyObject(selectedProduct) ? 'update' : 'add-to'
        }-cart-button`}
        style={styles.addButton}
        disabled={handleDisabledAddProductButton()}
        onClick={() => {
          if (mode === 'GuestMode') {
            handleAddOrUpdateProductModeGuest();
          } else {
            handleAddOrUpdateProduct();
          }
        }}
      >
        <Typography style={styles.addText}>
          {isLoading
            ? 'Loading.....'
            : !isEmptyObject(selectedProduct)
            ? 'Update Cart'
            : 'Add to Cart'}
        </Typography>
      </Button>
    );
  };

  const renderSpecialInstruction = () => {
    if (props.defaultOutlet.enableOrderSpecialInstructions) {
      return (
        <div>
          <div style={styles.rootSpecialInstruction}>
            <Typography style={styles.specialInstructionTypography}>
              Special Instruction
            </Typography>
            <Typography style={styles.optionalTypography}>Optional</Typography>
          </div>
          <textarea
            placeholder='please use less plastic'
            id='special-instruction-input'
            style={styles.specialInstructionInput}
            value={notes}
            onChange={(event) => {
              setNotes(event.target.value);
            }}
            maxLength={140}
          />
          <div style={{ textAlign: 'end' }}>
            <span style={{ color: '#CDCECF', fontSize: '14px' }}>
              {notes?.length || 0}/140
            </span>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };
  const removeLastCharFromStr = () => {
    const data = product.name.split(' ');
    const isLastIndexHasLength1 = data.at(-1).length <= 2;

    if (isLastIndexHasLength1) {
      data.pop();
      return data.join(' ');
    } else {
      return data.join(' ');
    }
  };

  const handleHTMLStringCustomization = (descriptionHTML) => {
    const parser = new DOMParser();
    const dom = parser.parseFromString(descriptionHTML, 'text/html');
    const customStyleForLink = dom.getElementsByTagName('a');
    const elementsWithClassNameTab1 = dom.getElementsByClassName('ql-indent-1');
    const elementsWithClassNameTab2 = dom.getElementsByClassName('ql-indent-2');
    const elementsWithClassNameTab3 = dom.getElementsByClassName('ql-indent-3');
    const elementsWithClassNameTab4 = dom.getElementsByClassName('ql-indent-4');
    const elementsWithClassNameTab5 = dom.getElementsByClassName('ql-indent-5');
    const elementsWithClassNameTab6 = dom.getElementsByClassName('ql-indent-6');
    const elementsWithClassNameTab7 = dom.getElementsByClassName('ql-indent-7');
    const elementsWithClassNameTab8 = dom.getElementsByClassName('ql-indent-8');
    const elementUL = dom.getElementsByTagName('ul');
    const elementOL = dom.getElementsByTagName('ol');
    const fontSizeSmall = dom.getElementsByClassName('ql-size-small');
    const fontSizeLarge = dom.getElementsByClassName('ql-size-large');

    for (const ol of elementOL) {
      ol.style.margin = '0px';
      ol.style.paddingLeft = '1.5em';
    }
    for (const ul of elementUL) {
      ul.style.margin = '0px';
      ul.style.paddingLeft = '1.5em';
    }
    for (const link of customStyleForLink) {
      link.style.color = 'blue';
    }
    for (const small of fontSizeSmall) {
      small.style.fontSize = '0.75em';
    }
    for (const large of fontSizeLarge) {
      large.style.fontSize = '1.5em';
    }

    for (const element of elementsWithClassNameTab1) {
      element.style.paddingLeft = '2em';
    }
    for (const element of elementsWithClassNameTab2) {
      element.style.paddingLeft = '3em';
    }
    for (const element of elementsWithClassNameTab3) {
      element.style.paddingLeft = '4em';
    }
    for (const element of elementsWithClassNameTab4) {
      element.style.paddingLeft = '5em';
    }
    for (const element of elementsWithClassNameTab5) {
      element.style.paddingLeft = '6em';
    }
    for (const element of elementsWithClassNameTab6) {
      element.style.paddingLeft = '7em';
    }
    for (const element of elementsWithClassNameTab7) {
      element.style.paddingLeft = '8em';
    }
    for (const element of elementsWithClassNameTab8) {
      element.style.paddingLeft = '9em';
    }

    const updatedHtmlString = dom.documentElement.innerHTML;
    return updatedHtmlString;
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
        {renderCloseButtonGadgetSize()}
        {
          !isEmptyArray(product.imageFiles) ? (
            <SwiperSlideImageCustom images={product.imageFiles}/>
          ) :(
            <img
            style={styles.imageSize}
            src={renderImageProduct()}
            alt={product.name}
            title={product.name}
          />
          )
        }



          <div style={styles.fullWidth}>
            <div
              style={{
                display: 'flex',
                marginTop: 15,
                marginBottom: 15,
              }}
            >
              <Typography style={styles.productName}>
                {variantName
                  ? `${removeLastCharFromStr()} ${variantName}`
                  : product.name}
              </Typography>
              <Typography style={styles.productPrice}>
                {handleCurrency(totalPrice)}
              </Typography>
            </div>
            {hasHTMLContent ? (
              <div
                ref={productDescriptionRef}
                dangerouslySetInnerHTML={{
                  __html:
                    handleHTMLStringCustomization(product.description) ||
                    handleHTMLStringCustomization(productDetail?.description),
                }}
              />
            ) : (
              <Typography
              paragraph
              noWrap
              gutterBottom={false}
              sx={{
                whiteSpace: 'pre-line',
                marginBottom: 0,
                fontWeight: 500,
                fontSize: '12px',
                color: props.color.font,
                display: '-webkit-box',
              }}
             >
             {product.description || productDetail?.description}
             </Typography>             
            )}
          </div>

          {renderCloseButton()}
        </div>
        <div>{renderVariants(productDetail?.variantOptions)}</div>
        <div>{renderProductModifiers(productDetail?.productModifiers)}</div>

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
              id='item-quantity-minus-button'
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
              id='item-quantity-plus-button'
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
  deliveryProviderSelected: {},
  deliveryAddress: {},
};

ProductAddModal.propTypes = {
  basket: PropTypes.object,
  color: PropTypes.object,
  companyInfo: PropTypes.object,
  defaultOutlet: PropTypes.object,
  deliveryAddress: PropTypes.object,
  deliveryProviderSelected: PropTypes.object,
  dispatch: PropTypes.func,
  handleClose: PropTypes.func,
  open: PropTypes.bool,
  product: PropTypes.object,
  selectedProduct: PropTypes.object,
  width: PropTypes.number,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductAddModal);
