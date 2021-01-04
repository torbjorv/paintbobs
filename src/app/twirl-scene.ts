import { mat4 } from 'gl-matrix';
import { Scene } from './scene';
import { TriangleModel } from './triangle-model';
import vertexShaderSource from './textured-vshader.glsl';
import fragmentShaderSource from './twirl-fshader.glsl';
import textureFragmentShaderSource from './texture1-fshader.glsl';
import { ShaderUtils } from './shader-utils';
import { Matrix4 } from './animations/animations';

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
      Matrix4.multiply([
        Matrix4.rotate([0, 0, 1], (t: number) => t * Math.PI * 2 / 5),
        Matrix4.translate(0.25, 0, 0),
        Matrix4.scale(0.03, 0.03, 0.03),
      ]),
      [19 / 255.0, 105 / 255.0, 122 / 255.0]
    ));

    models.push(new TriangleModel(
      gl, vertices2, indices, texCoords, vertexShaderSource, textureFragmentShaderSource,
      Matrix4.multiply([
        Matrix4.rotate([0, 0, 1], (t: number) => t * Math.PI * 2 / 7),
        Matrix4.translate(0, 0.25, 0),
        Matrix4.scale(0.02, 0.02, 0.02),
      ]),
      [220 / 255.0, 100 / 255.0, 14 / 255.0]
    ));

    models.push(new TriangleModel(
      gl, vertices2, indices, texCoords, vertexShaderSource, textureFragmentShaderSource,
      Matrix4.multiply([
        Matrix4.rotate([0, 0, 1], (t: number) => t * Math.PI * 2 / 8),
        Matrix4.translate(0, 0.25, 0),
        Matrix4.scale(0.01, 0.01, 0.01),
      ]),
      [1.0, 1.0, 1.0]
    ));

    models.push(new TriangleModel(
      gl, vertices2, indices, texCoords, vertexShaderSource, textureFragmentShaderSource,
      Matrix4.multiply([
        Matrix4.rotate([0, 0, 1], (t: number) => t * Math.PI * 2 / 11),
        Matrix4.translate(0, 0.25, 0),
        Matrix4.scale(0.01, 0.01, 0.01),
      ]),
      [0.0, 0.0, 0.0]
    ));

    models.push(new TriangleModel(
      gl, vertices2, indices, texCoords, vertexShaderSource, textureFragmentShaderSource,
      Matrix4.multiply([
        Matrix4.rotate([0, 0, 1], (t: number) => t * Math.PI * 2 / 9),
        Matrix4.translate(-0.25, -0.25, 0),
        Matrix4.scale(0.02, 0.02, 0.02),
      ]),
      [255 / 255.0, 166 / 255.0, 54 / 255.0]
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
