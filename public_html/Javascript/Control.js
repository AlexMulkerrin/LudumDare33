/* Control object deals with player mouse and keyboard input
 * sending events to relevant parts of the program or simulation
*/
// OBJECT CLASS
function Control(canvasName, simulation, audio) {
    this.targetCanvas = document.getElementById(canvasName);
    this.targetSim = simulation;
    this.targetAudio = audio;
    
    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseOver = false;
    this.mouseIsPressed = false;
    this.mouseButton = 0;
    
    this.selection = new SelectBox();   
    var t = this;
    // MOUSE CONTROLS
    this.targetCanvas.onmouseenter = function() {t.mouseOver=true;};
    this.targetCanvas.onmouseleave = function() {t.mouseExits(event);};
    
    this.targetCanvas.onmousemove = function(event) {t.mouseUpdateCoords(event);};
    
    this.targetCanvas.onmousedown = function(event) {t.mousePressed(event);};
    this.targetCanvas.onmouseup = function(event) {t.mouseReleased(event);};
    
    // dummy functions to avoid rightclicking bringing up edit menu
    this.targetCanvas.oncontextmenu= function(event) {return false;};
    this.targetCanvas.onselectstart= function(event) {return false;};
    
    // KEYBOARD CONTROLS using unicode keycodes
    document.onkeydown = function(event) {
        if (event===null) keyCode = window.event.keyCode;
	else keyCode = event.keyCode;
        
        if (keyCode === 110 || keyCode === 78) { // new game
            //t.targetAudio.toggleMute();
            t.targetSim.restart();
            // aaand it doesn't quite work :/
        }
        
        if (keyCode === 104 || keyCode === 72) { // h key hide interface
            t.targetSim.toggleInterface();
        }
        
        if (keyCode === 102 || keyCode === 77) { // m key mute
            t.targetAudio.toggleMute();
        }
        
        if (keyCode === 112 || keyCode === 80) { // p key pause
            t.targetSim.togglePause();
            t.targetAudio.toggleMute();
        }
        if (keyCode === 113 || keyCode === 81) { // q key 'queen'
            t.targetSim.selectCommander();
        }
        if (keyCode === 119 || keyCode === 87) { // w key 'warriors'
            t.targetSim.selectMilitary();
        }
        if (keyCode === 1 || keyCode === 69) { // e key 'everyone'
            t.targetSim.selectAll();
        }
        for (var i=1; i<=buildNum; i++) {
            if (keyCode === (48+i)) { //1-9 keys 
                t.targetSim.build(i);
            }
            if (keyCode === 48) { // 0 key
                t.targetSim.build(10);
            }
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

Control.prototype.mouseExits = function(event) {
    this.mouseOver=false;
    this.mouseReleased();
};

Control.prototype.mousePressed = function(event) {
    this.mouseButton = event.which;
    if (this.mouseButton === 1 && this.mouseY>window.innerHeight-80 && this.targetSim.showInterface) { // left mouse button over menu
        this.checkInterfaceButtons();
    } else {
        if (this.mouseButton === 3 ) { //right mouse button
            this.giveMoveOrder();
        } else {
            this.selection.left = Math.floor(event.layerX);
            this.selection.top = Math.floor(event.layerY);
            this.selection.right= this.selection.left;
            this.selection.bottom = this.selection.top;
            this.mouseIsPressed=true;
        }
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

Control.prototype.checkInterfaceButtons = function() {
  // kludge to check collision on buttons 
  var found = -1;
  for (var i = 1; i<11; i++) { // only first 10 units are bugs...for now :?
        if (this.mouseX > i*78-78) {
            found = i;
        }
    }
    if (this.mouseX> 10*78 ) found =-1;
    if (found !== -1) this.targetSim.build(found);
};


// SELECTION BOX OBJECT CLASS
function SelectBox() {
    this.top=0;
    this.left;
    this.right;
    this.bottom;
}

