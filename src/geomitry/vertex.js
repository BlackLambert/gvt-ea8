// Copyright: Sebastian Baier (sebastian.baier93@hotmail.de) 2020

class Vertex
{
    constructor(localPosition, index)
    {
        assert(localPosition.length === 3 && 
            localPosition.elements != undefined &&
            typeof index === "number" &&
            index >= 0,
            [localPosition, index], "Invalid arguments")

        this.localPosition = localPosition;
        this.index = index;
        this.normal = Vector3.zero;
    }
}