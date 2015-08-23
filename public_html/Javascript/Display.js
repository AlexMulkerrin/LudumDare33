/* Display object handles all canvas drawing events for
* player cursor and simulation objects.
*/
var palette = ["#A5988C","#DADD7F","#63CD2D","#008E42"];
// DISPLAY OBJECT CLASS
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
    if (this.targetSim.showInterface) {
        this.drawStatusBar();
        this.drawMenuBar();
    }
    this.drawControl();
};
Display.prototype.drawMap = function() {
    this.ctx.setTransform(1,0,0,1,0,0); // make sure rotations don't mess up positioning
    this.ctx.fillStyle = "#E8F6FF";
    this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
    var sqSize = this.sqSize;
    for (var i=0; i<this.targetSim.map.width; i++) {
        for (var j=0; j<this.targetSim.map.height; j++) {
            if (this.targetSim.map.tile[i][j].ground) {
                this.ctx.fillStyle = palette[this.targetSim.map.tile[i][j].flora];
                this.ctx.fillRect(i*sqSize,j*sqSize,sqSize,sqSize);
            }

        }
    }
    
};
Display.prototype.drawUnits = function() {
    var size = this.unitSize;
    var colour = "#0000ff", secondColour = "#ff00ff";
    for(var i=0; i<this.targetSim.unitNum; i++) {
        var unit = this.targetSim.unit[i];
        size = unit.type.size;
        if (unit.isAlive === false && unit.food <1 ) {
           colour = "#cfcfcf"; 
           secondColour ="#afafaf";
        } else {
        colour = this.targetSim.faction[unit.faction].colour;
        secondColour = this.targetSim.faction[unit.faction].secondColour;
        }
        this.drawRotated(unit, colour, secondColour);
        
        if (unit.health < unit.type.health && unit.isAlive) {
            var fraction = unit.health/unit.type.health;
            var sx = Math.floor(unit.x);
            var sy = Math.floor(unit.y);
            this.ctx.fillStyle= "#ff0000";
            this.ctx.fillRect(sx,sy-5,unit.type.size,1);
            this.ctx.fillStyle= "#00ffff";
            this.ctx.fillRect(sx,sy-5,fraction*unit.type.size,1);
        } 
        if (unit.food>0) {
            var fraction = unit.food/unit.type.cost;
            var sx = Math.floor(unit.x);
            var sy = Math.floor(unit.y);
            this.ctx.fillStyle= "#cccccc";
            this.ctx.fillRect(sx,sy-5,unit.type.size,1);
            this.ctx.fillStyle= "#ffff00";
            this.ctx.fillRect(sx,sy-5,fraction*unit.type.size,1);
        }
    
    }   
};

Display.prototype.drawRotated = function(unit, colour, secondColour) {
    this.ctx.translate(unit.x,unit.y);
    this.ctx.rotate(unit.radians);
    this.drawBug(unit, colour, secondColour);
    this.ctx.rotate(-unit.radians);
    this.ctx.translate(-unit.x,-unit.y);
};

Display.prototype.drawBug = function(unit, colour,secondColour) {
    var cycle = unit.animationCycle;
    var size = unit.type.size/2;
    var tempSize=size;
    this.ctx.fillStyle = secondColour;
    if (cycle>5) tempSize=size*1.2;
    //middle legs
    if (unit.type.legPairs===1 || unit.type.legPairs===3) {
        this.ctx.fillRect(-tempSize,0,tempSize*2,2);
    } else if (unit.type.legPairs===4) {
        this.ctx.fillRect(-tempSize,-2,tempSize*2,2);
        this.ctx.fillRect(-tempSize,2,tempSize*2,2);
    }
    
    if (unit.type.legPairs>1) {
        this.ctx.rotate(Math.PI/4);
        //front and back leg pairs
        this.ctx.fillRect(-tempSize,0,tempSize*7/3,2);
        this.ctx.fillRect(0,-tempSize,2,tempSize*7/3);
        this.ctx.rotate(-Math.PI/4);
    }

    this.ctx.fillStyle= colour;
    switch (unit.type.shape) {
        case "wide":
        this.ctx.fillRect(-size/2,-size*1,size,size*2);
        break;
        case "long":
        this.ctx.fillRect(-size/3,-size*1.5,2*size/3,size*2.5);
        break;
        case "square":
        this.ctx.fillRect(-size/2,-size/2,size,size*2);
        break;
        case "rectangle":
        this.ctx.fillRect(-size/3,-size*1.5,2*size/3,size*2.5);
        break;
    }
    
    // select box?
    if (unit.selected) {
        this.drawHighlight(unit.type.size*0.75,"#ffffff");
    }   
};

