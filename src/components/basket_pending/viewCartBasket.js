import React, { Component } from 'react';
import { Col, Row, Button } from 'reactstrap';
import ItemsBasket from './itemsBasket';
import MenuBasket from './menuBasket';

export default class ViewCartBasket extends Component {
  roleBtnClear = () => {
    let props = this.props.data
    return ((
      (props.dataBasket.status === "SUBMITTED" &&
        (props.orderingMode && (
          props.orderingMode === "TAKEAWAY" ||
          props.orderingMode === "STOREPICKUP" ||
          props.orderingMode === "STORECHECKOUT"
        ))
      ) ||
      (
        props.dataBasket.status !== "PENDING" &&
        props.dataBasket.orderingMode === "DINEIN" &&
        props.dataBasket.outlet.outletType === "QUICKSERVICE"
      ) ||
      (
        props.dataBasket.orderingMode === "DELIVERY" &&
        props.dataBasket.status !== "PENDING"
      ) ||
      props.dataBasket.status === "CONFIRMED" ||
      props.dataBasket.status === "PROCESSING" ||
      props.dataBasket.status === "READY_FOR_COLLECTION"
    ) ? true : false)
  }

  roleDisableNotPending = () => {
    let props = this.props.data
    return (props.dataBasket && props.dataBasket.status !== "PENDING" ? true : false)
  }

  roleBtnSettle = () => {
    let props = this.props.data
    return ((!props.btnBasketOrder ||
      props.storeDetail.orderingStatus === "UNAVAILABLE" ||
      props.dataBasket.status === "PROCESSING" ||
      props.dataBasket.status === "READY_FOR_COLLECTION" ||
      (
        props.dataBasket.status === "SUBMITTED" &&
        props.dataBasket.orderingMode === "DINEIN" &&
        props.dataBasket.outlet.outletType === "RESTO"
      ) ||
      (
        // (this.props.isLoggedIn && props.selectedCard === null && (props.newTotalPrice === "0" ? props.totalPrice : props.newTotalPrice) > 0) ||
        (props.dataBasket.status === "SUBMITTED" || props.dataBasket.status === "CONFIRMED") &&
        (props.orderingMode && (
          props.orderingMode === "TAKEAWAY" ||
          props.orderingMode === "STOREPICKUP" ||
          props.orderingMode === "STORECHECKOUT"
        ))
      ) ||
      (
        props.dataBasket.status !== "PENDING" &&
        props.dataBasket.status !== "PENDING_PAYMENT" &&
        props.dataBasket.orderingMode === "DINEIN" &&
        props.dataBasket.outlet.outletType === "QUICKSERVICE"
      ) ||
      (
        props.dataBasket.orderingMode === "DELIVERY" &&
        props.dataBasket.status !== "PENDING" &&
        props.dataBasket.status !== "PENDING_PAYMENT"
      ) ||
      (
        this.props.isLoggedIn &&
        !props.provaiderDelivery &&
        props.orderingMode &&
        props.orderingMode === "DELIVERY"
      )
    ) ? true : false)
  }

  roleOnClickSettle = () => {
    let props = this.props.data
    return ((
      props.settle ||
      (props.orderingMode &&
        (
          props.orderingMode === "TAKEAWAY" ||
          props.orderingMode === "STOREPICKUP" ||
          props.orderingMode === "STORECHECKOUT" ||
          props.orderingMode === "DELIVERY"
        )
      ) ||
      (
        props.orderingMode &&
        props.orderingMode === "DINEIN" &&
        props.dataBasket &&
        props.dataBasket.outlet.outletType === "QUICKSERVICE" &&
        props.dataBasket.outlet.enableTableScan === false
      ) ||
      (
        props.dataBasket &&
        props.dataBasket.status !== "PENDING"
      )
    ))
  }

  roleBackgroundSettle = () => {
    let props = this.props.data
    return ((props.settle ||
      (props.orderingMode &&
        (
          props.orderingMode === "TAKEAWAY" ||
          props.orderingMode === "STOREPICKUP" ||
          props.orderingMode === "STORECHECKOUT" ||
          props.orderingMode === "DELIVERY"
        )
      ) ||
      (
        props.orderingMode &&
        props.orderingMode === "DINEIN" &&
        props.dataBasket &&
        props.dataBasket.outlet.outletType === "QUICKSERVICE" &&
        props.dataBasket.outlet.enableTableScan === false
      ) ||
      (
        props.dataBasket &&
        props.dataBasket.status !== "PENDING"
      )
    ))
  }

