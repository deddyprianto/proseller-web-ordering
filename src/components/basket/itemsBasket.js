// CaseID   Name    date        description
// 0001     Troy    18/08/2021  remove checkbox | add button delete


import React, { Component } from "react";
import { connect } from "react-redux";

import ModalProduct from "../ordering/ModalProduct";
import { isEmptyObject, isEmptyArray } from "../../helpers/CheckEmpty";
import CardItemBasket from "./cardItemBasket";
import { Link } from "react-router-dom";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import CheckBox from "../setting/checkBoxCostume";
import AddNotes from "./AddNotes";
// import config from "../../config";
// const Swal = require("sweetalert2");
// const encryptor = require("simple-encryptor")(process.env.REACT_APP_KEY_DATA);

class ItemsBasket extends Component {
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
    const quantityItem = productSelected.quantity;
    const originalQuantity = productSelected.originalQuantity;
    const promoQuantity = productSelected.promoQuantity;
    productSelected = JSON.parse(JSON.stringify(productSelected));
    let dataBasket = JSON.parse(JSON.stringify(props.dataBasket));
    let storeDetail = JSON.parse(JSON.stringify(props.storeDetail));
    const productBackup = this.props.categories;

    try {
      storeDetail.product = productBackup;
    } catch (e) { }

    if (storeDetail && storeDetail.product) {
      storeDetail.product.forEach((group) => {
        if (group.items && group.items.length > 0) {
          group.items.forEach((product) => {
            if (product.productID === productSelected.productID) {
              product.id = productSelected.id;
              productSelected = product;
              productSelected.quantity = quantityItem;
            }
          });
        }
      });
    }

    let product = JSON.stringify(productSelected);
    product = JSON.parse(product);
    console.log(product);

