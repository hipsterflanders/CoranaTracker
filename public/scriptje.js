var svg = null;

var width = 450
height = 450
margin = 40;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(width, height) / 2 - margin

var path = null;
window.addEventListener('load', (event) => {


    // append the svg object to the div called 'my_dataviz'
    svg = d3.select("#content")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "chart")
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    path = tekenLont(1);
    updateNumbers();
    path.setAttribute("d", updateLont(ratio));
    document.getElementById("bom").appendChild(path);
});

const maxIntensive = 2.220;
var ratio = 1;

async function getNumbers() {

    const response = await fetch('/corona');
    const jsonData = await response.json();

    //document.getElementById("infected").textContent = jsonData.geinfecteerd;

    // Create data
    ratio = jsonData.belintensive/maxIntensive;
    console.log(ratio);
}



function updateNumbers() {
    getNumbers();
    path.setAttribute("d", updateLont(ratio));
    setTimeout(updateNumbers, 1000);
}

function tekenLont(ratio) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "white");
    path.setAttribute("stroke-width", "50");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("d", updateLont(ratio));
    return path;
}

function updateLont(ratio) {
    lengte = Math.round(ratio * 100);
    var dx = 20;
    var dy = -20;
    var x = 620;
    var y = 80;
    var dh = 0;

    var d = "M620 80";
    for (let i = 0; i < lengte; i++) {
        dh += -0.05 + Math.random() * 0.1;
        dy = Math.sin(dh) * 5;
        dx = Math.cos(dh) * 5;
        x += dx;
        y += dy;
        d += " L" + x + " " + y;
    }
    return d;
}