import React, { Component } from 'react';
import { connect } from "react-redux";
import { LoopCircleLoading } from 'react-loadingg';

class LoadingFixed extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    document.getElementById("loading-load").showModal()
  }

  render() {
    return (
      <div id="loading-load" style={{ position: "fixed", border: "1px solid #FFF", width: 80, height: 80, borderRadius: 80, boxShadow: "-1px 1px 5px rgba(128, 128, 128, 0.7)", zIndex: 200 }}>
        <LoopCircleLoading />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {};
};

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(LoadingFixed);
