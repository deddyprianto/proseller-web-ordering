import React, { Component } from "react";
import { Button } from "reactstrap";
import moment from "moment";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default class SelectPicupDateTime extends Component {
  state = {
    selectedDate: this.props.data.orderActionDate,
    initialOrderActionDate: this.props.data.orderActionDate,
    initialOrderActionTime: this.props.data.orderActionTime,
    initialOrderActionTimeSlot: this.props.data.orderActionTimeSlot,
    showModeDates:
      this.props.data.timeSlot && this.props.data.timeSlot.length > 0
        ? false
        : true,
  };

  componentDidMount() {
    const firstAvailableTimeSlot = this.props.data.orderingTimeSlot.find(
      (slot) => slot.isAvailable
    );
    console.log(firstAvailableTimeSlot);
    if (firstAvailableTimeSlot && !this.props.data.orderActionTimeSlot) {
      this.setState({
        currentTimeSlot: firstAvailableTimeSlot.time,
      });
    }
  }

  render() {
    let props = this.props.data;
    let dateMax =
      props.timeSlot &&
      props.timeSlot[props.timeSlot.length - 1] &&
      props.timeSlot[props.timeSlot.length - 1].date;

    let date = moment().format("YYYY-MM-DD");
    let textTitle = "Pickup";
    const selectedDateIndex = props.timeSlot.indexOf(
      props.timeSlot.find((slot) => slot.date === this.state.selectedDate)
    );

    const timeSlots = [
      ...props.timeSlot.slice(selectedDateIndex, selectedDateIndex + 5),
    ];
    if (props.orderingMode === "DELIVERY") textTitle = "Delivery";

    return (
      <div>
        <div
          className="modal fade"
          id="pickup-date-modal"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div
              className="modal-content"
              style={{ width: "100%", marginTop: 100, marginBottom: 100 }}
            >
              <div
                className="modal-header"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <h5
                  className="modal-title"
                  id="exampleModalLabel"
                  style={{ fontSize: 16 }}
                >
                  {textTitle} Date & Time
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    this.props.handleSetState(
                      "orderActionDate",
                      this.state.initialOrderActionDate
                    );
                    this.props.handleSetState(
                      "orderActionTime",
                      this.state.initialOrderActionTime
                    );
                    this.props.handleSetState(
                      "orderActionTimeSlot",
                      this.state.initialOrderActionTimeSlot
                    );
                  }}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: 16,
                  }}
                >
                  <span aria-hidden="true" style={{ fontSize: 30 }}>
                    ×
                  </span>
                </button>
              </div>
              <div className="modal-body">
                <div style={{ textAlign: "left" }}>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "bold",
                          marginLeft: 5,
                          fontSize: 12,
                        }}
                      >
                        {textTitle} Date
                      </div>
                      <div
                        onClick={() =>
                          this.setState({
                            showModeDates: !this.state.showModeDates,
                          })
                        }
                        className="color-active"
                        style={{
                          fontWeight: "bold",
                          marginLeft: 5,
                          fontSize: 12,
                          cursor: "pointer",
                        }}
                      >
                        <i className="fa fa-calendar" aria-hidden="true" />{" "}
                        {this.state.showModeDates ? "Less " : "More "}
                        Dates
                      </div>
                    </div>
                    {this.state.showModeDates ? (
                      <div>
                        <Calendar
                          className="calender"
                          onChange={(value) => {
                            this.props.handleSetState(
                              "orderActionDate",
                              moment(value).format("YYYY-MM-DD")
                            );
                            const defaultTimeSlot = props.timeSlot.find(
                              (slot) =>
                                slot.date === moment(value).format("YYYY-MM-DD")
                            );
                            if (
                              defaultTimeSlot &&
                              defaultTimeSlot.timeSlot.length > 0
                            ) {
                              this.props.handleSetState(
                                "orderActionTimeSlot",
                                defaultTimeSlot.timeSlot.find(
                                  (slot) => slot.isAvailable
                                ).time
                              );
                              this.props.handleSetState(
                                "orderActionTime",
                                defaultTimeSlot.timeSlot
                                  .find((slot) => slot.isAvailable)
                                  .time.split(" - ")[0]
                              );
                              this.setState({
                                showModeDates: false,
                                selectedDate: moment(value).format(
                                  "YYYY-MM-DD"
                                ),
                              });
                            }
                          }}
                          maxDate={new Date(dateMax)}
                          minDate={new Date(date)}
                          value={new Date(props.orderActionDate)}
                        />
                      </div>
                    ) : (
                      <div>
                        {props.timeSlot && (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            {timeSlots.map((slot, key) => (
                              <div
                                key={key}
                                className={
                                  props.orderActionDate === slot.date
                                    ? "select-gender"
                                    : "un-select-gender"
                                }
                                onClick={() => {
                                  this.props.handleSetState(
                                    "orderActionDate",
                                    moment(slot.date).format("YYYY-MM-DD")
                                  );
                                  const defaultTimeSlot = props.timeSlot.find(
                                    (defaultSlot) =>
                                      defaultSlot.date ===
                                      moment(slot.date).format("YYYY-MM-DD")
                                  );
                                  if (
                                    defaultTimeSlot &&
                                    defaultTimeSlot.timeSlot.length > 0
                                  ) {
                                    this.props.handleSetState(
                                      "orderActionTimeSlot",
                                      defaultTimeSlot.timeSlot.find(
                                        (slot) => slot.isAvailable
                                      ).time
                                    );
                                    this.props.handleSetState(
                                      "orderActionTime",
                                      defaultTimeSlot.timeSlot
                                        .find((slot) => slot.isAvailable)
                                        .time.split(" - ")[0]
                                    );
                                  }
                                }}
                                style={{
                                  textAlign: "center",
                                  cursor: "pointer",
                                  borderRadius: 5,
                                  width: `${100 / 5 - 2}%`,
                                  margin:
                                    props.orderActionDate === slot.date ? 1 : 0,
                                }}
                              >
                                <div
                                  style={{ fontWeight: "bold", fontSize: 12 }}
                                >
                                  {moment().format("YYYY-MM-DD") === slot.date
                                    ? "TODAY"
                                    : moment(slot.date)
                                        .format("ddd")
                                        .toLocaleUpperCase()}
                                </div>
                                <div
                                  style={{ fontWeight: "bold", fontSize: 20 }}
                                >
                                  {moment(slot.date).format("DD")}
                                </div>
                                <div
                                  style={{ fontWeight: "bold", fontSize: 14 }}
                                >
                                  {moment(slot.date)
                                    .format("MMM")
                                    .toLocaleUpperCase()}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: 10, marginBottom: 10 }}>
                    <div
                      style={{
                        fontWeight: "bold",
                        marginLeft: 5,
                        fontSize: 12,
                      }}
                    >
                      {textTitle} Time
                    </div>
                    {props.orderingTimeSlot &&
                    props.orderingTimeSlot.length > 0 ? (
                      <select
                        className="woocommerce-Input woocommerce-Input--text input-text"
                        value={props.orderActionTimeSlot}
                        style={{
                          borderRadius: 5,
                          width: "100%",
                          backgroundColor: "#FFF",
                        }}
                        onChange={(time) =>
                          this.props.handleSetState(
                            "orderActionTimeSlot",
                            time.target.value
                          )
                        }
                      >
                        {props.orderingTimeSlot.map((items, key) => (
                          <option key={key} value={items.time || items}>
                            {items.time || items}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div
                        className="text text-warning-theme small"
                        style={{
                          lineHeight: "17px",
                          textAlign: "justify",
                          marginLeft: 5,
                        }}
                      >
                        {props.nextDayIsAvailable ? (
                          <div>
                            Your selected {` ${textTitle.toLowerCase()}`} date:{" "}
                            {` ${moment(props.orderActionDate).format(
                              "DD MMM YYYY"
                            )}`}
                            , does not have any available{" "}
                            {` ${textTitle.toLowerCase()}`} time slot. Next
                            available {` ${textTitle.toLowerCase()}`} date is
                            {` ${moment(props.nextDayIsAvailable).format(
                              "DD MMM YYYY"
                            )}`}
                            .
                          </div>
                        ) : (
                          <div>Timeslot is not available</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  className="button"
                  data-toggle="modal"
                  data-target="#redeem-point-modal"
                  data-dismiss="modal"
                  disabled={
                    props.orderingTimeSlot &&
                    props.orderingTimeSlot.length === 0
                  }
                  onClick={() => {
                    props.orderActionTimeSlot &&
                      this.props.handleSetState(
                        "orderActionTime",
                        `${props.orderActionTimeSlot.split(" - ")[0]}`
                      );
                    this.setState({
                      initialOrderActionDate: this.props.data.orderActionDate,
                      initialOrderActionTime: this.props.data.orderActionTime,
                      initialOrderActionTimeSlot: this.props.data
                        .orderActionTimeSlot,
                    });
                    if (this.state.currentTimeSlot) {
                      this.props.handleSetState(
                        "orderActionDate",
                        `${this.state.initialOrderActionDate}`
                      );
                      this.props.handleSetState(
                        "orderActionTime",
                        `${this.state.currentTimeSlot.split(" - ")[0]}`
                      );
                      this.props.handleSetState(
                        "orderActionTimeSlot",
                        `${this.state.currentTimeSlot}`
                      );
                      this.setState({
                        initialOrderActionDate: this.props.data.orderActionDate,
                        initialOrderActionTime: this.state.currentTimeSlot.split(
                          " - "
                        )[0],
                        initialOrderActionTimeSlot: this.state.currentTimeSlot,
                        currentTimeSlot: null,
                      });
                    }
                  }}
                  style={{
                    width: "100%",
                    marginTop: 10,
                    borderRadius: 5,
                    height: 40,
                  }}
                >
                  Set Date & Time
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
