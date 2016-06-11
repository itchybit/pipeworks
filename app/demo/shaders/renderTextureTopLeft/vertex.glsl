
varying vec2 UV;

void main() {
  vec3 n = normal;
  UV = vec2(position.x + 1.0, position.y);
  gl_Position = vec4(position, 1.0);
}
