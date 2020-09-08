import React, { Component } from 'react';
import { Button } from 'reactstrap';
import ContactMailIcon from '@material-ui/icons/ContactMail';
import { Link } from 'react-router-dom';
import config from '../../config';

export default class DeliveryAddressBasket extends Component {
  render() {
    let props = this.props.data
    return (
      <div style={{ border: "1px solid #DCDCDC", borderRadius: 5, marginTop: 10, padding: 10 }}>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <div style={{ fontWeight: "bold", color: "gray", fontSize: 14 }}>Delivery Address *</div>
          <div>
            <Link to="/delivery-address">
              <Button disabled={this.props.roleBtnClear ? true : false}
                onClick={() => localStorage.setItem(`${config.prefix}_getDeliveryAddress`, true)}
                style={{
                  fontWeight: "bold", color: "#FFF", cursor: "pointer",
                  backgroundColor: (!props.deliveryAddress ? "#c00a27" : "#20a8d8"),
                  width: 140, justifyContent: "space-between", display: "flex", flexDirection: "row",
                  alignItems: "center", fontSize: 12,
                }}>
                <ContactMailIcon style={{ fontSize: 16 }} />
                {!props.deliveryAddress ? "Select Address" : `${props.deliveryAddress.addressName.substring(0, 15)}`}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
