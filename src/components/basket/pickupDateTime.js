import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "reactstrap";
import SelectPicupDateTime from "./selectPicupDateTime";
import moment from "moment";

class PickupDateTime extends Component {
  state = {
    showModal: false,
  };
  render() {
    let props = this.props.data;
    var textTitle = props.orderingMode;
    if (textTitle === "STOREPICKUP") textTitle = "Pickup";
    if (textTitle === "STORECHECKOUT") textTitle = "Pickup";
    if (textTitle === "DELIVERY") textTitle = "Delivery";
    if (textTitle === "TAKEAWAY") textTitle = "Pickup";
    return (
      <div
        style={{
          border: "1px solid #DCDCDC",
          borderRadius: 5,
          marginTop: 10,
          padding: 10,
        }}
      >
        {this.state.showModal && (
          <SelectPicupDateTime
            data={props}
            handleSetState={(field, value) =>
              this.props.handleSetState(field, value)
            }
            showModal={this.state.showModal}
            handleClose={() => this.setState({ showModal: false })}
          />
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontWeight: "bold", fontSize: 14 }}>
            {textTitle} Date & Time
          </div>
          <div>
            <Button
              disabled={
                this.props.roleBtnClear || !props.btnBasketOrder ? true : false
              }
              onClick={() => this.setState({ showModal: true })}
              className="btn-ordering"
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
              <i
                className="fa fa-clock-o"
                style={{ fontSize: 20 }}
                aria-hidden="true"
              />
              <div style={{ fontSize: 12 }}>
                {props.orderActionTimeSlot ? (
                  <React.Fragment>
                    <div>{`${moment(props.orderActionDate).format(
                      "DD MMM YYYY"
                    )}`}</div>
                    <div>{`${props.orderActionTimeSlot}`}</div>
                  </React.Fragment>
                ) : (
                  <div>Select Timeslot</div>
                )}
              </div>
            </Button>
          </div>
        </div>
        {!props.orderActionTimeSlot && (
          <div
            style={{ lineHeight: "17px", textAlign: "justify", marginTop: 5 }}
          >
            {props.nextDayIsAvailable ? (
              <div className="text text-primary-theme small">
                Please select a timeslot
              </div>
            ) : (
              <div className="text text-warning-theme small">
                Timeslot is not available
              </div>
            )}
          </div>
        )}
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