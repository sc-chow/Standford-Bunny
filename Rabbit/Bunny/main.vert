#version 300 es

// Define the inputs. The first input
// will be the position and the second will be
// the color.
layout(location = 0) in vec3 position;
layout(location = 1) in vec4 color;
layout(location = 2) in vec3 a_Normal;

// Define the outputs. Since the output for the vertex
// position is a built-in variable, we just need to define
// an output for the color. Note that the default interpolation 
// qualifier is smooth, so it is not neccessary to write.
smooth out vec4 vertexColor;

// Define a uniform mat4 variable for the
// transformation matrix.
//uniform mat4 transform;
uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;
uniform mat4 light_view;

//Spot lIght position
uniform vec3 lightWorldPos;
uniform vec3 viewWorldPos;

uniform vec3 SpotLightPosi;

uniform vec4 LightPos;

out vec3 surfaceLight;
out vec3 surfaceView;
out vec3 normal;
out vec3 eye;
out vec3 lightdir;
out vec3 SpotLightPos;


// Per-vertex transformations 
// should be computed in the vertex shader.
void main() {

    // Write the position to gl_Position.
    mat4 mvp_bunny = projection*view*model;

    // Remember, we need to use homogenous coordinates.
    gl_Position =  mvp_bunny*vec4(position, 1.0f);
    // Write the color to the output defined earlier.
    vertexColor = color;
    normal = a_Normal;
    
    vec3 surfaceWorldPos = vec3((view*model*vec4(position,1.0f)));

    surfaceLight = lightWorldPos - surfaceWorldPos;
    surfaceView = viewWorldPos - surfaceWorldPos;

    SpotLightPos = (SpotLightPosi - surfaceWorldPos);

    vec3 lightpos = vec3(view*model*LightPos);

    lightdir = normalize(lightpos - surfaceWorldPos);
    eye = normalize(-surfaceWorldPos);


}