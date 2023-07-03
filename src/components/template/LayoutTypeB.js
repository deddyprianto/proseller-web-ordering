import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import config from 'config';

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import { ProductAction } from 'redux/actions/ProductAction';
import { OrderAction } from 'redux/actions/OrderAction';

import { CONSTANT } from 'helpers';
import Product from 'components/ProductList/components/Product';
import Loading from 'components/loading/Loading';
import useProductList from 'hooks/useProductList';

import { IconSearch, IconClose } from 'assets/iconsSvg/Icons';

import 'components/ProductList/components/style/style.css';
import LoadingSpinner from 'components/rewards/LoadingSpinner';
import { isEmpty } from 'helpers/utils';
import useWindowSize from 'hooks/useWindowSize';

const ProductList = () => {
  const styles = {
    typography: {
      marginTop: 10,
      fontSize: 14,
      lineHeight: '17px',
      fontWeight: 600,
    },
  };

  const { width } = useWindowSize();
  const dispatch = useDispatch();
  const color = useSelector((state) => state.theme.color);
  const defaultOutlet = useSelector((state) => state.outlet.defaultOutlet);
  const orderingMode = useSelector((state) => state.order.orderingMode);
  const orderingSetting = useSelector((state) => state.order.orderingSetting);
  const logo = useSelector((state) => state.getSpaceLogo);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [outlet, setOutlet] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [querySearch, setQuerySearch] = useState('');
  const [openSearch, setOpenSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchNotFound, setSearchNotFound] = useState(false);
  const { products, loading, error, hasMore } = useProductList({
    pageNumber,
    selectedCategory,
    outlet,
    categories,
  });

  const observer = useRef();

  const gadgetScreen = width < 980;

  const lastEl = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    if (selectedCategory.sequence >= 0) {
      setPageNumber(1);
    }
  }, [selectedCategory]);

  const handleFetchCategoryProduct = async (outlet) => {
    const orderingModeTemp = orderingMode | '';
    const categories = await dispatch(
      ProductAction.fetchCategoryProduct({
        outlet: outlet.outlet,
        orderingMode: orderingSetting?.ShowOrderingModeModalFirst
          ? orderingModeTemp
          : '',
      })
    );
    const results = categories?.data || [];
    return results;
  };

  useEffect(() => {
    setIsLoading(true);
    try {
      const loadData = async () => {
        dispatch(OrderAction.getCart());
        const categories = await handleFetchCategoryProduct({
          outlet: defaultOutlet,
        });

        setOutlet(defaultOutlet);
        setCategories(categories);
        setSelectedCategory(categories[0]);
      };
      loadData();
    } catch (e) {
      console.log(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      const loadData = async () => {
        setIsLoading(true);
        if (!isEmpty(selectedCategory)) {
          const products = await dispatch(
            ProductAction.fetchProduct(selectedCategory, outlet, 0, 10)
          );

          dispatch({
            type: CONSTANT.LIST_CATEGORY,
            data: products,
          });
        }
        setIsLoading(false);
      };
      loadData();
    } catch (e) {
      console.log(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const handleSearch = (query) => {
    setQuerySearch(query);

    const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchNotFound(!filteredProducts.length);
    setSearchResults(filteredProducts);
  };

  const renderTabHeader = () => {
    return (
      <div
        id='product-group-header-option'
        style={{
          backgroundColor: color.primary,
          display: 'flex',
          alignItems: 'center',
          overflowY: 'auto',
          width: '100%',
        }}
      >
        {!openSearch ? (
          categories.map((category, index) => {
            return (
              <div
                key={index}
                onClick={() => {
                  setSelectedCategory(index);
                }}
                style={{
                  backgroundColor:
                    selectedCategory === index
                      ? color.primary
                      : color.secondary,
                  color: selectedCategory === index ? '#FFFFFF' : '#343A4A',
                  fontSize: '14px',
                  padding: '16px',
                  fontWeight: 700,
                }}
              >
                <span
                  style={{
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {category.name}
                </span>
              </div>
            );
          })
        ) : (
          <input
            id='input-txt'
            onChange={(e) => handleSearch(e.target.value)}
            value={querySearch}
            style={{
              width: '100%',
              fontSize: 14,
              marginLeft: '16px',
              borderRadius: '100px',
              paddingLeft: '16px',
            }}
            type='text'
            autoFocus={true}
            placeholder='Search your product here...'
          />
        )}

        <div
          className='search-button-absolute'
          id='search-button-category'
          style={{
            width: 40,
            height: '100%',
            backgroundColor: color.secondary,
            textAlign: 'center',
          }}
        >
          {openSearch ? (
            <div
              onClick={() => {
                setOpenSearch(false);
                setQuerySearch('');
              }}
              style={{ display: 'flex', width: 'fit-content' }}
            >
              <IconClose />
            </div>
          ) : (
            <div
              onClick={() => {
                setOpenSearch(true);
              }}
              style={{ display: 'flex', width: 'fit-content' }}
            >
              <IconSearch />
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderProductList = () => {
    if (!isEmpty(products) && !searchNotFound) {
      const data = searchResults.length ? searchResults : products;
      const productList = data?.map((itemProd, index) => {
        if (products.length === index + 1) {
          return (
            <Grid ref={lastEl} key={index} item xs={12} sm={6} md={6}>
              <Product item={itemProd} />
            </Grid>
          );
        } else {
          return (
            <Grid key={index} item xs={12} sm={6} md={6}>
              <Product item={itemProd} />
            </Grid>
          );
        }
      });

      return (
        <React.Fragment>
          <Grid
            paddingTop={{ xs: 2, md: 6 }}
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            {productList}
          </Grid>

          {loading && <LoadingSpinner />}
          <div>{error && error}</div>
        </React.Fragment>
      );
    }

    if ((!isEmpty(categories) && !isLoading) || searchNotFound) {
      return (
        <div style={{ paddingTop: '50px' }}>
          <img src={config.url_emptyImage} alt='is empty' />
          <Typography style={styles.typography}>
            Oppss.. Item Not Found.
          </Typography>
        </div>
      );
    }
  };

  return (
    <div style={{ marginTop: !logo ? '4em' : '6em' }}>
      {renderTabHeader()}
      <div style={{ padding: gadgetScreen ? '0 3%' : '0 10%' }}>
        {isLoading ? <Loading loadingType='NestedList' /> : renderProductList()}
      </div>
    </div>
  );
};

export default ProductList;
