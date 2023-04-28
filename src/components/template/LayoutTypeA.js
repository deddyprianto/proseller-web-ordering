import React, { Suspense, useEffect, useState, Fragment } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { OrderAction } from 'redux/actions/OrderAction';
import { ProductAction } from 'redux/actions/ProductAction';
import config from 'config';

import { isEmptyObject } from 'helpers/CheckEmpty';
import { CONSTANT } from 'helpers';
import { getInitialProductValue } from 'helpers/ProductHelper';
import InfiniteScroll from 'react-infinite-scroll-component';
import ModalProduct from 'components/ordering/ModalProduct';
import UpdateProductModal from 'components/ordering/UpdateProductModal';

const Product = React.lazy(() => import('components/ordering/Product'));
const RetailHeaderCategory = React.lazy(() =>
  import('components/ordering/RetailHeaderCategory')
);
const SearchBox = React.lazy(() => import('components/ordering/SearchBox'));
const LoaderCircle = React.lazy(() => import('../loading/LoaderCircle'));

const mapStateToProps = (state) => {
  return {
    defaultOutlet: state.outlet.defaultOutlet,
    products: state.product.products,
    basket: state.order.basket,
    theme: state.theme,
    companyInfo: state.masterdata.companyInfo.data,
    categories: state.product.categoryList,
    setting: state.order.orderingSetting,
    orderingMode: state.order.orderingMode,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

const Ordering = (props) => {
  const [tempDefaultOutlet, setTempDefaultOutlet] = useState({});
  const [processing, setProcessing] = useState(true);
  const [tempProducts, setTempProducts] = useState([]);
  const [productsBackup, setProductsBackup] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [tempCategories, setTempCategories] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingSearching, setLoadingSearching] = useState(false);
  const [offlineMessage, setOfflineMessage] = useState('');
  const [isEmenu, setIsMenu] = useState(
    window.location.hostname.includes('emenu')
  );
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [addNew, setAddNew] = useState(false);
  const [categoryLength, setCategoryLength] = useState(0);
  const [indexLoaded, setIndexLoaded] = useState(0);
  const [isFetching, setIsFetching] = useState(false);

  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      localStorage.removeItem(`${config.prefix}_dataBasket`);
      localStorage.removeItem(`${config.prefix}_selectedVoucher`);
      localStorage.removeItem(`${config.prefix}_selectedPoint`);

      let newDefaultOutlet = props.defaultOutlet;
      if (newDefaultOutlet && newDefaultOutlet.id) {
        newDefaultOutlet = config.getValidation(newDefaultOutlet);
      }

      await props.dispatch(OrderAction.getCart());
      setTempDefaultOutlet(newDefaultOutlet);
      props.dispatch(
        ProductAction.fetchCategoryList({ skip: 0, take: 8 }, null)
      );
      fetchCategories(newDefaultOutlet);

      if (newDefaultOutlet.id !== tempDefaultOutlet?.id) {
        setProcessing(false);
        fetchCategories(newDefaultOutlet);
      }
    };

    fetchData();

    return () => {
      setProcessing(false);
      const { isEmenu } = props;
      window.removeEventListener(
        'scroll',
        isEmenu ? handleScrollEmenu() : handleScrollWebOrdering()
      );
    };
  }, [props.defaultOutlet]);

  const handleScrollWebOrdering = (e) => {
    if (
      Math.ceil(window.innerHeight + document.documentElement.scrollTop) !==
        document.documentElement.offsetHeight ||
      isFetching
    ) {
      return;
    }
    setIsFetching(true);
    this.fetchMoreData();
  };

  const handleScrollEmenu = (e) => {
    var searchButton = document.getElementById('search-button-category');
    var headerOffset = document.getElementById('offset-header');
    try {
      if (headerOffset !== undefined && headerOffset.offsetTop !== null) {
        var sticky = headerOffset.offsetTop;
        if (window.pageYOffset > sticky) {
          searchButton.classList.remove('search-button-absolute');
          searchButton.classList.add('search-button-fixed');
        } else {
          searchButton.classList.remove('search-button-fixed');
          searchButton.classList.add('search-button-absolute');
        }
      }
    } catch (e) {}
  };

  const fetchCategories = async (outlet) => {
    try {
      setLoading(true);
      const categories = await props.dispatch(
        ProductAction.fetchCategoryProduct({
          outlet: outlet,
          payload: { skip: 0, take: 50 },
        })
      );

      setTempCategories(categories.data);
      setCategoryLength(categories.data.length);
      setProcessing(true);
      setLoading(false);
      await getProductPreset(categories.data, outlet);
    } catch (error) {}
  };

  const getProductPreset = async (categories, outlet) => {
    setTempProducts([]);
    let temp = [];
    let i = 0;

    const productListWithCategory = [
      {
        category: categories[0],
        items: [],
      },
    ];

    categories[0].isLoaded = true;
    setTempCategories(categories);
    setIndexLoaded(0);
    setTempProducts(productListWithCategory);
    setProductsBackup(productListWithCategory);

    temp = productListWithCategory;

    let data = {};
    do {
      data = {};
      if (
        props.orderingSetting &&
        props.orderingSetting.ShowOrderingModeModalFirst
      ) {
        data = await props.dispatch(
          ProductAction.fetchProduct(
            categories[i],
            outlet,
            0,
            100,
            props.orderingMode
          )
        );
      } else {
        data = await props.dispatch(
          ProductAction.fetchProduct(categories[i], outlet, 0, 100)
        );
      }

      temp[i] = {
        category: temp[i].category,
        items: data.data,
      };

      setTempProducts(temp);
      setProductsBackup(temp);
      i++;
    } while (data.dataLength < 20);

    props.dispatch({
      type: CONSTANT.LIST_CATEGORY,
      data: tempProducts,
    });

    if (!processing) {
      setTempProducts([]);
      setProductsBackup([]);
    }

    setFinished(true);
  };

  const selectProduct = async (productSelected, mode) => {
    const product = getInitialProductValue(productSelected, mode);
    setSelectedItem(product);
  };

  const getLabelButton = (item) => {
    try {
      if (!isEmptyObject(props.basket)) {
        const find = props.basket.details.find(
          (data) => data.product.id === item.product.id
        );
        if (find !== undefined) return 'Update';
        else return 'Add';
      } else {
        return 'Add';
      }
    } catch (e) {
      return 'Add';
    }
  };

  const getQuantityProduct = (item) => {
    try {
      if (!isEmptyObject(props.basket)) {
        const find = props.basket.details.find(
          (data) => data.product.id === item.product.id
        );
        if (find !== undefined) return `${find.quantity}x`;
        else return false;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  };

  const searchProduct = async (query) => {
    try {
      setFinished(true);
      if (query === '') {
        setLoading(false);
        setLoadingSearching(false);
        setTempProducts(productsBackup);
        return;
      } else {
        setLoadingSearching(true);
      }

      let productsSearch = undefined;

      for (let i = 0; i < productsBackup.length; i++) {
        let items = [];

        try {
          for (let j = 0; j < productsBackup[i].items.length; j++) {
            if (
              productsBackup[i].items[j].product.name
                .toLowerCase()
                .includes(query.toLowerCase())
            ) {
              items.push(productsBackup[i].items[j]);
            }
          }
        } catch (e) {}

        if (items.length !== 0) {
          if (productsSearch === undefined) {
            productsSearch = [];
          }

          let data = JSON.stringify(productsBackup[i]);
          data = JSON.parse(data);
          data.items = items;
          productsSearch.push(data);
        }
      }

      if (productsSearch === undefined) productsSearch = [];

      setTempProducts(productsSearch);
      setLoading(false);
      setLoadingSearching(false);
    } catch (e) {}
  };

  const getCurrency = (price) => {
    if (props.companyInfo) {
      const { currency } = props.companyInfo;

      if (!price || price === '-') price = 0;
      let result = price.toLocaleString(currency.locale, {
        style: 'currency',
        currency: currency.code,
      });
      return result;
    }
  };

  const fetchMoreData = async () => {
    const tempIndexLoaded = tempCategories.findIndex(
      (item) => item.isLoaded === undefined
    );
    const category = tempCategories[tempIndexLoaded];

    if (!category) return;

    const find = await tempProducts.find(
      (item) => item.category.id === category.id
    );

    if (find !== undefined) return;

    tempCategories[tempIndexLoaded].isLoaded = true;
    setTempCategories(tempCategories);

    let data = null;
    if (
      props.orderingSetting &&
      props.orderingSetting.ShowOrderingModeModalFirst
    ) {
      data = await props.dispatch(
        ProductAction.fetchProduct(
          category,
          tempDefaultOutlet,
          0,
          100,
          props.orderingMode
        )
      );
    } else {
      data = await props.dispatch(
        ProductAction.fetchProduct(category, tempDefaultOutlet, 0, 100)
      );
    }

    if (!data) return;

    await tempProducts.push({
      category: category,
      items: data.data,
    });

    setTempProducts(tempProducts);
    setProductsBackup(tempProducts);
    setIndexLoaded(indexLoaded + 1);

    if (data.data.length === 0) {
      this.fetchMoreData();
    }
  };

  const goToCategory = async (category) => {
    const isParent = await props.dispatch(
      ProductAction.isParentCategory(category.sortKey)
    );

    if (isParent === true) {
      history.push({
        pathname: `category/${category.id}`,
        state: category,
      });
    } else {
      props.dispatch(ProductAction.setSelectedCategory(category));
      history.push(`category/${category.id}/products`);
    }
  };

  const categoryRefs = tempCategories.map(() => {
    const ref = React.createRef();
    return ref;
  });

  if (offlineMessage !== '') {
    return (
      <div
        className='section-tabs container-product'
        data-toggle='modal'
        data-target='#modal-product'
      >
        <div
          className='full-width list-view archive woocommerce-page html-change'
          style={{ marginTop: 80 }}
        >
          <div className='tab-content'>
            =
            <img
              src={config.url_emptyImage}
              alt='is empty'
              style={{ marginTop: 30 }}
            />
            <div
              style={{
                margin: 10,
                padding: 10,
                textAlign: 'center',
                fontSize: 16,
                backgroundColor: 'rgba(0,0,0, 0.5)',
                borderRadius: 5,
                color: '#FFF',
              }}
            >
              {offlineMessage}
            </div>
            <div
              className='profile-dashboard'
              style={{
                margin: 10,
                padding: 10,
                textAlign: 'center',
                fontSize: 16,
                borderRadius: 5,
                color: '#FFF',
                fontWeight: 'bold',
              }}
            >
              Let's find another outlet.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className='section-tabs container-product'
      data-toggle='modal'
      data-target='#modal-product'
    >
      {getLabelButton(selectedItem).toLowerCase() === 'update' &&
        showUpdateModal && (
          <UpdateProductModal
            color={props.theme.color.primary}
            product={selectedProduct}
            productInCart={
              props.basket &&
              props.basket.details.filter((item) => {
                return item.productID === selectedItem.productID;
              })
            }
            onClose={() => setShowUpdateModal(false)}
            setAddNew={(addNew) => setAddNew(addNew)}
            setSelectedItem={(item) => selectedItem(item)}
            getCurrency={(price) => getCurrency(price)}
          ></UpdateProductModal>
        )}
      <ModalProduct addNew={addNew} selectedItem={selectedItem} />
      <Suspense fallback={<p>....</p>}>
        <SearchBox />
        <RetailHeaderCategory
          categoryRefs={categoryRefs}
          loadingSearching={(status) => setLoadingSearching(status)}
          finished={finished}
          setLoading={(status) => setLoading(status)}
          searchProduct={(query) => searchProduct(query)}
          categories={props.categories || []}
          selectedCategory={selectedCategory}
          setSelectedCategory={(category) => goToCategory(category)}
        />
      </Suspense>
      <div
        className='full-width list-view columns-2 archive woocommerce-page html-change'
        style={{ marginTop: isEmenu ? 35 : 5 }}
      >
        <div className='tab-content'>
          <div className='tab-pane active' id='h1-tab-products-2'>
            <ul className='products'>
              <InfiniteScroll
                dataLength={tempProducts.length}
                next={fetchMoreData}
                hasMore={categoryLength === tempProducts.length ? false : true}
                loader={
                  <p className='font-color-theme text-center'>
                    Fetching more products...
                  </p>
                }
              >
                {tempProducts.map((cat, i) => (
                  <Fragment key={i}>
                    <h3
                      id={i}
                      className='title font-color-theme'
                      style={{
                        fontSize: 20,
                        marginLeft: 6,
                        marginBottom: 20,
                        paddingTop: 10,
                        fontWeight: 'bold',
                      }}
                    >
                      {cat.category.name}
                    </h3>
                    <div className='grid-products'>
                      {cat.items.map((item, j) => {
                        return (
                          <Suspense fallback={<p>...</p>} key={j}>
                            <Product
                              labelButton={getLabelButton(item)}
                              quantity={getQuantityProduct(item)}
                              history={props.history}
                              selectProduct={selectProduct}
                              productConfig={props.theme}
                              showUpdateModal={(item) => {
                                setShowUpdateModal(true);
                                setSelectedProduct(item);
                              }}
                              key={j}
                              item={item}
                            />
                          </Suspense>
                        );
                      })}
                    </div>
                  </Fragment>
                ))}
              </InfiniteScroll>
            </ul>
            {loading && (
              <Suspense fallback={<p>Loading...</p>}>
                <LoaderCircle />
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Ordering);
