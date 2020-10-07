import React, { Component } from 'react';
import ScheduleIcon from '@material-ui/icons/Schedule';
import moment from "moment";

export default class ModalPointsDetail extends Component {
  render() {
    const { detailPoint } = this.props
    return (
      <div>
        <div className="modal fade" id="points-detail-modal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content" style={{ width: "100%", marginTop: 100, marginBottom: 100 }}>
              <div className="modal-header" style={{ display: "flex", justifyContent: "center" }}>
                <h5 className="modal-title" id="exampleModalLabel" style={{ fontSize: 20 }}>Point Detail</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" style={{
                  position: "absolute", right: 10, top: 16
                }}>
                  <span aria-hidden="true" style={{ fontSize: 30 }}>×</span>
                </button>
              </div>
              {
                detailPoint &&
                <div className="modal-body">

                  <div className="profile-dashboard" style={{ margin: -16, marginTop: -17, paddingTop: 20, paddingBottom: 20 }}>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: 16, color: "#fff", marginBottom: 10 }}>
                      My Points
                    </div>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: 40, color: "#fff", marginBottom: 20 }}>
                      {detailPoint.point}
                    </div>
                  </div>
                  <div style={{
                    backgroundColor: "#FFF", borderTopLeftRadius: 20,
                    borderTopRightRadius: 20, padding: 10, margin: -16
                  }}>
                    <div style={{ textAlign: "center" }} >
                      <div style={{ color: "gray", fontSize: 16, fontWeight: "bold" }}>
                        Campaign Rules
                        </div>
                      <div style={{ color: "#ffa41b", fontSize: 18, fontWeight: "bold" }}>
                        {`${detailPoint.netSpendToPoint.split(":")[0]} : ${detailPoint.netSpendToPoint.split(":")[1]}`}
                      </div>
                      <div style={{ color: "#ffa41b", fontSize: 14, fontWeight: "bold" }}>
                        {`Get ${detailPoint.netSpendToPoint.split(":")[1]} points for every $${detailPoint.netSpendToPoint.split(":")[0]} Purchases`}
                      </div>
                    </div>
                    <div style={{ backgroundColor: "#CDCDCD", height: 1, marginTop: 10, marginBottom: 10 }} />
                    <div style={{ textAlign: "center" }} >
                      <div style={{ color: "gray", fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
                        Expiry
                        </div>
                      {
                        detailPoint.detail.map((items, key) => (
                          <div key={key} style={{
                            display: "flex", border: "1px solid #CDCDCD", borderRadius: 5, padding: 5, paddingLeft: 10, marginBottom: 5,
                            alignItems: "center"
                          }}>
                            <ScheduleIcon style={{ fontSize: 30, color: "gray" }} />
                            <div style={{ marginLeft: 10 }}>
                              <div style={{ display: "flex" }}>
                                <div style={{ color: "gray", fontWeight: "bold", fontSize: 14 }}>
                                  Point :
                                </div>
                                <div style={{ color: "#ffa41b", fontWeight: "bold", marginLeft: 5, fontSize: 14 }}>
                                  {items.pointBalance}
                                </div>
                              </div>

                              <div style={{ display: "flex", marginTop: -5 }}>
                                <div style={{ color: "gray", fontWeight: "bold", fontSize: 14 }}>
                                  Expiry :
                                </div>
                                <div style={{ color: "#ffa41b", fontWeight: "bold", marginLeft: 5, fontSize: 14 }}>
                                  {moment(items.expiryDate).format('DD-MM-YYYY')}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>

                </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
