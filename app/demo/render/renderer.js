import vertexShaderSource from '../shaders/debug/vertex.glsl';
import fragmentShaderSource from '../shaders/debug/fragment.glsl';
import glMatrix from 'gl-matrix';

import ShaderProgram from './shaderProgram';

import * as glHelpers from '../helpers/glHelpers';

export default class Renderer {
  constructor() {
    this.shader = new ShaderProgram(vertexShaderSource, fragmentShaderSource);
    this.shader.attachUniform("projectionMatrix", "mat4");
    this.shader.attachUniform("modelViewMatrix", "mat4");
    this.shader.attachAttribute("position", "vec3");
  }
  render(scene, context) {
    const gl = context;

    this.setup(gl);
    this.resize(gl, 640, 480);
    this.clearCanvas(gl);

    const triangle = [
       0.0,  0.5,  0.0,
      -0.5,  -0.5,  0.0,
       0.5, -0.5,  0.0
    ]
    const triangleBuffer = glHelpers.bufferData(gl, triangle);

    this.shader.use(gl);

    gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);

    gl.vertexAttribPointer(this.shader.getAttributeLocation("position"), 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  setup(gl) {
    if (!this.shader.built) this.shader.build(gl);

    gl.clearColor(0, 0, 0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
  }

  clearCanvas(gl) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  resize(gl, width, height) {
    gl.viewport(0, 0, width, height);
  }
}
