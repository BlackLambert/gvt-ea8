// Copyright: Sebastian Baier (sebastian.baier93@hotmail.de) 2020

class Renderer
{
    

    constructor()
    {

        // ------------------------------------------
        // Creating webgl context
        // ------------------------------------------

        const canvasID = "wgl-canvas";
        this.gl = createGLContext(canvasID);

        // ------------------------------------------
        // Defining vertex and fragment shaders
        // ------------------------------------------

        // Using the glsl-literal extension for shader syntax highlighting
        const glsl = x => x;

        const vertexShaderRaw = glsl`
            attribute vec4 position; 
            attribute vec4 color;
            attribute vec3 normal;
            uniform mat4 worldViewMatrix;

            varying vec4 vertexColor;
            varying vec3 vertexNormal;
            varying vec3 vetexPosition;

            void main(void) {
                vec4 pos = worldViewMatrix * position;
                gl_Position = pos;
                vertexColor = color;
                vertexNormal = normal;
                vetexPosition = pos.xyz;
            }
        `;

        const fragementShaderRaw = glsl`
            precision mediump float;
            varying vec4 vertexColor;
            varying vec3 vertexNormal;
            varying vec3 vetexPosition;
            const int LIGHT_NUM = 8;

            // -1: no light | 0: ambient light | 1: directional light | 2: point light
            uniform int lightModes[LIGHT_NUM];
            uniform vec3 lightPositions[LIGHT_NUM];
            uniform vec4 lightColors[LIGHT_NUM];
            uniform vec3 reverseLightDirections[LIGHT_NUM];
            uniform float lightIntensitys[LIGHT_NUM];
            uniform mat4 pointLightMatrix;


            void main(void) {
                vec3 normal = normalize(vertexNormal);
                float alpha = vertexColor.a;
                vec4 reflectedColor = vec4(0);
                float reflectedIntensity = 0.0;
                float ambientIntensity = 0.0;

                // Calculates the reflected color
                for(int i = 0; i < LIGHT_NUM; i++)
                {
                    int mode = lightModes[i];
                    
                    if(mode < 0)
                    {
                        break;
                    }
                    else if(mode==0)
                    {
                        vec4 col = lightColors[i];
                        float intensity = lightIntensitys[i];
                        reflectedColor += col * intensity;
                        ambientIntensity += intensity;
                    }
                    else if(mode==1)
                    {
                        vec4 col = lightColors[i];
                        float intensity = 0.0;
                        vec3 dir = normalize(reverseLightDirections[i]);
                        float reflectionIntensity = dot(normal, dir);
                        if(reflectionIntensity > 0.0)
                            intensity = reflectionIntensity * lightIntensitys[i];
                        reflectedColor += col * intensity;
                        reflectedIntensity += intensity;
                    }
                    else if(mode == 2)
                    {
                        vec4 col = lightColors[i];
                        float intensity = 0.0;
                        vec3 pos = (pointLightMatrix * vec4(lightPositions[i],1)).xyz;
                        vec3 dir = normalize(pos - vetexPosition);
                        float reflectionIntensity = dot(normal, dir);
                        if(reflectionIntensity > 0.0)
                            intensity = reflectionIntensity * lightIntensitys[i];
                        reflectedColor += col * intensity;
                        reflectedIntensity += intensity;
                    }
                }

                // Brightens color
                vec4 color = vertexColor * reflectedColor;
                float maxC = max(color.x, color.y);
                maxC = max(maxC, color.z);
                maxC = max(maxC, 0.01);
                color = color/maxC;
                color.a = vertexColor.a;

                // Sets color
                gl_FragColor = color;
                if(reflectedIntensity > 0.95)
                {
                    gl_FragColor.rgb *= ambientIntensity + max(2.0-ambientIntensity, 0.0);
                } 
                else if(reflectedIntensity > 0.7)
                {
                    gl_FragColor.rgb *= ambientIntensity + max(1.0-ambientIntensity, 0.0);
                }
                else if(reflectedIntensity > 0.3)
                {
                    gl_FragColor.rgb *= ambientIntensity + max(0.7-ambientIntensity, 0.0);
                }
                else if(reflectedIntensity > 0.0)
                {
                    gl_FragColor.rgb *= ambientIntensity + max(0.3-ambientIntensity, 0.0);
                }
                else
                {
                    gl_FragColor.rgb *= ambientIntensity;
                }
            }

            vec4 calulateColor(in vec4 color, in vec3 normal)
            {
                return vec4(1.0,1.0,1.0,1.0);
            }
        `;

        // ------------------------------------------
        // Initializes Shader
        // ------------------------------------------

        let vertexShader;
        let fragmentShader;

        vertexShader = createShader(this.gl, this.gl.VERTEX_SHADER, vertexShaderRaw);
        fragmentShader = createShader(this.gl, this.gl.FRAGMENT_SHADER, fragementShaderRaw);

        // ------------------------------------------
        // Initializes Programm
        // ------------------------------------------

        let program;
        program = createProgram(this.gl, vertexShader, fragmentShader);
        this.gl.useProgram(program);
        
        // ------------------------------------------
        // Initializes Shader Attribute Location
        // ------------------------------------------

        this.glPositionAttributeLocation = this.gl.getAttribLocation(program, "position");
        this.glColorAttributeLocation = this.gl.getAttribLocation(program, "color");
        this.glNormalAttributeLocation = this.gl.getAttribLocation(program, "normal");
        this.glMatrixLocation = this.gl.getUniformLocation(program, "worldViewMatrix");
        this.glNormalMatrixLocation = this.gl.getUniformLocation(program, "worldInverseTransposeMatrix");

        this.glLightModes = this.gl.getUniformLocation(program, "lightModes");
        this.glLightPositions = this.gl.getUniformLocation(program, "lightPositions");
        this.glLightColors = this.gl.getUniformLocation(program, "lightColors");
        this.glLightDirections = this.gl.getUniformLocation(program, "reverseLightDirections");
        this.glLightIntensitys = this.gl.getUniformLocation(program, "lightIntensitys");
        this.glPointLightMatrixLocation = this.gl.getUniformLocation(program, "pointLightMatrix");
        this.program = program;


        // ------------------------------------------
        // Create buffers
        // ------------------------------------------

        this.vertexBuffer = this.gl.createBuffer();
        this.triangleColorBuffer = this.gl.createBuffer();
        this.lineColorBuffer = this.gl.createBuffer();
        this.triangleIndicesBuffer = this.gl.createBuffer();
        this.lineIndicesBuffer = this.gl.createBuffer();
        this.normalsBuffer = this.gl.createBuffer();
    }

