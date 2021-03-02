import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import _ from "lodash";

import Shimmer from "react-shimmer-effect";

import { ProductAction } from "../../redux/actions/ProductAction";

import Product from "../../components/ordering/Product";
import UpdateProductModal from "../../components/ordering/UpdateProductModal";
import ModalProduct from "../../components/ordering/ModalProduct";

import {
  getInitialProductValue,
  getFormattedPrice,
} from "../../helpers/ProductHelper";
import useFilter from "../../hooks/useFilter";

import useStyles from "./styles";

const SHIMMER_ARRAY = [1, 2, 3];
const IS_EMENU = window.location.pathname.includes("emenu");

export const Products = ({
  categories,
  selectedCategory,
  selectedOutlet,
  products,
  basket,
  theme,
  isLoading,
  error,
  fetchProducts,
  fetchCategoryList,
  setCategory,
  history,
  companyInfo,
}) => {
  const classes = useStyles({ color: theme.color });

  const { categoryId } = useParams();
  const [categoryNotFound, setCategoryNotFound] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [productIsExistInBasket, setProductIsExistInBasket] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [isAddNewExistingProduct, setIsAddNewExistingProduct] = useState(false);
  const [filteredProducts, handleFilterKeywordChange] = useFilter(products);

  const selectProduct = (product, mode) => {
    const initialValue = getInitialProductValue(product, mode);
    setSelectedProduct(initialValue);
  };

  useEffect(() => {
    if (selectedCategory) {
      if (_.isEmpty(selectedOutlet)) {
        history.push("/outlets");
      } else {
        fetchProducts(selectedCategory, selectedOutlet, 0, 100);
      }
    } else {
      if (!categories || categories.length < 0) {
        fetchCategoryList();
      } else {
        const currentCategory = categories.find(
          (category) => category.id === categoryId
        );
        if (currentCategory) {
          setCategory(currentCategory);
        } else {
          setCategoryNotFound(true);
        }
      }
    }
  }, [categories, selectedCategory, selectedOutlet]);

  return (
    <div className={classes.container}>
      {showUpdateModal && (
        <UpdateProductModal
          color={theme.color.primary}
          product={selectedProduct}
          productInCart={
            basket &&
            basket.details.filter((item) => {
              return item.productID === selectedProduct.productID;
            })
          }
          onClose={() => setShowUpdateModal(false)}
          setAddNew={(addNew) => setIsAddNewExistingProduct(addNew)}
          setSelectedItem={(item) => setSelectedProduct(item)}
          getCurrency={(price) =>
            companyInfo &&
            companyInfo.currency &&
            getFormattedPrice(price, companyInfo.currency)
          }
        ></UpdateProductModal>
      )}
      <ModalProduct
        addNew={isAddNewExistingProduct}
        selectedItem={selectedProduct}
      />
      {categoryNotFound ? (
        <div>Category not found</div>
      ) : (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              margin: "1rem",
            }}
          >
            {selectedCategory && selectedCategory.defaultImageURL && (
              <img
                src={selectedCategory.defaultImageURL}
                alt={selectedCategory.name}
                style={{
                  width: "auto",
                  height: "2.5rem",
                }}
              ></img>
            )}
            <h4 style={{ margin: 0, marginLeft: "1rem" }}>
              {selectedCategory && selectedCategory.name}
            </h4>
          </div>
          <div style={{ margin: "1rem" }}>
            <input
              onChange={handleFilterKeywordChange}
              className={`form-control ${classes.searchBox}`}
              placeholder="Search"
              style={{ fontSize: "1.5rem" }}
            ></input>
          </div>
          <div>
            {isLoading ? (
              <div>
                {SHIMMER_ARRAY.map((no) => (
                  <Shimmer key={no}>
                    <div
                      style={{
                        width: "100%",
                        height: 100,
                        alignSelf: "center",
                        borderRadius: "8px",
                        marginBottom: 10,
                      }}
                    />
                  </Shimmer>
                ))}
              </div>
            ) : error ? (
              <div>{error.message}</div>
            ) : (
              <div
                className="full-width list-view columns-2 archive woocommerce-page html-change"
                style={{ marginTop: IS_EMENU ? 35 : 5 }}
              >
                <div className="tab-content">
                  <div className="tab-pane active" id="h1-tab-products-2">
                    <ul className="products">
                      {filteredProducts &&
                        filteredProducts.map((product) => {
                          const productInBasket =
                            basket &&
                            basket.details &&
                            basket.details.find(
                              (item) => item.product.id === product.id
                            );
                          const label = productInBasket ? "Update" : "Add";
                          const quantity =
                            productInBasket && productInBasket.quantity
                              ? productInBasket.quantity
                              : 0;
                          return (
                            <Product
                              labelButton={label}
                              quantity={quantity}
                              selectProduct={selectProduct}
                              productConfig={theme}
                              showUpdateModal={(item) => {
                                setSelectedProduct(item);
                                setProductIsExistInBasket(label === "Update");
                                setShowUpdateModal(true);
                              }}
                              key={product.id}
                              item={product}
                            />
                          );
                        })}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  categories: state.product.categoryList,
  selectedCategory: state.product.selectedCategory,
  selectedOutlet: state.outlet.defaultOutlet,
  products: state.product.productList,
  isLoading: state.product.loading,
  error: state.product.error,
  basket: state.order.basket,
  theme: state.theme,
  companyInfo: state.masterdata.companyInfo.data,
});

const mapDispatchToProps = (dispatch) => {
  return {
    fetchProducts: (category, outlet, skip, take) =>
      dispatch(
        ProductAction.fetchProductList(
          {
            skip,
            take,
            outletID: `outlet::${outlet.id}`,
            categoryID: `category::${category.id}`,
          },
          { sortBy: "name", sortDirection: "asc" }
        )
      ),
    fetchCategoryList: () => dispatch(ProductAction.fetchCategoryList()),
    setCategory: (category) =>
      dispatch(ProductAction.setSelectedCategory(category)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Products);
