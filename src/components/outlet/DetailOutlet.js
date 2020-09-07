import React, { Component } from 'react';
import { connect } from "react-redux";
import Loading from "../loading";
import { isEmptyObject, isEmptyArray } from '../../helpers/CheckEmpty';
import { isEmptyData } from '../../helpers/CheckEmpty';
import { OrderAction } from '../../redux/actions/OrderAction';

class DetailOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      update: false,
      selectedItem: {},
    };
  }

  detailProduct = () => {
    const { defaultOutlet } = this.props;
    return (
      <div className="modal-content modal-content-product modal-product" style={{ width: "100%" }}>
        <div className="modal-header modal-header-product" style={{ display: "flex", justifyContent: "center", borderBottom: 'none' }}>
          <h3 className="color text-center">{defaultOutlet.name}</h3>
        </div>
        <div className="modal-body modal-body-product">
        <div style={{marginLeft: 30, marginRight: 20}}>
            <table className="table table-striped table-responsive">
              <tbody>
                <tr>
                  <td><b>City</b></td>
                  <td style={{textAlign: 'right'}}>{defaultOutlet.city}</td>
                </tr>
                <tr>
                  <td><b>Region</b></td>
                  <td style={{textAlign: 'right'}}>{defaultOutlet.region}</td>
                </tr>
                <tr>
                  <td><b>Address</b></td>
                  <td style={{textAlign: 'right'}}>{defaultOutlet.address}</td>
                </tr>
              </tbody>
            </table>
            {
              !isEmptyArray(defaultOutlet.operationalHours) ?
                <>
                  <p className="text-muted text-center" style={{fontSize: 20}}>Operational Hours</p>
                  <table className="table table-striped table-responsive">
                    <tbody>
                      {
                        defaultOutlet.operationalHours.filter(item => item.active).map(data =>
                          <tr>
                            <td>{data.nameOfDay}</td>
                            <td style={{textAlign: 'right'}}>{data.open} to {data.close}</td>
                          </tr>
                        )
                      }
                    </tbody>
                  </table>
                </>
                :
                null
            }
          </div>

        </div>
        <div className="modal-footer">
          <div className="col-md-12 col-xs-12">
            <button data-dismiss="modal" className="btn btn-block btn-footer">
              <b>Close</b>
            </button>
          </div>
        </div>
      </div>
    )
  }

  render() {
    let { isLoading } = this.state
    return (
      <div>
        {isLoading && <Loading />}
        <div className="modal fade bd-example-modal-lg" id="detail-outlet" tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-product modal-dialog-centered modal-full" role="document">
            {this.detailProduct()}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    defaultOutlet: state.outlet.defaultOutlet,
  };
};

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailOrder);
