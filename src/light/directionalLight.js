class DirectionalLight extends Light
{
    constructor(position, rotation, intensity, direction)
    {
        super(position, rotation, intensity);
        this.direction = direction;
    }

    calculateIntensity(normal)
    {
        let scalar = this.direction.scalar(normal);
        return Math.max(0, scalar * this.intensity)
    }
}