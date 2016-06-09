import * as shaderHelpers from '../helpers/shaderHelpers';

export default class ShaderProgram {
  constructor(vertexSource, fragmentSource) {
    this.vertexSource = vertexSource;
    this.fragmentSource = fragmentSource;
    this.uniforms = new Map();
  }

  attachUniform(name, type) {
    this.uniforms[name] = {
      name: name,
      type: type
    }
  }

  updateUniform(name, value) {

  }

  build(gl) {
    const uniformString = uniforms.values().reduce((result, uniform) => {
      return result + "uniform " + uniform.type + " " + uniform.name + ";\n";
    });

    const augmentedVertexSource = uniformString + this.vertexSource;
    const augmentedFragmentSource = uniformString + this.fragmentSource;

    this.program = shaderHelpers.createProgramFromScripts(
      gl,
      augmentedVertexSource,
      augmentedFragmentSource);

    uniforms.forEach((uniform) => {
      uniform.location = getUniformLocation(this.program, uniform.name);
    });
  }
}
