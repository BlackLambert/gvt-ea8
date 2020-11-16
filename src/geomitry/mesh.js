// Copyright: Sebastian Baier (sebastian.baier93@hotmail.de) 2020

class Mesh
{
    constructor(vertices)
    {
        assert(vertices != undefined || 
            vertices.length >= 2 || 
            !vertices.includes(undefined) || 
            vertices[0].index != undefined,
            [vertices],
            "Wrong coloredVertices input");
        
        this.vertices = vertices;
    }

    getIndices(indexOffset)
    {
        return this.vertices.reduce((r, v) => r = r.concat([v.index + indexOffset]), []);
    }

    getVertexNormals()
    {
        return this.vertices.reduce((r, v) => r = r.concat(v.normal.elements), []);
    }
}

class Face extends Mesh
{
    constructor(vertices)
    {
        super(vertices);
        this.normal = this.calculateNormal();
    }

    calculateNormal()
    {
        let v1 = this.vertices[1].localPosition.subtract(this.vertices[0].localPosition);
        let v2 = this.vertices[2].localPosition.subtract(this.vertices[0].localPosition);
        return v1.cross(v2);
    }

    getFaceNormals()
    {
        let result = [];
        this.vertices.forEach(_ => 
            result = result.concat(this.normal.elements)
        );
        return result;
    }
}

class Line extends Mesh
{
    constructor(vertices)
    {
        super(vertices);
    }
}