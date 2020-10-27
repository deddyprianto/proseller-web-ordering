import React, { Component } from 'react';
import { Button } from 'reactstrap';
import CreditCard from "@material-ui/icons/CreditCard";
import config from "../../config";
import { Link } from 'react-router-dom';
import { connect } from "react-redux";

class PaymentMethodBasket extends Component {
  render() {
    let props = this.props.data
    let colorText = this.props.disabledBtn ? "#777" : (this.props.color.primary || "#c00a27") 
    return (
      <div style={{ 
        display: "flex", flexDirection: "row", justifyContent: "space-between", 
        border: "1px solid #DCDCDC", padding: 10, borderRadius: 5, width: "100%",
        marginTop: 10, alignItems: "center"
      }}>
        <Link to="/payment-method" style={{width: "100%"}}>
          <Button
            disabled={this.props.disabledBtn}
            onClick={() => localStorage.setItem(`${config.prefix}_getPaymentMethod`, true)}
            style={{
              fontWeight: "bold", cursor: "pointer", backgroundColor: "#FFF",
              color: colorText,
              width: "100%", justifyContent: "space-between", display: "flex", flexDirection: "row",
              alignItems: "center", fontSize: 13, height: 40, border: `1px solid ${colorText}`
            }}>
            <div style={{display: "flex", alignItems: "center"}}>
              <CreditCard style={{ fontSize: 16, marginRight: 10 }} />
              {
                (props.selectedCard === null) ? "Select Credit Card" : (props.selectedCard.details.cardIssuer.toUpperCase() + " " + props.selectedCard.details.maskedAccountNumber.substr(props.selectedCard.details.maskedAccountNumber.toString().length - 4))
              }
            </div>
            <i className="fa fa-chevron-right" aria-hidden="true" />
          </Button>
        </Link>
        {
          props.selectedCard !== null && 
          <i className="fa fa-times" aria-hidden="true" 
            style={{color: this.props.color.primary || "#c00a27", paddingLeft: 10, cursor: "pointer"}}
            onClick={() => this.props.handleCancelCreditCard()}
          />
        }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    color: state.theme.color,
  };
};

export default connect(mapStateToProps, {})(PaymentMethodBasket);