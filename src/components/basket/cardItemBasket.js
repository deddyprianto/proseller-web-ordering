import React, { Component } from "react";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import { isEmptyData } from "../../helpers/CheckEmpty";
import config from "../../config";

class CardItemBasket extends Component {
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

  render() {
    let item = this.props.data;
    return (
      <div
        style={{ width: "100%", display: "flex", cursor: "pointer" }}
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
              {this.props.getCurrency(Number(item.grossAmount.toFixed(2)))}
            </div>

            <button
              className="customer-group-name"
              style={{
                fontSize: 12,
                padding: 0,
                margin: 0,
                backgroundColor: "transparent",
              }}
            >
              <i className="fa fa-pencil-square-o" aria-hidden="true" /> Edit
            </button>
          </div>
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
