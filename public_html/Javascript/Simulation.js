/* Simulation object keeps track of all game object's state
 * and handles updating them.
*/
// SIMULATION OBJECT CLASS
function Simulation() {
    this.unitNum=100;
    this.unit = [];
    for(var i=0; i<this.unitNum; i++) {
        this.unit[i] = new Unit();
    }
}
// METHODS
Simulation.prototype.update = function() {
    for(var i=0; i<this.unitNum; i++) {
        this.unit[i].update();
    }
};

// UNIT OBJECT CLASS
function Unit() {
    this.x = Math.random()*window.innerWidth;
    this.y = Math.random()*window.innerHeight;
    this.vx = Math.random()*10;//-5;
    this.vy = 0;//Math.random()*10-5;
}
// METHODS
Unit.prototype.update = function() {
    this.x+=this.vx;
    this.y+=this.vy;
    if (this.x<0) this.x=window.innerWidth;
    if (this.x>window.innerWidth) this.x=0;
    if (this.y<0) this.y=window.innerHeight;
    if (this.y>window.innerHeight) this.y=0;
};

