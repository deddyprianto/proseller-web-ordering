import React, { Component } from 'react';
import { SVCAction } from '../../redux/actions/SVCAction';
import { connect } from "react-redux";
import Shimmer from "react-shimmer-effect";
import { Col, Row } from 'reactstrap';
import voucherIcon from '../../assets/images/voucher-icon.png'
import ModalDetailSVC from './ModalDetailSVC';
import config from "../../config"
import calculateTAX from "../../helpers/TaxCalculation";
import { OutletAction } from "../../redux/actions/OutletAction";

class BuySVC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMyVoucher: true,
      loadingShow: true,
      dataDetail: null,
      svc: [],
      detailPurchase: {},
      backupOutlet: {}
    }
  }

  componentDidMount = async () => {
    const svc = await this.props.dispatch(SVCAction.loadSVC())
    if (svc && svc.resultCode === 200) await this.setState({svc: svc.data})

    try {
      let backupOutlet = await this.props.dispatch(
        OutletAction.getBackupOutlet()
      );
      if (backupOutlet.resultCode === 200)
        this.setState({ backupOutlet: backupOutlet.data });
    } catch (e) {}

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

  findTax = async (dataDetail) => {
    const { backupOutlet } = this.state;
    const { defaultOutlet } = this.props;
    let outlet = defaultOutlet
    if (outlet === undefined || outlet.id === undefined) {
      outlet = backupOutlet
    }

    let returnData = {
      outlet,
      details: [],
    };
    let product = {};
    product.unitPrice = dataDetail.retailPrice;
    product.quantity = 1;
    product.product = dataDetail;
    returnData.details.push(product);

    const detailPurchase = await calculateTAX(returnData.details, returnData, {});

    await this.setState({ dataDetail, detailPurchase })
  };

  render() {
    let { loadingShow, svc, dataDetail, detailPurchase } = this.state
    return (
      <div style={{ marginTop: 80, }}>
        <ModalDetailSVC backupOutlet={this.state.backupOutlet} detailPurchase={detailPurchase} history={this.props.history} dataDetail={dataDetail} getCurrency={(price) => this.getCurrency(price)} />
        <div
          style={{
            flexDirection: "row",
            position: "fixed",
            width: "100%",
            display: "flex",
            zIndex: 2,
            marginTop: -60,
            height: 40,
            justifyContent: "space-between",
            alignItems: "center",
          }}
          className="background-theme"
        >
          <div
            style={{ marginLeft: 10, fontSize: 16 }}
            onClick={() => this.props.history.goBack()}
          >
            <i className="fa fa-chevron-left"></i> Back
          </div>
        </div>
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
          <Row style={{ marginTop: 150, padding: 5 }}>
            {
              svc.map((item, key) => (
                <Col key={key} sm={6}>
                  <div 
                  style={{
                    marginBottom: 15,
                    width: "100%", boxShadow: "0px 0px 5px rgba(128, 128, 128, 0.5)",
                    cursor: "pointer", display: "flex", borderRadius: 10, height: 100
                  }} 
                  onClick={() => this.findTax(item)} 
                  data-toggle="modal" data-target={"#voucher-detail-modal"}>
                    
                    <img style={{ width: '50%', height: 100, objectFit: "contain", overflow: 'hidden', marginLeft: 5, borderRadius: 5 }}
                      src={item.image ? item.image : voucherIcon} alt="voucher" />
                    <div style={{ 
                      width: '100%', marginLeft: 10, marginRight: 10, textAlign: "left", 
                      display: "flex", flexDirection: "column", marginTop: 10
                    }}>
                      <div className="customer-group-name" style={{ fontSize: 17, fontWeight: "bold", lineHeight: "17px" }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: 13, maxWidth: '90%', overflow: 'hidden', maxHeight: 30 }}>
                        {item.description ? item.description : 'No description for this SVC' }
                      </div>
                      <div className="customer-group-name" style={{ fontSize: 15, position: 'absolute', top: 65, fontWeight: "bold" }}>
                        {this.getCurrency(item.retailPrice)}
                      </div>
                    </div>

                  </div>
                </Col>
              ))
            }
            {
              svc.length === 0 &&
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
    defaultOutlet: state.outlet.defaultOutlet,
    pointData: state.campaign.data,
  };
};

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(BuySVC);
