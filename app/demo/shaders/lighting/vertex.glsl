
varying vec2 UV;

void main() {
  UV = uv;
  // vec3 n = normal;
  // UV = vec2(position.x / 2.0 + 0.5, position.y / 2.0 + 0.5);
  gl_Position = vec4(position, 0.0, 1.0);
}
