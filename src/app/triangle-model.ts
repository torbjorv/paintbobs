import { mat4, vec3 } from 'gl-matrix';
import { AnimatedMatrix, IdentityMatrix } from './animated-matrix';
import { ShaderUtils } from './shader-utils';

export class TriangleModel {

  public readonly shaderProgram: WebGLProgram;
  private readonly _vertexBuffer: WebGLBuffer;
  private readonly _indexBuffer: WebGLBuffer;
  private readonly _textureCoordinateBuffer: WebGLBuffer;

  constructor(
    gl: WebGLRenderingContext,
    vertices: number[],
    readonly indices: number[],
    textureCoordinates: number[],
    vertexShaderSource: string,
    fragmentShaderSource: string,
    public readonly animation: AnimatedMatrix = new IdentityMatrix(),
    public readonly colorization: vec3 | undefined = undefined,) {

      this._vertexBuffer = ShaderUtils.createArrayBuffer(gl, new Float32Array(vertices), gl.STATIC_DRAW);
      this._indexBuffer = ShaderUtils.createElementBuffer(gl, new Uint16Array(indices), gl.STATIC_DRAW);
      this._textureCoordinateBuffer = ShaderUtils.createArrayBuffer(gl, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

      this.shaderProgram = ShaderUtils.buildProgram(gl, vertexShaderSource, fragmentShaderSource);
    }

  public render(gl: WebGLRenderingContext, t: number): void {

    gl.useProgram(this.shaderProgram);

    const modelViewMatrixLocation = gl.getUniformLocation(this.shaderProgram, 'uModelViewMatrix');
    gl.uniformMatrix4fv(
      modelViewMatrixLocation,
      false,
      this.animation.get(t));

    if (this.colorization) {
      const colorizationLocation = gl.getUniformLocation(this.shaderProgram, 'u_colorization');
      gl.uniform3f(colorizationLocation, this.colorization[0], this.colorization[1], this.colorization[2]);
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
    const vertexAttribute = gl.getAttribLocation(this.shaderProgram, 'aVertexPosition');
    gl.vertexAttribPointer(vertexAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexAttribute);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._textureCoordinateBuffer);
    const texCoordAttribute = gl.getAttribLocation(this.shaderProgram, 'aTextureCoord');
    gl.vertexAttribPointer(texCoordAttribute, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texCoordAttribute);



    gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
  }

}