Display.prototype.drawHighlight = function(size,colour) {
    this.ctx.fillStyle = colour;
    
    this.ctx.fillRect(-size,-size,1,size*2);
    this.ctx.fillRect(-size,-size,size*2,1);
    this.ctx.fillRect(-size,+size,size*2,1);
    this.ctx.fillRect(size,-size,1,size*2);
};

Display.prototype.drawText = function() {
    //var string ="";
    if (!this.targetSim.running) {
        this.ctx.fillStyle="#0040bF";
        this.ctx.fillRect(window.innerWidth/2-70,window.innerHeight/2-50,165,40);
        this.ctx.fillStyle="#ffffff";
        this.ctx.font="bold 30px Arial";
        this.ctx.fillText("PAUSED",window.innerWidth/2-50,window.innerHeight/2-20);
    }
//    this.ctx.fillStyle="#000000";
//    this.ctx.font="16px Arial";
//    string +="Selected: " + this.targetSim.listSelected();
    //this.ctx.fillText(string,5,80);
};

Display.prototype.drawStatusBar = function() {
    var string;
    var bugBoss = this.targetSim.unit[0];
    var health = Math.floor(bugBoss.health);
    var biomass = Math.floor(bugBoss.eaten);
    
    this.ctx.fillStyle="#0040bF";
    this.ctx.fillRect(0,0,window.innerWidth,60);
    
    this.ctx.fillStyle="#ffffff";
    this.ctx.font="bold 20px Arial";
    this.ctx.fillText("SwarmLord",5,24);
    this.ctx.font="20px Arial";
    string = "Health: "+health+"/"+bugBoss.type.health;
    this.ctx.fillText(string,130,24);
    
    string = "Biomass: "+biomass+"/"+bugBoss.type.store;
    this.ctx.fillText(string,130,48);
    
    string = "Bugs: "+this.targetSim.faction[1].totalUnits;
    this.ctx.fillText(string,window.innerWidth-100,24);
    string = "Bots: "+(this.targetSim.totalUnits-this.targetSim.faction[1].totalUnits);
    this.ctx.fillText(string,window.innerWidth-100,48);
    
    var fraction = health/bugBoss.type.health;
    this.ctx.fillStyle= "#ff0000";
    this.ctx.fillRect(280,6,window.innerWidth-400,20);
    this.ctx.fillStyle= "#00ffff";
    this.ctx.fillRect(280,6,fraction*(window.innerWidth-400),20);
    
    fraction = biomass/bugBoss.type.store;
    this.ctx.fillStyle= "#cccccc";
    this.ctx.fillRect(280,32,window.innerWidth-400,20);
    this.ctx.fillStyle= "#ffee00";
    this.ctx.fillRect(280,32,fraction*(window.innerWidth-400),20);
    
    
    
    
};

Display.prototype.drawMenuBar = function() {
    var bottom = window.innerHeight;
    this.ctx.fillStyle="#0040bF";
    this.ctx.fillRect(0,bottom-120,10*78,120);
    
    this.ctx.fillStyle="#ffffff";
    this.ctx.font="20px Arial";
    var string = "Create: ";
    this.ctx.fillText(string,5,bottom-100);
    
    this.ctx.font="16px Arial";
    for (var i=1; i<11; i++) { // only first 10 units are bugs...for now :?
        this.ctx.fillStyle="#D1EDFF";
        this.ctx.fillRect(i*78-74,bottom-95,68,90);
        
        
        
        var dummy = new Unit(i*78-40,bottom-40,unitTypes[i],1);
        dummy.radians=0;
        dummy.animationCycle=0;
        var colour = this.targetSim.faction[1].colour;
        var secondColour = this.targetSim.faction[1].secondColour;
        this.drawRotated(dummy, colour, secondColour);
        
        this.ctx.fillStyle="#0000ff";
        this.ctx.fillText(i+":"+unitTypes[i].name,i*78-74,bottom-80);
        
        if (this.targetSim.unit[0].eaten> unitTypes[i].cost) {
            this.ctx.fillStyle="#ffaa00";
        }
        this.ctx.fillText(+unitTypes[i].cost,i*78-72,bottom-10);
    }    
};
Display.prototype.drawControl = function() {
    if (this.targetPlayer.mouseOver) {
        this.ctx.fillStyle= RGB(255,100,100);
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
};

