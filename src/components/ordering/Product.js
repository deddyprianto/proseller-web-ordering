import React, { Component } from "react";
import { isEmptyData } from "../../helpers/CheckEmpty";
import { connect } from "react-redux";
import { isEmptyObject } from "jquery";
import config from "../../config";

const Swal = require("sweetalert2");

class Product extends Component {
  renderImageProduct = (item) => {
    if (
      item.product.defaultImageURL &&
      !isEmptyData(item.product.defaultImageURL)
    ) {
      return item.product.defaultImageURL;
    } else {
      return config.image_placeholder;
    }
  };

  getCurrency = (price) => {
    if (this.props.companyInfo) {
      const { currency } = this.props.companyInfo;

      if (price === undefined || price === "-") {
        price = 0;
      }
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
      // if (isEmptyObject(basket)) document.getElementById('open-modal-ordering-mode').click();
      // else document.getElementById('open-modal-product').click();
      document.getElementById("open-modal-product").click();
    }
  };

  validateOutlet = () => {
    const { basket, defaultOutlet } = this.props;
    if (basket == undefined || basket.details == undefined) {
      this.openModal();
    } else {
      if (basket.outletID === defaultOutlet.sortKey) this.openModal();
      // else {
      //   Swal.fire({
      //     title: "Change Outlet ?",
      //     text: "You will delete order in previous outlet..",
      //     icon: "warning",
      //     showCancelButton: true,
      //     confirmButtonColor: "#3085d6",
      //     cancelButtonColor: "#d33",
      //     confirmButtonText: "Yes",
      //   }).then((result) => {
      //     if (result.value) {
      //       localStorage.removeItem(`${config.prefix}_offlineCart`);
      //       this.openModal();
      //     }
      //   });
      // }
      else this.openModal();
    }
  };

  render() {
    const { item } = this.props;
    return (
      <li
        style={{ marginBottom: 5 }}
        className="post-82 product type-product status-publish has-post-thumbnail product_cat-pizza  instock shipping-taxable purchasable product-type-simple addon-product"
      >
        <div
          className="product-outer"
          className={
            item.product.orderingStatus === "UNAVAILABLE"
              ? "product-unavailable"
              : null
          }
        >
          <div className="product-inner product-card" style={{ padding: 10 }}>
            <div className="product-image-wrapper">
              <span className="woocommerce-LoopProduct-link">
                <img
                  src={this.renderImageProduct(item)}
                  className="attachment-pizzaro-product-list-fw-col-1 size-pizzaro-product-list-fw-col-1 image-product"
                  alt={84}
                  title={84}
                />
              </span>
            </div>
            <div className="product-content-wrapper">
              <div>
                <h3
                  className="color"
                  onClick={() => this.validateOutlet()}
                  style={{ cursor: "pointer" }}
                >
                  <span className="text-muted">
                    {this.getQuantityProduct()}{" "}
                  </span>
                  <b>{item.product.name}</b>
                </h3>
                <div itemProp="description">
                  <div
                    className="color"
                    style={{ maxHeight: "none", whiteSpace: "pre-line" }}
                  >
                    {item.product.description}
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
                            className="price-product color"
                          >
                            {this.getCurrency(item.product.retailPrice)}
                          </b>
                        </div>
                        <div
                          onClick={() => this.validateOutlet()}
                          className="col-lg-12 col-md-12 col-xs-4"
                        >
                          <p
                            style={{
                              float: "left",
                              borderRadius: 5,
                              width: 90,
                              paddingLeft: 5,
                              paddingRight: 5,
                            }}
                            rel="nofollow"
                            className="button product_type_simple add_to_cart_button ajax_add_to_cart"
                          >
                            {this.props.labelButton}
                          </p>
                        </div>
                      </>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    basket: state.order.basket,
    defaultOutlet: state.outlet.defaultOutlet,
    companyInfo: state.masterdata.companyInfo.data,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Product);
