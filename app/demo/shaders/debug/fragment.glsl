

varying vec4 camSpaceNormal;

void main() {
  gl_FragColor = vec4(camSpaceNormal.xyz, 1.0);
}
