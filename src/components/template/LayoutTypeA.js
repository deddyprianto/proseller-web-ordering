import React, { Suspense, useEffect, useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { OrderAction } from 'redux/actions/OrderAction';
import { ProductAction } from 'redux/actions/ProductAction';
import config from 'config';

import { CONSTANT } from 'helpers';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loading from 'components/loading/Loading';

const Product = React.lazy(() =>
  import('components/ProductList/components/Product')
);
const RetailHeaderCategory = React.lazy(() =>
  import('components/ordering/RetailHeaderCategory')
);
const SearchBox = React.lazy(() => import('components/ordering/SearchBox'));
const LoaderCircle = React.lazy(() => import('../loading/LoaderCircle'));

const Ordering = (props) => {
  const [tempDefaultOutlet, setTempDefaultOutlet] = useState({});
  const [processing, setProcessing] = useState(true);
  const [tempProducts, setTempProducts] = useState([]);
  const [productsBackup, setProductsBackup] = useState([]);
  const [tempCategories, setTempCategories] = useState([]);
  const [selectedCategory] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [offlineMessage] = useState('');
  const [categoryLength, setCategoryLength] = useState(0);
  const [indexLoaded, setIndexLoaded] = useState(0);
  const [isFetching, setIsFetching] = useState(false);

  const defaultOutlet = useSelector((state) => state.outlet.defaultOutlet);
  const categories = useSelector((state) => state.product.categoryList);
  const orderingMode = useSelector((state) => state.order.orderingMode);

  const dispatch = useDispatch();
  const history = useHistory();

  const isEmenu = window.location.hostname.includes('emenu');

  useEffect(() => {
    const fetchData = async () => {
      localStorage.removeItem(`${config.prefix}_dataBasket`);
      localStorage.removeItem(`${config.prefix}_selectedVoucher`);
      localStorage.removeItem(`${config.prefix}_selectedPoint`);

      let newDefaultOutlet = defaultOutlet;
      if (newDefaultOutlet && newDefaultOutlet.id) {
        newDefaultOutlet = config.getValidation(newDefaultOutlet);
      }

      await dispatch(OrderAction.getCart());
      setTempDefaultOutlet(newDefaultOutlet);
      dispatch(ProductAction.fetchCategoryList({ skip: 0, take: 8 }, null));
      fetchCategories(newDefaultOutlet);

      if (newDefaultOutlet.id !== tempDefaultOutlet?.id) {
        setProcessing(false);
        fetchCategories(newDefaultOutlet);
      }
    };

    fetchData();

    return () => {
      setProcessing(false);
      window.removeEventListener(
        'scroll',
        isEmenu ? handleScrollEmenu() : handleScrollWebOrdering()
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultOutlet]);

  const handleScrollWebOrdering = (e) => {
    if (
      Math.ceil(window.innerHeight + document.documentElement.scrollTop) !==
        document.documentElement.offsetHeight ||
      isFetching
    ) {
      return;
    }
    setIsFetching(true);
    fetchMoreData();
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
      const categories = await dispatch(
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
        data = await dispatch(
          ProductAction.fetchProduct(
            categories[i],
            outlet,
            0,
            100,
            orderingMode
          )
        );
      } else {
        data = await dispatch(
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

    dispatch({
      type: CONSTANT.LIST_CATEGORY,
      data: tempProducts,
    });

    if (!processing) {
      setTempProducts([]);
      setProductsBackup([]);
    }

    setFinished(true);
  };

  const searchProduct = async (query) => {
    try {
      setFinished(true);
      if (query === '') {
        setLoading(false);
        setTempProducts(productsBackup);
        return;
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
    } catch (e) {}
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
      data = await dispatch(
        ProductAction.fetchProduct(
          category,
          tempDefaultOutlet,
          0,
          100,
          orderingMode
        )
      );
    } else {
      data = await dispatch(
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
      fetchMoreData();
    }
  };

  const goToCategory = async (category) => {
    const isParent = await dispatch(
      ProductAction.isParentCategory(category.sortKey)
    );

    if (isParent === true) {
      history.push({
        pathname: `category/${category.id}`,
        state: category,
      });
    } else {
      dispatch(ProductAction.setSelectedCategory(category));
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
      style={{ padding: '0 3%' }}
    >
      <Suspense fallback={<p>....</p>}>
        <SearchBox />
        <RetailHeaderCategory
          categoryRefs={categoryRefs}
          finished={finished}
          setLoading={(status) => setLoading(status)}
          searchProduct={(query) => searchProduct(query)}
          categories={categories || []}
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
                        marginLeft: 15,
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
                          <Suspense
                            fallback={<Loading loadingType='NestedList' />}
                            key={j}
                          >
                            <div style={{ padding: '5px 15px' }}>
                              <Product item={item}></Product>
                            </div>
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

export default Ordering;
