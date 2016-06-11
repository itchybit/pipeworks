import * as shaderHelpers from '../helpers/shaderHelpers';
import { uniformConstants } from '../constants/uniformConstants';

export default class ShaderProgram {
  constructor(vertexSource, fragmentSource) {
    this.vertexSource = vertexSource;
    this.fragmentSource = fragmentSource;
    this.uniforms = new Map();
    this.attributes = new Map();
    this.built = false;
    this.program = null;
  }

  attachUniform(name, type) {
    this.uniforms.set(name, {type: type});
  }

  attachAttribute(name, type) {
    this.attributes.set(name, {type: type});
  }

  use(gl) {
    gl.useProgram(this.program);
  }

  getAttributeLocation(name) {
    return this.attributes.get(name).location;
  }

  enableAttribute(gl, name) {
    gl.enableVertexAttribArray(this.attributes[name]);
  }

  updateUniform(gl, name, value) {
    const uniform = this.uniforms.get(name);
    const loc = uniform.location;
    const type = uniform.type;

    uniformConstants[type](gl, loc, value);
  }

  build(gl) {
    let attributeString = "";
    this.attributes.forEach((attribute, attributeName) => {
      attributeString += "attribute " + attribute.type + " " + attributeName + ";\n";
    });

    let uniformString = "";
    this.uniforms.forEach((uniform, uniformName) => {
      uniformString += "uniform " + uniform.type + " " + uniformName + ";\n";
    });

    const augmentedVertexSource =
      "precision mediump float;\n" + attributeString + uniformString + this.vertexSource;
    const augmentedFragmentSource =
      "precision mediump float;\n" + uniformString + this.fragmentSource;

    this.program = shaderHelpers.createProgramFromScripts(
      gl,
      augmentedVertexSource,
      augmentedFragmentSource);

    gl.useProgram(this.program);

    this.uniforms.forEach((uniform, uniformName) => {
      uniform.location = gl.getUniformLocation(this.program, uniformName);
    });
    this.attributes.forEach((attribute, attributeName) => {
      attribute.location = gl.getAttribLocation(this.program, attributeName);
      gl.enableVertexAttribArray(attribute.location);
    })
    this.built = true;
  }
}
