// Display object handles all canvas drawing events
//OBJECT CLASS
function Display(canvasName, simulation) {
    this.targetSim = simulation;
    this.canvasName = canvasName;
    this.canvas = document.getElementById(canvasName);
    this.ctx = this.canvas.getContext("2d");
    this.red=0;
}
// METHODS
Display.prototype.update = function() {
    this.repaintMap();
};

Display.prototype.repaintMap = function() {
    var colour = RGB(this.red,100,100);
    this.ctx.fillStyle=colour;
    this.ctx.fillRect(0,0,100,100);
    //this.red+=5;
    //if (this.red>200) this.red=0;
};
// UTILITY FUNCTIONS
function RGB(red,green,blue) {
    var colourString="#";
    if (red<16) colourString += "0";
    colourString += red.toString(16);
    if (green<16) colourString += "0";
    colourString += green.toString(16);
    if (blue<16) colourString += "0";
    colourString += blue.toString(16);
    return colourString;
}
