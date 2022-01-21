import React, { useState, useEffect, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import config from '../../../config';

import { styled } from '@mui/system';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Collapse from '@mui/material/Collapse';
import { makeStyles } from '@material-ui/core/styles';

import TabsUnstyled from '@mui/base/TabsUnstyled';
import TabsListUnstyled from '@mui/base/TabsListUnstyled';
import { buttonUnstyledClasses } from '@mui/base/ButtonUnstyled';
import TabUnstyled, { tabUnstyledClasses } from '@mui/base/TabUnstyled';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { isEmptyObject, isEmptyArray } from '../../../helpers/CheckEmpty';

import { ProductAction } from '../../../redux/actions/ProductAction';
import { OutletAction } from '../../../redux/actions/OutletAction';

import { CONSTANT } from '../../../helpers';
import Product from './components/Product';
import Loading from 'components/loading/Loading';

const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
};
const mapStateToProps = (state) => {
  return {
    defaultOutlet: state.outlet.defaultOutlet,
    products: state.product.products,
    basket: state.order.basket,
    theme: state.theme,
    productsSearch: state.order.productsSearch,
    companyInfo: state.masterdata.companyInfo.data,
    setting: state.order.setting,
    orderingMode: state.order.orderingMode,
    orderingSetting: state.order.orderingSetting,
    banners: state.promotion.banners,
  };
};
const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

