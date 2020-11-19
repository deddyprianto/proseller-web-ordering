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
            alignItems: "center"
          }}
        >
          <div style={{ fontWeight: "bold", fontSize: 14 }}>
            {textTitle} Date & Time
          </div>
          <div>
            <Button
              disabled={this.props.roleBtnClear || !props.btnBasketOrder ? true : false}
              data-toggle="modal" data-target="#pickup-date-modal"
              style={{
                fontWeight: "bold",
                cursor: "pointer",
                backgroundColor: this.props.color.primary,
                width: 140,
                alignItems: "center",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <i className="fa fa-clock-o" style={{ fontSize: 20 }} aria-hidden="true" />
              <div style={{ fontSize: 12 }}>
                <div>{`${moment(props.orderActionDate).format('DD MMM YYYY')}`}</div>
                {
                  props.orderActionTimeSlot && 
                  <div>{`${props.orderActionTimeSlot}`}</div>
                }
              </div>
            </Button>
          </div>
        </div>
        {
          !props.orderActionTimeSlot && 
          <div className="text text-warning-theme small" style={{lineHeight: "17px", textAlign: "justify", marginTop: 5}}> 
            {
              props.nextDayIsAvailable ?
              <div>
                Your selected delivery date:{" "}
                {` ${moment(props.orderActionDate).format("DD MMM YYYY")}`}, 
                does not have any available {` ${textTitle.toLowerCase()}`} time slot. 
                Next available {` ${textTitle.toLowerCase()}`} date is 
                {` ${moment(props.nextDayIsAvailable).format("DD MMM YYYY")}`}.
              </div> :
              <div>
                Timeslot is not available
              </div>
            }
          </div>
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

export default connect(mapStateToProps, {})(PickupDateTime);
