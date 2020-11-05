import React, { Component } from 'react';
import { VoucherAction } from '../../redux/actions/VoucherAction';
import { connect } from "react-redux";
import Shimmer from "react-shimmer-effect";
import {
  Col,
  Row,
} from 'reactstrap';
import voucherIcon from '../../assets/images/voucher-icon.png'
import ModalDetailVoucher from './ModalDetailVoucher';
// import Lottie from 'lottie-react-web';
// import emptyGif from '../../assets/gif/empty-and-lost.json';
import config from "../../config"

class RedeemVoucher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMyVoucher: true,
      redeemVoucher: [],
      loadingShow: true,
      dataDetail: null
    }
  }

  componentDidMount = async () => {
    let response = await this.props.dispatch(VoucherAction.getRedeemVoucher());
    if (response.ResultCode === 200) this.setState({ redeemVoucher: response.Data })
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
  getCurrency = (price) => {
    if (this.props.companyInfo) {
      if (price !== undefined) {
        const { currency } = this.props.companyInfo;
        if (!price || price === "-") price = 0;
        let result = price.toLocaleString(currency.locale, {
          style: "currency",
          currency: currency.code,
        });
        return result;
      }
    }
    return price;
  };

  render() {
    let { loadingShow, redeemVoucher, dataDetail } = this.state
    let {pointData} = this.props
    return (
      <div>
        <ModalDetailVoucher dataDetail={dataDetail} getCurrency={(price) => this.getCurrency(price)} />
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
              redeemVoucher.map((item, key) => (
                <Col key={key} sm={6}>
                  <div 
                  className={pointData.totalPoint < item.redeemValue && "product-unavailable"}
                  style={{
                    marginBottom: 10,
                    width: "100%", boxShadow: "0px 0px 5px rgba(128, 128, 128, 0.5)",
                    cursor: "pointer", display: "flex", borderRadius: 10
                  }} onClick={() => this.setState({ dataDetail: item })} data-toggle="modal" data-target={pointData.totalPoint >= item.redeemValue && "#voucher-detail-modal"}>
                    {
                      item.redeemValue &&
                      <div className="profile-dashboard" style={{
                        position: "absolute", width: '29%',
                        paddingLeft: 5, paddingRight: 5,
                        fontSize: 12, bottom: 0, left: 15,
                        borderTopRightRadius: 10, fontWeight: "bold",
                        textAlign: "center"
                      }}><i className="fa fa-tags" aria-hidden="true" /> {item.redeemValue + " Points"}</div>
                    }

                    <img style={{ width: '50%', height: 100, objectFit: "contain", overflow: 'hidden' }}
                      src={item.image ? item.image : voucherIcon} alt="voucher" />

                    <div style={{ 
                      width: '100%', marginLeft: 10, marginRight: 10, textAlign: "left", 
                      display: "flex", flexDirection: "column", justifyContent: "center" 
                    }}>
                      <div className="customer-group-name" style={{ fontSize: 14, fontWeight: "bold", lineHeight: "17px" }}>
                        {item.name}
                      </div>
                      {
                        item.voucherDesc &&
                        <div style={{ fontSize: 12, marginTop: -5 }}>
                          <i className="fa fa-commenting-o" aria-hidden="true"></i> {item.voucherDesc}
                        </div>
                      }
                      <div className="customer-group-name" style={{ fontSize: 12, fontWeight: "bold", marginTop: -5 }}>
                        {`Discount ${item.voucherType === "discPercentage" ? item.voucherValue + "%" : this.getCurrency(item.voucherValue)}`}
                      </div>
                    </div>

                  </div>
                </Col>
              ))
            }
            {
              redeemVoucher.length === 0 &&
              <div>
                <img src={config.url_emptyImage} alt="is empty" style={{marginTop: 30}}/>
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
    companyInfo: state.masterdata.companyInfo.data,
    pointData: state.campaign.data,
  };
};

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(RedeemVoucher);
