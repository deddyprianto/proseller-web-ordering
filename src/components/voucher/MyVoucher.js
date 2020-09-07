import React, { Component } from 'react';
import { CustomerAction } from '../../redux/actions/CustomerAction';
import { connect } from "react-redux";
import _ from 'lodash';
import Shimmer from "react-shimmer-effect";
import {
  Col,
  Row,
} from 'reactstrap';
import voucherIcon from '../../assets/images/voucher-icon.png'
import Lottie from 'lottie-react-web';
import emptyGif from '../../assets/gif/empty-and-lost.json';

class MyVoucher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMyVoucher: true,
      myVoucher: [],
      loadingShow: true,
    }
  }

  componentDidMount = async () => {
    let response = await this.props.dispatch(CustomerAction.getVoucher());
    if (response.ResultCode === 200) this.setState({ myVoucher: response.Data })
    this.setState({ loadingShow: false })
  }

  viewShimmer = (isHeight = 100) => {
    return (
      <Shimmer>
        <div style={{
          width: "100%", height: isHeight, alignSelf: "center",
          borderRadius: "8px", marginBottom: 10
        }} />
      </Shimmer>
    )
  }

  render() {
    let { loadingShow, myVoucher } = this.state
    return (
      <div>
        {
          loadingShow &&
          <Row>
            <Col sm={6}>
              {this.viewShimmer()}
            </Col>
            <Col sm={6}>
              {this.viewShimmer()}
            </Col>
          </Row>
        }
        {
          !loadingShow &&
          <Row>
            {
              myVoucher.map((item, key) => (
                <Col key={key} sm={6}>
                  <div style={{
                    borderRadius: 0, backgroundColor: "#FFFFFF", marginBottom: 10,
                    width: "100%", boxShadow: "1px 2px 5px rgba(128, 128, 128, 0.5)",
                    cursor: "pointer", display: "flex", borderRadius: 10
                  }} onClick={() => this.props.handleSelect && this.props.handleSelect(item)}>
                    <div className="profile-dashboard" style={{
                      position: "absolute", width: 50,
                      paddingLeft: 10, paddingRight: 10,
                      color: "white", fontSize: 12,
                      borderBottomLeftRadius: 10, right: 15,
                      fontWeight: "bold"
                    }}>{item.totalRedeem + "x"}</div>

                    <img style={{ width: '50%', height: 100, objectFit: "contain", overflow: 'hidden' }}
                      src={item.image ? item.image : voucherIcon} alt="voucher" />

                    <div style={{ width: '100%', marginLeft: 10, marginRight: 10, textAlign: "left", marginTop: 5 }}>
                      <div className="customer-group-name" style={{ fontSize: 16, fontWeight: "bold" }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: 12 }}>
                        {item.voucherDesc}
                      </div>
                      <div className="customer-group-name" style={{ fontSize: 14, fontWeight: "bold" }}>
                        {`Discount ${item.voucherType === "discPercentage" ? item.voucherValue + "%" : "$" + item.voucherValue}`}
                      </div>
                    </div>

                  </div>
                </Col>
              ))
            }
            {
              myVoucher.length === 0 &&
              <div>
                <Lottie
                  options={{ animationData: emptyGif }}
                  style={{ height: 250 }}
                />
                <div>Data is empty</div>
              </div>
            }
          </Row>
        }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    account: state.auth.account.idToken.payload,
  };
};

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(MyVoucher);
