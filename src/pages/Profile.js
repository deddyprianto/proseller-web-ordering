import React, { Component } from "react";
import { Button } from "reactstrap";
import loadable from "@loadable/component";
import { connect } from "react-redux";
// import Lottie from "lottie-react-web";
// import emptyGif from "../assets/gif/empty-and-lost.json";

import config from "../config";

const DetailRewords = loadable(() =>
  import("../components/profile/DetailRewords")
);
const DetailProfile = loadable(() =>
  import("../components/profile/DetailProfile")
);

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isProfile: true,
      enableOrdering: false
    };
  }
  componentDidMount() {
    let { isLoggedIn } = this.props;
    if (!isLoggedIn) {
      document.getElementById("login-register-btn").click();
      return false;
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props !== prevProps) {
      let enableOrdering = this.props.setting.find(items => { return items.settingKey === "EnableOrdering" })
      if (enableOrdering) {
        this.setState({ enableOrdering: enableOrdering.settingValue });
      }
    }
  }

  render() {
    let { isProfile } = this.state;
    if (!this.props.isLoggedIn) {
      return (
        <div
          className="col-full"
          style={{
            marginTop: config.prefix === "emenu" ? 90 : 110,
            marginBottom: 50,
            padding: 0,
          }}
        >
          <div id="primary" className="content-area">
            <div
              className="stretch-full-width"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <main id="main" className="site-main" style={{ width: "100%" }}>
                <div>
                  <img src={config.url_emptyImage} alt="is empty" style={{marginTop: 30}}/>
                  <div style={{ textAlign: "center" }}>Please login first</div>
                </div>
              </main>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div
        className="col-full"
        style={{
          marginTop: config.prefix === "emenu" ? 100 : 120,
          marginBottom: 50,
        }}
      >
        <div id="primary" className="content-area">
          <div className="stretch-full-width">
            <div
              style={{
                flexDirection: "row",
                position: "fixed",
                zIndex: 10,
                width: "100%",
                marginTop: -40,
              }}
            >
              <Button
                className={isProfile ? "use-select" : "un-select"}
                style={{ height: 50, fontWeight: "bold" }}
                onClick={() => this.setState({ isProfile: true })}
              >
                Profile
              </Button>
              <Button
                className={!isProfile ? "use-select" : "un-select"}
                style={{ height: 50, fontWeight: "bold" }}
                onClick={() => this.setState({ isProfile: false })}
              >
                Rewards
              </Button>
            </div>
            <main
              id="main"
              className="site-main"
              style={{ textAlign: "center" }}
            >
              {isProfile ? <DetailProfile /> : <DetailRewords />}
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
    setting: state.order.setting,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);