// Helper functions used by commands.


// Draw a progress bar using Unicode.
var drawProgressBar = function(percentage) {
    var leftEdge = '▕';
    var rightEdge = '▏';
    var characters = ['', '▏', '▎', '▍', '▌', '▋', '▊', '▉', '█'];

    // Marker for left edge.
    var bar = leftEdge;

    // Count how many full blocks are required and add them.
    var fullBlocks = Math.floor(percentage / 10);
    for (var i = 0; i < fullBlocks; i++) {
        bar += characters[8];
    }

    // Add the partial segment at the end. The unicode blocks go down to eigths
    // so split the partial block into (10 ÷ 8) pieces, each size 1.25.
    var partial = Math.floor((percentage - (fullBlocks * 10)) / 1.25);
    bar += characters[partial];

    // Add empty spaces where there are no blocks.
    while (bar.length < 11) {
        bar += rightEdge;
    }

    // Add the marker for the right edge.
    bar += rightEdge;

    return bar;
}


var addThousandsSeparators = function(number) {
    var parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}


var randBetween = function(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}


var round = function(number, places) {
    // If no places argument is given, default to 3.
    if (places == null) {
        places = 3;
    }

    // Strangely, adding the rounded number to nothing removes any trailing
    // zeroes.
    var displayValue = + number.toFixed(places);
    return displayValue;
}


var countDecimalPlaces = function(number) {
    var match = ('' + number).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    
    if (!match) {
        return 0;
    }
    
    return Math.max(
       0,
       // Number of digits right of decimal point.
       (match[1] ? match[1].length : 0)
       // Adjust for scientific notation.
       - (match[2] ? +match[2] : 0)
    );
}


module.exports = {
    drawProgressBar: drawProgressBar,
    addThousandsSeparators: addThousandsSeparators,
    randBetween: randBetween,
    round: round,
    countDecimalPlaces: countDecimalPlaces
};
