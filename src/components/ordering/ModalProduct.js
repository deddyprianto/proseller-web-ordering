import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmptyObject, isEmptyArray } from "../../helpers/CheckEmpty";
import { isEmptyData } from "../../helpers/CheckEmpty";
import { OrderAction } from "../../redux/actions/OrderAction";
import config from "../../config";

const Swal = require("sweetalert2");
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
      isEmenu: window.location.pathname.includes("emenu"),
    };
  }

  ruleModifierNotPassed = () => {
    try {
      let data = this.state.selectedItem.product.productModifiers;

      if (
        this.state.selectedItem.quantity == 0 ||
        this.state.selectedItem.quantity == undefined
      )
        return false;

      for (let i = 0; i < data.length; i++) {
        let lengthDetail = 0;
        for (let x = 0; x < data[i].modifier.details.length; x++) {
          if (
            data[i].modifier.details[x].quantity > 0 &&
            data[i].modifier.details[x].quantity != undefined
          ) {
            lengthDetail += data[i].modifier.details[x].quantity;
          }
        }
        // check rule min max
        if (data[i].modifier.min != 0 || data[i].modifier.max != 0) {
          // check min modifier
          if (
            lengthDetail < data[i].modifier.min &&
            lengthDetail != undefined &&
            data[i].modifier.min != 0 &&
            data[i].modifier.isYesNo != true &&
            data[i].modifier.min != undefined
          ) {
            return true;
          }

          // check max modifier
          if (
            lengthDetail > data[i].modifier.max &&
            lengthDetail != undefined &&
            data[i].modifier.max != 0 &&
            data[i].modifier.isYesNo != true &&
            data[i].modifier.max != undefined
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

  refreshRender = () => {
    this.setState({ update: false });
  };

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
    let { selectedItem } = nextProps;
    if (nextProps.addNew) {
      selectedItem = { ...selectedItem, quantity: 1 };
    }
    this.setState({ selectedItem });
    this.setState({ basket: nextProps.basket, disableButton: false });
  }

  // componentDidUpdate(prevProps) {
  //   if (prevProps.selectedItem !== this.props.selectedItem) {
  //     let { selectedItem } = this.props;
  //     if (this.props.addNew) {
  //       selectedItem = { ...selectedItem, quantity: 1 };
  //     }
  //     this.setState({ selectedItem });
  //   }
  //   if (prevProps.basket !== this.props.basket) {
  //     this.setState({ basket: this.props.basket, disableButton: false });
  //   }
  // }

  renderImageProduct = (item) => {
    if (
      item.product &&
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

  calculateTotal = () => {
    try {
      const { selectedItem } = this.state;
      let subTotal = 0;
      let totalModifier = 0;
      // const quantity = this.props.addNew ? this.state.

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
      if (selectedItem.quantity != 0) {
        selectedItem.quantity -= 1;
        this.setState({ selectedItem });
      }
    } catch (e) { }
  };

  increase = () => {
    try {
      let { selectedItem } = this.state;
      selectedItem.quantity += 1;
      this.setState({ selectedItem });
    } catch (e) { }
  };

  processCart = async () => {
    const orderMode = localStorage.getItem(`${config.prefix}_ordering_mode`);
    try {
      if (!orderMode) {
        document.getElementById("open-modal-ordering-mode").click();
      } else {
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
            let productModifiers = this.state.selectedItem.product
              .productModifiers;
            for (let i = 0; i < productModifiers.length; i++) {
              let lengthDetail = 0;

              for (
                let x = 0;
                x < productModifiers[i].modifier.details.length;
                x++
              ) {
                if (
                  productModifiers[i].modifier.details[x].quantity > 0 &&
                  productModifiers[i].modifier.details[x].quantity != undefined
                ) {
                  lengthDetail +=
                    productModifiers[i].modifier.details[x].quantity;
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
          } catch (e) { }

          if (name != "Item") {
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
        if (selectedItem.mode == "Add" || this.props.addNew) {
          this.props.dispatch(
            OrderAction.processAddCart(defaultOutlet, selectedItem)
          );
        } else {
          console.log("Updating item :");
          console.log(selectedItem);
          let response = await this.props.dispatch(
            OrderAction.processUpdateCart(basket, [{ ...selectedItem }])
          );
          this.props.handleSetState("dataBasket", response.data);
          document.getElementById("detail-product-modal").click();
        }
      }
    } catch (e) { }
  };

  isItemExist = (item) => {
    try {
      const { basket } = this.state;
      if (!isEmptyObject(basket)) {
        const find = basket.details.find(
          (data) => data.product.id == item.product.id
        );
        if (find != undefined) return true;
        else return false;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  };

  addItemIsYesNo = async (item, type) => {
    let { selectedItem } = this.state;

    if (item.orderingStatus === "UNAVAILABLE") return;

    selectedItem = JSON.stringify(selectedItem);
    selectedItem = JSON.parse(selectedItem);

    if (type != "checkbox") {
      for (let i = 0; i < selectedItem.product.productModifiers.length; i++) {
        if (selectedItem.product.productModifiers[i].modifier.max == 1) {
          for (
            let j = 0;
            j <
            selectedItem.product.productModifiers[i].modifier.details.length;
            j++
          ) {
            selectedItem.product.productModifiers[i].modifier.details[
              j
            ].quantity = 0;
            selectedItem.product.productModifiers[i].modifier.details[
              j
            ].isSelected = false;
          }
        }
      }
    }

    await this.setState({ selectedItem });

    for (let i = 0; i < selectedItem.product.productModifiers.length; i++) {
      for (
        let j = 0;
        j < selectedItem.product.productModifiers[i].modifier.details.length;
        j++
      ) {
        if (
          selectedItem.product.productModifiers[i].modifier.details[j].id ==
          item.id
        ) {
          if (
            selectedItem.product.productModifiers[i].modifier.details[j]
              .quantity == undefined ||
            selectedItem.product.productModifiers[i].modifier.details[j]
              .quantity == 0
          ) {
            selectedItem.product.productModifiers[i].modifier.details[
              j
            ].quantity = 1;
            selectedItem.product.productModifiers[i].modifier.details[
              j
            ].isSelected = !selectedItem.product.productModifiers[i].modifier
              .details[j].isSelected;
            selectedItem.product.productModifiers[i].postToServer = true;
          } else {
            selectedItem.product.productModifiers[i].modifier.details[
              j
            ].quantity = undefined;
            selectedItem.product.productModifiers[i].modifier.details[
              j
            ].isSelected = !selectedItem.product.productModifiers[i].modifier
              .details[j].isSelected;

            if (type == undefined)
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
      for (
        let j = 0;
        j < selectedItem.product.productModifiers[i].modifier.details.length;
        j++
      ) {
        if (
          selectedItem.product.productModifiers[i].modifier.details[j].id ==
          item.id
        ) {
          if (
            selectedItem.product.productModifiers[i].modifier.details[j]
              .quantity != undefined &&
            selectedItem.product.productModifiers[i].modifier.details[j]
              .quantity != 0
          ) {
            return selectedItem.product.productModifiers[i].modifier.details[j]
              .quantity;
          }
        }
      }
    }
    return false;
  };

  renderItemIsYesNo = (item) => {
    return (
      <div className="card card-modifier">
        <div style={{ marginLeft: 5, marginRight: 10 }}>
          {item.modifier.details.map((data) => (
            <div className="item-modifier">
              <a
                className="title-modifier"
                onClick={() => this.addItemIsYesNo(data)}
              >
                <input
                  type="checkbox"
                  checked={data.isSelected}
                  className="scaled-checkbox form-check-input checkbox-modifier"
                  onClick={() => this.addItemIsYesNo(data)}
                />
                <span className="subtitle-modifier">{item.modifierName}</span>
              </a>
              <p>{this.getCurrency(data.price)}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  selectModifier = (selectedModifier) => {
    this.setState({ selectedModifier });
  };

  renderItemCheckbox = (item, i) => {
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
              >
                <a>
                  <input
                    type="checkbox"
                    checked={
                      data.quantity != undefined &&
                        data.quantity != 0 &&
                        data.orderingStatus != "UNAVAILABLE"
                        ? true
                        : false
                    }
                    className="scaled-checkbox form-check-input checkbox-modifier"
                    onClick={() => this.addItemIsYesNo(data, "checkbox")}
                  />
                  <a className="subtitle-modifier">
                    <span className="color">
                      {data.quantity != undefined && data.quantity != 0
                        ? `${data.quantity}x `
                        : null}
                    </span>
                    <a onClick={() => this.addItemIsYesNo(data, "checkbox")}>
                      {data.name}
                    </a>
                    {data.quantity != undefined && data.quantity != 0 ? (
                      <span
                        onClick={() => this.selectModifier(data)}
                        data-toggle="modal"
                        data-target="#qty-modifier"
                        className="color"
                        style={{ marginLeft: 5, textDecoration: "underline" }}
                      >
                        more
                      </span>
                    ) : null}
                  </a>
                </a>
                {data.orderingStatus === "UNAVAILABLE" ? (
                  <p>UNAVAILABLE</p>
                ) : (
                    <p>{this.getCurrency(data.price)}</p>
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
        (item.modifier.min == 0 ||
          item.modifier.min == undefined ||
          item.modifier.min == "-") &&
        item.modifier.max > 0
      ) {
        return `Optional, Max ${item.modifier.max}`;
      } else if (
        (item.modifier.min == 0 ||
          item.modifier.min == undefined ||
          item.modifier.min == "-") &&
        item.modifier.max <= 0
      ) {
        return `Optional`;
      } else if (
        item.modifier.min == 1 &&
        (item.modifier.max == 1 ||
          item.modifier.max <= 0 ||
          item.modifier.max == undefined)
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
    selectedItem.product.productModifiers[i].modifier.show = !selectedItem
      .product.productModifiers[i].modifier.show;
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
              >
                <a
                  className="title-modifier"
                  onClick={() => this.addItemIsYesNo(data)}
                >
                  <input
                    type="radio"
                    checked={data.isSelected ? true : false}
                    class="scaled-checkbox form-check-input checkbox-modifier"
                    onClick={() => this.addItemIsYesNo(data)}
                  />

                  <span className="subtitle-modifier">{data.name}</span>
                </a>
                {data.orderingStatus === "UNAVAILABLE" ? (
                  <p>UNAVAILABLE</p>
                ) : (
                    <p>{this.getCurrency(data.price)}</p>
                  )}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  };

  detailProduct = () => {
    let { disableButton, selectedItem } = this.state;
    let { defaultOutlet, data } = this.props;
    if (data) {
      defaultOutlet = data.storeDetail;
    }
    return (
      <div
        className="modal-content"
        style={{ width: "100%", height: "90vh", bottom: 0, zIndex: 10 }}
      >
        {/* <div className="modal-content modal-content-product modal-product" style={{ width: "100%" }}> */}
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
            className="close close-modal btn-close-modal-product"
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
          >
            <i className="fa fa-times" style={{ color: "#FFF" }}></i>
          </button>
        </div>
        <div className="modal-body modal-body-product">
          {!isEmptyObject(selectedItem) ? (
            <>
              <div className="col-md-5 col-sm-12" style={{ marginBottom: 15 }}>
                <center>
                  <img
                    className="detail-image attachment-pizzaro-product-list-fw-col-1 size-pizzaro-product-list-fw-col-1"
                    src={this.renderImageProduct(selectedItem)}
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
                {selectedItem.product.productModifiers &&
                  selectedItem.product.productModifiers.map((item, i) => {
                    if (
                      item.modifier.isYesNo !== true &&
                      (item.modifier.max == 0 ||
                        item.modifier.max === undefined ||
                        item.modifier.max > 1 ||
                        item.modifier.max == "-")
                    ) {
                      return this.renderItemCheckbox(item, i);
                    } else if (
                      item.modifier.isYesNo !== true &&
                      item.modifier.max == 1
                    ) {
                      return this.renderItemRadio(item, i);
                    } else {
                      return this.renderItemIsYesNo(item, i);
                    }
                  })}
              </div>
              {defaultOutlet.enableItemSpecialInstructions ? (
                <div className="col-md-12">
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
              {/* <div style={{ marginBottom: 100 }} /> */}
            </>
          ) : null}
        </div>
        <div
          className="pizzaro-handheld-footer-bar"
          style={{
            display: "flex",
            justifyContent: "center",
            backgroundColor: "#FFF",
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
              <b style={{ fontSize: 20, color: "#FFF" }}>-</b>
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
              <b style={{ fontSize: 20, color: "#FFF" }}>+</b>
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
                  <b style={{ color: "#FFF" }}>{`${selectedItem.quantity === 0 ? "Remove" : "Update"
                    } ${this.props.companyInfo &&
                    this.props.companyInfo.currency.code
                    } ${this.calculateTotal()}`}</b>
                </button>
              ) : (
                  <button
                    disabled={disableButton}
                    className="btn btn-block btn-footer"
                    onClick={this.processCart}
                  >
                    <b style={{ color: "#FFF" }}>
                      Add{" "}
                      {`${this.props.companyInfo &&
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
                  <b style={{ color: "#FFF" }}>Loading...</b>
                </button>
              )}
          </div>
        </div>
      </div>
    );
  };

  setOrderingMode = (mode) => {
    localStorage.setItem(`${config.prefix}_ordering_mode`, mode);
    try {
      document.getElementById("dismiss-ordering-mode").click();
      // document.getElementById('open-modal-product').click();
    } catch (error) { }
  };

  modalOrderingMode = () => {
    const { defaultOutlet } = this.props;
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
          style={{ justifyContent: "center", width: "50%" }}
        >
          <div className="modal-content modal-ordering-mode">
            <div
              className="modal-header modal-header-product"
              style={{ display: "flex", justifyContent: "center", padding: 7 }}
            >
              <h5 style={{ fontSize: 16, marginTop: 10 }} className="color">
                Select your dining preference
              </h5>
            </div>
            <div className="modal-body">
              <div className="col-md-12">
                <div style={{ justifyContent: "center" }} >
                  {defaultOutlet.enableDineIn === true && (
                    <div
                      className="order-mode"
                      onClick={() => this.setOrderingMode("DINEIN")}
                      style={{
                        height: (defaultOutlet.orderValidation.dineIn.minAmount ? 80 : 50), alignItems: "center", justifyContent: "center",
                        padding: 5
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "row", marginTop: 5, alignItems: "center", justifyContent: "center" }}>
                        <i className="fa fa-cutlery color icon-order" style={{ marginTop: 0, marginRight: 5, fontSize: 20 }}></i>
                        <div className="color" style={{ fontWeight: "bold", fontSize: 14 }}>
                          DINEIN
                        </div>
                      </div>
                      {
                        defaultOutlet.orderValidation.dineIn &&
                        <div style={{ fontSize: 12, marginTop: -5 }}>
                          <div style={{ height: 1, width: "100%", backgroundColor: "#CDCDCD", marginTop: 5 }} />
                          {defaultOutlet.orderValidation.dineIn.minAmount ||
                            defaultOutlet.orderValidation.dineIn.maxAmount ? (
                              <div style={{ display: "flex" }}>
                                <strong style={{ marginRight: 5 }}>Amount range</strong>
                                {
                                  `${this.getCurrency(defaultOutlet.orderValidation.dineIn.minAmount)} to 
                                  ${this.getCurrency(defaultOutlet.orderValidation.dineIn.maxAmount)}`
                                }
                              </div>
                            ) : null}
                          {defaultOutlet.orderValidation.dineIn.minQty ||
                            defaultOutlet.orderValidation.dineIn.maxQty ? (
                              <div style={{ display: "flex", marginTop: -10 }}>
                                <strong style={{ marginRight: 5 }}>Item quantity range</strong>
                                {defaultOutlet.orderValidation.dineIn.minQty} to{" "}
                                {defaultOutlet.orderValidation.dineIn.maxQty} items
                              </div>
                            ) : null}
                        </div>
                      }
                    </div>
                  )}

                  {defaultOutlet.enableTakeAway === true && (
                    <div
                      className="order-mode"
                      onClick={() => this.setOrderingMode("TAKEAWAY")}
                      style={{
                        height: (defaultOutlet.orderValidation.takeAway.minAmount ? 80 : 50), alignItems: "center", justifyContent: "center",
                        padding: 5
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "row", marginTop: 5, alignItems: "center", justifyContent: "center" }}>
                        <i className="fa fa-shopping-basket color icon-order" style={{ marginTop: 0, marginRight: 5, fontSize: 20 }}></i>
                        <div className="color" style={{ fontWeight: "bold", fontSize: 14 }}>
                          TAKEAWAY
                        </div>
                      </div>
                      {
                        defaultOutlet.orderValidation.takeAway &&
                        <div style={{ fontSize: 12, marginTop: -5 }}>
                          <div style={{ height: 1, width: "100%", backgroundColor: "#CDCDCD", marginTop: 5 }} />
                          {defaultOutlet.orderValidation.takeAway.minAmount ||
                            defaultOutlet.orderValidation.takeAway.maxAmount ? (
                              <div style={{ display: "flex" }}>
                                <strong style={{ marginRight: 5 }}>Amount range</strong>
                                {
                                  `${this.getCurrency(defaultOutlet.orderValidation.takeAway.minAmount)} to 
                                  ${this.getCurrency(defaultOutlet.orderValidation.takeAway.maxAmount)}`
                                }
                              </div>
                            ) : null}
                          {defaultOutlet.orderValidation.takeAway.minQty ||
                            defaultOutlet.orderValidation.takeAway.maxQty ? (
                              <div style={{ display: "flex", marginTop: -10 }}>
                                <strong style={{ marginRight: 5 }}>Item quantity range</strong>
                                {defaultOutlet.orderValidation.takeAway.minQty} to{" "}
                                {defaultOutlet.orderValidation.takeAway.maxQty} items
                              </div>
                            ) : null}
                        </div>
                      }
                    </div>
                  )}

                  {defaultOutlet.enableStorePickUp === true && (
                    <div
                      className="order-mode"
                      onClick={() => this.setOrderingMode("STOREPICKUP")}
                      style={{
                        height: (defaultOutlet.orderValidation.storepickup.minAmount ? 80 : 50), alignItems: "center", justifyContent: "center",
                        padding: 5
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "row", marginTop: 5, alignItems: "center", justifyContent: "center" }}>
                        <i className="fa fa-shopping-basket color icon-order" style={{ marginTop: 0, marginRight: 5, fontSize: 20 }}></i>
                        <div className="color" style={{ fontWeight: "bold", fontSize: 14 }}>
                          STOREPICKUP
                      </div>
                      </div>
                      {
                        defaultOutlet.orderValidation.storepickup &&
                        <div style={{ fontSize: 12, marginTop: -5 }}>
                          <div style={{ height: 1, width: "100%", backgroundColor: "#CDCDCD", marginTop: 5 }} />
                          {defaultOutlet.orderValidation.storepickup.minAmount ||
                            defaultOutlet.orderValidation.storepickup.maxAmount ? (
                              <div style={{ display: "flex" }}>
                                <strong style={{ marginRight: 5 }}>Amount range</strong>
                                {
                                  `${this.getCurrency(defaultOutlet.orderValidation.storepickup.minAmount)} to 
                                  ${this.getCurrency(defaultOutlet.orderValidation.storepickup.maxAmount)}`
                                }
                              </div>
                            ) : null}
                          {defaultOutlet.orderValidation.storepickup.minQty ||
                            defaultOutlet.orderValidation.storepickup.maxQty ? (
                              <div style={{ display: "flex", marginTop: -10 }}>
                                <strong style={{ marginRight: 5 }}>Item quantity range</strong>
                                {defaultOutlet.orderValidation.storepickup.minQty} to{" "}
                                {defaultOutlet.orderValidation.storepickup.maxQty} items
                              </div>
                            ) : null}
                        </div>
                      }
                    </div>
                  )}

                  {defaultOutlet.enableStoreCheckOut === true && (
                    <div
                      className="order-mode"
                      onClick={() => this.setOrderingMode("STORECHECKOUT")}
                      style={{
                        height: (defaultOutlet.orderValidation.storecheckout.minAmount ? 80 : 50), alignItems: "center", justifyContent: "center",
                        padding: 5
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "row", marginTop: 5, alignItems: "center", justifyContent: "center" }}>
                        <i className="fa fa-shopping-basket color icon-order" style={{ marginTop: 0, marginRight: 5, fontSize: 20 }}></i>
                        <div className="color" style={{ fontWeight: "bold", fontSize: 14 }}>
                          STORECHECKOUT
                        </div>
                      </div>
                      {
                        defaultOutlet.orderValidation.storecheckout &&
                        <div style={{ fontSize: 12, marginTop: -5 }}>
                          <div style={{ height: 1, width: "100%", backgroundColor: "#CDCDCD", marginTop: 5 }} />
                          {defaultOutlet.orderValidation.storecheckout.minAmount ||
                            defaultOutlet.orderValidation.storecheckout.maxAmount ? (
                              <div style={{ display: "flex" }}>
                                <strong style={{ marginRight: 5 }}>Amount range</strong>
                                {
                                  `${this.getCurrency(defaultOutlet.orderValidation.storecheckout.minAmount)} to 
                                  ${this.getCurrency(defaultOutlet.orderValidation.storecheckout.maxAmount)}`
                                }
                              </div>
                            ) : null}
                          {defaultOutlet.orderValidation.storecheckout.minQty ||
                            defaultOutlet.orderValidation.storecheckout.maxQty ? (
                              <div style={{ display: "flex", marginTop: -10 }}>
                                <strong style={{ marginRight: 5 }}>Item quantity range</strong>
                                {defaultOutlet.orderValidation.storecheckout.minQty} to{" "}
                                {defaultOutlet.orderValidation.storecheckout.maxQty} items
                              </div>
                            ) : null}
                        </div>
                      }
                    </div>
                  )}

                  {defaultOutlet.enableDelivery === true && (
                    <div
                      className="order-mode"
                      onClick={() => this.setOrderingMode("DELIVERY")}
                      style={{
                        height: (defaultOutlet.orderValidation.delivery.minAmount ? 80 : 50), alignItems: "center", justifyContent: "center",
                        padding: 5
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "row", marginTop: 5, alignItems: "center", justifyContent: "center" }}>
                        <i className="fa fa-car color icon-order" style={{ marginTop: 0, marginRight: 5, fontSize: 20 }}></i>
                        <div className="color" style={{ fontWeight: "bold", fontSize: 14 }}>
                          DELIVERY
                      </div>
                      </div>
                      {
                        defaultOutlet.orderValidation.delivery &&
                        <div style={{ fontSize: 12, marginTop: -5 }}>
                          <div style={{ height: 1, width: "100%", backgroundColor: "#CDCDCD", marginTop: 5 }} />
                          {defaultOutlet.orderValidation.delivery.minAmount ||
                            defaultOutlet.orderValidation.delivery.maxAmount ? (
                              <div style={{ display: "flex" }}>
                                <strong style={{ marginRight: 5 }}>Amount range</strong>
                                {
                                  `${this.getCurrency(defaultOutlet.orderValidation.delivery.minAmount)} to 
                                  ${this.getCurrency(defaultOutlet.orderValidation.delivery.maxAmount)}`
                                }
                              </div>
                            ) : null}
                          {defaultOutlet.orderValidation.delivery.minQty ||
                            defaultOutlet.orderValidation.delivery.maxQty ? (
                              <div style={{ display: "flex", marginTop: -10 }}>
                                <strong style={{ marginRight: 5 }}>Item quantity range</strong>
                                {defaultOutlet.orderValidation.delivery.minQty} to{" "}
                                {defaultOutlet.orderValidation.delivery.maxQty} items
                              </div>
                            ) : null}
                        </div>
                      }
                    </div>
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

  // increaseModifier = () => {
  //   this.setState((prevState) => ({
  //     selectedModifier: {
  //       ...prevState.selectedModifier,
  //       quantity: prevState.selectedModifier.quantity + 1,
  //     },
  //   }));
  // };

  // decreaseModifier = () => {
  //   const { selectedModifier } = this.state;
  //   if (
  //     selectedModifier.quantity !== undefined &&
  //     selectedModifier.quantity > 0
  //   ) {
  //     this.setState((prevState) => ({
  //       selectedModifier: {
  //         ...prevState.selectedModifier,
  //         quantity: prevState.selectedModifier.quantity - 1,
  //       },
  //     }));
  //   }
  // };

  increaseModifier = () => {
    let { selectedModifier } = this.state;
    selectedModifier.quantity += 1;
    this.setState({ selectedModifier });
  };

  decreaseModifier = () => {
    let { selectedModifier } = this.state;
    if (
      selectedModifier.quantity != undefined &&
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
                    <b style={{ fontSize: 20 }}>-</b>
                  </button>
                  <div>
                    <b style={{ fontSize: 20 }}>{selectedModifier.quantity}</b>
                  </div>
                  <button
                    className="btn"
                    style={{ marginRight: -10, minWidth: 40 }}
                    onClick={this.increaseModifier}
                  >
                    <b style={{ fontSize: 20 }}>+</b>
                  </button>
                </div>
                {selectedModifier.quantity == 0 ? (
                  <button
                    id="dismiss-ordering-mode"
                    data-dismiss="modal"
                    className="btn btn-block btn-danger"
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
                      className="btn btn-block btn-footer"
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
    let { showPage, isLoading, message } = this.state;
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
        {isLoading ? Swal.showLoading() : Swal.close()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    basket: state.order.basket,
    defaultOutlet: config.getValidation(state.outlet.defaultOutlet),
    color: state.theme.color,
    companyInfo: state.masterdata.companyInfo.data,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalProduct);
