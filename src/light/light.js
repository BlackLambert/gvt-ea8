class Light extends SceneObject
{
    constructor(position, rotation, intensity)
    {
        super(position, rotation, Vector3.zero);
        this.intensity = intensity;
    }

    setIntensity(intensity)
    {
        this.intensity = Math.max(0, intensity);
    }

    calculateIntensity(_)
    {
        return this.intensity;
    }
}