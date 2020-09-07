import React, { Component } from 'react';

export default class ModalOrderingMode extends Component {
  render() {
    let props = this.props.data
    return (
      <div className="modal fade" id="ordering-mode-basket-modal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-dialog-product modal-dialog-centered modal-full" role="document" style={{ justifyContent: 'center', width: "100%" }}>
          <div className="modal-content modal-ordering-mode">
            <div className="modal-header modal-header-product" style={{ display: "flex", justifyContent: "center", padding: 7 }}>
              <h5 style={{ fontSize: 17, marginTop: 10 }} className="color">Select your dining preference</h5>
            </div>
            <div className="modal-body">
              <div className="col-md-12">
                <div style={{
                  display: 'flex', justifyContent: 'center', overflowX: 'auto',
                  overflowY: 'hidden', marginLeft: -30, marginRight: -30,
                }}>
                  {
                    props.storeDetail.enableDineIn !== false &&
                    <div className="order-mode" data-dismiss="modal"
                      onClick={() => this.props.setOrderingMode('DINEIN')}>
                      <h5 className="color" style={{ fontWeight: 1000 }}>DINEIN</h5>
                      <i className="fa fa-cutlery color icon-order"></i>
                      <button className="btn btn-block btn-footer" style={{ marginTop: 37 }}><b>Select</b></button>
                    </div>
                  }
                  {
                    props.storeDetail.enableDineIn !== false &&
                    <div className="order-mode" data-dismiss="modal" onClick={() => this.props.setOrderingMode('TAKEAWAY')}>
                      <h5 className="color" style={{ fontWeight: 1000 }}>TAKE AWAY</h5>
                      <i className="fa fa-shopping-basket color icon-order"></i>
                      <button className="btn btn-block btn-footer" style={{ marginTop: 37 }}><b>Select</b></button>
                    </div>
                  }
                  {/* {
                    props.storeDetail.enableDelivery !== false &&
                    <div className="order-mode" data-dismiss="modal" onClick={() => this.props.setOrderingMode('DELIVERY')}>
                      <h5 className="color" style={{ fontWeight: 1000 }}>DELIVERY</h5>
                      <i className="fa fa-car color icon-order"></i>
                      <button className="btn btn-block btn-footer" style={{ marginTop: 37 }}><b>Select</b></button>
                    </div>
                  } */}
                </div>
                <p id="dismiss-ordering-mode-basket-modal" data-dismiss="modal" className="color" style={{ cursor: 'pointer', textDecoration: 'underline', textAlign: 'center', marginTop: 30, marginBottom: 20 }}>
                  I'm just browsing
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
