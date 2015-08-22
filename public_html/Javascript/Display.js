/* Display object handles all canvas drawing events for
* player and simulation objects
*/
var palette = ["#A5988C","#DADD7F","#63CD2D","#008E42",]
//OBJECT CLASS
function Display(canvasName, simulation, player) {
    this.targetSim = simulation;
    this.targetPlayer = player;
    
    this.canvasName = canvasName;
    this.canvas = document.getElementById(canvasName);
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx = this.canvas.getContext("2d");
    
    this.sqSize= 16;
    this.unitSize = 16;
}
// METHODS
Display.prototype.update = function() {
    this.drawMap();
    this.drawUnits();
    this.drawText();
    this.drawControl();
};
Display.prototype.drawMap = function() {
    this.ctx.setTransform(1,0,0,1,0,0); // make sure rotations don't mess up positioning
    this.ctx.fillStyle = RGB(82,127,63);
    this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
    var sqSize = this.sqSize;
    for (var i=0; i<this.targetSim.map.width; i++) {
        for (var j=0; j<this.targetSim.map.height; j++) {
            this.ctx.fillStyle = palette[this.targetSim.map.tile[i][j].flora];
            this.ctx.fillRect(i*sqSize,j*sqSize,sqSize,sqSize);

        }
    }
    
};
Display.prototype.drawUnits = function() {
    var size = this.unitSize;
    var colour = "#0000ff", secondColour = "#ff00ff";
    for(var i=0; i<this.targetSim.unitNum; i++) {
        var unit = this.targetSim.unit[i];
        size = unit.size;
        if (unit.selected) {
            this.drawHighlight(unit.x-1,unit.y-1,size+2,"#ffffff");
        }
        if (unit.isAlive === false && unit.food <1 ) {
           colour = "#cfcfcf"; 
           secondColour ="#afafaf";
        } else {
        colour = this.targetSim.faction[unit.faction].colour;
        secondColour = this.targetSim.faction[unit.faction].secondColour;
        }
        this.drawRotated(unit.x+size/2, unit.y+size/2, unit.radians, colour, secondColour, size/2, unit.animationCycle);
        
        this.ctx.fillStyle= "#00ffff";
        this.ctx.fillRect(unit.x,unit.y-5,this.targetSim.unit[i].health,1);
        this.ctx.fillStyle= "#ffff00";
        this.ctx.fillRect(unit.x,unit.y-5,this.targetSim.unit[i].food,1);
        
        
    }   
};

Display.prototype.drawRotated = function(centerX, centerY, radians, colour,secondColour, size, cycle) {
    this.ctx.translate(centerX,centerY);
    this.ctx.rotate(radians);
    this.drawBugRotated(colour,secondColour, size, cycle);
    this.ctx.rotate(-radians);
    this.ctx.translate(-centerX,-centerY);
};

Display.prototype.drawBugRotated = function(colour,secondColour, size, cycle) {
    var tempSize=size;
    this.ctx.fillStyle = secondColour;
    if (cycle>5) tempSize=size*1.2;
    this.ctx.fillRect(-tempSize,0,tempSize*2,2);
    this.ctx.rotate(Math.PI/4);
    this.ctx.fillRect(-tempSize,0,tempSize*7/3,2);
    this.ctx.fillRect(0,-tempSize,2,tempSize*7/3);
    this.ctx.rotate(-Math.PI/4);
    
    
    this.ctx.fillStyle= colour;
    this.ctx.fillRect(-size/3,-size*1.5,2*size/3,size*2.5);
    
    //this.ctx.fillRect(-size,2,size*2,2);
    
    
    
};

Display.prototype.drawBug = function(x,y,size,colour) {
    this.ctx.fillStyle= colour;
    
    this.ctx.fillRect(x+size/3,y,size/3,size);
    this.ctx.fillRect(x,y+2,size,2);
    this.ctx.fillRect(x,y+size/4+2,size,2);
    this.ctx.fillRect(x,y+size/2+2,size,2);
};

Display.prototype.drawHighlight = function(x,y,size,colour) {
    this.ctx.fillStyle = colour;
    
    this.ctx.fillRect(x,y,1,size);
    this.ctx.fillRect(x,y,size,1);
    this.ctx.fillRect(x,y+size,size,1);
    this.ctx.fillRect(x+size,y,1,size);
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

