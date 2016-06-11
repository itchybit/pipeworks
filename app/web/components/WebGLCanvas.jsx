import React, { Component } from 'react';

const WIDTH = 180;
const HEIGHT = 90;

export default class WebGLCanvas extends Component {
  constructor() {
    super();
    this.state = {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    };
    this._tick = this._tick.bind(this);
    this._handleResize = this._handleResize.bind(this);
    this._pixelsToChars = this._pixelsToChars.bind(this);
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
      this.props.renderer.render(this.state.context, WIDTH, HEIGHT);
    }
    this.setState({
      pixels: this.props.renderer.pixels
    })
    requestAnimationFrame(this._tick);
  }

  _handleResize(e) {
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    });
  }

  _pixelsToChars() {
    const rows = [];
    if (this.state.pixels) {
      const width = WIDTH;//this.state.windowWidth;
      const height = HEIGHT;//this.state.windowHeight;

      const pixWidth = this.state.windowWidth / WIDTH;
      const pixHeight = this.state.windowHeight / HEIGHT;

      for (let y = 0; y < height; y++) {
        let row = ".";
        for (let x = 0; x < width; x++) {
          const i = ((height - y - 1) * width + x) * 4;
          const r = this.state.pixels[i];
          const g = this.state.pixels[i + 1];
          const b = this.state.pixels[i + 2];
          const a = this.state.pixels[i + 3];
          const color = 'rgb(' + r + ', ' + g + ', ' + b + ')';
          // console.log("" + String.fromCharCode(a) + "")
          row += String.fromCharCode(a);
          // row.push(
          //   <div
          //     key={y*10000+x}
          //     style={{ width: pixWidth, height: pixHeight, display: 'inline-block', background: color }}>
          //   </div>);
        }
        rows.push(
          <div key={y} style={{ height: pixHeight, fontSize: pixHeight, fontFamily: 'monospace'}}>
            { row + "." }
          </div>);
      }
    }
    return rows;
    // if (this.state.pixels) {
    //   this.state.pixels.forEach((row) => {
    //     console.log(row);
    //   });
    // }
  }

  render() {
    // console.log(this.state.pixels);
    const divs = this._pixelsToChars();
    return (
      <div>
        <canvas ref="glcanvas" id="glcanvas" width={ WIDTH } height={ HEIGHT }>
          Your browser doesn't appear to support the
          <code>&lt;canvas&gt;</code> element.
        </canvas>
        <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, fontSize: '4px', color: 'white', background: 'black' }}>
          { divs }
        </div>
      </div>
    );
  }
}
