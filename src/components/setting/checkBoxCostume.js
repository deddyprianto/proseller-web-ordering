import React, { Component } from 'react';

export default class CheckBox extends Component {
  render() {
    let {
      selected,
      setRadius,
      setHeight,
      handleChange,
      id = 'checkbox-custom',
    } = this.props;
    return (
      <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
        <div
          id={id}
          onClick={() => handleChange(!selected)}
          className={selected ? 'select-gender' : 'un-select-gender'}
          style={{
            height: setHeight,
            width: setHeight,
            borderRadius: setRadius,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <i
            className={selected ? 'fa fa-check-circle' : 'fa fa-circle'}
            style={{ fontSize: 16, color: '#FFF' }}
          />
        </div>
      </div>
    );
  }
}
