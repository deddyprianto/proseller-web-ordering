/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { connect } from 'react-redux';

class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    document.getElementById('loading-load').showModal();
  }

  render() {
    const { cart } = this.props;
    return (
      <dialog
        id='loading-load'
        style={{
          position: 'fixed',
          border: '1px solid #FFF',
          width: '90%',
          borderRadius: 10,
          boxShadow: '-1px 1px 5px rgba(128, 128, 128, 0.7)',
        }}
      >
        <p
          className='text-muted'
          style={{ textAlign: 'center', fontSize: 19, fontWeight: 500 }}
        >
          Processing your payment
        </p>
        <div className='spinner' style={{ margin: '20px auto' }}>
          <div
            className='double-bounce1'
            style={{ backgroundColor: '#c0392b' }}
          ></div>
          <div
            className='double-bounce2'
            style={{ backgroundColor: '#c0392b' }}
          ></div>
        </div>
        {cart.tableNo !== undefined ? (
          <div className='color' style={{ textAlign: 'center' }}>
            Table No : {cart.tableNo}
          </div>
        ) : (
          <div className='color' style={{ textAlign: 'center' }}>
            Queue No : {cart.queueNo}
          </div>
        )}
      </dialog>
    );
  }
}

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Loading);
