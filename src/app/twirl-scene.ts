import { mat4 } from 'gl-matrix';
import { Scene } from './scene';
import { TriangleModel } from './triangle-model';
import vertexShaderSource from './textured-vshader.glsl';
import fragmentShaderSource from './twirl-fshader.glsl';
import textureFragmentShaderSource from './texture1-fshader.glsl';
import { ShaderUtils } from './shader-utils';
import { ChainedMatrix, RotatingMatrix, ScalingMatrix, TranslatingMatrix } from './animated-matrix';

export class TwirlScene implements Scene {

  private readonly _projectionMatrix: mat4;
  private readonly _cameraMatrix: mat4;
  private readonly _brushTexture: WebGLTexture;
  private readonly _models: TriangleModel[];

  constructor(gl: WebGLRenderingContext) {

    this._projectionMatrix = mat4.create();
    mat4.ortho(this._projectionMatrix, -0.5, 0.5, -0.5, 0.5, 0.1, 100);

    this._cameraMatrix = mat4.create();
    mat4.lookAt(this._cameraMatrix, [0, 0, 1], [0, 0, 0], [0, 1, 0]);

    const vertices = [
      -0.5, -0.5, 0.0,
      -0.5, 0.5, 0.0,
      0.5, 0.5, 0.0,
      0.5, -0.5, 0.0
    ];

    const texCoords = [
      0.0, 0.0,
      0.0, 1.0,
      1.0, 1.0,
      1.0, 0.0
    ];

    const indices = [3, 2, 1, 3, 1, 0];

    const models = [];
    models.push(new TriangleModel(
      gl, vertices, indices, texCoords, vertexShaderSource, fragmentShaderSource
    ));

    const vertices2 = [
      -0.5, -0.5, 0.1,
      -0.5, 0.5, 0.1,
      0.5, 0.5, 0.1,
      0.5, -0.5, 0.1
    ];

    models.push(new TriangleModel(
      gl, vertices2, indices, texCoords, vertexShaderSource, textureFragmentShaderSource,
      new ChainedMatrix([
        new RotatingMatrix([0, 0, 1], 1 / 5),
        new TranslatingMatrix([0.25, 0, 0]),
        new ScalingMatrix([0.05, 0.05, 0.05]),
      ]),
      [19/255.0, 105/255.0, 122/255.0]
    ));

    models.push(new TriangleModel(
      gl, vertices2, indices, texCoords, vertexShaderSource, textureFragmentShaderSource,
      new ChainedMatrix([
        new RotatingMatrix([0, 0, 1], 1 / 7),
        new TranslatingMatrix([0, 0.25, 0]),
        new ScalingMatrix([0.05, 0.05, 0.05]),
      ]),
      [220/255.0, 100/255.0, 14/255.0]
    ));

    models.push(new TriangleModel(
      gl, vertices2, indices, texCoords, vertexShaderSource, textureFragmentShaderSource,
      new ChainedMatrix([
        new RotatingMatrix([0, 0, 1], 1 / 9),
        new TranslatingMatrix([-0.25, -0.25, 0]),
        new ScalingMatrix([0.05, 0.05, 0.05]),
      ]),
      [255/255.0, 166/255.0, 54/255.0]
    ));

    this._models = models;

    this._brushTexture = ShaderUtils.loadTexture(gl, 'assets/flare2.png');
  }

  render(gl: WebGLRenderingContext, now: number): void {

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this._brushTexture);

    gl.activeTexture(gl.TEXTURE0);

    for (const model of this._models) {
      gl.useProgram(model.shaderProgram);
      const projectionMatrixLocation = gl.getUniformLocation(model.shaderProgram, 'uProjectionMatrix');
      const modelViewMatrixLocation = gl.getUniformLocation(model.shaderProgram, 'uModelViewMatrix');
      const cameraMatrixLocation = gl.getUniformLocation(model.shaderProgram, 'uCameraMatrix');
      const uTimeLocation = gl.getUniformLocation(model.shaderProgram, 'u_time');

      gl.uniform1i(
        gl.getUniformLocation(model.shaderProgram, 'u_texture_0'),
        0);

      gl.uniform1i(
        gl.getUniformLocation(model.shaderProgram, 'u_texture_1'),
        1);

      gl.uniform1f(uTimeLocation, now);

      gl.uniformMatrix4fv(
        projectionMatrixLocation,
        false,
        this._projectionMatrix);

      const modelViewMatrix = mat4.create();

      gl.uniformMatrix4fv(
        modelViewMatrixLocation,
        false,
        modelViewMatrix);

      gl.uniformMatrix4fv(
        cameraMatrixLocation,
        false,
        this._cameraMatrix);

      model.render(gl, now);
    }


  }
}
