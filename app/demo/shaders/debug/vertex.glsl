varying vec4 normalOut;

void main() {
  vec3 n = normal;
  normalOut = projectionMatrix *
    modelViewMatrix *
    vec4(n, 1.0);
  gl_Position =
    projectionMatrix *
    modelViewMatrix *
    vec4(position, 1.0);
}
