/* Display object handles all canvas drawing events for
* player and simulation objects
*/
//OBJECT CLASS
function Display(canvasName, simulation, player) {
    this.targetSim = simulation;
    this.targetPlayer = player;
    
    this.canvasName = canvasName;
    this.canvas = document.getElementById(canvasName);
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx = this.canvas.getContext("2d");
    this.red=0;
}
// METHODS
Display.prototype.update = function() {
    this.drawMap();
    this.drawUnits();
    this.drawPlayer();
};
Display.prototype.drawMap = function() {
    this.ctx.fillStyle = RGB(0,0,100);
    this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
};
Display.prototype.drawUnits = function() {
    this.ctx.fillStyle= RGB(255,255,255);
    for(var i=0; i<this.targetSim.unitNum; i++) {
        var x = this.targetSim.unit[i].x;
        var y = this.targetSim.unit[i].y;
        this.ctx.fillRect(x,y,5,5);
    }   
};
Display.prototype.drawPlayer = function() {
    this.ctx.fillStyle= RGB(100,255,100);
    var x = this.targetPlayer.mouseX;
    var y = this.targetPlayer.mouseY;
    this.ctx.fillRect(x-10,y-10,20,20);
}
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
