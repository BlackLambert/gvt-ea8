// Copyright: Sebastian Baier (sebastian.baier93@hotmail.de) 2020

class Vector
{
    constructor(elements)
    {
        this.elements = elements;
    }

    add(other)
    {
        //console.log(other);
        assert(this.length === other.length, [this.elements, other.elements], "Invalid length");
        let v = this.copy();
        for (let i = 0; i < v.length; i++) {
            v.elements[i] += other.elements[i];
        }
        return v;
    }

    subtract(other)
    {
        assert(this.length === other.length, [this, other], "Invalid length");
        let inv = other.inverse();
        //console.log(inv);
        let result = this.add(inv);
        return result;
    }

    magnitude()
    {
        let sum = this.elements.reduce((s, c) => s + c * c, 0);
        
        return Math.sqrt(sum);
    }

    multiply(scalar)
    {
        assert(typeof scalar === "number", [this, scalar], "Invalid input");
        let v = this.copy();
        for (let i = 0; i < v.length; i++) {
            v.elements[i] = v.elements[i] * scalar;
        }
        return v;
    }

    get length()
    {
        return this.elements.length;
    }

    inverse()
    {
        let v = this.copy();
        for (let i = 0; i < v.length; i++) {
            v.elements[i] = -v.elements[i];
        }
        return v;
    }

    copy()
    {
        return new Vector([...this.elements]);
    }

    normalized()
    {
        let m = this.magnitude();
        let result = this.multiply(1/m);
        return result;
    }

    dot(other)
    {
        assert(other.length === this.length, [this, other], 
            "The other vector has to be same size as this vector");
        let thisNormalized = this.normalized();
        let otherNormalized = other.normalized();
        let result = 0;
        for (let i = 0; i < thisNormalized.elements.length; i++) {
            result += thisNormalized.elements[i] * otherNormalized.elements[i];
        }
        return result;
    }
}

class Vector3 extends Vector
{
    constructor(x, y, z)
    {
        super([x, y, z]);
    }

    get x()
    {
        return this.elements[0];
    }

    set x(value)
    {
        this.elements[0] = value;
    }

    get y()
    {
        return this.elements[1];
    }

    set y(value)
    {
        this.elements[1] = value;
    }

    get z()
    {
        return this.elements[2];
    }

    set z(value)
    {
        this.elements[2] = value;
    }

    copy()
    {
        return new Vector3(this.x, this.y, this.z);
    }

    cross(other)
    {
        assert(other.length === 3, [other], "The other vector has to be Vector3");
        let x = this.y * other.z - this.z * other.y;
        let y = this.z * other.x - this.x * other.z;
        let z = this.x * other.y - this.y * other.x;
        return (new Vector3(x,y,z)).normalized();
    }

    static zero()
    {
        return new Vector3(0,0,0);
    }

    static one()
    {
        return new Vector3(1,1,1);
    }

    static createByElementArray(elements)
    {
        assert(elements.length === 3, [elements], "Invalid length");
        return new Vector3(elements[0], elements[1],elements[2])
    }
}