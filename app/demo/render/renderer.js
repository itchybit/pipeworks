import debugShader from '../shaders/debug';
import renderTextureShader from '../shaders/renderTexture';
import lightingShader from '../shaders/lighting';

import { mat4, vec3, vec4 } from 'gl-matrix';
import { geometryGenerator } from './geometryGeneration'

import points from '../static/points.json';
import { createPipeMesh } from '../helpers/generatePipe';

import * as geomGen from './geometryGeneration'
import ShaderProgram from './shaderProgram';
import Framebuffer  from './framebuffer';
import firstPassFBO from '../framebuffers/firstPass';
import OutputFBO from '../framebuffers/outputFBO';

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
    this.lightingShader = lightingShader;

    // this.pipeMesh = createPipeMesh(
    //   {x: points.p1_start_x, y: points.p1_start_z, z: points.p1_start_z,
    //    nx: points.p1_start_nx, ny: points.p1_start_nz, nz: points.p1_start_nz},
    //   {x: points.p1_end_x, y: points.p1_end_z, z: points.p1_end_z,
    //    nx: points.p1_end_nx, ny: points.p1_end_nz, nz: points.p1_end_nz},
    //   0.2, 1.0
    // )
    //
    // this.pipeMesh = createPipeMesh(
    //   {x: 0, y: 0, z: 0,
    //    nx: 0, ny: 1, nz: 0},
    //   {x: 2, y: 2, z: 2,
    //    nx: 0, ny: 0, nz: 1},
    //   0.2, 1.0
    // )

    this.fbo = firstPassFBO(640, 480);
    this.outputFBO = OutputFBO(640, 480);

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
    geomGen['pipe'](pipe);
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
    this.monkeyMesh.render(gl, this.shader);
    // this.pipeMesh.render(gl, this.shader);

    this.fbo.deactivate(gl);

    this.outputFBO.activate(gl, this.ext, this.lightingShader);
    // gl.viewport(0, 0, width * 0.5, height /2);
    this.renderLighting(gl);

    const canRead = (gl.checkFramebufferStatus(gl.FRAMEBUFFER) == gl.FRAMEBUFFER_COMPLETE);

    const pixels = new Uint8Array(this.width * this.height * 4);
    // console.log(pixels);

    if (canRead) {
      console.log("Can read! Mmmm");
      // console.log(pixels); /
     // bind the framebuffer
    //  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

     // read the pixels
     gl.getExtension("OES_texture_float");
     gl.readPixels(0, 0, this.width, this.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)

     // Unbind the framebuffer
    //  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    this.outputFBO.deactivate(gl);

    // gl.viewport(0, 0, width, height);

    // this.renderLighting(gl, this.fbo);
    //
    gl.viewport(0, 0, this.width, this.height);

    this.renderTextureToScreenSegment(gl, this.outputFBO.getTexture('test'), 0, 0,1, 1);
    // this.renderTextureToScreenSegment(gl, this.fbo.getTexture('depth'), -0.75, -0.75, 0.25, 0.25);
    // this.renderTextureToScreenSegment(gl, this.fbo.getTexture('normal'), -0.25, -0.75, 0.25, 0.25);
    // this.renderTextureToScreenSegment(gl, this.fbo.getTexture('color'), 0.25, -0.75, 0.25, 0.25);
    // gl.viewport(0, 0, width * 2, height * 2);
    // this.renderTextureToScreenSegment(gl, this.outputFBO.getTexture('test'), 0, 0, 1, 1);

    return pixels;
  }

  renderLighting(gl, originX = 0, originY = 0, width = 1, height = 1) {
    const depthTex = this.fbo.getTexture('depth');
    const normalTex = this.fbo.getTexture('normal');
    const materialTex = this.fbo.getTexture('color');

    this.lightingShader.use(gl);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, depthTex);
    this.lightingShader.updateUniform(gl, "depthTex", 0);

    gl.activeTexture(gl.TEXTURE0 + 1);
    gl.bindTexture(gl.TEXTURE_2D, normalTex);
    this.lightingShader.updateUniform(gl, "normalsTex", 1);

    gl.activeTexture(gl.TEXTURE0 + 2);
    gl.bindTexture(gl.TEXTURE_2D, materialTex);
    this.lightingShader.updateUniform(gl, "materialTex", 2);
    // console.log("BIND THIS SHADER");
    // this.lightingShader.use(gl);
    // console.log(this.l)
    this.renderToScreen(gl, this.lightingShader, 0, 0, 1.0, 1.0);
  }

  renderToScreen(gl, shader, originX, originY, width, height) {
    if (!this.screenSegmentBuffer) {
      this.screenSegmentBuffer = gl.createBuffer();
      this.screenSegmentIndexBuffer = gl.createBuffer();
    }
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
      shader.getAttributeLocation("position"),
      2, gl.FLOAT, false, 4 * FLOAT_SIZE, 0);
    gl.vertexAttribPointer(
      shader.getAttributeLocation("uv"),
      2, gl.FLOAT, false, 4 * FLOAT_SIZE, 2 * FLOAT_SIZE);

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
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

    this.renderToScreen(gl, this.renderTexShader, originX, originY, width, height);
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
    if (!this.lightingShader.built) this.lightingShader.build(gl);
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
    this.outputFBO.resize(gl, width, height);
  }
}
