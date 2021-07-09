import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { isEmptyObject, isEmptyArray } from "../../helpers/CheckEmpty";
import { isEmptyData } from "../../helpers/CheckEmpty";
import { OrderAction } from "../../redux/actions/OrderAction";
import config from "../../config";
import Variant from "./Variant";
import Swal from "sweetalert2";

class ModalProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      update: false,
      selectedItem: {},
      basket: {},
      selectedModifier: {},
      disableButton: false,
      message: {
        title: "",
        message: "",
      },
      isEmenu: window.location.hostname.includes("emenu"),
      orderingModeStatus: {
        DINEIN: "enableDineIn",
        TAKEAWAY: "enableTakeAway",
        STOREPICKUP: "enableStorePickUp",
        STORECHECKOUT: "enableStoreCheckOut",
        DELIVERY: "enableDelivery",
      },
      showOrderingModeCloseButton: true,
      selectedVariant: null,
    };
  }

  componentDidUpdate = async (prevProps) => {
    if (
      prevProps.setting !== this.props.setting &&
      this.props.setting.length > 0
    ) {
      const showOrderingModeModalFirst = this.props.setting.find((setting) => {
        return setting.settingKey === "ShowOrderingModeModalFirst";
      });
      if (
        showOrderingModeModalFirst &&
        showOrderingModeModalFirst.settingValue === true
      ) {
        this.setState({ showOrderingModeCloseButton: false });
      }
    }
  };

  setSelectedVariantProduct = (variant) => {
    console.log(variant);
    this.setState((prevState) => {
      return {
        selectedVariant: variant,
        selectedItem: {
          ...prevState.selectedItem,
          name: this.props.selectedItem.name + variant.variantName,
          id: variant.id,
          productID: `product::${variant.id}`,
          product: {
            barcode: variant.barcode,
            categoryName: prevState.selectedItem.product.categoryName,
            code: variant.barcode,
            id: variant.id,
            name: this.props.selectedItem.name + variant.variantName,
            orderingAvaibility:
              prevState.selectedItem.product.orderingAvaibility,
            orderingStatus: prevState.selectedItem.product.orderingStatus,
            productModifiers: prevState.selectedItem.product.productModifiers,
            retailPrice: variant.retailPrice,
            defaultImageURL:
              variant.defaultImageURL ||
              prevState.selectedItem.product.defaultImageURL,
          },
        },
      };
    });
  };

  ruleModifierNotPassed = () => {
    try {
      let selectedItem = this.state.selectedItem;
      let productModifiers = selectedItem.product.productModifiers;

      if (selectedItem.quantity === 0 || selectedItem.quantity === undefined)
        return false;

      for (let i = 0; i < productModifiers.length; i++) {
        let lengthDetail = 0;
        let modifierDetail = productModifiers[i].modifier.details;
        for (let x = 0; x < modifierDetail.length; x++) {
          if (
            modifierDetail[x].quantity > 0 &&
            modifierDetail[x].quantity !== undefined
          ) {
            lengthDetail += modifierDetail[x].quantity;
          }
        }
        // check rule min max
        if (
          productModifiers[i].modifier.min !== 0 ||
          productModifiers[i].modifier.max !== 0
        ) {
          // check min modifier
          if (
            lengthDetail < productModifiers[i].modifier.min &&
            lengthDetail !== undefined &&
            productModifiers[i].modifier.min !== 0 &&
            productModifiers[i].modifier.isYesNo !== true &&
            productModifiers[i].modifier.min !== undefined
          ) {
            return true;
          }

          // check max modifier
          if (
            lengthDetail > productModifiers[i].modifier.max &&
            lengthDetail !== undefined &&
            productModifiers[i].modifier.max !== 0 &&
            productModifiers[i].modifier.isYesNo !== true &&
            productModifiers[i].modifier.max !== undefined
          ) {
            return true;
          }
        }
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  componentWillReceiveProps(nextProps) {
    let { selectedItem } = nextProps;
    if (nextProps.addNew) {
      selectedItem = { ...selectedItem, quantity: 1 };
    }
    this.setState({
      selectedItem,
      basket: nextProps.basket,
      disableButton: false,
    });
  }

  renderImageProduct = (item) => {
    const { color } = this.props;

    if (
      item.product &&
      item.product.defaultImageURL &&
      !isEmptyData(item.product.defaultImageURL)
    ) {
      return item.product.defaultImageURL;
    } else {
      if (color && color.productPlaceholder !== null) {
        return color.productPlaceholder;
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

  calculateTotal = () => {
    try {
      const { selectedItem } = this.state;
      let subTotal = 0;
      let totalModifier = 0;

      if (!isEmptyData(selectedItem.product.retailPrice)) {
        subTotal = parseFloat(selectedItem.product.retailPrice);
      }

      if (!isEmptyArray(selectedItem.product.productModifiers)) {
        selectedItem.product.productModifiers.forEach((group) => {
          group.modifier.details.forEach((detail) => {
            if (detail.quantity !== undefined && detail.quantity > 0) {
              let price = detail.price;
              if (price === undefined) price = 0;
              totalModifier += parseFloat(detail.quantity * price);
            }
          });
        });
      }

      subTotal += totalModifier;
      subTotal = subTotal * selectedItem.quantity;

      return this.getCurrency(subTotal.toFixed(2));
    } catch (e) {
      return this.getCurrency(undefined);
    }
  };

  decrease = () => {
    try {
      let { selectedItem } = this.state;
      let minimum = 0;
      if (this.props.addNew) minimum = 1;

      if (selectedItem.quantity > minimum) {
        selectedItem.quantity -= 1;
        if (
          !this.isItemExist(this.state.selectedItem) &&
          selectedItem.quantity === 0
        ) {
          selectedItem.quantity = 1;
        }

        this.setState({ selectedItem });
      }
    } catch (e) {}
  };

  increase = () => {
    try {
      let { selectedItem } = this.state;
      selectedItem.quantity += 1;
      this.setState({ selectedItem });
    } catch (e) {}
  };

  processCart = async (e, manualOrderingMode = "") => {
    console.log("Calling process cart...");
    const orderMode = this.props.orderingMode;
    console.log(manualOrderingMode);
    try {
      if (orderMode || manualOrderingMode !== "") {
        const { defaultOutlet } = this.props;
        const { selectedItem } = this.state;
        const { basket } = this.state;

        if (this.ruleModifierNotPassed()) {
          // dummy variable created, so even the code below is error, then alert still showing
          let name = "Item";
          let qty = 1;
          let status = "lack";

          // check name and quantity modifier that hasnt been success passed min & max
          try {
            let productModifiers =
              this.state.selectedItem.product.productModifiers;
            for (let i = 0; i < productModifiers.length; i++) {
              let lengthDetail = 0;
              let modifierDetail = productModifiers[i].modifier.details;
              for (let x = 0; x < modifierDetail.length; x++) {
                if (
                  modifierDetail[x].quantity > 0 &&
                  modifierDetail[x].quantity !== undefined
                ) {
                  lengthDetail += modifierDetail[x].quantity;
                }
              }

              if (productModifiers[i].modifier.min > lengthDetail) {
                name = productModifiers[i].modifierName;
                qty = productModifiers[i].modifier.min;
                status = "lack";
                break;
              }

              if (lengthDetail > productModifiers[i].modifier.max) {
                name = productModifiers[i].modifierName;
                qty = productModifiers[i].modifier.max;
                status = "excess";
                break;
              }
            }
          } catch (e) {}

          if (name !== "Item") {
            let message = { title: "Warning", message: "" };
            document.getElementById("btn-mesage-modifier").click();
            if (status === "lack") {
              message.message = `Please pick minimum ${qty} ${name}`;
              this.setState({ message });
            } else {
              message.message = `The maximum ${name} that can be taken is ${qty}`;
              this.setState({ message });
            }
          }
          return;
        }

        await this.setState({ disableButton: true });
        if (
          (selectedItem.mode === "Add" || this.props.addNew) &&
          !_.isEmpty(this.state.selectedItem)
        ) {
          console.log("Dispatching processAddCart");
          this.props.dispatch(
            OrderAction.processAddCart(defaultOutlet, selectedItem)
          );
          this.setState({ selectedItem: {} });
        } else {
          let response = await this.props.dispatch(
            OrderAction.processUpdateCart(basket, [{ ...selectedItem }])
          );
          // this.props.handleSetState("dataBasket", response.data);
          this.setState({ selectedItem: {} });
          console.log(selectedItem);
          document.getElementById("detail-product-modal").click();
        }
      } else {
        document.getElementById("open-modal-ordering-mode").click();
      }
    } catch (e) {}
  };

  isItemExist = (item) => {
    try {
      const { basket } = this.state;
      if (!isEmptyObject(basket)) {
        const find = basket.details.find(
          (data) => data.product.id === item.product.id
        );
        if (find !== undefined) return true;
        else return false;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  };

  addItemIsYesNo = async (item, type, groupId) => {
    const { selectedItem } = this.state;

    if (item.orderingStatus === "UNAVAILABLE") return;

    let itemCopy = { ...selectedItem };
    if (type !== "checkbox") {
      for (let i = 0; i < itemCopy.product.productModifiers.length; i++) {
        if (itemCopy.product.productModifiers[i].modifierID === groupId) {
          let modifierData = itemCopy.product.productModifiers[i].modifier;
          if (modifierData.max === 1) {
            for (let j = 0; j < modifierData.details.length; j++) {
              modifierData.details[j].quantity = 0;
              modifierData.details[j].isSelected = false;
            }
          }
        }
      }
    }

    await this.setState({ selectedItem: itemCopy });

    for (let i = 0; i < selectedItem.product.productModifiers.length; i++) {
      let modifierDetail =
        selectedItem.product.productModifiers[i].modifier.details;
      for (let j = 0; j < modifierDetail.length; j++) {
        if (modifierDetail[j].id === item.id) {
          let isSelected =
            selectedItem.product.productModifiers[i].modifier.details[j]
              .isSelected;
          if (
            (modifierDetail[j].quantity === undefined ||
              modifierDetail[j].quantity === 0) &&
            isSelected === false
          ) {
            modifierDetail[j].quantity = 1;
            modifierDetail[j].isSelected = !isSelected;
            selectedItem.product.productModifiers[i].postToServer = true;
          } else {
            modifierDetail[j].quantity = 0;
            modifierDetail[j].isSelected = !isSelected;

            if (type === undefined)
              selectedItem.product.productModifiers[i].postToServer = undefined;
          }
        }
      }
    }
    await this.setState({ selectedItem });
  };

  isSelected = (item) => {
    const { selectedItem } = this.state;

    for (let i = 0; i < selectedItem.product.productModifiers.length; i++) {
      let modifierDetail =
        selectedItem.product.productModifiers[i].modifier.details;
      for (let j = 0; j < modifierDetail.length; j++) {
        if (modifierDetail[j].id === item.id) {
          if (
            modifierDetail[j].quantity !== undefined &&
            modifierDetail[j].quantity !== 0
          ) {
            return modifierDetail[j].quantity;
          }
        }
      }
    }
    return false;
  };

  renderItemIsYesNo = (item) => {
    return (
      <div className="renderItemIsYesNo card card-modifier">
        <div style={{ marginLeft: 5, marginRight: 10 }}>
          {item.modifier.details.map((data) => (
            <div
              className="item-modifier"
              style={{
                display: "flex",
                paddingBottom: 15,
                alignItems: "center",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center" }}
                className="title-modifier"
                onClick={() =>
                  this.addItemIsYesNo(data, "yesOrNo", item.modifierID)
                }
              >
                <input
                  type="checkbox"
                  checked={data.isSelected}
                  className="scaled-checkbox form-check-input checkbox-modifier"
                />
                <div
                  className="subtitle-modifier"
                  style={{ lineHeight: "20px", marginRight: 10 }}
                >
                  {item.modifierName}
                </div>
              </div>
              <div>{this.getCurrency(data.price)}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  renderItemCheckbox = (item, i) => {
    return (
      <div className="renderItemCheckbox card card-modifier">
        <div
          onClick={() => this.toggleModifier(i)}
          className="card-header header-modifier"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <p className="color" style={{ margin: 0 }}>
            <b>
              {item.modifierName}{" "}
              <span className="rule-modifier">{this.ruleModifier(item)}</span>{" "}
            </b>
          </p>
          <i className={this.getIconChevron(item)} style={{ fontSize: 16 }}></i>
        </div>
        {item.modifier.show ? (
          <div style={{ marginLeft: 5, marginRight: 10 }}>
            {item.modifier.details.map((data) => (
              <div
                className={
                  data.orderingStatus === "UNAVAILABLE"
                    ? "item-modifier product-unavailable"
                    : "item-modifier"
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  paddingBottom: 15,
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    checked={
                      data.quantity !== undefined &&
                      data.quantity !== 0 &&
                      data.orderingStatus !== "UNAVAILABLE"
                        ? true
                        : false
                    }
                    className="scaled-checkbox form-check-input checkbox-modifier"
                    onClick={() =>
                      this.addItemIsYesNo(data, "checkbox", item.modifierID)
                    }
                  />
                  <div
                    className="subtitle-modifier"
                    style={{ lineHeight: "20px", marginRight: 10 }}
                  >
                    <span className="color">
                      {data.quantity !== undefined && data.quantity !== 0
                        ? `${data.quantity}x `
                        : null}
                    </span>
                    <span
                      onClick={() =>
                        this.addItemIsYesNo(data, "checkbox", item.modifierID)
                      }
                    >
                      {data.name}
                    </span>
                    {data.quantity !== undefined && data.quantity !== 0 ? (
                      <span
                        onClick={() =>
                          this.setState({ selectedModifier: data })
                        }
                        data-toggle="modal"
                        data-target="#qty-modifier"
                        className="color"
                        style={{ marginLeft: 5, textDecoration: "underline" }}
                      >
                        more
                      </span>
                    ) : null}
                  </div>
                </div>
                {data.orderingStatus === "UNAVAILABLE" ? (
                  <div>UNAVAILABLE</div>
                ) : (
                  <div>{this.getCurrency(data.price)}</div>
                )}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  };

  ruleModifier = (item) => {
    try {
      if (
        (item.modifier.min === 0 ||
          item.modifier.min === undefined ||
          item.modifier.min === "-") &&
        item.modifier.max > 0
      ) {
        return `Optional, Max ${item.modifier.max}`;
      } else if (
        (item.modifier.min === 0 ||
          item.modifier.min === undefined ||
          item.modifier.min === "-") &&
        item.modifier.max <= 0
      ) {
        return `Optional`;
      } else if (
        item.modifier.min === 1 &&
        (item.modifier.max === 1 ||
          item.modifier.max <= 0 ||
          item.modifier.max === undefined)
      ) {
        return `Pick 1`;
      } else if (item.modifier.min > 0 && item.modifier.max > 0) {
        return `Pick ${item.modifier.min} to ${item.modifier.max}`;
      }
    } catch (e) {
      return null;
    }
    return null;
  };

  getIconChevron = (item) => {
    if (item.modifier.show) return "fa fa-chevron-up color";
    else return "fa fa-chevron-down color";
  };

  toggleModifier = async (i) => {
    let { selectedItem } = this.state;
    let modifier = selectedItem.product.productModifiers[i].modifier;
    selectedItem.product.productModifiers[i].modifier.show = !modifier.show;
    await this.setState({ selectedItem });
  };

  renderItemRadio = (item, i) => {
    return (
      <div className="card card-modifier">
        <div
          onClick={() => this.toggleModifier(i)}
          className="card-header header-modifier"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <p className="color" style={{ margin: 0 }}>
            <b>
              {item.modifierName}{" "}
              <span className="rule-modifier">{this.ruleModifier(item)}</span>{" "}
            </b>
          </p>
          <i className={this.getIconChevron(item)} style={{ fontSize: 16 }}></i>
        </div>
        {item.modifier.show ? (
          <div style={{ marginLeft: 5, marginRight: 10 }}>
            {item.modifier.details.map((data) => (
              <div
                className={
                  data.orderingStatus === "UNAVAILABLE"
                    ? "item-modifier product-unavailable"
                    : "item-modifier"
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  paddingBottom: 15,
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center" }}
                  className="title-modifier"
                  onClick={() =>
                    this.addItemIsYesNo(data, "radio", item.modifierID)
                  }
                >
                  <div>
                    {data.isSelected ? (
                      <div
                        style={{
                          border: "1px solid gray",
                          width: 20,
                          height: 20,
                          borderRadius: 50,
                          marginLeft: 3,
                          padding: 2,
                          justifyContent: "center",
                          alignItems: "center",
                          display: "flex",
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: "#3498db",
                            width: 10,
                            height: 10,
                            borderRadius: 50,
                          }}
                        ></div>
                      </div>
                    ) : (
                      <div
                        style={{
                          border: "1px solid gray",
                          width: 20,
                          height: 20,
                          borderRadius: 50,
                          marginLeft: 3,
                        }}
                      ></div>
                    )}
                    {/* <input
                      type="radio"
                      checked={data.isSelected ? true : false}
                      class="scaled-checkbox form-check-input checkbox-modifier"
                    /> */}
                  </div>

                  <div
                    className="subtitle-modifier"
                    style={{ lineHeight: "20px", marginRight: 10 }}
                  >
                    {data.name}
                  </div>
                </div>
                {data.orderingStatus === "UNAVAILABLE" ? (
                  <div>UNAVAILABLE</div>
                ) : (
                  <div>{this.getCurrency(data.price)}</div>
                )}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  };

  componentWillUnmount = () => {
    try {
      document.getElementById("close-product-modal").click();
    } catch (e) {}

    try {
      document.getElementById("dismiss-ordering-mode").click();
    } catch (e) {}
  };

  detailProduct = () => {
    let { disableButton, selectedItem } = this.state;
    let { defaultOutlet, data } = this.props;

    if (data) defaultOutlet = data.storeDetail;

    return (
      <div
        className="modal-content"
        style={{ width: "100%", height: "90vh", bottom: 0, zIndex: 10 }}
      >
        <div
          className="modal-header modal-header-product"
          style={{
            display: "flex",
            justifyContent: "center",
            borderBottom: "none",
          }}
        >
          <button
            id="close-modal"
            className="close close-modal btn-close-modal-product "
            data-dismiss="modal"
            aria-label="Close"
            style={{
              position: "absolute",
              right: 10,
              top: 14,
              zIndex: 10,
              opacity: 0.8,
              width: 35,
              height: 35,
            }}
            onClick={() => {
              this.setState({ selectedItem: {} });
            }}
          >
            <i
              id="close-product-modal"
              className="fa fa-times text-btn-theme"
            ></i>
          </button>
        </div>
        <div className="modal-body modal-body-product">
          {!isEmptyObject(selectedItem) ? (
            <>
              <div className="col-md-5 col-sm-12" style={{ marginBottom: 15 }}>
                <center>
                  <img
                    style={{ borderRadius: 5 }}
                    className="detail-image attachment-pizzaro-product-list-fw-col-1 size-pizzaro-product-list-fw-col-1"
                    src={this.renderImageProduct(selectedItem)}
                    alt="product"
                  />
                </center>
              </div>
              <div className="col-md-6 col-sm-12">
                <center>
                  <h3
                    style={{ textAlign: "left", marginRight: 10 }}
                    className="color"
                  >
                    {selectedItem.product.name}
                  </h3>
                  <p
                    style={{
                      marginTop: 10,
                      textAlign: "left",
                      whiteSpace: "pre-line",
                    }}
                    className="color"
                  >
                    {selectedItem.product.description}
                  </p>
                </center>
              </div>
              <div className="col-md-12">
                {this.props.selectedItem &&
                  this.props.selectedItem.product &&
                  this.props.selectedItem.product.variants &&
                  this.props.selectedItem.product.variantOptions && (
                    <Variant
                      options={this.props.selectedItem.product.variantOptions}
                      variants={this.props.selectedItem.product.variants}
                      setVariantProduct={this.setSelectedVariantProduct}
                    ></Variant>
                  )}
              </div>
              <div className="col-md-12" style={{ textAlign: "left" }}>
                {selectedItem.product.productModifiers &&
                  selectedItem.product.productModifiers.map((item, i) => {
                    if (
                      item.modifier.isYesNo !== true &&
                      (item.modifier.max === 0 ||
                        item.modifier.max === undefined ||
                        item.modifier.max > 1 ||
                        item.modifier.max === "-")
                    ) {
                      return this.renderItemCheckbox(item, i);
                    } else if (
                      item.modifier.isYesNo !== true &&
                      item.modifier.max === 1
                    ) {
                      return this.renderItemRadio(item, i);
                    } else {
                      return this.renderItemIsYesNo(item, i);
                    }
                  })}
              </div>
              {defaultOutlet.enableItemSpecialInstructions ? (
                <div className="col-md-12" style={{ textAlign: "left" }}>
                  <label for="name">
                    Special Instruction{" "}
                    <span className="text-muted" style={{ fontSize: 10 }}>
                      Optional
                    </span>
                  </label>
                  <input
                    onChange={(e) => {
                      selectedItem.remark = e.target.value;
                      this.setState({ selectedItem });
                    }}
                    style={{ display: "block", width: "100%", borderRadius: 4 }}
                    value={selectedItem.remark}
                    type="text"
                    placeholder="Place your note here..."
                    className="woocommerce-Input woocommerce-Input--text input-text"
                  />
                </div>
              ) : null}
            </>
          ) : null}
        </div>
        <div
          className="pizzaro-handheld-footer-bar"
          style={{
            display: "flex",
            justifyContent: "center",
            padding: 5,
            paddingBottom: 20,
            paddingTop: 20,
          }}
        >
          <div className="control-quantity">
            <button
              disabled={disableButton}
              style={{ minWidth: 40 }}
              className="btn btn-increase"
              onClick={this.decrease}
            >
              <b className="text-btn-theme" style={{ fontSize: 20 }}>
                -
              </b>
            </button>
            <b
              className="color"
              style={{
                fontSize: 20,
                minWidth: 40,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {selectedItem.quantity}
            </b>
            <button
              disabled={disableButton}
              style={{ minWidth: 40 }}
              className="btn btn-increase"
              onClick={this.increase}
            >
              <b className="text-btn-theme" style={{ fontSize: 20 }}>
                +
              </b>
            </button>
          </div>
          <div style={{ width: "100%", marginLeft: 10 }}>
            {!disableButton ? (
              this.isItemExist(selectedItem) && !this.props.addNew ? (
                <button
                  disabled={disableButton}
                  className="btn btn-block btn-footer"
                  onClick={this.processCart}
                >
                  <b className="text-btn-theme">{`${
                    selectedItem.quantity === 0 ? "Remove" : "Update"
                  } ${
                    this.props.companyInfo &&
                    this.props.companyInfo.currency.code
                  } ${this.calculateTotal()}`}</b>
                </button>
              ) : (
                <button
                  id="add-product-modal"
                  disabled={disableButton}
                  className="btn btn-block btn-footer"
                  onClick={this.processCart}
                >
                  <b className="text-btn-theme">
                    Add{" "}
                    {`${
                      this.props.companyInfo &&
                      this.props.companyInfo.currency.code
                    } ${this.calculateTotal()}`}
                  </b>
                </button>
              )
            ) : (
              <button
                disabled={disableButton}
                className="btn btn-block btn-footer"
                onClick={this.processCart}
              >
                <b className="text-btn-theme">Loading...</b>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  setOrderingMode = async (mode) => {
    console.log("Calling setOrderingMode...");
    if (
      this.props.orderingSetting &&
      this.props.orderingSetting.ShowOrderingModeModalFirst
    ) {
      if (this.props.orderingMode && !_.isEmpty(this.props.basket)) {
        Swal.fire({
          title: "Change ordering mode?",
          text: "Changing ordering mode will remove item(s) in your cart",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes",
        }).then(async (result) => {
          if (result.value) {
            if (this.props.account) {
              this.props.dispatch(OrderAction.deleteCart(true));
            } else {
              this.props.dispatch(OrderAction.deleteCart());
            }
            await this.props.dispatch({
              type: "SET_ORDERING_MODE",
              payload: mode,
            });
            try {
              document.getElementById("dismiss-ordering-mode").click();
            } catch (error) {}
          }
        });
      } else {
        await this.props.dispatch({
          type: "SET_ORDERING_MODE",
          payload: mode,
        });
        try {
          document.getElementById("dismiss-ordering-mode").click();
        } catch (error) {}
      }
    } else {
      await this.props.dispatch({
        type: "SET_ORDERING_MODE",
        payload: mode,
      });
      await this.setState({ disableButton: true });
      console.log("Calling set ordeirng mode");
      this.processCart(null, mode);
      if (mode !== "" && mode !== undefined && mode === null) {
        setTimeout(() => {
          const payload = {
            orderingMode: mode,
          };
          this.props.dispatch(OrderAction.updateCartInfo(payload));
        }, 1000);
      }
      try {
        document.getElementById("dismiss-ordering-mode").click();
      } catch (error) {}
    }
  };

  modalOrderingMode = () => {
    let { defaultOutlet, setting } = this.props;
    let { orderingModeStatus } = this.state;
    let allowedOrderingMode = setting.find((items) => {
      return items.settingKey === "AllowedOrderingMode";
    });
    if (allowedOrderingMode) {
      allowedOrderingMode = allowedOrderingMode.settingValue;
      for (let key in orderingModeStatus) {
        let check = allowedOrderingMode.find((mode) => {
          return mode === key;
        });
        if (!check) defaultOutlet[orderingModeStatus[key]] = false;
      }
    }

    return (
      <div
        className="modal fade"
        id="ordering-mode"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-product modal-dialog-centered modal-full"
          role="document"
          style={{
            justifyContent: "center",
            width: "100vw",
            height: "100vh",
            paddingBottom: "20vh",
          }}
        >
          <div className="modal-content modal-ordering-mode">
            <div
              className="modal-header modal-header-product"
              style={{ display: "flex", justifyContent: "center", padding: 7 }}
            >
              <h5 style={{ fontSize: 16, marginTop: 10 }} className="color">
                {defaultOutlet && defaultOutlet.outletType === "RETAIL"
                  ? "Ordering Mode"
                  : "Select your dining preference"}
              </h5>
            </div>
            <div className="modal-body">
              <div className="col-md-12">
                <div style={{ justifyContent: "center" }}>
                  {defaultOutlet.enableDineIn === true &&
                    this.viewCartOrderingMode(
                      "DINEIN",
                      defaultOutlet.orderValidation.dineIn,
                      "fa-cutlery",
                      defaultOutlet.dineInName
                    )}
                  {defaultOutlet.enableTakeAway === true &&
                    this.viewCartOrderingMode(
                      "TAKEAWAY",
                      defaultOutlet.orderValidation.takeAway,
                      "fa-shopping-basket",
                      defaultOutlet.takeAwayName
                    )}
                  {defaultOutlet.enableStorePickUp === true &&
                    this.viewCartOrderingMode(
                      "STOREPICKUP",
                      defaultOutlet.orderValidation.storepickup,
                      "fa-shopping-basket",
                      defaultOutlet.storePickUpName
                    )}
                  {defaultOutlet.enableStoreCheckOut === true &&
                    this.viewCartOrderingMode(
                      "STORECHECKOUT",
                      defaultOutlet.orderValidation.storecheckout,
                      "fa-shopping-basket",
                      defaultOutlet.storeCheckOutName
                    )}
                  {defaultOutlet.enableDelivery === true &&
                    this.viewCartOrderingMode(
                      "DELIVERY",
                      defaultOutlet.orderValidation.delivery,
                      "fa-car",
                      defaultOutlet.deliveryName
                    )}
                </div>

                <p
                  id="dismiss-ordering-mode"
                  data-dismiss="modal"
                  className="color"
                  style={{
                    cursor: "pointer",
                    textAlign: "center",
                    marginTop: 30,
                    marginBottom: 20,
                    display:
                      this.props.orderingSetting.ShowOrderingModeModalFirst &&
                      !this.props.orderingMode
                        ? "none"
                        : "block",
                  }}
                >
                  I'm just browsing
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  checkOrderValidation(validation, type, nickname) {
    if (type === "titleAmount") {
      if (validation.minAmount === 0 && validation.maxAmount > 0) {
        return `Maximum amount for ${nickname.toLowerCase()}`;
      } else if (validation.minAmount > 0 && validation.maxAmount === 0) {
        return `Minimum amount for ${nickname.toLowerCase()}`;
      } else {
        return `Range amount for ${nickname.toLowerCase()}`;
      }
    } else if (type === "descAmount") {
      if (validation.minAmount === 0 && validation.maxAmount > 0) {
        return this.getCurrency(validation.maxAmount);
      } else if (validation.minAmount > 0 && validation.maxAmount === 0) {
        return this.getCurrency(validation.minAmount);
      } else {
        return `${this.getCurrency(validation.minAmount)} to ${this.getCurrency(
          validation.maxAmount
        )}`;
      }
    } else if (type === "titleQty") {
      if (validation.minQty === 0 && validation.maxQty > 0) {
        return `Maximum item quantity for ${nickname.toLowerCase()}`;
      } else if (validation.minQty > 0 && validation.maxQty === 0) {
        return `Minimum item quantity for ${nickname.toLowerCase()}`;
      } else {
        return `Range item quantity for ${nickname.toLowerCase()}`;
      }
    } else if (type === "descQty") {
      if (validation.minQty === 0 && validation.maxQty > 0) {
        return `${validation.maxQty} items`;
      } else if (validation.minQty > 0 && validation.maxQty === 0) {
        return `${validation.minQty} items`;
      } else {
        return `${validation.minQty} to ${validation.maxQty} items`;
      }
    }
  }

  viewCartOrderingMode(name, orderValidation, icon, nickname) {
    orderValidation.minQty = orderValidation.minQty || 0;
    orderValidation.maxQty = orderValidation.maxQty || 0;
    orderValidation.minAmount = orderValidation.minAmount || 0;
    orderValidation.maxAmount = orderValidation.maxAmount || 0;

    if (!nickname || (nickname && nickname === "")) nickname = false;

    return (
      <div
        className="order-mode"
        onClick={() => this.setOrderingMode(name)}
        style={{
          height: orderValidation.minAmount ? 80 : 50,
          alignItems: "center",
          justifyContent: "center",
          padding: 5,
          cursor: "pointer",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginTop: 5,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <i
            className={`fa ${icon} color icon-order`}
            style={{ marginTop: 0, marginRight: 5, fontSize: 20 }}
          ></i>
          <div className="color" style={{ fontWeight: "bold", fontSize: 14 }}>
            {nickname || name}
          </div>
        </div>
        {orderValidation && (
          <div style={{ fontSize: 12, marginTop: -5 }}>
            <div
              style={{
                height: 1,
                width: "100%",
                backgroundColor: "#CDCDCD",
                marginTop: 5,
                marginBottom: 10,
              }}
            />
            {orderValidation.minAmount || orderValidation.maxAmount ? (
              <div style={{ display: "flex", marginTop: -10 }}>
                <strong style={{ marginRight: 5 }}>
                  {this.checkOrderValidation(
                    orderValidation,
                    "titleAmount",
                    nickname || name
                  )}
                </strong>
                {this.checkOrderValidation(
                  orderValidation,
                  "descAmount",
                  nickname || name
                )}
              </div>
            ) : null}
            {orderValidation.minQty || orderValidation.maxQty ? (
              <div style={{ display: "flex", marginTop: -10 }}>
                <strong style={{ marginRight: 5 }}>
                  {this.checkOrderValidation(
                    orderValidation,
                    "titleQty",
                    nickname || name
                  )}
                </strong>
                {this.checkOrderValidation(
                  orderValidation,
                  "descQty",
                  nickname || name
                )}
              </div>
            ) : null}
          </div>
        )}
      </div>
    );
  }

  increaseModifier = () => {
    let { selectedModifier } = this.state;
    selectedModifier.quantity += 1;
    this.setState({ selectedModifier });
  };

  decreaseModifier = () => {
    let { selectedModifier } = this.state;
    if (
      selectedModifier.quantity !== undefined &&
      selectedModifier.quantity > 0
    ) {
      selectedModifier.quantity -= 1;
      this.setState({ selectedModifier });
    }
  };

  modalQtyModifier = () => {
    const { selectedModifier } = this.state;
    return (
      <div
        className="modal fade"
        id="qty-modifier"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-product modal-dialog-centered modal-full"
          role="document"
          style={{ justifyContent: "center" }}
        >
          <div className="modal-content" style={{ width: "60%" }}>
            <div
              className="modal-header modal-header-product"
              style={{
                display: "flex",
                justifyContent: "center",
                borderBottom: "none",
              }}
            >
              {selectedModifier.name}
            </div>
            <div className="modal-body">
              <div className="col-md-12">
                <div
                  className="container"
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <button
                    className="btn"
                    style={{ marginLeft: -10, minWidth: 40 }}
                    onClick={this.decreaseModifier}
                  >
                    <b className="text-btn-theme" style={{ fontSize: 20 }}>
                      -
                    </b>
                  </button>
                  <div>
                    <b style={{ fontSize: 20 }}>{selectedModifier.quantity}</b>
                  </div>
                  <button
                    className="btn"
                    style={{ marginRight: -10, minWidth: 40 }}
                    onClick={this.increaseModifier}
                  >
                    <b className="text-btn-theme" style={{ fontSize: 20 }}>
                      +
                    </b>
                  </button>
                </div>
                {selectedModifier.quantity === 0 ? (
                  <button
                    id="dismiss-ordering-mode"
                    data-dismiss="modal"
                    className="btn btn-block btn-danger text-btn-theme"
                    style={{
                      marginTop: 30,
                      marginBottom: 20,
                      height: 40,
                      fontWeight: "bold",
                    }}
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    id="dismiss-ordering-mode"
                    data-dismiss="modal"
                    className="btn btn-block btn-footer text-btn-theme"
                    style={{
                      marginTop: 30,
                      marginBottom: 20,
                      height: 40,
                      fontWeight: "bold",
                    }}
                  >
                    OK
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  modalMessage = () => {
    const { message } = this.state;
    return (
      <div
        className="modal fade"
        id="mesage-modifier"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-product modal-dialog-centered modal-full"
          role="document"
          style={{ justifyContent: "center" }}
        >
          <div className="modal-content" style={{ width: 340 }}>
            <div
              className="modal-header"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <h5 className="modal-title" style={{ fontSize: 20 }}>
                {message.title}
              </h5>
              <button
                type="button"
                id="btn-close-mesage-modifier"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                style={{
                  position: "absolute",
                  right: 10,
                  top: 16,
                }}
              >
                <span aria-hidden="true" style={{ fontSize: 30 }}>
                  ×
                </span>
              </button>
            </div>
            <div className="modal-body" style={{ textAlign: "center" }}>
              {message.message}
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    console.log("modal product is rendering");
    return (
      <div>
        <span
          data-toggle="modal"
          data-target="#mesage-modifier"
          id="btn-mesage-modifier"
        />
        <div
          className="modal fade bd-example-modal-lg"
          id="detail-product-modal"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal-dialog-product modal-dialog-centered modal-full"
            role="document"
          >
            {this.detailProduct()}
          </div>
        </div>
        {this.modalOrderingMode()}
        {this.modalQtyModifier()}
        {this.modalMessage()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    account: state.auth.account && state.auth.account.idToken.payload,
    basket: state.order.basket,
    defaultOutlet: state.outlet.defaultOutlet,
    color: state.theme.color,
    companyInfo: state.masterdata.companyInfo.data,
    setting: state.order.setting,
    orderingMode: state.order.orderingMode,
    orderingSetting: state.order.orderingSetting,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalProduct);
