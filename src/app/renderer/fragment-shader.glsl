precision mediump float;
 
uniform sampler2D u_texture_0;
uniform float u_time;
varying vec2 v_texcoord;
varying vec4 v_normal;
 
mat3 rotate2d(float angle1){
    return mat3(
        cos(angle1),     -sin(angle1),    0,
        sin(angle1),     cos(angle1),     0,
        0,              0,              1);
}

mat3 translate2d(vec3 pos){
    return mat3(
        1,      0,      0, 
        0,      1,      0,
        pos.x,  pos.y,  1);
}

void main() {

    vec3 texcoord = vec3(v_texcoord.x, v_texcoord.y, 1);

    vec3 center1 = vec3(-0.8, -0.5, 1);
    mat3 translation1 = translate2d(center1);
    vec3 texcoord_centered1 = (-translation1) * texcoord;
    float length1 = length(vec2(texcoord_centered1.x, texcoord_centered1.y));
    float angle1 = (u_time * 0.56) * (1.0 - length1) * 2.;
    mat3 rotation1 = rotate2d(angle1);
    vec3 texcoord1 = translation1 * rotation1 * (-translation1) * texcoord;


    vec3 center2 = vec3(-0.1, -0.5, 1);
    mat3 translation2 = translate2d(center2);
    vec3 texcoord_centered2 = (-translation2) * texcoord;
    float length2 = length(vec2(texcoord_centered2.x, texcoord_centered2.y));
    float angle2 = -(u_time * 0.34) * (1.0 - length2) * 2.;
    mat3 rotation2 = rotate2d(angle2);

    vec3 texcoord2 = translation2 * rotation2 * (-translation2) * texcoord;
    // texcoord1 = texcoord2;

    vec2 final = vec2(texcoord1.x + texcoord2.x,  texcoord2.y + texcoord2.y) / 2.;

    vec4 tex_color = texture2D(u_texture_0, final);


    gl_FragColor = vec4(
        tex_color[0] * v_normal.z,  
        tex_color[0] * v_normal.z, 
        tex_color[0] * v_normal.z, 
        1
    );
}