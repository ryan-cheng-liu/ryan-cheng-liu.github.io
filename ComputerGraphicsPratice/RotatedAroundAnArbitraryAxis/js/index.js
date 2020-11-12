var gl; // WebGL 物件

function initGL(canvas) {
	try {
		//取得畫布webgl元件 並設定長和寬
    gl = canvas.getContext("webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
  } catch (e) {
	  try {
      gl = canvas.getContext("experimental-webgl");
      gl.viewportWidth = canvas.width;
      gl.viewportHeight = canvas.height;
    } catch (e) { }
  }
  if (!gl) {
    alert("Could not initialise WebGL, sorry :-(\nPlease to \"http://get.webgl.org\" get one"); // click ok to continue
    window.location = "http://get.webgl.org";
  }
}

// 編譯並產生著色器
function getShader(gl, id) {
  let shaderScript = document.getElementById(id);
  if (!shaderScript) {
    return null;
  }
  var str = shaderScript.textContent;
  var shader;
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }
  gl.shaderSource(shader, str);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}

// 初始化設定著色器
var shaderProgram;
function initShaders() {
  var fragmentShader = getShader(gl, "shader-fs");
  var vertexShader = getShader(gl, "shader-vs");
  // 產生shaderProgram
  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Could not initialise shaders");
  }
  gl.useProgram(shaderProgram);
	// 將shader內的參數 與 shaderProgram參數 連結對應
  //參數1:位置
  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
  //參數2:顏色
  shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
  //參數3:mvpMatrix
  shaderProgram.mvpMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVPMatrix");
}

var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var mvpMatrix = mat4.create();
function setMatrixUniforms() {
  mat4.multiply(mvpMatrix, pMatrix, mvMatrix);
  gl.uniformMatrix4fv(shaderProgram.mvpMatrixUniform, false, mvpMatrix);
}

var cubeVertexPositionBuffer;
var cubeVertexColorBuffer;
var cubeVertexIndexBuffer;

