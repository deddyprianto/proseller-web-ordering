import React, { Component } from 'react';
import { Button } from 'reactstrap';
import CreditCard from "@material-ui/icons/CreditCard";
import { Link } from 'react-router-dom';
import config from '../../config';

export default class PaymentMethodBasket extends Component {
  render() {
    let props = this.props.data
    return (
      <div style={{ padding: 10 }}>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <div style={{ fontWeight: "bold", fontSize: 14 }}>Payment Method *</div>
          <div>
            <Link to="/payment-method">
              <Button
                disabled={(props.newTotalPrice === "0" ? props.totalPrice : props.newTotalPrice) > 0 ? (this.props.roleBtnClear ? true : false) : true}
                onClick={() => localStorage.setItem(`${config.prefix}_getPaymentMethod`, true)}
                style={{
                  fontWeight: "bold", color: "#FFF", cursor: "pointer",
                  backgroundColor: (props.selectedCard === null && (props.newTotalPrice === "0" ? props.totalPrice : props.newTotalPrice) > 0) ? "#c00a27" : "#20a8d8",
                  width: 140, justifyContent: "space-between", display: "flex", flexDirection: "row",
                  alignItems: "center", fontSize: (props.selectedCard === null) ? 12 : 10,
                }}>
                <CreditCard style={{ fontSize: 16 }} />
                {
                  (props.selectedCard === null) ? "Select Methods" : (props.selectedCard.details.cardIssuer.toUpperCase() + " " + props.selectedCard.details.maskedAccountNumber.substr(props.selectedCard.details.maskedAccountNumber.toString().length - 4))
                }
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
