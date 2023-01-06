/*
    Initialization
*/

// The WebGL context.
var gl;
var canvas;

// Variables for spinning the cube
var angle;
var angularSpeed;

var hold;

var mouse_t_x;
var mouse_t_y;

var mouse_r_x;
var mouse_r_y;

var trans_x = 0;
var trans_y = 0;

var rotate_x = 0;
var rotate_y = 0;

var point_light = true;
var spot_light = true;
var cone_angle = 0;
var cube_angle = 0;
var cone_posi = true;
var cube_x;
var cube_z;
var rad = 20;
var cone_x;
var cone_y;
var ctr_view;

var lightPosition = vec4(1.0,1.0,1.0,0.0);
var lightAmbient = vec4(0.2,0.2,0.2,0.9);
var lightDiffuse = vec4(1.0,1.0,1.0,1.0);
var lightSpecular = vec4(2.0,2.0,2.0,2.0);

var materialAmbient = vec4(1.0,0.0,1.0,1.0);
var materialDiffuse = vec4(1.0,0.8,0.0,1.0);
var materialSpecular = vec4(1.0,0.8,0.7,1.0);
var materialShininess = 500.0;

// Sets up the canvas and WebGL context.
function initializeContext() {
    // Get and store the webgl context from the canvas    
    canvas = document.getElementById("myCanvas");
    gl = canvas.getContext("webgl2");

    // Determine the ratio between physical pixels and CSS pixels
    const pixelRatio = window.devicePixelRatio || 1;

    // Set the width and height of the canvas
    // using clientWidth and clientHeight
    canvas.width = pixelRatio * canvas.clientWidth;
    canvas.height = pixelRatio * canvas.clientHeight;

    // Set the viewport size
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Set the clear color to white.
    gl.clearColor(1, 1, 1, 0);
    // Set the line width to 1.0.
    gl.lineWidth(2.0);

    // TODO: Enable depth testing
    gl.enable(gl.DEPTH_TEST);

    logMessage("WebGL initialized.");
}

async function setup() {
    // Initialize the context.
    initializeContext();

    // Set event listeners
    setEventListeners(canvas);

    // Create cube data.
    colorCube();
    //quad( 1, 2, 3);

    // Create vertex buffer data.
    createBuffers();

    // Load shader files
    await loadShaders();

    // Compile the shaders
    compileShaders();

    // Create vertex array objects
    createVertexArrayObjects();

    //Initialize conea and cube
    Cube_init();

    // TODO: Initialize angle and angularSpeed.
    angle = 0.0;
    angularSpeed = 0.0;

    Cone_init();

    // Draw!
    requestAnimationFrame(render)

};

window.onload = setup;

function colorCube()
{
    
    quad( 1, 2, 3);
}


// Vertex position is in the format [x0, y0, z0, x1, y1, ...]
// Note that a vertex can have multiple attributes (ex. colors, normals, texture coordinates, etc.)
var positions = [];

// Vertex color data in the format [r0, g0, b0, a0, r1, g1, ...].
// Note that for every vertex position, we have an associated color.
// The number of tuples between different vertex attributes must be the same.
var colors = [];

var normals = [];


var temp_edges = [];

var edge1 = [];
var edge2 = [];
var crossprod = [];
var normalized = [];
var v1 = [];
var v2 = [];
var v3 = [];


function quad(a, b, c)
{
    var vertices = get_vertices();
    var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
        [ 1.0, 1.0, 1.0, 1.0 ]   // white
    ];


    //logMessage(cube_pos);
    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices

    //vertex color assigned by the index of the vertex
    var bunny_indices = get_faces();
    //logMessage(bunny_indices.length);
    for ( var i = 0; i < bunny_indices.length; ++i ) {
        for (var j = 0; j < 3;++j){
            positions.push(vertices[bunny_indices[i][j]-1]);
            //colors.push( vertexColors[indices[i][j]-1] );
            // for solid colored faces use
            colors.push(vertexColors[0]);

            temp_edges.push(vertices[bunny_indices[i][j]-1]);
        }
        //Get face normals
        v1 = vec3(temp_edges[0]);
        v2 = vec3(temp_edges[1]);
        v3 = vec3(temp_edges[2]);
        edge1 = subtract(v1,v2);
        edge2 = subtract(v1,v3);
        crossprod = cross(edge1,edge2);
        normalized = normalize(crossprod,false);
        temp_edges.pop();
        temp_edges.pop();
        temp_edges.pop();
        normals.push(normalized,normalized,normalized);
    }
    //logMessage(normalized);
}


