import React, { Component } from 'react';
import { Button } from 'reactstrap';
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import cx from "classnames";
import moment from "moment";
import styles from "../profile/CustomFields/styles.module.css";

export default class SelectPicupDateTime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderActionDate: this.props.data.orderActionDate,
      orderActionTime: this.props.data.orderActionTime,
    };
  }

  render() {
    let props = this.props.data
    let date = moment().format("YYYY-MM-DD")
    var textTitle = props.orderingMode;
    var maxDay = null;
    if (textTitle === "STOREPICKUP") {
      textTitle = "Pickup"
      maxDay = props.storeDetail.maxStorePickupDays
    }
    if (textTitle === "STORECHECKOUT") {
      textTitle = "Pickup"
      maxDay = props.storeDetail.maxStoreCheckoutDays
    }
    if (textTitle === "DELIVERY") {
      textTitle = "Delivery"
      maxDay = props.storeDetail.maxDeliveryDays
    }
    if (textTitle === "TAKEAWAY") {
      textTitle = "Pickup"
      maxDay = props.storeDetail.maxTakeAwayDays
    }
    return (
      <div>
        <div className="modal fade" id="pickup-date-modal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content" style={{ width: "100%", marginTop: 100, marginBottom: 100 }}>
              <div className="modal-header" style={{ display: "flex", justifyContent: "center" }}>
                <h5 className="modal-title" id="exampleModalLabel" style={{ fontSize: 16 }}>{textTitle} Date & Time</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                  onClick={() => {
                    this.props.handleSetState('orderActionDate', this.state.orderActionDate)
                    this.props.handleSetState('orderActionTime', this.state.orderActionTime)
                  }} style={{
                    position: "absolute", right: 10, top: 16
                  }}>
                  <span aria-hidden="true" style={{ fontSize: 30 }}>×</span>
                </button>
              </div>
              <div className="modal-body">
                <div>
                  <div>
                    <div style={{fontWeight: "bold", marginLeft: 5}}>Delivery Date</div>
                    <input
                      type="date"
                      min={date}
                      max={maxDay && moment().add(maxDay, "d").format("YYYY-MM-DD") || date}
                      value={props.orderActionDate}
                      className={cx(styles.input, {
                        [styles.rounded]: false,
                      })}
                      onChange={(e) =>
                        this.props.handleSetState('orderActionDate', moment(e.target.value).format("YYYY-MM-DD"))
                      }
                    />
                  </div>

                  <div style={{display: "flex", marginTop: 10, justifyContent: "center" }}>
                    <div style={{marginRight: 10}}>
                      <div style={{fontWeight: "bold"}}>Hour</div>
                      <select
                        className="woocommerce-Input woocommerce-Input--text input-text"
                        value={props.orderActionTimeHours}
                        style={{borderRadius: 5}}
                        onChange={time => this.props.handleSetState('orderActionTimeHours', time.target.value)}
                      >
                        {
                          props.orderingTimeHours.map((items, key) => (
                            props.orderingTimeMinutes[items].length > 0 &&
                            <option key={key} value={items}>{items}</option>
                          ))
                        }
                      </select>
                    </div>
                    <div>
                      <div style={{fontWeight: "bold"}}>Minute</div>
                      <select
                        className="woocommerce-Input woocommerce-Input--text input-text"
                        style={{borderRadius: 5}}
                        value={props.orderActionTimeMinutes}
                        onChange={time => this.props.handleSetState('orderActionTimeMinutes', time.target.value)}
                      >
                        {
                          props.orderingTimeMinutes[props.orderActionTimeHours].map((items, key) => (
                            <option key={key} value={items}>{items}</option>
                          ))
                        }
                      </select>
                    </div>
                  </div>
                </div>
                <Button className="button"
                  data-toggle="modal" data-target="#redeem-point-modal"
                  data-dismiss="modal"
                  onClick={() => {
                    this.props.handleSetState('orderActionTime', `${props.orderActionTimeHours}:${props.orderActionTimeMinutes}`)
                  }}
                  style={{
                    width: "100%", marginTop: 10, borderRadius: 5, height: 40
                  }}>Set</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
