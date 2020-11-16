// Copyright: Sebastian Baier (sebastian.baier93@hotmail.de) 2020


webglMain();
let animation;
main();


function main()
{
    const cameraRadius = 500;
    const cameraDeltaRotation = new Vector3(0, 0, 0);
    const cameraPosition = new Vector3(0,0,cameraRadius);
    const cameraRotation = new Vector3(30,15,0);
    const maxZoom = 1000;
    const minZoom = 200;

    const deltaZoom = 6;
    const camerRotationDelta = 1;

    document.addEventListener('keydown', onKeyDown);

    function onKeyDown(event)
    {
        if(event.keyCode == 37 || event.keyCode == 65)
        {
            rotateCameraY(camerRotationDelta);
        }
        if(event.keyCode == 39 || event.keyCode == 68) 
        {
            rotateCameraY(-camerRotationDelta);
        }
        if(event.keyCode == 38 || event.keyCode == 87) 
        {
            rotateCameraX(camerRotationDelta);
        } 
        if(event.keyCode == 40 || event.keyCode == 83) 
        {
            rotateCameraX(-camerRotationDelta);
        } 
        if(event.keyCode == 189 || event.keyCode == 109) 
        {
            zoom(deltaZoom);
        } 
        if(event.keyCode == 187 || event.keyCode == 107) 
        {
            zoom(-deltaZoom);
        } 
    }

    function rotateCameraY(deltaAngle)
    {
        let p = scene.camera.localPosition;
        let r = scene.camera.localRotation;
        scene.camera.rotateAroundCenter(new Vector3(r.x, r.y + deltaAngle, r.z), p.z);
        //console.log(scene.camera.rotation[1], deltaAngle);
    }

    function rotateCameraX(deltaAngle)
    {
        let p = scene.camera.localPosition;
        let r = scene.camera.localRotation;
        scene.camera.rotateAroundCenter(new Vector3(r.x + deltaAngle, r.y, r.z), p.z);
        //console.log(scene.camera.rotation[1], deltaAngle);
    }

    function zoom(delta)
    {
        let p = scene.camera.localPosition;
        //console.log(p, delta);
        scene.camera.localPosition = new Vector3(p.x, p.y, clamp(p.z + delta, minZoom, maxZoom) );
    }

    scene.camera.localPosition = cameraPosition;
    scene.camera.localRotation = cameraRotation;
    scene.camera.deltaRotation = cameraDeltaRotation;
    //console.log(scene.glObjects[0]);
    animation = window.requestAnimationFrame(animate);
}

function animate()
{
    animateNails();
    scene.animate();
    render();
    animation = window.requestAnimationFrame(animate);
}