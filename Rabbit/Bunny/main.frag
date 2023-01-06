#version 300 es

precision mediump float;

// TODO: Define the input to the fragment shader
// based on the output from the vertex shader,, assuming
// there are no intermediate shader stages.
in mediump vec4 vertexColor;

// TODO: Define the color output.
out mediump vec4 outputColor;

uniform vec4 diffuseprod;
uniform vec4 ambientprod;
uniform vec4 specprod;
uniform float blinn_shine;

float u_shine = 20.0;
//spotlight not working???
float uspot_shine = 90.0;

in mediump vec3 normal;
in mediump vec3 surfaceLight;
in mediump vec3 surfaceView;
in mediump vec3 eye;
in mediump vec3 lightdir;

in mediump vec3 SpotLightPos;
uniform vec3 SpotLightDir;
uniform float innercutoff;
uniform float outercutoff;

void main() {
    // TODO: Write the color to the output.
    outputColor = vertexColor;

    vec3 norm = normalize(normal);
    
    vec3 SurfaceLightDir = normalize(surfaceLight);
    vec3 SurfaceViewDir = normalize(surfaceView);

    float light = dot(normal,normalize(SurfaceLightDir));
    float specular = 0.0;

    vec3 surfaceLightSpot = normalize(SpotLightPos);
    //Point Light
    if(light > 0.0){
        specular = pow(dot(norm,normalize(surfaceLightSpot + SurfaceViewDir)),u_shine);
    }
    outputColor.rgb *=light;
    outputColor.rgb += specular;
    //SpotLight
    float dotDir = dot(surfaceLightSpot,-SpotLightDir);
    vec3 halfV = normalize(surfaceLightSpot + SurfaceViewDir);
    float inSpot = smoothstep(outercutoff,innercutoff,dotDir);
    float spot_light = inSpot * dot(norm,surfaceLightSpot);
    float spot_spec = inSpot * pow(dot(norm,halfV),uspot_shine);
    outputColor.rgb *= spot_light;
    outputColor.rgb += spot_spec;
    //Phong
    vec4 diffuse = max(dot(lightdir,normal),0.0) * diffuseprod;
    vec3 halfway = normalize(lightdir+eye);
    vec4 spec = pow(max(dot(normal,halfway),0.0),blinn_shine) * specprod;
    if (dot(lightdir,normal)< 0.0){
        spec = vec4(0.0, 0.0, 0.0, 1.0);
    }
    vec4 blinn_shade = ambientprod + diffuse + spec;
    outputColor += blinn_shade;
    
   
}