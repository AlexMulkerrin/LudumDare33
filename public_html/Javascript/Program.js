/* Contents of this file handle all the general purpose program
 * functions such as loading, running and resetting.
 */
// INITIALISATION
function loadProgram() {
    var program = new Program("Canvas");
   // program.display.update();
    setInterval(function(){ program.update();},program.refreshDelay);
}
// OBJECT CLASS
function Program(canvasName) {
    this.refreshDelay = 50;
    this.running = true;
    
    this.simulation = new Simulation();
    this.control = new Control(canvasName, this.simulation);
    this.display = new Display(canvasName, this.simulation, this.control);
    
    
}
//METHODS
Program.prototype.update = function() {
    this.simulation.update();
    this.display.update();   
};
