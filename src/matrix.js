// Copyright: Sebastian Baier (sebastian.baier93@hotmail.de) 2020

class Matrix
{
    constructor(elements, width, height)
    {
        assert(elements != undefined && 
            typeof width === "number" &&
            typeof height === "number" && 
            width > 0 && 
            height > 0 &&
            elements.length != 0 && 
            elements.length === width * height, 
            [elements, width, height], 
            "invalid input");

        this.elements = elements;
        this.width = width;
        this.height = height;
    }

    static create3x3(elements)
    {
        return new Matrix(elements, 3, 3);
    }

    static create4x4(elements)
    {
        return new Matrix(elements, 4, 4);
    }

    static createUnitMatrix(size)
    {
        assert(typeof size === "number" && 
            size > 0 , 
            [size], 
            "invalid input");

        let elements = [];

        for(let i = 0; i<size; i++)
        {
            for(let j = 0; j<size; j++)
            {
                elements.push(i - j == 0 ? 1 : 0);
            }
        }

        return new Matrix(elements, size, size);
    }

    static createZeroMatrix(width, height)
    {
        assert(typeof width === "number" && 
            typeof height === "number" && 
            width > 0 && 
            height > 0, 
            [width, height], 
            "invalid input");

        let elements = [];
        for (let i = 0; i < width * height; i++) {
            elements.push(0);
        }
        return new Matrix(elements, width, height);
    }

    static createTranslationMatrix(translation)
    {
        assert(
            translation.elements != undefined&&
            translation.length > 0&&
            translation.length < 4, 
            [translation], 
            "invalid input");
        let size = translation.length+1;
        let m = Matrix.createUnitMatrix(size);
        let rowIndex = (size - 1)*size;
        for (let i = 0; i < translation.length; i++) {
            m.elements[rowIndex + i] = translation.elements[i];
        }
        //console.log(m);
        return m;
    }

    static createRotationMatrixXYZ(rotation)
    {
        let result = Matrix.createUnitMatrix(4);
        result = result.multiply(Matrix.createRotationMatrix(rotation.x, 0, 4));
        result = result.multiply(Matrix.createRotationMatrix(rotation.y, 1, 4));
        result = result.multiply(Matrix.createRotationMatrix(rotation.z, 2, 4));
        return result;
    }

    static createRotationMatrix(angle, type, size)
    {
        assert(typeof angle === "number" &&
            typeof type === "number" &&
            typeof size === "number" &&
            type >= 0 &&
            type < 3 &&
            size > 2 &&
            size < 5, 
            [angle, type, size], 
            "invalid input");


        if(type === 0)
        {
            let cosX = Math.cos(angleToRadians(angle));
            let sinX = Math.sin(angleToRadians(angle));
            return Matrix.createRotationMatrixX(size, cosX, sinX);
        }
        else if(type === 1)
        {
            let cosY = Math.cos(angleToRadians(angle));
            let sinY = Math.sin(angleToRadians(angle));
            return Matrix.createRotationMatrixY(size, cosY, sinY);
        }
        else if(type === 2)
        {
            let cosZ = Math.cos(angleToRadians(angle));
            let sinZ = Math.sin(angleToRadians(angle));
            return Matrix.createRotationMatrixZ(size, cosZ, sinZ);
        }
    }

    static createRotationMatrixX(size, cos, sin)
    {
        let result =  Matrix.createUnitMatrix(size);
        result.elements[size + 1] = cos;
        result.elements[size + 2] = -sin;
        result.elements[size * 2 + 1] = sin;
        result.elements[size * 2 + 2] = cos;
        return result;
    }

    static createRotationMatrixY(size, cos, sin)
    {
        let result =  Matrix.createUnitMatrix(size);
        result.elements[0] = cos;
        result.elements[size*2] = -sin;
        result.elements[2] = sin;
        result.elements[size*2+2] = cos;
        return result;
    }

    static createRotationMatrixZ(size, cos, sin)
    {
        let result =  Matrix.createUnitMatrix(size);
        result.elements[0] = cos;
        result.elements[1] = -sin;
        result.elements[size] = sin;
        result.elements[size+1] = cos;
        return result;

    }

    static createScaleMatrix(scale)
    {
        assert(scale.length > 0 &&
            scale.length < 4, 
            [scale], 
            "invalid input");
        let size = scale.length+1;
        let m = Matrix.createUnitMatrix(size);
        for (let i = 0; i < scale.length; i++) {
            m.elements[size*i + i] = scale[i];
        }
        return m;
    }

    static createProjectionMatrix(dimensions)
    {
        assert(dimensions.length >= 2 &&
            dimensions.length < 4, 
            [dimensions], 
            "invalid dimensions");
        let size = dimensions.length+1;
        let m = Matrix.createUnitMatrix(size);
        for (let i = 0; i < dimensions.length; i++) {
            m.elements[size * i + i] = 2 / dimensions[i] * (i%2==0 ? 1 : -1);
        }
        m.elements[(size - 1) * size] = -1;
        m.elements[(size - 1) * size + 1] = 1;
        m.elements[size * size -1] = 1;
        return m;
    }

    static createOrthographic(left, right, bottom, top, near, far)
    {
        assert(typeof left === "number"&&
            typeof right === "number"&&
            typeof bottom === "number" &&
            typeof top === "number" &&
            typeof near === "number" &&
            typeof far === "number", 
            [left, right, bottom, top, near, far], 
            "invalid corners, near or far");
        let elements =  [2/(right-left), 0, 0, 0,
                        0, 2/(top-bottom), 0, 0,
                        0, 0, 2 / (near - far), 0,
                        (left + right) / (left - right), 
                        (bottom + top) / (bottom - top), 
                        (near + far) / (near - far),1];
        return new Matrix(elements,4,4);
    }

