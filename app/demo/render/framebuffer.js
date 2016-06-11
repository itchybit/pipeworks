import { genTexture } from '../helpers/glHelpers';

export default class Framebuffer {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.renderTargets = new Map();
    this.loaded = false;
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
      }

      const format = gl.RGBA;
      // if (renderTarget.formatName === 'RGBA') {
      //
      // }

      renderTarget.texture = genTexture(gl, this.width, this.height, format);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        renderTarget.type,
        gl.TEXTURE_2D,
        renderTarget.texture,
        0);
    })
    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status !== gl.FRAMEBUFFER_COMPLETE) {
      console.log("Error: Framebuffer incomplete!");
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
}
