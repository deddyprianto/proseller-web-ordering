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
import QrReader from 'react-qr-reader';

const InboxCard = loadable(() => import("../components/inbox/InboxCard"));
const ModalDetailInbox = loadable(() =>
  import("../components/inbox/ModalDetailInbox")
);

const Swal = require("sweetalert2");
class ScanBarcode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      delay: 100,
      result: 'No result',
    };
    this.handleScan = this.handleScan.bind(this)
  }

  componentDidMount = async () => {
    
  };

  handleScan = data => {
    if (data) {
      try {
        
      } catch (error) {
        console.log(error)
      }
    }
  }
  
  render() {
    const previewStyle = {
      height: '100vh',
      width: '100%',
    }

    return (
      <div>
        <QrReader
          delay={200}
          onError={(err) => console.error(err)}
          onScan={this.handleScan}
          style={{ width: '100%' }}
          facingMode={"environment"}
        />
        <p>{this.state.result}</p>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(ScanBarcode);
