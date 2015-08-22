/* Simulation object keeps track of all game object's state
 * and handles updating them.
*/

// SIMULATION OBJECT CLASS
function Simulation() {
    this.running = true;
    
    this.map = new Terrain(50,50);
    this.map.generateMap();
    
    this.factionNum=10;
    this.faction = [];
    for(var i=0; i<this.factionNum; i++) {
        this.faction[i] = new Faction();
    }
    this.faction[0].colour = "#9E8F6E";
    this.faction[0].secondColour = changeSaturation(this.faction[0].colour, 0.5);
    
    this.unitNum=100;
    this.unit = [];
    for(var i=0; i<this.unitNum; i++) {
        var faction = random(this.factionNum-1)+1;
        this.unit[i] = new Unit(faction);
    }
    this.selectedNum=0;
}
// METHODS
Simulation.prototype.update = function() {
    if (this.running) {
        for(var i=0; i<this.unitNum; i++) {
            var unit = this.unit[i];
                if (unit.isAlive) {
                unit.update();
                var closestFoe = this.findClosestFoe(i);
                if (closestFoe === -1) { // no foes in range, safe to eat;
                    var closestFood = this.findClosestFood(i);
                    if (closestFood !== -1 ) {
                        if (unit.health < unit.maxHealth) {
                        unit.health++;
                        this.unit[closestFood].food--;
                        } else {
                            unit.eaten++;
                            this.unit[closestFood].food--;
                            if (unit.eaten >= unit.maxEaten) {
                                this.createUnit(unit);
                                unit.eaten = 0;
                            }
                        }
                        
                    } 
                    
                } else {
                    //attack!
                    this.unit[closestFoe].health--;  
                }
            }
        }
        // check for death
        for(var i=0; i<this.unitNum; i++) {
            if (this.unit[i].isAlive && this.unit[i].health<1) {
                this.unit[i].die();
            };
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
    this.selectedNum = 0;
    for(var i=0; i<this.unitNum; i++) {
       this.unit[i].selected=false;
       if (this.unit[i].faction === 1) {
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
           this.unit[i].targX = tx + Math.random()*unitGap-unitGap/2;
           this.unit[i].targY = ty + Math.random()*unitGap-unitGap/2;
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

Simulation.prototype.findClosestFoe = function(i) {
    var foundID = -1;
    var dist=0;
    var range = this.unit[i].maxRange;
    for(var j=0; j<this.unitNum; j++) {
        if (j !== i && this.unit[i].faction !== this.unit[j].faction && this.unit[j].isAlive) {
            var dx = this.unit[i].x - this.unit[j].x;
            var dy = this.unit[i].y - this.unit[j].y;
            if (foundID === -1 && dx*dx+dy*dy < range*range) {
                dist = dx*dx+dy*dy;
                foundID = j;
            } else if (dx*dx+dy*dy < dist) {
                dist = dx*dx+dy*dy;
                foundID = j;
            }  
        }
    }
    return foundID;
};

Simulation.prototype.findClosestFood = function(i) {
    var foundID = -1;
    var dist=0;
    var range = this.unit[i].maxRange;
    for (var j=0; j<this.unitNum; j++) {
        if (j !== i  && this.unit[j].isAlive === false && this.unit[j].food>0) {
            var dx = this.unit[i].x - this.unit[j].x;
            var dy = this.unit[i].y - this.unit[j].y;
            if (foundID === -1 && dx*dx+dy*dy < range*range) {
                dist = dx*dx+dy*dy;
                foundID = j;
            } else if (dx*dx+dy*dy < dist) {
                dist = dx*dx+dy*dy;
                foundID = j;
            }  
        }
    }
    if (foundID === -1) {
        this.map.depleteFlora(this.unit[i].x,this.unit[i].y);
    }
    return foundID;
};

// create unit command to inherit parent's position
Simulation.prototype.createUnit = function(parent) {
    var i=this.unitNum;
    this.unit[i] = new Unit(parent.faction);
    this.unit[i].x = parent.x;
    this.unit[i].y = parent.y;
    this.unit[i].setRandomCourse();
    this.unit[i].action = state.wander;
    this.unit[i].selected = parent.selected;
    this.unitNum++;
    
};

// FACTION OBJECT CLASS
function Faction() {
    this.colour = randomRGB();
    this.secondColour = changeSaturation(this.colour, 0.5);
}



