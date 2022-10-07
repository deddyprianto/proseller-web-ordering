import React, { Component } from "react";
import moment from "moment";
import DefaultStampsImage from "./DefaultStampsImage";

export default class ModalStampsDetail extends Component {
  render() {
    const { data, detail, image, closeModal } = this.props;
    return (
      <div
        id="stamps-detail-modal"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1050,
          overflow: "scroll",
          background: "rgba(0,0,0,0.5)",
        }}
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
                Stamps Detail
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
                onClick={closeModal}
              >
                <span aria-hidden="true" style={{ fontSize: 30 }}>
                  ×
                </span>
              </button>
            </div>
            <div className="modal-body">
              <div
                className="profile-dashboard"
                style={{
                  margin: -16,
                  marginTop: -17,
                  paddingTop: 20,
                  paddingBottom: 10,
                }}
              >
                <div
                  style={{
                    marginTop: 10,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {data && data.length > 0 && (
                    <DefaultStampsImage stampsItem={data} />
                  )}
                </div>
                <div
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: 18,
                    color: "#fff",
                    marginBottom: 20,
                  }}
                >
                  {detail.stampsTitle}
                </div>
              </div>
              <div
                className="background-theme"
                style={{
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  padding: 10,
                  margin: -16,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "stretch",
                    textAlign: "center",
                  }}
                >
                  {detail.stampsSubTitle} <br /> {detail.stampsDesc}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {image && image !== "" && (
                    <img
                      src={image}
                      alt="My stamps"
                      style={{ width: "100%", maxWidth: "333px" }}
                    />
                  )}
                </div>
                <br />
                {detail.expiryDate && (
                  <p className="color">
                    <b>
                      Your stamp will expire on{" "}
                      {moment(detail.expiryDate).format("DD MMM YYYY")}
                    </b>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
