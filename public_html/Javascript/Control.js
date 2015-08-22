/* Control object deals with player mouse and keyboard input
 * sending events to relevant parts of the program or simulation
*/
// OBJECT CLASS
function Control(canvasName, simulation) {
    this.targetCanvas = document.getElementById(canvasName);
    this.targetSim = simulation;
    
    this.mouseX = 0;
    this.mouseY = 0;
    
    var t = this;
    this.targetCanvas.onmousemove = function(e) {
        t.onMouseMove(e.layerX, e.layerY);
    };   
}
// METHODS
Control.prototype.onMouseMove = function(x,y) {
    this.mouseX = x;
    this.mouseY = y;
}

