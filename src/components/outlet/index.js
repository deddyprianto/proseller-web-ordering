import React, { Component } from "react";
import { connect } from "react-redux";
import { isEmptyData, isEmptyArray } from "../../helpers/CheckEmpty";
import Select from "react-select";
import { OutletAction } from "../../redux/actions/OutletAction";
import { isEmptyObject } from "jquery";
import DetailOutlet from "./DetailOutlet";
import config from "../../config";

class Outlet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultOutlet: {},
      update: false,
      outlets: [],
      optionsOutlet: [],
      selectedOutlet: {},
    };
  }

  componentDidMount = async () => {
    let { optionsOutlet } = this.state;
    const defaultOutlet =
      this.props.defaultOutlet ||
      (await this.props.dispatch(OutletAction.fetchDefaultOutlet()));
    const outlets = await this.props.dispatch(OutletAction.fetchAllOutlet());
    if (!isEmptyObject(defaultOutlet)) {
      await this.setState({
        selectedOutlet: { value: defaultOutlet.id, label: defaultOutlet.name },
      });
    }
    if (!isEmptyArray(outlets)) {
      outlets.map((item) => {
        optionsOutlet.push({ value: item.id, label: item.name });
      });
    }
  };

  imageExist = (defaultOutlet) => {
    if (!isEmptyData(defaultOutlet.defaultImageURL)) {
      return defaultOutlet.defaultImageURL;
    } else {
      return false;
    }
  };

  changeOutlet = async (selectedOption) => {
    await this.setState({ selectedOutlet: selectedOption });
    await this.props.stopProcessing();
    setTimeout(async () => {
      await this.props.fetchCategories({
        id: selectedOption.value,
        name: selectedOption.label,
      });
    }, 1500);
  };

  render() {
    const { defaultOutlet } = this.props;
    const { optionsOutlet, selectedOutlet } = this.state;
    return (
      <div className="row">
        <DetailOutlet />
        {/* <div className="outlet-selection">
                <center>
                    <h3 className="color">Current Outlet : </h3> <Select value={selectedOutlet} onChange={this.changeOutlet} options={optionsOutlet} />
                </center>
            </div> */}
        {defaultOutlet.remark &&
          !isEmptyData(defaultOutlet.remark) &&
          defaultOutlet.defaultImageURL &&
          !isEmptyData(defaultOutlet.defaultImageURL) && (
            <div className="outlet-information">
              <div className="col-md-6 col-sm-12 col-xs-12">
                {this.imageExist(defaultOutlet) ? (
                  <img
                    src={this.imageExist(defaultOutlet)}
                    className="attachment-pizzaro-product-list-fw-col-1 size-pizzaro-product-list-fw-col-1 image-outlet"
                    alt={84}
                    title={84}
                  />
                ) : null}
              </div>
              <div className="col-md-6 col-sm-12 col-xs-12">
                <h3
                  data-toggle="modal"
                  data-target="#detail-outlet"
                  style={{ marginBottom: 30, cursor: "pointer" }}
                  className="color text-center"
                >
                  {defaultOutlet.name} <i className="fa fa-info-circle"></i>{" "}
                </h3>
                <p
                  style={{
                    marginBottom: 30,
                    cursor: "pointer",
                    textAlign: "left",
                    marginLeft: 5,
                    marginRight: 5,
                  }}
                  className="color text-center"
                >
                  {defaultOutlet.remark}
                </p>
              </div>
            </div>
          )}
        <br />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    defaultOutlet: state.outlet.defaultOutlet,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Outlet);