    render(scene)
    {
        this.drawScene(scene);

    }

    drawScene(scene)
    {
        this.initView(scene);
        this.updateLights(scene);
        for(let i = 0; i < scene.glObjects.length; i++)
        {
            let obj = scene.glObjects[i];
            this.draw(obj, scene.camera);
        }
    }

    updateLights(scene)
    {
        const LIGHT_NUM = 8;
        let amount = scene.lights.length;

        if(scene.lights.length > LIGHT_NUM)
        {
            console.log("Only " + LIGHT_NUM + " lightsources are supported!");
        }

        let pos = [];
        let modes = [];
        let intensities = [];
        let colors = [];
        let directions = [];

        for(let i = 0; i < LIGHT_NUM; i++)
        {
            if(i >= amount)
            {
                modes.push(-1);
                pos = pos.concat(Vector3.zero().elements);
                intensities.push(0);
                colors = colors.concat(Color.white().toArray());
                directions = directions.concat(Vector3.zero().elements);
            }
            else
            {
                let light = scene.lights[i];
                modes.push(light.mode);
                pos = pos.concat(light.localPosition.elements);
                intensities.push(light.intensity);
                colors = colors.concat(light.color.toArray());
                directions = directions.concat(light.reverseDirection.elements);
            }
        }

        //console.log(directions);
        //console.log(modes);
        this.gl.uniform1iv(this.glLightModes, new Int32Array(modes));
        this.gl.uniform1fv(this.glLightIntensitys, new Float32Array(intensities));
        this.gl.uniform4fv(this.glLightColors, new Float32Array(colors));
        this.gl.uniform3fv(this.glLightDirections, new Float32Array(directions));
        this.gl.uniform3fv(this.glLightPositions, new Float32Array(pos));
    }

