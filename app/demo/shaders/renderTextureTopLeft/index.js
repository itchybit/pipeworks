import ShaderProgram from '../../render/shaderProgram';
import vertexShaderSource from './vertex.glsl';
import fragmentShaderSource from './fragment.glsl';
import { shaderValues } from './shaderValues';

const shader = new ShaderProgram(vertexShaderSource, fragmentShaderSource);
Object.keys(shaderValues.uniforms).forEach((key) => {
  const value = shaderValues.uniforms[key];
  shader.attachUniform(key, value);
});
Object.keys(shaderValues.attributes).forEach((key) => {
  const value = shaderValues.attributes[key];
  shader.attachAttribute(key, value);
});

export default shader;
