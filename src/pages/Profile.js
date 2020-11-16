import React, { Component } from "react";
import loadable from "@loadable/component";
import { connect } from "react-redux";
// import { Button } from "reactstrap";
// import { Link } from 'react-router-dom';
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

    let isProfile = true;

    try {
      if (window.location.hash.split("#")[1] === '/rewards') isProfile = false;
    }catch(e){}

    this.state = {
      isProfile,
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
    let isProfile = true;
    try {
      if (window.location.hash.split("#")[1] === '/rewards') isProfile = false;
      this.setState({isProfile});
    }catch(e){}

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
          marginTop: config.prefix === "emenu" ? 80 : 90,
          marginBottom: 50,
        }}
      >
        <div id="primary" className="content-area">
          <div className="stretch-full-width">
            {/* <div
              style={{
                flexDirection: "row",
                position: "fixed",
                zIndex: 10,
                width: "100%",
                marginTop: -40,
              }}
            >
              <Link to="/profile">
                <Button
                  className={isProfile ? "use-select" : "un-select"}
                  style={{ height: 50, fontWeight: "bold" }}
                  onClick={() => this.setState({ isProfile: true })}
                >
                  Profile
                </Button>
              </Link>
              <Link to="/rewards">
                <Button
                  className={!isProfile ? "use-select" : "un-select"}
                  style={{ height: 50, fontWeight: "bold" }}
                >
                  Rewards
                </Button>
              </Link>
            </div> */}
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