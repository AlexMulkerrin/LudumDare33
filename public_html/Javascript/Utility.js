/* General purpose utility functions that don't really belong
 * to a single domain
 * 
 */
function RGB(red,green,blue) {
    var colourString="#";
    if (red<16) colourString += "0";
    colourString += red.toString(16);
    if (green<16) colourString += "0";
    colourString += green.toString(16);
    if (blue<16) colourString += "0";
    colourString += blue.toString(16);
    return colourString;
}

function random(num) {
    return Math.floor(Math.random()*num);
}

function randomRGB() {
    var colourString="#";
    for (var i=0; i<6; i++) {
        var hexDigit = random(16);
        colourString += hexDigit.toString(16);
    }
    return colourString;
}

