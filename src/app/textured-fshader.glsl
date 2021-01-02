precision highp float;

uniform sampler2D u_texture_0;
varying highp vec2 v_texcoord;


void main(void){

    vec4 tex_color = texture2D(u_texture_0, v_texcoord);

    gl_FragColor = vec4(
        tex_color[0],  
        tex_color[0], 
        tex_color[0], 
        1
    );
}