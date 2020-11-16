// Copyright: Sebastian Baier (sebastian.baier93@hotmail.de) 2020

class Triangulation
{
    constructor(faces, lines) 
    {
        this.faces = faces;
        this.lines = lines;
    }

    static createEmpty()
    {
        return new Triangulation([], []);
    }

    combine(triangulation) 
    {
        this.faces = this.faces.concat(triangulation.faces);
        this.lines = this.lines.concat(triangulation.lines);
    }

    // Defines the triangle mesh of three vertices
    // Returns object {wireframe: index array, triangles: index array}
    static triangulateThree(vertices)
    {
        if(vertices === undefined || vertices.length === 0 || vertices.length > 3 || vertices.includes(undefined))
        {
            console.log("Wrong vertices input");
            console.log(vertices);
            return;
        }

        let faceVertices = [];
        faceVertices.push(vertices[0]);
        faceVertices.push(vertices[2]);
        faceVertices.push(vertices[1]);
        let face = new Face(faceVertices);

        let lineVertices = [];
        lineVertices.push(vertices[0]);
        lineVertices.push(vertices[1]);
        lineVertices.push(vertices[1]);
        lineVertices.push(vertices[2]);
        lineVertices.push(vertices[2]);
        lineVertices.push(vertices[0]);
        let line0 = new Line([lineVertices[0], lineVertices[1]]);
        let line1 = new Line([lineVertices[2], lineVertices[3]]);
        let line2 = new Line([lineVertices[4], lineVertices[5]]);

        let faces = [face];
        let lines = [line0, line1, line2];

        return new Triangulation(faces, lines);
    }

    // Defines the triangle meshes of four vertices
    // Returns object {wireframe: index array, triangles: index array}
    static triangulateFour(vertices)
    {
        if(vertices === undefined || vertices.length === 0 || vertices.length > 4 || vertices.includes(undefined))
        {
            console.log("Wrong vertices input");
            console.log(vertices);
            return;
        }

        let result = Triangulation.createEmpty();
        result.combine(Triangulation.triangulateThree([vertices[0],vertices[1],vertices[2]]));
        result.combine(Triangulation.triangulateThree([vertices[0],vertices[2],vertices[3]]));
        return result;
    }
}