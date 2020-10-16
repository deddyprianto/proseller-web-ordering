import React, { Component } from "react";
import { connect } from "react-redux";

class ModalOrderingMode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEmenu: window.location.pathname.includes("emenu"),
    };
  }

  checkOrderValidation(validation, type) {
    if (type === "titleAmount") {
      if (validation.minAmount === 0 && validation.maxAmount > 0) {
        return "Amount maximum"
      } else if (validation.minAmount > 0 && validation.maxAmount === 0) {
        return "Amount minimum"
      } else {
        return "Amount range"
      }
    } else if (type === "descAmount") {
      if (validation.minAmount === 0 && validation.maxAmount > 0) {
        return this.props.getCurrency(validation.maxAmount)
      } else if (validation.minAmount > 0 && validation.maxAmount === 0) {
        return this.props.getCurrency(validation.minAmount)
      } else {
        return `${this.props.getCurrency(validation.minAmount)} to ${this.props.getCurrency(validation.maxAmount)}`
      }
    } else if (type === "titleQty") {
      if (validation.minQty === 0 && validation.maxQty > 0) {
        return "Item quantity maximum"
      } else if (validation.minQty > 0 && validation.maxQty === 0) {
        return "Item quantity minimum"
      } else {
        return "Item quantity range"
      }
    } else if (type === "descQty") {
      if (validation.minQty === 0 && validation.maxQty > 0) {
        return `${validation.maxQty} items`
      } else if (validation.minQty > 0 && validation.maxQty === 0) {
        return `${validation.minQty} items`
      } else {
        return `${validation.minQty} to ${validation.maxQty} items`
      }
    }
  }

  viewCartOrderingMode(name, orderValidation, icon, nickname){
    let orderingMode = this.props.data.orderingMode
    orderValidation.minQty = orderValidation.minQty || 0
    orderValidation.maxQty = orderValidation.maxQty || 0
    orderValidation.minAmount = orderValidation.minAmount || 0
    orderValidation.maxAmount = orderValidation.maxAmount || 0

    if(!nickname || nickname && nickname === "") nickname = false
    
    return (
      <div
        className={`order-mode ${orderingMode === name && "border-ordering-mode"}`}
        data-dismiss="modal"
        onClick={() => this.props.setOrderingMode(name)}
        style={{
          height: (orderValidation.minAmount ? 80 : 50), alignItems: "center", 
          justifyContent: "center", padding: 5,
        }}
      >
        <div style={{ display: "flex", flexDirection: "row", marginTop: 5, alignItems: "center", justifyContent: "center" }}>
          <i className={`fa ${icon} color icon-order`} style={{ marginTop: 0, marginRight: 5, fontSize: 20 }}></i>
          <div className="color" style={{ fontWeight: "bold", fontSize: 14 }}>
            {nickname || name}
          </div>
        </div>
        {
          orderValidation &&
          <div style={{ fontSize: 12, marginTop: -5 }}>
            <div style={{ height: 1, width: "100%", backgroundColor: "#CDCDCD", marginTop: 5 }} />
            {orderValidation.minAmount ||
              orderValidation.maxAmount ? (
                <div style={{ display: "flex" }}>
                  <strong style={{ marginRight: 5 }}>
                    {this.checkOrderValidation(orderValidation, "titleAmount")}
                  </strong>
                  {this.checkOrderValidation(orderValidation, "descAmount")}
                </div>
              ) : null}
            {orderValidation.minQty ||
              orderValidation.maxQty ? (
                <div style={{ display: "flex", marginTop: -10 }}>
                  <strong style={{ marginRight: 5 }}>
                    {this.checkOrderValidation(orderValidation, "titleQty")}
                  </strong>
                  {this.checkOrderValidation(orderValidation, "descQty")}
                </div>
              ) : null}
          </div>
        }
      </div>
    )
  }

  render() {
    let props = this.props.data;
    const { outlet } = this.props;
    return (
      <div
        className="modal fade"
        id="ordering-mode-basket-modal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-product modal-dialog-centered modal-full"
          role="document"
          style={{ justifyContent: "center", width: "100%" }}
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
                <div style={{ justifyContent: "center" }}>
                {
                    props.storeDetail.enableDineIn === true && 
                    this.viewCartOrderingMode("DINEIN", outlet.orderValidation.dineIn, "fa-cutlery", outlet.dineInName)
                  }
                  {
                    props.storeDetail.enableTakeAway === true && 
                    this.viewCartOrderingMode("TAKEAWAY", outlet.orderValidation.takeAway, "fa-shopping-basket", outlet.takeAwayName)
                  }
                  {
                    props.storeDetail.enableStorePickUp === true && 
                    this.viewCartOrderingMode("STOREPICKUP", outlet.orderValidation.storepickup, "fa-shopping-basket")
                  }
                  {
                    props.storeDetail.enableStoreCheckOut === true && 
                    this.viewCartOrderingMode("STORECHECKOUT", outlet.orderValidation.storecheckout, "fa-shopping-basket")
                  }
                  {
                    props.storeDetail.enableDelivery === true && 
                    this.viewCartOrderingMode("DELIVERY", outlet.orderValidation.delivery, "fa-car", outlet.deliveryName)
                  }
                </div>
                <p
                  id="dismiss-ordering-mode-basket-modal"
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
  }
}

const mapStateToProps = (state) => {
  return {
    outlet: state.outlet.defaultOutlet,
    companyInfo: state.masterdata.companyInfo,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalOrderingMode);
