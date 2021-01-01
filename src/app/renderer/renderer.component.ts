import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ɵɵtrustConstantHtml } from '@angular/core';
import vertexShaderSource from './vertex-shader-simple.glsl';
import fragmentShaderSource from './simple-frag-shader.glsl';
import { ShaderUtils } from '../shaderutils';
import { mat4 } from 'gl-matrix';

@Component({
  selector: 'app-renderer',
  templateUrl: './renderer.component.html',
  styleUrls: ['./renderer.component.sass']
})
export class RendererComponent implements OnInit, AfterViewInit {

  @ViewChild('viewport')
  private _canvas: ElementRef | null = null;

  constructor() { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {

    if (!this._canvas) { throw new Error('TROLLS!'); }

    const gl = this._canvas.nativeElement.getContext('webgl') as WebGLRenderingContext;
    if (!gl) { throw new Error('TROLLS'); }

    gl.canvas.width = this._canvas.nativeElement.width;
    gl.canvas.height = this._canvas.nativeElement.clientHeight;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    console.log(this._canvas.nativeElement.clientWidth);
    console.log(this._canvas.nativeElement.clientHeight);

    const vertexShader = ShaderUtils.loadShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = ShaderUtils.loadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    const shaderProgram = gl.createProgram();
    if (!shaderProgram) { throw new Error('TROLLS!'); }

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    const vertices = [
      -0.5, 0.5, 0.0,
      -0.5, -0.5, 0.0,
      0.5, -0.5, 0.0,
      0.5, 0.5, 0.0
    ];
    const vertexBuffer = ShaderUtils.createArrayBuffer(gl, new Float32Array(vertices), gl.STATIC_DRAW);

    const colors = [
      1.0, 1.0, 1.0, 1.0,
      1.0, 0.0, 0.0, 1.0,
      0.0, 1.0, 0.0, 1.0,
      0.0, 0.0, 1.0, 1.0,
    ];
    const colorBuffer = ShaderUtils.createArrayBuffer(gl, new Float32Array(colors), gl.STATIC_DRAW);

    const indices = [3, 2, 1, 3, 1, 0];
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    // Point an attribute to the currently bound VBO
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    const vertexAttribute = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    gl.vertexAttribPointer(vertexAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexAttribute);

    // Point an attribute to the currently bound VBO
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    const colorAttribute = gl.getAttribLocation(shaderProgram, 'aVertexColor');
    gl.vertexAttribPointer(colorAttribute, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorAttribute);

    // Draw

    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.

    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.width / gl.canvas.height;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    // note: glmatrix.js always has the first argument
    // as the destination to receive the result.
    mat4.perspective(projectionMatrix,
      fieldOfView,
      aspect,
      zNear,
      zFar);

    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix = mat4.create();

    // Now move the drawing position a bit to where we want to
    // start drawing the square.

    const cubeRotation = 0.0;
    mat4.translate(modelViewMatrix,     // destination matrix
      modelViewMatrix,     // matrix to translate
      [-0.0, 0.0, -3.0]);  // amount to translate
    mat4.rotate(modelViewMatrix,  // destination matrix
      modelViewMatrix,  // matrix to rotate
      cubeRotation,     // amount to rotate in radians
      [0, 0, 1]);       // axis to rotate around (Z)
    mat4.rotate(modelViewMatrix,  // destination matrix
      modelViewMatrix,  // matrix to rotate
      cubeRotation * .7,// amount to rotate in radians
      [0, 1, 0]);       // axis to rotate around (X)

    const projectionMatrixLocation = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix');
    const modelViewMatrixLocation = gl.getUniformLocation(shaderProgram, 'uModelViewMatrix');


    gl.uniformMatrix4fv(
      projectionMatrixLocation,
      false,
      projectionMatrix);
    gl.uniformMatrix4fv(
      modelViewMatrixLocation,
      false,
      modelViewMatrix);

    gl.clearColor(0.5, 1.5, 0.5, 0.9);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
  }

}
