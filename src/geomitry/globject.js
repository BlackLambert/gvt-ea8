// Copyright: Sebastian Baier (sebastian.baier93@hotmail.de) 2020

class GLObject extends SceneObject
{
    constructor(localPosition, localRotation, localScale, vertices, faces, wireframe)
    {
        super(localPosition, localRotation, localScale);

        assert(vertices.length != undefined && 
            faces.length != undefined && 
            wireframe.length != undefined,
            [vertices, faces, wireframe],
            "Invalid arguments")

        this.vertices = vertices;
        this.faces = faces;
        this.wireframe = wireframe;
        this.setFaceColor(Color.black())
        this.setWireframeColor(Color.black())
    }

    get verticePositions()
    {
        let result = [];
        for(let i = 0; i < this.vertices.length; i++)
        {
            let vP = this.vertices[i].localPosition;
            result.push(vP.x);
            result.push(vP.y);
            result.push(vP.z);
        }
        //console.log(result);
        return result;
    }

    faceIndices(indexOffset)
    {
        return this.faces.reduce((r, f) => r = r.concat(f.getIndices(indexOffset)),[]);
    }

    wireframeIndices(indexOffset)
    {
        return this.wireframe.reduce((r, l) => r = r.concat(l.getIndices(indexOffset)),[]);
    }

    get faceColorValues()
    {
        return this.faceColors.reduce((r, c) => r = r.concat(c.toArray()),[]);
    }

    get wireframeColorValues()
    {
        return this.wireframeColors.reduce((r, c) => r = r.concat(c.toArray()), []);
    }

    get faceNormals()
    {
        //console.log(this.faces[0].getFaceNormals());
        return this.faces.reduce((r, f) => r = r.concat(f.getFaceNormals()), []);
    }

    get vertexNormals()
    {
        //return this.faces.reduce((r, f) =>  r = r.concat(f.getVertexNormals()), []);
        return this.vertices.reduce((r, v) =>  r = r.concat(v.normal.elements), []);
    }

    setFaceColor(color)
    {
        this.faceColors = this.createColorsArrayOf(color);
    }

    setSingleFaceColor(index, color)
    {
        this.faceColors[index] = color;
    }

    setWireframeColor(color)
    {
        this.wireframeColors = this.createColorsArrayOf(color);
    }

    setSingleWireframeColor(index, color)
    {
        this.wireframeColors[index] = color;
    }

    createColorsArrayOf(color)
    {
        let colors = [];
        for(let i = 0; i < this.vertices.length; i++)
        {
            colors.push(color);
        }
        return colors;
    }

    removeDoubleLines()
    {
        let lines = [];
        let iDs = [];
        this.wireframe.forEach(line => {
            let iD = [line.vertices[0].index, line.vertices[1].index];
            let reverseID = [line.vertices[1].index, line.vertices[0].index];
            let containsIDs = iDs.some(o => o[0] === iD[0] && o[1] === iD[1] || o[0] === reverseID[0] && o[1] === reverseID[1]);
            if(!containsIDs)
            {
                lines.push(line);
                iDs.push(iD);
                iDs.push(reverseID);
            }
        });
        this.wireframe = lines;
        //console.log(this.wireframe.length);
    }
}