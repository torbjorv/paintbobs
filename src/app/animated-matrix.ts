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

export class TranslatingMatrix implements AnimatedMatrix {

  constructor(public readonly v: vec3) { }

  get(t: number): mat4 {

    const matrix = mat4.create();
    mat4.translate(matrix, matrix, this.v);
    return matrix;
  }

}

export class ScalingMatrix implements AnimatedMatrix {

  constructor(public readonly v: vec3) { }

  get(t: number): mat4 {

    const matrix = mat4.create();
    mat4.scale(matrix, matrix, this.v);
    return matrix;
  }

}

export class IdentityMatrix implements AnimatedMatrix {
  get(t: number): mat4 {
    return mat4.create();
  }
}

export class ChainedMatrix implements AnimatedMatrix {

  constructor(public readonly matrices: AnimatedMatrix[]) { }

  get(t: number): mat4 {

    const matrix = mat4.create();
    for (const m of this.matrices) {
      mat4.multiply(matrix, matrix, m.get(t));
    }
    return matrix;
  }
}