    try {
      await product.product.productModifiers.forEach((group, i) => {
        if (!isEmptyArray(group.modifier.details))
          group.modifier.details.forEach((detail, j) => {
            delete detail.quantity;

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
                ].isSelected = true;
              }

              if (
                group.modifier.yesNoDefaultValue === false &&
                detail.yesNoValue === "yes"
              ) {
                product.product.productModifiers[i].modifier.details[
                  j
                ].isSelected = false;
              }
            }
          });
      });
    } catch (e) { }

    if (isEmptyObject(dataBasket)) {
      product.quantity = 1;
      product.remark = "";
    } else {
      if (!isEmptyArray(dataBasket.details)) {
        const find = await dataBasket.details.find(
          (data) => data.id === product.id
        );
        if (find !== undefined) {
          await this.setState({ selectedItem: {} });
          if (mode === "Update") {
            product.remark = find.remark;
            // fill the modifier
            if (!isEmptyArray(find.modifiers)) {
              product.product.productModifiers &&
                product.product.productModifiers.forEach((group, i) => {
                  group.modifier.details.forEach((detail, j) => {
                    find.modifiers.forEach((data) => {
                      data.modifier.details.forEach((item) => {
                        // make mark that item is in basket
                        if (data.modifierID === group.modifierID) {
                          product.product.productModifiers[
                            i
                          ].postToServer = true;
                          // set quantity basket to product that openend
                          if (item.id === detail.id) {
                            // check for radio button
                            if (group.modifier.max === 1) {
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
          product.quantity = quantityItem;
          product.remark = "";
        }
      } else {
        product.quantity = 1;
        product.remark = "";
      }
    }
    product.mode = mode;
    product = {
      ...product,
      ...(originalQuantity && {
        originalQuantity,
      }),
      ...(promoQuantity && {
        promoQuantity,
      }),
    };
    await this.setState({ selectedItem: product });
  };

  openModal = (item) => {
    let props = this.props.data;

    if (props.storeDetail && props.storeDetail.product) {
      this.selectProduct(item, "Update");
      document.getElementById("detail-product-btn").click();
    } else {
      // Swal.fire({
      //   onOpen: () => {
      //     Swal.showLoading();
      //   },
      // });
      this.selectProduct(item, "Update");
      document.getElementById("detail-product-btn").click();
      this.setState({ isLoading: false });
      // let time = setInterval(() => {
      //   if (props.storeDetail && props.storeDetail.product) {
      //     this.selectProduct(item, "Update");
      //     document.getElementById("detail-product-btn").click();
      //     Swal.close()
      //     clearInterval(time);
      //     this.setState({ isLoading: false });
      //   }
      // }, 0);
    }
  };

  handleSelect = (key, items, isAll = null) => {
    let { dataBasket } = this.state;
    if (isAll === null) {
      if (items.selected === false) items.selected = true;
      else items.selected = false;
      dataBasket.details[key] = items;
    } else {
      dataBasket.details.forEach((items) => {
        items.selected = isAll;
      });
    }
    this.setState({ dataBasket });
  };

  handleRemoveItem = async (key, items) => {
    let { dataBasket } = this.state;
    items.selected = true;
    dataBasket.details[key] = items;
    this.setState({ dataBasket: await dataBasket });
    this.props.handleClear(this.state.dataBasket);
  }

  componentDidMount = () => {
    this.setState({ dataBasket: this.props.dataBasket });
  };

  render() {
    let { data, defaultOutlet, isLoggedIn } = this.props;
    let dataBasket = this.props.dataBasket;
    // let dataBasket = this.props.basket;
    let enableNotes = false;
    if (isEmptyObject(this.props.basket)) {
      dataBasket = data.dataBasket;
    }
    let selected = 0;
    if (dataBasket && dataBasket.details && dataBasket.details.length > 0) {
      dataBasket.details.forEach((items) => {
        if (items.selected !== false) selected += 1;
      });
    }

    if (
      defaultOutlet &&
      defaultOutlet.enableOrderSpecialInstructions === true &&
      isLoggedIn
    ) {
      enableNotes = true;
    }

    // console.log(dataBasket, 'dataBasketdataBasket')

    return (
      <div style={{ marginBottom: 20, marginTop: 5 }}>
        <ModalProduct
          selectedItem={this.state.selectedItem}
          data={data}
          handleSetState={(field, value) =>
            this.props.handleSetState(field, value)
          }
        />
        <AddNotes
          dataBasket={dataBasket}
          updateCartInfo={this.props.updateCartInfo}
        />
        {dataBasket && dataBasket.details && dataBasket.details.length > 0 && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 14,
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  color: this.props.color.primary || "#c00a27",
                  textAlign: "left",
                  lineHeight: "17px",
                }}
              >
                {data.dataBasket.outlet.name}
              </div>
              <Link to="/">
                <div
                  style={{
                    fontWeight: "bold",
                    cursor: "pointer",
                    color: this.props.color.primary,
                    border: `1px solid ${this.props.color.primary}`,
                    borderRadius: 5,
                    width: 100,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AddIcon /> Add Items
                </div>
              </Link>
            </div>
            <div
              style={{
                backgroundColor: "#DCDCDC",
                height: 3,
                marginBottom: 10,
                marginTop: 10,
              }}
            />
            {/* start 0001 */}
            {/* {!isEmptyObject(dataBasket) && dataBasket.status === "PENDING" && (
              <div>
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
                      alignItems: "center",
                    }}
                  >
                    <CheckBox
                      handleChange={(status) =>
                        this.handleSelect(null, null, status)
                      }
                      selected={selected === dataBasket.details.length}
                      setRadius={5}
                      setHeight={20}
                    />
                    <div style={{ marginLeft: 10 }}>Select All Items</div>
                  </div>

                  <button
                    className="border-theme background-theme"
                    onClick={() =>
                      !this.props.roleBtnClear &&
                      this.props.handleClear(dataBasket)
                    }
                    style={{
                      fontWeight: "bold",
                      cursor: "pointer",
                      color: this.props.color.primary,
                      border: `1px solid ${this.props.color.primary}`,
                      borderRadius: 5,
                      width: 100,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: this.props.roleBtnClear && "#CDCDCD",
                    }}
                  >
                    <DeleteIcon /> Delete
                  </button>
                </div>
                <div
                  style={{
                    backgroundColor: "#DCDCDC",
                    height: 3,
                    marginBottom: 10,
                    marginTop: 10,
                  }}
                />
              </div>
            )} */}
            {/* end 0001 */}
            {!isEmptyObject(dataBasket) &&
              dataBasket.status === "PENDING" &&
              enableNotes &&
              (dataBasket.remark === undefined ||
                dataBasket.remark === "" ||
                dataBasket.remark === null) && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      fontSize: 14,
                      marginTop: 5,
                    }}
                  >
                    <button
                      className="background-theme"
                      data-toggle="modal"
                      data-target="#add-notes-modal"
                      style={{
                        fontWeight: "bold",
                        cursor: "pointer",
                        color: this.props.color.primary,
                        border: `1px solid ${this.props.color.primary}`,
                        borderRadius: 5,
                        width: 100,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: this.props.roleBtnClear && "#CDCDCD",
                      }}
                    >
                      <i
                        className="fa fa-sticky-note-o"
                        style={{ marginRight: 5 }}
                      />{" "}
                      Notes
                    </button>
                  </div>
                  <div
                    style={{
                      backgroundColor: "#DCDCDC",
                      height: 1,
                      marginBottom: 10,
                      marginTop: 10,
                    }}
                  />
                </div>
              )}
            {!isEmptyObject(dataBasket) &&
              dataBasket.status === "PENDING" &&
              enableNotes &&
              dataBasket.remark !== undefined &&
              dataBasket.remark !== "" &&
              dataBasket.remark !== null && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      fontSize: 14,
                      marginTop: 5,
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: 14,
                          lineHeight: 1,
                          textAlign: "left",
                          fontStyle: "italic",
                        }}
                      >
                        "{dataBasket.remark}"
                      </p>
                      <button
                        className="background-theme"
                        data-toggle="modal"
                        data-target="#add-notes-modal"
                        style={{
                          fontWeight: "bold",
                          cursor: "pointer",
                          color: this.props.color.primary,
                          border: `1px solid ${this.props.color.primary}`,
                          borderRadius: 5,
                          width: 100,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: this.props.roleBtnClear && "#CDCDCD",
                        }}
                      >
                        <i
                          className="fa fa-sticky-note-o"
                          style={{ marginRight: 5 }}
                        />{" "}
                        Edit Notes
                      </button>
                    </div>
                  </div>
                  <div
                    style={{
                      backgroundColor: "#DCDCDC",
                      height: 1,
                      marginBottom: 10,
                      marginTop: 10,
                    }}
                  />
                </div>
              )}
            {dataBasket.details.map((item, key) => (
              <div key={key}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {/* start 0001 */}
                  {/* {dataBasket.status === "PENDING" && (
                    <div style={{ marginRight: 8 }}>
                      <CheckBox
                        handleChange={(status) => this.handleSelect(key, item)}
                        selected={item.selected !== false}
                        setRadius={5}
                        setHeight={20}
                      />
                    </div>
                  )} */}
                  {/* end 0001 */}
                  <CardItemBasket
                    key={key}
                    color={this.props.color}
                    data={item}
                    roleBtnClear={this.props.roleBtnClear}
                    dataasket={dataBasket}
                    getCurrency={(price) => this.props.getCurrency(price)}
                    openModal={(item) => this.openModal(item)}
                  />
                  {/* start 0001 */}
                  {dataBasket.status === "PENDING" && (
                    <div style={{ marginLeft: 8 }}>
                      <button
                        className="background-theme"
                        style={{
                          fontWeight: "bold",
                          cursor: "pointer",
                          color: this.props.color.primary,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: this.props.roleBtnClear && "#CDCDCD",
                        }}
                        onClick={(status) => this.handleRemoveItem(key, item)}
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  )}
                  {/* end 0001 */}
                </div>
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
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    color: state.theme.color,
    basket: state.order.basket,
    categories: state.product.categories,
    defaultOutlet: state.outlet.defaultOutlet,
    isLoggedIn: state.auth.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(ItemsBasket);
