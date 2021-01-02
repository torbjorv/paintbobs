import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ɵɵtrustConstantHtml } from '@angular/core';
import vertexShaderSource from './textured-vshader.glsl';
import fragmentShaderSource from './twirl-fshader.glsl';
import { ShaderUtils } from '../shader-utils';
import { mat4 } from 'gl-matrix';
import { TriangleModel } from '../triangle-model';
import { FinalScene } from '../final-scene';
import { TwirlScene } from '../twirl-scene';

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

    const clientWidth = this._canvas.nativeElement.clientWidth;
    const clientHeight = this._canvas.nativeElement.clientHeight;

    gl.canvas.width = clientWidth;
    gl.canvas.height = clientHeight;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    const finalScene = new FinalScene(gl);

    const twirlScene = new TwirlScene(gl);

    // Framebuffer
    const level = 0;
    const targetTexture = ShaderUtils.createTexture(gl, 1024, 1024, level);

    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

    // attach the texture as the first color attachment
    const attachmentPoint = gl.COLOR_ATTACHMENT0;
    gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, targetTexture, level);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    // Texture setup
    const texture = ShaderUtils.loadTexture(gl, 'assets/checkers2.jpeg');
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    const canvas = this._canvas;

    // Animation loop
    const renderer = (now: number) => {
      now *= 0.001;

      // // Render twirl to texture
      // gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      // gl.canvas.width = 1024;
      // gl.canvas.height = 1024;
      // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  
      // gl.clearColor(0.5, 1.5, 0.5, 0.9);
      // gl.enable(gl.DEPTH_TEST);
      // gl.clear(gl.COLOR_BUFFER_BIT);

      // twirlScene.render(gl, now);

      // Render final scene
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      gl.canvas.width = clientWidth;
      gl.canvas.height = clientHeight;
      gl.viewport(0, 0, clientWidth, clientHeight);

      gl.clearColor(0.5, 1.5, 0.5, 0.9);
      gl.enable(gl.DEPTH_TEST);
      gl.clear(gl.COLOR_BUFFER_BIT);

      finalScene.render(gl, now);
  
      requestAnimationFrame(renderer);
    };
    requestAnimationFrame(renderer);
  }
}
