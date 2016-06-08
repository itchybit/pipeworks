import React, { Component } from 'react';

export default class WebGLCanvas extends Component {
  componentDidMount() {
    // const context = this.getDOMNode().getContext('2d');
    // this.setState({
    //   context: context
    // });
  }

  render() {
    // console.log(this.context);
    return (
      <canvas ref="glcanvas" id="glcanvas" width="640" height="480">
        Your browser doesn't appear to support the
        <code>&lt;canvas&gt;</code> element.
      </canvas>
    );
  }
}
