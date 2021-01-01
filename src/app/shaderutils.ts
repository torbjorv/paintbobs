export class ShaderUtils {

  public static loadShader(gl: WebGLRenderingContext, type: GLenum, source: string): WebGLShader {

    const shader = gl.createShader(type) as WebGLShader;
    if (!shader) { throw new Error('TROLLS!'); }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      throw new Error('MORE TROLLS!');
    }

    return shader;
  }

  public static  createArrayBuffer(gl:  WebGLRenderingContext, data: BufferSource, usage:  GLenum): WebGLBuffer {

    const buffer = gl.createBuffer();
    if (!buffer) { throw new Error('TROLLS!!!'); }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    return buffer;
  }
}
