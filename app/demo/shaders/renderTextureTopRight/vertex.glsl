
varying vec2 UV;

void main() {
  vec3 n = normal;
  UV = vec2(position.x, position.y);
  gl_Position = vec4(position, 1.0);
}
