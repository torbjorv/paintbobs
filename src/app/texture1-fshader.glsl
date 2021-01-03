precision highp float;

uniform sampler2D u_texture_1;
varying highp vec2 v_texcoord;
uniform highp vec3 u_colorization;


void main(void){
    vec4 tex_color = texture2D(u_texture_1, v_texcoord);
    gl_FragColor = vec4(
        tex_color[0] * u_colorization[0],
        tex_color[1] * u_colorization[1],
        tex_color[2] * u_colorization[2],
        tex_color[3]
        );
}