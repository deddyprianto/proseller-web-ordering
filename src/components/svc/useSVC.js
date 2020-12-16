import React, { Component } from "react";
import { Button, Input } from "reactstrap";

export default class RedeemPointBasket extends Component {
  render() {
    let props = this.props.data;
    
    return (
      <div>
        <div
          className="modal fade"
          id="use-svc-modal"
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
                  Use Store Value Card
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  style={{
                    position: "absolute",
                    right: 10,
                    top: 16,
                  }}
                  onClick={() => this.props.cancelAmountSVC()}
                >
                  <span aria-hidden="true" style={{ fontSize: 30 }}>
                    ×
                  </span>
                </button>
              </div>
              <div className="modal-body">
                <div
                  className="profile-dashboard text-btn-theme"
                  style={{
                    margin: -16,
                    marginTop: -17,
                    paddingTop: 20,
                    paddingBottom: 20,
                  }}
                >
                  <div
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: 16,
                      marginBottom: 10,
                    }}
                  >
                    Total Balance
                  </div>
                  <div>
                    <div
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: 30,
                        marginBottom: 10,
                      }}
                    >
                      {this.props.getCurrency(this.props.balance)}
                    </div>
                  </div>
                </div>

                <div
                  className="background-theme"
                  style={{
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    padding: 10,
                    margin: -16,
                  }}
                >
                  <div
                    className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide"
                    style={{ marginTop: 10 }}
                  >
                    <label style={{fontSize: 18}}>
                      Amount to use :
                    </label>
                    <Input
                      type="number"
                      onFocus={() => {
                        if (this.props.data.amountSVC === 0 ) {
                          this.props.setAmountSVC("")
                        }
                      }}
                      value={this.props.data.amountSVC}
                      style={{ height: 40, borderRadius: 5 }}
                      onChange={(e) => {
                        this.props.setAmountSVC(e.target.value)
                      }}
                    />
                  </div>

                  <div
                    style={{
                      marginTop: 10,
                      marginBottom: 15,
                      textAlign: "center",
                    }}
                  ></div>

                  <Button
                    onClick={this.props.getDataBasket}
                    className="button"
                    data-dismiss="modal"
                    disabled={!((Number(props.amountSVC) <= Number(this.props.balance)) && Number(props.amountSVC) <= Number(this.props.data.totalPrice) && props.amountSVC > 0 && props.amountSVC !== "")}
                    style={{
                      width: "100%",
                      marginTop: 10,
                      borderRadius: 5,
                      height: 50,
                    }}
                  >{`Use ${this.props.getCurrency(this.props.data.amountSVC)}`}</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
