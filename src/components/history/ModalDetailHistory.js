import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { isEmptyArray } from "../../helpers/CheckEmpty";

class ModalDetailHistory extends Component {
  getCurrency = (price) => {
    if (this.props.companyInfo) {
      if (price !== undefined) {
        const { currency } = this.props.companyInfo;
        if (!price || price === "-") price = 0;
        let result = price.toLocaleString(currency.locale, {
          style: "currency",
          currency: currency.code,
        });
        return result;
      }
    }
  };

  render() {
    const { detail } = this.props;
    let discount = 0
    if(detail.payments){
      detail.payments.forEach(items => {
        if(items.paymentType === "voucher" || items.paymentType === "point"){
          discount += items.paymentAmount
        }
      });
    }

    return (
      <div>
        <div
          className="modal fade"
          id="detail-transaction-modal"
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
                  style={{ fontSize: 18 }}
                >
                  Detail Transaction
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  style={{
                    position: "absolute",
                    right: 10,
                    top: 13,
                  }}
                >
                  <span aria-hidden="true" style={{ fontSize: 30 }}>
                    ×
                  </span>
                </button>
              </div>
              {Object.keys(detail).length > 0 && (
                <div className="modal-body">
                  {
                    (detail.transactionRefNo || detail.referenceNo) &&
                    <dev>
                      <div
                        style={{
                          marginLeft: 5,
                          marginRight: 5,
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{ fontSize: 14, textAlign: "left", lineHeight: "17px" }}>REF NO.</div>
                        <div style={{ fontSize: 14, fontWeight: "bold", textAlign: "right", lineHeight: "17px" }}>
                          {(detail.transactionRefNo || detail.referenceNo)}
                        </div>
                      </div>

                      <div
                        style={{
                          backgroundColor: "#CDCDCD",
                          height: 1,
                          marginTop: 10,
                          marginBottom: 10,
                        }}
                      />
                    </dev>
                  }

                  <div
                    style={{
                      marginLeft: 5,
                      marginRight: 5,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ fontSize: 14 }}>DATE</div>
                    <div style={{ fontSize: 14, fontWeight: "bold" }}>
                      {moment(detail.createdAt).format("ll") +
                        " • " +
                        moment(detail.createdAt).format("LT")}
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: "#CDCDCD",
                      height: 1,
                      marginTop: 10,
                      marginBottom: 10,
                    }}
                  />
                  {
                    detail.outletName &&
                    <div
                      style={{
                        marginLeft: 5,
                        marginRight: 5,
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ fontSize: 14, textAlign: "left", lineHeight: "17px" }}>OUTLET NAME</div>
                      <div style={{ fontSize: 14, fontWeight: "bold", textAlign: "right", lineHeight: "17px" }}>
                        {detail.outletName}
                      </div>
                    </div>
                  }

                  <div
                    style={{
                      backgroundColor: "#CDCDCD",
                      height: 1,
                      marginTop: 10,
                      marginBottom: 10,
                    }}
                  />
                  <div
                    style={{
                      marginLeft: 5,
                      marginRight: 5,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ fontSize: 14 }}>EARNED POINTS</div>
                    <div style={{ fontSize: 14, fontWeight: "bold" }}>
                      {detail.point}
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: "#CDCDCD",
                      height: 1,
                      marginTop: 10,
                      marginBottom: 10,
                    }}
                  />
                  <div style={{ fontSize: 14, textAlign: "left" }}>ITEMS</div>
                  {!isEmptyArray(detail.dataPay) && detail.dataPay.map((item, key) => (
                    <div
                      key={key}
                      style={{
                        marginLeft: 10,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: 5,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: "bold",
                          textAlign: "left",
                        }}
                      >{`${item.qty}x ${item.itemName}`}</div>
                      <div style={{ fontSize: 12, fontWeight: "bold" }}>
                        {this.getCurrency(item.totalNettAmount)}
                      </div>
                    </div>
                  ))}

                  {isEmptyArray(detail.dataPay) && !isEmptyArray(detail.details) && detail.details.map((item, key) => (
                    <div
                      key={key}
                      style={{
                        marginLeft: 10,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: 5,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: "bold",
                          textAlign: "left",
                        }}
                      >{`${item.period} ${item.periodUnit.toLowerCase()} Membership ${item.name}`}</div>
                      <div style={{ fontSize: 12, fontWeight: "bold" }}>
                        {this.getCurrency(item.price)}
                      </div>
                    </div>
                  ))}

                  <div
                    style={{ 
                      backgroundColor: "#CDCDCD", height: 1,
                      marginTop: 10, marginBottom: 10,
                    }}
                  />
                  <div
                    style={{
                      marginLeft: 5,  marginRight: 5,
                      display: "flex", justifyContent: "space-between",
                    }}
                  >
                    <div style={{ fontSize: 14 }}>SUBTOTAL</div>
                    <div style={{ fontSize: 14, fontWeight: "bold" }}>
                      {this.getCurrency(detail.totalGrossAmount || detail.price)}
                    </div>
                  </div>

                  {
                    detail.deliveryFee ?
                    <div>
                      <div
                        style={{
                          backgroundColor: "#CDCDCD",
                          height: 1,
                          marginTop: 10,
                          marginBottom: 10,
                        }}
                      />
                      <div
                        style={{
                          marginLeft: 5,
                          marginRight: 5,
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{ fontSize: 14 }}>DELIVERY FEE</div>
                        <div style={{ fontSize: 14, fontWeight: "bold" }}>
                          {`+ ${this.getCurrency(detail.deliveryFee)}`}
                        </div>
                      </div>
                    </div> : null
                  }
                
                  <div
                    style={{ 
                      backgroundColor: "#CDCDCD", height: 1,
                      marginTop: 10, marginBottom: 10,
                    }}
                  />

                  {
                    detail.totalTaxAmount &&
                    <div
                      style={{
                        marginLeft: 5,  marginRight: 5,
                        display: "flex", justifyContent: "space-between",
                      }}
                    >
                      <div style={{ fontSize: 14 }}>TAX AMOUNT</div>
                      <div style={{ fontSize: 14, fontWeight: "bold" }}>
                        {`+ ${this.getCurrency(detail.totalTaxAmount)}`}
                      </div>
                    </div>
                  }

                  {
                    detail.payments &&
                    <div>
                      <div
                        style={{ 
                          backgroundColor: "#CDCDCD", height: 1,
                          marginTop: 10, marginBottom: 10,
                        }}
                      />
                      {
                        detail.payments.map((items, key) => (
                          (items.paymentType === "voucher" || items.paymentType === "point") &&
                          <div key={key}
                            style={{ 
                              marginLeft: 5, marginRight: 5, 
                              display: "flex", justifyContent: "flex-end", color: "#03AC0E"
                            }}
                          >
                            <div style={{ fontSize: 14, marginRight: 10 }}>{items.paymentName}</div>
                            <div style={{ fontSize: 14, fontWeight: "bold" }}>
                              {`- ${this.getCurrency(items.paymentAmount)}`}
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  }

                  <div
                    style={{
                      backgroundColor: "#CDCDCD",
                      height: 1,
                      marginTop: 10,
                      marginBottom: 10,
                    }}
                  />
                  <div
                    style={{
                      marginLeft: 5,
                      marginRight: 5,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ fontSize: 14 }}>TOTAL</div>
                    <div style={{ fontSize: 14, fontWeight: "bold" }}>
                      {detail.totalNettAmount === undefined ? this.getCurrency(detail.price) :
                        this.getCurrency(
                        (
                          detail.totalNettAmount - discount
                        ) < 0 ? 0 :
                        (
                          detail.totalNettAmount - discount
                        )
                      )}
                    </div>
                  </div>

                  {
                    detail.paymentType &&
                    <div>
                      <div
                        style={{
                          backgroundColor: "#CDCDCD",
                          height: 1,
                          marginTop: 10,
                          marginBottom: 10,
                        }}
                      />
                      <div style={{ fontSize: 14, textAlign: "left" }}>
                        PAYMENT TYPE
                      </div>
                      {detail.paymentType && (
                        <div
                          style={{
                            marginLeft: 10,
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <div style={{ fontSize: 14, fontWeight: "bold" }}>
                            {detail.paymentCard.paymentName}
                          </div>
                          <div style={{ fontSize: 14, fontWeight: "bold" }}>
                            {detail.totalNettAmount === undefined ? this.getCurrency(detail.price) : this.getCurrency((detail.totalNettAmount - discount))}
                          </div>
                        </div>
                      )}
                    </div>
                  }

                  <div
                    style={{
                      backgroundColor: "#CDCDCD",
                      height: 1,
                      marginTop: 10,
                      marginBottom: 10,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    companyInfo: state.masterdata.companyInfo.data,
  };
};

export default connect(mapStateToProps, {})(ModalDetailHistory);
