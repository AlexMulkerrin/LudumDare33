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
    
    this.unitSize = 8;
}
// METHODS
Display.prototype.update = function() {
    this.drawMap();
    this.drawUnits();
    this.drawText();
    this.drawControl();
};
Display.prototype.drawMap = function() {
    this.ctx.fillStyle = RGB(82,127,63);
    this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
};
Display.prototype.drawUnits = function() {
    var size = this.unitSize;
    this.ctx.fillStyle= "#0000ff";
    for(var i=0; i<this.targetSim.unitNum; i++) {
        var x = this.targetSim.unit[i].x;
        var y = this.targetSim.unit[i].y;
        if (this.targetSim.unit[i].selected) {
            this.ctx.fillStyle= "#ffffff";
            this.ctx.fillRect(x-1,y-1,size+2,size+2);
        } 
        var faction = this.targetSim.unit[i].faction;
        var colour = this.targetSim.faction[faction].colour;
        this.ctx.fillStyle= colour;
        
        this.ctx.fillRect(x,y,size,size);
    }   
};

Display.prototype.drawText = function() {
    if (!this.targetSim.running) {
        this.ctx.fillStyle="#ffffff";
	this.ctx.fillText("(P) aused",5,12);
    }
} 

Display.prototype.drawControl = function() {
    if (this.targetPlayer.mouseOver) {
        this.ctx.fillStyle= RGB(100,255,100);
        var x = this.targetPlayer.mouseX;
        var y = this.targetPlayer.mouseY;
        this.ctx.fillRect(x-5,y,11,1);
        this.ctx.fillRect(x,y-5,1,11);
    }
    // draw selection box
    if (this.targetPlayer.mouseIsPressed) {
        var left = this.targetPlayer.selection.left;
        var top = this.targetPlayer.selection.top;
        var right = this.targetPlayer.selection.right;
        var bottom = this.targetPlayer.selection.bottom;
        this.ctx.fillStyle= RGB(255,255,255);
        this.ctx.beginPath(); 
        this.ctx.lineWidth="1";
        this.ctx.strokeStyle="white"; // Green path
        this.ctx.moveTo(left,top);
        this.ctx.lineTo(right,top);
        this.ctx.lineTo(right,bottom);
        this.ctx.lineTo(left,bottom);
        this.ctx.lineTo(left,top);
        this.ctx.stroke(); // Draw it
    }
}