// Buffer objects
var position_buffer;
var color_buffer;
var normal_buffer;
var cube_vert_buffer;
var cone_buffer;

// Creates buffers using provided data.
function createBuffers() {
    // Create a position buffer for the vertices.
    // In WebGL, the default winding order is counter-clock-wise,
    // meaning that the order of vertices in a triangle must occur
    // in a counter-clock-wise sequence relative to the viewer to be
    // considered front-facing.
    position_buffer = gl.createBuffer();

    // Bind the buffer as an ARRAY_BUFFER to tell WebGL it will
    // be used as a vertex buffer. Note that if another buffer was previously
    // bound to ARRAY_BUFFER, that binding will be broken.
    gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);

    // Set the buffer data of the buffer bound to target 
    // ARRAY_BUFFER with STATIC_DRAW usage. The usage is a hint
    // that tells the API & driver the expected usage pattern of the backing
    // data store. This allows it to make some optimizations.
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array(flatten(positions)),
        gl.STATIC_DRAW);

    // Repeat for the color vertex data.
    color_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array(flatten(colors)),
        gl.STATIC_DRAW);
    
    //Normal vertex buffer
    normal_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,normal_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);

    logMessage("Created buffers.");
}

// Shader sources
var vs_source;
var fs_source;

function loadShaderFile(url) {
    return fetch(url).then(response => response.text());
}

// Loads the shader data from the files.
async function loadShaders() {
    // Specify shader URLs for your
    // local web server.
    const shaderURLs = [
        './main.vert',
        './main.frag'
    ];

    // Load shader files.
    const shader_files = await Promise.all(shaderURLs.map(loadShaderFile));

    // Assign shader sources.
    vs_source = shader_files[0];
    fs_source = shader_files[1];

    // logMessage(vs_source);
    // logMessage(fs_source);

    logMessage("Shader files loaded.")
}

// Shader handles
var vs;
var fs;
var prog;

// Compile the GLSL shader stages and combine them
// into a shader program.
function compileShaders() {
    // Create a shader of type VERTEX_SHADER.
    vs = gl.createShader(gl.VERTEX_SHADER);
    // Specify the shader source code.
    gl.shaderSource(vs, vs_source);
    // Compile the shader.
    gl.compileShader(vs);
    // Check that the shader actually compiled (COMPILE_STATUS).
    // This can be done using the getShaderParameter function.
    // The error message can be retrieved with getShaderInfoLog.
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
        logError(gl.getShaderInfoLog(vs));
        gl.deleteShader(vs);
    }

    // Repeat for the fragment shader.
    fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fs_source);
    gl.compileShader(fs);

    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
        logError(gl.getShaderInfoLog(fs));
        gl.deleteShader(fs);
    }

    // Next we have to create a shader program
    // using the shader stages that we compiled.

    // Create a shader program.
    prog = gl.createProgram();

    // Attach the vertex and fragment shaders
    // to the program.
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);

    // Link the program
    gl.linkProgram(prog);

    // Check the LINK_STATUS using getProgramParameter
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        logError(gl.getProgramInfoLog(prog));
    }

    logMessage("Shader program compiled successfully.");
}




