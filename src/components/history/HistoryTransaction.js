import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import Shimmer from 'react-shimmer-effect';
import { connect } from 'react-redux';
import { HistoryAction } from '../../redux/actions/HistoryAction';
import InfiniteScroll from 'react-infinite-scroll-component';
import Lottie from 'lottie-react-web';
import loadingGif from '../../assets/gif/loading.json';
import HistoryCard from './HistoryCard';
import ModalDetailHistory from './ModalDetailHistory';
import config from '../../config';
import LoadingOverlayCustom from 'components/loading/LoadingOverlay';

class HistoryTransaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingShow: true,
      isLoading: false,
      dataTransaction: [],
      detailTransaction: {},
      dataTransactionLength: 0,
      countryCode: 'ID',
    };
  }

  viewShimmer = (isHeight = 100) => {
    return (
      <Shimmer>
        <div
          style={{
            width: '100%',
            height: isHeight,
            alignSelf: 'center',
            borderRadius: '8px',
            marginBottom: 10,
          }}
        />
      </Shimmer>
    );
  };

  componentDidMount = async () => {
    let response = await this.props.dispatch(
      HistoryAction.getTransaction({ take: 14, skip: 0 })
    );
    if (response.ResultCode === 200) this.setState(response.Data);
    this.setState({ loadingShow: false });
  };

  fetchMoreData = async () => {
    let response = await this.props.dispatch(
      HistoryAction.getTransaction({
        skip: 0,
        take: this.state.dataTransaction.length + 14,
      })
    );
    if (response.ResultCode === 200) this.setState(response.Data);
  };

  render() {
    let {
      loadingShow,
      dataTransactionLength,
      dataTransaction,
      detailTransaction,
    } = this.state;
    let { countryCode } = this.props;
    return (
      <LoadingOverlayCustom active={this.state.isLoading} spinner>
        <ModalDetailHistory
          detail={detailTransaction}
          countryCode={countryCode}
        />
        <InfiniteScroll
          style={{
            marginLeft: -20,
            paddingLeft: 20,
            marginRight: -20,
            paddingRight: 20,
          }}
          dataLength={dataTransaction.length}
          next={this.fetchMoreData}
          hasMore={
            dataTransactionLength === dataTransaction.length ? false : true
          }
          loader={
            <Lottie
              options={{ animationData: loadingGif }}
              style={{ height: 50 }}
            />
          }
        >
          {loadingShow ? (
            <Row>
              <Col sm={6}>{this.viewShimmer(50)}</Col>
              <Col sm={6}>{this.viewShimmer(50)}</Col>
            </Row>
          ) : (
            <Row>
              {dataTransaction.map((items, keys) => (
                <Col
                  key={keys}
                  sm={6}
                  data-toggle='modal'
                  data-target='#detail-transaction-modal'
                  onClick={() => this.setState({ detailTransaction: items })}
                >
                  <HistoryCard items={items} countryCode={countryCode} />
                </Col>
              ))}
              {dataTransactionLength === 0 && (
                <div>
                  {/* <Lottie
                      options={{ animationData: emptyGif }}
                      style={{ height: 250 }}
                    /> */}
                  <img
                    src={config.url_emptyImage}
                    alt='is empty'
                    style={{ marginTop: 30 }}
                  />
                  <div>Data is empty</div>
                </div>
              )}
            </Row>
          )}
        </InfiniteScroll>
      </LoadingOverlayCustom>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    account: state.auth.account.idToken.payload,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(HistoryTransaction);
