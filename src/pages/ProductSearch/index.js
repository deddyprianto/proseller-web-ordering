import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
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

import useQuery from "../../hooks/useQuery";

import useStyles from "./styles";

const SHIMMER_ARRAY = [1, 2, 3];
const IS_EMENU = window.location.pathname.includes("emenu");

export const ProductSearch = ({
  selectedOutlet,
  products,
  basket,
  theme,
  isLoading,
  error,
  searchProducts,
  history,
  companyInfo,
}) => {
  const classes = useStyles({ color: theme.color });

  const query = useQuery();
  const keyword = query.get("q");
  if (!keyword || keyword === "") {
    history.push("/");
  }

  const [selectedProduct, setSelectedProduct] = useState({});
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isAddNewExistingProduct, setIsAddNewExistingProduct] = useState(false);

  const selectProduct = (product, mode) => {
    const initialValue = getInitialProductValue(product, mode);
    setSelectedProduct(initialValue);
  };

  useEffect(() => {
    if (_.isEmpty(selectedOutlet)) {
      history.push("/outlets");
    } else {
      searchProducts(keyword, selectedOutlet, 0, 100);
    }
  }, [selectedOutlet, keyword]);

  useEffect(() => {
    if (products) {
      const categoryWithProduct = products.reduce((acc, product) => {
        const generatedId = product.product.categoryName.replaceAll(" ", "_");
        const products = !acc[generatedId]
          ? [product]
          : [...acc[generatedId].products, product];
        return {
          ...acc,
          [generatedId]: {
            name: product.product.categoryName,
            products,
          },
        };
      }, {});
      const categoryArray = Object.values(categoryWithProduct);
      setCategories(categoryArray);
    }
  }, [products]);

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
      <h4 style={{ margin: "2rem", marginTop: "10rem" }}>
        Search result for "{keyword}"
      </h4>
      {!isLoading && categories ? (
        !error ? (
          categories.length > 0 ? (
            categories.map((category) => (
              <div key={category.name}>
                <h3
                  className="title font-color-theme"
                  style={{
                    fontSize: 14,
                    marginLeft: 15,
                    marginBottom: 10,
                    paddingTop: 10,
                    fontWeight: "bold",
                  }}
                >
                  {category.name}
                </h3>
                <div>
                  <div
                    className="full-width list-view columns-2 archive woocommerce-page html-change"
                    style={{ marginTop: IS_EMENU ? 35 : 5 }}
                  >
                    <div className="tab-content">
                      <div className="tab-pane active" id="h1-tab-products-2">
                        <ul className="products">
                          {products &&
                            products.map((product) => {
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
                </div>
              </div>
            ))
          ) : (
            <div style={{ margin: "2rem" }}>
              <em>No result</em>
            </div>
          )
        ) : (
          <div>{error.message}</div>
        )
      ) : (
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
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
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
    searchProducts: (keyword, outlet, skip, take) =>
      dispatch(
        ProductAction.fetchProductList(
          {
            skip,
            take,
            outletID: `outlet::${outlet.id}`,
            filters: [
              {
                id: "search",
                value: keyword,
              },
            ],
          },
          { sortBy: "name", sortDirection: "asc" }
        )
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductSearch);
