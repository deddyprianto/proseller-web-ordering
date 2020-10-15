import React, { Component } from "react";
import ModalProduct from "../ordering/ModalProduct";
import { isEmptyObject, isEmptyArray } from "../../helpers/CheckEmpty";
import CardItemBasket from "./cardItemBasket";
import { Link } from "react-router-dom";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";

const Swal = require("sweetalert2");

export default class ItemsBasket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: {},
      isLoading: false,
      dataBasket: null,
      isNewUpdate: true,
    };
  }

  selectProduct = async (productSelected, mode) => {
    let props = this.props.data;

    productSelected = JSON.parse(JSON.stringify(productSelected));
    let dataBasket = JSON.parse(JSON.stringify(props.dataBasket));
    let storeDetail = JSON.parse(JSON.stringify(props.storeDetail));

    if (storeDetail && storeDetail.product) {
      storeDetail.product.forEach((group) => {
        group.items.forEach((product) => {
          if (product.productID === productSelected.productID) {
            productSelected = product;
          }
        });
      });
    }

    let product = JSON.stringify(productSelected);
    product = JSON.parse(product);

    try {
      await product.product.productModifiers.map((group, i) => {
        if (!isEmptyArray(group.modifier.details))
          group.modifier.details.map((detail, j) => {
            delete detail.quantity;

            if (group.modifier.min != 0 && group.modifier.min != undefined) {
              product.product.productModifiers[i].modifier.show = true;
            } else {
              product.product.productModifiers[i].modifier.show = false;
            }

            if (
              group.modifier.isYesNo == true &&
              detail.orderingStatus == "AVAILABLE"
            ) {
              if (
                group.modifier.yesNoDefaultValue == true &&
                detail.yesNoValue == "no"
              ) {
                product.product.productModifiers[i].modifier.details[
                  j
                ].isSelected = false;
              }

              if (
                group.modifier.yesNoDefaultValue == false &&
                detail.yesNoValue == "yes"
              ) {
                product.product.productModifiers[i].modifier.details[
                  j
                ].isSelected = true;
              }
            }
          });
      });
    } catch (e) {}

    if (isEmptyObject(dataBasket)) {
      product.quantity = 1;
      product.remark = "";
    } else {
      if (!isEmptyArray(dataBasket.details)) {
        const find = await dataBasket.details.find(
          (data) => data.product.id == product.product.id
        );
        if (find != undefined) {
          await this.setState({ selectedItem: {} });
          if (mode === "Update") {
            product.quantity = find.quantity;
            product.remark = find.remark;
            // fill the modifier
            if (!isEmptyArray(find.modifiers)) {
              product.product.productModifiers &&
                product.product.productModifiers.map((group, i) => {
                  group.modifier.details.map((detail, j) => {
                    find.modifiers.map((data) => {
                      data.modifier.details.map((item) => {
                        // make mark that item is in basket
                        if (data.modifierID == group.modifierID) {
                          product.product.productModifiers[
                            i
                          ].postToServer = true;
                          // set quantity basket to product that openend
                          if (item.id == detail.id) {
                            // check for radio button
                            if (group.modifier.max == 1) {
                              product.product.productModifiers[
                                i
                              ].modifier.show = data.modifier.show;
                            }
                            product.product.productModifiers[
                              i
                            ].modifier.details[j].quantity = item.quantity;
                            // for is selected
                            product.product.productModifiers[
                              i
                            ].modifier.details[j].isSelected = item.isSelected;
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
    product = JSON.parse(JSON.stringify(product));
    await this.setState({ selectedItem: product });
  };

  openModal = (item) => {
    let props = this.props.data;
    if (props.storeDetail && props.storeDetail.product) {
      this.selectProduct(item, "Update");
      document.getElementById("detail-product-btn").click();
    } else {
      if (props.storeDetail && props.storeDetail.product) {
        this.selectProduct(item, "Update");
        document.getElementById("detail-product-btn").click();
      }
    }
  };

  handleSelect = (key, items, isAll = null) => {
    let { dataBasket } = this.state;
    if (!isAll) {
      if (items.selected === false) items.selected = true;
      else items.selected = false;
      dataBasket.details[key] = items;
    } else {
      dataBasket.details.forEach((items) => {
        if (items.selected === false) items.selected = true;
        else items.selected = false;
      });
    }
    this.setState({ dataBasket });
  };

  componentDidMount = () => {
    this.setState({ dataBasket: this.props.dataBasket });
  };

  render() {
    let { data } = this.props;
    let { dataBasket } = this.state;
    let selected = 0;
    if (dataBasket && dataBasket.details && dataBasket.details.length > 0) {
      dataBasket.details.forEach((items) => {
        if (items.selected !== false) selected += 1;
      });
    }
    return (
      <div style={{ marginBottom: 20, marginTop: 5 }}>
        <ModalProduct
          selectedItem={this.state.selectedItem}
          data={data}
          handleSetState={(field, value) =>
            this.props.handleSetState(field, value)
          }
        />
        {dataBasket && dataBasket.details && dataBasket.details.length > 0 && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 14,
              }}
            >
              <div style={{ fontWeight: "bold", color: "#20a8d8" }}>
                {" "}
                {data.storeDetail.name}{" "}
              </div>
            </div>
            <div
              style={{
                backgroundColor: "#DCDCDC",
                height: 3,
                marginBottom: 10,
                marginTop: 10,
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 14,
                marginTop: 5,
              }}
            >
              <div
                style={{
                  display: "flex",
                  marginLeft: -8,
                  alignItems: "center",
                }}
              >
                <input
                  type="checkbox"
                  style={{ marginTop: -1 }}
                  checked={selected === dataBasket.details.length}
                  onClick={() => this.handleSelect(null, null, true)}
                  className="scaled-checkbox form-check-input checkbox-modifier"
                />
                <div style={{ marginLeft: 10 }}>Select All Items</div>
              </div>

              <div
                onClick={() =>
                  !this.props.roleBtnClear && this.props.handleClear(dataBasket)
                }
                style={{
                  fontWeight: "bold",
                  cursor: "pointer",
                  color: "#20a8d8",
                  border: "1px solid #20a8d8",
                  borderRadius: 5,
                  width: 100,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: this.props.roleBtnClear && "#CDCDCD",
                }}
              >
                <DeleteIcon /> Delete
              </div>
            </div>
            <div
              style={{
                backgroundColor: "#DCDCDC",
                height: 3,
                marginBottom: 10,
                marginTop: 10,
              }}
            />
            {dataBasket.details.map((item, key) => (
              <div>
                <div
                  style={{
                    display: "flex",
                    marginLeft: -8,
                    alignItems: "center",
                  }}
                >
                  <input
                    type="checkbox"
                    style={{ marginTop: -1, marginRight: 10 }}
                    checked={item.selected !== false}
                    onClick={() => this.handleSelect(key, item)}
                    className="scaled-checkbox form-check-input checkbox-modifier"
                  />
                  <CardItemBasket
                    key={key}
                    data={item}
                    roleBtnClear={this.props.roleBtnClear}
                    dataBasket={dataBasket}
                    getCurrency={(price) => this.props.getCurrency(price)}
                    openModal={(item) => this.openModal(item)}
                  />
                </div>
                {/* <div style={{ display: "flex", marginLeft: 20, justifyContent: "space-between" }}>
                    <div style={{
                      color: "#20a8d8", fontSize: 12, marginLeft: 5, fontWeight: "bold",
                      cursor: "pointer"
                    }} onClick={() => this.openModal(item)}>Edit Item</div>
                    <div className="customer-group-name" style={{ fontSize: 14, fontWeight: "bold" }}>
                      {`${this.props.getCurrency(item.unitPrice * item.quantity)}`}
                    </div>
                  </div> */}
                <div
                  style={{
                    backgroundColor: "#DCDCDC",
                    height: 1,
                    marginBottom: 10,
                    marginTop: 10,
                  }}
                />
              </div>
            ))}
            <span
              data-toggle="modal"
              data-target="#detail-product-modal"
              id="detail-product-btn"
            />
          </div>
        )}
        {this.state.isLoading ? Swal.showLoading() : Swal.close()}
      </div>
    );
  }
}
