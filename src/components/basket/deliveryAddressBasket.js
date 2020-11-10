import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "reactstrap";
import ContactMailIcon from "@material-ui/icons/ContactMail";
import { Link } from "react-router-dom";
import config from "../../config";

class DeliveryAddressBasket extends Component {
  handleGet() {
    if (!this.props.handleOpenLogin()) return;
    localStorage.setItem(`${config.prefix}_getDeliveryAddress`, true);
  }
  render() {
    let props = this.props.data;
    return (
      <div
        style={{
          border: "1px solid #DCDCDC",
          borderRadius: 5,
          marginTop: 10,
          padding: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontWeight: "bold", fontSize: 14 }}>
            Delivery Address *
          </div>
          <div>
            <Link to={this.props.isLoggedIn && "/delivery-address"}>
              <Button
                disabled={this.props.roleBtnClear ? true : false}
                onClick={() => this.handleGet()}
                style={{
                  fontWeight: "bold",
                  cursor: "pointer",
                  backgroundColor: this.props.color.primary,
                  width: 140,
                  justifyContent: "space-between",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  fontSize: 12,
                }}
              >
                <ContactMailIcon style={{ fontSize: 16 }} />
                {!props.deliveryAddress
                  ? "Select Address"
                  : `${props.deliveryAddress.addressName.substring(0, 15)}`}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    color: state.theme.color,
  };
};

export default connect(mapStateToProps, {})(DeliveryAddressBasket);
