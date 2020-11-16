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


const torusInnerRadius = 130;
const torusOuterRadius = 150;
const torusPosition = new Vector3(0, 0, 0);
const torusDeltaRotation = new Vector3(2, 0, 0);
const torusResolution = 10;
const torusInnerResolution = 40;
const torusLineColor = Color.black();
const torusColor = new Color(0.9, 0.9, 0.2, 1.0);

const torus2InnerRadius = 100;
const torus2OuterRadius = 120;
const torus2Position = new Vector3(0, 0, 0);
const torus2DeltaRotation = new Vector3(0, 2, 0);
const torus2Resolution = 10;
const torus2InnerResolution = 40;
const torus2LineColor = Color.black();
const torus2Color = new Color(0.9, 0.2, 0.9, 1.0);

const sphereRadius = 50;
const sphereResolution = 4;
const spherePosition = new Vector3(0, 0, 0);
const sphereDeltaRotation = new Vector3(0, 0, 0);
const sphereLineColor = Color.white();
const sphereColor = Color.black();

const octahedron2Height = 240;
const octahedron2Width = 50;
const octahedron2Position = new Vector3(0, 0, 0);
const octahedron2DeltaRotation = new Vector3(0, 0, 0);
const octahedron2LineColor = Color.white();
const octahedron2Color = Color.black();

const nailHeight = 80;
const nailWidth = 10;
const nail1Position = new Vector3(0, 0, 250);
const nail2Position = new Vector3(0, 0, -250);
const nail3Position = new Vector3(250, 0, 0);
const nail4Position = new Vector3(-250, 0, 0);
const nail5Position = new Vector3(0, 250, 0);
const nail6Position = new Vector3(0, -250, 0);
const nailRotation = new Vector3(90, 0, 0);
const nail2Rotation = new Vector3(90, 90, 0);
const nail3Rotation = new Vector3(0, 0, 0);
const nailDeltaRotation = new Vector3(0, 0, 0);
const nailLineColor = Color.black();
const nailColor = Color.red();
const nailDistance = 200;

const cuboidHeight = 20;
const cuboidWidth = 150;
const cuboidDepth = 20;
const cuboidPosition = new Vector3(0, 0, 0);
const cuboidRotation = new Vector3(0, 0, 45);
const cuboidDeltaRotation = new Vector3(0, -0.5, 0);
const cuboidLineColor = Color.black();
const cuboidColor = Color.white();


const cuboid2Rotation = new Vector3(0, 90, 360-45);

let nails = [];
let nailPositions = [];
let nailAngle = 0;
const nailDeltaAngle = 3;


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

    //createTorus(glObjects, sceneObjects);
    createSphere(glObjects, sceneObjects);
    //createOctahedron(glObjects, sceneObjects);
    //createCuboid(glObjects, sceneObjects, cuboidRotation);
    //createCuboid(glObjects, sceneObjects, cuboid2Rotation);
    //createNail(glObjects, sceneObjects, nail1Position, nailRotation);
    //createNail(glObjects, sceneObjects, nail2Position, nailRotation);
    //createNail(glObjects, sceneObjects, nail3Position, nail2Rotation);
    //createNail(glObjects, sceneObjects, nail4Position, nail2Rotation);
    //createNail(glObjects, sceneObjects, nail5Position, nail3Rotation);
    //createNail(glObjects, sceneObjects, nail6Position, nail3Rotation);
    //createLights(sceneObjects);
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
    let sphere = RecursiveSphere.createBasic(sphereRadius, sphereResolution, sphereLineColor, sphereColor);
    sphere.localPosition = spherePosition;
    sphere.deltaRotation = sphereDeltaRotation;
    glObjects.push(sphere);
    sceneObjects.push(sphere);
}

function createOctahedron(glObjects, sceneObjects)
{
    let octahedron2 = Octahedron.createBasic(octahedron2Height, octahedron2Width, octahedron2LineColor, octahedron2Color);
    octahedron2.localPosition = octahedron2Position;
    octahedron2.deltaRotation = octahedron2DeltaRotation;
    glObjects.push(octahedron2);
    sceneObjects.push(octahedron2);
}

function createCuboid(glObjects, sceneObjects, rotation)
{
    let cuboid = Cuboid.createBasic([cuboidWidth, cuboidHeight, cuboidDepth], cuboidLineColor, cuboidColor);
    cuboid.localPosition = cuboidPosition;
    cuboid.localRotation = rotation;
    cuboid.deltaRotation = cuboidDeltaRotation;
    glObjects.push(cuboid);
    sceneObjects.push(cuboid);
}

function createNail(glObjects, sceneObjects, position, rotation)
{
    let nail = Octahedron.createBasic(nailHeight, nailWidth, nailLineColor, nailColor);
    nail.localPosition = position;
    nail.localRotation = rotation;
    nail.deltaRotation = nailDeltaRotation;
    glObjects.push(nail);
    sceneObjects.push(nail);
    nails.push(nail);
    nailPositions.push(position);
}

function createLights(sceneObjects)
{

}

function createCamera(sceneObjects)
{
    let cam = Camera.createPerspective();
    sceneObjects.push(cam);
    return cam;
}

function animateNails()
{
    for (let i = 0; i < nails.length; i++) {
        const nail = nails[i];
        animateNail(nail, nailPositions[i]);
    }
    nailAngle += nailDeltaAngle % 360;
}

function animateNail(nail, position)
{
    let f = Math.sin(angleToRadians(nailAngle));
    let p = position;
    nail.localPosition = new Vector3(p.x * f, p.y * f, p.z*f);
}