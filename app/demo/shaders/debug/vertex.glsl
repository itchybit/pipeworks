void main() {
  gl_Position =
    projectionMatrix *
    vec4(position, 1.0);
}
