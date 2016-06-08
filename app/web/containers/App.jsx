import React, { Component } from 'react';

// import HelloWorld from '../components/HelloWorld.jsx';
// import Demo from '../components/Demo.jsx';
import DemoApp from '../../demo';
import WebGLCanvas from '../components/WebGLCanvas.jsx';

export default class App extends Component {
  render() {
    return (
      <WebGLCanvas renderer={ DemoApp }/>
    );
  }
}
