// Copyright: Sebastian Baier (sebastian.baier93@hotmail.de) 2020

class Scene
{
    constructor(clearColor, sceneObjects, glObjects, camera, lights)
    {
        this.clearColor = clearColor;
        this.sceneObjects = sceneObjects;
        this.glObjects = glObjects;
        this.camera = camera;
        this.lights = lights;
    }

    animate()
    {
        this.sceneObjects.forEach(obj => {
            obj.animate();
        });
    }
}