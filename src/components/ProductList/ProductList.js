import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import config from 'config';

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

import { isEmptyObject, isEmptyArray } from 'helpers/CheckEmpty';

import { ProductAction } from 'redux/actions/ProductAction';
import { OrderAction } from 'redux/actions/OrderAction';

import { CONSTANT } from 'helpers';
import Product from './components/Product';
import Loading from 'components/loading/Loading';
import { useProductList } from 'hooks/useProductList';

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
    color: state.theme.color,
    defaultOutlet: state.outlet.defaultOutlet,
    products: state.product.products,
    orderingMode: state.order.orderingMode,
    orderingSetting: state.order.orderingSetting,
    promotion: state.promotion.banners,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

const ProductList = ({ ...props }) => {
  const [isMore, setIsMore] = useState(false);

  const useStyles = makeStyles(() => ({
    appBar: {
      background: '#03aacf',
    },
    tabMore: {
      color: props?.color?.primary,
      backgroundColor: '#D0D0D0',
    },
    tabLabel: {
      fontSize: 12,
      fontWeight: 'bold',
    },
    itemMoreHover: {
      '&:hover': {
        color: '#fff',
        backgroundColor: props?.color?.primary,
      },
    },
    itemMore: {
      width: '100%',
      height: '50px',
      borderColor: '#D0D0D0',
    },
  }));

  const styles = {
    tabList: {
      border: isMore ? 1 : 0,
      borderColor: '#D0D0D0',
      marginBottom: -5,
    },
    tabMore: {
      color: props?.color?.primary,
      backgroundColor: '#D0D0D0',
    },
    paper: {
      maxHeight: 500,
      overflow: 'auto',
      backgroundColor: '#D0D0D0',
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
    font-weight: 700;
    background-color: transparent;
    width: 100%;
    height: 58px;
    border-radius: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px;
    line-height: 16px;

    &:hover {
      background-color: ${props?.color?.primary
        ? props.color.primary
        : 'white'};
    }

    &.${buttonUnstyledClasses.active} {
      color: #fff;
      outline: none;
      background-color: ${props?.color?.primary
        ? props.color.primary
        : 'white'};
    }

    &.${tabUnstyledClasses.selected} {
      background-color: ${props?.color?.primary
        ? props.color.primary
        : 'white'};
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
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [products, setProducts] = useState([]);
  const [outlet, setOutlet] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [limitCategoryTabHeader, setLimitCategoryTabHeader] = useState(8);
  const { productsItem, isError, loading, setSize, size } = useProductList();

  const observer = useRef();
  const lastEl = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setSize((prev) => prev + 10);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading]
  );

  const handleFetchCategoryProduct = async (outlet) => {
    const orderingMode = props.orderingMode | '';
    const categories = await props.dispatch(
      ProductAction.fetchCategoryProduct({
        outlet: outlet.outlet,
        orderingMode: props.orderingSetting?.ShowOrderingModeModalFirst
          ? orderingMode
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
        props.dispatch(OrderAction.getCart());
        const categories = await handleFetchCategoryProduct({
          outlet: props.defaultOutlet,
        });

        setOutlet(props.defaultOutlet);
        setCategories(categories);
        setSelectedCategory(categories[0]);
      };
      loadData();
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    try {
      const loadData = async () => {
        setIsLoading(true);
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
  const isBannerSetToTrue = props.promotion.length === 0;

  const renderTabHeader = () => {
    const categoryTab = categories.slice(0, limitCategoryTabHeader);
    return (
      <TabsList sx={{ marginTop: isBannerSetToTrue && '103px' }}>
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
              <table>
                <tr>
                  <td
                    style={{
                      textAlign: 'center',
                      width: '100%',
                      display: '-webkit-box',
                      WebkitLineClamp: '2',
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      padding: 0,
                      margin: 0,
                    }}
                  >
                    {category.name}
                  </td>
                </tr>
              </table>
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
      <Box sx={styles.tabList}>
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
    if (!isEmptyArray(productsItem)) {
      const productList = productsItem?.map((product) => {
        return product.data.map((itemProd, index) => {
          if (product.data.length === index + 1) {
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
      });

      return (
        <React.Fragment>
          <Grid
            paddingTop={6}
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            {productList}
          </Grid>
          <div>
            <h1
              style={{
                fontSize: '15px',
                display: size === 10 ? 'none' : 'inline',
              }}
            >
              Loading...
            </h1>
          </div>
        </React.Fragment>
      );
    }

    if (!isEmptyArray(categories) && !isLoading) {
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
    <TabsUnstyled value={`${selectedCategory.name}`}>
      {renderTabHeader()}
      {renderTabList()}
      {isLoading ? <Loading loadingType='NestedList' /> : renderProductList()}
    </TabsUnstyled>
  );
};

ProductList.defaultProps = {
  color: {},
  dispatch: null,
  defaultOutlet: {},
  orderingMode: '',
  orderingSetting: {},
  promotion: [],
};

ProductList.propTypes = {
  color: PropTypes.object,
  defaultOutlet: PropTypes.object,
  dispatch: PropTypes.func,
  orderingMode: PropTypes.string,
  orderingSetting: PropTypes.object,
  promotion: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductList);
