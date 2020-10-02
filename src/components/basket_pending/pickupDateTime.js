import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
import SelectPicupDateTime from './selectPicupDateTime';
import moment from "moment";

class PickupDateTime extends Component {
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
          <div style={{ fontWeight: "bold", color: "gray", fontSize: 14 }}>
            Pickup Date & Time
          </div>
          <div>
            <Link to={this.props.isLoggedIn && "/delivery-address"}>
              <Button
                disabled={this.props.roleBtnClear ? true : false}
                data-toggle="modal" data-target="#pickup-date-modal"
                style={{
                  fontWeight: "bold",
                  color: "#FFF",
                  cursor: "pointer",
                  backgroundColor: !props.deliveryAddress
                    ? this.props.color.primary
                    : "#777",
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

export default connect(mapStateToProps, {})(PickupDateTime);
