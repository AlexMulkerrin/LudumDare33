# LudumDare33 - SwarmLord
Ludum Dare Game competition entry

Bug themed RTS where you fight against robots. 

##Credits 
* Alex Mulkerrin Programming
* David Mulkerrin Graphics
* Iain Mulkerrin Sounds
* David Devereux Music

##Codebase map
Source code can be found in the folder 'public_html' with file index.html being the root of the embedded webpage.
All Javscript is contained in one folder split into separate class files for different modules of the program:
* Program.js  Is the function called on page load and handles setting up and launching the game
* Actual game simulation is separated into four files inside 'Simulation' folder
  * Simulation.js Handles initial game creation and inter object communication
  * Terrain.js    Creates the random map and fills in the tiles
  * Unit.js       Is an object class shared by all mobile units and dead units
  * UnitTypes.js  Stores statlines of all the different kinds of units
* Control.js    Handles mouse and keyboard events
* Disply.js     Renders gamestate from simulation object and loads graphics
* SoundSystem.js Loads sounds and handles playing music and sound effects
* Utility.js    Odds and ends which might be used in multiple modules, eg. random integer function

Hope that helps folk trying to understand how the game works :)
