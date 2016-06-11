#extension GL_EXT_draw_buffers : require

varying vec4 camSpaceNormal;

void main() {
  // gl_FragColor = vec4(camSpaceNormal.xyz, 1.0);
  gl_FragData[0] = vec4(camSpaceNormal.xyz, 1.0);
  gl_FragData[1] = material;
}
