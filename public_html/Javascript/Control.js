/* Control object deals with player mouse and keyboard input
 * sending events to relevant parts of the program or simulation
*/
// OBJECT CLASS
function Control(canvasName, simulation) {
    this.targetCanvas = document.getElementById(canvasName);
    this.targetSim = simulation;
    
    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseOver = false;
    this.mouseIsPressed = false;
    this.mouseButton = 0;
    
    this.selection = new SelectBox();   
    var t = this;
    // MOUSE CONTROLS
    this.targetCanvas.onmouseenter = function() {t.mouseOver=true;};
    this.targetCanvas.onmouseleave = function() {t.mouseOver=false;};
    
    this.targetCanvas.onmousemove = function(event) {t.mouseUpdateCoords(event);};
    
    this.targetCanvas.onmousedown = function(event) {t.mousePressed(event);};
    this.targetCanvas.onmouseup = function(event) {t.mouseReleased(event);};
    
    // dummy functions to avoid rightclicking bringing up edit menu
    this.targetCanvas.oncontextmenu= function(event) {return false;};
    this.targetCanvas.onselectstart= function(event) {return false;};
    // KEYBOARD CONTROLS
    document.onkeydown = function(event) {
        var keyCode = window.event.keyCode;
        if (keyCode === 80) { // p key
            t.targetSim.togglePause();
        }
        if (keyCode === 65) { // a key
            t.targetSim.selectAll();
        }
    };
}
// METHODS
// mouse controls
Control.prototype.mouseUpdateCoords = function(event) {
    this.mouseX = event.layerX;
    this.mouseY = event.layerY;
    if (this.mouseIsPressed) {
        this.selection.right = this.mouseX;
        this.selection.bottom = this.mouseY;
    }
};

Control.prototype.mousePressed = function(event) {
    this.mouseButton = event.which;
    if (this.mouseButton === 3 ) { //right mouse button
        this.giveMoveOrder();
    } else {
        this.selection.left = Math.floor(event.layerX);
        this.selection.top = Math.floor(event.layerY);
        this.selection.right= this.selection.left;
        this.selection.bottom = this.selection.top;
        this.mouseIsPressed=true;
    }
};

Control.prototype.mouseReleased = function(event) {
    this.mouseIsPressed=false;
    if (this.mouseButton === 1) { //left mouse button
        this.lassoUnits();
    }
};
// unit commanding
Control.prototype.lassoUnits = function() {
    var left,right,top,bottom;
    if (this.selection.left > this.selection.right) {
        left = this.selection.right;
        right = this.selection.left;
    } else {
        left = this.selection.left;
        right = this.selection.right;
    }
    if (this.selection.top > this.selection.bottom) {
        top = this.selection.bottom;
        bottom = this.selection.top;
    } else {
        top = this.selection.top;
        bottom = this.selection.bottom;
    }
    this.targetSim.setSelected(left,top,right,bottom);
};

Control.prototype.giveMoveOrder = function() {
    this.targetSim.setTarget(this.mouseX,this.mouseY);
};


// SELECTION BOX OBJECT CLASS
function SelectBox() {
    this.top=0;
    this.left;
    this.right;
    this.bottom;
}

