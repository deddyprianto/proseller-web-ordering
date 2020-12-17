import React, { Component } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import Shimmer from "react-shimmer-effect";
import config from "../../config";
import { connect } from "react-redux";
import HistoryCard from './HistoryCardPending';
// import Lottie from 'lottie-react-web';
// import emptyGif from '../../assets/gif/empty-and-lost.json';
import { Link } from 'react-router-dom';

const encryptor = require('simple-encryptor')(process.env.REACT_APP_KEY_DATA);
const Swal = require('sweetalert2');
class HistoryPending extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingShow: true,
      isLoading: false,
      dataPending: [],
      dataPendingLength: 0,
      countryCode: 'ID',
    };
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

  handleDetail = (items) => {
    localStorage.setItem(`${config.prefix}_dataBasket`, JSON.stringify(encryptor.encrypt(items)));
  }

  render() {
    let { loadingShow, dataPending, countryCode, dataPendingLength } = this.props
    return (
      <div>
        {
          loadingShow ?
            <Row>
              <Col sm={6}>{this.viewShimmer(50)}</Col>
              <Col sm={6}>{this.viewShimmer(50)}</Col>
            </Row> :
            <Row>
              {
                dataPending.map((items, keys) => (
                  <Col key={keys} sm={6} data-toggle="modal" data-target="#detail-inbox-modal"
                    onClick={() => this.handleDetail(items)}>
                      {console.log(items)}
                    <Link to={items.isPaymentComplete ? "/history/detail" : "/basket"}>
                      <HistoryCard items={items} countryCode={countryCode} />
                    </Link>
                  </Col>
                ))
              }
              {
                dataPendingLength === 0 &&
                <div>
                  <img src={config.url_emptyImage} alt="is empty" style={{marginTop: 30}}/>
                  <div>Data is empty</div>
                </div>
              }
            </Row>
        }
        {this.state.isLoading ? Swal.showLoading() : Swal.close()}
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

export default connect(mapStateToProps, mapDispatchToProps)(HistoryPending);
