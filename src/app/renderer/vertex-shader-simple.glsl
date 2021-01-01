attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uCameraMatrix;

varying lowp vec4 vColor;

void main(void){
    gl_Position=uProjectionMatrix * uCameraMatrix * uModelViewMatrix * aVertexPosition;
    vColor=aVertexColor;
}