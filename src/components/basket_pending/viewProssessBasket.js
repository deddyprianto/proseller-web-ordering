import React, { Component } from 'react';
import { Col, Row, Button } from 'reactstrap';
import Lottie from 'lottie-react-web';
import processingCollection from '../../assets/gif/cooking.json'
import readyCollection from '../../assets/gif/food-ready.json';
import onTheWay from '../../assets/gif/delivery.json';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import loadable from "@loadable/component";
const ModalQRCode = loadable(() => import("../profile/ModalQRCode"));

export default class ViewProsessBasket extends Component {
  render() {
    let props = this.props.data
    return (
      <div>
        <ModalQRCode qrcode={props.dataBasket.cartID} title="Order QRCode" />
        <Row style={{ display: "flex", justifyContent: 'center' }}>
          <Col xs="12" sm="6">
            <div>
              <Lottie
                options={{
                  animationData: (
                    (props.dataBasket.status === "PROCESSING" && processingCollection) ||
                    (props.dataBasket.status === "READY_FOR_COLLECTION" && readyCollection) ||
                    (props.dataBasket.status === "READY_FOR_DELIVERY" && readyCollection) ||
                    (props.dataBasket.status === "ON_THE_WAY" && onTheWay)
                  )
                }}
              />

              {
                props.dataBasket.status === "PROCESSING" &&
                <div style={{ marginBottom: 20 }}>
                  <div style={{ marginTop: 40, fontSize: 18, textAlign: "center" }}>Please wait, We are preparing your food in the kitchen.</div>
                  <div className="color-active" style={{ marginTop: 10, marginBottom: 10, fontWeight: "bold", textAlign: "center" }}>
                    {
                      props.dataBasket.queueNo &&
                      (
                        props.dataBasket.orderingMode === "TAKEAWAY" ||
                        props.dataBasket.orderingMode === "STOREPICKUP" ||
                        props.dataBasket.orderingMode === "STORECHECKOUT"
                      ) &&
                      ("Queue No : " + props.dataBasket.queueNo)
                    }
                    {
                      props.storeDetail.enableTableScan === false &&
                      props.dataBasket.orderingMode === "DINEIN" &&
                      props.dataBasket.outlet.outletType === "QUICKSERVICE" &&
                      ("Queue No : " + props.dataBasket.queueNo)
                    }
                    {
                      props.dataBasket.orderingMode === "DINEIN" &&
                      props.dataBasket.outlet.outletType === "RESTO" &&
                      ("Table No : " + props.scanTable.tableNo)
                    }
                  </div>
                </div>
              }
              {
                props.dataBasket.status === "READY_FOR_COLLECTION" &&
                <div style={{ marginBottom: 20}}>
                  <div className="color-active" style={{ fontSize: 18, textAlign: "center" }}>Yeay, your order is ready.</div>
                  <div style={{ fontSize: 18, textAlign: "center" }}>Please come to the cashier and tap the QR Code botton below.</div>
                  <div className="color-active" style={{ marginTop: 10, marginBottom: 10, fontWeight: "bold", textAlign: "center" }}>
                    {
                      !props.dataBasket.transactionRefNo ?
                      (
                        props.dataBasket.queueNo ||
                        (props.storeDetail.enableTableScan === false && props.dataBasket.orderingMode === "DINEIN")
                      ) ? ("Queue No : " + props.dataBasket.queueNo) : ("Table No : " + props.scanTable.tableNo) :
                      ("Ref No : " + props.dataBasket.transactionRefNo)
                    }
                  </div>
                </div>
              }
              {
                props.dataBasket.status === "READY_FOR_DELIVERY" &&
                <div style={{ marginBottom: 20 }}>
                  <div className="color-active" style={{ fontSize: 18, textAlign: "center" }}>Yeay, your order is ready.</div>
                  <div style={{ fontSize: 18, textAlign: "center" }}>Your order will be sent to your destination address.</div>
                </div>
              }
              {
                props.dataBasket.status === "ON_THE_WAY" &&
                <div>
                  <div className="color-active" style={{ fontSize: 18, textAlign: "center" }}>Your order is on the way.</div>
                  {
                    props.deliveryAddress &&
                    <div style={{ fontSize: 18, textAlign: "center" }}>
                      {`Go to ${props.deliveryAddress.address}, ${props.deliveryAddress.city}, ${props.deliveryAddress.postalCode}`}
                    </div>
                  }
                  <div className="color-active" style={{ marginTop: 10, marginBottom: 10, fontWeight: "bold", textAlign: "center" }}>
                    {
                      `${props.dataBasket.transactionRefNo ? 
                      `Ref No : ${props.dataBasket.transactionRefNo}` : 
                      `Queue No : ${props.dataBasket.queueNo}`}`
                    }
                  </div>
                  {
                    props.dataBasket.trackingNo &&
                    <div className="profile-dashboard" style={{
                      marginTop: 10, fontWeight: "bold", textAlign: "center", padding: 10
                    }}>
                      {"Tracking No : " + props.dataBasket.trackingNo}
                    </div>
                  }
                  {
                    props.dataBasket.deliveryProvider &&
                    <div className="border-theme" style={{
                      marginBottom: 10, fontWeight: "bold", textAlign: "center", padding: 10
                    }}>
                      {"Provider : " + props.dataBasket.deliveryProvider}
                    </div>
                  }
                </div>
              }
            </div>
          </Col>
        </Row>

        <div className="background-theme" style={{
          padding: 10, width: "101%", marginLeft: (props.widthSelected >= 750 ? -55 : -15),
          marginBottom: 55,
          display: "flex", flexDirection: "column", alignItems: "left", position: "fixed", bottom: 0,
          boxShadow: "1px -2px 2px rgba(128, 128, 128, 0.5)", justifyContent: "center",
        }}>

          <div style={{
            padding: 10, display: "flex", flexDirection: "row", 
            alignItems: 'center', justifyContent: "space-between",
          }}>
            <Button onClick={() => this.props.setViewCart(true)} style={{
              width: "45%", fontWeight: "bold", display: 'flex', 
              justifyContent: "center", alignItems: "center", height: 50
            }}>
              <i className="fa fa-shopping-cart" aria-hidden="true" style={{fontSize: 20, marginRight: 10}}/>
              Detail Order
            </Button>
            {
              props.dataBasket.orderingMode !== "DELIVERY" &&
              <Button
                disabled={(props.dataBasket.status === "CONFIRMED" || props.dataBasket.status === "PROCESSING") ? true : false}
                data-toggle="modal" data-target="#qrcode-modal" style={{
                  width: "45%", backgroundColor: "#20a8d8", fontWeight: "bold",
                  display: 'flex', justifyContent: "center", alignItems: "center", height: 50
                }} >
                <i className="fa fa-qrcode" style={{ fontSize: 20, marginRight: 10 }}></i> Order Code
              </Button>
            }
            {
              props.dataBasket.orderingMode === "DELIVERY" &&
              <Button
                disabled={props.dataBasket.status === "ON_THE_WAY" ? false : true}
                onClick={() => this.props.handleCompletedOrdering("COMPLETED")}
                style={{
                  width: "45%", backgroundColor: "#20a8d8", fontWeight: "bold",
                  display: 'flex', justifyContent: "center", alignItems: "center", height: 50
                }} >
                <CheckCircleOutlineIcon style={{ fontSize: 20, marginRight: 10 }} /> Received
              </Button>
            }
          </div>

        </div>
      </div>
    );
  }
}
