export default class Renderer {
  constructor() {

  }
  render(scene, context) {
    // console.log("Render scene");
    const gl = context;

    this.setup(gl);
    this.clearCanvas(gl);
  }

  setup(gl) {
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
