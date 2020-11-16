// Copyright: Sebastian Baier (sebastian.baier93@hotmail.de) 2020
// Highly influenced by https://webglfundamentals.org/

function createShader(gl, type, rawShader)
{
    let result = gl.createShader(type);
    gl.shaderSource(result, rawShader);
    gl.compileShader(result);
    let success = gl.getShaderParameter(result, gl.COMPILE_STATUS);
    if(success)
    {
        return result;
    }
    console.log("Failed to create shader | " + gl.getShaderInfoLog(result));
    gl.deleteShader(result);
}

function createProgram(gl, vertexShader, fragmentShader)
{
    let result = gl.createProgram();
    gl.attachShader(result, vertexShader);
    gl.attachShader(result, fragmentShader);
    gl.linkProgram(result);
    return result;
}

function createArrayBuffer(gl, array)
{
    let result = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, result);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return result;
}

function createIndexBuffer(gl, indices)
{
    let result = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, result);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return result;
}

function createGLContext(canvasID)
{
    let canvas = document.getElementById(canvasID);
    gl = canvas.getContext('webgl');

    assert(gl, [gl], "Your browser does not support webgl!");

    return gl;
}