function initBuffers() {
  // 建立立方體頂點位置的 Buffer
  cubeVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
  const vertices = [
    // Front face
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,
    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,
    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,
    // Bottom face
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,
    // Right face
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,
    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  cubeVertexPositionBuffer.itemSize = 3;
  cubeVertexPositionBuffer.numItems = 24;
  // 建立立方體頂點顏色的 Buffer
  cubeVertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
  const colors = [
    [1.0,  1.0,  1.0,  1.0],    // Front face: white
    [1.0,  0.0,  0.0,  1.0],    // Back face: red
    [0.0,  1.0,  0.0,  1.0],    // Top face: green
    [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
    [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
    [1.0,  0.0,  1.0,  1.0],    // Left face: purple
  ];
  var unpackedColors = [];
  for (let i in colors) {
    let color = colors[i];
    for (var j = 0; j < 4; ++j) {
      unpackedColors = unpackedColors.concat(color);
    }
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColors), gl.STATIC_DRAW);
  cubeVertexColorBuffer.itemSize = 4;
  cubeVertexColorBuffer.numItems = 24;
  // 建立立方體面對應表
  cubeVertexIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
  const cubeVertexIndices = [
    // front
    0, 1, 2, 
    0, 2, 3,
    // back
    4, 5, 6,
    4, 6, 7,
    // top
    8, 9, 10,
    8, 10, 11,
    // bottom
    12, 13, 14,
    12, 14, 15,
    // right
    16, 17, 18,
    16, 18, 19,
    // left
    20, 21, 22,
    20, 22, 23,
  ];
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
  cubeVertexIndexBuffer.itemSize = 1;
  cubeVertexIndexBuffer.numItems = 36;
}

function degToRad(r) {
  return Math.PI * r / 180;
}

let cubePosition = vec3.fromValues(0.0, 0.0, 0.0);
let position1 = vec3.fromValues(0.0, 0.0, 0.0);
let position2 = vec3.fromValues(0.0, 5.0, 0.0);

var r = 0;
function drawScene() {
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  mat4.perspective(pMatrix, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
  
  // 初始化矩陣
  mat4.identity(mvMatrix);
  mat4.translate(mvMatrix, mvMatrix, vec3.fromValues(0.0, 0.0, -30.0)); // 移動相機
  // 立方體位置
  mat4.translate(mvMatrix, mvMatrix, cubePosition);
  // 計算需要資訊
  let neg_cubePosition = vec3.create();
  vec3.negate(neg_cubePosition, cubePosition);
  let neg_position1 = vec3.create();
  vec3.negate(neg_position1, position1);
  let u = vec3.create(); // 方向向量
  vec3.sub(u, position2, position1);
  let v = vec3.clone(u); // 單位向量
  let l = vec3.len(u);
  vec3.div(v, v, vec3.fromValues(l, l, l));
  // 以特定直線為中心旋轉
  mat4.translate(mvMatrix, mvMatrix, neg_cubePosition);
  mat4.translate(mvMatrix, mvMatrix, position1);
  mat4.rotate(mvMatrix, mvMatrix, degToRad(r), vec3.fromValues(v[0], v[1], v[2]));
  mat4.translate(mvMatrix, mvMatrix, neg_position1);
  mat4.translate(mvMatrix, mvMatrix, cubePosition);
  // 將矩形頂點位置傳給shader
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);	
  // 將矩形頂點顏色傳給shader
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);		
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);	
  // 更新 mvpMartix
  setMatrixUniforms();
  //輸出
  gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function timetick() {
  window.requestAnimationFrame(timetick);
  drawScene();
  animate();
}

function init() {
  // initialize
  let canvas = document.getElementById("mainCanvas");
  initGL(canvas);
  initShaders();
  initBuffers();
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
}


var lastTime = 0, timeNow;
function animate() {
  timeNow = new Date().getTime();
  if (lastTime != 0) {
    const deltaTime = timeNow - lastTime;
    r += speed * (90 * deltaTime) / 1000.0;
  }
  lastTime = timeNow;
}

var speed = 1;

window.addEventListener('load', event => {
  let cpx = window.document.getElementsByName("cubePositionX")[0];
  let cpy = window.document.getElementsByName("cubePositionY")[0];
  let cpz = window.document.getElementsByName("cubePositionZ")[0];
  
  cpx.addEventListener('keyup', event => {
    if (typeof Number(cpx.value) === "number") vec3.set(cubePosition, Number(cpx.value), cubePosition[1], cubePosition[2]);
  }, true);
  cpy.addEventListener('keyup', event => {
    if (typeof Number(cpy.value) === "number") vec3.set(cubePosition, cubePosition[0], Number(cpy.value), cubePosition[2]);
  }, true);
  cpz.addEventListener('keyup', event => {
    if (typeof Number(cpz.value) === "number") vec3.set(cubePosition, cubePosition[0], cubePosition[1], Number(cpz.value));
  }, true);
  
  let v1x = window.document.getElementsByName("vertex1PositionX")[0];
  let v1y = window.document.getElementsByName("vertex1PositionY")[0];
  let v1z = window.document.getElementsByName("vertex1PositionZ")[0];
  
  v1x.addEventListener('keyup', event => {
    if (typeof Number(v1x.value) === "number") vec3.set(position1, Number(v1x.value), position1[1], position1[2]);
  }, true);
  v1y.addEventListener('keyup', event => {
    if (typeof Number(v1y.value) === "number") vec3.set(position1, position1[0], Number(v1y.value), position1[2]);
  }, true);
  v1z.addEventListener('keyup', event => {
    if (typeof Number(v1z.value) === "number") vec3.set(position1, position1[0], position1[1], Number(v1z.value));
  }, true);
  
  let v2x = window.document.getElementsByName("vertex2PositionX")[0];
  let v2y = window.document.getElementsByName("vertex2PositionY")[0];
  let v2z = window.document.getElementsByName("vertex2PositionZ")[0];
  
  v2x.addEventListener('keyup', event => {
    if (typeof Number(v2x.value) === "number") vec3.set(position2, Number(v2x.value), position2[1], position2[2]);
  }, true);
  v2y.addEventListener('keyup', event => {
    if (typeof Number(v2y.value) === "number") vec3.set(position2, position2[0], Number(v2y.value), position2[2]);
  }, true);
  v2z.addEventListener('keyup', event => {
    if (typeof Number(v2z.value) === "number") vec3.set(position2, position2[0], position2[1], Number(v2z.value));
  }, true);
  
  let s = window.document.getElementsByName("speed")[0];
  s.addEventListener('keyup', event => {
    if (typeof Number(s.value) === "number") speed = Number(s.value);
  }, true);
}, true);

function main() {
  init();
  timetick();
}
