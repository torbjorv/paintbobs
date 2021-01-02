export interface Scene {
  render(gl: WebGLRenderingContext, now: number): void;
}
