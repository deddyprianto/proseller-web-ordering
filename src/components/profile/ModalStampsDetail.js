import React, { Component } from 'react';
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import moment from "moment";

export default class ModalStampsDetail extends Component {
  render() {
    const { data, detail, image } = this.props
    return (
      <div>
        <div className="modal fade" id="stamps-detail-modal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content" style={{ width: "100%", marginTop: 100, marginBottom: 100 }}>
              <div className="modal-header" style={{ display: "flex", justifyContent: "center" }}>
                <h5 className="modal-title" id="exampleModalLabel" style={{ fontSize: 20 }}>Stamps Detail</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" style={{
                  position: "absolute", right: 10, top: 16
                }}>
                  <span aria-hidden="true" style={{ fontSize: 30 }}>×</span>
                </button>
              </div>
              <div className="modal-body">

                <div className="profile-dashboard" style={{ margin: -16, marginTop: -17, paddingTop: 20, paddingBottom: 10 }}>
                  <div style={{
                    marginTop: 10, display: "flex", flexDirection: "column",
                    justifyContent: "center", alignItems: "center"
                  }} >
                    {
                      data && data.length > 0 && data.map((items, keys) => (
                        <div key={keys} style={{
                          marginBottom: 10, display: "flex", justifyContent: "space-between", width: 50 * items.length
                        }} >
                          {items.map((item, key) =>
                            item.stampsStatus === "-" ? (
                              <div key={key} style={{
                                height: 40, width: 40, borderRadius: 40, display: "flex",
                                flexDirection: "column", justifyContent: "center", alignItems: "center",
                                backgroundColor: "#FFF"
                              }} >
                                <StarBorderIcon className="customer-group-name" style={{ fontSize: 20 }} />
                              </div>
                            ) : (
                                <div key={key} style={{
                                  height: 40, width: 40, borderRadius: 40,
                                  display: "flex", flexDirection: "column", justifyContent: "center",
                                  alignItems: "center", backgroundColor: "#FFF"
                                }} >
                                  <StarIcon style={{ color: "#ffa41b", fontSize: 20 }} />
                                </div>
                              )
                          )}
                        </div>
                      ))
                    }
                  </div>
                  <div style={{ textAlign: "center", fontWeight: "bold", fontSize: 18, color: "#fff", marginBottom: 20 }}>
                    {detail.stampsTitle}
                  </div>
                </div>
                <div className="background-theme" style={{
                  borderTopLeftRadius: 20, borderTopRightRadius: 20, 
                  padding: 10, margin: -16
                }}>
                  <div style={{
                    display: "flex", flexDirection: "column", justifyContent: "center",
                    alignItems: "stretch", textAlign: "center"
                  }} >
                    {detail.stampsSubTitle} <br /> {detail.stampsDesc}
                  </div>
                  <div style={{
                    display: "flex", justifyContent: "center", alignItems: "center"
                  }} >
                    {
                      image && image !== "" &&
                      <img src={image} alt="My stamps" style={{ width: "100%", maxWidth: "333px" }} />
                    }
                  </div>
                  <br />
                  {
                    detail.expiryDate &&
                    <p className="color"><b>Your stamp will expire on {moment(detail.expiryDate).format("DD MMM YYYY")}</b></p>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
