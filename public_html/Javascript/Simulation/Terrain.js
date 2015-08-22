/* Object to store the state of the terrain underneath the units. Bodies will
 * end up stored here and there will be vegetation on the surface too.
 * 
 */
// TERRAIN OBJECT CLASS
function Terrain(height,width) {
    this.width = width;
    this.height = height;
    this.tileSize = 16;
    
    this.tile = [];
    for (var i=0; i<this.width; i++) {
            this.tile[i] = [];
        for (var j=0; j<this.height; j++) {
            this.tile[i][j] = new Tile();
        }
    }
}
// METHODS
Terrain.prototype.clearMap = function() {
    for (var i=0; i<this.width; i++) {
        for (var j=0; j<this.height; j++) {
            this.tile[i][j] = new Tile();
        }
    }
    
};
Terrain.prototype.generateMap = function() {
    var repetitions =2;
    this.clearMap();
    for (var i=0; i<this.width; i++) {
        for (var j=0; j<this.height; j++) {
            this.tile[i][j].flora = random(3)+1;
        }
    }
    for (var r=0; r<repetitions; r++) {
        for (var i=0; i<this.width; i++) {
            for (var j=0; j<this.height; j++) {
                this.tile[i][j].neighboursFlora = this.calculateAdjacent(i,j);
            }
        }
        for (var i=0; i<this.width; i++) {
            for (var j=0; j<this.height; j++) {
                var average = Math.floor(this.tile[i][j].neighboursFlora/4);
                if (average > this.tile[i][j].flora) this.tile[i][j].flora++;
                if (average > this.tile[i][j].flora) this.tile[i][j].flora--;
                this.tile[i][j].maxFlora = this.tile[i][j].flora;
            }
        }
    }
    
};

Terrain.prototype.calculateAdjacent = function(x,y) {
    var direction = [[0,0],[0,-1],[-1,0],[1,0],[0,1]];
    var dx,dy;
    var total = 0;
    for (var e=0; e<direction.length; e++) {
        if (x+direction[e][0]>=0 && x+direction[e][0]<this.width) {
            if (y+direction[e][1]>=0 && y+direction[e][1]<this.height) {
                dx = x+direction[e][0];
                dy = y+direction[e][1];
                total += this.tile[dx][dy].flora;
            }
            
        }
    }
    return total;
};

Terrain.prototype.depleteFlora = function(x,y) {
    var tileX= Math.floor(x/this.tileSize);
    var tileY= Math.floor(y/this.tileSize);
    if (tileX>=0 && tileX<this.width) {
            if (tileY>=0 && tileY<this.height) {
            if (this.tile[tileX][tileY].flora>0) {
                this.tile[tileX][tileY].flora--;
            }
        }
    }     
};


// TERRAIN TILE OBJECT CLASS
function Tile() {
    this.flora=0;
    this.maxFlora=0;
    this.bones = false;
    this.neighboursFlora = 0;
}

