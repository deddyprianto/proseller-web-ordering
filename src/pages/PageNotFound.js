import React, { Component } from "react";
import { connect } from "react-redux";
import Lottie from "lottie-react-web";
import loginGif from "../assets/gif/login-anim.json";

import config from "../config";

class PageNotFound extends Component {
  render() {
    let { isLoggedIn, location } = this.props;
    return (
      <div
        className="col-full"
        style={{
          marginTop: config.prefix === "emenu" ? 70 : 90,
          marginBottom: 50,
        }}
      >
        <div id="primary" className="content-area">
          <div className="stretch-full-width">
            <main
              id="main"
              className="site-main"
              style={{ textAlign: "center", paddingBottom: 40 }}
            >
              <div>
                <Lottie
                  options={{ animationData: loginGif }}
                  style={{ height: 250 }}
                />
                {!isLoggedIn &&
                (location.pathname === "/history" ||
                  location.pathname === "/payment") ? (
                  <div>
                    Oppss...
                    <br /> Please login first
                  </div>
                ) : (
                  <div>
                    Oppss...
                    <br /> Page Not Found
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isLoggedIn: state.auth.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(PageNotFound);
