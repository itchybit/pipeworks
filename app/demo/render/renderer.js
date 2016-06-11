import debugShader from '../shaders/debug';
import renderTextureShader from '../shaders/renderTexture';

import { mat4, vec3, vec4 } from 'gl-matrix';
import {geometryGenerator} from './geometryGeneration'

import * as geomGen from './geometryGeneration'
import ShaderProgram from './shaderProgram';
import Framebuffer  from './framebuffer';
import firstPassFBO from '../framebuffers/firstPass';

import Mesh from './mesh';
import { monkey, cube, triangle } from '../constants/models';

import * as glHelpers from '../helpers/glHelpers';
import { FLOAT_SIZE } from '../constants';

export default class Renderer {
  constructor() {
    this.shader = debugShader;
    this.renderTexShader = renderTextureShader;
    this.triangleMesh = new Mesh(triangle);
    this.monkeyMesh = new Mesh(monkey);

    this.fbo = firstPassFBO(640, 480);

    this.nearPlane = 0.1;
    this.farPlane = 100.0;
    this.width = 0;
    this.height = 0;
  }

  render(sceneData, context, width, height) {
    const gl = context;

    const cam = sceneData.get('cam');
    const camPos = cam.get("pos");
    const camTarget = cam.get("target");

    const pipe = sceneData.get('p1')
    // console.log(pipe);
    const pipeMesh = geomGen['pipe'](pipe);
    this.setup(gl);
    if (this.width !== width || this.height !== height) {
      this.resize(gl, width, height);
    }

    this.clearCanvas(gl);
    this.shader.use(gl);

    this.fbo.activate(gl, this.ext, this.shader);
    this.clearCanvas(gl);

    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, 45, this.viewPortWidth / this.viewPortHeight, this.nearPlane, this.farPlane);

    const viewMatrix = mat4.create();
    mat4.lookAt(
      viewMatrix,
      vec3.fromValues(camPos.get('x'), camPos.get('y'), camPos.get('z')),
      vec3.fromValues(camTarget.get('x'), camTarget.get('y'), camTarget.get('z')),
      vec3.fromValues(0, 1, 0));

    const normalMatrix = mat4.create();
    mat4.transpose(normalMatrix, viewMatrix);
    mat4.invert(normalMatrix, normalMatrix);

    this.shader.updateUniform(gl, "projectionMatrix", projectionMatrix);
    this.shader.updateUniform(gl, "modelViewMatrix", viewMatrix);
    this.shader.updateUniform(gl, "normalMatrix", normalMatrix);

    this.shader.updateUniform(gl, "material", vec4.fromValues(0.5, 0.3, 0, 1));
    // this.monkeyMesh.render(gl, this.shader);

    pipeMesh.render(gl, this.shader);

    this.fbo.deactivate(gl);

    this.renderTextureToScreenSegment(gl, this.fbo.getTexture('depth'), -0.5, -0.5, 0.5, 0.5);
    this.renderTextureToScreenSegment(gl, this.fbo.getTexture('normal'), 0.5, 0.5, 0.5, 0.5);
    this.renderTextureToScreenSegment(gl, this.fbo.getTexture('color'), 0.5, -0.5, 0.5, 0.5);

  }


  renderTextureToScreenSegment(gl, texture, originX, originY, width, height) {
    if (!this.screenSegmentBuffer) {
      this.screenSegmentBuffer = gl.createBuffer();
      this.screenSegmentIndexBuffer = gl.createBuffer();
    }
    this.renderTexShader.use(gl);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    this.renderTexShader.updateUniform(gl, "tex", 0);

    const halfWidth = width;
    const halfHeight = height;

    const vertices = [
      originX - halfWidth, originY + halfHeight,
      0, 1,
      originX + halfWidth, originY + halfHeight,
      1, 1,
      originX + halfWidth, originY - halfHeight,
      1, 0,
      originX - halfWidth, originY - halfHeight,
      0, 0
    ];
    const indices = [
      0, 3, 1,
      1, 3, 2
    ];

    glHelpers.bufferData(gl, vertices, this.screenSegmentBuffer);
    glHelpers.bufferIndexData(gl, indices, this.screenSegmentIndexBuffer);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.screenSegmentBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.screenSegmentIndexBuffer);

    gl.vertexAttribPointer(
      this.renderTexShader.getAttributeLocation("position"),
      2, gl.FLOAT, false, 4 * FLOAT_SIZE, 0);
    gl.vertexAttribPointer(
      this.renderTexShader.getAttributeLocation("uv"),
      2, gl.FLOAT, false, 4 * FLOAT_SIZE, 2 * FLOAT_SIZE);

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
  }

  setup(gl) {
    if (!this.ext) {
      this.ext = gl.getExtension('WEBGL_draw_buffers');
      if (!this.ext) {
        throw ('WEBGL_draw_buffers not supported!');
      }
      const depthExt = gl.getExtension('WEBGL_depth_texture');
      if (!depthExt) {
        throw ('WEBGL_depth_texture not supported!');
      }
    }
    if (!this.shader.built) this.shader.build(gl);
    if (!this.renderTexShader.built) this.renderTexShader.build(gl);
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
    this.width = width;
    this.height = height;
    gl.viewport(0, 0, width, height);
    this.fbo.resize(gl, width, height);
  }
}
