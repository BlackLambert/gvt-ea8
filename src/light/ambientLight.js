class AmbientLight extends Light
{
    constructor(intensity, color)
    {
        super(Vector3.zero(), Vector3.zero(), intensity, color, 0);
    }

    calculateIntensity(_dir, _pos)
    {
        return this.intensity;
    }
}