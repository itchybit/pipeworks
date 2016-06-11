import React, { Component } from 'react';

export default class WebGLCanvas extends Component {
  constructor() {
    super();
    this.state = {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    };
    this._tick = this._tick.bind(this);
    this._handleResize = this._handleResize.bind(this);
  }
  componentDidMount() {
    try {
      const context =
        this.refs.glcanvas.getContext('webgl') ||
        this.refs.glcanvas.getContext('experimental-webgl');
      this.setState({
        context: context
      });
      requestAnimationFrame(this._tick);
    } catch(error) {
      console.log(error);
    }
    window.addEventListener('resize', this._handleResize);
  }

  _tick() {
    if (this.state.context) {
      this.props.renderer.render(this.state.context, this.state.windowWidth, this.state.windowHeight);
    }
    requestAnimationFrame(this._tick);
  }

  _handleResize(e) {
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    });
  }

  render() {
    return (
      <canvas ref="glcanvas" id="glcanvas" width={ this.state.windowWidth } height={ this.state.windowHeight }>
        Your browser doesn't appear to support the
        <code>&lt;canvas&gt;</code> element.
      </canvas>
    );
  }
}
