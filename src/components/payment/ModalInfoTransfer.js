import React, { Component } from "react";
import { Button } from "reactstrap";
import parse from 'html-react-parser';

export default class ModalInfoTransfer extends Component {

  getDesc = () => {
    let { selectedCard, totalAmount, isPendingCart } = this.props;
    
    if (selectedCard && selectedCard.description && isPendingCart) {
      let paymentDesc = selectedCard.description.replace('{amount}', `SGD ${totalAmount}`);
      paymentDesc = parse(paymentDesc);
      return paymentDesc;
    }

    try {
      let desc = selectedCard.configurations.find(item => item.name === "payment_description").value;
      if (desc) {
        desc = desc.replace('{amount}', `SGD ${totalAmount}`);
        desc = parse(desc);
        return desc;
      }
      return ''
    } catch(e) {
      return null;
    }
  }

  getImage = () => {
    let { selectedCard, totalAmount, isPendingCart } = this.props;
    
    if (selectedCard && selectedCard.manual_transfer_image && isPendingCart) {
      return selectedCard.manual_transfer_image;
    }

    try {
      let image = selectedCard.configurations.find(item => item.name === "manual_transfer_image").value;
      if (image) {
        return image;
      }
      return ''
    } catch(e) {
      return null;
    }
  }

  render() {
    let { isPendingCart } = this.props;
    return (
      <div
        className="modal fade"
        id="modal-info-transfer"
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
                style={{ fontSize: 20 }}
              >
                How to Transfer ?
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

              <center>
                <img className="img-thumbnail" src={this.getImage()} style={{ width: '80%' }} />
                <br />
                <br />
               <div style={{ width: '80%' }}><h5 style={{ textAlign: 'left', whiteSpace: 'pre', fontSize: 17, lineHeight: 1.4, whiteSpace: 'pre-wrap' }}>{this.getDesc()}</h5></div>
               <br />
              </center>
              {
                !isPendingCart &&
                <a
                  className="button"
                  style={{
                    width: "100%",
                    marginTop: 10,
                    borderRadius: 5,
                    height: 50,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onClick={() => {
                    try {
                      this.props.handleSettle()
                    } catch (e) {}
                  }}
                >
                  Continue
                </a>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
