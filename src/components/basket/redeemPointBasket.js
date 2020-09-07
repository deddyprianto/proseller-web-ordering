import React, { Component } from 'react';
import Slider from 'react-input-slider';
import { Button } from 'reactstrap';

export default class RedeemPointBasket extends Component {
  render() {
    let props = this.props.data
    let money = props.selectedPoint / props.pointsToRebateRatio.split(":")[0]
    money = money.toFixed(2);
    // if (props.detailPoint.roundingOptions !== "DECIMAL") money = Math.floor(money);
    // else money = money.toFixed(2);

    return (
      <div>
        <div className="modal fade" id="redeem-point-modal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content" style={{ width: "100%", marginTop: 100, marginBottom: 100 }}>
              <div className="modal-header" style={{ display: "flex", justifyContent: "center" }}>
                <h5 className="modal-title" id="exampleModalLabel" style={{ fontSize: 20 }}>Pick Points</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" style={{
                  position: "absolute", right: 10, top: 16
                }} onClick={() => this.props.cancelSelectPoint()}>
                  <span aria-hidden="true" style={{ fontSize: 30 }}>×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="profile-dashboard" style={{ margin: -16, marginTop: -17, paddingTop: 20, paddingBottom: 20 }}>
                  <div style={{ textAlign: "center", fontWeight: "bold", fontSize: 16, color: "#fff", marginBottom: 10 }}>
                    My Points
                    </div>
                  <div style={{ textAlign: "center", fontWeight: "bold", fontSize: 40, color: "#fff", marginBottom: 10 }}>
                    {props.detailPoint.point}
                  </div>
                  <div style={{ textAlign: "center", marginBottom: 20 }} >
                    <div style={{ color: "#FFF", fontSize: 14, fontWeight: "bold" }}>
                      {props.textRasio}
                    </div>
                  </div>
                </div>

                <div style={{
                  backgroundColor: "#FFF", borderTopLeftRadius: 20,
                  borderTopRightRadius: 20, padding: 10, margin: -16
                }}>
                  <div style={{
                    display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center",
                  }}>
                    <div style={{ color: "#ffa41b", fontWeight: "bold" }}>{props.selectedPoint}</div>
                    <div style={{ color: "gray", fontWeight: "bold", marginLeft: 5, marginRight: 5 }}>{"points to"}</div>
                    <div style={{ color: "#ffa41b", fontWeight: "bold" }}>{this.props.getCurrency(money)}</div>
                  </div>

                  <div style={{ marginTop: 10, marginBottom: 15, textAlign: 'center' }}>
                    <Slider
                      axis="x"
                      xstep={props.xstep}
                      x={props.selectedPoint}
                      onChange={({ x }) => this.props.scrollPoint(x)}
                      xmax={props.needPoint}
                      styles={{
                        track: { backgroundColor: 'gray' },
                        active: { backgroundColor: '#20a8d8' },
                        thumb: { width: 20, height: 20 },
                      }}
                    />
                  </div>

                  <Button className="button"
                    data-toggle="modal" data-target="#redeem-point-modal"
                    onClick={() => this.props.setPoint(props.selectedPoint)}
                    style={{
                      width: "100%", marginTop: 10, borderRadius: 5, height: 50
                    }}>{`Set Point - ${this.props.getCurrency(money)}`}</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
