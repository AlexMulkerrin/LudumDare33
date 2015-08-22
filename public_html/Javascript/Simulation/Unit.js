// UNIT OBJECT CLASS
function Unit(faction) {
    this.isAlive = true;
    this.x = Math.random()*window.innerWidth;
    this.y = Math.random()*window.innerHeight;
    this.vx = 0;//Math.random()*10;//-5;
    this.vy = 0;//Math.random()*10-5;
    this.maxVel = 10;
    this.maxRange = 50;
    this.maxEaten = 10;
    this.maxHealth = 10;
    this.health = 10;
    this.food = 0;
    this.eaten = 0;
    
    this.faction = faction;
    this.selected = false;
    this.action = state.idle;
    this.targX =0;
    this.targY =0;
}
// METHODS
Unit.prototype.update = function() {
    this.movement();
};

Unit.prototype.movement = function() {
    switch (this.action) {
        
        case state.going:
            if (this.isNearTarget()) {
                //this.x=this.targX;
                //this.y=this.targY; so lazy and poorly trained! :P
                this.action = state.wander;
            } else {
                var hop = Math.random();
                this.x+=this.vx*hop;
                this.y+=this.vy*hop;
                //if (this.x<0) this.x=window.innerWidth;
                //if (this.x>window.innerWidth) this.x=0;
                //if (this.y<0) this.y=window.innerHeight;
                //if (this.y>window.innerHeight) this.y=0;
            }
            break;
            
        case state.wander:
            if (this.isNearTarget()) {
                this.x=this.targX;
                this.y=this.targY;
                this.action = state.idle;
            } else {
                this.x+=this.vx/2;
                this.y+=this.vy/2;
                //if (this.x<0) this.x=window.innerWidth;
                //if (this.x>window.innerWidth) this.x=0;
                //if (this.y<0) this.y=window.innerHeight;
                //if (this.y>window.innerHeight) this.y=0;
            }
            break;
        
        case state.idle:
            if (random(20)<1) {
                this.setRandomCourse();
                this.action = state.wander;
            }
            break;
            
        case state.stopped:
            break;
            
    }
}

Unit.prototype.setCourse = function() {
    var dx = this.targX - this.x;
    if (dx === 0) dx = 0.0001;
    var dy = this.targY - this.y;
    var ratio = dy/dx;
    var xComponent = Math.sqrt(Math.pow(this.maxVel,2)/(1+Math.pow(ratio,2)));
    if (dx<0) xComponent*=-1;
    this.vx = xComponent;
    this.vy = ratio*this.vx;
};

Unit.prototype.setRandomCourse = function() {
    this.targX = this.x + random(this.maxVel*8)-this.maxVel*4;
    this.targY = this.y + random(this.maxVel*8)-this.maxVel*4;
    if (this.targX<0) this.targX=0;
    if (this.targX>window.innerWidth) this.targX=window.innerWidth;
    if (this.targY<0) this.targY=0;
    if (this.targY>window.innerHeight) this.targY=window.innerHeight;
    this.setCourse();
};

Unit.prototype.isNearTarget = function() {
    var dx = this.targX - this.x;
    var dy = this.targY - this.y;
    if (dx*dx+dy*dy < this.maxVel*this.maxVel) return true;
    return false;
};

Unit.prototype.die = function() {
    this.isAlive = false;
    //this.x = 0;
    //this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.maxVel = 0;
    this.maxRange = 0;
    this.health = 0;
    this.food = 10;
    
    this.faction = 0;
    this.selected = false;
    this.action = state.stopped;
    this.targX =0;
    this.targY =0;
};


