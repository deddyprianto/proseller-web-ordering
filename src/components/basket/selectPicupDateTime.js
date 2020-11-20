import React, { Component } from 'react';
import { Button } from 'reactstrap';
import cx from "classnames";
import moment from "moment";
import styles from "../profile/CustomFields/styles.module.css";

export default class SelectPicupDateTime extends Component {
  state = {
    orderActionDate: this.props.data.orderActionDate,
    orderActionTime: this.props.data.orderActionTime,
    showModeDates: this.props.data.timeSlot && this.props.data.timeSlot.length > 0 ? false : true
  }

  render() {
    let props = this.props.data
    let dateMax = props.timeSlot && props.timeSlot[props.timeSlot.length - 1] && props.timeSlot[props.timeSlot.length - 1].date

    let date = moment().format("YYYY-MM-DD")
    let textTitle = "Pickup";
    if (props.orderingMode === "DELIVERY") textTitle = "Delivery"

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
                <div style={{textAlign: "left"}}>
                  <div>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                      <div style={{fontWeight: "bold", marginLeft: 5, fontSize: 12}}>{textTitle} Date</div>
                      <div 
                        onClick={() => this.setState({showModeDates: !this.state.showModeDates})}
                        className="color-active" 
                        style={{fontWeight: "bold", marginLeft: 5, fontSize: 12, cursor: "pointer"}}
                      >
                        <i className="fa fa-calendar" aria-hidden="true" /> More Dates
                      </div>
                    </div>
                    {
                      this.state.showModeDates ?
                      <input
                        type="date"
                        min={date}
                        max={dateMax}
                        value={props.orderActionDate}
                        className={cx(styles.input, {
                          [styles.rounded]: false,
                        })}
                        style={{backgroundColor: '#FFF', width: "100%"}}
                        onChange={(e) =>
                          this.props.handleSetState('orderActionDate', moment(e.target.value).format("YYYY-MM-DD"))
                        }
                      /> :
                      <div>
                      {
                        props.timeSlot && 
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                        {
                          props.timeSlot.map((slot, key) => (
                            <div 
                              key={key} 
                              className={props.orderActionDate === slot.date ? "select-gender" : "un-select-gender"}
                              onClick={() => 
                                this.props.handleSetState('orderActionDate', moment(slot.date).format("YYYY-MM-DD"))
                              }
                              style={{
                                textAlign: "center", cursor: "pointer",
                                borderRadius: 5, width: `${(100/props.timeSlot.length) - 2}%`,
                                margin: (props.orderActionDate === slot.date ? 1 : 0)
                              }}
                            >
                              <div style={{fontWeight: "bold", fontSize: 12}}>
                                {moment().format("YYYY-MM-DD") === slot.date ? "TODAY" : moment(slot.date).format("ddd").toLocaleUpperCase()}
                              </div>
                              <div style={{fontWeight: "bold", fontSize: 20}}>{moment(slot.date).format("DD")}</div>
                              <div style={{fontWeight: "bold", fontSize: 14}}>{moment(slot.date).format("MMM").toLocaleUpperCase()}</div>
                            </div>
                          ))
                        }
                        </div>
                      }
                      </div>
                    }
                  </div>

                  <div style={{marginTop: 10, marginBottom: 10}}>
                    <div style={{fontWeight: "bold", marginLeft: 5, fontSize: 12}}>{textTitle} Time</div>
                    {
                      props.orderingTimeSlot && props.orderingTimeSlot.length > 0 ? 
                      <select
                        className="woocommerce-Input woocommerce-Input--text input-text"
                        value={props.orderActionTimeSlot}
                        style={{borderRadius: 5, width: "100%", backgroundColor: "#FFF"}}
                        onChange={time => this.props.handleSetState('orderActionTimeSlot', time.target.value)}
                      >
                        {
                          props.orderingTimeSlot.map((items, key) => (
                            <option key={key} value={items.time || items}>{items.time || items}</option>
                          ))
                        }
                      </select> :
                      <div className="text text-warning-theme small" style={{lineHeight: "17px", textAlign: "justify", marginLeft: 5}}> 
                        {
                          props.nextDayIsAvailable ?
                          <div>
                            Your selected {` ${textTitle.toLowerCase()}`} date:{" "}
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
                </div>
                <Button className="button"
                  data-toggle="modal" data-target="#redeem-point-modal"
                  data-dismiss="modal"
                  disabled={props.orderingTimeSlot && props.orderingTimeSlot.length === 0}
                  onClick={() => {
                    props.orderActionTimeSlot &&
                    this.props.handleSetState('orderActionTime', `${props.orderActionTimeSlot.split(" - ")[0]}`)
                  }}
                  style={{
                    width: "100%", marginTop: 10, borderRadius: 5, height: 40
                  }}>Set Date & Time</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
