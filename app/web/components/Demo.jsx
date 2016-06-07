import React, { Component } from 'react';

import DemoApp from '../../demo';

class Demo extends Component {
  componentDidMount() {
    DemoApp.init();
  }

  render() {
    return (
      <canvas id="glcanvas" width="640" height="480">
        Your browser doesn't appear to support the
        <code>&lt;canvas&gt;</code> element.
      </canvas>
    );
  }
}

export default Demo;
