
varying vec2 UV;

void main() {
  vec4 c = texture2D(tex, UV);
  vec4 color = vec4(UV, 0.0, 1.0);
  gl_FragColor = c;
}