    static createPerspective(fieldOfView, aspect, near, far)
    {
        assert(typeof fieldOfView === "number"&&
            typeof aspect === "number"&&
            typeof near === "number" &&
            typeof far === "number", 
            [fieldOfView, aspect, near, far], 
            "invalid fieldOfView, aspect, near or far");

        let f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfView);
        let rangeInv = 1.0 / (near - far);
        let i0 = f/aspect;
        let i10 = (near + far)*rangeInv;
        let i14 = near * far * rangeInv * 2;

        //console.table([fieldOfView, aspect, near, far, f, rangeInv, i0, i10, i14]);

        let elements =  [i0, 0, 0, 0,
                        0, f, 0, 0,
                        0, 0, i10, -1,
                        0, 0, i14, 0];
        return new Matrix(elements,4,4);
    }

    static createZToWMatrix(distanceDownsizingFactor)
    {
        assert(typeof distanceDownsizingFactor === "number"&&
            distanceDownsizingFactor >= 0 &&
            distanceDownsizingFactor < 2, 
            [distanceDownsizingFactor], 
            "invalid distanceDownsizingFactor");

        let m = Matrix.createUnitMatrix(4);
        m.elements[4*3 - 1] = distanceDownsizingFactor;
        //console.log(m);
        return m;
    }


    get elementCount()
    {
        return this.elements.length;
    }

    getRow(index)
    {
        assert(typeof index === "number" && 
        index < this.height , 
        [index], 
        "invalid input");

        return this.elements.slice(index*this.width, (index+1)*this.width);
    }

    getColumn(index)
    {
        assert(typeof index === "number" && 
        index < this.width , 
        [index], 
        "invalid input");

        let result = [];
        for(let i = 0; i<this.height; i++)
        {
            result.push(this.elements[i*this.width + index]);
        }
        return result;
    }

    multiply(matrix)
    {
        assert(matrix != undefined &&
            matrix.height === this.width, 
            [matrix], 
            "invalid input");

        let h = matrix.height;
        let w = matrix.width;

        let result = Matrix.createZeroMatrix(w, h);

        // Iterates rows
        for(let i = 0; i<h; i++)
        {
            let r = this.getRow(i);

            //Iterates columns
            for(let j = 0; j<w; j++)
            {
                let c = matrix.getColumn(j);
                let num = 0;
                // Iterates row elements
                for(let k = 0; k < r.length; k++)
                {
                    num += r[k] * c[k];
                }
                result.elements[i*w+j] = num;
                //console.table([r.length, c.length, num]);
            }
        }
        
        return result;
        //console.table([former, matrix.elements, this.elements]);
    }

    add(matrix)
    {
        assert(matrix.height === this.height && 
            matrix.width === this.width, 
            [matrix, this], 
            "invalid input");

        for(let i = 0; i<this.elements.length; i++)
        {
            this.elements[i] = this.elements[i] + matrix.elements[i];
        }
    }

    // Source: https://webglfundamentals.org/webgl/lessons/webgl-3d-camera.html
    inverse()
    {
        let m = this.elements;
        assert(this.width === 4 && this.height === 4, [this], "Invalid matrix size");

        var m00 = m[0 * 4 + 0];
        var m01 = m[0 * 4 + 1];
        var m02 = m[0 * 4 + 2];
        var m03 = m[0 * 4 + 3];
        var m10 = m[1 * 4 + 0];
        var m11 = m[1 * 4 + 1];
        var m12 = m[1 * 4 + 2];
        var m13 = m[1 * 4 + 3];
        var m20 = m[2 * 4 + 0];
        var m21 = m[2 * 4 + 1];
        var m22 = m[2 * 4 + 2];
        var m23 = m[2 * 4 + 3];
        var m30 = m[3 * 4 + 0];
        var m31 = m[3 * 4 + 1];
        var m32 = m[3 * 4 + 2];
        var m33 = m[3 * 4 + 3];
        var tmp_0  = m22 * m33;
        var tmp_1  = m32 * m23;
        var tmp_2  = m12 * m33;
        var tmp_3  = m32 * m13;
        var tmp_4  = m12 * m23;
        var tmp_5  = m22 * m13;
        var tmp_6  = m02 * m33;
        var tmp_7  = m32 * m03;
        var tmp_8  = m02 * m23;
        var tmp_9  = m22 * m03;
        var tmp_10 = m02 * m13;
        var tmp_11 = m12 * m03;
        var tmp_12 = m20 * m31;
        var tmp_13 = m30 * m21;
        var tmp_14 = m10 * m31;
        var tmp_15 = m30 * m11;
        var tmp_16 = m10 * m21;
        var tmp_17 = m20 * m11;
        var tmp_18 = m00 * m31;
        var tmp_19 = m30 * m01;
        var tmp_20 = m00 * m21;
        var tmp_21 = m20 * m01;
        var tmp_22 = m00 * m11;
        var tmp_23 = m10 * m01;

        var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
            (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
        var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
            (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
        var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
            (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
        var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
            (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

        var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

        return new Matrix([
            d * t0,
            d * t1,
            d * t2,
            d * t3,
            d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
                    (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
            d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
                    (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
            d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
                    (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
            d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
                    (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
            d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
                    (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
            d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
                    (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
            d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
                    (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
            d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
                    (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
            d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
                    (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
            d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
                    (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
            d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
                    (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
            d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
                    (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
        ], 4, 4);
    }
}