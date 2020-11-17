// Copyright: Sebastian Baier (sebastian.baier93@hotmail.de) 2020

class Octahedron extends GLObject
{
    constructor(localPosition, localRotation, localScale, vertices, faces, wireframe)
    {
        super(localPosition, localRotation, localScale, vertices, faces, wireframe);
    }

    static createBasic(height, width, lineColor, faceColor)
    {
        assert(typeof height === "number" && 
            height > 0 &&
            typeof width === "number" && 
            width > 0,
            [height, width, lineColor, faceColor],
            "Invalid height or width");
        
        let v = [];
        let hh = height/2;
        let hw = width/2;
        v.push(new Vertex(new Vector3(0, -hh, 0), 0));
        v.push(new Vertex(new Vector3(-hw, 0, 0), 1));
        v.push(new Vertex(new Vector3(0, 0, hw), 2));
        v.push(new Vertex(new Vector3(hw, 0, 0), 3));
        v.push(new Vertex(new Vector3(0, 0, -hw), 4));
        v.push(new Vertex(new Vector3(0, hh, 0), 5));

        let triangulation = Triangulation.createEmpty();
        triangulation.combine(Triangulation.triangulateThree([v[0], v[1], v[2]]));
        triangulation.combine(Triangulation.triangulateThree([v[0], v[2], v[3]]));
        triangulation.combine(Triangulation.triangulateThree([v[0], v[3], v[4]]));
        triangulation.combine(Triangulation.triangulateThree([v[0], v[4], v[1]]));
        triangulation.combine(Triangulation.triangulateThree([v[1], v[5], v[2]]));
        triangulation.combine(Triangulation.triangulateThree([v[2], v[5], v[3]]));
        triangulation.combine(Triangulation.triangulateThree([v[3], v[5], v[4]]));
        triangulation.combine(Triangulation.triangulateThree([v[4], v[5], v[1]]));

        let result = new Octahedron(Vector3.zero(), Vector3.zero(), Vector3.one(), v, triangulation.faces, triangulation.lines);
        result.removeDoubleLines();
        result.setFaceColor(faceColor);
        result.setWireframeColor(lineColor);
        return result;
    }

    get normals()
    {
        return this.vertexNormals;
    }
}