// Sets the uniform variables in the shader program
function setUniformVariables() {

    // Defines a 4x4 identity matrix. Note that the layout
    // in memory depends on whether the matrix is on the left or right
    // of the vector during multiplication in the vertex shader.
    // Here, this matrix is stored in column-major format.
    // To convert it to row-major, you would take its transpose.
    // For an identity matrix, these are equivalent.
    const matrix = [
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    ];

    // Tell the current rendering state to use the shader program
    gl.useProgram(prog);

    // Get the location of the uniform variable in the shader
    //var transform_loc = gl.getUniformLocation(prog, "transform");
    //Bunny
    var model_loc = gl.getUniformLocation(prog,"model");
    var view_loc = gl.getUniformLocation(prog,"view");
    var proj_loc = gl.getUniformLocation(prog,"projection");

    var lightWorldPosLoc = gl.getUniformLocation(prog,"lightWorldPos");
    var viewWorldPosLoc = gl.getUniformLocation(prog,"viewWorldPos");

    var SpotLightPosLoc = gl.getUniformLocation(prog,"SpotLightPosi");
    var SpotLightDirLoc = gl.getUniformLocation(prog,"SpotLightDir");
    var spotinnerLoc = gl.getUniformLocation(prog,"innercutoff");
    var spotouterLoc = gl.getUniformLocation(prog,"outercutoff");

    var blinnlightposloc = gl.getUniformLocation(prog,"lightPos");
    var diffuseprodloc = gl.getUniformLocation(prog,"diffuseprod");
    var ambientprodloc = gl.getUniformLocation(prog,"ambientprod");
    var specprodloc = gl.getUniformLocation(prog,"specprod");
    var blinshinelic = gl.getUniformLocation(prog,"blinn_shine");
    
    var ambientprod = mult(lightAmbient,materialAmbient);
    var diffuseprod = mult(lightDiffuse,materialDiffuse);
    var specprod = mult(lightSpecular,materialSpecular);


    var model = matrix;
    // TODO: Create a rotation matrix using the angle
    model = rotate(angle, [0.0, 1.0, 0.0]);

    // TODO: Define a camera location
    var eye = vec3(0, 0, 10);

    // TODO: Define the target position
    var target = vec3(0, 0, 0);
    
    // TODO: Define the up direction
    var up = vec3(0, 1, 0);

    // TODO: Create model-view matrix.
    var view = lookAt(
        eye,
        target,
        up
    );
    
    //Create Translation & Rotation Matrix
    var trans_m = translate(trans_x,trans_y,up_press);
    //Rotation for X axis
    var rotate_m = rotate(rotate_x,[1,0,0]);
    //Rotation for Y axis
    rotate_m = mult(rotate_m,rotate(rotate_y,[0,1,0]));
    trans_m = mult(trans_m,rotate_m);
    view = mult(view,trans_m);
    
    
    // TODO: Calculate the aspect ratio.
    var aspect = canvas.width / canvas.height;

    // TODO: Create a projection matrix.
    var projection = perspective(70.0, aspect, 0.1, 1000.0);
    
   // var model_view = mult(view, model);
    //var mv = mult(model_view,translation);
    // TODO: Multiply the matrices before sending to the shader.
    //var transform = mult(projection, trans_matrix);
    //var transform = mult(projection,model_view);
    
    // TODO: Set the data of the MVP matrix.
    gl.uniformMatrix4fv(model_loc,false,flatten(model));
    gl.uniformMatrix4fv(view_loc,false,flatten(view));
    gl.uniformMatrix4fv(proj_loc, false, flatten(projection));
    
    //Point Light Position
    gl.uniform3fv(lightWorldPosLoc, vec3(cube_x+5,5,cube_z));
    //Camera/View Position
    gl.uniform3fv(viewWorldPosLoc, vec3(0, 0, 1));

    //spotlight position vec3(0,4,2)

    gl.uniform3fv(SpotLightPosLoc,vec3(0,4,2));
    gl.uniform3fv(SpotLightDirLoc,vec3(0,0,1));
    gl.uniform1f(spotinnerLoc,25);
    gl.uniform1f(spotouterLoc,35);

    //Phong
    gl.uniform4fv(ambientprodloc,flatten(ambientprod));
    gl.uniform4fv(diffuseprodloc,flatten(diffuseprod));
    gl.uniform4fv(specprodloc,flatten(specprod));
    gl.uniform4fv(blinnlightposloc,flatten(lightPosition));
    gl.uniform1f(blinshinelic,materialShininess);

    // logMessage("Set uniform variables.")
}

// Handle for the vertex array object
//Bunny
var vao;
//Cube
var cao;
//Cone
var bao;

