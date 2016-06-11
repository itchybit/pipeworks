
varying vec2 UV;

void main() {
  UV = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