  roleIconSettle = () => {
    let props = this.props.data
    return ((props.settle ||
      (props.orderingMode &&
        (
          props.orderingMode === "TAKEAWAY" ||
          props.orderingMode === "STOREPICKUP" ||
          props.orderingMode === "STORECHECKOUT" ||
          props.orderingMode === "DELIVERY"
        )
      ) ||
      (
        props.orderingMode &&
        props.orderingMode === "DINEIN" &&
        props.dataBasket &&
        props.dataBasket.outlet.outletType === "QUICKSERVICE" &&
        (
          props.dataBasket.outlet.enableTableScan === false ||
          props.dataBasket.outlet.enableTableScan === "-"
        )
      ) ||
      (
        props.dataBasket &&
        props.dataBasket.status !== "PENDING"
      ) ||
      (
        props.storeDetail &&
        props.storeDetail.enableTableScan !== false &&
        props.scanTable
      )
    ))
  }

  roleTitleSettle = () => {
    return this.roleIconSettle()
  }

  render() {
    let props = this.props.data
    return (
      <div style={{
        marginLeft: (props.widthSelected >= 1200 ? 100 : 0),
        marginRight: (props.widthSelected >= 1200 ? 100 : 0)
      }}>
        <Row>
          <Col xs="12" sm="6">
            <ItemsBasket
              data={this.props.data}
              dataBasket={this.props.dataBasket}
              countryCode={this.props.countryCode}
              getCurrency={(price) => this.props.getCurrency(price)}
              handleSetState={(field, value) => this.props.handleSetState(field, value)}
              handleClear={(dataBasket) => this.props.handleClear(dataBasket)}
              roleBtnClear={this.roleBtnClear()}
            />
          </Col>
          <Col xs="12" sm="6">
            <MenuBasket
              data={this.props.data}
              isLoggedIn={this.props.isLoggedIn}
              cancelSelectVoucher={() => this.props.cancelSelectVoucher()}
              cancelSelectPoint={() => this.props.cancelSelectPoint()}
              handleRedeemVoucher={() => this.props.handleRedeemVoucher()}
              handleRedeemPoint={() => this.props.handleRedeemPoint()}
              getCurrency={(price) => this.props.getCurrency(price)}
              roleBtnClear={this.roleBtnClear()}
              roleDisableNotPending={this.roleDisableNotPending()}
              roleOnClickSettle={this.roleOnClickSettle()}
              roleIconSettle={this.roleIconSettle()}
              roleTitleSettle={this.roleTitleSettle()}
              roleBtnSettle={this.roleBtnSettle()}
              handleSubmit={() => this.props.handleSubmit()}
              handleSettle={() => this.props.handleSettle()}
              handleClear={() => this.props.handleClear()}
              setViewCart={(status) => this.props.setViewCart(status)}
              scrollPoint={(data) => this.props.scrollPoint(data)}
              setPoint={(point) => this.props.setPoint(point)}
              setOrderingMode={(mode) => this.props.setOrderingMode(mode)}
              handleSetProvaider={(item) => this.props.handleSetProvaider(item)}
            />
          </Col>
        </Row>

        {
          (props.dataBasket.status === "PROCESSING" ||
          props.dataBasket.status === "READY_FOR_COLLECTION" ||
          props.dataBasket.status === "READY_FOR_DELIVERY" ||
          props.dataBasket.status === "ON_THE_WAY") &&
          <div style={{
            backgroundColor: "#FFF", padding: 10, width: "101%", marginLeft: (props.widthSelected >= 750 ? -65 : -15),
            marginBottom: (props.widthSelected >= 1200 ? 0 : 45),
            display: "flex", flexDirection: "column", alignItems: "left", position: "fixed", bottom: 0,
            boxShadow: "1px -2px 2px rgba(128, 128, 128, 0.5)", justifyContent: "center",
            paddingBottom: 20 
          }}>

            <div style={{
              padding: 10, backgroundColor: "#FFF",
              display: "flex", flexDirection: "row", alignItems: 'center', justifyContent: "space-between",
            }}>
              <Button style={{
                boxShadow: "1px 2px 5px rgba(128, 128, 128, 0.5)", width: "100%",
                backgroundColor: "green", color: "#FFF", fontWeight: "bold",
                display: 'flex', justifyContent: "center", alignItems: "center"
              }} onClick={() => this.props.setViewCart(false)}>
                <i className="fa fa-shopping-cart" aria-hidden="true" style={{fontSize: 18, marginRight: 10}}/>
                Waiting Order
              </Button>
            </div>

          </div>
        }
      </div>
    );
  }
}