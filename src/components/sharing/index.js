import React, { Component } from "react";
import { connect } from "react-redux";

import {
    EmailShareButton,
    FacebookShareButton,
    LineShareButton,
    TelegramShareButton,
    TumblrShareButton,
    TwitterShareButton,
    ViberShareButton,
    WhatsappShareButton,
  } from "react-share";

  import {
    EmailIcon,
    FacebookIcon,
    TumblrIcon,
    LineIcon,
    TelegramIcon,
    TwitterIcon,
    ViberIcon,
    WhatsappIcon,
  } from "react-share";

class Sharing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  render() {
    let { basket, shareURL } = this.props;
    return (
      <div style={{ width: "100%" }}>
        <h3 className="text-center color">Share Cart</h3>
        
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 10}}>
            <div style={{margin: 5}}><WhatsappShareButton url={shareURL}> <WhatsappIcon size={55} round={true} /> </WhatsappShareButton></div>
            <div style={{margin: 5}}><TelegramShareButton url={shareURL}> <TelegramIcon size={55} round={true} /> </TelegramShareButton></div>
            <div style={{margin: 5}}><LineShareButton url={shareURL}> <LineIcon size={55} round={true} /> </LineShareButton></div>
            <div style={{margin: 5}}><ViberShareButton url={shareURL}> <ViberIcon size={55} round={true} /> </ViberShareButton></div>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 10}}>
            <div style={{margin: 5}}><EmailShareButton url={shareURL}> <EmailIcon size={55} round={true} /> </EmailShareButton></div>
            <div style={{margin: 5}}><FacebookShareButton url={shareURL}> <FacebookIcon size={55} round={true} /> </FacebookShareButton></div>
            <div style={{margin: 5}}><TwitterShareButton url={shareURL}> <TwitterIcon size={55} round={true} /> </TwitterShareButton></div>
            <div style={{margin: 5}}><TumblrShareButton url={shareURL}> <TumblrIcon size={55} round={true} /> </TumblrShareButton></div>
        </div>

      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    basket: state.order.basket,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(Sharing);
