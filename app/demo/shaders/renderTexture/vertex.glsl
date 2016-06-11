
varying vec2 UV;

void main() {
  vec3 n = normal;
  UV = vec2(position.x + 0.5, position.y  + 0.5);
  gl_Position = vec4(position, 1.0);
}
