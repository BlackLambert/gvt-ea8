class SceneObject
{
    constructor(localPosition, localRotation, localScale)
    {
        assert(localPosition.elements.length === 3 &&
            localRotation.elements.length === 3 &&
            localScale.elements.length === 3,
            [localPosition, localRotation, localScale],
            "Invalid arguments")

        this.localPosition = localPosition;
        this.setLocalRotation(localRotation);
        this.localScale = localScale;

        this.deltaPosition = Vector3.zero();
        this.deltaRotation = Vector3.zero();
        this.deltaScale = Vector3.zero();
    }

    get translationMatrix()
    {
        return Matrix.createTranslationMatrix(this.localPosition);
    }

    get rotationMatrixX()
    {
        return Matrix.createRotationMatrix(this.localRotation.x, 0, 4);
    }

    get rotationMatrixY()
    {
        return Matrix.createRotationMatrix(this.localRotation.y, 1, 4);
    }

    get rotationMatrixZ()
    {
        return Matrix.createRotationMatrix(this.localRotation.z, 2, 4);
    }

    get rotationMatrix()
    {
        return Matrix.createRotationMatrixXYZ(this.localRotation);
    }

    get scaleMatrix()
    {
        return Matrix.createScaleMatrix(this.localScale.elements);
    }

    transformationMatrix()
    {
        let result = Matrix.createUnitMatrix(4);
        result = result.multiply(this.scaleMatrix);
        result = result.multiply(this.rotationMatrix);
        result = result.multiply(this.translationMatrix);
        
        //console.log(zToWMatrix);
        //console.table([zToWMatrix.elements, projectionMatrix.elements, this.translationMatrix.elements, this.rotationMatrix.elements, this.scaleMatrix.elements, result.elements]);
        //console.log(result.multiply(new Matrix([50,50,50,1], 1, 4)));
        return result;
    }

    setLocalRotation(rotation)
    {
        this.localRotation = new Vector3(rotation.x%360, rotation.y%360, rotation.z%360);
    }

    animate()
    {
        this.localPosition = this.localPosition.add(this.deltaPosition);
        //console.log(this.localPosition);
        this.setLocalRotation(this.localRotation.add(this.deltaRotation));
        this.localScale = this.localScale.add(this.deltaScale);
    }

    rotateAroundCenter(rotation, distance)
    {
        assert(typeof rotation.x === "number" && typeof distance === "number", 
            [rotation, distance], 
            "Invalid distance or angle")

        this.localRotation = rotation;
        this.localPosition = new Vector3(0, 0, distance);
    }
}