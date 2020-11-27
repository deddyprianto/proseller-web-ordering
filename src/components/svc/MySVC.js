import React, { Component } from "react";
import { SVCAction } from "../../redux/actions/SVCAction";
import { connect } from "react-redux";
import Shimmer from "react-shimmer-effect";
import GiftVoucherModal from "./GiftVoucherModal";
import moment from 'moment'
import { Link } from "react-router-dom";
import { isEmptyObject } from "../../helpers/CheckEmpty";
import { Button } from "reactstrap";

class MySVC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingShow: true,
      history: [],
      dataLength: 0,
      isHistory: true
    };
  }

  componentDidMount = async () => {
    await this.props.dispatch(SVCAction.summarySVC())
    await this.props.dispatch(SVCAction.historyCustomerActivity([]))
    await this.props.dispatch(SVCAction.historySVC([]))
    this.setState({ loadingShow: false })
  };

  getHistorySVC = async () => {
    await this.props.dispatch(SVCAction.historyCustomerActivity(this.props.history.data))
  }

  getHistoryExpireSVC = async () => {
    await this.props.dispatch(SVCAction.historySVC(this.props.historyExpiration.data))
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

  getLabelActivity = (item) => {
    if (item === 'REDEEM_SVC') return 'Redeem SVC'
    if (item === 'RECEIVE_TRANSFER_SVC') return 'Receive Transfer'
    if (item === 'TRANSFER_SVC') return 'Transfer SVC'
    if (item === 'DEDUCT_SVC') return 'Deduct SVC'
    if (item === 'TOPUP_SVC') return 'Top Up'
    return item
  }

  getLabelType = (item) => {
    if (item === 'REDEEM_SVC' || item === 'TRANSFER_SVC' || item === 'DEDUCT_SVC')  return '-'
    else return '+'
  }

  render() {
    const { showGiftModal, isHistory } = this.state;
    const { history, historyExpiration } = this.props;
    
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

          <div
            style={{
              flexDirection: "row",
              width: "100%",
              borderRadius: 7,
              overflow: 'hidden',
              marginBottom: 10
            }}
          >
            <Button
              className={isHistory ? "use-select" : "un-select"}
              style={{ height: 50, fontWeight: "bold" }}
              onClick={() => this.setState({ isHistory: true })}
            >
              History
            </Button>
            <Button
              className={!isHistory ? "use-select" : "un-select"}
              style={{ height: 50, fontWeight: "bold" }}
              onClick={() => this.setState({ isHistory: false })}
            >
              Expiration
            </Button>
          </div>

          {
            isHistory ?
              <div>
                <p style={{fontSize: 23, color: 'black', fontWeight: 'bold', textAlign: 'left' }}>History</p>
                <div style={{ paddingBottom: 30 }}>
                  {
                    !isEmptyObject(history) && history.data.map(item =>
                      <div key={item.id}>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: -10, marginTop: -5 }}>
                          <div style={{textAlign: 'left'}}>
                            <b className="customer-group-name" style={{marginBottom: -5, fontSize: 16}}>{this.getLabelActivity(item.activityType)}</b>
                            <p style={{fontSize: 12, marginTop: -5 }}> on {moment(item.activityDate).format("DD MMM YYYY")}</p>
                          </div>
                          <div style={{textAlign: 'right'}}>
                            <b className="customer-group-name" style={{fontSize: 14}}> {this.getLabelType(item.activityType)} {this.getCurrency(item.amount)}</b>
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
                      Load More History
                    </button>
                  }
                </div>
              </div>
              :
              <div>
                <p style={{fontSize: 23, color: 'black', fontWeight: 'bold', textAlign: 'left' }}>Balance Expiration</p>
                <div style={{ paddingBottom: 30 }}>
                  {
                    !isEmptyObject(historyExpiration) && historyExpiration.data.map(item =>
                      <div key={item.id}>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                          <div style={{textAlign: 'left'}}>
                              <p><b className="customer-group-name" style={{marginBottom: -5, fontSize: 16}}>{this.getCurrency(item.balance)}</b> {'  '} will Expire on {moment(item.expiryDate).format("DD MMM YYYY")}</p> 
                          </div>
                        </div>  
                        <hr />
                      </div>
                    )
                  }
                  {!isEmptyObject(historyExpiration) && historyExpiration.data.length === 0 && <p style={{ fontSize: 20 }}>Data History is Empty</p> }
                  {
                    !isEmptyObject(historyExpiration) && historyExpiration.data.length < historyExpiration.dataLength &&
                    <button onClick={this.getHistoryExpireSVC} className="button" style={{padding: 5}}>
                      Load More
                    </button>
                  }
                </div>
              </div>
          }
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
    historyExpiration: state.svc.historyExpiration,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(MySVC);
