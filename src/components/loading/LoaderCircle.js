import React, { Component } from 'react';

export default class LoaderCircle extends Component {
  render() {
    return (
      <div className='spinner'>
        <div className='double-bounce1'></div>
        <div className='double-bounce2'></div>
      </div>
    );
  }
}
