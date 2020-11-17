class DirectionalLight extends Light
{
    constructor(intensity, color, direction)
    {
        super(Vector3.zero(), Vector3.zero(), intensity, color, 1);
        this.direction = direction;
    }

    calculateIntensity(normal, _)
    {
        let dir = this.reverseDirection().normalized();
        let nor = normal.normalized();
        let scalar = dir.dot(nor);
        return Math.max(0, scalar * this.intensity);
    }
}