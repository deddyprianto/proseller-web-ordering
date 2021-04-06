import React, { Component } from "react";
import { connect } from "react-redux";
import Product from "./Product";
// import { OutletAction } from "../../redux/actions/OutletAction";
import { OrderAction } from "../../redux/actions/OrderAction";
import { ProductAction } from "../../redux/actions/ProductAction";
import ModalProduct from "./ModalProduct";
import LoaderCircle from "../loading/LoaderCircle";
import config from "../../config";
import UpdateProductModal from "./UpdateProductModal";
import RetailHeaderCategory from "./RetailHeaderCategory";

import { isEmptyObject, isEmptyArray } from "../../helpers/CheckEmpty";
import { CONSTANT } from "../../helpers";
import { getInitialProductValue } from "../../helpers/ProductHelper";
import InfiniteScroll from "react-infinite-scroll-component";

class Ordering extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedProduct: {},
      products: [],
      productsBackup: [],
      categories: [],
      defaultOutlet: {},
      selectedItem: {},
      update: false,
      processing: true,
      selectedCategory: 0,
      finished: false,
      loading: true,
      loadingSearching: false,
      offlineMessage: "",
      isEmenu: window.location.pathname.includes("emenu"),
      showUpdateModal: false,
      addNew: false,
      categoryLength: 0,
      indexLoaded: 0,
      isFetching: false,
    };
  }

  componentDidMount = async () => {
    const { isEmenu } = this.state;
    localStorage.removeItem(`${config.prefix}_dataBasket`);
    localStorage.removeItem(`${config.prefix}_scanTable`);
    localStorage.removeItem(`${config.prefix}_selectedVoucher`);
    localStorage.removeItem(`${config.prefix}_selectedPoint`);
    window.addEventListener(
      "scroll",
      isEmenu ? this.handleScrollEmenu : this.handleScrollWebOrdering
    );

    let defaultOutlet = this.props.defaultOutlet;
    if (defaultOutlet && defaultOutlet.id) {
      defaultOutlet = config.getValidation(defaultOutlet);
    }

    // await this.props.dispatch(OrderAction.getCart());
    await this.setState({ defaultOutlet });
    this.props.dispatch(ProductAction.fetchCategoryList({ skip: 0, take: 10 }));
    await this.fetchCategories(defaultOutlet);
  };

  componentDidUpdate = async (prevProps) => {
    if (prevProps.defaultOutlet.id !== this.props.defaultOutlet.id) {
      console.log("defaultOutlet Changed");
      this.setState({ processing: false });
      this.fetchCategories(this.props.defaultOutlet);
    }
  };

  getUrlParameters = (pageParamString = null) => {
    if (!pageParamString) pageParamString = window.location.href.split("?")[1];
    if (pageParamString) {
      var paramsArray = pageParamString.split("&");
      var paramsHash = {};

      for (var i = 0; i < paramsArray.length; i++) {
        var singleParam = paramsArray[i].split("=");
        paramsHash[singleParam[0]] = singleParam[1];
      }
      return paramsHash;
    }
  };

  componentWillUnmount() {
    this.setState({ processing: false });
    clearInterval(this.timeWhith);
    const { isEmenu } = this.state;
    window.removeEventListener(
      "scroll",
      isEmenu ? this.handleScrollEmenu() : this.handleScrollWebOrdering()
    );
  }

  handleScrollWebOrdering = (e) => {
    if (
      Math.ceil(window.innerHeight + document.documentElement.scrollTop) !==
        document.documentElement.offsetHeight ||
      this.state.isFetching
    ) {
      return;
    }
    this.setState({ isFetching: true });
    this.fetchMoreData();
    console.log(this.state.isFetching, "this.state.isFetching");
  };

  handleScrollEmenu = (e) => {
    var searchButton = document.getElementById("search-button-category");
    var headerOffset = document.getElementById("offset-header");
    try {
      if (headerOffset !== undefined && headerOffset.offsetTop !== null) {
        var sticky = headerOffset.offsetTop;
        if (window.pageYOffset > sticky) {
          searchButton.classList.remove("search-button-absolute");
          searchButton.classList.add("search-button-fixed");
        } else {
          searchButton.classList.remove("search-button-fixed");
          searchButton.classList.add("search-button-absolute");
        }
      }
    } catch (e) {}
  };

  fetchCategories = async (outlet) => {
    try {
      await this.setState({ loading: true });
      const categories = await this.props.dispatch(
        ProductAction.fetchCategoryProduct(outlet, { skip: 0, take: 1000 })
      );
      // await this.props.dispatch(OutletAction.fetchSingleOutlet(outlet));
      await this.setState({
        categories: categories.data,
        categoryLength: categories.dataLength,
        processing: true,
      });
      await this.getProductPreset(categories.data, outlet);
      await this.setState({ loading: false });
    } catch (error) {}
  };

  stopProcessing = async () => {
    await this.setState({ categories: [], products: [], processing: false });
  };

  getProductPreset = async (categories, outlet) => {
    await this.setState({ products: [] });
    let products = [];
    let i = 0;

    // const productListWithCategory = categories.map((category) => ({
    //   category,
    //   items: [],
    // }));
    const productListWithCategory = [
      {
        category: categories[0],
        items: [],
      },
    ];

    categories[0].isLoaded = true;
    this.setState({
      categories,
      indexLoaded: 0,
      products: productListWithCategory,
      productsBackup: productListWithCategory,
    });

    products = productListWithCategory;

    let data = {};
    do {
      data = {};
      data = await this.props.dispatch(
        ProductAction.fetchProduct(categories[i], outlet, 0, 100)
      );

      products[i] = {
        category: products[i].category,
        items: data.data,
      };

      await this.setState({
        products,
        productsBackup: products,
      });

      i++;
    } while (data.dataLength < 20);

    this.props.dispatch({
      type: CONSTANT.LIST_CATEGORY,
      data: this.state.products,
    });

    if (!this.state.processing) {
      this.setState({ products: [], productsBackup: [] });
    }

    this.setState({ finished: true });
  };

  selectProduct = async (productSelected, mode) => {
    const product = getInitialProductValue(productSelected, mode);
    this.setState({ selectedItem: product });
  };

  getLabelButton = (item) => {
    const { basket } = this.props;
    try {
      if (!isEmptyObject(basket)) {
        const find = basket.details.find(
          (data) => data.product.id === item.product.id
        );
        if (find !== undefined) return "Update";
        else return "Add";
      } else {
        return "Add";
      }
    } catch (e) {
      return "Add";
    }
  };

  getQuantityProduct = (item) => {
    const { basket } = this.props;
    try {
      if (!isEmptyObject(basket)) {
        const find = basket.details.find(
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

  searchProduct = async (query) => {
    try {
      const { productsBackup } = this.state;
      this.setState({ finished: true });
      if (query === "") {
        this.setState({
          loading: false,
          loadingSearching: false,
          products: productsBackup,
        });
        return;
      } else {
        this.setState({ loadingSearching: true });
      }

      let productsSearch = undefined;
      //  Client search
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

      await this.setState({ products: productsSearch });
      await this.setState({ loading: false, loadingSearching: false });
    } catch (e) {}
  };

  getCurrency = (price) => {
    if (this.props.companyInfo) {
      const { currency } = this.props.companyInfo;

      if (!price || price === "-") price = 0;
      let result = price.toLocaleString(currency.locale, {
        style: "currency",
        currency: currency.code,
      });
      return result;
    }
  };

  fetchMoreData = async () => {
    const { defaultOutlet, products } = this.state;
    let { categories, indexLoaded } = this.state;

    indexLoaded = categories.findIndex((item) => item.isLoaded === undefined);
    const category = categories[indexLoaded];

    if (!category) return;

    const find = await products.find(
      (item) => item.category.id === category.id
    );

    if (find !== undefined) return;

    categories[indexLoaded].isLoaded = true;
    await this.setState({ categories });

    let data = await this.props.dispatch(
      ProductAction.fetchProduct(category, defaultOutlet, 0, 100)
    );
    
    if (!data) return;

    await products.push({
      category: category,
      items: data.data,
    });

    await this.setState({
      products,
      productsBackup: products,
    });

    await this.setState({ indexLoaded: this.state.indexLoaded + 1 });
  };

  render() {
    let {
      categories,
      loading,
      finished,
      loadingSearching,
      offlineMessage,
      isEmenu,
      categoryLength,
    } = this.state;
    let products = [];
    const categoryRefs = categories.map(() => {
      const ref = React.createRef();
      return ref;
    });

    if (this.props.productsSearch) products = this.props.productsSearch;
    else products = this.state.products;

    if (offlineMessage !== "") {
      return (
        <div
          className="section-tabs container-product"
          data-toggle="modal"
          data-target="#modal-product"
        >
          <div
            className="full-width list-view columns-2 archive woocommerce-page html-change"
            style={{ marginTop: 100 }}
          >
            <div className="tab-content">
              =
              <img
                src={config.url_emptyImage}
                alt="is empty"
                style={{ marginTop: 30 }}
              />
              <div
                style={{
                  margin: 10,
                  padding: 10,
                  textAlign: "center",
                  fontSize: 16,
                  backgroundColor: "rgba(0,0,0, 0.5)",
                  borderRadius: 5,
                  color: "#FFF",
                }}
              >
                {offlineMessage}
              </div>
              <div
                className="profile-dashboard"
                style={{
                  margin: 10,
                  padding: 10,
                  textAlign: "center",
                  fontSize: 16,
                  borderRadius: 5,
                  color: "#FFF",
                  fontWeight: "bold",
                }}
              >
                Let's find another outlet.
              </div>
            </div>
          </div>
        </div>
      );
    }
    console.log(products.length, "productsproducts");
    // console.log(categoryLength, 'productsproducts')
    return (
      <div
        className="section-tabs container-product"
        data-toggle="modal"
        data-target="#modal-product"
      >
        {this.getLabelButton(this.state.selectedItem).toLowerCase() ===
          "update" &&
          this.state.showUpdateModal && (
            <UpdateProductModal
              color={this.props.theme.color.primary}
              product={this.state.selectedProduct}
              productInCart={
                this.props.basket &&
                this.props.basket.details.filter((item) => {
                  return item.productID === this.state.selectedItem.productID;
                })
              }
              onClose={() => this.setState({ showUpdateModal: false })}
              setAddNew={(addNew) => this.setState({ addNew })}
              setSelectedItem={(item) => this.setState({ selectedItem: item })}
              getCurrency={(price) => this.getCurrency(price)}
            ></UpdateProductModal>
          )}
        <ModalProduct
          addNew={this.state.addNew}
          selectedItem={this.state.selectedItem}
        />
        <br /> <br /> <br />
        <div id="offset-header" />
        <RetailHeaderCategory
          categoryRefs={categoryRefs}
          loadingSearching={(status) =>
            this.setState({ loadingSearching: status })
          }
          finished={finished}
          setLoading={(status) => this.setState({ loading: status })}
          searchProduct={(query) => this.searchProduct(query)}
          categories={this.props.categories || []}
          selectedCategory={this.state.selectedCategory}
          setSelectedCategory={(category) => {
            this.props.dispatch(ProductAction.setSelectedCategory(category));
            this.props.history.push(`category/${category.id}/products`);
          }}
        />
        <div
          className="full-width list-view columns-2 archive woocommerce-page html-change"
          style={{ marginTop: isEmenu ? 35 : 5 }}
        >
          <div className="tab-content">
            <div className="tab-pane active" id="h1-tab-products-2">
              <ul className="products">
              <InfiniteScroll
                dataLength={products.length}
                next={this.fetchMoreData}
                hasMore={categoryLength === products.length ? false : true}
                loader={
                  <p>has more</p>
                }
              >
                {products.map((cat, i) => (
                  <>
                    <h3
                      id={i}
                      className="title font-color-theme"
                      style={{
                        fontSize: 14,
                        marginLeft: 15,
                        marginBottom: 10,
                        paddingTop: 10,
                        fontWeight: "bold",
                      }}
                    >
                      {cat.category.name}
                    </h3>
                    {cat.items.map((item, j) => {
                      return (
                        item.product && (
                          <Product
                            labelButton={this.getLabelButton(item)}
                            quantity={this.getQuantityProduct(item)}
                            selectProduct={this.selectProduct}
                            productConfig={this.props.theme}
                            showUpdateModal={(item) =>
                              this.setState({
                                showUpdateModal: true,
                                selectedProduct: item,
                              })
                            }
                            key={j}
                            item={item}
                          />
                        )
                      );
                    })}
                  </>
                ))}
              </InfiniteScroll>

                {/* {!loadingSearching && !loading && products.length === 0 && (
                  <div>
                    <img
                      src={config.url_emptyImage}
                      alt="is empty"
                      style={{ marginTop: 30 }}
                    />
                    <h3 className="color text-center" style={{ fontSize: 16 }}>
                      Oppss.. Item Not Found.
                    </h3>
                  </div>
                )} */}
              </ul>
              {/* {loading && <LoaderCircle />} */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    defaultOutlet: state.outlet.defaultOutlet,
    products: state.product.products,
    basket: state.order.basket,
    theme: state.theme,
    productsSearch: state.order.productsSearch,
    companyInfo: state.masterdata.companyInfo.data,
    categories: state.product.categoryList,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Ordering);
