import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "reactstrap";
import SelectPicupDateTime from './selectPicupDateTime';
import moment from "moment";

class PickupDateTime extends Component {
  render() {
    let props = this.props.data;
    var textTitle = props.orderingMode;
    if (textTitle === "STOREPICKUP") textTitle = "Pickup"
    if (textTitle === "STORECHECKOUT") textTitle = "Pickup"
    if (textTitle === "DELIVERY") textTitle = "Delivery"
    if (textTitle === "TAKEAWAY") textTitle = "Pickup"
    return (
      <div
        style={{
          border: "1px solid #DCDCDC",
          borderRadius: 5,
          marginTop: 10,
          padding: 10,
        }}
      >
        <SelectPicupDateTime
          data={props}
          handleSetState={(field, value) =>
            this.props.handleSetState(field, value)
          }
        />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontWeight: "bold", fontSize: 14 }}>
            {textTitle} Date & Time
          </div>
          <div>
            <Button
              disabled={this.props.roleBtnClear ? true : false}
              data-toggle="modal" data-target="#pickup-date-modal"
              style={{
                fontWeight: "bold",
                cursor: "pointer",
                backgroundColor: !props.deliveryAddress
                  ? this.props.color.primary
                  : "#DCDCDC",
                width: 140,
                justifyContent: "space-between",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                fontSize: 12,
              }}
            >
              {`${moment(props.orderActionDate).format('DD MMM YYYY')} at ${props.orderActionTime}`}
            </Button>
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

export default connect(mapStateToProps, {})(PickupDateTime);
