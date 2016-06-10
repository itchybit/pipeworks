import debugShader from '../shaders/debug';
import { mat4, vec3 } from 'gl-matrix';
import {geometryGenerator} from './geometryGeneration'
import ShaderProgram from './shaderProgram';

import * as glHelpers from '../helpers/glHelpers';

export default class Renderer {
  constructor() {
    this.shader = debugShader;
    this.nearPlane = 0.1;
    this.farPlane = 100.0;
  }

  render(sceneData, context) {
    // console.log("Render scene");
    const gl = context;

    this.setup(gl);
    this.resize(gl, 640, 480);
    this.clearCanvas(gl);

    // sceneData.forEach((value, key)=> {
    //   // console.log(value, key)
    //   if (geometryGenerator[value.get('type')]){
    //     // const generatedGeometry = geometryGenerator[value.get('type')](value)
    //   }
    // })
    //

    const triangle = [
       0.0,  0.5,  0.0,
      -0.5,  -0.5,  0.0,
       0.5, -0.5,  0.0
    ]
    const triangleBuffer = glHelpers.bufferData(gl, triangle);

    this.shader.use(gl);

    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, 45, this.viewPortWidth / this.viewPortHeight, this.nearPlane, this.farPlane);

    const viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, vec3.fromValues(0, 10, 10), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));

    this.shader.updateUniform(gl, "projectionMatrix", projectionMatrix);
    this.shader.updateUniform(gl, "modelViewMatrix", viewMatrix);

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
    this.viewPortWidth = width;
    this.viewPortHeight = height;
    gl.viewport(0, 0, width, height);
  }
}
