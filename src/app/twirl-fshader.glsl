precision highp float;

uniform sampler2D u_texture_0;
varying highp vec2 v_texcoord;
uniform float u_time;

mat3 rotate2d(float angle1){
    return mat3(
        cos(angle1),-sin(angle1),0,
        sin(angle1),cos(angle1),0,
    0,0,1);
}

mat3 translate2d(vec2 pos){
    return mat3(
        1,0,0,
        0,1,0,
    pos.x,pos.y,1);
}

void main(void){
    
    vec3 texcoord=vec3(v_texcoord.x,v_texcoord.y,1);
    
    vec2 center1=vec2(.65,.65);
    vec3 texcoord_centered1=translate2d(-center1)*texcoord;
    float length1=length(vec2(texcoord_centered1.x,texcoord_centered1.y));
    float angle1=.07*(1.-length1);
    mat3 rotation1=rotate2d(angle1);
    vec3 texcoord1=translate2d(center1)*rotation1*translate2d(-center1)*texcoord;
    
    vec2 center2=vec2(.35,.35);
    vec3 texcoord_centered2=translate2d(-center2)*texcoord;
    float length2=length(vec2(texcoord_centered2.x,texcoord_centered2.y));
    float angle2=-.06*(1.-length2);
    mat3 rotation2=rotate2d(angle2);
    vec3 texcoord2=translate2d(center2)*rotation2*translate2d(-center2)*texcoord;

    vec2 center3=vec2(0.5,0.5);
    vec3 texcoord_centered3=translate2d(-center3)*texcoord;
    float length3=length(vec2(texcoord_centered3.x,texcoord_centered3.y));
    float angle3=-.1*(0.5-length3);
    mat3 rotation3=rotate2d(angle3);
    vec3 texcoord3=translate2d(center3)*rotation3*translate2d(-center3)*texcoord;

    vec2 final=vec2(texcoord1.x+texcoord2.x+texcoord3.x,texcoord1.y+texcoord2.y+texcoord3.y)/3.;
    
    vec4 tex_color=texture2D(u_texture_0,final);
    gl_FragColor=vec4(
        tex_color[0],
        tex_color[1],
        tex_color[2],
        1
    );
}