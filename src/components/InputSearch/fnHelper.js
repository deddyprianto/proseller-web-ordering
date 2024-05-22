import { isEmptyArray } from "helpers/CheckEmpty";
import { filter, indexOf } from "lodash";
import { ProductAction } from "redux/actions/ProductAction";

const handleProductItemIds = (item) => {
  let items = [];
  if (item?.product) {
    if (!isEmptyArray(item?.product?.variants || [])) {
      item.product?.variants.forEach((variant) => {
        items.push(variant.id);
      });
    }
    items.push(item.product?.id);
  }
  return items;
};

const handleProductItemsInBasket = ({ basketDetails, item }) => {
  const productItemIds = handleProductItemIds(item);
  if (!isEmptyArray(productItemIds)) {
    const result = filter(
      basketDetails,
      (basketDetail) => indexOf(productItemIds, basketDetail.product.id) !== -1
    );
    return result;
  }
  return [];
};

const handleProductItemsInBasketGuestCo = ({ basketDetails, item }) => {
  const productItemIds = handleProductItemIds(item);
  if (!isEmptyArray(productItemIds)) {
    const result = filter(
      basketDetails,
      (basketDetail) => indexOf(productItemIds, basketDetail.product.id) !== -1
    );
    return result;
  }
  return [];
};

export const handleQuantityProduct = ({
  basket,
  item,
  mode,
  guestCheckoutCartBasket,
}) => {
  let totalQty = 0;
  if (mode === "GuestMode") {
    const productItemInBasketGuestCo = handleProductItemsInBasketGuestCo({
      basketDetails:
        guestCheckoutCartBasket?.response?.details?.length >= 1
          ? guestCheckoutCartBasket.response?.details
          : guestCheckoutCartBasket.data?.details,
      item,
    });

    productItemInBasketGuestCo.forEach((item) => {
      totalQty = totalQty + item.quantity;
    });
  } else {
    const productItemInBasket = handleProductItemsInBasket({
      basketDetails: basket.details,
      item,
    });

    productItemInBasket.forEach((item) => {
      totalQty = totalQty + item.quantity;
    });
  }

  return totalQty;
};
export const handleOpenUpdateModal = async ({
  item,
  setIsLoadingUpdate,
  defaultOutlet,
  setProductDetail,
  setIsOpenUpdateModal,
  isLoadingUpdate,
  dispatch,
}) => {
  const temp = [...isLoadingUpdate];
  temp[item.sequence] = true;
  setIsLoadingUpdate(temp);

  const productById = await dispatch(
    ProductAction.getProductById(
      { outlet: defaultOutlet?.id },
      item?.product?.id
    )
  );
  setProductDetail(productById);
  setIsOpenUpdateModal(true);
  temp[item.sequence] = false;
  setIsLoadingUpdate(temp);
};

export const handleCurrency = ({ price, companyInfo }) => {
  if (companyInfo?.companyInfo?.data) {
    const result = price?.toLocaleString(
      companyInfo?.companyInfo?.data?.currency?.locale,
      {
        style: "currency",
        currency: companyInfo?.companyInfo?.data?.currency?.code,
      }
    );
    return result;
  }
};

export const renderImageProduct = ({ item }) => {
  if (!isEmptyArray(item.imageFiles)) {
    return <img src={item.imageFiles[0]} alt="" />;
  } else {
    return (
      <div
        style={{
          backgroundColor: "#D9D9D9",
          borderRadius: "8px",
          width: "100%",
          height: "100px",
        }}
      />
    );
  }
};
