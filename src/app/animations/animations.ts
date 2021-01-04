import { mat4, vec3 } from 'gl-matrix';

export interface AnimatedMatrix {
  get(t: number): mat4;
}

export class RotatingMatrix implements AnimatedMatrix {

  constructor(public readonly axis: vec3, public readonly rps: number) { }

  get(t: number): mat4 {
    const angle = Math.PI * 2 * t * this.rps;
    const matrix = mat4.create();
    mat4.rotate(matrix, matrix, angle, this.axis);
    return matrix;
  }
}

export type Curve1 = (t: number) => number;

export class Curve3 {

  constructor(private  x: number | Curve1, private y: number | Curve1, private z: number | Curve1) { }

  public get(t: number): vec3 {
    const x = typeof(this.x) === 'function' ? this.x(t) : this.x;
    const y = typeof(this.y) === 'function' ? this.y(t) : this.y;
    const z = typeof(this.z) === 'function' ? this.z(t) : this.z;
    return [x, y, z];
  }
};

export abstract class Matrix4 implements AnimatedMatrix {

  public static translate(x: number | Curve1, y: number | Curve1, z: number | Curve1): Matrix4 {
    return new Translate(new Curve3(x, y, z));
  }

  public static scale(x: number | Curve1, y: number | Curve1, z: number | Curve1): Matrix4 {
    return new Scale(new Curve3(x, y, z));
  }

  public static rotate(axis: [number | Curve1, number | Curve1, number | Curve1], radians: number | Curve1): Matrix4 {
    return new Rotate(
      new Curve3(axis[0], axis[1], axis[2]),
      typeof(radians) === 'function' ? radians : (t: number) => radians);
  }

  public static multiply(matrices: Matrix4[]): Matrix4 {
    return new Multiply(matrices);
  }

  public static lookAt(
    eye: [number | Curve1, number | Curve1, number | Curve1],
    center: [number | Curve1, number | Curve1, number | Curve1],
    up: [number | Curve1, number | Curve1, number | Curve1]): Matrix4 {
      return new LookAt(
        new Curve3(eye[0], eye[1], eye[2]),
        new Curve3(center[0], center[1], center[2]),
        new Curve3(up[0], up[1], up[2]));
    }

  public static identity(): Matrix4 { return this.translate(0, 0, 0); }

  public abstract get(t: number): mat4;

}

class Translate extends Matrix4 {

  constructor(public v: Curve3) { super(); }

  public get(t: number): mat4 {
    const matrix = mat4.create();
    mat4.translate(matrix, matrix, this.v.get(t));
    return matrix;
  }
}

class Scale extends Matrix4 {

  constructor(public v: Curve3) { super(); }

  public get(t: number): mat4 {

    const matrix = mat4.create();
    mat4.scale(matrix, matrix, this.v.get(t));
    return matrix;
  }
}

class Rotate extends Matrix4 {

  constructor(public axis: Curve3, public radians: Curve1) { super(); }

  get(t: number): mat4 {
    const matrix = mat4.create();
    mat4.rotate(matrix, matrix, this.radians(t), this.axis.get(t));
    return matrix;
  }

}

class Multiply extends Matrix4 {

  constructor(public matrices: Matrix4[]) { super(); }

  get(t: number): mat4 {

    const matrix = mat4.create();
    for (const m of this.matrices) {
      mat4.multiply(matrix, matrix, m.get(t));
    }
    return matrix;
  }
}

class LookAt extends Matrix4 {

  constructor(public eye: Curve3, public center: Curve3, public up: Curve3) { super(); }

  get(t: number): mat4 {
    const matrix = mat4.create();
    mat4.lookAt(matrix, this.eye.get(t), this.center.get(t), this.up.get(t));
    return matrix;
  }

}