    initView(scene)
    {
        resizeCanvas(this.gl.canvas);
        this.gl.viewport(0,0,this.gl.canvas.width,this.gl.canvas.height);
        this.gl.clearColor(scene.clearColor.r, scene.clearColor.g, scene.clearColor.b, scene.clearColor.a);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Backface Culling
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.enable(this.gl.DEPTH_TEST);
    }

    createOrthographicProjectionMatrix(camera)
    {
        const left = 0;
        const right = this.gl.canvas.clientWidth;
        const bottom = this.gl.canvas.clientHeight;
        const top = 0;
        const near = camera.near;
        const far = camera.far;
        let result = Matrix.createOrthographic(left, right, bottom, top, near, far);

        const distanceDownsizingFactor = 1;
        let zToWMatrix = Matrix.createZToWMatrix(distanceDownsizingFactor);

        result = result.multiply(zToWMatrix);
        return result;
    }

    createPerspectiveProjectionMatrix(camera)
    {
        const fieldOfView = camera.fieldOfView;
        const aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
        const near = camera.near;
        const far = camera.far;
        return Matrix.createPerspective(angleToRadians(fieldOfView), aspect, near, far);
    }

    draw(glObject, camera)
    {
        //console.log(camera);
        let transformationMatrix = glObject.transformationMatrix();
        let projectionMatrix = this.createPerspectiveProjectionMatrix(camera);
        let viewMatrix = camera.viewMatrix;

        // Bind world view matrix
        let matrix = transformationMatrix;
        matrix = matrix.multiply(viewMatrix);
        matrix = matrix.multiply(projectionMatrix);
        this.gl.uniformMatrix4fv(this.glMatrixLocation, false, matrix.elements);

        let pointMatrix = viewMatrix;
        pointMatrix = pointMatrix.multiply(projectionMatrix);
        this.gl.uniformMatrix4fv(this.glPointLightMatrixLocation, false, pointMatrix.elements);
        //console.table(matrix.elements);

        // Bind normal matrix
        this.gl.uniformMatrix4fv(this.worldInverseTransposeMatrix, false, glObject.normalMatrix.elements);
        //console.table(glObject.normalMatrix.elements);
        //console.log(normalMatrix.multiply(new Matrix([0,1,0,1], 1, 4)));

        this.bindVertices(glObject);
        this.bindNormals(glObject);

        // Drawing triangles
        this.bindAreaColors(glObject);
        this.bindTriangles(glObject);
        this.gl.drawElements(this.gl.TRIANGLES, this.triangleIndicesCount, this.gl.UNSIGNED_SHORT,0);

        // Drawing lines
        //this.bindLineColors(glObject);
        //this.bindLines(glObject);
        //this.gl.drawElements(this.gl.LINES, this.linesIndicesCount, this.gl.UNSIGNED_SHORT,0);
    }



    bindVertices(glObject)
    {
        let vertices = glObject.verticePositions;
        //console.log(vertices);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(this.glPositionAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.glPositionAttributeLocation);
    }

    bindTriangles(glObject)
    {
        let triangles = glObject.faceIndices(0);
        this.triangleIndicesCount = triangles.length;
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.triangleIndicesBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(triangles), this.gl.STATIC_DRAW);
    }

    bindLines(glObject)
    {
        let lines = glObject.wireframeIndices(0);
        this.linesIndicesCount = lines.length;
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.lineIndicesBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(lines), this.gl.STATIC_DRAW);
    }

    bindNormals(glObject)
    {
        let normals = glObject.normals;
        //console.log(normals);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalsBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normals), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(this.glNormalAttributeLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.glNormalAttributeLocation);
    }

    bindAreaColors(glObject)
    {
        let colors = glObject.faceColorValues;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.triangleColorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(this.glColorAttributeLocation, 4, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.glColorAttributeLocation);
    }

    bindLineColors(glObject)
    {
        let colors = glObject.wireframeColorValues;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.lineColorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(this.glColorAttributeLocation, 4, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.glColorAttributeLocation);
    }
}