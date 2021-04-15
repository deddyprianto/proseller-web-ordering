import React, { Component } from "react";
import { Col } from "reactstrap";

export default class CardMembership extends Component {

  render() {
    let { item } = this.props;
    return (
      <Col sm={6} onClick={() => this.props.detailMembership(item)}>
        <div style={styles.wrap}>
          <div style={styles.coupon}>
            <div style={styles.coupon_left} className="button">
              <p style={styles.name}>{item.name}</p>
            </div>
            <div style={styles.coupon_con} className="customer-group-name">
              <i className="fa fa-chevron-right" style={{fontSize: 25, marginLeft: 20 }} />
            </div>
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
    overflow: "hidden",
    borderRadius: "10px",
    border: "1px solid black",
    alignItems: 'center'
  },
  couponSelected: {
    display: "flex",
    overflow: "hidden",
    borderRadius: "10px",
    border: "2px solid red",
  },
  coupon_left: {
    padding: 10,
    float: "left",
    width: "80%",
    maxWidth: "80%",
    height: "60px",
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
