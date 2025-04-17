// Initialize WebGL
const canvas = document.getElementById('glCanvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    alert('WebGL not supported in your browser');
    throw new Error('WebGL not supported');
}

// Vertex Shader
const vsSource = `
    attribute vec3 aPosition;
    attribute vec3 aColor;
    
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    
    varying vec3 vColor;
    
    void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
        vColor = aColor;
    }
`;

// Fragment Shader
const fsSource = `
    precision mediump float;
    
    varying vec3 vColor;
    
    void main() {
        gl_FragColor = vec4(vColor, 1.0);
    }
`;

// Compile Shader
function compileShader(gl, source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader error:', gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

// Create and link program
const vertexShader = compileShader(gl, vsSource, gl.VERTEX_SHADER);
const fragmentShader = compileShader(gl, fsSource, gl.FRAGMENT_SHADER);
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

// Cube data
const vertices = new Float32Array([
    // Front face (red)
    -0.5, -0.5,  0.5,  1.0, 0.0, 0.0,
     0.5, -0.5,  0.5,  1.0, 0.0, 0.0,
     0.5,  0.5,  0.5,  1.0, 0.0, 0.0,
    -0.5,  0.5,  0.5,  1.0, 0.0, 0.0,
    
    // Back face (green)
    -0.5, -0.5, -0.5,  0.0, 1.0, 0.0,
     0.5, -0.5, -0.5,  0.0, 1.0, 0.0,
     0.5,  0.5, -0.5,  0.0, 1.0, 0.0,
    -0.5,  0.5, -0.5,  0.0, 1.0, 0.0,
    
    // Top face (blue)
    -0.5,  0.5, -0.5,  0.0, 0.0, 1.0,
     0.5,  0.5, -0.5,  0.0, 0.0, 1.0,
     0.5,  0.5,  0.5,  0.0, 0.0, 1.0,
    -0.5,  0.5,  0.5,  0.0, 0.0, 1.0,
    
    // Bottom face (yellow)
    -0.5, -0.5, -0.5,  1.0, 1.0, 0.0,
     0.5, -0.5, -0.5,  1.0, 1.0, 0.0,
     0.5, -0.5,  0.5,  1.0, 1.0, 0.0,
    -0.5, -0.5,  0.5,  1.0, 1.0, 0.0,
    
    // Right face (purple)
     0.5, -0.5, -0.5,  1.0, 0.0, 1.0,
     0.5,  0.5, -0.5,  1.0, 0.0, 1.0,
     0.5,  0.5,  0.5,  1.0, 0.0, 1.0,
     0.5, -0.5,  0.5,  1.0, 0.0, 1.0,
    
    // Left face (cyan)
    -0.5, -0.5, -0.5,  0.0, 1.0, 1.0,
    -0.5,  0.5, -0.5,  0.0, 1.0, 1.0,
    -0.5,  0.5,  0.5,  0.0, 1.0, 1.0,
    -0.5, -0.5,  0.5,  0.0, 1.0, 1.0
]);

const indices = new Uint16Array([
    0, 1, 2,   0, 2, 3,    // Front
    4, 5, 6,   4, 6, 7,    // Back
    8, 9, 10,  8, 10, 11,  // Top
    12, 13, 14, 12, 14, 15, // Bottom
    16, 17, 18, 16, 18, 19, // Right
    20, 21, 22, 20, 22, 23  // Left
]);

// Create buffers
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

// Set up attributes
const positionAttributeLocation = gl.getAttribLocation(program, 'aPosition');
const colorAttributeLocation = gl.getAttribLocation(program, 'aColor');

gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(
    positionAttributeLocation,
    3,
    gl.FLOAT,
    false,
    6 * 4,
    0
);

gl.enableVertexAttribArray(colorAttributeLocation);
gl.vertexAttribPointer(
    colorAttributeLocation,
    3,
    gl.FLOAT,
    false,
    6 * 4,
    3 * 4
);

// Matrix utilities
function createProjectionMatrix() {
    const fieldOfView = 45 * Math.PI / 180;
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
    return projectionMatrix;
}

// Mouse control variables
let mouseDown = false;
let lastMouseX = null;
let lastMouseY = null;
let cubeRotationX = 0;
let cubeRotationY = 0;
const rotationSpeed = 0.005;

// Mouse event handlers
canvas.addEventListener('mousedown', (e) => {
    mouseDown = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
});

canvas.addEventListener('mouseup', () => {
    mouseDown = false;
});

canvas.addEventListener('mousemove', (e) => {
    if (!mouseDown) return;
    
    const deltaX = e.clientX - lastMouseX;
    const deltaY = e.clientY - lastMouseY;
    
    cubeRotationY += deltaX * rotationSpeed;
    cubeRotationX += deltaY * rotationSpeed;
    
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
});

// Touch event handlers (Bonus)
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    mouseDown = true;
    lastMouseX = e.touches[0].clientX;
    lastMouseY = e.touches[0].clientY;
});

canvas.addEventListener('touchend', () => {
    mouseDown = false;
});

canvas.addEventListener('touchmove', (e) => {
    if (!mouseDown) return;
    e.preventDefault();
    
    const deltaX = e.touches[0].clientX - lastMouseX;
    const deltaY = e.touches[0].clientY - lastMouseY;
    
    cubeRotationY += deltaX * rotationSpeed;
    cubeRotationX += deltaY * rotationSpeed;
    
    lastMouseX = e.touches[0].clientX;
    lastMouseY = e.touches[0].clientY;
});

// Get uniform locations
const projectionMatrixLocation = gl.getUniformLocation(program, 'uProjectionMatrix');
const modelViewMatrixLocation = gl.getUniformLocation(program, 'uModelViewMatrix');

// Initial matrices
const projectionMatrix = createProjectionMatrix();
gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);

// Enable depth testing
gl.enable(gl.DEPTH_TEST);

// Render function
function render() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // Create model-view matrix
    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -6.0]);
    
    // Apply rotations
    mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotationX, [1, 0, 0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotationY, [0, 1, 0]);
    
    // Update shader
    gl.uniformMatrix4fv(modelViewMatrixLocation, false, modelViewMatrix);
    
    // Draw
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    
    requestAnimationFrame(render);
}

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniformMatrix4fv(projectionMatrixLocation, false, createProjectionMatrix());
});

// Start rendering
render();
