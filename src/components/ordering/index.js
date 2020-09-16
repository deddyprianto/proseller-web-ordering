import React, { Component } from "react";
import { connect } from "react-redux";
import CategoriesEmenu from "./CategoriesEmenu";
import CategoriesWebOrdering from "./CategoriesWebOrdering";
import Product from "./Product";
import { OutletAction } from "../../redux/actions/OutletAction";
import { OrderAction } from "../../redux/actions/OrderAction";
import { ProductAction } from "../../redux/actions/ProductAction";
import ModalProduct from "./ModalProduct";
import { isEmptyObject, isEmptyArray } from "../../helpers/CheckEmpty";
import LoadingFixed from "../loading/LoadingFixed";
import LoaderCircle from "../loading/LoaderCircle";
import Lottie from "lottie-react-web";
import emptyGif from "../../assets/gif/empty-and-lost.json";
import config from "../../config";
import UpdateProductModal from "./UpdateProductModal";
const encryptor = require("simple-encryptor")(process.env.REACT_APP_KEY_DATA);

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

    let defaultOutlet = null
    if (!this.getUrlParameters()) {
      defaultOutlet = await this.props.dispatch(OutletAction.fetchDefaultOutlet());
    } else {
      defaultOutlet = await encryptor.decrypt(JSON.parse(localStorage.getItem(`${config.prefix}_defaultOutlet`)));
    }

    await this.props.dispatch(OrderAction.getCart());
    await this.setState({ defaultOutlet: defaultOutlet || this.props.defaultOutlet });
    await this.fetchCategories(defaultOutlet || this.props.defaultOutlet);
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
      if (headerOffset != undefined && headerOffset.offsetTop != null) {
        var sticky = headerOffset.offsetTop;
        if (window.pageYOffset > sticky) {
          header.classList.remove("relative-position");
          header.classList.add("sticky");
          header.style.top = `${headerCWO.offsetHeight - 5}px`;
        } else {
          header.classList.remove("sticky");
          header.classList.add("relative-position");
          header.style.top = 0;
        }
      }
    } catch (e) { }
  };

  handleScrollEmenu = (e) => {
    var searchButton = document.getElementById("search-button-category");
    var headerOffset = document.getElementById("offset-header");
    try {
      if (headerOffset != undefined && headerOffset.offsetTop != null) {
        var sticky = headerOffset.offsetTop;
        if (window.pageYOffset > sticky) {
          searchButton.classList.remove("search-button-absolute");
          searchButton.classList.add("search-button-fixed");
        } else {
          searchButton.classList.remove("search-button-fixed");
          searchButton.classList.add("search-button-absolute");
        }
      }
    } catch (e) { }
  };

  fetchCategories = async (outlet) => {
    try {
      await this.setState({ loading: true });
      const categories = await this.props.dispatch(ProductAction.fetchCategoryProduct(outlet));
      await this.props.dispatch(OutletAction.fetchSingleOutlet(outlet));
      await this.setState({ categories, processing: true });
      await this.getProductPreset(categories, outlet);
      await this.setState({ loading: false });
    } catch (error) { }
  };

  componentWillUnmount() {
    clearInterval(this.timeWhith);
  }

  stopProcessing = async () => {
    await this.setState({ categories: [], products: [], processing: false });
  };

  getProductPreset = async (categories, outlet) => {
    await this.setState({ products: [] });

    let products = [];
    let i = 0;

    while (i < categories.length && this.state.processing) {
      let data = await this.props.dispatch(
        ProductAction.fetchProduct(categories[i], outlet, 0, 5)
      );
      let items = {
        category: categories[i],
        items: data.data,
      };

      products.push(items);
      await this.setState({ products, productsBackup: products });

      if (data.dataLength > 0) {
        let j = 5;
        while (j <= data.dataLength && this.state.processing) {
          let product = await this.props.dispatch(
            ProductAction.fetchProduct(categories[i], outlet, j, 5)
          );
          products[i].items = [...products[i].items, ...product.data];
          await this.setState({ products, productsBackup: products });
          j += 5;
        }
      }
      i++;
    }

    if (!this.state.processing) {
      await this.setState({ products: [], productsBackup: [], categories: [] });
    }

    await this.setState({ finished: true });

    return;
  };

  selectProduct = async (productSelected, mode) => {
    const { basket } = this.props;

    let product = JSON.stringify(productSelected);
    product = JSON.parse(product);

    try {
      await product.product.productModifiers.map((group, i) => {
        if (!isEmptyArray(group.modifier.details))
          group.modifier.details.map((detail, j) => {
            detail.quantity = 0;

            if (group.modifier.min !== 0 && group.modifier.min !== undefined) {
              product.product.productModifiers[i].modifier.show = true;
            } else {
              product.product.productModifiers[i].modifier.show = false;
            }

            if (
              group.modifier.isYesNo === true &&
              detail.orderingStatus === "AVAILABLE"
            ) {
              if (
                group.modifier.yesNoDefaultValue === true &&
                detail.yesNoValue === "no"
              ) {
                product.product.productModifiers[i].modifier.details[
                  j
                ].isSelected = false;
              }

              if (
                group.modifier.yesNoDefaultValue === false &&
                detail.yesNoValue === "yes"
              ) {
                product.product.productModifiers[i].modifier.details[
                  j
                ].isSelected = true;
              }
            }
          });
      });
    } catch (e) { }

    if (isEmptyObject(basket)) {
      product.quantity = 1;
      product.remark = "";
    } else {
      if (!isEmptyArray(basket.details)) {
        const find = await basket.details.find((data) => data.id == product.id);
        if (find !== undefined) {
          if (mode === "Update") {
            product.quantity = find.quantity;

            // fill the modifier
            if (!isEmptyArray(find.modifiers)) {
              product.product.productModifiers.map((group, i) => {
                group.modifier.details.map((detail, j) => {
                  find.modifiers.map((data) => {
                    data.modifier.details.map((item) => {
                      // make mark that item is in basket
                      if (data.modifierID == group.modifierID) {
                        product.product.productModifiers[i].postToServer = true;
                        // set quantity basket to product that openend
                        if (item.id == detail.id) {
                          // check for radio button
                          if (group.modifier.max == 1) {
                            product.product.productModifiers[i].modifier.show =
                              data.modifier.show;
                          }
                          product.product.productModifiers[i].modifier.details[
                            j
                          ].quantity = item.quantity;
                          // for is selected
                          product.product.productModifiers[i].modifier.details[
                            j
                          ].isSelected = item.isSelected;
                        }
                      }
                    });
                  });
                });
              });
            }
          }
        } else {
          product.quantity = 1;
          product.remark = "";
        }
      } else {
        product.quantity = 1;
        product.remark = "";
      }
    }
    product.mode = mode;
    await this.setState({ selectedItem: product });
  };

  getLabelButton = (item) => {
    const { basket } = this.props;
    try {
      if (!isEmptyObject(basket)) {
        const find = basket.details.find(
          (data) => data.product.id == item.product.id
        );
        if (find != undefined) return "Update";
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
          (data) => data.product.id == item.product.id
        );
        if (find != undefined) return `${find.quantity}x`;
        else return false;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  };

  setLoading = (loading) => {
    this.setState({ loading });
  };

  searchProduct = async (query) => {
    try {
      const { products, productsBackup, finished } = this.state;

      if (query == "") {
        await this.setState({ loading: false, loadingSearching: false });
        await this.setState({ products: productsBackup });
        return;
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
        } catch (e) { }

        if (items.length != 0) {
          if (productsSearch == undefined) {
            productsSearch = [];
          }

          let data = JSON.stringify(productsBackup[i]);
          data = JSON.parse(data);
          data.items = items;
          productsSearch.push(data);
        }
      }

      if (productsSearch == undefined) productsSearch = [];

      await this.setState({ products: productsSearch });
      await this.setState({ loading: false, loadingSearching: false });
    } catch (e) { }
  };

  loadingSearching = async (loadingSearching) => {
    await this.setState({ loadingSearching });
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
    if (this.props.productsSearch) products = this.props.productsSearch;
    else products = this.state.products;

    if (offlineMessage != "") {
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
              <Lottie
                options={{ animationData: emptyGif }}
                style={{ height: 250 }}
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
            ></UpdateProductModal>
          )}
        <ModalProduct
          addNew={this.state.addNew}
          selectedItem={this.state.selectedItem}
        />
        {this.state.processing == false ? <LoadingFixed /> : null}
        <br /> <br /> <br />
        <div id="offset-header" />
        {isEmenu ? (
          <CategoriesEmenu
            loadingSearching={this.loadingSearching}
            finished={finished}
            setLoading={this.setLoading}
            searchProduct={this.searchProduct}
            categories={categories}
            selectedCategory={this.state.selectedCategory}
          />
        ) : (
            <CategoriesWebOrdering
              loadingSearching={this.loadingSearching}
              finished={finished}
              setLoading={this.setLoading}
              searchProduct={this.searchProduct}
              categories={categories}
              selectedCategory={this.state.selectedCategory}
            />
          )}
        <div
          className="full-width list-view columns-2 archive woocommerce-page html-change"
          style={{ marginTop: isEmenu ? 35 : 5 }}
        >
          <div className="tab-content">
            <div className="tab-pane active" id="h1-tab-products-2">
              <ul className="products">
                {!loadingSearching &&
                  products.map((cat, i) => (
                    <>
                      <h3
                        id={i}
                        className="title"
                        style={{
                          fontSize: 14,
                          marginLeft: 15,
                          marginBottom: 10,
                          paddingTop: 10,
                          color: "gray",
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
                              showUpdateModal={(item) => {
                                console.log("Item params in showUpdateModal");
                                console.log(item);
                                this.setState({
                                  showUpdateModal: true,
                                  selectedProduct: item,
                                });
                              }}
                              key={j}
                              item={item}
                            />
                          )
                        );
                      })}
                    </>
                  ))}

                {!loadingSearching && !loading && products.length == 0 && (
                  <div>
                    <Lottie
                      options={{ animationData: emptyGif }}
                      style={{ height: 250 }}
                    />
                    <h3 className="color text-center">
                      Oppss.. Item Not Found.
                    </h3>
                  </div>
                )}
              </ul>
              {loading && <LoaderCircle />}
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
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Ordering);
