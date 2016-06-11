
varying vec2 UV;

// mat3 ramp = mat3(
//   vec3(77, 69, 73),
//   vec3(33, 58, 44),
//   vec3(46, 32, 0)
// );

// const int ramp[8] = int[8](
//   77, 69, 73, 33, 58, 44, 46, 32
// );

float luminance(vec4 color) {
  float l = color.r * 0.2126 + color.g * 0.7152 + color.b * 0.0722;
  return l;
}

float toCharacter(int n) {
  if (n == 1) {
    return 96.0 / 255.0;
  } else if (n == 2) {
    return 46.0 / 255.0;
  } else if (n == 3) {
    return 44.0 / 255.0;
  } else if (n == 4) {
    return 58.0 / 255.0;
  } else if (n == 5) {
    return 33.0 / 255.0;
  } else if (n == 6) {
    return 73.0 / 255.0;
  } else if (n == 7) {
    return 70.0 / 255.0;
  } else if (n == 8) {
    return 77.0 / 255.0;
  } else {
    return 0.0 / 255.0;
  }
  // mat3 ramp = mat3(
  //   vec3(77, 69, 73),
  //   vec3(33, 58, 44),
  //   vec3(46, 32, 0)
  // );
  // int row = n / 3;
  // int column = n - row * 3;
  //
  //
  // return (ramp[row][column] / 255.0);
}

void main() {
  vec4 normal = texture2D(normalsTex, UV);
  vec4 depth = texture2D(depthTex, UV);
  vec4 material = texture2D(materialTex, UV);
  float l = luminance(normal);
  float i = floor(l * 8.0 + 0.5);
  float character = toCharacter(int(8.0 - i));
  // vec4 c = texture2D(tex, UV);
  gl_FragColor = vec4(i / 8.0, i / 8.0, i / 8.0, character);
  // gl_FragColor = vec4(1, 0, 0, 1);
}
