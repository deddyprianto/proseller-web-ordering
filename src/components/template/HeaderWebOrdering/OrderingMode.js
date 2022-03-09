/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';

function OrderingMode({ mode, alias, icon, orderingModes }) {
  const showOrderingModeModal = () => {
    if (orderingModes.length !== 1) {
      document.getElementById('open-modal-ordering-mode').click();
    }
  };
  return (
    <div
      className='color'
      style={{ marginTop: '0.3rem', cursor: 'pointer' }}
      onClick={showOrderingModeModal}
    >
      <i className={`fa ${icon}`}></i>
      {alias || mode}{' '}
      {orderingModes.length !== 1 && (
        <i
          style={{ marginLeft: 6, fontSize: 10 }}
          className='fa fa-chevron-right'
        />
      )}
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    orderingModes: state.order.orderingModes,
  };
};

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderingMode);
