import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Shimmer from 'react-shimmer-effect';

import { ProductAction } from 'redux/actions/ProductAction';

import Product from 'components/ProductList/components/Product';
import SearchBox from 'components/ordering/SearchBox';
import UpdateProductModal from 'components/ordering/UpdateProductModal';
import ModalProduct from 'components/ordering/ModalProduct';

import { getFormattedPrice } from 'helpers/ProductHelper';
import useMobileSize from 'hooks/useMobileSize';
import { isEmpty } from 'helpers/utils';

const SHIMMER_ARRAY = [1, 2, 3];

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
  orderingMode,
  setting,
}) => {
  const mobileSize = useMobileSize();
  const { categoryId } = useParams();
  const [categoryNotFound, setCategoryNotFound] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [isAddNewExistingProduct, setIsAddNewExistingProduct] = useState(false);

  useEffect(() => {
    if (selectedCategory) {
      if (isEmpty(selectedOutlet)) {
        history.push('/outlets');
      } else {
        if (setting.ShowOrderingModeModalFirst) {
          fetchProducts(selectedCategory, selectedOutlet, 0, 100, orderingMode);
        } else {
          fetchProducts(selectedCategory, selectedOutlet, 0, 100);
        }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, selectedCategory, selectedOutlet]);

  return (
    <div
      className='col-full'
      style={{ marginTop: mobileSize ? '7rem' : '10rem', width: '100%' }}
    >
      <div id='primary' className='content-area' style={{ paddingBottom: 100 }}>
        <main id='main' className='site-main'>
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
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  margin: '1rem',
                }}
              >
                <Link to={'/menu'}>
                  <div>
                    <i className='fa fa-arrow-left' /> Back
                  </div>
                </Link>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {selectedCategory && selectedCategory.defaultImageURL && (
                    <img
                      src={selectedCategory.defaultImageURL}
                      alt={selectedCategory.name}
                      style={{
                        width: 'auto',
                        height: '2.2rem',
                      }}
                    ></img>
                  )}
                  <h5
                    style={{ margin: 0, marginLeft: '1rem' }}
                    className='customer-group-name'
                  >
                    {selectedCategory &&
                      (selectedCategory.name || selectedCategory.term)}
                  </h5>
                </div>
              </div>
              <div style={{ margin: '1rem', marginBottom: 20 }}>
                <SearchBox />
              </div>
              <div style={{ marginTop: '1rem' }}>
                {isLoading ? (
                  <div>
                    {SHIMMER_ARRAY.map((no) => (
                      <Shimmer key={no}>
                        <div
                          style={{
                            width: '100%',
                            height: 100,
                            alignSelf: 'center',
                            borderRadius: '8px',
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
                    className='full-width list-view columns-2 archive woocommerce-page html-change'
                    id='product-catalog'
                    style={{ paddingTop: 30 }}
                  >
                    <div className='tab-content'>
                      <div className='tab-pane active' id='h1-tab-products-2'>
                        <ul className='products'>
                          <div className='grid-products'>
                            {products?.map((product) => {
                              return (
                                <div style={{ padding: '5px 0' }}>
                                  <Product key={product.id} item={product} />
                                </div>
                              );
                            })}
                          </div>
                        </ul>
                        {!products?.length && (
                          <h4
                            style={{ textAlign: 'center' }}
                            className='customer-group-name'
                          >
                            Sorry, products not found :(
                          </h4>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  categories: state.product.categoryList,
  selectedCategory: state.product.selectedCategory,
  selectedOutlet: state.outlet.defaultOutlet,
  products: state.product.productCategory,
  isLoading: state.product.loadingProductCategory,
  error: state.product.error,
  basket: state.order.basket,
  theme: state.theme,
  companyInfo: state.masterdata.companyInfo.data,
  orderingMode: state.order.orderingMode,
  setting: state.order.orderingSetting,
});

const mapDispatchToProps = (dispatch) => {
  return {
    fetchProducts: (category, outlet, skip, take) => {
      let bodyPayload = {};
      if (category.isSearch === true) {
        bodyPayload = {
          skip,
          take,
          outletID: `outlet::${outlet.id}`,
          sortBy: 'name',
          sortDirection: 'asc',
          filters: [
            {
              id: 'search',
              value: category.term,
            },
          ],
        };
      } else {
        bodyPayload = {
          skip,
          take,
          outletID: `outlet::${outlet.id}`,
          categoryID: `category::${category.id}`,
          sortBy: 'name',
          sortDirection: 'asc',
        };
      }

      if (category.items === undefined) {
        dispatch(ProductAction.fetchProductList(bodyPayload));
      } else {
        dispatch(ProductAction.setProductList(category.items));
      }
    },
    fetchCategoryList: () => dispatch(ProductAction.fetchCategoryList()),
    setCategory: (category) =>
      dispatch(ProductAction.setSelectedCategory(category)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Products);
