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

    const texture = ShaderUtils.loadTexture(gl, 'assets/checkers2.jpeg');

    gl.canvas.width = this._canvas.nativeElement.clientWidth;
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

    const texCoords = [
      0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0
    ];
    const texcoordBuffer  = ShaderUtils.createArrayBuffer(gl, new Float32Array(texCoords), gl.STATIC_DRAW);

    const indices = [3, 2, 1, 3, 1, 0];
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    // Vertices
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    const vertexAttribute = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    gl.vertexAttribPointer(vertexAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexAttribute);

    // Texture coordinates
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    const texCoordAttribute = gl.getAttribLocation(shaderProgram, 'aTextureCoord');
    gl.vertexAttribPointer(texCoordAttribute, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texCoordAttribute);

    // Draw
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

    const projectionMatrixLocation = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix');
    const modelViewMatrixLocation = gl.getUniformLocation(shaderProgram, 'uModelViewMatrix');
    const cameraMatrixLocation = gl.getUniformLocation(shaderProgram, 'uCameraMatrix');
    const uSamplerLocation = gl.getUniformLocation(shaderProgram, 'u_texture_0');
    const uTimeLocation = gl.getUniformLocation(shaderProgram, 'u_time');

    // Texture setup
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(uSamplerLocation, 0);

    gl.uniformMatrix4fv(
      projectionMatrixLocation,
      false,
      projectionMatrix);

    // Draw the scene repeatedly
    const renderer = (now: number) => {
      now *= 0.001;

      const modelViewMatrix = mat4.create();
      const cubeRotation = now;
      mat4.translate(modelViewMatrix,
        modelViewMatrix,
        [-0.0, 0.0, 0.0]);
      mat4.rotate(modelViewMatrix,
        modelViewMatrix,
        cubeRotation * .7,
        [0, 0, 1]);

      const cameraMatrix = mat4.create();
      mat4.lookAt(
        cameraMatrix,
        [0, -0.5, -Math.sin(now * 0.4)*0.5 - 0.7],
        [0, 0, 0],
        [0, 1, 0]);

      gl.uniformMatrix4fv(
        modelViewMatrixLocation,
        false,
        modelViewMatrix);

      gl.uniformMatrix4fv(
        cameraMatrixLocation,
        false,
        cameraMatrix);

      gl.uniform1f(uTimeLocation, now);

      gl.clearColor(0.5, 1.5, 0.5, 0.9);
      gl.enable(gl.DEPTH_TEST);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
      requestAnimationFrame(renderer);
    };
    requestAnimationFrame(renderer);
  }
}
