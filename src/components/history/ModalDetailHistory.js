import React, { Component } from 'react';
import moment from 'moment';

export default class ModalDetailHistory extends Component {
  getCurrency = (price) => {
    if (price != undefined) {
      let code = this.props.countryCode
      let currency = { code: 'en-US', currency: 'SGD' };
      if (code === "SG") currency = { code: 'en-US', currency: 'SGD' };

      if (price === "-") price = 0;
      let result = price.toLocaleString(currency.code, { style: 'currency', currency: currency.currency });
      return result
    }
  };

  render() {
    const { detail } = this.props
    return (
      <div>
        <div className="modal fade" id="detail-transaction-modal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content" style={{ width: "100%", marginTop: 100, marginBottom: 100 }}>
              <div className="modal-header" style={{ display: "flex", justifyContent: "center" }}>
                <h5 className="modal-title" id="exampleModalLabel" style={{ fontSize: 18 }}>Detail Transaction</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" style={{
                  position: "absolute", right: 10, top: 13
                }}>
                  <span aria-hidden="true" style={{ fontSize: 30 }}>×</span>
                </button>
              </div>
              {
                Object.keys(detail).length > 0 &&
                <div className="modal-body">
                  <div style={{ marginLeft: 5, marginRight: 5, display: "flex", justifyContent: "space-between" }}>
                    <div style={{ fontSize: 14 }}>DATE</div>
                    <div style={{ fontSize: 14, fontWeight: "bold" }}>{moment(detail.createdAt).format('ll') + ' • ' + moment(detail.createdAt).format('LT')}</div>
                  </div>

                  <div style={{ backgroundColor: "#CDCDCD", height: 1, marginTop: 10, marginBottom: 10 }} />
                  <div style={{ marginLeft: 5, marginRight: 5, display: "flex", justifyContent: "space-between" }}>
                    <div style={{ fontSize: 14 }}>OUTLET NAME</div>
                    <div style={{ fontSize: 14, fontWeight: "bold" }}>{detail.outletName}</div>
                  </div>

                  <div style={{ backgroundColor: "#CDCDCD", height: 1, marginTop: 10, marginBottom: 10 }} />
                  <div style={{ marginLeft: 5, marginRight: 5, display: "flex", justifyContent: "space-between" }}>
                    <div style={{ fontSize: 14 }}>EARNED POINTS</div>
                    <div style={{ fontSize: 14, fontWeight: "bold" }}>{detail.point}</div>
                  </div>

                  <div style={{ backgroundColor: "#CDCDCD", height: 1, marginTop: 10, marginBottom: 10 }} />
                  <div style={{ fontSize: 14, textAlign: "left" }}>ITEMS</div>
                  {
                    detail.dataPay.map((item, key) => (
                      <div key={key} style={{
                        marginLeft: 10, display: "flex", flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: 5
                      }}>
                        <div style={{ fontSize: 12, fontWeight: "bold", textAlign: "left" }}>{`${item.qty}x ${item.itemName}`}</div>
                        <div style={{ fontSize: 12, fontWeight: "bold" }}>{this.getCurrency(item.price)}</div>
                      </div>
                    ))
                  }

                  <div style={{ backgroundColor: "#CDCDCD", height: 1, marginTop: 10, marginBottom: 10 }} />
                  <div style={{ marginLeft: 5, marginRight: 5, display: "flex", justifyContent: "space-between" }}>
                    <div style={{ fontSize: 14 }}>TOTAL</div>
                    <div style={{ fontSize: 14, fontWeight: "bold" }}>
                      {this.getCurrency(detail.beforePrice)}
                    </div>
                  </div>

                  {/* <div style={{ backgroundColor: "#CDCDCD", height: 1, marginTop: 10, marginBottom: 10 }} />
                  <div style={{ marginLeft: 5, marginRight: 5, display: "flex", justifyContent: "space-between" }}>
                    <div style={{ fontSize: 14 }}>SUBTOTAL</div>
                    <div style={{ fontSize: 14, fontWeight: "bold" }}>{this.getCurrency(detail.price)}</div>
                  </div> */}

                  {
                    detail.statusAdd && detail.statusAdd === "addVoucher" &&
                    <div>
                      <div style={{ backgroundColor: "#CDCDCD", height: 1, marginTop: 10, marginBottom: 10 }} />
                      <div style={{ fontSize: 14, textAlign: "left" }}>DISCOUNT</div>
                      <div style={{ marginLeft: 10, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ fontSize: 14, fontWeight: "bold" }}>Voucher</div>
                        <div style={{ fontSize: 14, fontWeight: "bold" }}>{this.getCurrency(detail.discount)}</div>
                      </div>
                    </div>
                  }

                  {
                    (detail.statusAdd && detail.statusAdd === "addPoint" || detail.paymentType) &&
                    <div>
                      <div style={{ backgroundColor: "#CDCDCD", height: 1, marginTop: 10, marginBottom: 10 }} />
                      <div style={{ fontSize: 14, textAlign: "left" }}>PAYMENT TYPE</div>
                      {
                        detail.paymentType &&
                        <div style={{ marginLeft: 10, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ fontSize: 14, fontWeight: "bold" }}> {detail.paymentType} </div>
                          <div style={{ fontSize: 14, fontWeight: "bold" }}>
                            {this.getCurrency(detail.afterPrice)}
                          </div>
                        </div>
                      }
                      {
                        detail.statusAdd && detail.statusAdd === "addPoint" &&
                        <div style={{ marginLeft: 10, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ fontSize: 14, fontWeight: "bold" }}>Points</div>
                          <div style={{ fontSize: 14, fontWeight: "bold" }}>
                            {
                              this.getCurrency(detail.redeemedPointAmount)
                            }
                          </div>
                        </div>
                      }
                    </div>
                  }

                  <div style={{ backgroundColor: "#CDCDCD", height: 1, marginTop: 10, marginBottom: 10 }} />
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
