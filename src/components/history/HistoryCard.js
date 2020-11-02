import React, { Component } from "react";
import { connect } from "react-redux";
import ShoppingBasketIcon from "@material-ui/icons/ShoppingBasket";
import moment from "moment";

class InboxCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingShow: true,
      isLoading: false,
    };
  }

  getCurrency = (price) => {
    if (this.props.companyInfo) {
      if (price !== undefined) {
        const { currency } = this.props.companyInfo;
        if (!price || price === "-") price = 0;
        let result = price.toLocaleString(currency.locale, {
          style: "currency",
          currency: currency.code,
        });
        return result;
      }
    }
  };

  checkNameOutlet(outletName) {
    let nameSplit = outletName.split(" ")
    let nameMerge = ""
    nameSplit.forEach(element => {
      if (`${nameMerge} ${element}`.length > 20) return
      nameMerge = `${nameMerge} ${element}`
    });
    return nameMerge
  }

  render() {
    const { items } = this.props;
    let discount = 0
    if(items.payments){
      items.payments.forEach(items => {
        if(items.paymentType === "voucher" || items.paymentType === "point"){
          discount += items.paymentAmount
        }
      });
    }

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          boxShadow: "1px 2px 5px rgba(128, 128, 128, 0.5)",
          padding: 10,
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: 5,
          marginBottom: 10,
          cursor: "pointer",
          backgroundColor: "#FFF",
          height: 80,
        }}
      >
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <ShoppingBasketIcon
              className="border-theme"
              style={{
                fontSize: 50,
                borderRadius: 5,
                padding: 5,
              }}
            />
            <div style={{ marginLeft: 10, textAlign: "left" }}>
              <div
                className="modal-title"
                style={{ fontWeight: "bold", fontSize: 14, lineHeight: "17px" }}
              >
                {items.outlet && this.checkNameOutlet(items.outlet.name)}
              </div>
              <div style={{ fontWeight: "bold", fontSize: 14 }}>
                {this.getCurrency(items.price + (items.deliveryFee || 0) - discount)}
              </div>
            </div>
          </div>
          <div>
            <div
              className="modal-title"
              style={{ fontWeight: "bold", fontSize: 14, textAlign: "right" }}
            >
              {items.point > 0 ? items.point + " points" : null}
            </div>
            <div
              style={{
                color: "gray",
                fontSize: 10,
                textAlign: "right",
                marginTop: 10,
                fontStyle: "italic",
              }}
            >
              {moment(items.salesDate).format("DD/MM/YY HH:mm")}
            </div>
          </div>
        </>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    companyInfo: state.masterdata.companyInfo.data,
  };
};

export default connect(mapStateToProps, {})(InboxCard);
