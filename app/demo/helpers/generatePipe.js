import { vec3, vec4, mat4 } from 'gl-matrix';
import Mesh from '../render/mesh';

const NUM_VERTICES_RING = 24;

export function createPipeMesh(start, end, pipeRadius, cornerRadius) {
  const startPos = vec3.fromValues(start.x, start.y, start.z);
  const startNormal = vec3.fromValues(start.nx, start.ny, start.nz);

  const endPos = vec3.fromValues(end.x, end.y, end.z);
  const endNormal = vec3.fromValues(end.nx, end.ny, end.nz);

  const cornerPoints = calculateCornerPoints(startPos, startNormal, endPos, endNormal);
  console.log(cornerPoints);

  const vertices = [];
  const vertexNormals = [];
  const indices = [];

  let count = 0;

  for (let i = 0; i < (cornerPoints.length - 1); i++) {
    console.log("LOOP");
    const ring = createRing(pipeRadius, NUM_VERTICES_RING);
    const currentPoint = cornerPoints[i];
    const nextPoint = cornerPoints[i + 1]
    const diff = vec3.create();
    vec3.subtract(diff, nextPoint, currentPoint);
    const normal = vec3.create();
    vec3.normalize(normal, diff);
    const other = vec3.create();
    vec3.subtract(other, vec3.fromValues(1, 1, 1), normal);
    vec3.normalize(other, other);

    const xAxis = vec3.create();
    vec3.cross(xAxis, normal, other);

    const zAxis = vec3.create();
    vec3.cross(zAxis, xAxis, normal);
    const rotMatrix = mat4.fromValues(
      xAxis[0], xAxis[1], xAxis[2], 0,
      normal[0], normal[1], normal[2], 0,
      zAxis[0], zAxis[1], zAxis[2], 0,
      0, 0, 0, 1
    );
    const rotatedRing = ring.map((vert) => {
      const rotatedVert = vec4.create();
      vec4.transformMat4(rotatedVert, vec4.fromValues(vert[0], vert[1], vert[2], 1), rotMatrix);
      return vec3.fromValues(rotatedVert[0], rotatedVert[1], rotatedVert[2]);
    });

    rotatedRing.forEach((vert) => {
      vertices.push(...(vec3.add(vec3.create(), vert, currentPoint)));
      vertexNormals.push(0, 0, 0);
    });
    rotatedRing.forEach((vert) => {
      // const pos = vec3.add(vec3.create(), vert, nextPoint));
      // const withRad = vec3.subtract(vec3.create(), pos, )
      vertices.push(...(vec3.add(vec3.create(), vert, nextPoint)));
      vertexNormals.push(0, 0, 0);
    });
  }

  for (let i = 0; i <= cornerPoints.length; i++) {
    const start = i * NUM_VERTICES_RING;
    for (let j = 0; j < NUM_VERTICES_RING; j++) {
      indices.push(
        start + j,
        start + j + NUM_VERTICES_RING,
        start + NUM_VERTICES_RING + ((j + 1) % NUM_VERTICES_RING));
      indices.push(
        start + j,
        start + NUM_VERTICES_RING + ((j + 1) % NUM_VERTICES_RING),
        start + ((j + 1) % NUM_VERTICES_RING));
    }
  }
  // rotatedRing.forEach((vert, vi) => {
  //   const start = i * NUM_VERTICES_RING;
  //   indices.push(
  //     start + vi,
  //     start + vi + NUM_VERTICES_RING,
  //     start + NUM_VERTICES_RING + ((vi + 1) % NUM_VERTICES_RING));
  //   indices.push(
  //     start + vi,
  //     start + NUM_VERTICES_RING + ((vi + 1) % NUM_VERTICES_RING),
  //     start + ((vi + 1) % NUM_VERTICES_RING));
  // });

  return new Mesh({vertices: vertices, vertexNormals: vertexNormals, indices: indices});
}

function createRing(radius, numVertices) {
  const firstPoint = vec3.fromValues(radius, 0, 0);

  const angle = Math.PI * 2.0 / numVertices;

  const ring = [];
  for (let i = 0; i < numVertices; i++) {
    const newVertex = vec3.create();
    vec3.rotateY(newVertex, firstPoint, vec3.create(), angle * i);
    // console.log(newVertex);
    // console.log(firstPoint);
    ring.push(newVertex);
  }
  return ring;
}

function main_axis(v) {
  const x = Math.abs(v[0]);
  const y = Math.abs(v[1]);
  const z = Math.abs(v[2]);
  if (x >= y && x >= z) {
    return 0;
  } else if (y >= x && y >= z) {
    return 1;
  } else {
    return 2;
  }
}

function calculateCornerPoints(startPos, startNormal, endPos, endNormal) {
  const start_axis = main_axis(startNormal);
  const end_axis = main_axis(endNormal);

  const points = [startPos]
  const p1 = vec3.clone(startPos);
  const p2 = vec3.clone(endPos);

  // console.log(start_axis,end_axis)
  if (start_axis === end_axis){
    const p3 = vec3.fromValues(0,0,0);
    const axis = start_axis; // or end_axis...
    const mid_point_on_axis =
      startPos[axis] + ((startPos[axis] + endPos[axis]) / 2.0);

    p1[axis] = mid_point_on_axis
    p2[axis] = mid_point_on_axis
    if (p1 === p2){
      points.push(p1)
    } else {
      p3[axis] = mid_point_on_axis

      p3[(axis+1) % 3] = p1[(axis+1) % 3]
      p3[(axis-1) % 3] = p2[(axis-1) % 3]

      points.push(p1, p3, p2)
    }


  } else {
    p1[start_axis] = endPos[start_axis]
    p2[end_axis] = startPos[end_axis]
    if (p1 === p2){
      points.push(p1)
    } else {
      points.push(p1, p2)
    }
  }

  points.push(endPos);
  return points;
}
