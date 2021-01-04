import { Curve3 } from './animations';

describe('Curve3', () => {

  it('static numbers', () => {

    const curve = new Curve3(1, 2, 3);

    const actual = curve.get(1);
    expect(actual).toEqual([1, 2, 3]);
  });

  it('one function', () => {

    const curve = new Curve3((t: number) => t * 5, 2, 3);

    const actual = curve.get(1);
    expect(actual).toEqual([5, 2, 3]);
  });

});
