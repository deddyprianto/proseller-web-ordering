import React, { Component } from "react";
import { Button } from "reactstrap";

export default class ModalPaymentPermission extends Component {
  render() {
    let { latestCardRegistered, CreditCardSelected, removeDetailDataCard, refreshDatCard } = this.props;
    return (
      <div
        className="modal fade"
        id="payment-method-permission"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          {CreditCardSelected !== null && latestCardRegistered !== null ? (
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
                  style={{ fontSize: 20 }}
                >
                  {CreditCardSelected.paymentName}
                </h5>
                <button
                  id="close-modal-permission-payment"
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
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

              <div className="modal-body" style={{ textAlign: "left" }}>
                <a
                  className="button"
                  style={{
                    width: "100%",
                    marginTop: 10,
                    borderRadius: 5,
                    height: 50,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                  onClick={() => {
                    try{
                      window.open(latestCardRegistered.url, '_blank')
                      setTimeout(() => {
                        document.getElementById('close-modal-permission-payment').click()
                      }, 1000)
                    }catch(e){}
                  }}
                >
                  Register Now
                </a>
                <Button
                  data-dismiss="modal"
                  className="border-theme background-theme"
                  style={{
                    width: "100%",
                    marginTop: 10,
                    fontWeight: "bold",
                    height: 50,
                  }}
                  onClick={() => removeDetailDataCard()}
                >
                  <div className="color-active">Cancel</div>
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
