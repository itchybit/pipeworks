export const uniformConstants = {
  float: (gl, loc, value) => gl.uniform1f(loc, value),
  vec2: (gl, loc, value) => gl.uniform2fv(loc, value),
  vec3: (gl, loc, value) => gl.uniform3fv(loc, value),
  vec4: (gl, loc, value) => gl.uniform4fv(loc, value),

  mat2: (gl, loc, value) => gl.uniformMatrix2fv(loc, false, value),
  mat3: (gl, loc, value) => gl.uniformMatrix3fv(loc, false, value),
  mat4: (gl, loc, value) => gl.uniformMatrix4fv(loc, false, value),

  int: (gl, loc, value) => gl.uniform1i(loc, value),
  vec2i: (gl, loc, value) => gl.uniform2iv(loc, value),
  vec3i: (gl, loc, value) => gl.uniform3iv(loc, value),
  vec4i: (gl, loc, value) => gl.uniform4iv(loc, value),

  sampler2D: (gl, loc, value) => gl.uniform1i(loc, value),
  samplerCube: (gl, loc, value) => gl.uniform1i(loc, value)
}
