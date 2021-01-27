import React, { Component } from "react";
import { Col } from "reactstrap";

export default class PricingMembership extends Component {
  isSelected = (mem) => {
    let { selectedPlan } = this.props;
    if (selectedPlan === null) return false;
    if (
      selectedPlan.period === mem.period &&
      (selectedPlan.price === mem.price || selectedPlan.point === mem.point) &&
      selectedPlan.periodUnit === mem.periodUnit
    ) {
      return true;
    }
    return false;
  };

  render() {
    let { item, color, selectedPlan } = this.props;
    return (
      <Col sm={6} onClick={() => this.props.selectPlan(item)}>
        <div style={styles.wrap}>
          <div style={this.isSelected(item) ? styles.couponSelected : styles.coupon}>
            <div style={styles.coupon_left}>
              <div style={styles.coupon_con} className="customer-group-name">
                {this.isSelected(item) ? (
                  <div
                    style={{
                      backgroundColor: color.primary,
                      width: 27,
                      height: 27,
                      borderRadius: "50%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <i
                      className="fa fa-check"
                      style={{ fontSize: 15, color: "white" }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      border: "1px solid black",
                      width: 27,
                      height: 27,
                      borderRadius: "50%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  />
                )}
              </div>
            </div>
            {item.price ? (
              <div style={styles.coupon_con} className="customer-group-name">
                <b>{`$${item.price} / ${
                  item.period
                } ${item.periodUnit.toLowerCase()}`}</b>
              </div>
            ) : (
              <div style={styles.coupon_con} className="customer-group-name">
                <b>{`${item.point} points / ${
                  item.period
                } ${item.periodUnit.toLowerCase()}`}</b>
              </div>
            )}
          </div>
        </div>
      </Col>
    );
  }
}

const styles = {
  wrap: {
    width: "100%",
    marginBottom: 20,
  },
  coupon: {
    display: "flex",
    borderRadius: "10px",
    alignItems: "center",
  },
  couponSelected: {
    display: "flex",
    borderRadius: "10px",
    alignItems: "center",
    border: "2px solid red",
  },
  coupon_left: {
    padding: 10,
    float: "left",
    width: "20%",
    maxWidth: "20%",
    height: "50px",
    maxHeight: "150px",
    position: "relative",
    borderRight: "4px dashed white",
  },
  coupon_con: {
    float: "left",
    textAlign: "left",
    backgroundColor: "white",
    borderRightWidth: 1,
    borderRightColor: "white",
  },
  name: {
    textAlign: "left",
    fontSize: 23,
    borderRadius: 10,
    fontWeight: "bold",
    color: "white",
  },
  price: {
    textAlign: "center",
    fontSize: 26,
    color: "white",
    fontWeight: "bold",
  },
};
