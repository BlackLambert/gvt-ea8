// Copyright: Sebastian Baier (sebastian.baier93@hotmail.de) 2020

class RecursiveSphere extends GLObject
{
    constructor(radius, recursions, localPosition, localRotation, localScale, vertices, faces, wireframe)
    {
        super(localPosition, localRotation, localScale, vertices, faces, wireframe);
        this.maxRecursion = 5;
        this.minRecursion = 1;
        this.radius = radius;
        this.recursions = recursions;
    }

    static createBasic(radius, recursions, lineColor, faceColor)
    {
        assert(typeof radius === "number" && 
            radius > 0 &&
            typeof recursions === "number" && 
            recursions > 1 && 
            recursions < 20,
            [radius, recursions, lineColor, faceColor],
            "Invalid arguments");
        
        let result = new RecursiveSphere(
            radius, 
            recursions, 
            Vector3.zero(),
            Vector3.zero(), 
            Vector3.one(),
            [],
            [], 
            []);
        result.updateMesh();
        result.setFaceColor(faceColor);
        result.setWireframeColor(lineColor);
        //console.log(result);
        return result;
    }

    updateMesh()
    {
        let sphere = this;
        let rec = Math.ceil(this.recursions);
        let baseObject = Octahedron.createBasic(this.radius*2, this.radius*2, Color.black(), Color.white());
        let result = subdivide(baseObject, 1);
        result.removeDoubleLines();
        sphere.vertices = result.vertices;
        sphere.faces = result.faces;
        sphere.wireframe = result.wireframe;
        sphere.wireframeColors = sphere.wireframeColors.slice(0, sphere.vertices.length);
        sphere.faceColors = sphere.faceColors.slice(0, sphere.vertices.length);


        function subdivide(glObject, currentRecursion)
        {
            //console.log(glObject);
            if(currentRecursion >= rec)
            {
                return glObject;
            }

            let v = glObject.vertices;
            let idToVertex = {};

            // Creates subdivision vertices (one per line)
            glObject.wireframe.forEach(line => {
                let v1 = line.vertices[0];
                let v2 = line.vertices[1];
                let p1 = v1.localPosition;
                let p2 = v2.localPosition;
                let pos = p2.subtract(p1);
                //console.table(pos.elements);
                pos = pos.multiply(0.5);
                //console.table(pos.elements);
                pos = p1.add(pos);
                //console.log(pos.x);

                let vertex = new Vertex(new Vector3(pos.x, pos.y, pos.z), v.length);
                v.push(vertex);
                idToVertex["" + v1.index + "|"  + v2.index] = vertex;
                idToVertex["" + v2.index + "|"  + v1.index] = vertex;

                // Adding missing color values
                if(sphere.wireframeColors.length && sphere.faceColors.length < v.length)
                {
                    let wc1 = sphere.wireframeColors[v1.index];
                    let wc2 = sphere.wireframeColors[v2.index];
                    let wc = wc1.lerp(wc2, 0.5);
                    sphere.wireframeColors.push(wc);

                    let fc1 = sphere.faceColors[v1.index];
                    let fc2 = sphere.faceColors[v2.index];
                    let fc = fc1.lerp(fc2, 0.5);
                    sphere.faceColors.push(fc);
                }
            });

            // Repositions vertices
            v.forEach(vertex => {
                let normalized = vertex.localPosition.normalized();
                vertex.localPosition = normalized.multiply(sphere.radius);
                vertex.normal = normalized;
            });

            // Creates lines and faces
            let triangulation = Triangulation.createEmpty();
            glObject.faces.forEach(face => {
                let v1 = face.vertices[0];
                let v2 = face.vertices[2];
                let v3 = face.vertices[1];
                let v12 = idToVertex["" + v1.index + "|" + v2.index];
                let v23 = idToVertex["" + v2.index + "|"  + v3.index];
                let v31 = idToVertex["" + v3.index + "|"  + v1.index];
                triangulation.combine(Triangulation.triangulateThree([v1,v12,v31]));
                triangulation.combine(Triangulation.triangulateThree([v12,v2,v23]));
                triangulation.combine(Triangulation.triangulateThree([v31,v23,v3]));
                triangulation.combine(Triangulation.triangulateThree([v12,v23,v31]));
            });

            let result = new RecursiveSphere(
                sphere.radius, 
                sphere.recursions, 
                glObject.localPosition, 
                glObject.localRotation, 
                glObject.localScale,
                v,
                [...triangulation.faces], 
                [...triangulation.lines]);
            result.removeDoubleLines();
            return subdivide(result, currentRecursion + 1);
        }
    }
    
    setRecursions(value)
    {
        this.recursions = clamp(value, this.minRecursion, this.maxRecursion);
    }

    get normals()
    {
        return this.vertexNormals;
    }
}