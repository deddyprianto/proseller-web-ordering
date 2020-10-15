import React, { Component } from "react";
import { Col, Row } from "reactstrap";
import Shimmer from "react-shimmer-effect";
import { connect } from "react-redux";
import { InboxAction } from "../redux/actions/InboxAction";
import InfiniteScroll from "react-infinite-scroll-component";
import Lottie from "lottie-react-web";
import loadingGif from "../assets/gif/loading.json";
import { CONSTANT } from "../helpers";
// import emptyGif from "../assets/gif/empty-and-lost.json";
import loadable from "@loadable/component";
import config from "../config";

const InboxCard = loadable(() => import("../components/inbox/InboxCard"));
const ModalDetailInbox = loadable(() =>
  import("../components/inbox/ModalDetailInbox")
);

const Swal = require("sweetalert2");
class Inbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingShow: true,
      isLoading: false,
      broadcast: [],
      detailInbox: {},
      broadcastLength: 0,
      broadcastUnreadLength: 0,
    };
  }

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

  componentDidMount = async () => {
    let response = await this.props.dispatch(
      InboxAction.getBroadcast({ take: 14, skip: 0 })
    );
    if (response.ResultCode === 200) this.setState(response.Data);
    this.setState({ loadingShow: false });
  };

  fetchMoreData = async () => {
    let broadcast = this.state.broadcast;

    let response = await this.props.dispatch(
      InboxAction.getBroadcast({ take: 14, skip: broadcast.length })
    );
    if (response.ResultCode === 200) {
      broadcast = broadcast.concat(response.Data.broadcast);
      this.setState({ broadcast });
    }
  };

  handleDetail = async (detailInbox) => {
    if (!detailInbox.isRead) {
      detailInbox.isRead = true;
      this.setState({ detailInbox });
      await this.props.dispatch(InboxAction.getBroadcastByID(detailInbox.id));
      let data = {
        broadcast: this.state.broadcast,
        broadcastLength: this.state.broadcastLength,
        broadcastUnreadLength: this.props.broadcast.broadcastUnreadLength - 1,
      };
      await this.props.dispatch(
        InboxAction.setData({ Data: data }, CONSTANT.KEY_GET_BROADCAST)
      );
    } else {
      this.setState({ detailInbox });
    }
  };

  render() {
    let { loadingShow, broadcastLength, broadcast, detailInbox } = this.state;
    return (
      <div className="col-full" style={{ marginTop: 90, marginBottom: 50 }}>
        <ModalDetailInbox data={detailInbox} />
        <div id="primary" className="content-area">
          <div className="stretch-full-width">
            <main
              id="main"
              className="site-main"
              style={{ textAlign: "center", paddingBottom: 40 }}
            >
              <InfiniteScroll
                style={{
                  marginLeft: -20,
                  paddingLeft: 20,
                  marginRight: -20,
                  paddingRight: 20,
                }}
                dataLength={broadcast.length}
                next={this.fetchMoreData}
                hasMore={broadcastLength === broadcast.length ? false : true}
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
                    {broadcast.map((items, keys) => (
                      <Col
                        key={keys}
                        sm={6}
                        data-toggle="modal"
                        data-target="#detail-inbox-modal"
                        onClick={() => this.handleDetail(items)}
                      >
                        <InboxCard items={items} />
                      </Col>
                    ))}
                  </Row>
                )}
                {!loadingShow && broadcast && broadcast.length === 0 && (
                  <div>
                    {/* <Lottie
                      options={{ animationData: emptyGif }}
                      style={{ height: 250 }}
                    /> */}
                    <img src={config.url_emptyImage} alt="is empty" style={{marginTop: 30}}/>
                    <div>Data is empty</div>
                  </div>
                )}
              </InfiniteScroll>
            </main>
          </div>
        </div>
        {this.state.isLoading ? Swal.showLoading() : Swal.close()}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    account: state.auth.account.idToken.payload,
    broadcast: state.broadcast.broadcast,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Inbox);
