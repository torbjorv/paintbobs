attribute vec4 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uCameraMatrix;

// varying lowp vec4 vColor;
varying highp vec2 v_texcoord;

void main(void){
    gl_Position = uProjectionMatrix * uCameraMatrix * uModelViewMatrix * aVertexPosition;
    // vColor = aVertexColor;
    v_texcoord = aTextureCoord;
}