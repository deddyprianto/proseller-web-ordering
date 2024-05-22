import ProductAddModal from "components/ProductList/components/ProductAddModal";
import useWindowSize from "hooks/useWindowSize";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { handleQuantityProduct } from "./fnHelper";
import ProductUpdateModal from "components/ProductList/components/ProductUpdateModal";
import ItemCard from "./ItemCard";

const MappingResult = ({ item }) => {
  const [totalQty, setTotalQty] = useState(0);

  const guestCheckoutCartBasket = useSelector(
    (state) => state.guestCheckoutCart
  );
  const mode = useSelector((state) => state.guestCheckoutCart.mode);
  const basket = useSelector((state) => state.order.basket);
  const responsive = useWindowSize();

  const [productDetail, setProductDetail] = useState({});
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState([]);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);

  const handleCloseAddModal = () => {
    setIsOpenAddModal(false);
  };

  const handleOpenAddModal = () => {
    setIsOpenAddModal(true);
  };

  const handleCloseUpdateModal = () => {
    setIsOpenUpdateModal(false);
  };

  useEffect(() => {
    const totalQtyProductInBasket = handleQuantityProduct({
      basket,
      guestCheckoutCartBasket,
      item,
      mode,
    });
    setTotalQty(totalQtyProductInBasket);
  }, [
    item,
    basket,
    guestCheckoutCartBasket.data?.details,
    guestCheckoutCartBasket.response?.details,
  ]);

  return (
    <React.Fragment>
      <ItemCard
        handleOpenAddModal={handleOpenAddModal}
        isLoadingUpdate={isLoadingUpdate}
        setIsLoadingUpdate={setIsLoadingUpdate}
        setIsOpenUpdateModal={setIsOpenUpdateModal}
        setProductDetail={setProductDetail}
        item={item}
        totalQty={totalQty}
      />

      {isOpenAddModal && (
        <ProductAddModal
          open={isOpenAddModal}
          width={responsive.width}
          handleClose={handleCloseAddModal}
          product={item.product}
          productDetail={item.product}
        />
      )}

      {isOpenUpdateModal && (
        <ProductUpdateModal
          open={isOpenUpdateModal}
          width={responsive.width}
          handleClose={handleCloseUpdateModal}
          product={item.product}
          productDetail={productDetail}
        />
      )}
    </React.Fragment>
  );
};

export default MappingResult;
