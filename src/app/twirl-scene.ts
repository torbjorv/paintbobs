import { mat4 } from 'gl-matrix';
import { Scene } from './scene';
import { TriangleModel } from './triangle-model';
import vertexShaderSource from './textured-vshader.glsl';
import fragmentShaderSource from './twirl-fshader.glsl';

export class TwirlScene implements Scene {

  private readonly _projectionMatrix: mat4;
  private readonly _cameraMatrix: mat4;
  private readonly _quad: TriangleModel;

  constructor(gl: WebGLRenderingContext) {

    this._projectionMatrix = mat4.create();
    mat4.ortho(this._projectionMatrix, -0.5, 0.5, -0.5, 0.5, 0.1, 100);

    this._cameraMatrix = mat4.create();
    mat4.lookAt(this._cameraMatrix, [0, 0, -1], [0, 0, 0], [0, 1, 0]);

    const vertices = [
      -0.5, 0.5, 0.0,
      -0.5, -0.5, 0.0,
      0.5, -0.5, 0.0,
      0.5, 0.5, 0.0
    ];

    const texCoords = [
      0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0
    ];

    const indices = [3, 2, 1, 3, 1, 0];

    this._quad = new TriangleModel(
      gl, vertices, indices, texCoords, vertexShaderSource, fragmentShaderSource
    );
  }



  render(gl: WebGLRenderingContext, now: number): void {

    const model = this._quad;
    gl.useProgram(model.shaderProgram);
    const projectionMatrixLocation = gl.getUniformLocation(model.shaderProgram, 'uProjectionMatrix');
    const modelViewMatrixLocation = gl.getUniformLocation(model.shaderProgram, 'uModelViewMatrix');
    const cameraMatrixLocation = gl.getUniformLocation(model.shaderProgram, 'uCameraMatrix');
    const uSamplerLocation = gl.getUniformLocation(model.shaderProgram, 'u_texture_0');
    const uTimeLocation = gl.getUniformLocation(model.shaderProgram, 'u_time');

    gl.uniform1i(uSamplerLocation, 0);
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

    model.render(gl);
  }
}
