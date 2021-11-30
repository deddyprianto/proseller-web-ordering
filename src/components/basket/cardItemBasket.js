import React, { Component } from "react";
import { connect } from "react-redux";
import Typography from "@mui/material/Typography";
import { isEmptyData } from "../../helpers/CheckEmpty";
import config from "../../config";

const activeCard = { width: "100%", display: "flex", cursor: "pointer" };
const inactiveCard = {
  width: "100%",
  display: "flex",
  cursor: "pointer",
  opacity: 0.5,
};

class CardItemBasket extends Component {
  renderImageProduct = (item) => {
    const { color } = this.props;
    if (
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

  isAvailableToOrder = (item) => {
    try {
      if (item && item.orderingStatus === "UNAVAILABLE") {
        return (
          <i style={{ fontSize: 11, color: "red" }}>
            Unavailable on {item.orderModeName} Order
          </i>
        );
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  render() {
    let item = this.props.data;
    return (
      <div
        style={
          item.orderingStatus === "UNAVAILABLE" ? inactiveCard : activeCard
        }
        onClick={() => !this.props.roleBtnClear && this.props.openModal(item)}
      >
        <img
          src={this.renderImageProduct(item)}
          style={{
            marginRight: 10,
            borderRadius: 5,
          }}
          className="attachment-pizzaro-product-list-fw-col-1 size-pizzaro-product-list-fw-col-1 image-product"
          alt={item.product.name}
          title={item.product.name}
        />
        <div style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 5,
            }}
          >
            <Typography style={{ lineHeight: "15px", textAlign: "left" }}>
              <span
                className="customer-group-name"
                style={{ marginRight: 5, fontSize: 12, fontWeight: "bold" }}
              >
                {`${item.quantity}x`}
              </span>
              <span style={{ fontSize: 12, fontWeight: "bold" }}>
                {`${item.product.name} (${this.props.getCurrency(
                  Number(item.product.retailPrice)
                )})`}
              </span>
            </Typography>
          </div>
          {item.modifiers && item.modifiers.length > 0 && (
            <div
              className="font-color-theme"
              style={{ textAlign: "left", marginTop: -10 }}
            >
              <div style={{ fontSize: 10, fontStyle: "italic" }}>Add On:</div>
              <div style={{ marginLeft: -23, marginTop: -5 }}>
                {item.modifiers.map((modifier, keyModifier) => (
                  <div key={keyModifier} style={{ marginLeft: 30 }}>
                    {modifier.modifier &&
                      modifier.modifier.details &&
                      modifier.modifier.details.length > 0 &&
                      modifier.modifier.details.map(
                        (itemModifier, keyItem) =>
                          itemModifier.quantity &&
                          itemModifier.quantity > 0 && (
                            <dev key={keyItem}>
                              <Typography
                                style={{
                                  lineHeight: "15px",
                                  textAlign: "left",
                                  marginLeft: -5,
                                  paddingTop: -50,
                                }}
                              >
                                <span
                                  className="color-active"
                                  style={{
                                    marginRight: 3,
                                    fontStyle: "italic",
                                    fontSize: 10,
                                  }}
                                >
                                  {`${itemModifier.quantity}x`}
                                </span>
                                <span
                                  style={{ fontSize: 10, fontStyle: "italic" }}
                                >
                                  {`${
                                    itemModifier.name
                                  } (${this.props.getCurrency(
                                    Number(itemModifier.price)
                                  )})`}
                                </span>
                              </Typography>
                            </dev>
                          )
                      )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* POSSIBLE PROMOTION INFO */}
          {item.promotions &&
            item.promotions.length > 0 &&
            item.promotions.map((promo) => (
              <div style={{ marginTop: 10 }}>
                {promo.isPromotionApplied === true ||
                item.amountAfterDisc < item.grossAmount ? (
                  <Typography style={{ lineHeight: "15px", textAlign: "left" }}>
                    <p
                      className={`customer-group-name`}
                      style={{
                        fontSize: 12,
                        width: 5,
                        float: "left",
                        marginRight: 10,
                      }}
                    >
                      <i className="fa fa-tags" />
                    </p>
                    <p
                      className={`customer-group-name`}
                      style={{
                        marginRight: 5,
                        fontSize: 12,
                        fontStyle: "italic",
                        fontWeight: "bold",
                      }}
                    >
                      {promo.name}
                    </p>
                  </Typography>
                ) : (
                  <Typography style={{ lineHeight: "15px", textAlign: "left" }}>
                    <p
                      className={`font-color-theme`}
                      style={{
                        fontSize: 11,
                        width: 5,
                        float: "left",
                        marginRight: 10,
                      }}
                    >
                      <i className="fa fa-tags" />
                    </p>
                    <p
                      className={`font-color-theme`}
                      style={{
                        marginRight: 5,
                        fontSize: 11,
                        fontStyle: "italic",
                      }}
                    >
                      {promo.name}
                    </p>
                  </Typography>
                )}
              </div>
            ))}
          {/* POSSIBLE PROMOTION INFO */}

          {item.remark && item.remark !== "-" && (
            <div
              className="font-color-theme"
              style={{
                display: "flex",
                marginLeft: -5,
                marginTop: -5,
                marginBottom: -10,
              }}
            >
              <div
                style={{
                  fontStyle: "italic",
                  fontSize: 10,
                  textAlign: "justify",
                  marginLeft: 5,
                }}
              >{`Note:`}</div>
              <div
                style={{
                  fontStyle: "italic",
                  fontSize: 10,
                  textAlign: "justify",
                  marginLeft: 5,
                }}
              >
                {item.remark}
              </div>
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div
              className="customer-group-name"
              style={{
                textAlign: "left",
                fontSize: 12,
                fontWeight: "bold",
              }}
            >
              {item.grossAmount !== item.nettAmount &&
              item.grossAmount > item.nettAmount ? (
                <div>
                  <span>
                    {this.props.getCurrency(Number(item.nettAmount.toFixed(2)))}
                  </span>
                  <span
                    style={{ textDecoration: "line-through", marginLeft: 8 }}
                  >
                    {this.props.getCurrency(
                      Number(item.grossAmount.toFixed(2))
                    )}
                  </span>
                </div>
              ) : (
                <span>
                  {this.props.getCurrency(Number(item.grossAmount.toFixed(2)))}
                </span>
              )}
            </div>
            {this.props.dataBasket &&
              this.props.dataBasket.status === "PENDING" && (
                <button
                  className="customer-group-name"
                  style={{
                    fontSize: 12,
                    padding: 0,
                    margin: 0,
                    backgroundColor: "transparent",
                  }}
                >
                  <i className="fa fa-pencil-square-o" aria-hidden="true" />{" "}
                  Edit
                </button>
              )}
          </div>
          {this.isAvailableToOrder(item)}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    companyInfo: state.masterdata.companyInfo.data,
  };
};

export default connect(mapStateToProps, {})(CardItemBasket);
