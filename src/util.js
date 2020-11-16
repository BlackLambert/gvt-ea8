function assert(condition, involvedObjects, message)
{
    if(condition)
    {
        return;
    }
    else
    {
        console.table(involvedObjects);
        throw new Error(message);
    }
}

// Source: https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html
function resizeCanvas(canvas)
{
    var displayWidth  = canvas.clientWidth;
    var displayHeight = canvas.clientHeight;
   
    // Check if the canvas is not the same size.
    if (canvas.width  != displayWidth ||
        canvas.height != displayHeight) {
   
      // Make the canvas the same size
      canvas.width  = displayWidth;
      canvas.height = displayHeight;
    }
}

function angleToRadians(angle)
{
    return (angle / 180) * Math.PI;
}


function clamp(value, min, max) 
{
    //console.log(value, min, max);
    return Math.min(Math.max(value, min), max);
}