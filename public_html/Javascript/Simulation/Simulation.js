/* Simulation object keeps track of all game object's state
 * and handles updating them. Has a subclass for factions.
*/

// SIMULATION OBJECT CLASS
function Simulation() {
    this.running = true;
    this.showInterface = true;
    
    var width = Math.floor(window.innerWidth/16);
    var height = Math.floor(window.innerHeight/16);
    
    this.map = new Terrain(width,height);
    this.map.generateMap();
    
    this.factionNum=10;
    this.faction = [];
    for(var i=0; i<this.factionNum; i++) {
        this.faction[i] = new Faction();
    }
    this.faction[0].colour = "#9E8F6E";
    this.faction[0].secondColour = changeSaturation(this.faction[0].colour, 0.5);
    
    this.unitNum=10;
    this.unit = [];
    // the SwarmLord :D
    this.unit[0] = new Unit(window.innerWidth/2,window.innerHeight/2, unitTypes[0], 1);
    this.unit[0].eaten = 50;
    this.unit[0].selected = true;
    
    var x,y,type,faction;
    for(var i=1; i<this.unitNum; i++) {
        x=0,y=0;
        while (this.map.isGround(x,y)===false) {
            x = Math.random()*window.innerWidth;
            y = Math.random()*window.innerHeight;
        }
        
        type = unitTypes[random(unitTypes.length)];
        faction = random(this.factionNum-2)+2;
        this.unit[i] = new Unit(x, y, type, faction);
    }
    this.selectedNum = 1;
    this.totalBiomass = 0;
}
// METHODS
Simulation.prototype.update = function() {
    if (this.running) {
        for(var i=0; i<this.unitNum; i++) {
            var unit = this.unit[i];
                if (unit.isAlive) {
                    unit.update();
                    if (unit.cooldown===0) {
                        var closestFoe = this.findClosestFoe(i);
                        if (closestFoe === -1) {
                            if (unit.eaten < unit.type.store) {
                              // no foes in range, safe to eat;
                                var closestFood = this.findClosestFood(i);
                                if (closestFood !== -1) {
                                    this.eatFood(unit);
                                    this.unit[closestFood].food--;    
                                } else {
                                    closestFood = this.findClosestFlora(unit);
                                    if (closestFood !== -1) {
                                        this.eatFood(unit);    
                                    }
                                } 
                            }
                        } else {
                            //attack!
                            var damage = unit.type.attack - this.unit[closestFoe].type.armour;
                            if (damage<1) damage = 1;
                            this.unit[closestFoe].health -= damage; 
                            unit.cooldown = unit.type.cooldown;
                            this.addEvent(unit,this.unit[closestFoe]);
                        }
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
    this.updateTotals();
};
Simulation.prototype.togglePause = function() {
    if (this.running) {
        this.running=false;
    } else {
        this.running=true;
    }
};

Simulation.prototype.toggleInterface = function() {
    if (this.showInterface) {
        this.showInterface = false;
    } else {
        this.showInterface = true;
    }
};

Simulation.prototype.addEvent = function(a,b) {
    
};

Simulation.prototype.setSelected = function(left,top,right,bottom) {
    this.selectedNum =0;
    for(var i=0; i<this.unitNum; i++) {
       this.unit[i].selected=false;
       var x = this.unit[i].x;
       var y = this.unit[i].y;
       var size = this.unit[i].type.size/2;
       if (x+size > left && x-size < right) {
           if(y+size+5 > top && y-size < bottom) {
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
    if (this.map.isGround(targetX,targetY)) {
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
    }
};

Simulation.prototype.findClosestFoe = function(i) {
    var foundID = -1;
    var dist=0;
    var range = this.unit[i].type.range;
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
    var range = this.unit[i].type.range;
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
    return foundID;
};

Simulation.prototype.findClosestFlora = function(unit) {
    var foundID = -1;
    var checkFlora = this.map.depleteFlora(unit.x,unit.y);
        if (checkFlora) {
           foundID = 1;
        }
    return foundID;
};

Simulation.prototype.eatFood = function(unit) {
    if (unit.health < unit.type.health) {
        unit.health+=1;
        
    } else {
        unit.eaten+=1;
        
        if (unit.eaten >= unit.type.store && unit.type.builder) {
            this.createUnit(unit, -1);
        }
    } 
    unit.cooldown = 3;
};

Simulation.prototype.build = function(type) {
    if (this.unit[0].eaten > unitTypes[type].cost) {
        this.createUnit(this.unit[0], type);
    }
};

// create unit command to inherit parent's position
Simulation.prototype.createUnit = function(parent, selection) {
    var type = parent.type;
    if (selection === -1) {
        
        switch (parent.type.builder) {
            case "all":
                type = unitTypes[random(unitTypes.length)];
                break;
            case "self":
                type = parent.type;   
                break;
        }
    } else {
        type = unitTypes[selection];
    }
    
    parent.eaten -= type.cost;

    
    var x = parent.x;
    var y = parent.y;
    var faction = parent.faction;
    var unit = new Unit(x,y,type,faction);
    
    unit.setRandomCourse();
    unit.action = state.wander;
    if (parent.selected && parent.type.builder==="self") {
        unit.selected = true;
        this.selectedNum++;
    }
    this.unit.push(unit);
    this.unitNum++;  
};

Simulation.prototype.updateTotals = function() {
    this.totalBiomass = 0;
    this.totalUnits = 0;
    for (var f=0; f<this.factionNum; f++) {
        this.faction[f].totalUnits = 0;
    }
    for (var i=0; i<this.unitNum; i++) {
        if (this.unit[i].isAlive) {
            this.faction[this.unit[i].faction].totalUnits++;
            this.totalUnits++;
            this.totalBiomass += this.unit[i].type.cost + this.unit[i].eaten;
        } else {
            this.totalBiomass += this.unit[i].food;
        }
    }
    this.totalBiomass += this.map.totalFlora();
    this.totalBiomass = Math.floor(this.totalBiomass);
    
};

Simulation.prototype.listSelected = function() {
    var total = 0;
    for(var i=0; i<this.unitNum; i++) {
        if (this.unit[i].selected) {
            total++;
        }
    }    
    return total;
};

// FACTION OBJECT CLASS
function Faction() {
    this.colour = randomRGB();
    this.secondColour = changeSaturation(this.colour, 0.5);
    this.totalUnits = 0;
}



