import Framebuffer from '../render/framebuffer';

export default (width, height) => {
  const fbo = new Framebuffer(width, height);
  fbo.attachRenderTarget('test', 'COLOR_ATTACHMENT', 'RGB');

  return fbo;
}
