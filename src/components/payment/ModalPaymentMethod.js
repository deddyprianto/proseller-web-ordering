import React, { Component } from 'react';
import { Button } from 'reactstrap';

export default class ModalPaymentMethod extends Component {
  render() {
    let { detailCard, handleSetDefault, handleRemoveCard } = this.props
    return (
      <div className="modal fade" id="payment-method-modal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          {
            detailCard &&
            <div className="modal-content" style={{ width: "100%", marginTop: 100, marginBottom: 100 }}>
              <div className="modal-header" style={{ display: "flex", justifyContent: "center" }}>
                <h5 className="modal-title" id="exampleModalLabel" style={{ fontSize: 20 }}>
                  {detailCard.details.cardIssuer.toUpperCase()}
                </h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" style={{
                  position: "absolute", right: 10, top: 16
                }}>
                  <span aria-hidden="true" style={{ fontSize: 30 }}>×</span>
                </button>
              </div>

              <div className="modal-body" style={{ textAlign: "left" }}>
                <Button className="button" data-toggle="modal" data-target="#payment-method-modal" style={{
                  width: "100%", marginTop: 10, borderRadius: 5, height: 50
                }} onClick={() => handleSetDefault()}>{`${detailCard.default ? 'Remove' : 'Set'} as Default`}</Button>
                <Button data-toggle="modal" data-target="#payment-method-modal" style={{
                  color: "#c00a27", border: "1px solid #CDCDCD", backgroundColor: "#FFF",
                  width: "100%", marginTop: 10, borderRadius: 5, height: 50, fontWeight: "bold"
                }} onClick={() => handleRemoveCard()}>Remove Credit Card</Button>
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}
