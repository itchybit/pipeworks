varying vec4 camSpaceNormal;

void main() {
  vec3 n = normal;
  camSpaceNormal = normalMatrix * vec4(n, 0.0);
  gl_Position =
    projectionMatrix *
    modelViewMatrix *
    vec4(position, 1.0);
}
