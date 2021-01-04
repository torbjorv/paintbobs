import { mat4 } from 'gl-matrix';
import { Scene } from './scene';
import { TriangleModel } from './triangle-model';
import vertexShaderSource from './textured-vshader.glsl';
import fragmentShaderSource from './texture0-fshader.glsl';
import { Matrix4 } from './animations/animations';

export class FinalScene implements Scene {

  private readonly _cameraMatrix: Matrix4;
  private readonly _quad: TriangleModel;

  constructor(gl: WebGLRenderingContext) {

    this._cameraMatrix = Matrix4.lookAt(
      [0, -0.5, (t: number) => -Math.sin(t * 0.4) * 0.5 - 0.7],
      [0, 0, 0],
      [0, 1, 0]
    );

    const vertices = [
      -0.5, -0.5, 0.0,
      -0.5, 0.5, 0.0,
      0.5, 0.5, 0.0,
      0.5, -0.5, 0.0
    ];

    const texCoords = [
      0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0
    ];

    const indices = [3, 2, 1, 3, 1, 0];

    this._quad = new TriangleModel(
      gl,
      vertices, indices, texCoords,
      vertexShaderSource, fragmentShaderSource,
      Matrix4.rotate([0, 0, 1], (t: number) => t * Math.PI * 2 / 20)
    );



  }



  render(gl: WebGLRenderingContext, now: number): void {

    const model = this._quad;
    gl.useProgram(model.shaderProgram);
    const projectionMatrixLocation = gl.getUniformLocation(model.shaderProgram, 'uProjectionMatrix');
    const cameraMatrixLocation = gl.getUniformLocation(model.shaderProgram, 'uCameraMatrix');
    const uSamplerLocation = gl.getUniformLocation(model.shaderProgram, 'u_texture_0');
    const uTimeLocation = gl.getUniformLocation(model.shaderProgram, 'u_time');

    gl.uniform1i(uSamplerLocation, 0);
    gl.uniform1f(uTimeLocation, now);

    const projectionMatrix = mat4.create();
    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.width / gl.canvas.height;
    const zNear = 0.1;
    const zFar = 100.0;
    mat4.perspective(projectionMatrix,
      fieldOfView,
      aspect,
      zNear,
      zFar);

    gl.uniformMatrix4fv(
      projectionMatrixLocation,
      false,
      projectionMatrix);

    gl.uniformMatrix4fv(
      cameraMatrixLocation,
      false,
      this._cameraMatrix.get(now));

    model.render(gl, now);
  }
}
