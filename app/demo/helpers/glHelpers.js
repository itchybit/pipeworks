

export function bufferData(gl, data, location = -1) {
  let buffer = location;
  if (location === -1) {
    buffer = gl.createBuffer();
  }
  // console.log(data);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return buffer;
}

export function bufferIndexData(gl, data, location = -1) {
  let buffer = location;
  if (location === -1) {
    buffer = gl.createBuffer();
  }

  // console.log(buffer);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  return buffer;
}
