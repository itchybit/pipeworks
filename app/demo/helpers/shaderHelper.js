

export function createShaderFromScript(gl, shaderSource, shaderType) {
  let shaderTypeConstant = null;
  if (shaderType === 'vertex') {
    shaderTypeConstant = gl.VERTEX_SHADER;
  } else if (shaderType === 'fragment') {
    shaderTypeConstant = gl.FRAGMENT_SHADER;
  } else {
    throw "Invalid shader type: " + shaderType + " provided!";
  }
  compileShader(gl, shaderSource, shaderTypeConstant);
}

export function createProgramFromScripts(gl, vertexSource, fragmentSource) {
  const vertexShader = createShaderFromScript(gl, vertexSource, 'vertex');
  const fragmentShader = createShaderFromScript(gl, fragmentSource, 'fragment');
  return createProgram(gl, vertexShader, fragmentShader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    throw ("Failed to link program:", gl.getProgramInfoLog(program));
  }

  return program;
}
