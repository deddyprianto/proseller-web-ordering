import React, { Component } from 'react';
import Slider from 'react-input-slider';
import { Button } from 'reactstrap';

export default class RedeemPointBasket extends Component {
  render() {
    let props = this.props.data

    if (props.detailPoint.point === undefined) props.detailPoint.point = props.detailPoint.detailPoint.point

    let totalPoint = this.props.campaignPoint.totalPoint
    totalPoint = totalPoint - (props.pendingPoints || 0)
    
    if (props.dataSettle.paySVC || props.amountSVC === 0) {
      totalPoint = totalPoint - (this.props.campaignPoint.lockPoints || 0)
      if(props.detailPoint.roundingOptions !== "DECIMAL") {
        totalPoint = Math.floor(totalPoint);
      }
    }
     
    let diffPoints = 0
    if (props.percentageUseSVC > 0) {
      let minusPoint = 0;
      minusPoint = (props.amountSVC/this.props.defaultBalance) * this.props.campaignPoint.defaultPoints 
      let diff = this.props.campaignPoint.lockPoints - minusPoint
      diff = diff < 0 ? 0 : diff
      diffPoints = diff
      totalPoint = totalPoint - diff
      
      if(props.detailPoint.roundingOptions !== "DECIMAL") {
        totalPoint = Math.floor(totalPoint);
      }
    }

    if (totalPoint < 0) totalPoint = 0

    let discountPoint = (props.selectedPoint / props.pointsToRebateRatio.split(":")[0]) * props.pointsToRebateRatio.split(":")[1]
    if(discountPoint > (props.discountPoint + props.totalPrice)) discountPoint = props.discountPoint + props.totalPrice
    discountPoint = discountPoint.toFixed(2);

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
                <div className="profile-dashboard text-btn-theme" style={{ margin: -16, marginTop: -17, paddingTop: 20, paddingBottom: 20 }}>
                  <div style={{ textAlign: "center", fontWeight: "bold", fontSize: 16, marginBottom: 10 }}>
                    My Points
                  </div>
                  <div >
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: 40, marginBottom: 10 }}>
                      {totalPoint}
                    </div>
                    {
                      props.pendingPoints && props.pendingPoints > 0 ?
                      <div style={{textAlign: "center", marginRight: -50, textDecorationLine: "line-through", marginTop: -12}}>
                        {props.detailPoint.point}
                      </div>
                      :
                      null
                    }
                  </div>
                  {
                    diffPoints > 0 ?
                    <div className="text" style={{
                      fontSize: 14, border: "1px solid #DCDCDC", borderRadius: 5, padding: 5, lineHeight: "17px",
                      marginTop: 10, marginBottom: 10, marginLeft: 10, marginRight: 10, textAlign: "justify"
                    }}>
                      {`Your ${diffPoints} SVC points is locked because you haven't used up your entire SVC balance.`}
                    </div> : null
                  }
                  {
                    this.props.campaignPoint && this.props.campaignPoint.lockPoints && props.dataSettle.paySVC ?
                    <div className="text" style={{
                      fontSize: 14, border: "1px solid #DCDCDC", borderRadius: 5, padding: 5, lineHeight: "17px",
                      marginTop: 10, marginBottom: 10, marginLeft: 10, marginRight: 10, textAlign: "justify"
                    }}>
                      {`Your ${this.props.campaignPoint.lockPoints} SVC points is locked on SVC Purchase.`}
                    </div> : null
                  }
                  {
                    props.pendingPoints && props.pendingPoints > 0 ?
                    <div className="text" style={{
                      fontSize: 14, border: "1px solid #DCDCDC", borderRadius: 5, padding: 5, lineHeight: "17px",
                      marginTop: 10, marginBottom: 10, marginLeft: 10, marginRight: 10, textAlign: "justify"
                    }}>
                      {`Your ${props.pendingPoints} points is blocked, because your order has not been completed.`}
                    </div> : null
                  }
                  <div style={{ textAlign: "center", marginBottom: 20 }} >
                    <div style={{ fontSize: 14, fontWeight: "bold" }}>
                      {props.textRasio}
                    </div>
                  </div>
                </div>

                <div className="background-theme" style={{
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20, padding: 10, margin: -16
                }}>
                  <div style={{
                    display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center",
                  }}>
                    <div className="color-active" style={{ fontWeight: "bold" }}>{props.selectedPoint}</div>
                    <div style={{ fontWeight: "bold", marginLeft: 5, marginRight: 5 }}>{"points to"}</div>
                    <div className="color-active" style={{ fontWeight: "bold" }}>{this.props.getCurrency(discountPoint)}</div>
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
                    onClick={() => this.props.setPoint(props.selectedPoint, discountPoint)}
                    style={{
                      width: "100%", marginTop: 10, borderRadius: 5, height: 50
                    }}>{`Set Point - ${this.props.getCurrency(discountPoint)}`}</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
