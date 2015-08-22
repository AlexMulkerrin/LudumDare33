/* Simulation object keeps track of all game object's state
 * and handles updating them.
*/
var state = { Stopped:0, wander:1, going:2};
// SIMULATION OBJECT CLASS
function Simulation() {
    this.running = true;
    
    this.factionNum=5;
    this.faction = [];
    for(var i=0; i<this.factionNum; i++) {
        this.faction[i] = new Faction();
    }
    
    this.unitNum=40;
    this.unit = [];
    for(var i=0; i<this.unitNum; i++) {
        var faction = 1;//random(this.factionNum);
        this.unit[i] = new Unit(faction);
    }
    this.selectedNum=0;
}
// METHODS
Simulation.prototype.update = function() {
    if (this.running) {
        for(var i=0; i<this.unitNum; i++) {
            this.unit[i].update();
        }
    }
};
Simulation.prototype.togglePause = function() {
    if (this.running) {
        this.running=false;
    } else {
        this.running=true;
    }
};

Simulation.prototype.setSelected = function(left,top,right,bottom) {
    this.selectedNum =0;
    for(var i=0; i<this.unitNum; i++) {
       this.unit[i].selected=false;
       var x = this.unit[i].x;
       var y = this.unit[i].y;
       if (x > left && x < right) {
           if(y > top && y < bottom) {
               if (this.unit[i].faction===1) {
                   this.unit[i].selected=true;
                   this.selectedNum++;
               }
           }
       }
   }
};

Simulation.prototype.selectAll = function() {
    this.selectedNum =0;
    for(var i=0; i<this.unitNum; i++) {
       this.unit[i].selected=false;
       if (this.unit[i].faction===1) {
           this.unit[i].selected=true;
           this.selectedNum++;
       }   
   }
};

Simulation.prototype.setTarget = function(targetX, targetY) {
    // find number of ranks and rows in formation of selected number of units
    var formationDepth = Math.ceil(Math.sqrt(this.selectedNum));
    var depth = 0;
    var unitGap = 20;
    var tx= targetX - (formationDepth*unitGap/2-unitGap/3);
    var ty = targetY - (formationDepth*unitGap/2-unitGap/3);
    for(var i=0; i<this.unitNum; i++) {
        if (this.unit[i].selected) {
           this.unit[i].targX = tx;
           this.unit[i].targY = ty;
           this.unit[i].setCourse();
           this.unit[i].action = state.going;
           
           // update target to send next unit to next position in formation
           tx+=unitGap;
           depth++;
           if (depth >= formationDepth) {
               ty+=unitGap;
               tx-=depth*unitGap;
               depth=0;
           }
               
           
       }
   }
};


// FACTION OBJECT CLASS
function Faction() {
    this.colour = randomRGB();
}

// UNIT OBJECT CLASS
function Unit(faction) {
    this.x = Math.random()*window.innerWidth;
    this.y = Math.random()*window.innerHeight;
    this.vx = 0;//Math.random()*10;//-5;
    this.vy = 0;//Math.random()*10-5;
    this.maxVel = 10;
    this.maxRange = 10;
    
    this.faction = faction;
    this.selected = false;
    this.action = state.wander;
    this.targX =0;
    this.targY =0;
}
// METHODS
Unit.prototype.update = function() {
    if (this.action === state.going) {
        if (this.isNearTarget()) {
            this.x=this.targX;
            this.y=this.targY;
            this.action = state.Stopped;
        } else {
            this.x+=this.vx;
            this.y+=this.vy;
            if (this.x<0) this.x=window.innerWidth;
            if (this.x>window.innerWidth) this.x=0;
            if (this.y<0) this.y=window.innerHeight;
            if (this.y>window.innerHeight) this.y=0;
        }
    }
};

Unit.prototype.setCourse = function() {
    var dx = this.targX - this.x;
    var dy = this.targY - this.y;
    var ratio = dy/dx;
    var xComponent = Math.sqrt(Math.pow(this.maxVel,2)/(1+Math.pow(ratio,2)));
    if (dx<0) xComponent*=-1;
    this.vx = xComponent;
    this.vy = ratio*this.vx;
};

Unit.prototype.isNearTarget = function() {
    var dx = this.targX - this.x;
    var dy = this.targY - this.y;
    if (dx*dx+dy*dy < this.maxVel*this.maxVel) return true;
    return false;
};

