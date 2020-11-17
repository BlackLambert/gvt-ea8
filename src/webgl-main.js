let gl;

// Scene
let scene;
let renderer;

let glPositionAttributeLocation = null;
let glColorAttributeLocation = null;
let glMatrixLocation = null;

let vertexBuffer = null;
let lineIndicesBuffer = null
let triangleColorBuffer = null;
let lineColorBuffer = null;
let triangleIndicesBuffer = null;


const torusInnerRadius = 120;
const torusOuterRadius = 170;
const torusPosition = new Vector3(0, 0, 0);
const torusDeltaRotation = new Vector3(2, 0, 0);
const torusResolution = 10;
const torusInnerResolution = 40;
const torusLineColor = Color.black();
const torusColor = new Color(0.9, 0.9, 0.2, 1.0);

const torus2InnerRadius = 50;
const torus2OuterRadius = 100;
const torus2Position = new Vector3(0, 0, 0);
const torus2DeltaRotation = new Vector3(0, 2, 0);
const torus2Resolution = 10;
const torus2InnerResolution = 40;
const torus2LineColor = Color.green();
const torus2Color = new Color(0.9, 0.2, 0.9, 1.0);

const sphereRadius = 75;
const sphereResolution = 4;
const spherePosition = new Vector3(0, 0, 0);
const sphereDeltaRotation = new Vector3(0, 0.5, 0);
const sphereLineColor = Color.white();
const sphereColor = new Color(0.2, 0.9, 0.9, 1.0);
const shereDistance = 250;

const directionalLightDir = new Vector3(-0.2, 0.2, -0.75);
const directionalLightIntensity = 0.6;
const directionalLightColor = new Color(1.0, 1.0,1.0,1.0);
const directionalLightDeltaRotation = 2.5;
let directionalLightAngle = 90;
let dirLight;

const pointLightDistance = 450;
const pointLightIntensity = 0.6;
const pointLightColor = new Color(1.0, 1.0,1.0,1.0);
const pointLightDeltaRotation = 2.5;
const pointLightPosition = Vector3.zero();
let pointLight;
let pointLightAngle = 270;

const ambientLightIntensity = 0.15;
const ambientLightColor = Color.white();

let sphere;
let sphereAngle = 0;
const sphereDeltaAngle = 0.5;



function webglMain()
{
    renderer = new Renderer();
    gl = renderer.gl;
    scene = createScene();
}

function createScene()
{
    // ------------------------------------------
    // Creates meshes 
    // ------------------------------------------


    let glObjects = [];
    let sceneObjects = [];
    let lights = [];

    createTorus(glObjects, sceneObjects);
    createSphere(glObjects, sceneObjects);
    colorRandom(sphere);
    //createOctahedron(glObjects, sceneObjects);
    //createCuboid(glObjects, sceneObjects, cuboidRotation, true);
    //createCuboid(glObjects, sceneObjects, cuboid2Rotation, true);
    createLights(sceneObjects, lights);
    let cam = createCamera(sceneObjects);

    // ------------------------------------------
    // Creates scene 
    // ------------------------------------------

    
    const clearColor = Color.black();
    //console.log(clearColor, sceneObjects, glObjects, cam, lights);
    return new Scene(clearColor, sceneObjects, glObjects, cam, lights);
}

function render()
{
    renderer.render(scene);
}

function colorRandom(glObject)
{
    for (let index = 0; index < glObject.vertices.length; index++) {
        glObject.setSingleFaceColor(index, Color.random());
    }
}

function createTorus(glObjects, sceneObjects)
{
    let torus = Torus.createBasic(torusInnerRadius, torusOuterRadius, torusResolution, torusInnerResolution, torusPosition, torusLineColor, torusColor);
    torus.localPosition = torusPosition;
    torus.deltaRotation = torusDeltaRotation;
    glObjects.push(torus);
    sceneObjects.push(torus);

    let torus2 = Torus.createBasic(torus2InnerRadius, torus2OuterRadius, torus2Resolution, torus2InnerResolution, torus2Position, torus2LineColor, torus2Color);
    torus2.localPosition = torus2Position;
    torus2.deltaRotation = torus2DeltaRotation;
    glObjects.push(torus2);
    sceneObjects.push(torus2);
}

function createSphere(glObjects, sceneObjects)
{
    let s = RecursiveSphere.createBasic(sphereRadius, sphereResolution, sphereLineColor, sphereColor);
    s.localPosition = spherePosition;
    s.deltaRotation = sphereDeltaRotation;
    glObjects.push(s);
    sceneObjects.push(s);
    sphere = s;
}

function createCuboid(glObjects, sceneObjects, rotation, double)
{
    let cuboid;
    if(double)
    {
        cuboid = Cuboid.createDoubleLined([cuboidWidth, cuboidHeight, cuboidDepth], cuboidLineColor, cuboidColor);
    }
    else
    {
        cuboid = Cuboid.createBasic([cuboidWidth, cuboidHeight, cuboidDepth], cuboidLineColor, cuboidColor);
    }
    cuboid.localPosition = cuboidPosition;
    cuboid.localRotation = rotation;
    cuboid.deltaRotation = cuboidDeltaRotation;
    glObjects.push(cuboid);
    sceneObjects.push(cuboid);
}

function createLights(sceneObjects, lights)
{
    dirLight = new DirectionalLight(directionalLightIntensity, 
        directionalLightColor, directionalLightDir);
    lights.push(dirLight)
    sceneObjects.push(dirLight);

    let ambientLight = new AmbientLight(ambientLightIntensity, 
        ambientLightColor);
    lights.push(ambientLight);
    sceneObjects.push(ambientLight);

    pointLight = new PointLight(pointLightPosition, pointLightIntensity, pointLightColor);
    lights.push(pointLight);
    sceneObjects.push(pointLight);
}

function createCamera(sceneObjects)
{
    let cam = Camera.createPerspective();
    sceneObjects.push(cam);
    return cam;
}

function animateSphere()
{
    let s = Math.sin(angleToRadians(sphereAngle));
    let c = Math.cos(angleToRadians(sphereAngle));
    let p = spherePosition;
    sphere.localPosition = new Vector3(p.x + shereDistance * s, p.y + shereDistance * c, p.z);
    sphereAngle = (sphereAngle + sphereDeltaAngle) % 360;
    //console.log(sphere.localPosition.elements);
}

function animateDirLight(factor)
{
    directionalLightAngle = (directionalLightAngle + directionalLightDeltaRotation*factor) % 360;
    directionalLightAngle = directionalLightAngle < 0 ? directionalLightAngle + 360 : directionalLightAngle;
    let s = Math.sin(angleToRadians(directionalLightAngle));
    let c = Math.cos(angleToRadians(directionalLightAngle));
    dirLight.direction = new Vector3(s, dirLight.direction.y, c);
    //console.log(sphere.localPosition.elements);
}

function animatePointLight(factor)
{
    pointLightAngle = (pointLightAngle + pointLightDeltaRotation*factor) % 360;
    pointLightAngle = pointLightAngle < 0 ? pointLightAngle + 360 : pointLightAngle;
    let s = Math.sin(angleToRadians(pointLightAngle));
    let c = Math.cos(angleToRadians(pointLightAngle));
    let p = pointLightPosition;
    pointLight.localPosition = new Vector3(p.x + pointLightDistance * s, p.y, p.z + pointLightDistance * c);
    //console.log(sphere.localPosition.elements);
}