const ProductList = ({ color, ...props }) => {
  const useStyles = makeStyles(() => ({
    appBar: {
      background: '#03aacf',
    },
    tabMore: {
      color: color,
      backgroundColor: '#D0D0D0',
    },
    tabLabel: {
      fontSize: 12,
      fontWeight: 'bold',
    },
    itemMoreHover: {
      '&:hover': {
        color: '#fff',
        backgroundColor: color,
      },
    },
    itemMore: {
      width: '100%',
      height: '50px',
      borderColor: '#D0D0D0',
    },
  }));
  const styles = {
    tabMore: {
      color: color,
      backgroundColor: '#D0D0D0',
    },
    paper: {
      maxHeight: 100,
      overflow: 'auto',
    },
    categoryName: {
      color: 'black',
      fontSize: '11px',
      fontWeight: 'bold',
    },
    typography: {
      marginTop: 10,
      fontSize: 14,
      lineHeight: '17px',
      fontWeight: 600,
    },
  };

  const Tab = styled(TabUnstyled)`
    font-family: Open Sans, sans-serif;
    color: black;
    cursor: pointer;
    font-size: 11px;
    font-weight: bold;
    background-color: transparent;
    width: 100%;
    height: 50px;
    border-radius: 0px;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      background-color: ${color ? color : 'white'};
    }

    &.${buttonUnstyledClasses.active} {
      color: #fff;
      outline: none;
      background-color: ${color ? color : 'white'};
    }

    &.${tabUnstyledClasses.selected} {
      background-color: #03aacf;
      color: #fff;
    }
  `;

  const TabsList = styled(TabsListUnstyled)`
    background-color: #d0d0d0;
    display: flex;
    align-items: center;
    justify-content: center;
    align-content: space-between;
  `;

  const classes = useStyles();
  const [width] = useWindowSize();
  const [isMore, setIsMore] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [limitCategoryTabHeader, setLimitCategoryTabHeader] = useState(8);

  const handleFetchDefaultOutlet = async () => {
    let defaultOutlet = await props.dispatch(OutletAction.fetchDefaultOutlet());
    if (defaultOutlet?.id) {
      defaultOutlet = config.getValidation(defaultOutlet);
    }
    return defaultOutlet;
  };

  const handleFetchCategoryProduct = async ({ outlet }) => {
    const categories = await props.dispatch(
      ProductAction.fetchCategoryProduct({
        outlet,
        orderingMode: props.orderingSetting?.ShowOrderingModeModalFirst
          ? props.orderingMode
          : '',
      })
    );
    const results = categories?.data || [];
    return results;
  };

  useEffect(() => {
    if (width < 600) {
      setLimitCategoryTabHeader(3);
    }
    if (width > 750) {
      setLimitCategoryTabHeader(5);
    }
    if (width >= 1000) {
      setLimitCategoryTabHeader(6);
    }
  }, [width]);

  useEffect(() => {
    setIsLoading(true);
    try {
      const loadData = async () => {
        const defaultOutlet = await handleFetchDefaultOutlet();
        const categories = await handleFetchCategoryProduct({
          outlet: defaultOutlet,
        });

        setCategories(categories);
        setSelectedCategory(categories[0]);

        setIsLoading(false);
      };
      loadData();
    } catch (e) {
      // console.log(e);
    }
  }, []);

  useEffect(() => {
    try {
      const loadData = async () => {
        setIsLoading(true);

        const defaultOutlet = await props.dispatch(
          OutletAction.fetchDefaultOutlet()
        );

        const outlet = config.getValidation(defaultOutlet);

        if (!isEmptyObject(selectedCategory)) {
          const products = await props.dispatch(
            ProductAction.fetchProduct(selectedCategory, outlet, 0, 200)
          );
          setProducts(products.data);

          props.dispatch({
            type: CONSTANT.LIST_CATEGORY,
            data: products,
          });
        }

        setIsLoading(false);
      };
      loadData();
    } catch (e) {
      // console.log(e);
    }
  }, [selectedCategory]);

  const handleChangeCategory = ({ category, index }) => {
    let categoryChanged = [];
    categoryChanged.push(...categories);
    categoryChanged.splice(index + limitCategoryTabHeader, 1);
    categoryChanged = [category, ...categoryChanged.slice(0)];
    setCategories(categoryChanged);
  };

  const renderTabMore = () => {
    if (isMore) {
      return (
        <Tab
          style={styles.tabMore}
          onClick={() => {
            setIsMore(false);
          }}
        >
          Less
          <KeyboardArrowUpIcon />
        </Tab>
      );
    }
    return (
      <Tab
        style={styles.tabMore}
        onClick={() => {
          setIsMore(true);
        }}
      >
        More
        <KeyboardArrowDownIcon />
      </Tab>
    );
  };

  const renderTabHeader = () => {
    const categoryTab = categories.slice(0, limitCategoryTabHeader);
    return (
      <TabsList>
        {categoryTab.map((category, index) => {
          return (
            <Tab
              key={index}
              value={category.name}
              onClick={() => {
                setSelectedCategory(category);
                setIsMore(false);
              }}
            >
              {category.name}
            </Tab>
          );
        })}
        {renderTabMore()}
      </TabsList>
    );
  };

  const renderTabList = () => {
    const categoryTabList = categories.slice(limitCategoryTabHeader);
    return (
      <Box sx={{ border: isMore ? 1 : 0, borderColor: '#D0D0D0' }}>
        <Collapse in={isMore}>
          <Paper style={styles.paper}>
            {categoryTabList.map((category, index) => {
              return (
                <div className={classes.itemMoreHover} key={index}>
                  <Button
                    className={classes.itemMore}
                    key={index}
                    onClick={() => {
                      handleChangeCategory({ category, index });
                      setSelectedCategory(category);
                      setIsMore(false);
                    }}
                  >
                    <Typography style={styles.categoryName}>
                      {category.name}
                    </Typography>
                  </Button>
                  <Divider />
                </div>
              );
            })}
          </Paper>
        </Collapse>
      </Box>
    );
  };

  const renderProductList = () => {
    if (!isEmptyArray(products)) {
      const productList = products.map((product, index) => {
        return (
          <Grid key={index} item xs={12} sm={6} md={6}>
            <Product item={product} />
          </Grid>
        );
      });
      return (
        <Grid
          paddingTop={6}
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        >
          {productList}
        </Grid>
      );
    }

    return (
      <div>
        <img src={config.url_emptyImage} alt='is empty' />
        <Typography style={styles.typography}>
          Oppss.. Item Not Found.
        </Typography>
      </div>
    );
  };

  return (
    <TabsUnstyled value={`${selectedCategory.name}`}>
      {renderTabHeader()}
      {renderTabList()}
      {/* <Loading isLoading content={renderProductList()} /> */}
      {isLoading ? <Loading loadingType='NestedList' /> : renderProductList()}
    </TabsUnstyled>
  );
};

ProductList.defaultProps = {
  color: '',
  dispatch: null,
  orderingMode: '',
  orderingSetting: {},
};

ProductList.propTypes = {
  color: PropTypes.string,
  dispatch: PropTypes.func,
  orderingMode: PropTypes.string,
  orderingSetting: PropTypes.objectOf(
    PropTypes.shape({ ShowOrderingModeModalFirst: PropTypes.string })
  ),
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductList);
