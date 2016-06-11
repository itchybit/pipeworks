import monkeyObj from '../static/monkey.obj';
import cubeObj from '../static/cube.obj';
import triangleObj from '../static/triangle.obj';
import squareObj from '../static/square.obj';
import OBJ from 'webgl-obj-loader';

export const monkey = new OBJ.Mesh(monkeyObj);
export const cube = new OBJ.Mesh(cubeObj);
export const triangle = new OBJ.Mesh(triangleObj);
export const square = new OBJ.Mesh(squareObj);
