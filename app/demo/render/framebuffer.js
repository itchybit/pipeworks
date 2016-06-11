import { genTexture } from '../helpers/glHelpers';

export default class Framebuffer {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.renderTargets = new Map();
    this.loaded = false;
  }

  resize(gl, width, height) {
    this.width = width;
    this.height = height;
    // this._load(gl, ext);
    this.renderTargets.forEach((renderTarget) => {
      let format = gl.RGBA;
      if (renderTarget.formatName === 'DEPTH_COMPONENT') {
        format = gl.DEPTH_COMPONENT;
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
      renderTarget.texture = genTexture(gl, this.width, this.height, format);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        renderTarget.type,
        gl.TEXTURE_2D,
        renderTarget.texture,
        0);
    });
    // renderTarget.texture = genTexture(gl, this.width, this.height, format);
  }

  attachRenderTarget(name, typeName, formatName) {
    this.renderTargets.set(name, {
      typeName: typeName,
      formatName: formatName
    })
  }

  activate(gl, ext, shader) {
    if (!this.loaded) {
      this._load(gl, ext);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
  }

  getTexture(name) {
    return this.renderTargets.get(name).texture;
  }

  bindTexture(gl, uniform) {

  }

  deactivate(gl) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  _load(gl, ext) {
    this.framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    let colorAttachmentCount = 0;
    this.renderTargets.forEach((renderTarget, renderTargetName) => {
      if (renderTarget.typeName === 'COLOR_ATTACHMENT') {
        renderTarget.type =
          ext['COLOR_ATTACHMENT' + colorAttachmentCount + "_WEBGL"];
        colorAttachmentCount += 1;
      } else if (renderTarget.typeName === 'DEPTH_ATTACHMENT') {
        renderTarget.type =
          gl.DEPTH_ATTACHMENT;
      }

      let format = gl.RGBA;
      if (renderTarget.formatName === 'DEPTH_COMPONENT') {
        format = gl.DEPTH_COMPONENT;
      }

      renderTarget.texture = genTexture(gl, this.width, this.height, format);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        renderTarget.type,
        gl.TEXTURE_2D,
        renderTarget.texture,
        0);
    })

    const drawAttachments = [];
    this.renderTargets.forEach((renderTarget) => {
      if (renderTarget.typeName[0] === 'C') {
        drawAttachments.push(renderTarget.type);
      }
    });
    ext.drawBuffersWEBGL(drawAttachments);

    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status !== gl.FRAMEBUFFER_COMPLETE) {
      console.log("Error: Framebuffer incomplete!");
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.loaded = true;
  }
}
