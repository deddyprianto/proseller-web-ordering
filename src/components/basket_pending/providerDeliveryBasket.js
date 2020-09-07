import React, { Component } from 'react';
import { Button } from 'reactstrap';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import ModalProviderDelivery from './ModalProviderDelivery';

export default class ProviderDeliveryBasket extends Component {
  render() {
    let props = this.props.data
    return (
      <div style={{ border: "1px solid #DCDCDC", borderRadius: 5, marginTop: 10, padding: 10 }}>
        <ModalProviderDelivery
          data={props}
          handleSetProvaider={(item) => this.props.handleSetProvaider(item)}
        />
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <div style={{ fontWeight: "bold", color: "gray", fontSize: 14 }}>Provider *</div>
          <div>
            <Button
              disabled={this.props.roleBtnClear || !props.deliveryAddress ? true : false}
              data-toggle="modal" data-target="#provider-delivery-modal" style={{
                fontWeight: "bold", color: "#FFF", cursor: "pointer",
                backgroundColor: (!props.provaiderDelivery ? "#c00a27" : "#20a8d8"),
                width: 140, justifyContent: "space-between", display: "flex", flexDirection: "row",
                alignItems: "center", fontSize: 12,
              }}>
              <AssignmentIndIcon style={{ fontSize: 16 }} />
              {!props.provaiderDelivery ? "Select Provider" : `${props.provaiderDelivery.name.substring(0, 15)}`}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
