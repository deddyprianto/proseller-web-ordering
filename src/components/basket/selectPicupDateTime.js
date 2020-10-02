import React, { Component } from 'react';
import { Button } from 'reactstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

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
    Date.prototype.addDays = function (days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    }
    let date = new Date()
    return (
      <div>
        <div className="modal fade" id="pickup-date-modal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content" style={{ width: "100%", marginTop: 100, marginBottom: 100 }}>
              <div className="modal-header" style={{ display: "flex", justifyContent: "center" }}>
                <h5 className="modal-title" id="exampleModalLabel" style={{ fontSize: 16 }}>Select Pickup Date & Time</h5>
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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ textAlign: "left" }}>
                    <div>Date</div>
                    <DatePicker
                      id="orderingDateBtn"
                      selected={new Date(props.orderActionDate)}
                      onChange={orderActionDate => this.props.handleSetState('orderActionDate', moment(orderActionDate).format("YYYY-MM-DD"))}
                      minDate={date}
                      maxDate={props.storeDetail.maxStorePickupDays && date.addDays(parseInt(props.storeDetail.maxStorePickupDays))}
                    />
                    <div onClick={() => document.getElementById('orderingDateBtn').click()}
                      style={{ position: "absolute", padding: 5, backgroundColor: "#FFF", top: 46, left: 30 }}>
                      {moment(props.orderActionDate).format('DD MMM YYYY')}
                    </div>
                  </div>

                  <div style={{ textAlign: "left" }}>
                    <div>Time</div>
                    <select
                      className="woocommerce-Input woocommerce-Input--text input-text"
                      value={props.orderActionTime}
                      onChange={time => this.props.handleSetState('orderActionTime', time.target.value)}
                    >
                      {
                        props.orderingTime.map((items, key) => (
                          <option key={key} value={items}>{items}</option>
                        ))
                      }
                    </select>
                  </div>
                </div>
                <Button className="button"
                  data-toggle="modal" data-target="#redeem-point-modal"
                  data-dismiss="modal"
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
