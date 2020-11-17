class PointLight extends Light
{
    constructor(position, intensity, color)
    {
        super(position, Vector3.zero(), intensity, color, 2);
    }

    calculateIntensity(normal, vertexPos)
    {
        let dir = this.localPosition.subtract(vertexPos).normalized();
        let nor = normal.normalized();
        let scalar = dir.scalar(nor);
        return Math.max(0, scalar * this.intensity)
    }
}