import React, { Component } from "react";
import { SVCAction } from "../../redux/actions/SVCAction";
import { connect } from "react-redux";
import Shimmer from "react-shimmer-effect";
import { Col, Row } from "reactstrap";
import voucherIcon from "../../assets/images/voucher-icon.png";
import GiftVoucherModal from "./GiftVoucherModal";
import moment from 'moment'
import config from '../../config'
import { data } from "jquery";

class MySVC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMyVoucher: true,
      loadingShow: true,
      showGiftModal: false,
      voucherToGift: null,
      balance: 0,
      history: [],
      dataLength: 0
    };
  }

  componentDidMount = async () => {
    const summary = await this.props.dispatch(SVCAction.summarySVC())
    if (summary && summary.resultCode === 200) await this.setState({balance: summary.data.balance})

    await this.getHistorySVC()

    this.setState({ loadingShow: false })
  };

  getHistorySVC = async () => {
    const history = await this.props.dispatch(SVCAction.historySVC(this.state.history.length))
    if (history && history.resultCode === 200) {
      if (this.state.history.length === 0) {
        await this.setState({history: history.data, dataLength: history.dataLength})
      } else {
        let dataHistory = this.state.history
        dataHistory = [...dataHistory, ...history.data]
        await this.setState({history: dataHistory, dataLength: history.dataLength})
      }
    }
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

  render() {
    let { showGiftModal, voucherToGift, balance, history, dataLength } = this.state;

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
        <div className="button" style={{ boxShadow: "0px 0px 5px rgba(128, 128, 128, 0.5)", marginTop: 20, padding: 10, paddingTop: 15, paddingBottom: 15, width: '100%', borderRadius: 10 }}>
          <p>Total Balance</p>
          <p style={{fontSize: 27}}>{this.getCurrency(balance)}</p>

          <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', marginTop: 20,  }}>
            <div style={{ display: 'flex', flexDirection: 'row', borderRadius: 7, backgroundColor: 'white', width: '40%', justifyContent: 'center', alignItems: 'center' }}>
              <i style={{ marginRight: 5 }} className="fa fa-plus customer-group-name"></i> <b className="customer-group-name">Top Up Now</b>
            </div>
            <div style={{ padding: 5, display: 'flex', flexDirection: 'row', borderRadius: 7, backgroundColor: 'white', width: '40%', justifyContent: 'center', alignItems: 'center' }}>
              <i style={{ marginRight: 5 }} className="fa fa-send customer-group-name"></i> <b className="customer-group-name">Transfer</b>
            </div>
          </div>
        </div>

        <div style={{marginTop: 20}}>
          <p style={{fontSize: 23, color: 'black', fontWeight: 'bold', textAlign: 'left'}}>History</p>
          <div>
            {
              history.map(item =>
                <>
                  <div key={item.id} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <div style={{textAlign: 'left'}}>
                      <b className="customer-group-name" style={{marginBottom: -5, fontSize: 16}}>{item.from.toUpperCase()}</b>
                      <p style={{fontSize: 12, marginTop: -5 }}> <span style={{textTransform: 'capitalize'}}>{item.from}</span> on {moment(item.purchaseDate).format("DD MMM YYYY")}</p>
                      <p style={{fontSize: 12, marginTop: -20}}>Expire on {moment(item.expiryDate).format("DD MMM YYYY")}</p>
                    </div>
                    <div style={{textAlign: 'right'}}>
                      <b className="customer-group-name" style={{fontSize: 16}}>{this.getCurrency(item.balance)}</b>
                    </div>
                  </div>  
                  <hr />
                </>
              )
            }
            {history.length === 0 && <p style={{ fontSize: 20 }}>Data History is Empty</p> }
            {
              history.length < dataLength &&
              <button onClick={this.getHistorySVC} className="button" style={{padding: 5}}>
                Load More
              </button>
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    account: state.auth.account.idToken.payload,
    companyInfo: state.masterdata.companyInfo.data,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(MySVC);
