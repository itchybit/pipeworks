import Framebuffer from '../render/framebuffer';

export default (width, height) => {
  const fbo = new Framebuffer(width, height);
  fbo.attachRenderTarget('depth', 'DEPTH_ATTACHMENT', 'DEPTH_COMPONENT');
  fbo.attachRenderTarget('normal', 'COLOR_ATTACHMENT', 'RGB');
  fbo.attachRenderTarget('color', 'COLOR_ATTACHMENT', 'RGB');

  return fbo;
}
