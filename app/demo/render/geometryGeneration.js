import {vec3,vec4, mat4} from "gl-matrix"

function create_vec3s(p){
  const pos = vec3.fromValues(p.get('x'),p.get('y'),p.get('z'));
  const norm = vec3.fromValues(p.get('nx'),p.get('ny'),p.get('nz'));
  return [pos, norm];
}

function main_axis(v){
  const x = Math.abs(v[0]);
  const y = Math.abs(v[1]);
  const z = Math.abs(v[2]);
  // console.log(x,y,z)
  if (x >= y && x >= z){
    return 0
  } else if (y >= x && y >= z){
    return 1
  } else {
    return 2
  }
}
const TESTVALS = new Map([
  ['vcount', 4],
  ['crad', 1],
  ['cdepth', 0.1],
  ['pradius', 1],
])
export function pipe(par) {
  const points = getPipePoints(par);
  const mesh = createPipeMesh(points, TESTVALS);
  // console.log(mesh);
  // return mesh;

}

function setToIndex(out, index, value){
  if(index === 0){
    vec3.set(out, value, out[1], out[2])
  } else if (index === 1){
    vec3.set(out, out[0], value, out[2])
  } else if (index === 2){
    vec3.set(out, out[0], out[1], value)
  }
}

function getPipePoints(par){
  const av = create_vec3s(par.get('start'));
  const ap = av[0]
  const an = av[1]

  const bv = create_vec3s(par.get('end'));
  const bp = bv[0]
  const bn = bv[1]
  const start_axis = main_axis(an);
  const end_axis = main_axis(bn);

  const points = [ap]
  const p1 = vec3.clone(ap);
  const p2 = vec3.clone(bp);

  // console.log(start_axis,end_axis)
  if (start_axis === end_axis){
    const p3 = vec3.fromValues(0,0,0);
    const axis = start_axis // or end_axis...
    const mid_point_on_axis = ap[axis] + ((ap[axis] + bp[axis]) / 2.0)

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
    p1[start_axis] = bp[start_axis]
    p2[end_axis] = ap[end_axis]
    if (p1 === p2){
      points.push(p1)
    } else {
      points.push(p1, p2)
    }
  }

  points.push(bp);
  // console.log(points);
  return points;
}

const ROTMETHODS = [vec3.rotateX, vec3.rotateY, vec3.rotateZ ]

function getClone(arr){
  const ret = []

  for (var i = 0; i < arr.length; i++) {
    const v = vec3.clone(arr[i]);
    ret.push(v);
  }
  return ret;
}

function getDiff(a,b){
  const r = vec3.create();
  vec3.subtract(r, a, b);
  return r;
}


function createPipeMesh(points, values){
  const verts = []
  const vert_normals = []
  const indices = []

  const vcount = values.get('vcount')
  const corner_rad = values.get('cradius')
  const corner_depth = values.get('cdepth')
  const pipe_rad = values.get('pradius')
  const vert_angle = (Math.PI * 2.0) / vcount;
  const section_vcount = vcount * 2

  const ring = []
  let current_p = vec3.fromValues(0, 0.2, 0);

  for (var vi = 0; vi < vcount; vi++) {
    const work = vec3.create();
    vec3.copy(work, current_p)
    ring.push(work);
    vec3.rotateX(current_p, current_p, vec3.create(), vert_angle);
  }

  // console.log(ring);

  for (var i_corner = 1; i_corner < points.length - 1; i_corner++) {
    const start_point = points[i_corner - 1];
    const end_point = points[i_corner + 1];
    const corner_point = points[i_corner];

    const firsth_norm = getDiff(start_point, corner_point)
    const lasth_norm = getDiff(corner_point, end_point)
    vec3.normalize(firsth_norm, firsth_norm)
    vec3.normalize(lasth_norm, lasth_norm)
    const cross = vec3.create();

    vec3.cross(cross, firsth_norm, lasth_norm);

    const rotmat = mat4.create();
    mat4.lookAt(rotmat, vec3.create(), firsth_norm, cross);

    let r = getClone(ring);
    const start_ring = r.map((v) => {
      const v4 = vec4.fromValues(v[0], v[1], v[2], 1)
      vec4.transformMat4(v4, v4, rotmat);
      const v3 = vec3.fromValues(v4[0], v4[1], v4[2]);
      vec3.add(v3, v3, start_point);
      return v3;
    })

    r = getClone(start_ring);
    const end_ring = r.map((v) => {
      const r = vec3.create();
      vec3.add(r, v, firsth_norm);
      return r
    })
    // console.log(start_ring, end_ring)
    for (var vi = 0; vi < vcount; vi++) {
      verts.push(start_ring[vi], end_ring[vi]);
    }
  }
  addIndicies(indices, vcount, verts.length);
}

function addIndicies(ind, vcount, arrLen){
  const rings = arrLen/vcount;

  for (var r = 0; r < rings; r++) {
    const ringStart = r * vcount;
    for (var v = 0; v < vcount; v++) {
      const ss = ringStart + v*2
      ind.push(ss, ss+3, ss+1)
      ind.push(ss, ss+2, ss+3)
    }
  }
}
