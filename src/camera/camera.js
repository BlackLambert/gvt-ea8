class Camera extends SceneObject
{

    constructor(position, rotation, fieldOfView, minFieldOfView, maxFieldOfView, near, far)
    {
        super(position, rotation, Vector3.zero());

        assert(minFieldOfView > 0 &&
            maxFieldOfView > minFieldOfView &&
            near < far,
            [fieldOfView, minFieldOfView, maxFieldOfView, near, far],
            "Invalid arguments")

        this.fieldOfView = fieldOfView;
        this.minFieldOfView = minFieldOfView;
        this.maxFieldOfView = maxFieldOfView;
        this.near = near;
        this.far = far;
    }

    
    setFieldOfView(value)
    {
        this.fieldOfView = clamp(value, this.minFieldOfView, this.maxFieldOfView);
    }

    static createOrthographic()
    {
        return new Camera(Vector3.zero(), Vector3.zero(), 60, 10, 175, 400, -400);
    }

    static createPerspective()
    {
        return new Camera(Vector3.zero(), Vector3.zero(), 60, 10, 175, 1, 2000);
    }

    get viewMatrix()
    {
        let matrix = Matrix.createUnitMatrix(4);
        //console.log(matrix);
        matrix = matrix.multiply(this.translationMatrix);
        //console.log(matrix);
        matrix = matrix.multiply(this.rotationMatrix);
        //console.log(matrix);
        matrix = matrix.inverse();
        //console.log(matrix);
        return matrix;
    }
}