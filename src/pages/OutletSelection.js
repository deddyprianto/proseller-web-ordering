import React, { Component } from "react";
import { Col, Row } from "reactstrap";
import Shimmer from "react-shimmer-effect";
import { connect } from "react-redux";
import { OutletAction } from "../redux/actions/OutletAction";
import { MasterdataAction } from "../redux/actions/MaterdataAction";
import config from "../config";

const Swal = require("sweetalert2");
class OutletSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingShow: true,
      isLoading: false,
      outlets: [],
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
    let response = await this.props.dispatch(OutletAction.fetchAllOutlet());
    await this.setState({outlets: response});
    await this.setState({ loadingShow: false });
  };

  handleSelectOutlet = async (outlet) => {
    await this.setState({ loadingShow: true });
    await this.props.dispatch(MasterdataAction.setDefaultOutlet(outlet));
    await this.setState({ loadingShow: false });
    try{
      this.props.history.goBack()
    } catch(e){}
  }
  
  render() {
    let { loadingShow, outlets } = this.state;
    return (
      <div className="col-full" style={{ marginTop: 90, marginBottom: 50 }}>
        <div id="primary" className="content-area">
          <div className="stretch-full-width">
            <main
              id="main"
              className="site-main"
              style={{ textAlign: "center", paddingBottom: 40 }}
            >
              {loadingShow ? (
                <Row>
                  <Col sm={6}>{this.viewShimmer(50)}</Col>
                  <Col sm={6}>{this.viewShimmer(50)}</Col>
                </Row>
              ) : (
                <Row>
                  {outlets.map((items, keys) => (
                    <Col
                      key={keys}
                      sm={6}
                      onClick={() => this.handleSelectOutlet(items)}
                    >
                      <div style={{
                          boxShadow: "0px 0px 5px rgba(128, 128, 128, 0.2)", border: "1px solid #CDCDCD",
                          padding: 10, cursor: "pointer", display: "flex",
                          flexDirection: "row", margin: 5, borderRadius: 5
                        }}>
                          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%", textAlign: "left" }}>
                            <div style={{
                              display: "flex", flexDirection: "row",
                              justifyContent: "space-between"
                            }}>
                              <div className={"customer-group-name"}
                                style={{ fontWeight: "bold", fontSize: 14 }}>
                                {items.name}
                              </div>
                            </div>
                          </div>
                        </div>
                    </Col>
                  ))}
                </Row>
              )}
              {!loadingShow && outlets && outlets.length === 0 && (
                <div>
                  <img src={config.url_emptyImage} alt="is empty" style={{marginTop: 30}}/>
                  <div>Data is empty</div>
                </div>
              )}
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
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(OutletSelection);
