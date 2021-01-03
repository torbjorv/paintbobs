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

    // Framebuffers for recursive twirling
    const level = 0;
    const attachmentPoint = gl.COLOR_ATTACHMENT0;
    const twirledTextureSize = 1024;

    const twirledTexture1 = ShaderUtils.createTexture(gl, twirledTextureSize, twirledTextureSize, level);
    const fb1 = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb1);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, twirledTexture1, level);

    // const twirledTexture2 = ShaderUtils.loadTexture(gl, 'assets/checkers2.jpeg');
    const twirledTexture2 = ShaderUtils.createTexture(gl, twirledTextureSize, twirledTextureSize, level);
    const fb2 = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb2);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, twirledTexture2, level);

    // Texture setup
    // const checkeredTexture = ShaderUtils.loadTexture(gl, 'assets/flower.jpg');
    gl.activeTexture(gl.TEXTURE0);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0.0, 0.0, 0.0, 1);

    // Animation loop
    let frame = 0;
    const renderer = (now: number) => {
      now *= 0.001;

      // Render twirl to texture
      if (frame % 2 === 0) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb1);
        gl.bindTexture(gl.TEXTURE_2D, twirledTexture2);

      } else {
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb2);
        gl.bindTexture(gl.TEXTURE_2D, twirledTexture1);
      }

      gl.viewport(0, 0, twirledTextureSize, twirledTextureSize);

      gl.clear(gl.COLOR_BUFFER_BIT);

      twirlScene.render(gl, now);

      // Render final scene
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      gl.viewport(0, 0, clientWidth, clientHeight);

      gl.clear(gl.COLOR_BUFFER_BIT);

      if (frame % 2 === 0) {
        gl.bindTexture(gl.TEXTURE_2D, twirledTexture1);
      } else {
        gl.bindTexture(gl.TEXTURE_2D, twirledTexture2);
      }

      finalScene.render(gl, now);

      frame++;

      requestAnimationFrame(renderer);
    };
    requestAnimationFrame(renderer);
  }
}
