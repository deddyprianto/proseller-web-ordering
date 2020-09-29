import React, { Component } from "react";
import { Button } from "reactstrap";
import loadable from "@loadable/component";

const DetailRewords = loadable(() =>
  import("../components/profile/DetailRewords")
);
const DetailProfile = loadable(() =>
  import("../components/profile/DetailProfile")
);

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isProfile: true,
    };
  }
  render() {
    let { isProfile } = this.state;
    return (
      <div className="col-full" style={{ marginTop: 120, marginBottom: 50 }}>
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
                style={{ height: 50, color: "#FFF", fontWeight: "bold" }}
                onClick={() => this.setState({ isProfile: true })}
              >
                Profile
              </Button>
              <Button
                className={!isProfile ? "use-select" : "un-select"}
                style={{ height: 50, color: "#FFF", fontWeight: "bold" }}
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
