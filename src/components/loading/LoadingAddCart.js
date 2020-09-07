import React, { Component } from 'react';
import { connect } from "react-redux";
import { LoopCircleLoading } from 'react-loadingg';

class LoadingAddCart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    try{
      document.getElementById("loading-load").showModal()
    } catch(e) {  }
  }

  render() {
    return (
      <dialog id="loading-load" style={{ position: "fixed", border: "1px solid #FFF", borderRadius: 10, boxShadow: "-1px 1px 5px rgba(128, 128, 128, 0.7)" }}>
        <h3 className="text-muted text-center">Please wait</h3>
        <p style={{marginTop: 10}} className="text-muted text-center">we are saving your cart ...</p>
      </dialog>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {};
};

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(LoadingAddCart);
