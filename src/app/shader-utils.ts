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

  public static createArrayBuffer(gl: WebGLRenderingContext, data: BufferSource, usage: GLenum): WebGLBuffer {

    const buffer = gl.createBuffer();
    if (!buffer) { throw new Error('Failed to create array buffer.'); }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    return buffer;
  }

  public static createElementBuffer(gl: WebGLRenderingContext, data: BufferSource, usage: GLenum): WebGLBuffer {

    const buffer = gl.createBuffer();
    if (!buffer) { throw new Error('Failed to create element buffer.'); }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
    return buffer;
  }

  public static buildProgram(gl: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource: string): WebGLProgram {
    const vertexShader = ShaderUtils.loadShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = ShaderUtils.loadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    const shaderProgram = gl.createProgram();
    if (!shaderProgram) { throw new Error('TROLLS!'); }

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    return shaderProgram;
  }

  public static loadTexture(gl: WebGLRenderingContext, url: string): WebGLTexture {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    if (!texture) { throw new Error('TROLL IN TEXTURE!'); }

    // Because images have to be downloaded over the internet
    // they might take a moment until they are ready.
    // Until then put a single pixel in the texture so we can
    // use it immediately. When the image has finished downloading
    // we'll update the texture with the contents of the image.
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 0, 255]);  // opaque blue
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
      width, height, border, srcFormat, srcType,
      pixel);

    const image = new Image();
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
        srcFormat, srcType, image);

      // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    };
    image.src = url;

    return texture;
  }

  public static createTexture(gl: WebGLRenderingContext, width: GLint, height: GLint, level: GLint): WebGLTexture {
    // create to render to
    const texture = gl.createTexture();
    if (!texture) { throw new Error('TROLL IN TEXTURE!'); }

    gl.bindTexture(gl.TEXTURE_2D, texture);

    // define size and format of level 0
    const internalFormat = gl.RGBA;
    const border = 0;
    const format = gl.RGBA;
    const type = gl.UNSIGNED_BYTE;
    const data = null;
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
      width, height, border,
      format, type, data);

    // set the filtering so we don't need mips
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return texture;
  }

}

