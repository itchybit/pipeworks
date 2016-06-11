import debugShader from '../shaders/debug';
import { mat4, vec3 } from 'gl-matrix';
import {geometryGenerator} from './geometryGeneration'
import * as geomGen from './geometryGeneration'
import ShaderProgram from './shaderProgram';

import Mesh from './mesh';
import { monkey, cube, triangle } from '../constants/models';

import * as glHelpers from '../helpers/glHelpers';

export default class Renderer {
  constructor() {
    this.shader = debugShader;
    // this.cubeMesh = new Mesh(cube);
    this.triangleMesh = new Mesh(triangle);
    this.monkeyMesh = new Mesh(monkey);
    this.nearPlane = 0.1;
    this.farPlane = 100.0;

    // console.log();
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
    //

    this.shader.use(gl);

    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, 45, this.viewPortWidth / this.viewPortHeight, this.nearPlane, this.farPlane);

    const viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, vec3.fromValues(0, 0, 10), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));

    const normalMatrix = mat4.create();
    mat4.transpose(normalMatrix, viewMatrix);
    mat4.invert(normalMatrix, normalMatrix);

    this.shader.updateUniform(gl, "projectionMatrix", projectionMatrix);
    this.shader.updateUniform(gl, "modelViewMatrix", viewMatrix);
    this.shader.updateUniform(gl, "normalMatrix", normalMatrix);

    this.monkeyMesh.render(gl, this.shader);

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
