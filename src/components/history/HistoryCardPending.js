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
      if (price != undefined) {
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
              {this.checkNameOutlet(items.outlet.name)}
            </div>
            <div
              style={{
                color: "#FFF",
                backgroundColor:
                  (items.status === "PENDING" && "red") ||
                  (items.status === "SUBMITTED" && "orange") ||
                  (items.status === "CONFIRMED" && "green") ||
                  (items.status === "PROCESSING" && "green") ||
                  (items.status === "READY_FOR_COLLECTION" && "green") ||
                  (items.status === "READY_FOR_DELIVERY" && "green") ||
                  (items.status === "ON_THE_WAY" && "green") ||
                  "red",
                fontWeight: "bold",
                fontSize: 12,
                maxWidth: 170,
                paddingLeft: 10,
                paddingRight: 10,
                borderRadius: 5,
                textAlign: "center",
              }}
            >
              {items.status.replace(/_/g, " ")}
            </div>
          </div>
        </div>
        <div>
          <div
            className="modal-title"
            style={{ fontWeight: "bold", fontSize: 14, textAlign: "right", width: 65, marginTop: -20 }}
          >
            {items.details.length + " items"}
          </div>
          <div
            style={{
              color: "gray",
              fontSize: 10,
              textAlign: "right",
              marginTop: 10,
              width: "100%",
              bottom: 10, right: 20,
              position: "absolute"
            }}
          >
            {moment(items.createdOn).format("DD/MM/YY HH:mm")}
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

export default connect(mapStateToProps, {})(InboxCard);
