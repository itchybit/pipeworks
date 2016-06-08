import React, { Component } from 'react';

export default class WebGLCanvas extends Component {
  constructor() {
    super();
    this.state = {};
    console.log("Component created");
  }
  componentDidMount() {
    console.log("Component mounted");
    try {
      const context =
        this.refs.glcanvas.getContext('webgl') ||
        this.refs.glcanvas.getContext('experimental-webgl');
      this.setState({
        context: context
      });
    } catch(error) {
      console.log(error);
    }
  }

  render() {
    console.log(this.state);
    if (this.state.context) {
      this.props.renderer.render(this.state.context);
    }
    return (
      <canvas ref="glcanvas" id="glcanvas" width="640" height="480">
        Your browser doesn't appear to support the
        <code>&lt;canvas&gt;</code> element.
      </canvas>
    );
  }
}
