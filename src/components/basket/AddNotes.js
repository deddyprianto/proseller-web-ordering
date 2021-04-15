import React, { Component } from "react";
import { Button } from "reactstrap";

export default class AddNotes extends Component {
  constructor(props) {
    super(props);

    const { dataBasket } = this.props;
    let notes = '';
    
    if (dataBasket !== undefined && dataBasket !== null) {
      if (dataBasket.remark !== undefined && dataBasket.remark !== '') {
        notes = dataBasket.remark;
      }
    }

    this.state = {
      notes
    };
  }

  componentWillUnmount = () => {
    try {
      document.getElementById('btn-close-timeslot').click()
    }catch(e) { }
  }

  componentDidMount() {
    
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dataBasket === undefined || nextProps.dataBasket === null) return;
    if (this.state.notes !== nextProps.dataBasket.remark) {
      let notes = '';
      if (nextProps.dataBasket.remark !== undefined && nextProps.dataBasket.remark !== '') {
        notes = nextProps.dataBasket.remark;
      }
      this.setState({notes});
    } 
  }

  render() {
    // let { updateCartInfo } = this.props;
    const { notes } = this.state;
    return (
      <div>
        <div
          className="modal fade"
          id="add-notes-modal"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div
              className="modal-content"
              style={{ width: "100%", marginTop: 100, marginBottom: 100 }}
            >
              <div
                className="modal-header"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <h5
                  className="modal-title"
                  id="exampleModalLabel"
                  style={{ fontSize: 16 }}
                >
                  Notes
                </h5>
                <button
                  id="btn-close-timeslot"
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    
                  }}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: 16,
                  }}
                >
                  <span aria-hidden="true" style={{ fontSize: 30 }}>
                    ×
                  </span>
                </button>
              </div>
              <div className="modal-body">
                <textarea onChange={(e) => this.setState({notes: e.target.value})} value={notes} />
              </div>
              <div className="modal-body">
                <Button
                  className="button"
                  data-toggle="modal"
                  data-target="#redeem-point-modal"
                  data-dismiss="modal"
                  onClick={() => {
                    this.props.updateCartInfo(notes);
                  }}
                  style={{
                    width: "100%",
                    marginTop: 10,
                    borderRadius: 5,
                    height: 40,
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
