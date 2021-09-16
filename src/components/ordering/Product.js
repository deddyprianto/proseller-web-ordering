import React, { Component } from "react";
import { isEmptyData } from "../../helpers/CheckEmpty";
import { connect } from "react-redux";
import { isEmptyObject } from "jquery";
import config from "../../config";
import { ProductAction } from "../../redux/actions/ProductAction";
class Product extends Component {
  renderImageProduct = (item) => {
    const { productConfig } = this.props;
    if (
      item.product &&
      item.product.defaultImageURL &&
      !isEmptyData(item.product.defaultImageURL)
    ) {
      return item.product.defaultImageURL;
    } else {
      if (item.defaultImageURL) return item.defaultImageURL;
      if (
        productConfig &&
        productConfig.color &&
        productConfig.color.productPlaceholder !== null
      ) {
        return productConfig.color.productPlaceholder;
      }
      return config.image_placeholder;
    }
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

  getQuantityProduct = () => {
    const { basket, defaultOutlet } = this.props;
    const { item } = this.props;
    try {
      if (!isEmptyObject(basket)) {
        const products = basket.details.filter(
          (data) =>
            data.product.id === item.product.id &&
            defaultOutlet.sortKey === basket.outletID
        );
        if (products.length > 0) {
          const total = products.reduce((acc, product) => {
            return { quantity: acc.quantity + product.quantity };
          });
          return `${total.quantity}x`;
        } else return false;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  };

  openModal = () => {
    const { item, labelButton } = this.props;
    this.props.selectProduct(item, labelButton);
    if (labelButton.toLowerCase() === "update") {
      this.props.showUpdateModal(item);
    } else {
      try {
        document.getElementById("open-modal-product").click();
      } catch (error) {
        console.log("Can't find element with id : open-modal-product");
      }
    }
  };

  validateOutlet = () => {
    const { basket, defaultOutlet } = this.props;
    if (basket === undefined || basket.details === undefined) {
      this.openModal();
    } else {
      if (basket.outletID === defaultOutlet.sortKey) this.openModal();
      else this.openModal();
    }
  };

  maskDescription = (description) => {
    if (description) {
      const length = description.length;
      if (length < 47) {
        return description;
      }
      return description;
    }
  };

  goToDetailItem = (data) => {
    this.props.dispatch(ProductAction.setSelectedCategory(data));
    this.props.history.push(`category/${data.id}/products`);
  };

  render() {
    const { item } = this.props;
    
    if (!item.product && item.itemType === "PRODUCT") return null;
    return (
      <li
        style={{
          marginBottom: 5,
          boxShadow: "0px 0px 5px rgba(128, 128, 128, 0.5)",
        }}
        className="post-82 product type-product status-publish has-post-thumbnail product_cat-pizza  instock shipping-taxable purchasable product-type-simple addon-product"
      >
        {item.itemType === "GROUP" || item.itemType === "CATEGORY" ? (
          <div
            className={"product-outer"}
            onClick={() => this.goToDetailItem(item)}
          >
            <div
              style={{
                padding: 10,
                display: "flex",
                cursor: "pointer",
              }}
            >
              <div
                className="product-image-wrapper"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  maxWidth: 180,
                  alignItems: "center",
                  padding: 0,
                  marginRight: 5,
                }}
              >
                <span className="woocommerce-LoopProduct-link">
                  <img
                    src={this.renderImageProduct(item)}
                    style={{ borderRadius: 5 }}
                    className="attachment-pizzaro-product-list-fw-col-1 size-pizzaro-product-list-fw-col-1 image-product"
                    alt={item.name}
                    title={item.name}
                  />
                </span>
              </div>
              <div className="product-content-wrapper">
                <div>
                  <h3
                    style={{
                      cursor: "pointer",
                      fontSize: 16,
                      marginTop: 10,
                      color: this.props.color.primary,
                      lineHeight: "17px",
                    }}
                  >
                    <b>{item.name}</b>
                  </h3>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={
              item.product.orderingStatus === "UNAVAILABLE"
                ? "product-unavailable"
                : "product-outer"
            }
          >
            <div
              // className="product-inner product-card"
              style={{
                padding: 10,
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <div
                className="product-image-wrapper"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  maxWidth: 180,
                  alignItems: "center",
                  padding: 0,
                  marginRight: 5,
                }}
              >
                <span className="woocommerce-LoopProduct-link">
                  <img
                    src={this.renderImageProduct(item)}
                    style={{ borderRadius: 5 }}
                    className="attachment-pizzaro-product-list-fw-col-1 size-pizzaro-product-list-fw-col-1 image-product"
                    alt={item.product.name}
                    title={item.product.name}
                    onClick={() => this.validateOutlet()}
                  />
                </span>
              </div>
              <div className="product-content-wrapper">
                <div>
                  <h3
                    onClick={() => this.validateOutlet()}
                    style={{
                      cursor: "pointer",
                      marginTop: 10,
                      fontSize: 14,
                      lineHeight: "17px",
                    }}
                  >
                    <b className="text-muted color">
                      {this.getQuantityProduct()}{" "}
                    </b>
                    <b className="font-color-theme">{item.product.name}</b>
                  </h3>
                  <div
                    itemProp="description"
                    style={{ marginTop: -5, height: "auto" }}
                  >
                    <div
                      className="font-color-theme"
                      style={{
                        maxHeight: 80,
                        whiteSpace: "pre-line",
                        fontSize: 10,
                      }}
                    >
                      {this.maskDescription(item.product.description)}
                    </div>
                  </div>
                </div>
                <div className="yith_wapo_groups_container">
                  <div className="row" style={{ marginTop: 10 }}>
                    {item.product.orderingStatus === "UNAVAILABLE" ? (
                      <div className="col-lg-12 col-md-12 col-xs-12">
                        <h3 className="text text-muted">
                          <b>UNAVAILABLE</b>
                        </h3>
                      </div>
                    ) : (
                      <>
                        <div className="col-lg-12 col-md-12 col-xs-7">
                          <b
                            style={{ float: "left" }}
                            className="price-product"
                          >
                            {this.getCurrency(item.product.retailPrice)}
                          </b>
                        </div>
                        <div
                          onClick={() => this.validateOutlet()}
                          className="col-lg-12 col-md-12 col-xs-4"
                        >
                          <div
                            style={{
                              float: "left",
                              borderRadius: 5,
                              width: 90,
                              paddingLeft: 5,
                              paddingRight: 5,
                            }}
                            rel="nofollow"
                            className="button product_type_simple add_to_cart_button ajax_add_to_cart text-btn-theme"
                          >
                            {this.props.labelButton}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </li>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    basket: state.order.basket,
    color: state.theme.color,
    defaultOutlet: state.outlet.defaultOutlet,
    companyInfo: state.masterdata.companyInfo.data,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Product);