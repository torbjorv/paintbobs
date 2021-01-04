import { mat4, vec3 } from 'gl-matrix';
import { Curve3, Matrix4 } from './animations';

describe('Matrix4', () => {

  it('should translate static', () => {

    // given
    const matrix = Matrix4.translate(1, 2, 3);

    // when
    const actual = matrix.get(0);

    // then
    const v = vec3.create();
    vec3.transformMat4(v, v, actual);
    expect(v).toEqual(vec3.fromValues(1, 2, 3));
  });

  it('should translate with one function', () => {

    // given
    const matrix = Matrix4.translate(1, (t: number) => t * 3, 3);

    // when
    const actual = matrix.get(4);

    // then
    const v = vec3.create();
    vec3.transformMat4(v, v, actual);
    expect(v).toEqual(vec3.fromValues(1, 12, 3));
  });

});
