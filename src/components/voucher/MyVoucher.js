import React, { Component } from "react";
import { CustomerAction } from "../../redux/actions/CustomerAction";
import { connect } from "react-redux";
import Shimmer from "react-shimmer-effect";
import { Col, Row } from "reactstrap";
import voucherIcon from "../../assets/images/voucher-icon.png";
import GiftVoucherModal from "./GiftVoucherModal";
import moment from "moment";
import config from "../../config";

class MyVoucher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMyVoucher: true,
      loadingShow: true,
      showGiftModal: false,
      voucherToGift: null,
    };
  }

  componentDidMount = () => {
    this.props.dispatch(CustomerAction.getVoucher());
  };

  viewShimmer = (isHeight = 100) => {
    return (
      <Shimmer>
        <div
          style={{
            width: "100%",
            height: isHeight,
            alignSelf: "center",
            borderRadius: "8px",
            marginBottom: 10,
          }}
        />
      </Shimmer>
    );
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.myVoucher !== this.props.myVoucher) {
      if (this.state.voucherToGift) {
        const newSelectedVoucher = this.props.myVoucher.find(
          (item) => item.id === this.state.voucherToGift.id
        );
        this.setState({ voucherToGift: newSelectedVoucher });
      }
    }
  };

  render() {
    let { showGiftModal, voucherToGift } = this.state;
    let { myVoucher } = this.props;

    if (this.props.handleSelect && myVoucher) {
      myVoucher = myVoucher.filter((items) => {
        return items.validity.canOnlyRedeemedByMerchant !== true;
      });
    }

    return (
      <div>
        {showGiftModal && (
          <GiftVoucherModal
            voucher={voucherToGift}
            onClose={() =>
              this.setState({ showGiftModal: false, voucher: null })
            }
          ></GiftVoucherModal>
        )}
        {!myVoucher && (
          <Row>
            <Col sm={6}>{this.viewShimmer()}</Col>
            <Col sm={6}>{this.viewShimmer()}</Col>
          </Row>
        )}
        {myVoucher && (
          <Row>
            {myVoucher.map((item, key) => (
              <Col key={key} sm={6}>
                <div
                  style={{
                    marginBottom: 10,
                    width: "100%",
                    boxShadow: "0px 0px 5px rgba(128, 128, 128, 0.5)",
                    cursor: "pointer",
                    display: "flex",
                    borderRadius: 10,
                  }}
                  onClick={() =>
                    this.props.handleSelect && this.props.handleSelect(item)
                  }
                >
                  {!this.props.handleSelect &&
                    item.validity.allowCustomerToSendVoucher && (
                      <div
                        className="profile-dashboard"
                        style={{
                          position: "absolute",
                          width: "29%",
                          paddingLeft: 5,
                          paddingRight: 5,
                          fontSize: 12,
                          bottom: 0,
                          left: 15,
                          borderTopRightRadius: 10,
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        <button
                          style={{
                            fontSize: "1.2rem",
                            padding: 0,
                            borderRadius: "1rem",
                            backgroundColor: "rgba(0,0,0,0)",
                          }}
                          onClick={() => {
                            this.props.dispatch({ type: "INIT_VOUCHER_SEND" });
                            this.setState({
                              showGiftModal: true,
                              voucherToGift: item,
                            });
                          }}
                        >
                          <i className="fa fa-gift"></i> Send Gift
                        </button>
                      </div>
                    )}

                  <div
                    className="profile-dashboard text-btn-theme"
                    style={{
                      position: "absolute",
                      width: 50,
                      paddingLeft: 10,
                      paddingRight: 10,
                      fontSize: 12,
                      borderRadius: 0,
                      borderBottomLeftRadius: 10,
                      right: 15,
                      fontWeight: "bold",
                    }}
                  >
                    {item.totalRedeem + "x"}
                  </div>

                  <img
                    style={{
                      width: "50%",
                      height: 100,
                      objectFit: "contain",
                      overflow: "hidden",
                    }}
                    src={item.image ? item.image : voucherIcon}
                    alt="voucher"
                  />

                  <div
                    style={{
                      width: "100%",
                      marginLeft: 10,
                      marginRight: 10,
                      textAlign: "left",
                      marginTop: 5,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      className="customer-group-name"
                      style={{
                        fontSize: 14,
                        fontWeight: "bold",
                        lineHeight: "17px",
                      }}
                    >
                      {item.name}
                    </div>
                    {item.voucherDesc && (
                      <div style={{ fontSize: 12, marginTop: -5 }}>
                        <i
                          className="fa fa-commenting-o"
                          aria-hidden="true"
                        ></i>{" "}
                        {item.voucherDesc}
                      </div>
                    )}
                    {item.expiryDate && (
                      <div style={{ fontSize: 12, marginTop: -5 }}>
                        <i className="fa fa-clock-o" aria-hidden="true"></i>{" "}
                        {`Expire on ${moment(item.expiryDate).format(
                          "DD MMM YYYY"
                        )}`}
                      </div>
                    )}
                    <div
                      className="customer-group-name"
                      style={{
                        fontSize: 12,
                        fontWeight: "bold",
                        marginTop: -5,
                      }}
                    >
                      {`Discount ${
                        item.voucherType === "discPercentage"
                          ? item.voucherValue + "%"
                          : "$" + item.voucherValue
                      }`}
                    </div>
                  </div>
                </div>
              </Col>
            ))}
            {myVoucher.length === 0 && (
              <div>
                {/* <Lottie
                  options={{ animationData: emptyGif }}
                  style={{ height: 250 }}
                /> */}
                <img
                  src={config.url_emptyImage}
                  alt="is empty"
                  style={{ marginTop: 30 }}
                />
                <div>Data is empty</div>
              </div>
            )}
          </Row>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    account: state.auth.account.idToken.payload,
    myVoucher: state.customer.myVoucher,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(MyVoucher);
