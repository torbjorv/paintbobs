import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ɵɵtrustConstantHtml } from '@angular/core';
import vertexShaderSource from './vertex-shader-simple.glsl';
import fragmentShaderSource from './simple-frag-shader.glsl';

@Component({
  selector: 'app-renderer',
  templateUrl: './renderer.component.html',
  styleUrls: ['./renderer.component.sass']
})
export class RendererComponent implements OnInit, AfterViewInit {

  @ViewChild('viewport')
  private _canvas: ElementRef | null = null;
  private _gl: WebGLRenderingContext | null = null;

  constructor() {

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {

    if (!this._canvas) { throw new Error('TROLLS!'); }

    const gl = this._canvas.nativeElement.getContext('webgl') as WebGLRenderingContext;
    if (!gl) { throw new Error('TROLLS'); }

    gl.canvas.width = this._canvas.nativeElement.clientWidth;
    gl.canvas.height = this._canvas.nativeElement.clientHeight;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
    if (!vertexShader) { throw new Error('TROLLS!'); }
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fragmentShader) { throw new Error('TROLLS!'); }
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    const shaderProgram = gl.createProgram();
    if (!shaderProgram) { throw new Error('TROLLS!'); }

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    const vertices = [
      -0.5,0.5,0.0,
      -0.5,-0.5,0.0,
      0.5,-0.5,0.0,
      0.5,0.5,0.0
    ];
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    const indices = [3,2,1,3,1,0];
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);


    // Bind attribute to verted buffer
    // Get the attribute location
    const coord = gl.getAttribLocation(shaderProgram, 'coordinates');

    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

    // Enable the attribute
    gl.enableVertexAttribArray(coord);

    /*============= Drawing the Quad ================*/

    // Clear the canvas
    gl.clearColor(0.5, 1.5, 0.5, 0.9);

    // Enable the depth test
    gl.enable(gl.DEPTH_TEST);

    // Clear the color buffer bit
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw the triangle
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT,0);
  }

}