// Creates VAOs for vertex attributes
function createVertexArrayObjects() {

    // Create vertex array object
    vao = gl.createVertexArray();
    // Bind vertex array so we can modify it
    gl.bindVertexArray(vao);

    // Get shader location of the position vertex attribute.
    var pos_idx = gl.getAttribLocation(prog, "position");
    // Bind the position buffer again
    gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);
    // Specify the layout of the data using vertexAttribPointer.
    gl.vertexAttribPointer(pos_idx, 3, gl.FLOAT, false, 0, 0);
    // Enable this vertex attribute.
    gl.enableVertexAttribArray(pos_idx);

    // Repeat for the color vertex attribute. The size is now 4. 
    var col_idx = gl.getAttribLocation(prog, "color");
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.vertexAttribPointer(col_idx, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(col_idx);

    var norm_idx = gl.getAttribLocation(prog,"a_Normal");
    gl.bindBuffer(gl.ARRAY_BUFFER,normal_buffer);
    gl.vertexAttribPointer(norm_idx,3,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(norm_idx);
    gl.bindVertexArray(null);
    
    logMessage("Created VAOs.");

}

var cube_pos = [];

var cube_vertices = [
    -1,-1,-1, 1,-1,-1, 1, 1,-1, -1, 1,-1,
    -1,-1, 1, 1,-1, 1, 1, 1, 1, -1, 1, 1,
    -1,-1,-1, -1, 1,-1, -1, 1, 1, -1,-1, 1,
    1,-1,-1, 1, 1,-1, 1, 1, 1, 1,-1, 1,
    -1,-1,-1, -1,-1, 1, 1,-1, 1, 1,-1,-1,
    -1, 1,-1, -1, 1, 1, 1, 1, 1, 1, 1,-1, 
  ];

function Cube_init(){
    //Push vertices to array
    for (var n = 0; n < cube_vertices.length;n++){
        //cube_pos.push(cube_vertices[cube_indices[n]]);
        cube_pos.push(cube_vertices[n]);
    }
    //Cube vertex buffer
    cube_vert_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,cube_vert_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array (cube_pos) ,gl.STATIC_DRAW);

    //VAO
    cao = gl.createVertexArray();
    gl.bindVertexArray(cao);
    var cube_idx = gl.getAttribLocation(prog,"position");
    gl.bindBuffer(gl.ARRAY_BUFFER,cube_vert_buffer);
    gl.vertexAttribPointer(cube_idx,3,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(cube_idx);
    gl.bindVertexArray(null);
}

function cube_draw(){
    // Set the rendering state to use the shader program
    gl.useProgram(prog);
    //Set Uniforms variables
    const matrix = [
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    ];
    var model_loc = gl.getUniformLocation(prog,"model");
    var view_loc = gl.getUniformLocation(prog,"view");
    var proj_loc = gl.getUniformLocation(prog,"projection");
    var model = matrix;
    // TODO: Create a rotation matrix using the angle
    model = rotate(angle, [0.0, 1.0, 0.0]);

    // TODO: Define a camera location
    var eye = vec3(0, 0, 10);

    // TODO: Define the target position
    var target = vec3(0, 0, 0);
    
    // TODO: Define the up direction
    var up = vec3(0, 1, 0);

    // TODO: Create model-view matrix.
    var view = lookAt(
        eye,
        target,
        up
    );
    view = mult(view,translate(5+cube_x,5,cube_z));
    view = mult(view,translate(5,5,0));
    // TODO: Calculate the aspect ratio.
    var aspect = canvas.width / canvas.height;

    // TODO: Create a projection matrix.
    var projection = perspective(60.0, aspect, 0.1, 1000.0);
    
    gl.uniformMatrix4fv(model_loc,false,flatten(model));
    gl.uniformMatrix4fv(view_loc,false,flatten(view));
    gl.uniformMatrix4fv(proj_loc, false, flatten(projection));
}

function render_cube(){
    gl.bindVertexArray(cao);
    gl.drawArrays(gl.LINES,0,cube_pos.length);
}

var cone_pos = [];

var cone_vertices =[0,1.5,0,
                    1,-1.5,0,
                    0,1.5,0,
                    0.809017,-1.5,0.587785,
                    0,1.5,0,
                    0.309017,-1.5,0.951057,
                    0,1.5,0,
                    -0.309017,-1.5,0.951057,
                    0,1.5,0,
                    -0.809017,-1.5,0.587785,
                    0,1.5,0,
                    -1,-1.5,0,
                    0,1.5,0,
                    -0.809017,-1.5,-0.587785,
                    0,1.5,0,
                    -0.309017,-1.5,-0.951057,
                    0,1.5,0,
                    0.309017,-1.5,-0.951057,
                    0,1.5,0,
                    0.809017,-1.5,-0.587785,
                    1,-1.5,0,
                    0.809017,-1.5,0.587785,
                    0.809017,-1.5,0.587785,
                    0.309017,-1.5,0.951057,
                    0.309017,-1.5,0.951057,
                    -0.309017,-1.5,0.951057,
                    -0.309017,-1.5,0.951057,
                    -0.809017,-1.5,0.587785,
                    -0.809017,-1.5,0.587785,
                    -1,-1.5,0,
                    -1,-1.5,0,
                    -0.809017,-1.5,-0.587785,
                    -0.809017,-1.5,-0.587785,
                    -0.309017,-1.5,-0.951057,
                    -0.309017,-1.5,-0.951057,
                    0.309017,-1.5,-0.951057,
                    0.309017,-1.5,-0.951057,
                    0.809017,-1.5,-0.587785,
                    0.809017,-1.5,-0.587785,
                    1,-1.5,0
                    ];

function Cone_init(){
    for(var b = 0; b < cone_vertices.length; b++){
        cone_pos.push(cone_vertices[b]);
    }
    //logMessage(cone_pos);

    //Cone buffer
    cone_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,cone_buffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(cone_pos),gl.STATIC_DRAW);


    //VAO
    bao = gl.createVertexArray();
    gl.bindVertexArray(bao);
    var cone_idx = gl.getAttribLocation(prog,"position");
    gl.bindBuffer(gl.ARRAY_BUFFER,cone_buffer);
    gl.vertexAttribPointer(cone_idx,3,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(cone_idx);
    gl.bindVertexArray(null);
}

function cone_draw(){
    // Set the rendering state to use the shader program
    gl.useProgram(prog);
    //Set Uniforms variables
    const matrix = [
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    ];
    var model_loc = gl.getUniformLocation(prog,"model");
    var view_loc = gl.getUniformLocation(prog,"view");
    //var light_view_loc = gl.getUniformLocation(prog,"light_view");
    var proj_loc = gl.getUniformLocation(prog,"projection");
    var model = matrix;
    // TODO: Create a rotation matrix using the angle
    model = rotate(angle, [0.0, 1.0, 0.0]);

    // TODO: Define a camera location
    var eye = vec3(0, 0, 10);

    // TODO: Define the target position
    var target = vec3(0, 0, 0);
    
    // TODO: Define the up direction
    var up = vec3(0, 1, 0);

    // TODO: Create model-view matrix.
    var view = lookAt(
        eye,
        target,
        up
    );
    var c_rotate = rotate(cone_angle,[0,0,1]);
    var c_trans =translate(0,8,-4);
    var tr1 = translate(0,-1,-2);
    var ctr = mult(c_trans,c_rotate);
    var ctr1 = mult(ctr,tr1);
    ctr_view = mult(view,ctr1);

    var light_rotate = mult(view,c_rotate);
    // TODO: Calculate the aspect ratio.
    var aspect = canvas.width / canvas.height;

    // TODO: Create a projection matrix.
    var projection = perspective(60.0, aspect, 0.1, 1000.0);
    
    gl.uniformMatrix4fv(model_loc,false,flatten(model));
    gl.uniformMatrix4fv(view_loc,false,flatten(ctr_view));
    //gl.uniformMatrix4fv(light_view_loc,false,flatten(ctr_view));
    gl.uniformMatrix4fv(proj_loc, false, flatten(projection));
}

function render_cone(){
    //Cone draw
    gl.bindVertexArray(bao);
    gl.drawArrays(gl.LINES,0,cone_pos.length);
}


var previousTimestamp;
function updateAngle(timestamp) {
    // TODO: Initialize previousTimestamp the first time this is called.
    if (previousTimestamp === undefined) {
        // console.log("previous" + previousTimestamp);
        previousTimestamp = timestamp;
    }

    // TODO: Calculate the change in time in seconds
    var delta = (timestamp - previousTimestamp) / 1000;

    // TODO: Update the angle using angularSpeed and the change in time
    angle += angularSpeed*delta;
    angle -= Math.floor(angle/360.0)*360.0;

    // TODO: Decrease the angular speed using the change in time
    angularSpeed = Math.max(angularSpeed - 100.0*delta, 0.0);

    // TODO: Update previousTimestamp
    previousTimestamp = timestamp;

}

// Draws the vertex data.
function render(timestamp) {
    // TODO: Clear the color and depth buffers
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Set the rendering state to use the shader program
    gl.useProgram(prog);

    // TODO: Call updateAngle
    updateAngle(timestamp)

    // TODO: Update uniforms
    setUniformVariables();

    // Bind the VAO
    gl.bindVertexArray(vao);

    // TODO: Draw the correct number of vertices using the TRIANGLES mode.
    gl.drawArrays(gl.TRIANGLES, 0, positions.length);

    cube_draw();
    if(point_light){
        cube_angle += 0.02;
        cube_x = rad * Math.cos(-cube_angle);
        cube_z = rad * Math.sin(-cube_angle);
    }else{
        cube_angle = 0;
    }
    rad = 20;
    render_cube();

    cone_draw();
    if(spot_light){
        if(cone_angle < 90 && cone_posi == true){
            cone_angle += 1;
        }
        if(cone_angle == 90){
            cone_angle -=1;
            cone_posi = false;
        }
        if(cone_angle == -90){
            cone_posi = true;
            cone_angle += 1;
        }
        if(cone_angle > -90 && cone_posi == false){
            cone_angle -=1;

        }
    }
    else{
        cone_angle = 0;
    }
    render_cone();
    // Call this function repeatedly with requestAnimationFrame.
    requestAnimationFrame(render);
}

/*
    Input Events
*/
var up_press = 0;
var point_count = 0;
var spot_count = 0;
function setEventListeners(canvas) {
    //User is pressing a key
    canvas.addEventListener('keydown', function (event) {
        //document.getElementById("keydown").innerText = event.key;
        switch(event.key){
            case "ArrowUp":
                document.getElementById("keydown").innerText = "Up Arrow";
                up_press++;
                break;
            case "ArrowDown":
                document.getElementById("keydown").innerText = "Down Arrow";
                up_press = up_press - 1;
                break;
        }
    });
    //User releasing a key
    canvas.addEventListener('keyup', function (event) {
        document.getElementById("keyup").innerText = event.key;
    });
    canvas.addEventListener('keypress',function(event){
        document.getElementById("keypress").innerText = event.code;
        //Bunny returns back to initial orientation and location
        //Set rotation and translation back to 0
        if(event.code == "KeyR"){
            document.getElementById("keypress").innerText = "r";
            trans_x = 0;
            trans_y = 0;
            up_press = 0;
            rotate_x = 0;
            rotate_y = 0;
            point_light = true;
            spot_light = true;
        }
        //Rotation of light is turned on and off
        else if(event.code == "KeyP"){
            document.getElementById("keypress").innerText = point_count;
            //Even point count = rotation off
            if(point_count % 2 == 0){
                point_light = false;
                point_count+=1;
            }
            //Odd point count = rotation on
            else{
                point_light = true;
                point_count+=1;
            }
        }
        //Panning of light can be turned off and on
        else if(event.code == "KeyS"){
            document.getElementById("keypress").innerText = "s";
            if(spot_count % 2 == 0){
                spot_light = false;
                cone_posi = true;
                spot_count+=1;
            }
            else{
                spot_light = true;
                cone_posi = true;
                spot_count+=1;
            }
            
        }
    });
    //User moves location of a mouse of an element
    canvas.addEventListener('mousemove', function (event) {
        document.getElementById("mpos_x").innerText = event.x;
        document.getElementById("mpos_y").innerText = event.y;
        switch(hold){
            case 0:
                const rect = canvas.getBoundingClientRect();
                if(hold == 0){
                    const x = event.clientX - rect.left;
                    const y = event.clientY - rect.top;
                    mouse_t_x = x / rect.width  *  2 - 1;
                    mouse_t_y = y / rect.height * -2 + 1;
                }
                trans_x = mouse_t_x;
                trans_y = mouse_t_y;
                break;
            case 2:
                let rectangle = canvas.getBoundingClientRect();
                if(hold == 2){
                    const x_2 = event.clientX - rectangle.left;
                    const y_2 = event.clientY - rectangle.top;
                    mouse_r_x = x_2 / rectangle.width  *  2 - 1;
                    mouse_r_y = y_2 / rectangle.height * -2 + 1;
                }
                rotate_x = Math.atan2(mouse_r_y,mouse_r_x)*180;
                rotate_y = Math.atan2(mouse_r_x,mouse_r_y)*180;
                break;
        }
        //logMessage(rotate_x);
        
    });
    //User presses mouse button over element-
    canvas.addEventListener('mousedown',function(event){
        //Left click, event button = 0
        //Middle button click, event button = 1
        //Right click, event button = 2
        document.getElementById("mclick").innerText = event.button;
        if(event.button == 0){
            hold = 0;
        }
        if(event.button == 2){
            hold = 2;
        }
        
    });
    //User releases mouse button over element
    canvas.addEventListener('mouseup',function(event){
        //return to ? when mouse click is released
        document.getElementById("mclick").innerText = "?";
        hold = 1;
    });

    var click_count = 0;
    canvas.addEventListener('click', function (event) {
        click_count += 1;
        document.getElementById("click_count").innerText = click_count;
        // TODO: Increase the rate of rotation
        //angularSpeed += 50;
        
    })
}

// Logging

function logMessage(message) {
    document.getElementById("messageBox").innerText += `[msg]: ${message}\n`;
}

function logError(message) {
    document.getElementById("messageBox").innerText += `[err]: ${message}\n`;
}

function logObject(obj) {
    let message = JSON.stringify(obj, null, 2);
    document.getElementById("messageBox").innerText += `[obj]:\n${message}\n\n`;
}