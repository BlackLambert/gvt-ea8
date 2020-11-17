class Light extends SceneObject
{
    constructor(position, rotation, intensity, color, mode)
    {
        super(position, rotation, Vector3.one());
        this.intensity = intensity;
        this.color = color;
        this.mode = mode;
        this.direction = Vector3.zero();
    }

    setIntensity(intensity)
    {
        this.intensity = Math.max(0, intensity);
    }

    calculateIntensity(_dir, _pos)
    {
        return this.intensity;
    }

    get reverseDirection()
    {
        return this.direction.multiply(-1.0);
    }
}