import * as glHelpers from '../helpers/glHelpers';
import { FLOAT_SIZE } from '../constants';

export default class Mesh {
  constructor(obj) {
    const { vertices, vertexNormals, indices } = obj;
    this.indices = indices;
    this.loaded = false;
    this.vertexData = [];

    for (let i = 0; i < vertices.length / 3; i++) {
      this.vertexData.push(vertices[i * 3]);
      this.vertexData.push(vertices[i * 3 + 1]);
      this.vertexData.push(vertices[i * 3 + 2]);

      this.vertexData.push(vertexNormals[i * 3]);
      this.vertexData.push(vertexNormals[i * 3 + 1]);
      this.vertexData.push(vertexNormals[i * 3 + 2]);
    }
  }

  render(gl, shader) {
    if (!this.loaded) {
      this._load(gl);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

    gl.vertexAttribPointer(
      shader.getAttributeLocation("position"), 3, gl.FLOAT, false, 6 * FLOAT_SIZE, 0);
    gl.vertexAttribPointer(
      shader.getAttributeLocation("normal"), 3, gl.FLOAT, false, 6 * FLOAT_SIZE, 3 * FLOAT_SIZE);

    gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
  }

  _load(gl) {
    this.vertexBuffer = glHelpers.bufferData(gl, this.vertexData);
    this.indexBuffer = glHelpers.bufferIndexData(gl, this.indices);
    this.loaded = true;
  }

}
