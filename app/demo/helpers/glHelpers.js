

export function bufferData(gl, data, location = -1) {
  let buffer = location;
  if (location === -1) {
    buffer = gl.createBuffer();
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return buffer;
}
