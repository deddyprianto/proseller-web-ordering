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
import WebOrderingCategories from "./WebOrderingCategories";
import EMenuCategories from "./EMenuCategories";

import { isEmptyObject, isEmptyArray } from "../../helpers/CheckEmpty";
import { CONSTANT } from "../../helpers";
import { getInitialProductValue } from "../../helpers/ProductHelper";
// const encryptor = require("simple-encryptor")(process.env.REACT_APP_KEY_DATA);

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
      isEmenu: window.location.hostname.includes("emenu"),

      showUpdateModal: false,
      addNew: false,
    };
  }

  componentDidMount = async () => {
    const { isEmenu } = this.state;
    localStorage.removeItem(`${config.prefix}_dataBasket`);
    // localStorage.removeItem(`${config.prefix}_scanTable`);
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

    await this.props.dispatch(OrderAction.getCart());
    await this.setState({ defaultOutlet });
    if (
      this.props.orderingSetting &&
      this.props.orderingSetting.ShowOrderingModeModalFirst
    ) {
      await this.fetchCategories(defaultOutlet, this.props.orderingMode);
    } else {
      await this.fetchCategories(defaultOutlet);
    }
  };

  componentDidUpdate = async (prevProps) => {
    if (
      this.props.setting.length > 0 &&
      (prevProps.orderingMode !== this.props.orderingMode ||
        prevProps.defaultOutlet.id !== this.props.defaultOutlet.id ||
        prevProps.orderingModes !== this.props.orderingModes)
    ) {
      const showOrderingModeModalFirst = this.props.setting.find((setting) => {
        return setting.settingKey === "ShowOrderingModeModalFirst";
      });
      console.log("showOrderingModeModalFirst", showOrderingModeModalFirst);
      if (
        showOrderingModeModalFirst &&
        showOrderingModeModalFirst.settingValue === true &&
        !this.props.orderingMode
      ) {
        if (this.props.orderingModes.length === 1) {
          await this.props.dispatch({
            type: "SET_ORDERING_MODE",
            payload: this.props.orderingModes[0],
          });
        } else if (this.props.orderingModes.length > 1) {
          document.getElementById("open-modal-ordering-mode").click();
        }
      } else {
        let defaultOutlet = this.props.defaultOutlet;
        if (defaultOutlet && defaultOutlet.id) {
          defaultOutlet = config.getValidation(defaultOutlet);
        }
        this.setState({ processing: false });
        if (
          showOrderingModeModalFirst &&
          showOrderingModeModalFirst.settingValue === true
        ) {
          await this.fetchCategories(defaultOutlet, this.props.orderingMode);
        } else {
          await this.fetchCategories(defaultOutlet);
        }
      }
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
    this.setState({ processing: false, selectedItem: {} });
    clearInterval(this.timeWhith);
    const { isEmenu } = this.state;
    window.removeEventListener(
      "scroll",
      isEmenu ? this.handleScrollEmenu() : this.handleScrollWebOrdering()
    );
  }

  handleScrollWebOrdering = (e) => {
    var header = document.getElementById("header-categories");
    var headerCWO = document.getElementById("masthead");
    var headerOffset = document.getElementById("offset-header");
    try {
      if (headerOffset !== undefined && headerOffset.offsetTop !== null) {
        var sticky = headerOffset.offsetTop;
        if (window.pageYOffset > sticky) {
          header.classList.remove("relative-position");
          header.classList.add("sticky");
          // header.style.top = `${headerCWO.offsetHeight - 5}px`;
        } else {
          header.classList.remove("sticky");
          header.classList.add("relative-position");
          // header.style.top = 0;
        }
      }
    } catch (e) {}
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

  fetchCategories = async (outlet, orderingMode) => {
    try {
      await this.setState({ loading: true });
      const categories = await this.props.dispatch(
        ProductAction.fetchCategoryProduct(outlet, null, orderingMode)
      );
      // await this.props.dispatch(OutletAction.fetchSingleOutlet(outlet));
      await this.setState({ categories: categories.data, processing: true });
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

    const productListWithCategory =
      categories &&
      categories.map((category) => ({
        category,
        items: [],
      }));

    this.setState({
      products: productListWithCategory,
      productsBackup: productListWithCategory,
    });

    products = productListWithCategory;

    while (i < categories.length && this.state.processing) {
      let data = null;
      console.log(
        "this.props.orderingSetting",
        this.props.orderingSetting.ShowOrderingModeModalFirst
      );
      if (
        this.props.orderingSetting &&
        this.props.orderingSetting.ShowOrderingModeModalFirst
      ) {
        data = await this.props.dispatch(
          ProductAction.fetchProduct(
            categories[i],
            outlet,
            0,
            10,
            this.props.orderingMode
          )
        );
      } else {
        data = await this.props.dispatch(
          ProductAction.fetchProduct(categories[i], outlet, 0, 10)
        );
      }

      products[i] = {
        category: products[i].category,
        items: data.data,
      };

      await this.setState({
        products,
        productsBackup: products,
      });

      if (data.dataLength > 0) {
        let j = 10;
        while (j <= data.dataLength && this.state.processing) {
          let product = null;
          if (
            this.props.orderingSetting &&
            this.props.orderingSetting.ShowOrderingModeModalFirst
          ) {
            product = await this.props.dispatch(
              ProductAction.fetchProduct(
                categories[i],
                outlet,
                j,
                10,
                this.props.orderingMode
              )
            );
          } else {
            product = await this.props.dispatch(
              ProductAction.fetchProduct(categories[i], outlet, j, 10)
            );
          }
          products[i].items = [...products[i].items, ...product.data];
          await this.setState({ products, productsBackup: products });
          j += 10;
        }
      }
      i++;
    }

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

  render() {
    let {
      categories,
      loading,
      finished,
      loadingSearching,
      offlineMessage,
      isEmenu,
    } = this.state;
    let products = [];

    const categoryRefs =
      categories &&
      categories.map(() => {
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
        {isEmenu ? (
          <EMenuCategories
            categories={categories}
            selectedCategory={this.state.selectedCategory}
            setSelectedCategory={(category) =>
              this.setState({ selectedCategory: category })
            }
          ></EMenuCategories>
        ) : (
          <WebOrderingCategories
            categoryRefs={categoryRefs}
            loadingSearching={(status) =>
              this.setState({ loadingSearching: status })
            }
            finished={finished}
            setLoading={(status) => this.setState({ loading: status })}
            searchProduct={(query) => this.searchProduct(query)}
            categories={categories}
            selectedCategory={this.state.selectedCategory}
            setSelectedCategory={(category) =>
              this.setState({ selectedCategory: category })
            }
          ></WebOrderingCategories>
        )}
        <div
          className="full-width list-view columns-2 archive woocommerce-page html-change"
          style={{ marginTop: isEmenu ? 35 : 5 }}
        >
          <div className="tab-content">
            <div className="tab-pane active" id="h1-tab-products-2">
              <ul className="products">
                {!loadingSearching &&
                  products &&
                  products.map((cat, i) => (
                    <>
                      <h3
                        id={i}
                        ref={categoryRefs[i]}
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
                        const { salesPeriods, restricSalesPeriod } = item;
                        if (restricSalesPeriod) {
                          console.log("restrictingSales period");
                          const isEnabled = salesPeriods.find((period) => {
                            const timeArray = period.value.split("-");
                            const startTime = timeArray[0];
                            const endTime = timeArray[1];
                            const startHour = parseInt(startTime.split(":")[0]);
                            const startMinute = parseInt(
                              startTime.split(":")[1]
                            );
                            const endHour = parseInt(endTime.split(":")[0]);
                            const endMinute = parseInt(endTime.split(":")[1]);
                            const start = startHour * 60 + startMinute;
                            const end =
                              startHour > endHour
                                ? endHour * 60 + endMinute + 24 * 60
                                : endHour * 60 + endMinute;
                            const date = new Date();
                            const now =
                              date.getHours() * 60 + date.getMinutes();
                            return now <= end && now >= start;
                          });
                          if (!isEnabled) {
                            return null;
                          }
                        }
                        return (
                          item.product && (
                            <Product
                              labelButton={this.getLabelButton(item)}
                              quantity={this.getQuantityProduct(item)}
                              selectProduct={this.selectProduct}
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

                {!loadingSearching && !loading && products.length === 0 && (
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
                )}
              </ul>
              {/* {loading && <LoaderCircle />} */}
            </div>
          </div>
        </div>
        <span
          data-toggle="modal"
          data-target="#detail-product-modal"
          id="open-modal-product"
          style={{ color: "white" }}
        ></span>
        <span
          data-toggle="modal"
          data-target="#ordering-mode"
          id="open-modal-ordering-mode"
          style={{ color: "white" }}
        ></span>
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
    setting: state.order.setting,
    orderingMode: state.order.orderingMode,
    orderingSetting: state.order.orderingSetting,
    orderingModes: state.order.orderingModes,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Ordering);
