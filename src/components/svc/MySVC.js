import React, { Component } from "react";
import { SVCAction } from "../../redux/actions/SVCAction";
import { connect } from "react-redux";
import Shimmer from "react-shimmer-effect";
import GiftVoucherModal from "./GiftVoucherModal";
import moment from 'moment'
import { Link } from "react-router-dom";
import { isEmptyObject } from "../../helpers/CheckEmpty";

class MySVC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingShow: true,
      history: [],
      dataLength: 0
    };
  }

  componentDidMount = async () => {
    await this.props.dispatch(SVCAction.summarySVC())
    await this.getHistorySVC()
    this.setState({ loadingShow: false })
  };

  getHistorySVC = async () => {
    await this.props.dispatch(SVCAction.historySVC(this.props.history.data))
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
    const { showGiftModal } = this.state;
    const { history } = this.props;
    console.log(history)
    return (
      <div>
        {showGiftModal && (
          <GiftVoucherModal
            balance={this.props.balance}
            stringBalance={this.getCurrency(this.props.balance)}
            onClose={() =>
              this.setState({ showGiftModal: false, voucher: null })
            }
          ></GiftVoucherModal>
        )}
        <div className="button" style={{ boxShadow: "0px 0px 5px rgba(128, 128, 128, 0.5)", marginTop: 20, padding: 10, paddingTop: 15, paddingBottom: 15, width: '100%', borderRadius: 10 }}>
          <p>Total Balance</p>
          <p style={{fontSize: 27}}>{this.getCurrency(this.props.balance)}</p>

          <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', marginTop: 20,  }}>
            {/* <div style={{ display: 'flex', flexDirection: 'row', borderRadius: 7, backgroundColor: 'white', width: '40%', justifyContent: 'center', alignItems: 'center' }}>
              <i style={{ marginRight: 5 }} className="fa fa-plus customer-group-name"></i> <b className="customer-group-name">Top Up Now</b>
            </div> */}
            <Link to={'/buy-svc'} style={{ display: 'flex', flexDirection: 'row', borderRadius: 7, backgroundColor: 'white', width: '40%', justifyContent: 'center', alignItems: 'center' }}>
              <div>
                <i style={{ marginRight: 5 }} className="fa fa-plus customer-group-name"></i> <b className="customer-group-name">Buy SVC</b>
              </div>
            </Link>
            <div onClick={() => this.setState({showGiftModal: true})} style={{ padding: 5, display: 'flex', flexDirection: 'row', borderRadius: 7, backgroundColor: 'white', width: '40%', justifyContent: 'center', alignItems: 'center' }}>
              <i style={{ marginRight: 5 }} className="fa fa-send customer-group-name"></i> <b className="customer-group-name">Transfer</b>
            </div>
          </div>
        </div>

        <div style={{marginTop: 20}}>
          <p style={{fontSize: 23, color: 'black', fontWeight: 'bold', textAlign: 'left'}}>History</p>
          <div>
            {
              !isEmptyObject(history) && history.data.map(item =>
                <div key={item.id}>
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <div style={{textAlign: 'left'}}>
                      <b className="customer-group-name" style={{marginBottom: -5, fontSize: 16}}>{item.from.toUpperCase()}</b>
                      <p style={{fontSize: 12, marginTop: -5 }}> <span style={{textTransform: 'capitalize'}}>{item.from}</span> on {moment(item.purchaseDate).format("DD MMM YYYY")}</p>
                      <p style={{fontSize: 12, marginTop: -20}}>Expire on {moment(item.expiryDate).format("DD MMM YYYY")}</p>
                    </div>
                    <div style={{textAlign: 'right'}}>
                      <b className="customer-group-name" style={{fontSize: 14}}>{this.getCurrency(item.purchasedValue)}</b>
                      <br />
                      <b className="" style={{fontSize: 14}}>Balance : {this.getCurrency(item.balance)}</b>
                    </div>
                  </div>  
                  <hr />
                </div>
              )
            }
            {!isEmptyObject(history) && history.data.length === 0 && <p style={{ fontSize: 20 }}>Data History is Empty</p> }
            {
              !isEmptyObject(history) && history.data.length < history.dataLength &&
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
    balance: state.svc.summary,
    history: state.svc.history,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(MySVC);
