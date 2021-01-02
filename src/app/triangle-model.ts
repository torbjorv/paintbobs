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
    fragmentShaderSource: string) {

      this._vertexBuffer = ShaderUtils.createArrayBuffer(gl, new Float32Array(vertices), gl.STATIC_DRAW);
      this._indexBuffer = ShaderUtils.createElementBuffer(gl, new Uint16Array(indices), gl.STATIC_DRAW);
      this._textureCoordinateBuffer = ShaderUtils.createArrayBuffer(gl, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

      this.shaderProgram = ShaderUtils.buildProgram(gl, vertexShaderSource, fragmentShaderSource);
    }

  public render(gl: WebGLRenderingContext): void {

    gl.useProgram(this.shaderProgram);

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

